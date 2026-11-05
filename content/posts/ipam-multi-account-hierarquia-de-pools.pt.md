---
title: 'IPAM multi-account: substituindo a planilha por uma hierarquia de pools'
description: >-
  Uma planilha de CIDRs não impede duas VPCs de pegarem o mesmo bloco. Organize
  o endereçamento em raiz, região e ambiente no Amazon VPC IPAM, com limites
  de máscara declarados em Terraform.
author: Caio Barbieri
category: Redes e governança AWS
tags:
  - AWS
  - IPAM
  - VPC
  - Redes
  - Terraform
date: '2026-11-09'
published: true
coverImage: /images/posts/ipam-multi-account/capa.webp
---
Uma equipe abre a planilha de endereçamento, encontra uma linha livre e cria a VPC de pagamentos com `10.20.0.0/16`. Na mesma semana, outra equipe, em outra conta, faz o mesmo com uma cópia desatualizada da planilha. As duas VPCs funcionam sozinhas. O problema só aparece quando alguém tenta ligá-las ao Transit Gateway: duas rotas para o mesmo destino, e uma das redes precisa ser renumerada.

No [post anterior da série](/blog/hub-and-spoke-aws-caminho-do-trafego.pt), o roteamento do hub and spoke dependia de cada VPC ter um CIDR único. Este texto trata da etapa anterior: como distribuir esses CIDRs entre contas e regiões sem depender de alguém consultar a versão certa da planilha.

A ferramenta é o [Amazon VPC IP Address Manager (IPAM)](https://docs.aws.amazon.com/vpc/latest/ipam/how-it-works-ipam.html). O exemplo é sintético: a empresa, as contas e os endereços são fictícios. A estrutura reproduz decisões que vi em projetos que acompanhei, reconstruídas para este artigo.

## O que a planilha não garante

A planilha registra uma intenção, mas não participa da criação da VPC. Qualquer pessoa com permissão de `ec2:CreateVpc` pode digitar um CIDR que nunca passou por ela. Para substituí-la, a solução precisa cobrir quatro requisitos:

1. **Reserva atômica.** A escolha do bloco e a criação da VPC devem acontecer na mesma operação, sem uma etapa manual entre elas.
2. **Limites por contexto.** Produção em `sa-east-1` não deve consumir espaço reservado para desenvolvimento em `us-east-1`.
3. **Tamanho controlado.** Ninguém deve pedir um `/12` para uma VPC de teste.
4. **Visibilidade.** Deve ser possível saber quanto espaço resta antes que ele acabe.

As restrições do exemplo são comuns em ambientes multi-account:

| Conta | ID fictício | Papel |
| --- | --- | --- |
| Rede | `111111111111` | Administradora delegada do IPAM, dona dos pools |
| Produção | `222222222222` | Cria VPCs de produção |
| Não produção | `333333333333` | Cria VPCs de desenvolvimento e homologação |

O espaço privado disponível é `10.0.0.0/8`. Há duas regiões em uso, `sa-east-1` e `us-east-1`, e três ambientes: `prod`, `nonprod` e `shared`, este último para serviços comuns, como a VPC de saída do post anterior.

## Três formas de organizar

**Manter a planilha e revisar os pull requests.** É barato e não exige um serviço novo. A revisão, porém, só alcança o que passa pelo repositório. Um CIDR criado pelo console ou por outro pipeline continua invisível.

**Um pool por conta ou por ambiente, sem hierarquia.** O IPAM passa a alocar os blocos, mas cada pool recebe um CIDR solto. Se uma região nova chegar, não haverá um bloco contíguo para ela, e as rotas entre regiões deixam de ser sumarizáveis.

**Uma árvore de pools: raiz, região, ambiente.** Cada nível recebe uma fatia do nível acima. A raiz define o espaço total, a região fixa onde o pool pode ser usado e o ambiente define as regras de máscara. As VPCs alocam apenas das folhas.

A ordem entre região e ambiente é uma escolha, não uma exigência da AWS. Colocar a região acima do ambiente faz cada região ocupar um bloco contíguo, como `10.0.0.0/12`, que pode ser anunciado como uma única rota para outra região. A ordem inversa favorece regras de firewall por ambiente que valem em todas as regiões. Escolhi região primeiro pela sumarização de rotas, que conversa com o roteamento do post anterior. Em qualquer ordem, lembre que o [locale](https://docs.aws.amazon.com/vpc/latest/ipam/create-reg-ipam.html), a propriedade que amarra um pool a uma região, só pode ser definido na criação: depois disso, não pode ser alterado.

## A árvore de pools do exemplo

A raiz `10.0.0.0/8` comporta dezesseis blocos `/12`. Cada região recebe um. Dentro de cada região, cada ambiente recebe um `/14`, e o quarto `/14` fica livre como reserva:

```text
Escopo privado padrão
└── raiz 10.0.0.0/8                     (sem locale)
    ├── sa-east-1 10.0.0.0/12           (locale sa-east-1)
    │   ├── prod     10.0.0.0/14
    │   ├── nonprod  10.4.0.0/14
    │   ├── shared   10.8.0.0/14
    │   └── (reserva 10.12.0.0/14, não provisionada)
    └── us-east-1 10.16.0.0/12          (locale us-east-1)
        ├── prod     10.16.0.0/14
        ├── nonprod  10.20.0.0/14
        ├── shared   10.24.0.0/14
        └── (reserva 10.28.0.0/14, não provisionada)
```

![Diagrama do exemplo: na conta de rede, o escopo privado padrão contém a raiz 10.0.0.0/8 sem locale, dividida nos pools regionais sa-east-1 10.0.0.0/12 e us-east-1 10.16.0.0/12. Cada região tem pools de ambiente /14 para prod, nonprod e shared, além de um /14 reservado e não provisionado. Os pools de ambiente, com máscara mínima /16, máxima /24 e padrão /20, são compartilhados pelo AWS RAM com a OU de workloads. Na conta de produção, a VPC pagamentos-prod pede um /20 ao pool sa-east-1/prod.](/images/posts/ipam-multi-account/hierarquia-pools.svg)

*Exemplo didático; os blocos não representam um ambiente real.*

Três regras da documentação explicam esse formato:

- **A raiz fica sem locale.** O [guia de criação do pool de nível superior](https://docs.aws.amazon.com/vpc/latest/ipam/create-top-ipam.html) orienta escolher *None* na raiz e definir o locale no pool regional.
- **A VPC só aloca de um pool com o mesmo locale da sua região.** Por isso, as folhas precisam carregar a região. No exemplo, declaro o mesmo locale do pool regional também nos pools de ambiente.
- **A profundidade padrão é de até 10 níveis.** A [cota de profundidade](https://docs.aws.amazon.com/vpc/latest/ipam/quotas-ipam.html) é ajustável. Três níveis bastam aqui; limitar a árvore a dois ou três níveis em um módulo interno é uma escolha de simplicidade, não um limite do serviço.

## Regras de máscara: os limites que ficam declarados

As [regras de alocação](https://docs.aws.amazon.com/vpc/latest/ipam/create-top-ipam.html) transformam a política da planilha em atributos do pool. Nos pools de ambiente do exemplo:

| Regra | Valor | Efeito |
| --- | --- | --- |
| Máscara mínima | `/16` | Maior bloco que uma VPC pode receber |
| Máscara máxima | `/24` | Menor bloco que uma VPC pode receber |
| Máscara padrão | `/20` | Tamanho usado quando a alocação não informa outro |

Os nomes confundem: a máscara *mínima* define o *maior* bloco, porque um número menor de bits significa mais endereços. Uma VPC que peça um `/25` nesse pool viola a máscara máxima, e a documentação afirma que a criação falha. Como uma VPC IPv4 [só aceita blocos de `/16` a `/28`](https://docs.aws.amazon.com/vpc/latest/userguide/vpc-cidr-blocks.html), a máscara mínima `/16` coincide com o limite da própria VPC; a regra que restringe de fato, neste exemplo, é a máxima. Recursos já existentes fora da regra são marcados como não conformes.

Dois detalhes evitam surpresas:

- **As regras não são herdadas.** O [guia do pool regional](https://docs.aws.amazon.com/vpc/latest/ipam/create-reg-ipam.html) diz que, se nenhuma regra for aplicada, o pool fica sem regras. Cada nível precisa declarar as suas.
- **As regras valem só para os recursos do próprio pool.** Elas não se aplicam aos pools filhos.

O tamanho padrão também é uma decisão de capacidade. Um `/14` comporta quatro VPCs `/16`, 64 VPCs `/20` ou 1.024 VPCs `/24`. Com padrão `/16`, a quinta VPC de produção em uma região já não teria espaço. Escolhi `/20` como padrão e mantive `/16` como exceção possível.

Há ainda a opção de exigir tags dos recursos que alocam do pool. Ela não entra no exemplo mínimo, mas é útil para impedir que uma VPC sem a tag de produção consuma o pool de produção.

## Implementação mínima em Terraform

O código abaixo roda na conta de rede, na região home do IPAM. Os pools de `us-east-1` também são criados por ela: o locale indica onde o pool pode ser usado, não onde a API é chamada.

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
  region = "sa-east-1" # região home do IPAM
}

locals {
  raiz = "10.0.0.0/8"

  regioes = {
    "sa-east-1" = "10.0.0.0/12"
    "us-east-1" = "10.16.0.0/12"
  }

  # Posição do /14 dentro do /12 de cada região. O índice 3 fica livre.
  ambientes = {
    prod    = 0
    nonprod = 1
    shared  = 2
  }

  pools_ambiente = merge([
    for regiao, cidr in local.regioes : {
      for amb, i in local.ambientes : "${regiao}/${amb}" => {
        regiao   = regiao
        ambiente = amb
        cidr     = cidrsubnet(cidr, 2, i)
      }
    }
  ]...)
}

resource "aws_vpc_ipam" "main" {
  description = "IPAM da organizacao (exemplo)"
  tier        = "advanced"

  dynamic "operating_regions" {
    for_each = keys(local.regioes)
    content {
      region_name = operating_regions.value
    }
  }
}

# Nível 1: raiz, sem locale.
resource "aws_vpc_ipam_pool" "raiz" {
  address_family = "ipv4"
  ipam_scope_id  = aws_vpc_ipam.main.private_default_scope_id
  description    = "raiz"
}

resource "aws_vpc_ipam_pool_cidr" "raiz" {
  ipam_pool_id = aws_vpc_ipam_pool.raiz.id
  cidr         = local.raiz
}

# Nível 2: um pool por região.
resource "aws_vpc_ipam_pool" "regiao" {
  for_each = local.regioes

  address_family      = "ipv4"
  ipam_scope_id       = aws_vpc_ipam.main.private_default_scope_id
  source_ipam_pool_id = aws_vpc_ipam_pool.raiz.id
  locale              = each.key
  description         = "regiao ${each.key}"
}

resource "aws_vpc_ipam_pool_cidr" "regiao" {
  for_each = local.regioes

  ipam_pool_id = aws_vpc_ipam_pool.regiao[each.key].id
  cidr         = each.value

  depends_on = [aws_vpc_ipam_pool_cidr.raiz]
}

# Nível 3: ambiente dentro da região. As VPCs alocam daqui.
resource "aws_vpc_ipam_pool" "ambiente" {
  for_each = local.pools_ambiente

  address_family      = "ipv4"
  ipam_scope_id       = aws_vpc_ipam.main.private_default_scope_id
  source_ipam_pool_id = aws_vpc_ipam_pool.regiao[each.value.regiao].id
  locale              = each.value.regiao
  description         = "${each.value.ambiente} em ${each.value.regiao}"

  allocation_min_netmask_length     = 16
  allocation_max_netmask_length     = 24
  allocation_default_netmask_length = 20

  tags = {
    ambiente = each.value.ambiente
  }
}

resource "aws_vpc_ipam_pool_cidr" "ambiente" {
  for_each = local.pools_ambiente

  ipam_pool_id = aws_vpc_ipam_pool.ambiente[each.key].id
  cidr         = each.value.cidr

  depends_on = [aws_vpc_ipam_pool_cidr.regiao]
}
```

O `depends_on` em cada `aws_vpc_ipam_pool_cidr` não é decorativo. O pool filho referencia o pool pai, mas não o CIDR do pai. Sem a dependência explícita, o Terraform pode tentar provisionar `10.0.0.0/14` antes de `10.0.0.0/12` existir no pool regional, e a [API exige](https://docs.aws.amazon.com/cli/latest/reference/ec2/create-ipam-pool.html) que o CIDR do filho esteja disponível no intervalo do pai.

O `tier = "advanced"` está explícito, embora seja o [padrão do provider](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/vpc_ipam). Prefiro deixar visível uma escolha que afeta a conta, como discuto adiante.

### Compartilhar com as contas de workload

As VPCs ficam em outras contas, então os pools de ambiente precisam ser [compartilhados pelo AWS RAM](https://docs.aws.amazon.com/vpc/latest/ipam/share-pool-ipam.html). O compartilhamento só é possível com o IPAM integrado ao AWS Organizations e deve ser criado na região home do IPAM. O mínimo, ainda na conta de rede:

```hcl
variable "ou_workloads_arn" {
  type        = string
  description = "ARN da OU que pode alocar dos pools de ambiente"

  validation {
    condition     = length(var.ou_workloads_arn) > 0
    error_message = "Sem principal, o compartilhamento existe, mas ninguem consegue usar o pool."
  }
}

resource "aws_ram_resource_share" "pools" {
  name                      = "ipam-pools-ambiente"
  allow_external_principals = false
}

resource "aws_ram_resource_association" "pools" {
  for_each = aws_vpc_ipam_pool.ambiente

  resource_share_arn = aws_ram_resource_share.pools.arn
  resource_arn       = each.value.arn
}

resource "aws_ram_principal_association" "workloads" {
  resource_share_arn = aws_ram_resource_share.pools.arn
  principal          = var.ou_workloads_arn
}
```

A validação existe por um motivo prático. Em um projeto que acompanhei, o compartilhamento e as associações de recursos estavam no código, mas a associação com a organização estava comentada e o principal vinha de uma variável vazia por padrão. Não verifiquei se o valor era informado em outro lugar; o ponto é que o código, sozinho, não garantia o compartilhamento. Sem principal, o RAM aceita o recurso e o `apply` termina sem erro, mas nenhuma conta recebe acesso ao pool. Compartilhar todos os ambientes com uma única OU também é uma simplificação: na prática, produção e não produção costumam ir para OUs diferentes.

Como a outra conta encontra o pool compartilhado é assunto do próximo post. Aqui, o ID chega por variável.

### A VPC consumidora

Na conta de produção, com o provider na mesma região do pool:

```hcl
variable "ipam_pool_id" {
  type        = string
  description = "ID do pool sa-east-1/prod, publicado pela conta de rede"
}

resource "aws_vpc" "pagamentos" {
  ipv4_ipam_pool_id   = var.ipam_pool_id
  ipv4_netmask_length = 20

  tags = {
    Name     = "pagamentos-prod"
    ambiente = "prod"
  }
}

output "cidr_alocado" {
  value = aws_vpc.pagamentos.cidr_block
}
```

A VPC não declara `cidr_block`. Ela pede um `/20` ao pool, e o IPAM escolhe o próximo bloco livre dentro de `10.0.0.0/14`. Declaro a máscara mesmo havendo um padrão no pool, para que o tamanho apareça na revisão do código da conta consumidora.

Os dois módulos passaram por `terraform fmt` e `terraform validate` com o provider AWS 6.72.0. O exemplo não foi aplicado em uma conta real para este artigo.

## Onde o IPAM não protege

**VPCs criadas com CIDR manual.** O IPAM evita sobreposição entre as alocações que ele próprio faz. Uma VPC criada com `cidr_block` digitado não passa pelo pool. A documentação é explícita: se a VPC não usar a opção de CIDR alocado pelo IPAM, [o bloco escolhido pode sobrepor uma alocação](https://docs.aws.amazon.com/vpc/latest/ipam/create-top-ipam.html). Vi um código com o comentário "garante que não há sobreposição" sobre a hierarquia de pools; a garantia só vale para quem aloca dos pools.

O IPAM [monitora sobreposição](https://docs.aws.amazon.com/vpc/latest/ipam/monitor-cidr-compliance-ipam.html) também nos recursos não gerenciados e marca os CIDRs sobrepostos no mesmo escopo. Isso é detecção, depois do fato. Para impedir a criação, a AWS documenta [uma SCP](https://docs.aws.amazon.com/vpc/latest/ipam/scp-ipam.html) que nega `ec2:CreateVpc` e `ec2:AssociateVpcCidrBlock` quando a chave `ec2:Ipv4IpamPoolId` está ausente. Antes de aplicá-la, mapeie quem ainda cria VPCs com CIDR manual: a SCP também bloqueia essas pessoas e pipelines.

**Redes que já existem.** O `auto_import` traz para o pool os CIDRs encontrados no seu intervalo, mas com regras próprias: importa mesmo se o recurso violar as regras, escolhe o maior bloco quando há sobreposição e exige locale no pool. Incorporar redes legadas merece um post próprio, o próximo da série.

**Pool esgotado.** Quando o pool não tem um bloco livre do tamanho pedido, não há o que alocar, e a criação da VPC falha na conta consumidora, no meio do `apply`. Não reproduzi o erro para este artigo, então não cito a mensagem; o importante é que o problema aparece para quem cria a VPC, não para quem administra o pool. O pool de ambiente pode receber outro CIDR do pai, como o `/14` reservado, mas esse bloco não será contíguo ao primeiro. O espaço também não volta na hora: segundo a [documentação do provider](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/vpc_ipam_pool_cidr), alocações criadas por uma VPC podem levar até 30 minutos para serem liberadas.

**Região errada.** Uma VPC em `us-east-1` não aloca de um pool com locale `sa-east-1`. Isso protege a separação, mas transforma um ID de pool trocado em erro de criação.

**Tier e custo.** Na [tabela de recursos do IPAM](https://aws.amazon.com/vpc/pricing/), o Free Tier cobre uma única região e conta e não inclui gerenciamento de IPv4 privado nem compartilhamento de pools. Mesmo com uma única região, o desenho deste post exige o Advanced Tier. Ele é cobrado por endereço IP ativo por hora, e, com o IPAM integrado ao Organizations, a [contagem inclui os IPs monitorados nas contas-membro](https://docs.aws.amazon.com/vpc/latest/ipam/enable-integ-ipam.html). O custo, portanto, depende do número de IPs ativos da organização, não da quantidade de pools. Faça a estimativa com a página de preços antes de habilitar.

**Administração.** A integração com o Organizations exige que a conta administradora do IPAM seja uma conta-membro: a conta de gerenciamento não pode cumprir esse papel.

## Como verificar a árvore sem criar nada

Os comandos abaixo apenas leem estado. Os IDs são fictícios; substitua pelos da sua conta e use um perfil com permissão de leitura.

```bash
# Conta de rede, região home: pools, profundidade e regras
aws ec2 describe-ipam-pools --profile rede-leitura --region sa-east-1 \
  --query 'IpamPools[].{id:IpamPoolId,desc:Description,locale:Locale,depth:PoolDepth,min:AllocationMinNetmaskLength,max:AllocationMaxNetmaskLength,def:AllocationDefaultNetmaskLength}' \
  --output table

# CIDRs provisionados em um pool e o estado de cada um
aws ec2 get-ipam-pool-cidrs --profile rede-leitura --region sa-east-1 \
  --ipam-pool-id ipam-pool-0aaaabbbbccccdddd

# O que já foi alocado do pool sa-east-1/prod (use a região do locale)
aws ec2 get-ipam-pool-allocations --profile rede-leitura --region sa-east-1 \
  --ipam-pool-id ipam-pool-0aaaabbbbccccdddd \
  --query 'IpamPoolAllocations[].{cidr:Cidr,tipo:ResourceType,recurso:ResourceId,conta:ResourceOwner}'

# CIDRs sobrepostos no escopo privado, gerenciados ou não
aws ec2 get-ipam-resource-cidrs --profile rede-leitura --region sa-east-1 \
  --ipam-scope-id ipam-scope-0eeeeffff00001111 \
  --query "IpamResourceCidrs[?OverlapStatus=='overlapping'].{cidr:ResourceCidr,recurso:ResourceId,conta:ResourceOwnerId}"
```

O [`get-ipam-pool-allocations`](https://docs.aws.amazon.com/cli/latest/reference/ec2/get-ipam-pool-allocations.html) deve ser chamado na região do locale do pool. Para o pool `us-east-1/prod`, troque a região.

Comparar os CIDRs provisionados com as alocações mostra o espaço restante, mas só no momento da consulta. Para acompanhar ao longo do tempo, o IPAM publica [métricas no namespace `AWS/IPAM`](https://docs.aws.amazon.com/vpc/latest/ipam/cloudwatch-ipam-ip-address-usage.html), na região home: `PercentAvailable` e `PercentAssigned` por pool, e `OverlappingResourceCidrs` e `UnmanagedResourceCidrs` por escopo. Um alarme em `PercentAvailable` nos pools de ambiente avisa antes que a próxima VPC falhe. O limiar depende da frequência com que o time cria VPCs.

Depois do primeiro `apply` real, vale um teste negativo, com o mesmo espírito do post anterior. Em uma conta de não produção, tente criar uma VPC `/25` a partir do pool `nonprod`. A criação deve falhar pela regra de máscara máxima. Não teste com um bloco maior que `/16`: a VPC recusaria o pedido mesmo sem regra no pool, e o teste não provaria nada. Se ela passar, a regra não está onde você imagina: apague a VPC e revise o pool. Esse é o único passo desta seção que tenta criar um recurso.

## O que eu levaria para o próximo projeto

- **Desenhe o plano de endereçamento antes do código.** O IPAM aplica o plano; ele não decide quantas regiões e ambientes você terá. Deixe blocos reservados em cada nível.
- **Declare as regras em cada pool que aloca para recursos.** Nenhuma regra é herdada.
- **Trate o comentário "não há sobreposição" como uma hipótese.** Sem a SCP, a garantia cobre apenas quem aloca dos pools.
- **Valide o principal do compartilhamento.** Um RAM sem principal não gera erro no `apply`.
- **Monitore o espaço livre.** Um pool esgotado só aparece quando alguém tenta criar a próxima VPC.
- **Decida o tier sabendo o que ele cobre.** A conta não depende do número de pools.

A planilha não precisa desaparecer: ela pode continuar como documento de planejamento. A diferença é que a reserva do bloco passa a acontecer na mesma chamada que cria a VPC.

Os próximos posts da série continuam deste ponto: como incorporar ao IPAM as redes que já existem, e como uma conta de workload encontra um pool que recebeu pelo RAM sem depender de um ID copiado à mão.
