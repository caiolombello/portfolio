---
title: "Kubernetes HPA com métricas customizadas: Prometheus Adapter na prática"
date: "2023-03-18"
description: "Um guia prático para expor métricas do Prometheus ao Kubernetes e configurar um HPA v2 previsível, observável e seguro."
author: "Caio Barbieri"
category: "Kubernetes"
tags: ["Kubernetes", "HPA", "Prometheus", "SRE", "Autoscaling"]
coverImage: "/images/posts/kubernetes-hpa.webp"
published: true
updatedAt: "2026-08-01"
---

O Horizontal Pod Autoscaler parece simples: observar uma métrica, comparar com um alvo e alterar o número de réplicas. Na prática, o resultado depende muito mais da qualidade do sinal, dos `requests` declarados e do comportamento da aplicação do que do manifesto do HPA.

Este guia monta o caminho completo entre Prometheus e `autoscaling/v2`, usando uma razão por pod como exemplo. A mesma arquitetura serve para sinais melhores de negócio ou de SLO, como backlog, concorrência e latência.

> **Resumo:** comece com CPU baseada em `requests` quando ela representar a carga. Adote métricas customizadas somente quando houver um sinal mais próximo da demanda e trate escala por limite como uma ferramenta de diagnóstico, não como padrão universal.

## Antes da métrica customizada

O HPA consome APIs de métricas agregadas:

- `metrics.k8s.io`: CPU e memória, normalmente fornecidas pelo Metrics Server;
- `custom.metrics.k8s.io`: métricas associadas a objetos Kubernetes;
- `external.metrics.k8s.io`: métricas que não pertencem diretamente a um objeto do cluster.

Para uma métrica de recurso com `target.type: Utilization`, o percentual é calculado sobre o `request`, não sobre o `limit`. Sem `requests.cpu` nos containers relevantes, o controlador não consegue calcular utilização de CPU para aquela métrica.

Uma configuração inicial razoável é:

```yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: checkout-api
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: checkout-api
  minReplicas: 3
  maxReplicas: 20
  metrics:
    - type: Resource
      resource:
        name: cpu
        target:
          type: Utilization
          averageUtilization: 65
```

Antes de substituir esse sinal, confirme que a aplicação usa CPU de forma proporcional à demanda e que o cluster tem capacidade para receber os novos pods.

## Quando uma métrica customizada ajuda

CPU e memória são sinais indiretos. Uma aplicação pode acumular fila sem elevar CPU, ou consumir memória por cache sem precisar de mais réplicas. Prefira, quando possível:

- itens pendentes por consumidor;
- requisições simultâneas por pod;
- tempo de espera em fila;
- taxa de trabalho por réplica;
- um indicador de saturação relacionado ao SLO.

Neste exemplo usaremos CPU e memória em relação aos limites apenas para mostrar o encadeamento técnico. O sinal é útil para enxergar proximidade de throttling ou OOM, mas tem limitações: nem todo workload define limites, memória nem sempre cai ao adicionar réplicas e um limite mal dimensionado produz uma métrica enganosa.

## Arquitetura

```text
kubelet / aplicação
        ↓ scrape
    Prometheus
        ↓ recording rules
Prometheus Adapter
        ↓ custom.metrics.k8s.io
 HPA controller
        ↓ scale
    Deployment
```

O HPA não consulta Prometheus diretamente. O Prometheus Adapter registra uma API agregada e traduz a consulta do Kubernetes para PromQL.

## 1. Produza séries estáveis no Prometheus

Recording rules reduzem o custo e evitam colocar PromQL extenso na configuração do Adapter. O resultado abaixo é uma razão decimal por `namespace` e `pod`, onde `0.8` significa 80%.

```yaml
groups:
  - name: kubernetes-autoscaling
    interval: 30s
    rules:
      - record: pod_cpu_limit_saturation_ratio
        expr: |
          sum by (namespace, pod) (
            rate(container_cpu_usage_seconds_total{
              container!="", image!=""
            }[5m])
          )
          /
          clamp_min(
            sum by (namespace, pod) (
              container_spec_cpu_quota{
                container!="", image!=""
              }
              /
              container_spec_cpu_period{
                container!="", image!=""
              }
            ),
            0.001
          )

      - record: pod_memory_limit_saturation_ratio
        expr: |
          sum by (namespace, pod) (
            container_memory_working_set_bytes{
              container!="", image!=""
            }
          )
          /
          clamp_min(
            sum by (namespace, pod) (
              container_spec_memory_limit_bytes{
                container!="", image!=""
              } > 0
            ),
            1
          )
```

Os nomes e labels disponíveis variam conforme o runtime, a versão do kubelet e a configuração do scrape. Verifique as séries reais antes de copiar a regra:

```promql
count by (job) (container_cpu_usage_seconds_total)
```

Também exclua containers auxiliares quando eles não representam a capacidade escalável da aplicação.

## 2. Exponha as séries pelo Prometheus Adapter

Uma regra do Adapter precisa descobrir a série, mapear labels para recursos Kubernetes e definir a consulta retornada.

```yaml
rules:
  default: false
  custom:
    - seriesQuery: 'pod_cpu_limit_saturation_ratio{namespace!="",pod!=""}'
      resources:
        overrides:
          namespace: { resource: "namespace" }
          pod: { resource: "pod" }
      name:
        matches: "^(.*)$"
        as: "${1}"
      metricsQuery: 'avg(<<.Series>>{<<.LabelMatchers>>}) by (<<.GroupBy>>)'

    - seriesQuery: 'pod_memory_limit_saturation_ratio{namespace!="",pod!=""}'
      resources:
        overrides:
          namespace: { resource: "namespace" }
          pod: { resource: "pod" }
      name:
        matches: "^(.*)$"
        as: "${1}"
      metricsQuery: 'avg(<<.Series>>{<<.LabelMatchers>>}) by (<<.GroupBy>>)'
```

Depois da instalação, valide a descoberta antes de criar o HPA:

```bash
kubectl get --raw '/apis/custom.metrics.k8s.io/v1beta1' | jq

kubectl get --raw \
  '/apis/custom.metrics.k8s.io/v1beta1/namespaces/default/pods/*/pod_cpu_limit_saturation_ratio' \
  | jq
```

Se a API não aparecer, verifique `APIService`, certificados, conectividade com Prometheus e logs do Adapter. Se a métrica aparecer sem valores, investigue primeiro a `seriesQuery` e os labels.

## 3. Configure o HPA v2

Como a série possui um valor para cada pod, usamos `type: Pods` com `AverageValue`. Quantidades Kubernetes não usam ponto flutuante puro; `800m` representa `0.8`.

```yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: checkout-api
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: checkout-api
  minReplicas: 3
  maxReplicas: 20
  behavior:
    scaleUp:
      stabilizationWindowSeconds: 0
      policies:
        - type: Percent
          value: 100
          periodSeconds: 60
        - type: Pods
          value: 4
          periodSeconds: 60
      selectPolicy: Max
    scaleDown:
      stabilizationWindowSeconds: 300
      policies:
        - type: Percent
          value: 25
          periodSeconds: 60
  metrics:
    - type: Pods
      pods:
        metric:
          name: pod_cpu_limit_saturation_ratio
        target:
          type: AverageValue
          averageValue: "700m"
    - type: Pods
      pods:
        metric:
          name: pod_memory_limit_saturation_ratio
        target:
          type: AverageValue
          averageValue: "800m"
```

Com múltiplas métricas, o controlador calcula uma recomendação para cada uma e usa a maior. Se uma métrica falhar e as demais sugerirem redução, a redução pode ser ignorada; escalar para cima ainda pode ocorrer.

## Um template Helm válido

Mantenha o template simples e valide o manifesto renderizado. A estrutura importante é `pods.target`, não um campo `targetAverageValue` no nível da métrica.

```yaml
{{- if .Values.autoscaling.enabled }}
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: {{ include "checkout.fullname" . }}
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: {{ include "checkout.fullname" . }}
  minReplicas: {{ .Values.autoscaling.minReplicas }}
  maxReplicas: {{ .Values.autoscaling.maxReplicas }}
  metrics:
    {{- range .Values.autoscaling.podMetrics }}
    - type: Pods
      pods:
        metric:
          name: {{ .name }}
        target:
          type: AverageValue
          averageValue: {{ .averageValue | quote }}
    {{- end }}
{{- end }}
```

```yaml
autoscaling:
  enabled: true
  minReplicas: 3
  maxReplicas: 20
  podMetrics:
    - name: pod_cpu_limit_saturation_ratio
      averageValue: 700m
    - name: pod_memory_limit_saturation_ratio
      averageValue: 800m
```

## Validação e operação

Não considere o trabalho concluído quando o YAML for aceito. Valide cada camada:

```bash
helm template checkout ./chart > /tmp/checkout-rendered.yaml
kubectl apply --dry-run=server -f /tmp/checkout-rendered.yaml

kubectl get hpa checkout-api --watch
kubectl describe hpa checkout-api
kubectl get hpa checkout-api -o jsonpath='{.status.conditions}' | jq
```

Em um teste de carga controlado, observe:

1. se a métrica cresce antes da degradação percebida pelo usuário;
2. o tempo entre a decisão, o agendamento e o pod ficar pronto;
3. se há capacidade de nós ou um autoscaler de cluster compatível;
4. oscilações, throttling, OOM kills e backlog durante scale-down;
5. custo e estabilidade após alterar os alvos.

Evite alvos excessivamente próximos do limite. O sistema precisa de margem para picos, atraso de coleta e tempo de inicialização.

## Falhas comuns

- **`<unknown>` no HPA:** a API customizada não respondeu ou não encontrou série para os pods selecionados.
- **Métrica sem pods:** labels `namespace` e `pod` foram removidos ou não foram mapeados pelo Adapter.
- **HPA não escala por CPU:** containers não possuem `requests.cpu` quando a métrica usa `Utilization`.
- **Escala sem efeito:** o gargalo está em banco, fila, lock, I/O ou dependência externa.
- **Flapping:** o sinal é ruidoso, os alvos estão apertados ou falta estabilização no scale-down.
- **Pods pendentes:** aumentar réplicas não cria capacidade no cluster por si só.

## Conclusão

O melhor HPA não é o que possui mais métricas, mas o que reage a um sinal causal e operável. CPU sobre `requests` é um bom ponto de partida; Prometheus Adapter amplia as opções quando fila, concorrência, latência ou saturação descrevem melhor a demanda.

Trate recording rules, Adapter, HPA e capacidade do cluster como um único sistema. Valide a API antes do manifesto, teste com carga realista e ajuste `behavior` com base no tempo de resposta da aplicação.

## Referências

- [Horizontal Pod Autoscaling — Kubernetes](https://kubernetes.io/docs/tasks/run-application/horizontal-pod-autoscale/)
- [Resource metrics pipeline — Kubernetes](https://kubernetes.io/docs/tasks/debug/debug-cluster/resource-metrics-pipeline/)
- [Kubernetes Metrics APIs](https://kubernetes.io/docs/reference/external-api/metrics.v1beta1/)
- [Prometheus Adapter](https://github.com/kubernetes-sigs/prometheus-adapter)
