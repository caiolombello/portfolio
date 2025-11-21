---
title: "Kubernetes HPA: Métricas Personalizadas para Escalonamento Eficaz de CPU e Memória"
date: "2023-03-18"
description: "Desbloqueie todo o potencial do Horizontal Pod Autoscaling no Kubernetes. Aprenda a usar métricas personalizadas para um escalonamento mais eficaz."
author: "Caio Barbieri"
tags: ["Kubernetes", "HPA", "Prometheus", "DevOps", "Autoscaling"]
coverImage: "/images/posts/kubernetes-hpa.webp"
---

## Introdução e Resumo

O Kubernetes tornou-se o padrão de fato para orquestração de contêineres, fornecendo uma plataforma poderosa para gerenciar aplicações em contêineres em escala. Um recurso essencial do Kubernetes é sua capacidade de autoescalonamento, que permite que as aplicações aumentem ou diminuam com base na carga de trabalho e métricas de desempenho. Neste artigo, exploraremos o Horizontal Pod Autoscaler (HPA), um componente chave do autoescalonamento do Kubernetes. Vamos mergulhar nos fundamentos do HPA, como ele funciona e como você pode melhorar seu desempenho usando métricas personalizadas e limites de recursos. Ao final deste artigo, você terá um entendimento sólido do HPA e como configurá-lo para otimizar suas implantações no Kubernetes.

## Autoescalonamento no Kubernetes

O autoescalonamento é um recurso crítico dos sistemas modernos de orquestração de contêineres, permitindo que as aplicações ajustem automaticamente seus recursos com base na demanda e métricas de desempenho. Esse escalonamento dinâmico permite que os sistemas mantenham o desempenho e a eficiência ideais, minimizando os custos operacionais.

No Kubernetes, o autoescalonamento pode ser implementado em diferentes níveis:

*   **Cluster Autoscaler**: Este componente escala todo o cluster Kubernetes adicionando ou removendo nós do cluster com base na utilização de recursos e demanda.
*   **Horizontal Pod Autoscaler (HPA)**: O HPA ajusta o número de réplicas para uma implantação específica ou stateful set com base em métricas de desempenho pré-definidas, como utilização de CPU, uso de memória ou métricas personalizadas.
*   **Vertical Pod Autoscaler (VPA)**: O VPA ajusta automaticamente as solicitações e limites de CPU e memória de contêineres individuais dentro de um pod, com base em padrões históricos de uso e demandas atuais de recursos.

### A importância do autoescalonamento

O autoescalonamento oferece inúmeros benefícios na manutenção de um sistema eficiente e resiliente, incluindo:

*   **Otimização de recursos**: O autoescalonamento garante que sua aplicação use a quantidade certa de recursos para atender aos seus requisitos de desempenho, reduzindo o risco de superprovisionamento ou subprovisionamento.
*   **Eficiência de custos**: Ao ajustar automaticamente os recursos de acordo com a carga de trabalho, você pode minimizar os custos de infraestrutura, pois paga apenas pelos recursos que realmente precisa.
*   **Confiabilidade aprimorada**: O autoescalonamento ajuda a manter a disponibilidade e o desempenho de suas aplicações, escalando durante períodos de alta demanda e reduzindo quando a demanda diminui, prevenindo gargalos potenciais ou falhas no sistema.
*   **Experiência do usuário aprimorada**: Ao garantir que suas aplicações tenham os recursos necessários para lidar com cargas de trabalho variadas, o autoescalonamento pode melhorar a experiência geral do usuário, reduzindo a latência e mantendo um desempenho consistente.

## Horizontal Pod Autoscaler (HPA) no Kubernetes

O mecanismo básico de funcionamento do Horizontal Pod Autoscaler (HPA) no Kubernetes envolve monitoramento, políticas de escalonamento e o Kubernetes Metrics Server. Vamos detalhar cada componente:

### 1. Monitoramento

O HPA monitora continuamente as métricas dos pods implantados em um cluster Kubernetes. Por padrão, o HPA monitora a utilização da CPU, mas também pode ser configurado para monitorar o uso de memória, métricas personalizadas ou outras métricas por pod.

Para métricas de recursos por pod, como CPU, o HPA busca métricas da API de métricas de recursos para cada pod direcionado. Com base na utilização alvo ou valores brutos, o controlador calcula uma taxa de escalonamento a partir da média desses valores em todos os pods direcionados. Se alguns contêineres não tiverem solicitações de recursos relevantes, a utilização da CPU não será definida e o autoescalonamento não ocorrerá para essa métrica.

Para métricas personalizadas por pod, o controlador opera de forma semelhante, mas usa valores brutos em vez de valores de utilização.

Para métricas de objeto e externas, o HPA busca uma única métrica descrevendo o objeto, compara-a com o valor alvo e gera uma taxa de escalonamento. Na versão da API autoscaling/v2, esse valor pode ser dividido pelo número de pods antes da comparação.

Essas métricas são coletadas e relatadas pelo Kubernetes Metrics Server, que agrega dados de uso de recursos do kubelet em execução em cada nó.

### 2. Políticas de Escalonamento

Ao configurar o HPA, você define políticas de escalonamento que determinam como o autoscaler deve reagir às mudanças nas métricas. Essas políticas incluem:

*   **Valor da métrica alvo**: Este é o valor desejado para a métrica que você deseja que o HPA mantenha. Por exemplo, você pode definir uma utilização de CPU alvo de 50% para garantir que seus pods não fiquem sobrecarregados nem subutilizados.
*   **Réplicas mínimas e máximas**: Esses valores definem o número mínimo e máximo de réplicas que o HPA pode escalar sua implantação. Isso evita o escalonamento excessivo, que pode levar à sobrecarga do cluster ou ao consumo excessivo de recursos.

### 3. Decisões de Escalonamento

O HPA usa as métricas coletadas e as políticas de escalonamento definidas para tomar decisões de escalonamento. Se a métrica monitorada exceder o valor alvo, o HPA aumentará o número de réplicas na implantação ou stateful set para distribuir a carga de forma mais uniforme. Por outro lado, se a métrica cair abaixo do valor alvo, o HPA reduzirá o número de réplicas para economizar recursos.

### 4. Kubernetes Metrics Server

O Kubernetes Metrics Server é um agregador de dados de uso de recursos em todo o cluster. Ele coleta dados do kubelet em cada nó e fornece métricas para o HPA e outros componentes que requerem informações de uso de recursos. O Metrics Server é um componente essencial para habilitar o autoescalonamento e outros recursos que dependem de métricas em tempo real no Kubernetes.

Em resumo, o Horizontal Pod Autoscaler no Kubernetes funciona monitorando continuamente as métricas dos pods, aplicando políticas de escalonamento com base em valores alvo e limites de réplicas, e tomando decisões de escalonamento para manter a utilização ideal de recursos. O Kubernetes Metrics Server desempenha um papel crucial no fornecimento dos dados necessários para o HPA tomar decisões informadas.

## Métricas Personalizadas no HPA

Métricas personalizadas são indicadores de desempenho definidos pelo usuário que estendem as métricas de recursos padrão (por exemplo, CPU e memória) suportadas pelo Horizontal Pod Autoscaler (HPA) no Kubernetes. Por padrão, o HPA baseia suas decisões de escalonamento nas solicitações de recursos do pod, que representam os recursos mínimos necessários para o pod ser executado. No entanto, essa abordagem pode não ser ideal para o desempenho ideal. Em vez disso, muitas vezes é mais benéfico escalar com base nos limites de recursos, pois isso garante que sua aplicação não atinja suas restrições máximas de recursos. Métricas personalizadas permitem decisões de autoescalonamento mais granulares e específicas da aplicação, levando a uma melhor utilização de recursos e desempenho do sistema.

### Por que Métricas Personalizadas são Necessárias

Embora as métricas padrão fornecidas pelo Kubernetes, como uso de CPU e memória com base em solicitações de recursos, sejam úteis para muitos cenários, elas podem não ser suficientes para todas as aplicações. Escalar com base em limites de recursos garante que sua aplicação possa lidar com cargas de trabalho variadas sem atingir seus recursos máximos permitidos. Métricas personalizadas permitem que você adapte o comportamento de escalonamento do HPA com base nas necessidades específicas de sua aplicação, permitindo um autoescalonamento mais preciso e eficiente.

### Usando Métricas Personalizadas no HPA

Para usar métricas personalizadas no HPA, você precisa:

1.  Garantir que seu cluster esteja configurado para suportar métricas personalizadas. Isso geralmente envolve a implantação de um servidor de API de métricas personalizadas e a configuração das ferramentas de monitoramento necessárias, como o Prometheus.
2.  Definir métricas personalizadas no código da sua aplicação, se necessário, e expô-las por meio de um endpoint apropriado.
3.  Configurar o HPA para usar as métricas personalizadas especificando-as no manifesto do HPA.

### Exemplos de Métricas Personalizadas e Seus Casos de Uso

1.  **Taxa de requisições**: Para aplicações onde o número de requisições recebidas tem um impacto significativo no consumo de recursos, você pode definir uma métrica personalizada com base na taxa de requisições. Isso permite que o HPA escale o número de réplicas com base na carga de trabalho real, em vez de apenas no uso de CPU ou memória.
    *   *Caso de uso*: Um gateway de API que precisa lidar com níveis variados de tráfego de entrada.

2.  **Tamanho da fila**: Para aplicações que processam tarefas de uma fila, você pode criar uma métrica personalizada com base no tamanho da fila. Isso permite que o HPA escale a aplicação com base no backlog de tarefas, garantindo que a capacidade de processamento corresponda à carga de trabalho.
    *   *Caso de uso*: Um serviço de processamento de tarefas em segundo plano que consome tarefas de uma fila de mensagens.

3.  **Métricas específicas da aplicação**: Você pode ter indicadores de desempenho exclusivos específicos para sua aplicação, como o número de sessões de usuário ativas ou a taxa de transações de banco de dados. Criar métricas personalizadas com base nesses indicadores pode ajudar o HPA a tomar decisões de escalonamento mais informadas e adaptadas ao comportamento da sua aplicação.
    *   *Caso de uso*: Uma plataforma de e-commerce que experimenta flutuações na atividade do usuário e precisa escalar seus serviços de acordo.

Em resumo, métricas personalizadas no HPA permitem um autoescalonamento mais preciso e específico da aplicação, estendendo as métricas de recursos padrão suportadas pelo Kubernetes. Ao aproveitar métricas personalizadas, você pode otimizar a utilização de recursos e o desempenho para uma gama mais ampla de aplicações e casos de uso.

## Configurando o HPA com Limites de CPU e Memória

Definir limites de CPU e memória para sua aplicação é crucial por vários motivos:

*   **Gerenciamento de recursos**: Ao especificar limites de recursos, você evita que pods ou contêineres individuais consumam recursos excessivos, o que poderia afetar outras cargas de trabalho em execução no mesmo cluster.
*   **Desempenho previsível**: Definir limites garante que sua aplicação tenha recursos suficientes para ter um desempenho ideal sob cargas de trabalho variadas, minimizando as chances de degradação do desempenho.
*   **Otimização de custos**: Ao limitar o uso de recursos, você pode evitar despesas desnecessárias com recursos de nuvem ou hardware local.
*   **Autoescalonamento eficiente**: Limites de recursos configurados corretamente permitem que o Horizontal Pod Autoscaler (HPA) tome melhores decisões de escalonamento, garantindo que sua aplicação aumente ou diminua com base nas necessidades reais de recursos.

### Guia Passo a Passo para Configurar o HPA com Métricas Personalizadas e Limites de Recursos

1.  **Configure o Prometheus**. Minha recomendação é usar o Helm Chart `kube-prometheus-stack`, que implanta o cAdvisor e outros componentes necessários.

2.  **Crie métricas personalizadas no Prometheus** para monitorar o uso de CPU e memória com base nos limites de recursos. Adicione os seguintes exemplos à sua configuração do Prometheus:

    **Exemplo de métrica personalizada de Limites de Uso de CPU:**

    ```yaml
    - record: pod:cpu_usage_percentage:ratio
      expr: |
        sum by (pod, namespace) (
          node_namespace_pod_container:container_cpu_usage_seconds_total:sum_irate{cluster="",namespace!="",pod!=""}
        )
        /
        sum by (pod, namespace) (
          kube_pod_container_resource_limits{cluster="",job="kube-state-metrics",namespace!="",pod!="",resource="cpu"}
        ) * 100
    ```

    **Exemplo de métrica personalizada de Limites de Uso de Memória:**

    ```yaml
    - record: pod:memory_usage_percentage:ratio
      expr: |
        sum by (pod, namespace) (
          container_memory_working_set_bytes{cluster="",container!="",image!="",job="kubelet",metrics_path="/metrics/cadvisor",namespace!="",pod!=""}
        )
        /
        sum by (pod, namespace) (
          kube_pod_container_resource_limits{cluster="",job="kube-state-metrics",namespace!="",pod!="",resource="memory"}
        ) * 100
    ```

3.  **Configure o Chart do Prometheus Adapter** que substituirá o Kubernetes Metrics-Server padrão.

4.  **Configure o Prometheus Adapter** para usar métricas do Prometheus:

    ```yaml
    prometheus:
      url: http://prometheus.monitoring.svc
      port: 9090
    ```

5.  **Adicione métricas personalizadas ao Prometheus Adapter** (essas métricas serão encontradas no Prometheus):

    ```yaml
    rules:
      default: true
      custom:
        - seriesQuery: 'pod:memory_usage_percentage:ratio{namespace!="",pod!=""}'
          resources:
            overrides:
              namespace: {resource: "namespace"}
              pod: {resource: "pod"}
          metricsQuery: '<<.Series>>{<<.LabelMatchers>>} / 100'

        - seriesQuery: 'pod:cpu_usage_percentage:ratio{namespace!="",pod!=""}'
          resources:
            overrides:
              namespace: {resource: "namespace"}
              pod: {resource: "pod"}
          metricsQuery: '<<.Series>>{<<.LabelMatchers>>} / 100'
    ```

    Você pode encontrar mais informações sobre as regras do Prometheus Adapter na documentação oficial.

6.  **Para métricas de recursos**, você pode personalizar consultas para coletar CPU e memória:

    ```yaml
    resource:
      cpu:
        containerQuery: |
          sum by (<<.GroupBy>>) (
            rate(container_cpu_usage_seconds_total{container!="",<<.LabelMatchers>>}[3m])
          )
        nodeQuery: |
          sum  by (<<.GroupBy>>) (
            rate(node_cpu_seconds_total{mode!="idle",mode!="iowait",mode!="steal",<<.LabelMatchers>>}[3m])
          )
        resources:
          overrides:
            node:
              resource: node
            namespace:
              resource: namespace
            pod:
              resource: pod
        containerLabel: container
      memory:
        containerQuery: |
          sum by (<<.GroupBy>>) (
            avg_over_time(container_memory_working_set_bytes{container!="",<<.LabelMatchers>>}[3m])
          )
        nodeQuery: |
          sum by (<<.GroupBy>>) (
            avg_over_time(node_memory_MemTotal_bytes{<<.LabelMatchers>>}[3m])
            -
            avg_over_time(node_memory_MemAvailable_bytes{<<.LabelMatchers>>}[3m])
          )
        resources:
          overrides:
            node:
              resource: node
            namespace:
              resource: namespace
            pod:
              resource: pod
        containerLabel: container
      window: 3m
    ```

7.  **Implante o Prometheus Adapter**

    ```bash
    helm repo add --force-update prometheus-community https://prometheus-community.github.io/helm-charts

    helm upgrade --install -n monitoring \
    prometheus-adapter prometheus-community/prometheus-adapter --version 4.1.1 -f metrics-server.yaml
    ```

8.  **Verificando se a métrica personalizada foi aplicada com sucesso**

    ```bash
    kubectl get --raw "/apis/custom.metrics.k8s.io/v1beta1/" | jq
    ```

9.  **Para demonstração, implante o NGINX com limites e solicitações de recursos definidos:**

    ```bash
    helm repo add --force-update bitnami https://charts.bitnami.com/bitnami

    helm upgrade --install \
    --set resources.limits.cpu=100m \
    --set resources.limits.memory=128Mi \
    --set resources.requests.cpu=50m \
    --set resources.requests.memory=64Mi \
    nginx bitnami/nginx --version 13.2.29
    ```

10. **Aplique o HPA com Métricas Personalizadas**

    ```yaml
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
            averageValue: 0.8 # 80%
      - type: Pods
        pods:
          metric:
            name: pod:cpu_usage_percentage:ratio
          target:
            type: Utilization
            averageValue: 0.8 # 80%
    ```

    ```bash
    kubectl apply -f demo/nginx-hpa.yaml
    ```

    No Helm Chart, um modelo de HPA ficaria assim:
    `templates/hpa.yaml`

    ```yaml
    {{- if .Values.autoscaling.enabled }}
    apiVersion: autoscaling/v2
    kind: HorizontalPodAutoscaler
    metadata:
      name: {{ include "app.fullname" . }}
      labels:
        {{- include "app.labels" . | nindent 4 }}
    spec:
      scaleTargetRef:
        apiVersion: apps/v1
        kind: Deployment
        name: {{ include "app.fullname" . }}
      minReplicas: {{ .Values.autoscaling.minReplicas }}
      maxReplicas: {{ .Values.autoscaling.maxReplicas }}
      metrics:
        {{- if .Values.autoscaling.targetCPUUtilizationPercentage }}
        - type: Pods
          pods:
            metric:
              name: pod:cpu_usage_percentage:ratio
              averageValue: {{- div .Values.autoscaling.targetCPUUtilizationPercentage 100 -}}
          {{- end }}
          {{- if .Values.autoscaling.targetMemoryUtilizationPercentage }}
        - type: Pods
          pods:
            metric:
              name: pod:memory_usage_percentage:ratio
              averageValue: {{- div .Values.autoscaling.targetMemoryUtilizationPercentage 100 -}}
        {{- end }}
    {{- end }}
    ```

    `values.yaml`

    ```yaml
    autoscaling:
      enabled: true
      minReplicas: 1
      maxReplicas: 2
      targetCPUUtilizationPercentage: 80
      targetMemoryUtilizationPercentage: 80
    ```

11. **Verifique se o HPA está funcionando:**

    ```bash
    kubectl get hpa nginx-hpa
    ```

## Conclusão

Neste artigo, exploramos a importância do Kubernetes Horizontal Pod Autoscaler (HPA) para gerenciar efetivamente os recursos e a escalabilidade de suas aplicações. Discutimos as limitações do HPA padrão, que depende das solicitações de recursos do pod, e os benefícios de usar métricas personalizadas com base em limites de recursos para um melhor desempenho.

Ao configurar o Prometheus e o Prometheus Adapter, demonstramos como criar métricas personalizadas para uso de CPU e memória e configurar o HPA para usar essas métricas para um autoescalonamento mais preciso. Seguindo o guia passo a passo, você pode implementar esses conceitos e técnicas para otimizar o uso de recursos de suas aplicações e melhorar seu desempenho geral.

Eu encorajo você a aplicar esses princípios e técnicas às suas implantações no Kubernetes e experimentar as vantagens de um autoescalonamento eficiente e resiliente com base em métricas personalizadas. Bom escalonamento!
