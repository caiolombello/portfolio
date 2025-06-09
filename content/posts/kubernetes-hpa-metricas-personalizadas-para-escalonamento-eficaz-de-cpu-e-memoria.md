---
title_pt: "Kubernetes HPA: Métricas Personalizadas para Escalonamento Eficaz de CPU e Memória"
title_en: "Kubernetes HPA: Custom Metrics for Effective CPU & Memory Scaling"
summary_pt: "Explore o Horizontal Pod Autoscaler (HPA) do Kubernetes e aprenda a usar métricas personalizadas para otimizar o escalonamento de CPU e memória."
summary_en: "Explore the Kubernetes Horizontal Pod Autoscaler (HPA) and learn how to use custom metrics to optimize CPU and memory scaling."
publicationDate: "2023-03-18"
category: "Kubernetes"
tags: ["kubernetes","hpa","prometheus","metrics-server","custom-metrics","autoscaling"]
published: true
coverImage: "/images/hpa.webp"
author:
  name: "Caio Barbieri"
  avatar: ""
---

# Kubernetes HPA: Métricas Personalizadas para Escalonamento Eficaz de CPU e Memória

## Introdução e Resumo

Kubernetes é o padrão para orquestração de contêineres, oferecendo um ambiente robusto para gerenciar aplicações em escala. Uma funcionalidade essencial é o autoscaling, que ajusta recursos conforme métricas de desempenho. Neste artigo, você vai:

1. Entender o HPA (Horizontal Pod Autoscaler).  
2. Ver como funciona o monitoramento e as políticas de escalonamento.  
3. Aprender a criar métricas personalizadas via Prometheus e Adapter.  
4. Configurar um HPA otimizado para CPU e memória.

## Autoscaling no Kubernetes

Autoscaling ajusta automaticamente recursos conforme demanda, garantindo:

- **Otimização de recursos**: evita sub ou superalocação.  
- **Redução de custos**: paga-se apenas pelo que usa.  
- **Confiabilidade**: mantém desempenho estável.  
- **Melhor experiência**: baixa latência e alta disponibilidade.

Níveis de autoscaling:

1. **Cluster Autoscaler** – adiciona/ remove nós.  
2. **Horizontal Pod Autoscaler (HPA)** – ajusta réplicas de deployments.  
3. **Vertical Pod Autoscaler (VPA)** – ajusta requests/limits de contêineres.

## Horizontal Pod Autoscaler (HPA) no Kubernetes

### 1. Monitoramento

- Por padrão, monitora **CPU** via Metrics Server.  
- Pode usar **memória**, **métricas customizadas** e **externas**.  
- Coleta dados, calcula média e gera razão de escala.

### 2. Políticas de Escalonamento

- **Valor-alvo** (ex.: CPU a 50%).  
- **Réplicas mínimas/máximas** para evitar excessos.

### 3. Decisões de Escalonamento

- Acima do alvo → aumenta réplicas.  
- Abaixo do alvo → reduz réplicas.

### 4. Kubernetes Metrics Server

Agrega dados de uso de recursos do kubelet, vital para HPA.

## Métricas Personalizadas no HPA

### Por que usar métricas personalizadas

- Métricas padrão (requests) são genéricas.  
- Métricas baseadas em **limits** evitam “teto” de consumo.  
- Proporcionam **escala mais precisa**.

### Exemplos de métricas

- **Taxa de requisições** (API gateways).  
- **Tamanho da fila** (processamento de jobs).  
- **Indicadores de aplicação** (sessões ativas, TPS).

### Como implementar

1. Instale Prometheus + Adapter.  
2. Defina e exponha métricas no Prometheus.  
3. Configure o HPA manifest com `metrics` customizadas.

## Configurando HPA com Limites de CPU e Memória

1. **Instalar Prometheus**  
   ```bash
   helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
   helm upgrade --install monitoring kube-prometheus-stack prometheus-community/kube-prometheus-stack
   ```

2. Criar métricas no Prometheus
    ```bash
    - record: pod:cpu_usage_percentage:ratio
      expr: |
        sum by(pod, namespace)(rate(container_cpu_usage_seconds_total[3m]))
        /
        sum by(pod, namespace)(kube_pod_container_resource_limits{resource="cpu"}) * 100
    - record: pod:memory_usage_percentage:ratio
      expr: |
        sum by(pod, namespace)(avg_over_time(container_memory_working_set_bytes[3m]))
        /
        sum by(pod, namespace)(kube_pod_container_resource_limits{resource="memory"}) * 100
    ```

3. Configurar Prometheus Adapter (`metrics-server.yaml`)
    ```bash
    prometheus:
      url: http://prometheus.monitoring.svc
      port: 9090
    rules:
      seriesQuery: 'pod:cpu_usage_percentage:ratio{namespace!="",pod!=""}'
      resources:
        overrides:
          namespace: {resource: "namespace"}
          pod: {resource: "pod"}
      metricsQuery: '<<.Series>>{<<.LabelMatchers>>} / 100'
    # Repita para memória
    ```

4. Deploy do Adapter
    ```bash
    helm upgrade --install -n monitoring prometheus-adapter prometheus-community/prometheus-adapter --version 4.1.1 -f metrics-server.yaml
    ```

5. Verificar métrica
    ```bash
    kubectl get --raw "/apis/custom.metrics.k8s.io/v1beta1/" | jq
    ```

6. Deploy de exemplo (NGINX)
    ```bash
    helm repo add bitnami https://charts.bitnami.com/bitnami
    helm upgrade --install nginx bitnami/nginx \
      --set resources.requests.cpu=50m,resources.limits.cpu=100m \
      --set resources.requests.memory=64Mi,resources.limits.memory=128Mi --version 13.2.29
    ```

7. HPA com métricas customizadas
    ```bash
    apiVersion: autoscaling/v2
    kind: HorizontalPodAutoscaler
    metadata:
      name: nginx-hpa
    spec:
      scaleTargetRef:
        apiVersion: apps/v1
        kind: Deployment
        name: nginx
      minReplicas: 1
      maxReplicas: 10
      metrics:
        - type: Pods
          pods:
            metric:
              name: pod:memory_usage_percentage:ratio
            target:
              type: Utilization
              averageValue: 80
        - type: Pods
          pods:
            metric:
              name: pod:cpu_usage_percentage:ratio
            target:
              type: Utilization
              averageValue: 80
    ```

8. Verificar HPA
    ```bash
    kubectl get hpa nginx-hpa
    ```

## Conclusão

Você configurou um HPA baseado em métricas personalizadas e limites de recursos, otimizando o escalonamento de CPU e memória. Aplique em um cluster de teste e valide as métricas para garantir:

- **Eficiência** de recursos
- **Desempenho** consistente
- **Redução** de custos