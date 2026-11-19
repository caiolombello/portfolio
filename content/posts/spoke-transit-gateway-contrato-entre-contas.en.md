---
title: 'New spoke on Transit Gateway: the contract between the VPC account and the network account'
description: >-
  On a shared Transit Gateway, the spoke's apply finishes with the attachment
  stuck. See how to split acceptance, association, and routes between two
  accounts, in explicit steps and with Terraform.
author: Caio Barbieri
category: AWS networking and governance
tags:
  - AWS
  - Transit Gateway
  - VPC
  - Terraform
  - Multi-account
date: '2026-11-23'
published: true
coverImage: /images/posts/spoke-transit-gateway/capa.webp
---
The production account team creates the `payments-prod` VPC, adds the attachment to the shared Transit Gateway, and runs `apply`. No errors. The attachment, however, stays in `pendingAcceptance`, and no packet gets through. The team looks for the option to associate the attachment with the production route table and can't find it: on a shared TGW, acceptance, association, propagation, and TGW routes are not decisions that account can make.

This post covers the moment a new spoke joins the network. In the [post about the traffic path](/blog/hub-and-spoke-aws-caminho-do-trafego.en), the route tables already existed. In the [post about IPAM](/blog/ipam-multi-account-hierarquia-de-pools.en), the VPC got a block from the pool. What's missing is agreeing on what each account does, in what order, and with what data, without a single `apply` that spans both.

The example is synthetic: accounts, IDs, and addresses are fictitious.

## Who can do what

The network account owns the TGW in `sa-east-1` and shares it with the workload accounts through AWS RAM. The documentation on [shared TGWs](https://docs.aws.amazon.com/vpc/latest/tgw/transit-gateway-share.html#transit-gateway-considerations) splits the roles: the account that receives the TGW creates and describes attachments in its own VPCs, but cannot create, modify, or delete route tables, associations, and propagations. The remaining TGW, attachment, and route table APIs belong to the owner.

| Action | Who does it |
| --- | --- |
| Create the attachment in the spoke VPC | Spoke account |
| Accept the attachment | Network account |
| Associate and propagate in TGW route tables | Network account |
| Routes inside the TGW route tables | Network account |
| Routes for the spoke VPC subnets | Spoke account |
| Return routes in the egress VPC | Network account |
| Delete the attachment | [Either one](https://docs.aws.amazon.com/vpc/latest/tgw/tgw-transit-gateways.html) |

The example TGW has [auto-accept for shared attachments disabled](https://docs.aws.amazon.com/vpc/latest/tgw/create-tgw.html), as well as default association and propagation. The route tables are `rt-prod` and `rt-nonprod`, associated with the spokes, and `rt-return`, associated with the egress VPC attachment, where the spokes propagate. The egress VPC has one NAT per AZ. Compared with the traffic path post, the table names change (`rt-production` and `rt-development` become `rt-prod` and `rt-nonprod`) and so do the addresses: from here on, the example uses the IPAM tree. In `sa-east-1`, prod is `10.0.0.0/14`, nonprod is `10.4.0.0/14`, and shared is `10.8.0.0/14`. `payments-prod` got `10.0.16.0/20` from the prod pool; the block is illustrative, because IPAM picks it.

## What the process has to guarantee

1. **Segmentation preserved.** No spoke lands in the default route table. Each attachment is associated with [a single route table](https://docs.aws.amazon.com/vpc/latest/tgw/tgw-transit-gateways.html), and that choice is what separates the environments, VRF style.
2. **No state shared between accounts.** Each account reads and writes only its own state.
3. **New spoke with no blackhole or return-route PR.** In the traffic path post, each blackhole and each return route covered one CIDR, and the block failed open: a new VPC stayed reachable through the NAT detour until someone added the route. Adding a spoke can't depend on remembering that.
4. **Explicit order.** The process can't assume a single `apply` solves everything.
5. **Safe removal.** Removing a spoke has to follow a known order, not a side effect.

## Three ways to connect the two accounts

**A. Auto-accept and default route tables.** With those [TGW options](https://docs.aws.amazon.com/vpc/latest/tgw/create-tgw.html) on, one `apply` in the spoke account is enough. The price is high: every attachment is associated with and propagates to the same default route table, and segmentation is gone. Acceptance also stops being a review point.

**B. Cross-account `terraform_remote_state`.** The network account reads the attachment ID from the spoke's state, and the spoke reads the acceptance status from the network's state. That creates a circular dependency between states and requires access to the whole snapshot, which often contains sensitive data. The [Terraform documentation](https://developer.hashicorp.com/terraform/language/state/remote-state-data) itself recommends explicitly publishing the data other configurations should consume.

**C. Explicit contract.** The spoke publishes a small output. The network account receives that entry through a PR to a versioned map. The PR is the acceptance.

I went with C. It meets all five requirements without giving either account access to the other's state, and it turns acceptance into a review with a name, a date, and a diff. The cost is accepting that joining the network takes three steps and two teams.

## Part 1: what the network account does once per segment

Before any spoke, the network account prepares each segment. The `rt-prod`, `rt-nonprod`, and `rt-return` tables, and the `0.0.0.0/0` route from `rt-prod` and `rt-nonprod` to the egress attachment, already exist from the traffic path post and don't appear here. The network module takes three variables:

```hcl
variable "transit_gateway_id" {
  type        = string
  description = "Network account TGW, with auto-accept and default tables disabled"
}

variable "tgw_route_table_ids" {
  type        = map(string)
  description = "TGW route table IDs: prod, nonprod, and return"
}

variable "nat_public_rt_ids" {
  type        = set(string)
  description = "Route tables of the NAT public subnets in the egress VPC, one per AZ"
}
```

The `segments.tf` file changes the shape of the block. Instead of one blackhole per VPC, each spoke route table blackholes the whole private space: `10.0.0.0/8`, `172.16.0.0/12`, and `192.168.0.0/16`. This is the pattern from the [AWS single exit point example](https://aws.amazon.com/blogs/networking-and-content-delivery/creating-a-single-internet-exit-point-from-multiple-vpcs-using-aws-transit-gateway/). An allowed destination goes in as a more specific route, which [takes precedence](https://docs.aws.amazon.com/vpc/latest/tgw/how-transit-gateways-work.html#tgw-route-evaluation-overview). In the NAT public subnet, the return route becomes the environment's `/14`, not each VPC's CIDR.

```hcl
locals {
  # IPAM environment blocks in sa-east-1 (previous post).
  env_blocks = {
    prod    = "10.0.0.0/14"
    nonprod = "10.4.0.0/14"
  }

  # The whole private space. Allowed destinations go in as more specific routes.
  private_space = ["10.0.0.0/8", "172.16.0.0/12", "192.168.0.0/16"]

  blackholes = {
    for pair in setproduct(keys(local.env_blocks), local.private_space) :
    "${pair[0]}:${pair[1]}" => { segment = pair[0], destination = pair[1] }
  }

  nat_return = {
    for pair in setproduct(tolist(var.nat_public_rt_ids), values(local.env_blocks)) :
    "${pair[0]}:${pair[1]}" => { route_table_id = pair[0], destination = pair[1] }
  }
}

# Once per segment: spokes cannot reach private addresses through the NAT detour.
resource "aws_ec2_transit_gateway_route" "blackhole" {
  for_each = local.blackholes

  transit_gateway_route_table_id = var.tgw_route_table_ids[each.value.segment]
  destination_cidr_block         = each.value.destination
  blackhole                      = true
}

# Once per segment: the response returns to the TGW through the whole environment block.
resource "aws_route" "nat_return" {
  for_each = local.nat_return

  route_table_id         = each.value.route_table_id
  destination_cidr_block = each.value.destination
  transit_gateway_id     = var.transit_gateway_id
}
```

With that, a new spoke inherits the block and the return route with no extra PR, **as long as its CIDR comes from the segment's pool**. That condition comes back in Part 3. Today `rt-prod` and `rt-nonprod` have the same content. I kept both because each environment's future exceptions may diverge. Note also that `10.0.0.0/8` blocks spoke-to-spoke traffic within the same segment: any private communication needs an explicit route.

## Part 2: the spoke account module

```hcl
terraform {
  required_version = ">= 1.6"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 6.0"
    }
  }
}

provider "aws" {
  region = "sa-east-1"
}

variable "transit_gateway_id" {
  type        = string
  description = "TGW shared by the network account through RAM"
}

variable "ipam_pool_id" {
  type        = string
  description = "IPAM sa-east-1/prod pool, shared by the network account"
}

variable "routes_to_tgw" {
  type        = bool
  default     = false
  description = "Turn on only after the network account accepts and associates the attachment"
}

locals {
  # AZ IDs, not names: sae1-az1 is the same physical zone in every account.
  azs = {
    "sae1-az1" = 0
    "sae1-az2" = 1
  }
}

resource "aws_vpc" "this" {
  ipv4_ipam_pool_id   = var.ipam_pool_id
  ipv4_netmask_length = 20

  tags = {
    Name        = "payments-prod"
    environment = "prod"
  }
}

# One /28 subnet per AZ, only for the attachment.
resource "aws_subnet" "tgw" {
  for_each = local.azs

  vpc_id               = aws_vpc.this.id
  availability_zone_id = each.key
  cidr_block           = cidrsubnet(aws_vpc.this.cidr_block, 8, 240 + each.value)

  tags = {
    Name = "payments-prod-tgw-${each.key}"
  }
}

# Private application subnets, one /24 per AZ.
resource "aws_subnet" "app" {
  for_each = local.azs

  vpc_id               = aws_vpc.this.id
  availability_zone_id = each.key
  cidr_block           = cidrsubnet(aws_vpc.this.cidr_block, 4, each.value)

  tags = {
    Name = "payments-prod-app-${each.key}"
  }
}

resource "aws_route_table" "app" {
  vpc_id = aws_vpc.this.id

  tags = {
    Name = "payments-prod-app"
  }
}

resource "aws_route_table_association" "app" {
  for_each = aws_subnet.app

  subnet_id      = each.value.id
  route_table_id = aws_route_table.app.id
}

resource "aws_ec2_transit_gateway_vpc_attachment" "this" {
  transit_gateway_id = var.transit_gateway_id
  vpc_id             = aws_vpc.this.id
  subnet_ids         = [for s in aws_subnet.tgw : s.id]

  # No transit_gateway_default_route_table_*: on a shared TGW,
  # association and propagation are decided by the network account.

  tags = {
    Name = "payments-prod"
  }
}

data "aws_ec2_transit_gateway_attachment" "this" {
  count = var.routes_to_tgw ? 1 : 0

  transit_gateway_attachment_id = aws_ec2_transit_gateway_vpc_attachment.this.id
}

resource "aws_route" "egress" {
  count = var.routes_to_tgw ? 1 : 0

  route_table_id         = aws_route_table.app.id
  destination_cidr_block = "0.0.0.0/0"
  transit_gateway_id     = var.transit_gateway_id

  lifecycle {
    precondition {
      condition     = data.aws_ec2_transit_gateway_attachment.this[0].state == "available"
      error_message = "The attachment is not available yet. Confirm acceptance in the network account."
    }
  }
}

# The contract: what the network account needs to receive, and nothing else.
output "spoke_contract" {
  value = {
    name          = "payments-prod"
    attachment_id = aws_ec2_transit_gateway_vpc_attachment.this.id
    vpc_cidr      = aws_vpc.this.cidr_block
    segment       = "prod"
  }
}
```

Four decisions deserve an explanation:

- **AZ ID, not AZ name.** Across accounts, `sa-east-1a` can be a different physical zone. The [shared TGW](https://docs.aws.amazon.com/vpc/latest/tgw/transit-gateway-share.html#transit-gateway-considerations) documentation says to compare by AZ ID, such as `sae1-az1`.
- **One dedicated `/28` subnet per AZ.** That's the recommendation in the [TGW best practices](https://docs.aws.amazon.com/vpc/latest/tgw/tgw-best-design-practices.html). And every AZ with an application needs its own: a resource in an AZ without an attachment subnet [can't reach the TGW](https://docs.aws.amazon.com/vpc/latest/tgw/tgw-vpc-attachments.html), even with a route.
- **No `transit_gateway_default_route_table_*`.** The [provider's attachment documentation](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/ec2_transit_gateway_vpc_attachment) says these arguments can't be configured with a TGW shared through RAM.
- **The `0.0.0.0/0` route only on the second `apply`.** It sits behind `routes_to_tgw`, and the precondition reads the attachment state before creating the route. The precondition proves the attachment is `available`, not that the association and propagation exist. Validation checks that.

The `spoke_contract` output is everything the network account receives: name, attachment ID, CIDR, and segment.

## Part 3: acceptance in the network account

The `spokes.tf` file holds the map. Each entry is a copy of the contract, and the PR that adds it is the acceptance.

```hcl
locals {
  # One entry per spoke, copied from the spoke_contract output and reviewed in a PR.
  spokes = {
    "payments-prod" = {
      attachment_id = "tgw-attach-0aaaabbbbccccdddd" # fictitious
      vpc_cidr      = "10.0.16.0/20"
      segment       = "prod"
    }
  }
}

resource "aws_ec2_transit_gateway_vpc_attachment_accepter" "spoke" {
  for_each = local.spokes

  transit_gateway_attachment_id = each.value.attachment_id

  # The resource defaults are true. Association and propagation are explicit below.
  transit_gateway_default_route_table_association = false
  transit_gateway_default_route_table_propagation = false

  tags = {
    Name = each.key
  }

  lifecycle {
    precondition {
      condition     = contains(keys(local.env_blocks), each.value.segment)
      error_message = "Unknown segment: use prod or nonprod."
    }
    precondition {
      condition = cidrsubnet(
        "${cidrhost(each.value.vpc_cidr, 0)}/${split("/", local.env_blocks[each.value.segment])[1]}", 0, 0
      ) == local.env_blocks[each.value.segment]
      error_message = "The spoke CIDR is outside the declared segment block."
    }
  }
}

resource "aws_ec2_transit_gateway_route_table_association" "spoke" {
  for_each = local.spokes

  transit_gateway_attachment_id  = aws_ec2_transit_gateway_vpc_attachment_accepter.spoke[each.key].id
  transit_gateway_route_table_id = var.tgw_route_table_ids[each.value.segment]
}

resource "aws_ec2_transit_gateway_route_table_propagation" "spoke" {
  for_each = local.spokes

  transit_gateway_attachment_id  = aws_ec2_transit_gateway_vpc_attachment_accepter.spoke[each.key].id
  transit_gateway_route_table_id = var.tgw_route_table_ids["return"]
}
```

In the [accepter](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/ec2_transit_gateway_vpc_attachment_accepter), default association and propagation are `true` when omitted. Hence the explicit `false`: the association goes to `rt-<segment>` and the propagation to `rt-return`, in [separate resources](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/ec2_transit_gateway_route_table_association).

In the second precondition, `cidrhost(vpc_cidr, 0)` takes the VPC's first address (`10.0.16.0`), the expression applies the segment's mask (`/14`) to it, and `cidrsubnet(..., 0, 0)` returns the resulting network, `10.0.0.0/14`. If it equals the segment block, the VPC starts inside it. The check looks only at the start of the block, and that's enough: CIDR blocks are aligned, so a block of `/14` or smaller that starts inside the segment ends inside it, and an IPv4 VPC can't be larger than `/16`.

Both preconditions protect the premise of Part 1. A CIDR outside the `/14` has no return route in the NAT subnet: it's the gap at step ② of the traffic path post, and the response follows the default route to the Internet Gateway. A wrong segment associates the spoke with the wrong route table.

## Execution order

[Shared attachments with auto-accept off](https://docs.aws.amazon.com/vpc/latest/tgw/acccept-tgw-attach.html) need acceptance from the owner account. The [documented lifecycle](https://docs.aws.amazon.com/vpc/latest/tgw/tgw-vpc-attachments.html) goes through pending-acceptance, pending, and available, and traffic only flows in available. In the API, the first state shows up as `pendingAcceptance`.

| Step | Account | What changes | Expected state |
| --- | --- | --- | --- |
| 1 | Spoke | VPC, subnets, attachment, contract output | Attachment in `pendingAcceptance`; the provider returns in this state |
| 2 | Network | PR with the map entry; accepter, association, and propagation | Accepter waits for `available`; then association in `rt-prod` and propagation in `rt-return` |
| 3 | Spoke | `routes_to_tgw = true`; `0.0.0.0/0` route to the TGW | Precondition passes; egress traffic allowed |

If someone runs step 3 before step 2, the plan fails on the precondition, with a message that says what's missing. That's better than a route pointing to an attachment that doesn't forward traffic yet.

## Where the contract doesn't protect you

**Identical or overlapping CIDR.** If the spoke's CIDR matches another attached VPC's, the new attachment's routes [are not propagated](https://docs.aws.amazon.com/vpc/latest/tgw/tgw-vpc-attachments.html). Nothing fails on `apply`.

**Removing the map entry deletes the spoke's attachment.** The accepter's delete calls `DeleteTransitGatewayVpcAttachment`, as the [provider code](https://github.com/hashicorp/terraform-provider-aws/blob/main/internal/service/ec2/transitgateway_vpc_attachment_accepter.go) shows. Removal needs an order agreed between the two accounts. The sequence I propose, not yet tested in a real account: the spoke turns off `routes_to_tgw`; the network removes the entry, and the accepter deletes the attachment; finally, the spoke removes the attachment from its own code, so the next `apply` doesn't try to recreate it.

**Either account can delete the attachment.** The [documentation](https://docs.aws.amazon.com/vpc/latest/tgw/tgw-transit-gateways.html) allows both to do it, at any time. The contract organizes the way in, but doesn't prevent a unilateral way out.

**Changing `vpc_id` recreates the attachment.** The ID changes, the contract needs updating, and the association is recreated, as the [provider documentation](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/ec2_transit_gateway_route_table_association) notes.

**Tags are not a contract.** The [provider's official cross-account example](https://github.com/hashicorp/terraform-provider-aws/tree/main/examples/transit-gateway-cross-account-vpc-attachment) marks each side with its own tags (`Side = Creator` and `Side = Accepter`). I found no guarantee in the documentation that the spoke's tags show up in the owner account, so the segment travels in the contract.

**The precondition only checks what was typed.** It doesn't prove the CIDR in the map is the real VPC's. After `apply`, check with [`search-transit-gateway-routes`](https://docs.aws.amazon.com/cli/latest/reference/ec2/search-transit-gateway-routes.html).

**Cost.** The TGW [charges per attachment-hour and per GB processed](https://aws.amazon.com/transit-gateway/pricing/). Every new spoke adds to the bill.

**Out of scope.** IPv6, secondary CIDRs, and inspection aren't covered.

## Validation

**What was run.** Both modules went through `terraform fmt`, `terraform validate`, and `terraform test` with [`mock_provider`](https://developer.hashicorp.com/terraform/language/tests/mocking), on Terraform 1.17.2 and AWS provider 6.73.0, in the version with Portuguese identifiers and comments; this English version renames identifiers and translates comments and messages. On the spoke, the route isn't created on the first `apply`; with `routes_to_tgw = true`, the plan fails with the attachment in `pendingAcceptance` and passes with `available`. On the network side, the plan has the association in `rt-prod`, the propagation in `rt-return`, 6 blackholes (two segments, three private blocks), and 4 return routes (two NAT route tables in the test, two environment blocks). A negative test with segment `nonprod` failed on the CIDR precondition. Mocks don't call AWS: nothing was applied to a real account for this article.

**Read-only commands.** The IDs are fictitious:

```bash
# Spoke account: attachment state
aws ec2 describe-transit-gateway-vpc-attachments --profile prod-readonly --region sa-east-1 \
  --filters "Name=vpc-id,Values=vpc-0123456789abcdef0" \
  --query 'TransitGatewayVpcAttachments[].{id:TransitGatewayAttachmentId,state:State,subnets:SubnetIds}'

# Network account: attachments awaiting acceptance
aws ec2 describe-transit-gateway-attachments --profile network-readonly --region sa-east-1 \
  --filters "Name=state,Values=pendingAcceptance"

# Network account: is the spoke associated with rt-prod?
aws ec2 get-transit-gateway-route-table-associations --profile network-readonly --region sa-east-1 \
  --transit-gateway-route-table-id tgw-rtb-0aaaaaaaaaaaaaaa1

# Network account: did the spoke route reach rt-return?
aws ec2 search-transit-gateway-routes --profile network-readonly --region sa-east-1 \
  --transit-gateway-route-table-id tgw-rtb-0aaaaaaaaaaaaaaa3 \
  --filters "Name=route-search.exact-match,Values=10.0.16.0/20" "Name=type,Values=propagated"
```

If the last query comes back empty after `apply`, suspect CIDR overlap first.

**Negative tests.** The results below are expected, not executed:

| Source | Destination | Expected result |
| --- | --- | --- |
| Nonprod spoke | `payments-prod` address | Dropped by the `rt-nonprod` blackhole |
| `payments-prod` | Public test destination | Connection completes |

To attribute the drop to the blackhole, use the `packets-lost-blackhole` field in TGW Flow Logs, as in the [traffic path post](/blog/hub-and-spoke-aws-caminho-do-trafego.en).

## What I'd take to the next project

- **Write down who does what before the code.** On a shared TGW, the spoke account only creates the attachment on the TGW side.
- **Make acceptance go through review.** The PR with the map entry is the record of who approved it.
- **Publish a small output, not the state.** The contract has four fields.
- **Blackhole the whole private space and return through the environment block.** The new spoke inherits both, if its CIDR comes from the right pool.
- **Make the order executable.** A variable and a precondition are worth more than a paragraph in the README.
- **Agree on removal.** Deleting the map entry deletes the spoke's attachment.
- **Check the real CIDR after `apply`.** The precondition only sees what was typed.

The next posts pick up from here: how the spoke account finds the TGW and the pool it received through RAM without copying IDs by hand, and how to design segmentation with association and propagation once the environments need different exceptions.
