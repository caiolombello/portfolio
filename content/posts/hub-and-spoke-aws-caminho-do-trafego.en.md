---
title: 'Hub and spoke on AWS: the round trip through Transit Gateway'
description: >-
  An available attachment doesn't guarantee the return path. Trace a connection
  through Transit Gateway and egress VPC tables and see how blackholes isolate
  environments.
author: Caio Barbieri
category: AWS networking and governance
tags:
  - AWS
  - Transit Gateway
  - VPC
  - Networking
  - Architecture
date: '2026-10-26'
updatedAt: '2026-10-27'
published: true
coverImage: /images/posts/hub-and-spoke-aws/capa.webp
---
Consider an application in a private production subnet that needs to reach a public API. The VPC is connected to the Transit Gateway, the attachment shows as available, and the network account has a NAT Gateway. Yet the connection ends in a timeout.

To locate the failure, you need to follow the tables that forward the request and the ones that bring back the response. The attachment connects the VPC to the central router. The routes determine what happens to each packet from there.

In a hub-and-spoke architecture, the spokes are the application networks connected to a central point. On AWS, the [Transit Gateway (TGW) acts as a regional router between networks](https://docs.aws.amazon.com/vpc/latest/tgw/how-transit-gateways-work.html). A central VPC can concentrate internet egress while applications remain in their own accounts and VPCs. For this design to work, the TGW routing decisions must complement the decisions inside each VPC.

## Three VPCs and one communication policy

The example uses three VPCs in a single Region, spread across one network account and two application accounts. The names and addresses are fictitious.

| VPC | CIDR | Role |
| --- | --- | --- |
| Production | `10.240.0.0/16` | Applications in private subnets |
| Development | `10.241.0.0/16` | Applications in private subnets |
| Egress | `10.242.0.0/16` | Forwarding to NAT and the internet |

Production and development need to initiate connections to public destinations. Communication between their private addresses must be blocked. Each VPC has an attachment to the same TGW.

In the egress VPC, traffic arrives through the attachment subnet and continues to a public zonal NAT Gateway, placed in a public subnet with a route to an Internet Gateway. The example follows one Availability Zone (AZ) and does not include an inspection firewall.

The intended path is:

```text
Application (10.240.1.10)
  -> TGW: rt-production
  -> egress attachment
  -> NAT Gateway
  -> Internet Gateway
  -> Public API
```

![Example diagram: production and development VPCs attached to the Transit Gateway, with central egress through a NAT Gateway and an Internet Gateway in the egress VPC toward the public API. The request uses rt-production; the response, in four numbered steps, uses the public subnet's more specific route and rt-return. Blackholes separate the environments.](/images/posts/hub-and-spoke-aws/fluxo-rede.en.svg)

*Didactic IPv4 example in one AZ; not a customer environment. On a computer, click the figure to open it at full size; on a phone, pinch to zoom.*

## Which route table does the TGW use?

When a packet enters the TGW, the route table it uses depends on the attachment it arrived on. That choice is defined by **association**: each attachment can be associated with one and only one TGW route table.

**Propagation** has a different job. It installs routes from an attachment into the selected tables. For VPC attachments, [the VPC CIDR blocks can be propagated to one or more tables](https://docs.aws.amazon.com/vpc/latest/tgw/how-transit-gateways-work.html#tgw-routing-overview).

In this example, the relationships are explicit and do not depend on the default associations and propagations:

| Attachment | Associated table | Where the VPC CIDR propagates |
| --- | --- | --- |
| Production | `rt-production` | `rt-return` |
| Development | `rt-development` | `rt-return` |
| Egress | `rt-return` | No table |

A packet arriving from production is routed with `rt-production`. A packet arriving from the egress VPC is routed with `rt-return`. The request and the response therefore cross the same TGW using different tables.

Propagating the spokes into `rt-return` lets the TGW know the private destinations it must return traffic to. It does not create routes in the VPC subnets: that part must be configured separately.

## From the private subnet to the central NAT

The production application has the address `10.240.1.10`. To reach public destinations, its subnet's route table contains:

| Destination | Target |
| --- | --- |
| `10.240.0.0/16` | `local` |
| `0.0.0.0/0` | Transit Gateway |

Traffic within the VPC uses the local route. All other destinations [go to the TGW](https://docs.aws.amazon.com/vpc/latest/userguide/route-table-options.html#route-tables-tgw). In development, the structure is the same, with `10.241.0.0/16` as the local CIDR.

The TGW route tables contain the following routes:

**`rt-production`**

| Destination | Target | Type |
| --- | --- | --- |
| `0.0.0.0/0` | Egress attachment | Static |
| `10.241.0.0/16` | `blackhole` | Static |

**`rt-development`**

| Destination | Target | Type |
| --- | --- | --- |
| `0.0.0.0/0` | Egress attachment | Static |
| `10.240.0.0/16` | `blackhole` | Static |

**`rt-return`**

| Destination | Target | Type |
| --- | --- | --- |
| `10.240.0.0/16` | Production attachment | Propagated |
| `10.241.0.0/16` | Development attachment | Propagated |

[`blackhole` routes](https://docs.aws.amazon.com/vpc/latest/tgw/tgw-create-static-route.html) drop matching traffic. The reason for these blocks comes later. For now, follow the connection to a public address: it matches the default route in `rt-production` and leaves through the egress attachment.

Inside the egress VPC, the packet is routed by the attachment subnet's route table. For the AZ in the example, the tables are:

**Attachment subnet route table**

| Destination | Target |
| --- | --- |
| `10.242.0.0/16` | `local` |
| `0.0.0.0/0` | NAT Gateway in the same AZ |

**NAT public subnet route table**

| Destination | Target |
| --- | --- |
| `10.242.0.0/16` | `local` |
| `10.240.0.0/16` | Transit Gateway |
| `10.241.0.0/16` | Transit Gateway |
| `0.0.0.0/0` | Internet Gateway |

The attachment subnet's table takes the connection to the NAT. The NAT public subnet's table lets it continue to the Internet Gateway and also holds the spokes' return routes. This chain follows the [centralized IPv4 egress pattern documented by AWS](https://docs.aws.amazon.com/whitepapers/latest/building-scalable-secure-multi-vpc-network-infrastructure/using-nat-gateway-for-centralized-egress.html).

At the [public NAT](https://docs.aws.amazon.com/vpc/latest/userguide/vpc-nat-gateway.html), the application's private address is translated to the NAT Gateway's private address, and the Internet Gateway maps it to the associated Elastic IP. The API only sees the Elastic IP. On the response, the translations are reversed.

## The return is a second routing decision

The return path has four steps, also numbered in the figure (①–④). Once the Internet Gateway and the NAT reverse the translations (①), the destination is `10.240.1.10` again. The next hop must carry this packet to the production VPC.

In the NAT public subnet's table (②), the `10.240.0.0/16 -> TGW` route wins over `0.0.0.0/0 -> Internet Gateway` because it is [more specific](https://docs.aws.amazon.com/vpc/latest/userguide/route-tables-priority.html). That route keeps the response on the private path.

The packet re-enters the TGW through the egress attachment. This time the TGW uses `rt-return` (③), where the propagated `10.240.0.0/16` route points to the production attachment. In the production VPC (④), the local route delivers the packet to the application, subject to access controls.

Go back to the timeout from the opening. With either of the two gaps below, the request reaches the API and only the response is lost:

- Without the production route in the NAT public subnet, the response follows the default route to the Internet Gateway at step ②.
- Without the production route in `rt-return`, the TGW has no path to the spoke attachment at step ③.

## The default route can create a detour between environments

The `0.0.0.0/0` route also matches private addresses when there is no more specific route.

Imagine removing the development blackhole from `rt-production` while keeping the other tables. A production packet to `10.241.1.10` then follows the default route, crosses the NAT, and comes back to the TGW, this time through `rt-return`, which knows the development CIDR:

```text
Application (10.240.1.10)
  -> TGW: rt-production, default
  -> egress attachment
  -> NAT: source 10.242.x.x
  -> public subnet: 10.241.0.0/16
  -> TGW: rt-return
  -> Development (10.241.1.10)
```

At the NAT, the source becomes the NAT Gateway's private IP, a `10.242.x.x` address. Development replies to that address, which in `rt-development` matches the default route, not the `10.240.0.0/16` blackhole. The response returns through the NAT and the connection completes. Each spoke table must therefore block the destination on its own: the blackhole on the other side does not stop the detour.

AWS [describes this detour](https://aws.amazon.com/blogs/networking-and-content-delivery/creating-a-single-internet-exit-point-from-multiple-vpcs-using-aws-transit-gateway/) in its centralized egress example: not propagating development into `rt-production` prevents the direct route, but it does not close the path through the NAT. Here, `10.241.0.0/16 -> blackhole` drops the packet before the default route applies; in `rt-development`, the reverse entry does the same for connections that development initiates toward production.

Because each blackhole covers a single CIDR, the block fails open: a new VPC propagated into `rt-return` stays reachable through the detour until someone adds the matching block. The same applies to secondary CIDRs, VPNs, and other connections. The AWS example uses a single route table for all spokes and blackholes the entire private address space (RFC 1918) in it; each allowed destination goes in as a [more specific route](https://docs.aws.amazon.com/vpc/latest/tgw/how-transit-gateways-work.html#tgw-route-evaluation-overview), which takes precedence. This article splits `rt-production` and `rt-development` to keep each decision visible. In practice, separate tables only make sense when the environments need different exceptions.

Routes are not permissions. [Security groups are stateful](https://docs.aws.amazon.com/vpc/latest/userguide/vpc-security-groups.html) and control traffic for associated resources; [network ACLs are stateless](https://docs.aws.amazon.com/vpc/latest/userguide/vpc-network-acls.html) and must allow both directions of the connection in every subnet on the path.

The [Transit Gateway best practices](https://docs.aws.amazon.com/vpc/latest/tgw/tgw-best-design-practices.html) recommend dedicated attachment subnets whose network ACLs stay open inbound and outbound; depending on the traffic flow, network ACLs can be applied to the workload subnets. In the egress VPC, AWS also [mentions the network ACL of the NAT public subnet](https://docs.aws.amazon.com/whitepapers/latest/building-scalable-secure-multi-vpc-network-infrastructure/using-nat-gateway-for-centralized-egress.html#Security-1) to allow or block sources and destinations.

## How to check the path without relying on a timeout

Start with one specific connection: source, destination, protocol, and port. In the example, the application `10.240.1.10` might initiate TCP on port 443 to a public test destination. With that reference, follow the forwarding order:

1. Check the table actually associated with the source subnet and the route selected for the destination.
2. Check the attachment state and the enabled AZs. Under the [VPC attachment requirements](https://docs.aws.amazon.com/vpc/latest/tgw/tgw-vpc-attachments.html), a resource in an AZ without an attachment subnet cannot reach the TGW, even with a route pointing to it.
3. Look up the TGW table associated with the incoming attachment and identify the next attachment or blackhole.
4. Follow the egress VPC tables, from the attachment subnet to the NAT and the Internet Gateway.
5. Repeat the analysis for the return, using the private destination restored by the NAT and the table associated with the egress attachment.
6. Check traffic controls and whether the destination service is available for that connection.

With the AWS CLI, items 1 and 2 run in the spoke account. TGW route tables can only be queried from the [network account that owns the TGW](https://docs.aws.amazon.com/vpc/latest/tgw/transit-gateway-share.html#transit-gateway-considerations). The last command looks up the route `rt-return` selects for `10.240.1.10`, as in item 5:

```bash
# Spoke account: items 1 and 2
aws ec2 describe-route-tables \
  --filters "Name=association.subnet-id,Values=$SUBNET_ID"
# Empty: main route table applies

aws ec2 describe-transit-gateway-vpc-attachments \
  --filters "Name=vpc-id,Values=$VPC_ID"
# Check State and SubnetIds

# Network account: item 5
aws ec2 search-transit-gateway-routes \
  --transit-gateway-route-table-id "$RT_RETURN_ID" \
  --filters "Name=route-search.longest-prefix-match,Values=10.240.1.10/32"
```

A successful egress test says nothing about isolation between environments. Verification of the example must include both the allowed and the prohibited attempts. The results below are expected for the didactic scenario: the example was not provisioned or traffic-tested for this article.

| Source | Destination | Expected result |
| --- | --- | --- |
| Production | Public test destination, HTTPS | Connection completed with a response |
| Development | Public test destination, HTTPS | Connection completed with a response |
| Production | Private development address | Dropped by the expected blackhole |
| Development | Private production address | Dropped by the expected blackhole |

A timeout by itself does not identify where the block occurred. In negative tests, it may result from a missing route, a filter, or destination unavailability. To attribute the result to the blackhole, search the [TGW Flow Logs](https://docs.aws.amazon.com/vpc/latest/tgw/tgw-flow-logs.html#flow-logs-fields) for the same addresses, ports, and time window: `packets-lost-blackhole` above zero means a blackhole drop, and `packets-lost-no-route` above zero means a missing route, as with the `rt-return` gap at step ③. Both fields are part of the default format.

TGW Flow Logs are created by the account that owns the TGW or with its permission. VPC Flow Logs complete the picture with traffic on VPC interfaces. Create the logs before the test: they can take several minutes to start publishing data, and they do not capture traffic in real time.

Reachability Analyzer can help find configuration issues that block a supported path. It [builds a network model without sending packets or analyzing the data plane](https://docs.aws.amazon.com/vpc/latest/reachability/how-reachability-analyzer-works.html), and for TCP that crosses TGW route tables it analyzes only the outbound direction. The return therefore needs a separate check.

## As the network grows, revisit Availability Zones and costs

The path was shown in one AZ to make the tables easier to read. With zonal NAT Gateways, placing applications in multiple zones while keeping a single NAT concentrates the egress dependency. To improve this model's resilience, AWS recommends using [one NAT per AZ with same-zone routing](https://docs.aws.amazon.com/vpc/latest/userguide/nat-gateway-basics.html).

With the TGW, the egress VPC then needs an attachment subnet and a NAT in every AZ the spokes use. Across accounts, match zones by [AZ ID](https://docs.aws.amazon.com/vpc/latest/tgw/transit-gateway-share.html#transit-gateway-considerations), such as `use1-az1`, not by name: `us-east-1a` can map to different physical zones in different accounts.

The zonal model is not the only available option. [Regional NAT Gateways](https://docs.aws.amazon.com/vpc/latest/userguide/nat-gateways-regional.html) automatically expand across the AZs where you have workloads, use their own route table, and don't require a public subnet. The tables presented here belong to the zonal example and must be reviewed if this choice changes.

Centralization also changes where the costs fall. The TGW charges per attachment and per [GB processed](https://aws.amazon.com/transit-gateway/pricing/), counted on the traffic each VPC sends to it and, by default, billed to that VPC's owner: the spoke account on the way out, the network account on the way back. The network account, as the TGW owner, can change this allocation with [metering policies](https://docs.aws.amazon.com/vpc/latest/tgw/metering-policy.html). NAT Gateway data processing comes on top of that. Reducing the number of NATs may lower one portion of the bill, but that count alone does not demonstrate savings: AWS itself notes that, for very large data volumes, [keeping the NAT in the source VPC](https://docs.aws.amazon.com/whitepapers/latest/building-scalable-secure-multi-vpc-network-infrastructure/using-nat-gateway-for-centralized-egress.html) may cost less.

The timeout from the opening sums up the problem: an available attachment and a correct outbound path do not guarantee the return. Check the spoke routes in the NAT public subnet, each spoke's propagation into `rt-return`, and an attachment subnet in every AZ with applications. Then try the paths that should be blocked and confirm in the TGW Flow Logs that the drop happened at the blackhole. Only those negative tests show whether routing enforces the communication policy between the environments.
