# Kubernetes

Magistrala can be easily deployed on Kubernetes platform by using Helm Chart from official [Magistrala DevOps GitHub repository][devops-repo].

## Prerequisites

- Kubernetes
- kubectl
- Helm v3
- Stable Helm repository
- Nginx Ingress Controller

### Kubernetes

Kubernetes is an open source container orchestration engine for automating deployment, scaling, and management of containerised applications. Install it locally or have access to a cluster. Follow [these instructions][kubernetes-setup] if you need more information.

### Kubectl

Kubectl is official Kubernetes command line client. Follow [these instructions][kubectl-setup] to install it.

Regarding the cluster control with `kubectl`, default config `.yaml` file should be `~/.kube/config`.

### Helm v3

Helm is the package manager for Kubernetes. Follow [these instructions][helm-setup] to install it.

### Stable Helm Repository

Add a stable chart repository:

```bash
helm repo add stable https://charts.helm.sh/stable
```

Add a bitnami chart repository:

```bash
helm repo add bitnami https://charts.bitnami.com/bitnami
```

### Nginx Ingress Controller

Follow [these instructions][nginx-ingress] to install it or:

```bash
helm install ingress-nginx ingress-nginx/ingress-nginx --version 3.26.0 --create-namespace -n ingress-nginx
```

## Deploying Magistrala

Get Helm charts from [Magistrala DevOps GitHub repository][devops-repo]:

```bash
git clone https://github.com/absmach/devops.git
cd devops/charts/mainflux
```

Update the on-disk dependencies to mirror Chart.yaml:

```bash
helm dependency update
```

If you didn't already have namespace created you should do it with:

```bash
kubectl create namespace mg
```

Deploying release named `magistrala` in namespace named `mg` is done with just:

```bash
helm install magistrala . -n mg
```

Magistrala is now deployed on your Kubernetes.

### Customizing Installation

You can override default values while installing with `--set` option. For example, if you want to specify ingress hostname and pull `latest` tag of `users` image:

```bash
helm install magistrala -n mg --set ingress.hostname='example.com' --set users.image.tag='latest'
```

Or if release is already installed, you can update it:

```bash
helm upgrade magistrala -n mg --set ingress.hostname='example.com' --set users.image.tag='latest'
```

The following table lists the configurable parameters and their default values.

| Parameter                          | Description                                                                                     | Default          |
| ---------------------------------- | ----------------------------------------------------------------------------------------------- | ---------------- |
| defaults.logLevel                  | Log level                                                                                       | debug            |
| defaults.image.pullPolicy          | Docker Image Pull Policy                                                                        | IfNotPresent     |
| defaults.image.repository          | Docker Image Repository                                                                         | magistrala       |
| defaults.image.tag                 | Docker Image Tag                                                                                | 0.13.0           |
| defaults.replicaCount              | Replicas of MQTT adapter, Things, Envoy and Authn                                               | 3                |
| defaults.messageBrokerUrl          | Message broker URL, the default is NATS Url                                                     | nats://nats:4222 |
| defaults.jaegerPort                | Jaeger port                                                                                     | 6831             |
| nginxInternal.mtls.tls             | TLS secret which contains the server cert/key                                                   |                  |
| nginxInternal.mtls.intermediateCrt | Generic secret which contains the intermediate cert used to verify clients                      |                  |
| ingress.enabled                    | Should the Nginx Ingress be created                                                             | true             |
| ingress.hostname                   | Hostname for the Nginx Ingress                                                                  |                  |
| ingress.tls.hostname               | Hostname of the Nginx Ingress certificate                                                       |                  |
| ingress.tls.secret                 | TLS secret for the Nginx Ingress                                                                |                  |
| messageBroker.maxPayload           | Maximum payload size in bytes that the Message Broker server, if it is NATS, server will accept | 268435456        |
| messageBroker.replicaCount         | Message Broker replicas                                                                         | 3                |
| users.dbPort                       | Users service DB port                                                                           | 5432             |
| users.httpPort                     | Users service HTTP port                                                                         | 9000             |
| things.dbPort                      | Things service DB port                                                                          | 5432             |
| things.httpPort                    | Things service HTTP port                                                                        | 9001             |
| things.authGrpcPort                | Things service Auth gRPC port                                                                   | 7000             |
| things.authHttpPort                | Things service Auth HTTP port                                                                   | 9002             |
| things.redisESPort                 | Things service Redis Event Store port                                                           | 6379             |
| things.redisCachePort              | Things service Redis Auth Cache port                                                            | 6379             |
| adapter_http.httpPort              | HTTP adapter port                                                                               | 8185             |
| mqtt.proxy.mqttPort                | MQTT adapter proxy port                                                                         | 1884             |
| mqtt.proxy.wsPort                  | MQTT adapter proxy WS port                                                                      | 8081             |
| mqtt.broker.mqttPort               | MQTT adapter broker port                                                                        | 1883             |
| mqtt.broker.wsPort                 | MQTT adapter broker WS port                                                                     | 8080             |
| mqtt.broker.persistentVolume.size  | MQTT adapter broker data Persistent Volume size                                                 | 5Gi              |
| mqtt.redisESPort                   | MQTT adapter Event Store port                                                                   | 6379             |
| mqtt.redisCachePort                | MQTT adapter Redis Auth Cache port                                                              | 6379             |
| adapter_coap.udpPort               | CoAP adapter UDP port                                                                           | 5683             |
| ui.port                            | UI port                                                                                         | 3000             |
| bootstrap.enabled                  | Enable bootstrap service                                                                        | false            |
| bootstrap.dbPort                   | Bootstrap service DB port                                                                       | 5432             |
| bootstrap.httpPort                 | Bootstrap service HTTP port                                                                     | 9013             |
| bootstrap.redisESPort              | Bootstrap service Redis Event Store port                                                        | 6379             |
| influxdb.enabled                   | Enable InfluxDB reader & writer                                                                 | false            |
| influxdb.dbPort                    | InfluxDB port                                                                                   | 8086             |
| influxdb.writer.httpPort           | InfluxDB writer HTTP port                                                                       | 9006             |
| influxdb.reader.httpPort           | InfluxDB reader HTTP port                                                                       | 9005             |
| adapter_opcua.enabled              | Enable OPC-UA adapter                                                                           | false            |
| adapter_opcua.httpPort             | OPC-UA adapter HTTP port                                                                        | 8188             |
| adapter_opcua.redisRouteMapPort    | OPC-UA adapter Redis Auth Cache port                                                            | 6379             |
| adapter_lora.enabled               | Enable LoRa adapter                                                                             | false            |
| adapter_lora.httpPort              | LoRa adapter HTTP port                                                                          | 8187             |
| adapter_lora.redisRouteMapPort     | LoRa adapter Redis Auth Cache port                                                              | 6379             |
| twins.enabled                      | Enable twins service                                                                            | false            |
| twins.dbPort                       | Twins service DB port                                                                           | 27017            |
| twins.httpPort                     | Twins service HTTP port                                                                         | 9021             |
| twins.redisCachePort               | Twins service Redis Cache port                                                                  | 6379             |

All Magistrala services (both core and add-ons) can have their `logLevel`, `image.pullPolicy`, `image.repository` and `image.tag` overridden.

Magistrala Core is a minimalistic set of required Magistrala services. They are all installed by default:

- authn
- users
- things
- adapter_http
- adapter_mqtt
- adapter_coap
- ui

Magistrala Add-ons are optional services that are disabled by default. Find in Configuration table parameters for enabling them, i.e. to enable influxdb reader & writer you should run `helm install` with `--set influxdb=true`.
List of add-ons services in charts:

- bootstrap
- influxdb.writer
- influxdb.reader
- adapter_opcua
- adapter_lora
- twins

By default scale of MQTT adapter, Things, Envoy, Authn and the Message Broker will be set to 3. It's recommended that you set this values to number of your nodes in Kubernetes cluster, i.e. `--set defaults.replicaCount=3 --set messageBroker.replicaCount=3`

### Additional Steps to Configure Ingress Controller

To send MQTT messages to your host on ports `1883` and `8883` some additional steps are required in configuring NGINX Ingress Controller.

NGINX Ingress Controller uses ConfigMap to expose TCP and UDP services. That ConfigMaps are included in helm chart in [ingress.yaml][ingress-yaml] file assuming that location of ConfigMaps should be `ingress-nginx/tcp-services` and `ingress-nginx/udp-services`. These locations was set with `--tcp-services-configmap` and `--udp-services-configmap` flags and you can check it in deployment of Ingress Controller or add it there in [args section for nginx-ingress-controller][ingress-controller-args] if it's not already specified. This is explained in [NGINX Ingress documentation][ingress-controller-tcp-udp]

Also, these three ports need to be exposed in the Service defined for the Ingress. You can do that with command that edit your service:

`kubectl edit svc -n ingress-nginx nginx-ingress-ingress-nginx-controller`

and add in spec->ports:

```yaml
- name: mqtt
  port: 1883
  protocol: TCP
  targetPort: 1883
- name: mqtts
  port: 8883
  protocol: TCP
  targetPort: 8883
- name: coap
  port: 5683
  protocol: UDP
  targetPort: 5683
```

## TLS & mTLS

For testing purposes you can generate certificates as explained in detail in [authentication][authentication] chapter of this document. So, you can use [this script][makefile] and after replacing all `localhost` with your hostname, run:

```bash
make ca
make server_cert
make thing_cert KEY=<thing_secret>
```

you should get in `certs` folder these certificates that we will use for setting up TLS and mTLS:

```bash
ca.crt
ca.key
ca.srl
magistrala-server.crt
magistrala-server.key
thing.crt
thing.key
```

Create kubernetes secrets using those certificates with running commands from [secrets script][secrets]. In this example secrets are created in `mg` namespace:

```bash
kubectl -n mg create secret tls magistrala-server --key magistrala-server.key --cert magistrala-server.crt

kubectl -n mg create secret generic ca --from-file=ca.crt
```

You can check if they are succesfully created:

```bash
kubectl get secrets -n mg
```

And now set ingress.hostname, ingress.tls.hostname to your hostname and ingress.tls.secret to `magistrala-server` and after helm update you have secured ingress with TLS certificate.

For mTLS you need to set `nginx_internal.mtls.tls="magistrala-server"` and `nginx_internal.mtls.intermediate_crt="ca"`.

Now you can test sending mqtt message with this parameters:

```bash
mosquitto_pub -d -L mqtts://<thing_id>:<thing_secret>@example.com:8883/channels/<channel_id>/messages  --cert  thing.crt --key thing.key --cafile ca.crt  -m "test-message"
```

[devops-repo]: https://github.com/absmach/devops
[kubernetes-setup]: https://kubernetes.io/docs/setup/
[kubectl-setup]: https://kubernetes.io/docs/tasks/tools/install-kubectl/
[helm-setup]: https://helm.sh/docs/intro/install/
[nginx-ingress]: https://kubernetes.github.io/ingress-nginx/deploy/
[ingress-yaml]: https://github.com/absmach/devops/blob/master/charts/mainflux/templates/ingress.yaml#L141
[ingress-controller-args]: https://kubernetes.github.io/ingress-nginx/user-guide/cli-arguments/
[ingress-controller-tcp-udp]: https://kubernetes.github.io/ingress-nginx/user-guide/exposing-tcp-udp-services/
[authentication]: /authentication
[makefile]: https://github.com/absmach/magistrala/blob/master/docker/ssl/Makefile
[secrets]: https://github.com/absmach/devops/blob/master/charts/mainflux/secrets/secrets.sh
