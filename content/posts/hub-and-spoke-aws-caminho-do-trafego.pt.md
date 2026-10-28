---
title: 'Hub and spoke na AWS: ida e volta do tráfego pelo Transit Gateway'
description: >-
  Um attachment disponível não garante a volta. Siga uma conexão pelas tabelas
  do Transit Gateway e da VPC de saída e veja como blackholes isolam os ambientes.
author: Caio Barbieri
category: Redes e governança AWS
tags:
  - AWS
  - Transit Gateway
  - VPC
  - Redes
  - Arquitetura
date: '2026-10-26'
updatedAt: '2026-10-27'
published: true
coverImage: /images/posts/hub-and-spoke-aws/capa.webp
---
Considere uma aplicação em uma sub-rede privada de produção que precisa acessar uma API pública. A VPC está conectada ao Transit Gateway, o attachment aparece como disponível e a conta de rede tem um NAT Gateway. A conexão, porém, termina em timeout.

Para localizar a falha, é preciso acompanhar as tabelas que encaminham a requisição e aquelas que trazem a resposta. O attachment conecta a VPC ao roteador central. As rotas determinam o que acontece com cada pacote depois dessa conexão.

Em uma arquitetura hub and spoke, os spokes são as redes de aplicação conectadas a um ponto central. Na AWS, o [Transit Gateway (TGW) atua como um roteador regional entre redes](https://docs.aws.amazon.com/vpc/latest/tgw/how-transit-gateways-work.html). Uma VPC central pode concentrar a saída para a internet, enquanto as aplicações permanecem em suas próprias contas e VPCs. Para esse desenho funcionar, as decisões de roteamento do TGW precisam se completar com as decisões dentro de cada VPC.

## Três VPCs e uma política de comunicação

O exemplo usa três VPCs em uma única região, distribuídas entre uma conta de rede e duas contas de aplicação. Os nomes e endereços são fictícios.

| VPC | CIDR | Função |
| --- | --- | --- |
| Produção | `10.240.0.0/16` | Aplicações em sub-redes privadas |
| Desenvolvimento | `10.241.0.0/16` | Aplicações em sub-redes privadas |
| Saída | `10.242.0.0/16` | Encaminhamento para NAT e internet |

Produção e desenvolvimento precisam iniciar conexões com destinos públicos. A comunicação entre seus endereços privados deve ser bloqueada. Cada VPC tem um attachment no mesmo TGW.

Na VPC de saída, o tráfego chega pela sub-rede do attachment e segue para um NAT Gateway público zonal, instalado em uma sub-rede pública com rota para um Internet Gateway. O recorte acompanha uma zona de disponibilidade (AZ) e não inclui um firewall de inspeção.

O percurso pretendido é:

```text
Aplicação (10.240.1.10)
  -> TGW: rt-producao
  -> attachment de saída
  -> NAT Gateway
  -> Internet Gateway
  -> API pública
```

![Diagrama do exemplo: VPCs de produção e de desenvolvimento ligadas ao Transit Gateway, com saída central por NAT Gateway e Internet Gateway na VPC de saída até a API pública. A ida usa rt-producao; a volta, em quatro passos numerados, usa a rota mais específica da sub-rede pública e rt-retorno. Blackholes separam os ambientes.](/images/posts/hub-and-spoke-aws/fluxo-rede.svg)

*Exemplo didático IPv4 em uma AZ; não representa um ambiente de cliente. No computador, clique na figura para abri-la em tamanho real; no celular, amplie com o gesto de pinça.*

## Qual tabela o TGW consulta?

Quando o pacote entra no TGW, a tabela consultada depende do attachment pelo qual ele chegou. A escolha é definida pela **associação**: cada attachment pode estar associado a uma única tabela do TGW.

A **propagação** tem outra função. Ela instala rotas de um attachment nas tabelas escolhidas. Para attachments de VPC, os [blocos CIDR da VPC podem ser propagados para uma ou mais tabelas](https://docs.aws.amazon.com/vpc/latest/tgw/how-transit-gateways-work.html#tgw-routing-overview).

Neste exemplo, as relações são explícitas, sem depender das associações e propagações padrão:

| Attachment | Tabela associada | Onde propaga o CIDR da VPC |
| --- | --- | --- |
| Produção | `rt-producao` | `rt-retorno` |
| Desenvolvimento | `rt-desenvolvimento` | `rt-retorno` |
| Saída | `rt-retorno` | Em nenhuma tabela |

Um pacote que chega de produção consulta `rt-producao`. Um pacote que chega da VPC de saída consulta `rt-retorno`. Portanto, a requisição e a resposta atravessam o mesmo TGW usando tabelas diferentes.

A propagação dos spokes em `rt-retorno` permite que o TGW conheça os destinos privados para devolver o tráfego. Ela não cria as rotas nas sub-redes das VPCs: essa parte precisa ser configurada separadamente.

## Da sub-rede privada ao NAT central

A aplicação de produção tem o endereço `10.240.1.10`. Para alcançar destinos públicos, a tabela associada à sua sub-rede contém:

| Destino | Alvo |
| --- | --- |
| `10.240.0.0/16` | `local` |
| `0.0.0.0/0` | Transit Gateway |

O tráfego da própria VPC usa a rota local. Os demais destinos [seguem para o TGW](https://docs.aws.amazon.com/vpc/latest/userguide/route-table-options.html#route-tables-tgw). Em desenvolvimento, a estrutura é a mesma, com `10.241.0.0/16` como CIDR local.

No TGW, as tabelas recebem as seguintes rotas:

**`rt-producao`**

| Destino | Alvo | Tipo |
| --- | --- | --- |
| `0.0.0.0/0` | Attachment de saída | Estática |
| `10.241.0.0/16` | `blackhole` | Estática |

**`rt-desenvolvimento`**

| Destino | Alvo | Tipo |
| --- | --- | --- |
| `0.0.0.0/0` | Attachment de saída | Estática |
| `10.240.0.0/16` | `blackhole` | Estática |

**`rt-retorno`**

| Destino | Alvo | Tipo |
| --- | --- | --- |
| `10.240.0.0/16` | Attachment de produção | Propagada |
| `10.241.0.0/16` | Attachment de desenvolvimento | Propagada |

As [rotas `blackhole`](https://docs.aws.amazon.com/vpc/latest/tgw/tgw-create-static-route.html) descartam o tráfego correspondente. A justificativa desses bloqueios aparece adiante. Por enquanto, acompanhe a conexão para um endereço público: ela corresponde à rota default de `rt-producao` e sai pelo attachment de saída.

Na VPC de saída, o pacote passa a seguir a tabela da sub-rede do attachment. Para a AZ do exemplo, as tabelas são:

**Tabela da sub-rede do attachment**

| Destino | Alvo |
| --- | --- |
| `10.242.0.0/16` | `local` |
| `0.0.0.0/0` | NAT Gateway da mesma AZ |

**Tabela da sub-rede pública do NAT**

| Destino | Alvo |
| --- | --- |
| `10.242.0.0/16` | `local` |
| `10.240.0.0/16` | Transit Gateway |
| `10.241.0.0/16` | Transit Gateway |
| `0.0.0.0/0` | Internet Gateway |

A tabela da sub-rede do attachment leva a conexão ao NAT. A da sub-rede pública do NAT permite que ela siga para o Internet Gateway e também contém as rotas de retorno dos spokes. O encadeamento segue o [padrão de saída IPv4 centralizada documentado pela AWS](https://docs.aws.amazon.com/whitepapers/latest/building-scalable-secure-multi-vpc-network-infrastructure/using-nat-gateway-for-centralized-egress.html).

No [NAT público](https://docs.aws.amazon.com/vpc/latest/userguide/vpc-nat-gateway.html), o endereço privado da aplicação é traduzido para o endereço privado do NAT Gateway, e o Internet Gateway faz o mapeamento para o Elastic IP associado. A API vê apenas o Elastic IP. Na resposta, as traduções são revertidas.

## O retorno é uma segunda decisão de roteamento

A volta tem quatro passos, numerados também na figura (①–④). Depois que o Internet Gateway e o NAT desfazem as traduções (①), o destino volta a ser `10.240.1.10`. O próximo salto precisa conduzir esse pacote até a VPC de produção.

Na tabela da sub-rede pública do NAT (②), a rota `10.240.0.0/16 -> TGW` vence `0.0.0.0/0 -> Internet Gateway` por ser [mais específica](https://docs.aws.amazon.com/vpc/latest/userguide/route-tables-priority.html). É ela que mantém a resposta no caminho privado.

O pacote reentra no TGW pelo attachment de saída. Dessa vez, a tabela consultada é `rt-retorno` (③), e a rota propagada `10.240.0.0/16` aponta para o attachment de produção. Na VPC de produção (④), a rota local entrega o pacote à aplicação, respeitando os controles de acesso.

Volte ao timeout da abertura. Com qualquer uma das duas lacunas abaixo, a requisição chega à API e só a resposta se perde:

- Sem a rota de produção na sub-rede pública do NAT, a resposta segue a default para o Internet Gateway no passo ②.
- Sem a rota de produção em `rt-retorno`, o TGW não encontra um caminho para o attachment do spoke no passo ③.

## A rota default pode abrir um desvio entre ambientes

A rota `0.0.0.0/0` também corresponde a endereços privados quando não existe uma rota mais específica.

Imagine retirar o blackhole de desenvolvimento de `rt-producao`, mantendo as demais tabelas. Um pacote de produção para `10.241.1.10` passa a seguir a default, atravessa o NAT e volta ao TGW, agora pela tabela `rt-retorno`, que conhece o CIDR de desenvolvimento:

```text
Aplicação (10.240.1.10)
  -> TGW: rt-producao, default
  -> attachment de saída
  -> NAT: origem 10.242.x.x
  -> sub-rede pública: 10.241.0.0/16
  -> TGW: rt-retorno
  -> Desenvolvimento (10.241.1.10)
```

No NAT, a origem passa a ser o IP privado do NAT Gateway, um endereço `10.242.x.x`. Desenvolvimento responde para esse endereço, que em `rt-desenvolvimento` segue a default, e não o blackhole de `10.240.0.0/16`. A resposta volta pelo NAT e a conexão se completa. Por isso, cada tabela de spoke precisa bloquear o destino por conta própria: o blackhole do outro lado não impede o desvio.

A AWS [descreve esse desvio](https://aws.amazon.com/blogs/networking-and-content-delivery/creating-a-single-internet-exit-point-from-multiple-vpcs-using-aws-transit-gateway/) no exemplo de saída centralizada: deixar de propagar desenvolvimento para `rt-producao` evita a rota direta, mas não fecha o caminho pelo NAT. Aqui, `10.241.0.0/16 -> blackhole` descarta o pacote antes da default; em `rt-desenvolvimento`, a entrada inversa faz o mesmo com as conexões que desenvolvimento inicia rumo à produção.

Como cada blackhole cobre um único CIDR, o bloqueio falha aberto (fail-open): uma VPC nova propagada em `rt-retorno` fica alcançável pelo desvio até que alguém inclua o bloqueio correspondente. O mesmo vale para CIDRs secundários, VPNs e outras conexões. O exemplo da AWS usa uma única tabela para todos os spokes e bloqueia nela todo o espaço privado (RFC 1918); cada destino permitido entra como uma [rota mais específica](https://docs.aws.amazon.com/vpc/latest/tgw/how-transit-gateways-work.html#tgw-route-evaluation-overview), que tem precedência. Este artigo separa `rt-producao` e `rt-desenvolvimento` para deixar cada decisão visível. Na prática, tabelas separadas só se justificam quando os ambientes precisam de exceções diferentes.

Rota não é permissão. [Security groups são stateful](https://docs.aws.amazon.com/vpc/latest/userguide/vpc-security-groups.html) e controlam o tráfego dos recursos associados; [network ACLs (NACLs) são stateless](https://docs.aws.amazon.com/vpc/latest/userguide/vpc-network-acls.html) e precisam permitir os dois sentidos da comunicação em cada sub-rede do caminho.

As [boas práticas do Transit Gateway](https://docs.aws.amazon.com/vpc/latest/tgw/tgw-best-design-practices.html) recomendam sub-redes dedicadas aos attachments, com NACL aberta na entrada e na saída; conforme o fluxo, as NACLs podem ser aplicadas às sub-redes das aplicações. Na VPC de saída, a AWS também [cita a NACL da sub-rede pública do NAT](https://docs.aws.amazon.com/whitepapers/latest/building-scalable-secure-multi-vpc-network-infrastructure/using-nat-gateway-for-centralized-egress.html#Security-1) para permitir ou bloquear origens e destinos.

## Como conferir o caminho sem depender de um timeout

Comece por uma conexão específica: origem, destino, protocolo e porta. No exemplo, pode ser a aplicação `10.240.1.10` iniciando TCP na porta 443 para um destino público de teste. Com essa referência, siga a ordem de encaminhamento:

1. Confira a tabela realmente associada à sub-rede de origem e a rota selecionada para o destino.
2. Verifique o estado do attachment e as AZs habilitadas. Pelos [requisitos dos attachments de VPC](https://docs.aws.amazon.com/vpc/latest/tgw/tgw-vpc-attachments.html), um recurso em uma AZ sem sub-rede de attachment não alcança o TGW, mesmo com uma rota apontando para ele.
3. Consulte a tabela do TGW associada ao attachment de entrada e identifique o próximo attachment ou blackhole.
4. Siga as tabelas da VPC de saída, da sub-rede do attachment até o NAT e o Internet Gateway.
5. Refaça a análise para o retorno, usando o destino privado restaurado pelo NAT e a tabela associada ao attachment de saída.
6. Confira os controles de tráfego e se o serviço de destino está disponível para aquela conexão.

Na AWS CLI, os itens 1 e 2 rodam na conta do spoke. As tabelas do TGW só podem ser consultadas na [conta de rede, dona do TGW](https://docs.aws.amazon.com/vpc/latest/tgw/transit-gateway-share.html#transit-gateway-considerations). O último comando procura em `rt-retorno` a rota escolhida para `10.240.1.10`, como no item 5:

```bash
# Conta do spoke: itens 1 e 2
aws ec2 describe-route-tables \
  --filters "Name=association.subnet-id,Values=$SUBNET_ID"
# Vazio: vale a tabela principal

aws ec2 describe-transit-gateway-vpc-attachments \
  --filters "Name=vpc-id,Values=$VPC_ID"
# Confira State e SubnetIds

# Conta de rede: item 5
aws ec2 search-transit-gateway-routes \
  --transit-gateway-route-table-id "$RT_RETORNO_ID" \
  --filters "Name=route-search.longest-prefix-match,Values=10.240.1.10/32"
```

Um teste de saída bem-sucedido não diz nada sobre o isolamento entre os ambientes. A verificação do exemplo precisa incluir as tentativas permitidas e as proibidas. Os resultados abaixo são esperados para o cenário didático: o exemplo não foi provisionado nem submetido a testes de tráfego para este artigo.

| Origem | Destino | Resultado esperado |
| --- | --- | --- |
| Produção | Destino público de teste, HTTPS | Conexão concluída com resposta |
| Desenvolvimento | Destino público de teste, HTTPS | Conexão concluída com resposta |
| Produção | Endereço privado de desenvolvimento | Descarte no blackhole previsto |
| Desenvolvimento | Endereço privado de produção | Descarte no blackhole previsto |

Um timeout, sozinho, não identifica onde ocorreu o bloqueio. Nos testes negativos, ele pode ser consequência de uma rota ausente, de um filtro ou da indisponibilidade do destino. Para atribuir o resultado ao blackhole, procure nos [TGW Flow Logs](https://docs.aws.amazon.com/vpc/latest/tgw/tgw-flow-logs.html#flow-logs-fields) os mesmos endereços, portas e intervalo de tempo: `packets-lost-blackhole` maior que zero indica descarte em blackhole, e `packets-lost-no-route` maior que zero indica rota ausente, como na lacuna de `rt-retorno` no passo ③. Os dois campos fazem parte do formato padrão.

Os TGW Flow Logs são criados pela conta dona do TGW ou com permissão dela. VPC Flow Logs complementam a análise com o tráfego das interfaces das VPCs. Crie os logs antes do teste: eles podem levar alguns minutos para começar a publicar dados e não registram em tempo real.

O Reachability Analyzer pode ajudar a encontrar bloqueios de configuração nos caminhos suportados. Ele [constrói um modelo da rede, sem enviar pacotes nem analisar o plano de dados](https://docs.aws.amazon.com/vpc/latest/reachability/how-reachability-analyzer-works.html), e, para TCP que atravessa tabelas do TGW, analisa apenas a ida. Por isso, o retorno precisa ser verificado à parte.

## Ao crescer, volte às zonas e aos custos

O percurso foi mostrado em uma AZ para permitir a leitura das tabelas. Com NAT Gateways zonais, colocar aplicações em várias zonas e manter um único NAT concentra a dependência de saída. Para melhorar a resiliência desse modelo, a AWS orienta usar [NAT por AZ com roteamento para a mesma zona](https://docs.aws.amazon.com/vpc/latest/userguide/nat-gateway-basics.html).

Com o TGW, a VPC de saída precisa então de uma sub-rede de attachment e de um NAT em cada AZ usada pelos spokes. Entre contas, compare as zonas pelo [AZ ID](https://docs.aws.amazon.com/vpc/latest/tgw/transit-gateway-share.html#transit-gateway-considerations), como `use1-az1`, e não pelo nome: `us-east-1a` pode corresponder a zonas físicas diferentes em contas diferentes.

O modelo zonal também não é a única opção disponível. [NAT Gateways regionais](https://docs.aws.amazon.com/vpc/latest/userguide/nat-gateways-regional.html) se expandem automaticamente pelas AZs em que há aplicações, usam uma tabela própria e não exigem sub-rede pública. As tabelas apresentadas aqui pertencem ao exemplo zonal e precisam ser revistas se essa escolha mudar.

A centralização também muda onde os custos aparecem. O TGW cobra por attachment e por [GB processado](https://aws.amazon.com/transit-gateway/pricing/), contado sobre o tráfego que cada VPC envia a ele e, por padrão, cobrado do dono dessa VPC: na ida, da conta do spoke; na volta, da conta de rede. A conta de rede, dona do TGW, pode mudar essa alocação com [metering policies](https://docs.aws.amazon.com/vpc/latest/tgw/metering-policy.html). O processamento do NAT Gateway se soma a isso. Reduzir a quantidade de NATs pode diminuir uma parcela da conta, mas essa contagem isolada não demonstra economia: a própria AWS observa que, com grande volume de dados, [manter o NAT na VPC de origem](https://docs.aws.amazon.com/whitepapers/latest/building-scalable-secure-multi-vpc-network-infrastructure/using-nat-gateway-for-centralized-egress.html) pode sair mais barato.

O timeout da abertura resume o problema: um attachment disponível e uma ida correta não garantem a volta. Confira a rota dos spokes na sub-rede pública do NAT, a propagação de cada spoke em `rt-retorno` e uma sub-rede de attachment em cada AZ com aplicações. Depois, tente os caminhos que deveriam ser bloqueados e confirme nos TGW Flow Logs que o descarte ocorreu no blackhole. Só esses testes negativos mostram se o roteamento cumpre a política de comunicação entre os ambientes.
