---
title: 'Hub and spoke na AWS: da arquitetura ao caminho real do tráfego'
description: >-
  Acompanhe a ida e o retorno de uma conexão com saída centralizada na AWS e
  veja como as tabelas da Transit Gateway separam os ambientes.
author: Caio Barbieri
category: Redes e governança AWS
tags:
  - AWS
  - Transit Gateway
  - VPC
  - Redes
  - Arquitetura
date: '2026-10-26'
updatedAt: '2026-10-26'
published: true
coverImage: /images/posts/hub-and-spoke-aws/capa.webp
---
Considere uma aplicação em uma sub-rede privada de produção que precisa acessar uma API pública. A VPC está conectada à Transit Gateway, o attachment aparece como disponível e a conta central de rede tem um NAT Gateway. A conexão, porém, termina em timeout.

Para localizar a falha, é preciso acompanhar as tabelas que encaminham a requisição e aquelas que trazem a resposta. O attachment conecta a VPC ao roteador central. As rotas determinam o que acontece com cada pacote depois dessa conexão.

Em uma arquitetura hub and spoke, os spokes são as redes de aplicação conectadas a um ponto central. Na AWS, a [Transit Gateway (TGW) atua como um roteador regional entre redes](https://docs.aws.amazon.com/vpc/latest/tgw/how-transit-gateways-work.html). Uma VPC central pode concentrar a saída para a internet, enquanto as aplicações permanecem em suas próprias contas e VPCs. Para esse desenho funcionar, as decisões de roteamento da TGW precisam se completar com as decisões dentro de cada VPC.

## Três VPCs e uma política de comunicação

O exemplo usa três VPCs em uma única região, distribuídas entre uma conta de rede e duas contas de aplicação. Os nomes e endereços são fictícios.

| VPC | CIDR | Função |
| --- | --- | --- |
| Produção | `10.240.0.0/16` | Aplicações em sub-redes privadas |
| Desenvolvimento | `10.241.0.0/16` | Aplicações em sub-redes privadas |
| Saída central | `10.242.0.0/16` | Encaminhamento para NAT e internet |

Produção e desenvolvimento precisam iniciar conexões com destinos públicos. A comunicação entre seus endereços privados deve ser bloqueada. Cada VPC tem um attachment na mesma TGW.

Na VPC central, o tráfego chega por uma sub-rede usada pelo attachment e segue para um NAT Gateway público zonal, instalado em uma sub-rede pública. Essa sub-rede tem rota para um Internet Gateway. O recorte acompanha uma zona de disponibilidade (AZ) e não inclui um firewall de inspeção.

O percurso pretendido é:

```text
Aplicação -> TGW -> VPC de saída -> NAT Gateway -> Internet Gateway -> API pública
```

[![Diagrama do exemplo: produção e desenvolvimento conectados à Transit Gateway, com saída central por NAT e Internet Gateway. A ida e o retorno usam tabelas distintas; blackholes bloqueiam o tráfego entre os dois ambientes.](/images/posts/hub-and-spoke-aws/fluxo-rede.svg)](/images/posts/hub-and-spoke-aws/fluxo-rede.svg)

*Exemplo didático IPv4. A figura acompanha uma AZ e não representa um ambiente de cliente.*

## Qual tabela a TGW consulta?

Quando o pacote entra na TGW, a tabela consultada depende do attachment pelo qual ele chegou. Essa escolha é definida pela **associação**: cada attachment pode estar associado a uma única tabela da TGW.

A **propagação** tem outra função. Ela instala rotas de um attachment nas tabelas escolhidas. Para attachments de VPC, os blocos CIDR da VPC podem ser propagados para uma ou mais tabelas. Essas regras estão descritas nas [seções de associação e propagação da TGW](https://docs.aws.amazon.com/vpc/latest/tgw/how-transit-gateways-work.html#tgw-routing).

Neste exemplo, as relações são explícitas, sem depender das associações e propagações padrão:

| Attachment | Tabela associada | Onde propaga o CIDR da VPC |
| --- | --- | --- |
| Produção | `rt-producao` | `rt-retorno` |
| Desenvolvimento | `rt-desenvolvimento` | `rt-retorno` |
| Saída central | `rt-retorno` | Em nenhuma tabela |

Um pacote que chega de produção consulta `rt-producao`. Um pacote que chega da VPC de saída consulta `rt-retorno`. Portanto, a requisição e a resposta atravessam a mesma TGW usando tabelas diferentes.

A propagação dos spokes em `rt-retorno` permite que a TGW conheça os destinos privados para devolver o tráfego. Ela não cria as rotas nas sub-redes das VPCs: essa parte precisa ser configurada separadamente.

## Da sub-rede privada ao NAT central

A aplicação de produção tem o endereço `10.240.1.10`. Para iniciar uma conexão com um destino público, a tabela associada à sua sub-rede contém:

| Destino | Alvo |
| --- | --- |
| `10.240.0.0/16` | `local` |
| `0.0.0.0/0` | Transit Gateway |

O tráfego da própria VPC usa a rota local. Os demais destinos seguem para a TGW. Em desenvolvimento, a estrutura é a mesma, com `10.241.0.0/16` como CIDR local. A documentação de [rotas de VPC para gateways e conexões](https://docs.aws.amazon.com/vpc/latest/userguide/route-table-options.html) detalha essa configuração.

Na TGW, as tabelas recebem as seguintes rotas:

| Tabela | Destino | Alvo ou ação | Tipo |
| --- | --- | --- | --- |
| `rt-producao` | `10.241.0.0/16` | `blackhole` | Estática |
| `rt-producao` | `0.0.0.0/0` | Attachment da saída central | Estática |
| `rt-desenvolvimento` | `10.240.0.0/16` | `blackhole` | Estática |
| `rt-desenvolvimento` | `0.0.0.0/0` | Attachment da saída central | Estática |
| `rt-retorno` | `10.240.0.0/16` | Attachment de produção | Propagada |
| `rt-retorno` | `10.241.0.0/16` | Attachment de desenvolvimento | Propagada |

As rotas `blackhole` descartam o tráfego correspondente, conforme o mecanismo de [rotas estáticas e blackholes da TGW](https://docs.aws.amazon.com/vpc/latest/tgw/tgw-create-static-route.html). A justificativa desses bloqueios aparece adiante. Por enquanto, acompanhe a conexão para um endereço público: ela corresponde à rota default de `rt-producao` e sai pelo attachment central.

Ao chegar à VPC de saída, o pacote passa a seguir a tabela da sub-rede usada pelo attachment. Para a AZ acompanhada no exemplo, as tabelas são:

| Tabela da VPC central | Destino | Alvo |
| --- | --- | --- |
| Sub-rede do attachment | `10.242.0.0/16` | `local` |
| Sub-rede do attachment | `0.0.0.0/0` | NAT Gateway da mesma AZ |
| Sub-rede pública do NAT | `10.242.0.0/16` | `local` |
| Sub-rede pública do NAT | `10.240.0.0/16` | Transit Gateway |
| Sub-rede pública do NAT | `10.241.0.0/16` | Transit Gateway |
| Sub-rede pública do NAT | `0.0.0.0/0` | Internet Gateway |

A primeira tabela leva a conexão ao NAT. A segunda permite que ela siga para o Internet Gateway e também contém as rotas de retorno dos spokes. Esse encadeamento segue o [padrão de saída IPv4 centralizada documentado pela AWS](https://docs.aws.amazon.com/whitepapers/latest/building-scalable-secure-multi-vpc-network-infrastructure/using-nat-gateway-for-centralized-egress.html).

No NAT público, o endereço privado da aplicação é traduzido para o endereço privado do NAT Gateway. O Internet Gateway faz o mapeamento para o Elastic IP associado. É esse endereço público que participa da comunicação com a API. Na resposta, as traduções são revertidas, como explica a [documentação de NAT Gateways](https://docs.aws.amazon.com/vpc/latest/userguide/vpc-nat-gateway.html).

## O retorno é uma segunda decisão de roteamento

Depois da tradução de retorno, o destino volta a ser `10.240.1.10`. O próximo salto precisa conduzir esse pacote até a VPC de produção.

Na tabela da sub-rede pública do NAT, a rota `10.240.0.0/16 -> TGW` é mais específica que `0.0.0.0/0 -> Internet Gateway`. Por isso, ela é selecionada. A regra de [prioridade pelo prefixo mais específico](https://docs.aws.amazon.com/vpc/latest/userguide/route-tables-priority.html) é o que mantém a resposta no caminho privado.

O pacote reentra na TGW pelo attachment da VPC central. Dessa vez, a tabela consultada é `rt-retorno`. A rota propagada `10.240.0.0/16` aponta para o attachment de produção. Ao entrar nessa VPC, o tráfego usa a rota local da sub-rede do attachment para alcançar a aplicação, respeitando os controles de acesso.

Agora considere duas falhas possíveis:

- Sem a rota de produção na sub-rede pública do NAT, a resposta pode seguir a default para o Internet Gateway.
- Sem a rota de produção em `rt-retorno`, a TGW não encontra um caminho para o attachment do spoke.

Nos dois casos, a configuração de ida pode parecer correta. A aplicação continua recebendo timeout porque a resposta não completa o percurso.

## A rota default pode abrir um desvio entre ambientes

Há uma consequência da rota `0.0.0.0/0` que merece atenção: ela também corresponde a endereços privados quando não existe uma rota mais específica.

Imagine retirar o blackhole de desenvolvimento de `rt-producao`, mantendo as demais tabelas. Um pacote de produção para `10.241.1.10` passa a seguir a default até a VPC central. De lá, pode chegar ao NAT e ser encaminhado novamente para a TGW, agora pelo attachment central. A `rt-retorno` conhece o CIDR de desenvolvimento.

Esse desvio via NAT é descrito na seção sobre blackholes do [exemplo de saída centralizada da AWS](https://aws.amazon.com/blogs/networking-and-content-delivery/creating-a-single-internet-exit-point-from-multiple-vpcs-using-aws-transit-gateway/). Deixar de propagar desenvolvimento para `rt-producao` evita a rota direta naquela tabela, mas não demonstra que todos os caminhos entre as VPCs estão bloqueados.

No nosso exemplo, `10.241.0.0/16 -> blackhole` descarta esse destino antes que ele siga a default de produção. A entrada inversa em `rt-desenvolvimento` bloqueia o acesso privado a produção.

Essas entradas cobrem os dois CIDRs apresentados. Novas VPCs, CIDRs secundários, VPNs e outras conexões exigem rever a política. A tabela de retorno conhece ambos os ambientes; sua associação e as propagações precisam continuar sob controle conforme a rede cresce.

Os filtros permanecem parte da configuração. [Security groups são stateful](https://docs.aws.amazon.com/vpc/latest/userguide/vpc-security-groups.html) e controlam o tráfego dos recursos associados. [Network ACLs são stateless](https://docs.aws.amazon.com/vpc/latest/userguide/vpc-network-acls.html) e exigem regras compatíveis com os dois sentidos da comunicação nas sub-redes envolvidas. Uma rota existente não equivale a uma conexão permitida.

## Como conferir o caminho sem depender de um timeout

Comece por uma conexão específica: origem, destino, protocolo e porta. No exemplo, pode ser a aplicação `10.240.1.10` iniciando TCP na porta 443 para um destino público de teste. Com essa referência, siga a ordem de encaminhamento:

1. Confira a tabela realmente associada à sub-rede de origem e a rota selecionada para o destino.
2. Verifique o estado do attachment e as AZs habilitadas. Um recurso em uma AZ sem sub-rede de attachment não consegue alcançar a TGW, mesmo com uma rota apontando para ela. Esse é um dos [requisitos dos attachments de VPC](https://docs.aws.amazon.com/vpc/latest/tgw/tgw-vpc-attachments.html).
3. Consulte a tabela da TGW associada ao attachment de entrada e identifique o próximo attachment ou blackhole.
4. Siga as tabelas da VPC central, da sub-rede do attachment até o NAT e o Internet Gateway.
5. Refaça a análise para o retorno, usando o destino privado restaurado pelo NAT e a tabela associada ao attachment central.
6. Confira os controles de tráfego e se o serviço de destino está disponível para aquela conexão.

Um teste de saída bem-sucedido ainda deixa a separação dos ambientes sem resposta. A verificação do exemplo precisa incluir as tentativas permitidas e as proibidas:

| Origem | Destino | Resultado esperado |
| --- | --- | --- |
| Produção | Destino público de teste, HTTPS | Conexão concluída com resposta |
| Desenvolvimento | Destino público de teste, HTTPS | Conexão concluída com resposta |
| Produção | Endereço privado de desenvolvimento | Descarte no blackhole previsto |
| Desenvolvimento | Endereço privado de produção | Descarte no blackhole previsto |

Um timeout, sozinho, não identifica onde ocorreu o bloqueio. Nos testes negativos, ele pode ser consequência de uma rota ausente, de um filtro ou da indisponibilidade do destino. Para atribuir o resultado ao blackhole, confronte a rota efetiva com as evidências do fluxo, usando os mesmos endereços, portas e intervalo de tempo.

[TGW Flow Logs registram informações do tráfego na Transit Gateway](https://docs.aws.amazon.com/vpc/latest/tgw/tgw-flow-logs.html), enquanto VPC Flow Logs registram informações das interfaces das VPCs. A coleta e a publicação têm atraso, portanto a ausência imediata de um registro não encerra a investigação.

O Reachability Analyzer pode ajudar a encontrar bloqueios de configuração nos caminhos suportados. Ele constrói um modelo da rede, sem enviar pacotes ou analisar o plano de dados. Para TCP que atravessa tabelas da TGW, há outro limite: apenas a ida é analisada. A [documentação do serviço](https://docs.aws.amazon.com/vpc/latest/reachability/how-reachability-analyzer-works.html) registra essa restrição, que torna a verificação separada do retorno especialmente relevante aqui.

Os resultados da tabela são expectativas para o cenário didático. O exemplo não foi provisionado nem submetido a testes de tráfego para este artigo.

## Ao crescer, volte às zonas e aos custos

O percurso foi mostrado em uma AZ para permitir a leitura das tabelas. Com NAT Gateways zonais, colocar aplicações em várias zonas e manter um único NAT concentra a dependência de saída. Para melhorar a resiliência desse modelo, a AWS orienta usar [NAT por AZ com roteamento para a mesma zona](https://docs.aws.amazon.com/vpc/latest/userguide/nat-gateway-basics.html).

O modelo zonal também não é a única opção disponível. [NAT Gateways regionais](https://docs.aws.amazon.com/vpc/latest/userguide/nat-gateways-regional.html) têm outra organização de disponibilidade e usam uma tabela própria, sem exigir uma sub-rede pública para hospedá-los. As tabelas apresentadas aqui pertencem ao exemplo zonal e precisam ser revistas se essa escolha mudar.

A centralização também altera a composição dos custos. A TGW tem [cobranças por attachments e processamento de dados](https://aws.amazon.com/transit-gateway/pricing/), além dos demais componentes do caminho. Reduzir a quantidade de NATs pode diminuir uma parcela da conta, mas essa contagem isolada não demonstra economia. O volume e o percurso do tráfego precisam entrar na comparação.

Uma revisão útil desse desenho acompanha uma conexão até a resposta e identifica a tabela responsável por cada decisão. Depois, tenta os caminhos que deveriam ser bloqueados. É essa combinação que permite avaliar se o roteamento realiza a política de comunicação definida para os ambientes.
