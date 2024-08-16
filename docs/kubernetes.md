# Kubernetes

Magistrala can be easily deployed on Kubernetes platform by using Helm Chart from official [Magistrala DevOps GitHub repository][devops-repo].

## Prerequisites

- Kubernetes: This is the platform where you'll run your applications
- kubectl: A command-line tool for interacting with your Kubernetes cluster
- Helm v3: A package manager for Kubernetes that helps you install and manage applications
- Stable Helm repository: A collection of Helm charts you can use, which you can add to your Helm setup
- Nginx Ingress Controller: A component that manages external access to your services in Kubernetes

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

Get Helm charts from the [Magistrala DevOps GitHub repository][devops-repo]:

```bash
git clone https://github.com/absmach/devops.git
cd devops/charts/mainflux
```

Update the on-disk dependencies to match the `Chart.yaml` file:

```bash
helm dependency update
```

If you encounter the following error during the `helm dependency update` command:

```
Error: no repository definition for @nats, @jaegertracing, @hashicorp. Please add them via 'helm repo add'
```

Add the missing repositories with the following commands:

```bash
helm repo add nats https://nats-io.github.io/k8s/helm/charts/
helm repo add jaegertracing https://jaegertracing.github.io/helm-charts
helm repo add hashicorp https://helm.releases.hashicorp.com
helm repo update
```

After adding the repositories, run the `helm dependency update` command again.

### Create a Namespace (if needed)

If you haven't already created a namespace, do so with:

```bash
kubectl create namespace mg
```

### Deploy Magistrala

Deploy Magistrala with a release named `magistrala` in the `mg` namespace by running:

```bash
helm install magistrala . -n mg
```

If you encounter the following error during deployment:

```
Error: INSTALLATION FAILED: 4 errors occurred:
        * admission webhook "validate.nginx.ingress.kubernetes.io" denied the request: nginx.ingress.kubernetes.io/configuration-snippet annotation cannot be used. Snippet directives are disabled by the Ingress administrator
```

Enable snippet annotations in the Nginx Ingress Controller by running the following command:

```bash
helm upgrade ingress-nginx ingress-nginx/ingress-nginx -n ingress-nginx --set controller.allowSnippetAnnotations=true
```

Make sure `ingress-nginx` repository is added to your Helm repositories. If not, add the repository with the following command:

```bash
helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx
```

Once the repository is added, you can run the upgrade command again. After enabling snippet annotations and adding the repository, try deploying Magistrala again. Magistrala should now deploy successfully on your Kubernetes cluster. You should see an output similar to:

```bash
NAME: magistrala
LAST DEPLOYED: Tue Aug 13 15:49:29 2024
NAMESPACE: mg
STATUS: deployed
REVISION: 1
```

### Customizing a New Installation

You can easily customize Magistrala during installtion by overriding the default settings using the `--set` option in Helm.

For example, if you want to set a custom hostname for the ingress (like `example.com`) and ensure you're using the latest version of the `users` image, you can do this during installation with the following command:

```bash
helm install magistrala -n mg --set ingress.hostname='example.com' --set users.image.tag='latest'
```

#### Updating an Existing Installation

If Magistrala is already installed and you want to update it with new settings (for example, changing the ingress hostname or image tag), you can use the `helm upgrade` command:

```bash
helm upgrade magistrala -n mg --set ingress.hostname='example.com' --set users.image.tag='latest'
```

This will apply your changes to the existing installation. The following table lists the configurable parameters and their default values.

| Parameter                          | Description                                                                                     | Default              |
| ---------------------------------- | ----------------------------------------------------------------------------------------------- | -------------------- |
| defaults.logLevel                  | Log level                                                                                       | info                 |
| defaults.image.pullPolicy          | Docker Image Pull Policy                                                                        | IfNotPresent         |
| defaults.image.rootRepository      | Docker Image Root Repository                                                                    | magistrala           |
| defaults.image.repository          | Docker Image Repository                                                                         | magistrala           |
| defaults.image.tag                 | Docker Image Tag                                                                                | latest               |
| defaults.replicaCount              | Replicas of MQTT adapter, Things, Envoy and Authn                                               | 3                    |
| defaults.eventStreamURL            | Message broker URL, the default is NATS Url                                                     | magistrala-nats:4222 |
| defaults.jaegerCollectorPort       | Jaeger port                                                                                     | 4318                 |
| defaults.jaegerTraceRatio          | jaegerTraceRatio                                                                                | 10                   |
| nginxInternal.image.pullPolicy     | Docker Image Pull Policy                                                                        | IfNotPresent         |
| nginxInternal.image.repository     | Docker Image Repository                                                                         | nginx                |
| nginxInternal.image.tag            | Docker Image Tag                                                                                | 1.19.1-alpine        |
| nginxInternal.mtls.tls             | TLS secret which contains the server cert/key                                                   |                      |
| nginxInternal.mtls.intermediateCrt | Generic secret which contains the intermediate cert used to verify clients                      |                      |
| ingress.enabled                    | Should the Nginx Ingress be created                                                             | true                 |
| ingress.hostname                   | Hostname for the Nginx Ingress                                                                  |                      |
| ingress.tls.hostname               | Hostname of the Nginx Ingress certificate                                                       |                      |
| ingress.tls.secret                 | TLS secret for the Nginx Ingress                                                                |                      |
| messageBroker.maxPayload           | Maximum payload size in bytes that the Message Broker server, if it is NATS, server will accept | 2Gi                  |
| messageBroker.replicaCount         | Message Broker replicas                                                                         | 3                    |
| users.dbPort                       | Users service DB port                                                                           | 5432                 |
| users.httpPort                     | Users service HTTP port                                                                         | 9000                 |
| things.dbPort                      | Things service DB port                                                                          | 5432                 |
| things.httpPort                    | Things service HTTP port                                                                        | 9000                 |
| things.authGrpcPort                | Things service Auth gRPC port                                                                   | 7000                 |
| things.authHttpPort                | Things service Auth HTTP port                                                                   | 9001                 |
| things.redisESPort                 | Things service Redis Event Store port                                                           | 6379                 |
| things.redisCachePort              | Things service Redis Auth Cache port                                                            | 6379                 |
| adapter_http.httpPort              | HTTP adapter port                                                                               | 8008                 |
| mqtt.proxy.mqttPort                | MQTT adapter proxy port                                                                         | 1884                 |
| mqtt.proxy.wsPort                  | MQTT adapter proxy WS port                                                                      | 8081                 |
| mqtt.broker.mqttPort               | MQTT adapter broker port                                                                        | 1883                 |
| mqtt.broker.wsPort                 | MQTT adapter broker WS port                                                                     | 8080                 |
| mqtt.broker.persistentVolume.size  | MQTT adapter broker data Persistent Volume size                                                 | 5Gi                  |
| mqtt.redisESPort                   | MQTT adapter Event Store port                                                                   | 6379                 |
| mqtt.redisCachePort                | MQTT adapter Redis Auth Cache port                                                              | 6379                 |
| adapter_coap.udpPort               | CoAP adapter UDP port                                                                           | 5683                 |
| ui.port                            | UI port                                                                                         | 3000                 |
| bootstrap.enabled                  | Enable bootstrap service                                                                        | true                 |
| bootstrap.dbPort                   | Bootstrap service DB port                                                                       | 5432                 |
| bootstrap.httpPort                 | Bootstrap service HTTP port                                                                     | 9013                 |
| bootstrap.redisESPort              | Bootstrap service Redis Event Store port                                                        | 6379                 |

### Customizing Magistrala Services

You can customize the `logLevel`, `image.pullPolicy`, `image.repository`, and `image.tag` for all Magistrala services, including both core and add-ons.

#### Magistrala Core

The Magistrala Core includes the essential services that are installed by default:

- authn
- users
- things
- adapter_http
- adapter_mqtt
- adapter_coap
- ui

These are the minimum required services to run Magistrala.

#### Magistrala Add-ons

Magistrala Add-ons are optional services that are not installed by default. To enable an add-on, you need to specify it during installation. For example, to enable the InfluxDB reader and writer, you would use the following command:

```bash
helm install magistrala . -n mg --set influxdb=true
```

Here’s a list of available add-ons:

- bootstrap
- influxdb.writer
- influxdb.reader
- adapter_opcua
- adapter_lora
- twins

#### Scaling Services

By default, the MQTT adapter, Things, Envoy, Authn, and the Message Broker services are set to scale with a replica count of 3. It’s recommended to set these values according to the number of nodes in your Kubernetes cluster. For example, you can adjust the replica count with the following command:

```bash
helm install magistrala . -n mg --set defaults.replicaCount=3 --set messageBroker.replicaCount=3
```

This ensures that your services scale appropriately for your environment.

### Additional Steps to Configure Ingress Controller

To allow your host to send MQTT messages on ports `1883` and `8883`, you need to configure the NGINX Ingress Controller with some additional steps.

#### Step 1: Configure TCP and UDP Services

The NGINX Ingress Controller uses ConfigMaps to expose TCP and UDP services. The necessary ConfigMaps are included in the Helm chart in the [ingress.yaml][ingress-yaml] file assuming that location of ConfigMaps should be `ingress-nginx/tcp-services` and `ingress-nginx/udp-services`. These locations are set with `--tcp-services-configmap` and `--udp-services-configmap` flags and you can check it in deployment of Ingress Controller or add it there in [args section for nginx-ingress-controller][ingress-controller-args] if it's not already specified. This is explained in [NGINX Ingress documentation][ingress-controller-tcp-udp]

#### Step 2: Expose the Required Ports in the Ingress Service

You need to expose the MQTT ports (`1883` for unencrypted and `8883` for encrypted messages) and the CoAP port (`5683` for UDP) in the NGINX Ingress Controller service. You can do that with the follwoing command that edits your service:

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

## Configuring TLS & mTLS

### Generating Certificates

For testing purposes, you can generate the necessary TLS certificates. Detailed instructions are provided in the [authentication][authentication] chapter of this document. You can use [this script][makefile] to generate the certificates. After replacing all instances of `localhost` with your actual hostname, run the following commands:

```bash
make ca
make server_cert
make thing_cert KEY=<thing_secret>
```

This will generate the following certificates in the `certs` folder, which you’ll use to set up TLS and mTLS:

```bash
ca.crt
ca.key
ca.srl
magistrala-server.crt
magistrala-server.key
thing.crt
thing.key
```

### Creating Kubernetes Secrets

Create kubernetes secrets using those certificates by running commands from [secrets script][secrets]. In this example secrets are created in `mg` namespace:

```bash
kubectl -n mg create secret tls magistrala-server --key magistrala-server.key --cert magistrala-server.crt

kubectl -n mg create secret generic ca --from-file=ca.crt
```

You can check if they are succesfully created:

```bash
kubectl get secrets -n mg
```

### Configuring Ingress for TLS

To secure your ingress with a TLS certificate, set the following values in your Helm configuration:

- `ingress.hostname` to your hostname
- `ingress.tls.hostname` to your hostname
- `ingress.tls.secret` to `magistrala-server`

After updating your Helm chart, your ingress will be secured with the TLS certificate.

### Configuring Ingress for mTLS

For mTLS you need to set `nginx_internal.mtls.tls="magistrala-server"` and `nginx_internal.mtls.intermediate_crt="ca"`.

### Testing MQTT with mTLS

You can test sending an MQTT message with the following command:

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
