---
title: "Kubernetes HPA with Custom Metrics: Prometheus Adapter in Practice"
date: "2023-03-18"
description: "A practical guide to exposing Prometheus metrics to Kubernetes and configuring a predictable, observable, and safe HPA v2."
author: "Caio Barbieri"
category: "Kubernetes"
tags: ["Kubernetes", "HPA", "Prometheus", "SRE", "Autoscaling"]
coverImage: "/images/posts/kubernetes-hpa.webp"
published: true
updatedAt: "2026-08-01"
---

The Horizontal Pod Autoscaler looks simple: observe a metric, compare it with a target, and change the replica count. In practice, the outcome depends more on signal quality, declared `requests`, and application behavior than on the HPA manifest itself.

This guide builds the complete path from Prometheus to `autoscaling/v2`, using a per-pod ratio as an example. The same architecture supports better business or SLO signals such as backlog, concurrency, and latency.

> **In short:** start with request-based CPU when it represents load. Add custom metrics when a signal closer to demand exists, and treat limit-based scaling as a diagnostic tool rather than a universal default.

## Before using a custom metric

HPA consumes aggregated metrics APIs:

- `metrics.k8s.io`: CPU and memory, usually provided by Metrics Server;
- `custom.metrics.k8s.io`: metrics associated with Kubernetes objects;
- `external.metrics.k8s.io`: metrics not directly associated with a cluster object.

For a resource metric with `target.type: Utilization`, the percentage is calculated against the resource `request`, not the `limit`. Without `requests.cpu` on the relevant containers, the controller cannot calculate CPU utilization for that metric.

A reasonable starting point is:

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

Before replacing that signal, confirm that application CPU grows with demand and that the cluster can schedule the additional pods.

## When a custom metric helps

CPU and memory are indirect signals. An application may build a queue without raising CPU, or use memory for caching without benefiting from more replicas. Prefer, when available:

- pending items per consumer;
- concurrent requests per pod;
- queue wait time;
- work rate per replica;
- a saturation indicator related to the SLO.

This example uses CPU and memory relative to their limits to demonstrate the integration. The signal can reveal proximity to throttling or OOM, but it has limitations: not every workload defines limits, memory may not fall when replicas are added, and a poorly sized limit produces a misleading metric.

## Architecture

```text
kubelet / application
        ↓ scrape
    Prometheus
        ↓ recording rules
Prometheus Adapter
        ↓ custom.metrics.k8s.io
 HPA controller
        ↓ scale
    Deployment
```

HPA does not query Prometheus directly. Prometheus Adapter registers an aggregated API and translates Kubernetes requests into PromQL.

## 1. Produce stable Prometheus series

Recording rules reduce query cost and keep long PromQL expressions out of the Adapter configuration. The following output is a decimal ratio per `namespace` and `pod`, where `0.8` means 80%.

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

Available names and labels vary with container runtime, kubelet version, and scrape configuration. Inspect the actual series before copying the rule:

```promql
count by (job) (container_cpu_usage_seconds_total)
```

Also exclude sidecars when they do not represent scalable application capacity.

## 2. Expose the series through Prometheus Adapter

An Adapter rule discovers the series, maps labels to Kubernetes resources, and defines the returned query.

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

After installation, validate discovery before creating the HPA:

```bash
kubectl get --raw '/apis/custom.metrics.k8s.io/v1beta1' | jq

kubectl get --raw \
  '/apis/custom.metrics.k8s.io/v1beta1/namespaces/default/pods/*/pod_cpu_limit_saturation_ratio' \
  | jq
```

If the API is missing, inspect the `APIService`, certificates, Prometheus connectivity, and Adapter logs. If the metric exists without values, investigate the `seriesQuery` and labels first.

## 3. Configure HPA v2

Because the series has one value per pod, use `type: Pods` with `AverageValue`. Kubernetes quantities do not use plain floating point; `800m` represents `0.8`.

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

With multiple metrics, the controller calculates a recommendation for each and selects the largest. If one metric fails while the others recommend scaling down, scale-down may be skipped; scale-up may still happen.

## A valid Helm template

Keep the template small and validate the rendered manifest. The important structure is `pods.target`, not a `targetAverageValue` field beside the metric.

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

## Validation and operations

Do not consider the work complete when the YAML is accepted. Validate every layer:

```bash
helm template checkout ./chart > /tmp/checkout-rendered.yaml
kubectl apply --dry-run=server -f /tmp/checkout-rendered.yaml

kubectl get hpa checkout-api --watch
kubectl describe hpa checkout-api
kubectl get hpa checkout-api -o jsonpath='{.status.conditions}' | jq
```

During a controlled load test, observe:

1. whether the metric rises before user-visible degradation;
2. the delay between decision, scheduling, and pod readiness;
3. whether node capacity or a compatible cluster autoscaler exists;
4. oscillation, throttling, OOM kills, and backlog during scale-down;
5. cost and stability after changing targets.

Avoid targets too close to a hard limit. The system needs headroom for spikes, collection delays, and startup time.

## Common failures

- **`<unknown>` in HPA:** the custom API did not answer or found no series for the selected pods.
- **Metric without pods:** `namespace` and `pod` labels were removed or not mapped by the Adapter.
- **HPA does not scale on CPU:** containers lack `requests.cpu` while the metric uses `Utilization`.
- **Scaling has no effect:** the bottleneck is a database, queue, lock, I/O, or external dependency.
- **Flapping:** the signal is noisy, targets are too tight, or scale-down stabilization is missing.
- **Pending pods:** increasing replicas does not create cluster capacity by itself.

## Conclusion

The best HPA is not the one with the most metrics; it is the one reacting to a causal and operable signal. Request-based CPU is a good starting point. Prometheus Adapter expands the options when queue depth, concurrency, latency, or saturation better describes demand.

Treat recording rules, Adapter, HPA, and cluster capacity as one system. Validate the API before the manifest, test with realistic load, and tune `behavior` according to application response time.

## References

- [Horizontal Pod Autoscaling — Kubernetes](https://kubernetes.io/docs/tasks/run-application/horizontal-pod-autoscale/)
- [Resource metrics pipeline — Kubernetes](https://kubernetes.io/docs/tasks/debug/debug-cluster/resource-metrics-pipeline/)
- [Kubernetes Metrics APIs](https://kubernetes.io/docs/reference/external-api/metrics.v1beta1/)
- [Prometheus Adapter](https://github.com/kubernetes-sigs/prometheus-adapter)
