---
title: 'Novo spoke no Transit Gateway: o contrato entre a conta da VPC e a conta de rede'
description: >-
  Em um Transit Gateway compartilhado, o apply do spoke termina com o attachment
  parado. Veja como dividir aceite, associação e rotas entre duas contas, em
  passos explícitos e com Terraform.
author: Caio Barbieri
category: Redes e governança AWS
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
O time da conta de produção cria a VPC `pagamentos-prod`, adiciona o attachment ao Transit Gateway compartilhado e roda o `apply`. Nenhum erro. O attachment, porém, fica em `pendingAcceptance`, e nenhum pacote passa. O time procura a opção de associar o attachment à tabela de produção e não encontra: em um TGW compartilhado, aceite, associação, propagação e rotas do TGW não são decisões que essa conta pode tomar.

Este post trata do momento em que um spoke novo entra na rede. No [post sobre o caminho do tráfego](/blog/hub-and-spoke-aws-caminho-do-trafego.pt), as tabelas já existiam. No [post sobre o IPAM](/blog/ipam-multi-account-hierarquia-de-pools.pt), a VPC recebeu um bloco do pool. Falta combinar o que cada conta faz, em que ordem e com quais dados, sem um `apply` único que atravesse as duas.

O exemplo é sintético: contas, IDs e endereços são fictícios.

## Quem pode fazer o quê

A conta de rede é dona do TGW em `sa-east-1` e o compartilha com as contas de workload pelo AWS RAM. A documentação de [TGW compartilhado](https://docs.aws.amazon.com/vpc/latest/tgw/transit-gateway-share.html#transit-gateway-considerations) separa os papéis: a conta que recebe o TGW cria e descreve attachments nas próprias VPCs, mas não cria, modifica nem apaga tabelas, associações e propagações. As demais APIs do TGW, dos attachments e das tabelas de rotas ficam com a dona.

| Ação | Quem faz |
| --- | --- |
| Criar o attachment na VPC do spoke | Conta do spoke |
| Aceitar o attachment | Conta de rede |
| Associar e propagar em tabelas do TGW | Conta de rede |
| Rotas dentro das tabelas do TGW | Conta de rede |
| Rotas das sub-redes da VPC do spoke | Conta do spoke |
| Rotas de retorno na VPC de saída | Conta de rede |
| Apagar o attachment | [Qualquer uma das duas](https://docs.aws.amazon.com/vpc/latest/tgw/tgw-transit-gateways.html) |

O TGW do exemplo tem o [auto-accept de attachments compartilhados desabilitado](https://docs.aws.amazon.com/vpc/latest/tgw/create-tgw.html), assim como a associação e a propagação padrão. As tabelas são `rt-prod` e `rt-nonprod`, associadas aos spokes, e `rt-retorno`, associada ao attachment da VPC de saída, onde os spokes propagam. A VPC de saída tem um NAT por AZ. Em relação ao post do caminho do tráfego, mudam os nomes das tabelas (`rt-producao` e `rt-desenvolvimento` viram `rt-prod` e `rt-nonprod`) e os endereços: daqui em diante, o exemplo usa a árvore do IPAM. Em `sa-east-1`, prod é `10.0.0.0/14`, nonprod é `10.4.0.0/14` e shared é `10.8.0.0/14`. A `pagamentos-prod` recebeu `10.0.16.0/20` do pool prod; o bloco é ilustrativo, porque quem escolhe é o IPAM.

## O que o processo precisa garantir

1. **Segmentação preservada.** Nenhum spoke cai na tabela padrão. Cada attachment fica associado a [uma única tabela](https://docs.aws.amazon.com/vpc/latest/tgw/tgw-transit-gateways.html), e é essa escolha que separa os ambientes, no estilo de VRFs.
2. **Nenhum state compartilhado entre contas.** Cada conta lê e escreve apenas o próprio state.
3. **Spoke novo sem PR de blackhole nem de retorno.** No post do caminho do tráfego, cada blackhole e cada rota de retorno cobriam um CIDR, e o bloqueio falhava aberto: uma VPC nova ficava alcançável pelo desvio do NAT até alguém incluir a rota. Adicionar um spoke não pode depender de lembrar disso.
4. **Ordem explícita.** O processo não pode supor que um único `apply` resolve tudo.
5. **Remoção segura.** Tirar um spoke tem que seguir uma ordem conhecida, não um efeito colateral.

## Três formas de ligar as duas contas

**A. Auto-accept e tabelas padrão.** Com as [opções do TGW](https://docs.aws.amazon.com/vpc/latest/tgw/create-tgw.html) ligadas, um `apply` na conta do spoke basta. O preço é alto: todo attachment é associado e propaga na mesma tabela padrão, e a segmentação acaba. O aceite também deixa de ser um ponto de revisão.

**B. `terraform_remote_state` cruzado.** A rede lê o ID do attachment no state do spoke, e o spoke lê o estado do aceite no state da rede. Isso cria uma dependência circular entre states e exige acesso ao snapshot inteiro, que costuma conter dados sensíveis. A própria [documentação do Terraform](https://developer.hashicorp.com/terraform/language/state/remote-state-data) recomenda publicar explicitamente os dados que outras configurações devem consumir.

**C. Contrato explícito.** O spoke publica um output pequeno. A conta de rede recebe essa entrada por PR em um mapa versionado. O PR é o aceite.

Fiquei com C. Ela cumpre os cinco requisitos sem dar a nenhuma conta acesso ao state da outra, e transforma o aceite em uma revisão com nome, data e diff. O custo é aceitar que entrar na rede leva três passos e duas equipes.

## Parte 1: o que a conta de rede faz uma vez por segmento

Antes de qualquer spoke, a conta de rede prepara cada segmento. As tabelas `rt-prod`, `rt-nonprod` e `rt-retorno`, e a rota `0.0.0.0/0` de `rt-prod` e `rt-nonprod` para o attachment de saída, já existem desde o post do caminho do tráfego e não aparecem aqui. O módulo da rede recebe três variáveis:

```hcl
variable "transit_gateway_id" {
  type        = string
  description = "TGW da conta de rede, com auto-accept e tabelas padrao desabilitados"
}

variable "tgw_route_table_ids" {
  type        = map(string)
  description = "IDs das tabelas do TGW: prod, nonprod e retorno"
}

variable "rt_publica_nat_ids" {
  type        = set(string)
  description = "Tabelas das sub-redes publicas do NAT na VPC de saida, uma por AZ"
}
```

O arquivo `segmentos.tf` muda a forma do bloqueio. Em vez de um blackhole por VPC, cada tabela de spoke bloqueia todo o espaço privado: `10.0.0.0/8`, `172.16.0.0/12` e `192.168.0.0/16`. É o padrão do [exemplo de saída única da AWS](https://aws.amazon.com/blogs/networking-and-content-delivery/creating-a-single-internet-exit-point-from-multiple-vpcs-using-aws-transit-gateway/). Um destino permitido entra como rota mais específica, que [tem precedência](https://docs.aws.amazon.com/vpc/latest/tgw/how-transit-gateways-work.html#tgw-route-evaluation-overview). Na sub-rede pública do NAT, a rota de retorno passa a ser o `/14` do ambiente, e não o CIDR de cada VPC.

```hcl
locals {
  # Blocos de ambiente do IPAM em sa-east-1 (post anterior).
  resumos = {
    prod    = "10.0.0.0/14"
    nonprod = "10.4.0.0/14"
  }

  # Todo o espaco privado. Destinos permitidos entram como rotas mais especificas.
  espaco_privado = ["10.0.0.0/8", "172.16.0.0/12", "192.168.0.0/16"]

  blackholes = {
    for par in setproduct(keys(local.resumos), local.espaco_privado) :
    "${par[0]}:${par[1]}" => { segmento = par[0], destino = par[1] }
  }

  retorno_nat = {
    for par in setproduct(tolist(var.rt_publica_nat_ids), values(local.resumos)) :
    "${par[0]}:${par[1]}" => { route_table_id = par[0], destino = par[1] }
  }
}

# Uma vez por segmento: spokes nao alcancam enderecos privados pelo desvio do NAT.
resource "aws_ec2_transit_gateway_route" "blackhole" {
  for_each = local.blackholes

  transit_gateway_route_table_id = var.tgw_route_table_ids[each.value.segmento]
  destination_cidr_block         = each.value.destino
  blackhole                      = true
}

# Uma vez por segmento: a resposta volta ao TGW pelo bloco do ambiente inteiro.
resource "aws_route" "retorno_nat" {
  for_each = local.retorno_nat

  route_table_id         = each.value.route_table_id
  destination_cidr_block = each.value.destino
  transit_gateway_id     = var.transit_gateway_id
}
```

Com isso, um spoke novo herda o bloqueio e a rota de retorno sem PR extra, **desde que o CIDR venha do pool do segmento**. Essa condição volta na Parte 3. Hoje `rt-prod` e `rt-nonprod` têm o mesmo conteúdo. Mantive as duas porque as exceções futuras de cada ambiente podem divergir. Note também que o `10.0.0.0/8` bloqueia spoke com spoke dentro do mesmo segmento: qualquer comunicação privada precisa de uma rota explícita.

## Parte 2: o módulo da conta do spoke

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
  description = "TGW compartilhado pela conta de rede via RAM"
}

variable "ipam_pool_id" {
  type        = string
  description = "Pool sa-east-1/prod do IPAM, compartilhado pela conta de rede"
}

variable "rotas_para_tgw" {
  type        = bool
  default     = false
  description = "Ligue somente depois que a conta de rede aceitar e associar o attachment"
}

locals {
  # AZ IDs, e nao nomes: sae1-az1 e a mesma zona fisica em todas as contas.
  azs = {
    "sae1-az1" = 0
    "sae1-az2" = 1
  }
}

resource "aws_vpc" "this" {
  ipv4_ipam_pool_id   = var.ipam_pool_id
  ipv4_netmask_length = 20

  tags = {
    Name     = "pagamentos-prod"
    ambiente = "prod"
  }
}

# Uma sub-rede /28 por AZ, so para o attachment.
resource "aws_subnet" "tgw" {
  for_each = local.azs

  vpc_id               = aws_vpc.this.id
  availability_zone_id = each.key
  cidr_block           = cidrsubnet(aws_vpc.this.cidr_block, 8, 240 + each.value)

  tags = {
    Name = "pagamentos-prod-tgw-${each.key}"
  }
}

# Sub-redes privadas das aplicacoes, uma /24 por AZ.
resource "aws_subnet" "app" {
  for_each = local.azs

  vpc_id               = aws_vpc.this.id
  availability_zone_id = each.key
  cidr_block           = cidrsubnet(aws_vpc.this.cidr_block, 4, each.value)

  tags = {
    Name = "pagamentos-prod-app-${each.key}"
  }
}

resource "aws_route_table" "app" {
  vpc_id = aws_vpc.this.id

  tags = {
    Name = "pagamentos-prod-app"
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

  # Sem transit_gateway_default_route_table_*: em um TGW compartilhado,
  # associacao e propagacao sao decididas pela conta de rede.

  tags = {
    Name = "pagamentos-prod"
  }
}

data "aws_ec2_transit_gateway_attachment" "this" {
  count = var.rotas_para_tgw ? 1 : 0

  transit_gateway_attachment_id = aws_ec2_transit_gateway_vpc_attachment.this.id
}

resource "aws_route" "saida" {
  count = var.rotas_para_tgw ? 1 : 0

  route_table_id         = aws_route_table.app.id
  destination_cidr_block = "0.0.0.0/0"
  transit_gateway_id     = var.transit_gateway_id

  lifecycle {
    precondition {
      condition     = data.aws_ec2_transit_gateway_attachment.this[0].state == "available"
      error_message = "O attachment ainda nao esta available. Confirme o aceite na conta de rede."
    }
  }
}

# O contrato: o que a conta de rede precisa receber, e nada mais.
output "contrato_spoke" {
  value = {
    nome          = "pagamentos-prod"
    attachment_id = aws_ec2_transit_gateway_vpc_attachment.this.id
    vpc_cidr      = aws_vpc.this.cidr_block
    segmento      = "prod"
  }
}
```

Quatro decisões merecem explicação:

- **AZ ID, não nome de AZ.** Entre contas, `sa-east-1a` pode ser uma zona física diferente. A documentação de [TGW compartilhado](https://docs.aws.amazon.com/vpc/latest/tgw/transit-gateway-share.html#transit-gateway-considerations) orienta comparar pelo AZ ID, como `sae1-az1`.
- **Uma sub-rede `/28` dedicada por AZ.** É a recomendação das [boas práticas do TGW](https://docs.aws.amazon.com/vpc/latest/tgw/tgw-best-design-practices.html). E cada AZ com aplicação precisa da sua: um recurso em uma AZ sem sub-rede de attachment [não alcança o TGW](https://docs.aws.amazon.com/vpc/latest/tgw/tgw-vpc-attachments.html), mesmo com rota.
- **Nada de `transit_gateway_default_route_table_*`.** A [documentação do attachment no provider](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/ec2_transit_gateway_vpc_attachment) diz que esses argumentos não são configuráveis com um TGW compartilhado via RAM.
- **A rota `0.0.0.0/0` só no segundo `apply`.** Ela fica atrás de `rotas_para_tgw`, e a precondition lê o estado do attachment antes de criar a rota. A precondition prova que o attachment está `available`, não que a associação e a propagação existem. Isso a validação confere.

O output `contrato_spoke` é tudo o que a conta de rede recebe: nome, ID do attachment, CIDR e segmento.

## Parte 3: o aceite na conta de rede

O arquivo `spokes.tf` guarda o mapa. Cada entrada é a cópia do contrato, e o PR que a adiciona é o aceite.

```hcl
locals {
  # Uma entrada por spoke, copiada do output contrato_spoke e revisada em PR.
  spokes = {
    "pagamentos-prod" = {
      attachment_id = "tgw-attach-0aaaabbbbccccdddd" # ficticio
      vpc_cidr      = "10.0.16.0/20"
      segmento      = "prod"
    }
  }
}

resource "aws_ec2_transit_gateway_vpc_attachment_accepter" "spoke" {
  for_each = local.spokes

  transit_gateway_attachment_id = each.value.attachment_id

  # Os padroes do recurso sao true. A associacao e a propagacao ficam explicitas abaixo.
  transit_gateway_default_route_table_association = false
  transit_gateway_default_route_table_propagation = false

  tags = {
    Name = each.key
  }

  lifecycle {
    precondition {
      condition     = contains(keys(local.resumos), each.value.segmento)
      error_message = "Segmento desconhecido: use prod ou nonprod."
    }
    precondition {
      condition = cidrsubnet(
        "${cidrhost(each.value.vpc_cidr, 0)}/${split("/", local.resumos[each.value.segmento])[1]}", 0, 0
      ) == local.resumos[each.value.segmento]
      error_message = "O CIDR do spoke esta fora do bloco do segmento declarado."
    }
  }
}

resource "aws_ec2_transit_gateway_route_table_association" "spoke" {
  for_each = local.spokes

  transit_gateway_attachment_id  = aws_ec2_transit_gateway_vpc_attachment_accepter.spoke[each.key].id
  transit_gateway_route_table_id = var.tgw_route_table_ids[each.value.segmento]
}

resource "aws_ec2_transit_gateway_route_table_propagation" "spoke" {
  for_each = local.spokes

  transit_gateway_attachment_id  = aws_ec2_transit_gateway_vpc_attachment_accepter.spoke[each.key].id
  transit_gateway_route_table_id = var.tgw_route_table_ids["retorno"]
}
```

No [accepter](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/ec2_transit_gateway_vpc_attachment_accepter), associação e propagação padrão valem `true` quando omitidas. Por isso o `false` explícito: a associação vai para `rt-<segmento>` e a propagação para `rt-retorno`, em [recursos separados](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/ec2_transit_gateway_route_table_association).

Na segunda precondition, `cidrhost(vpc_cidr, 0)` pega o primeiro endereço da VPC (`10.0.16.0`), a expressão aplica a ele a máscara do segmento (`/14`) e `cidrsubnet(..., 0, 0)` devolve a rede resultante, `10.0.0.0/14`. Se ela for igual ao bloco do segmento, a VPC começa dentro dele. A checagem olha só o início do bloco, e isso basta: blocos CIDR são alinhados, então um bloco de `/14` ou menor que começa dentro do segmento termina dentro dele, e uma VPC IPv4 não passa de `/16`.

As duas preconditions protegem a premissa da Parte 1. Um CIDR fora do `/14` não tem rota de retorno na sub-rede do NAT: é a lacuna do passo ② do post do caminho do tráfego, e a resposta segue a default para o Internet Gateway. Um segmento trocado associa o spoke à tabela errada.

## Ordem de execução

[Attachments compartilhados com auto-accept desligado](https://docs.aws.amazon.com/vpc/latest/tgw/acccept-tgw-attach.html) precisam do aceite da conta dona. O [ciclo de vida documentado](https://docs.aws.amazon.com/vpc/latest/tgw/tgw-vpc-attachments.html) passa por pending-acceptance, pending e available, e o tráfego só flui em available. Na API, o primeiro estado aparece como `pendingAcceptance`.

| Passo | Conta | O que muda | Estado esperado |
| --- | --- | --- | --- |
| 1 | Spoke | VPC, sub-redes, attachment, output do contrato | Attachment em `pendingAcceptance`; o provider retorna nesse estado |
| 2 | Rede | PR com a entrada no mapa; accepter, associação e propagação | Accepter espera `available`; depois associação em `rt-prod` e propagação em `rt-retorno` |
| 3 | Spoke | `rotas_para_tgw = true`; rota `0.0.0.0/0` para o TGW | Precondition passa; tráfego de saída liberado |

Se alguém rodar o passo 3 antes do 2, o plano falha na precondition, com uma mensagem que diz o que falta. É melhor do que uma rota apontando para um attachment que ainda não encaminha.

## Onde o contrato não protege

**CIDR idêntico ou sobreposto.** Se o CIDR do spoke coincidir com o de outra VPC anexada, as rotas do novo attachment [não são propagadas](https://docs.aws.amazon.com/vpc/latest/tgw/tgw-vpc-attachments.html). Nada falha no `apply`.

**Remover a entrada do mapa apaga o attachment do spoke.** O delete do accepter chama `DeleteTransitGatewayVpcAttachment`, como mostra o [código do provider](https://github.com/hashicorp/terraform-provider-aws/blob/main/internal/service/ec2/transitgateway_vpc_attachment_accepter.go). A remoção precisa de ordem combinada entre as duas contas. A sequência que proponho, ainda não testada em uma conta real: o spoke desliga `rotas_para_tgw`; a rede remove a entrada, e o accepter apaga o attachment; por fim, o spoke tira o attachment do próprio código, para que o próximo `apply` não tente recriá-lo.

**Qualquer conta pode apagar o attachment.** A [documentação](https://docs.aws.amazon.com/vpc/latest/tgw/tgw-transit-gateways.html) permite isso às duas, a qualquer momento. O contrato organiza a entrada, mas não impede uma saída unilateral.

**Trocar `vpc_id` recria o attachment.** O ID muda, o contrato precisa ser atualizado e a associação é recriada, como avisa a [documentação do provider](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/ec2_transit_gateway_route_table_association).

**Tags não servem de contrato.** O [exemplo oficial cross-account do provider](https://github.com/hashicorp/terraform-provider-aws/tree/main/examples/transit-gateway-cross-account-vpc-attachment) marca cada lado com tags próprias (`Side = Creator` e `Side = Accepter`). Não achei na documentação garantia de que as tags do spoke apareçam na conta dona, então o segmento viaja no contrato.

**A precondition confere só o que foi digitado.** Ela não prova que o CIDR do mapa é o da VPC real. Depois do `apply`, confira com [`search-transit-gateway-routes`](https://docs.aws.amazon.com/cli/latest/reference/ec2/search-transit-gateway-routes.html).

**Custo.** O TGW [cobra por attachment-hora e por GB processado](https://aws.amazon.com/transit-gateway/pricing/). Cada spoke novo entra na conta.

**Fora do escopo.** IPv6, CIDR secundário e inspeção não estão cobertos.

## Validação

**O que foi executado.** Os dois módulos passaram por `terraform fmt`, `terraform validate` e `terraform test` com [`mock_provider`](https://developer.hashicorp.com/terraform/language/tests/mocking), no Terraform 1.17.2 e no provider AWS 6.73.0. No spoke, a rota não é criada no primeiro `apply`; com `rotas_para_tgw = true`, o plano falha com o attachment em `pendingAcceptance` e passa com `available`. Na rede, o plano tem a associação em `rt-prod`, a propagação em `rt-retorno`, 6 blackholes (dois segmentos, três blocos privados) e 4 rotas de retorno (duas tabelas de NAT no teste, dois blocos de ambiente). Um teste negativo com segmento `nonprod` falhou na precondition do CIDR. Mocks não chamam a AWS: nada foi aplicado em conta real para este artigo.

**Comandos só de leitura.** Os IDs são fictícios:

```bash
# Conta do spoke: estado do attachment
aws ec2 describe-transit-gateway-vpc-attachments --profile prod-leitura --region sa-east-1 \
  --filters "Name=vpc-id,Values=vpc-0123456789abcdef0" \
  --query 'TransitGatewayVpcAttachments[].{id:TransitGatewayAttachmentId,estado:State,subredes:SubnetIds}'

# Conta de rede: attachments esperando aceite
aws ec2 describe-transit-gateway-attachments --profile rede-leitura --region sa-east-1 \
  --filters "Name=state,Values=pendingAcceptance"

# Conta de rede: o spoke está associado a rt-prod?
aws ec2 get-transit-gateway-route-table-associations --profile rede-leitura --region sa-east-1 \
  --transit-gateway-route-table-id tgw-rtb-0aaaaaaaaaaaaaaa1

# Conta de rede: a rota do spoke chegou a rt-retorno?
aws ec2 search-transit-gateway-routes --profile rede-leitura --region sa-east-1 \
  --transit-gateway-route-table-id tgw-rtb-0aaaaaaaaaaaaaaa3 \
  --filters "Name=route-search.exact-match,Values=10.0.16.0/20" "Name=type,Values=propagated"
```

Se a última consulta vier vazia depois do `apply`, suspeite primeiro de sobreposição de CIDR.

**Testes negativos.** Os resultados abaixo são esperados, não executados:

| Origem | Destino | Resultado esperado |
| --- | --- | --- |
| Spoke nonprod | Endereço de `pagamentos-prod` | Descarte no blackhole de `rt-nonprod` |
| `pagamentos-prod` | Destino público de teste | Conexão concluída |

Para atribuir o descarte ao blackhole, use o campo `packets-lost-blackhole` dos TGW Flow Logs, como no [post do caminho do tráfego](/blog/hub-and-spoke-aws-caminho-do-trafego.pt).

## O que eu levaria para o próximo projeto

- **Escreva quem faz o quê antes do código.** Em TGW compartilhado, a conta do spoke só cria o attachment do lado do TGW.
- **Faça o aceite passar por revisão.** O PR com a entrada no mapa é o registro de quem aprovou.
- **Publique um output pequeno, não o state.** O contrato tem quatro campos.
- **Bloqueie o espaço privado inteiro e retorne pelo bloco do ambiente.** O spoke novo herda as duas coisas, se o CIDR vier do pool certo.
- **Torne a ordem executável.** Uma variável e uma precondition valem mais que um parágrafo no README.
- **Combine a remoção.** Apagar a entrada do mapa apaga o attachment do spoke.
- **Confira o CIDR real depois do `apply`.** A precondition só vê o que foi digitado.

Os próximos posts continuam daqui: como a conta do spoke encontra o TGW e o pool que recebeu pelo RAM sem copiar IDs à mão, e como desenhar a segmentação com associação e propagação quando os ambientes passam a precisar de exceções diferentes.
