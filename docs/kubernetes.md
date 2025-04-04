---
title: Kubernetes
---


SuperMQ can be easily deployed on the Kubernetes platform using Helm Charts from the official [SuperMQ DevOps GitHub repository](https://github.com/absmach/devops).

## Prerequisites

### 1. Install Docker

K3d requires Docker to run Kubernetes clusters inside Docker containers. Follow the official [Docker installation guide](https://docs.docker.com/get-docker/) to install Docker.

Once installed, verify the installation:

```bash
docker --version
```

---

### 2. Install Kubernetes via K3d

K3d is a lightweight Kubernetes distribution that runs inside Docker, ideal for local development.

#### Steps to install K3d

```bash
curl -s https://raw.githubusercontent.com/k3d-io/k3d/main/install.sh | bash
```

For more information on K3d, refer to the official [K3d documentation](https://k3d.io/).

### 3. Install kubectl

`kubectl` is the command-line tool used to interact with your Kubernetes cluster.

#### Steps to install kubectl

```bash
curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
sudo install -o root -g root -m 0755 kubectl /usr/local/bin/kubectl
```

Verify the installation:

```bash
kubectl version --client
```

---

### 4. Install Helm v3

Helm is a package manager for Kubernetes, simplifying application installation and management.

#### Steps to install Helm

```bash
curl https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3 | bash
```

Verify the installation:

```bash
helm version
```

---

### 5. Add Helm Repositories

#### Add Stable Helm Repository

The **Helm stable repository** contains Helm charts that you can use to install applications on Kubernetes.

```bash
helm repo add stable https://charts.helm.sh/stable
helm repo update
```

#### Add Bitnami Helm Repository

Bitnami offers a collection of popular Helm charts for various applications.

```bash
helm repo add bitnami https://charts.bitnami.com/bitnami
helm repo update
```

---

### 6. Install Nginx Ingress Controller

The Nginx Ingress Controller manages external access to services within your Kubernetes cluster.

#### Install Nginx Ingress Controller using Helm

```bash
helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx
helm repo update

kubectl create namespace ingress-nginx

helm install ingress-nginx ingress-nginx/ingress-nginx --version 3.26.0 --create-namespace -n ingress-nginx
```

Verify the installation:

```bash
kubectl get pods -n ingress-nginx
```

---

## Deploying Magistrala (Manual Local Deployment)

This method involves **manually deploying SuperMQ** by cloning the Helm chart repository to your local machine, making any necessary customizations, and installing the chart from the local directory.

### Deploy Use Case

This approach is useful if you want to:

- Directly interact with the chart source files.
- Modify the chart before installation.
- Perform development or testing on the chart.

### Steps

#### 1. Clone SuperMQ Helm Chart Repository

```bash
git clone https://github.com/absmach/devops.git
cd devops/charts/magistrala
```

#### 2. Add Required Helm Repositories

```bash
helm repo add nats https://nats-io.github.io/k8s/helm/charts/
helm repo add jaegertracing https://jaegertracing.github.io/helm-charts
helm repo add hashicorp https://helm.releases.hashicorp.com
helm repo update
```

This ensures that all necessary repositories are available for dependencies.

#### 3. Update Dependencies

Once the repositories have been added, update the on-disk dependencies to match the `Chart.yaml` file by running:

```bash
helm dependency update
```

If the repositories are set up correctly, this will resolve and download all chart dependencies to `charts/magistrala/charts`.

### 3. Create a Namespace (if needed)

```bash
kubectl create namespace mg
```

---

### 4. Deploy SuperMQ

Deploy the SuperMQ Helm chart into the `mg` namespace:

```bash
helm install magistrala . -n mg
```

If you encounter an error related to snippet annotations in Nginx, enable them with:

```bash
helm upgrade ingress-nginx ingress-nginx/ingress-nginx -n ingress-nginx --set controller.allowSnippetAnnotations=true
```

Ensure you have the Nginx Ingress repository added:

```bash
helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx
```

### 5. Verifying the Deployment

After deploying SuperMQ, verify the services and pods using `kubectl` commands:

**List all pods:**

```bash
kubectl get pods -n mg
```

**List all services:**

```bash
kubectl get services -n mg
```

**View logs of a pod:**

```bash
kubectl logs <pod-name> -n mg
```

### Interacting with SuperMQ Services After Deployment

Once you have successfully deployed SuperMQ, there are three primary ways you can interact with its services:

- web-based User Interface (UI)
- SuperMQ CLI tool (learn more in the [CLI Documentation](https://docs.magistrala.abstractmachines.fr/cli/))
- HTTP API Clients (e.g., cURL, Postman)

The ingress-nginx-controller handles the routing for your deployed services using Kubernetes Ingress resources. To interact with your SuperMQ UI or any other service exposed through this load balancer, the first step is to retrieve the Public IP address of this load balancer.

You can usually find this IP address in your DigitalOcean dashboard under the "Networking" or "Load Balancers" section, or by using the following command in your terminal:

```bash
    kubectl get svc -A | grep LoadBalancer
```

This command searches all namespaces for services of type `LoadBalancer`. The output looks something like this:

```plaintext
    ingress-nginx           ingress-nginx-controller                         LoadBalancer   10.245.192.202   138.68.126.8   80:30424/TCP,443:31752/TCP                        64d
```

NOTE: The Public IP in this case is `138.68.126.8`.

#### Using the Web-Based UI

- Once you have the Public IP address, open your web browser.
- In the address bar, enter the IP address followed by `/ui/login` as shown below:

```plaintext
  http://138.68.126.8/ui/login
```

#### Using Postman

If you prefer working with APIs, you can also interact with SuperMQ services using Postman by sending requests to the Public IP address of your load balancer. For example, to create a user:

##### 1. Set Up the Postman Request

- **Method:** `POST`
- **URL:** `http://138.68.126.8/users`

This URL points to the endpoint that handles user creation on your SuperMQ deployment. Replace `138.68.126.8` with the actual IP address or domain of your deployment if it differs.

###### 2. Set Up the Request Body

Switch to the `Body` tab in Postman and select `raw` as the format. Choose `JSON` from the dropdown menu, and then enter the following JSON structure in the text area:

```json
{
  "name": "user1",
  "tags": ["tag1", "tag2"],
  "credentials": {
    "identity": "user1@email.com",
    "secret": "12345678"
  },
  "metadata": {
    "domain": "domain1"
  }
}
```

`Send` the request. If successful, the server will respond with the details of the newly created user.

For more examples, refer to this [Postman Collection](https://elements.getpostman.com/redirect?entityId=38532610-ef9a0562-b353-4d2c-8aca-a5fae35ad0ad&entityType=collection).

## Install SuperMQ Charts (From Published Helm Repository)

This method is the **standard installation** approach, where you install the SuperMQ chart directly from a Helm repository. This is quicker and ideal for end-users who do not need to modify the chart manually.

### Install Use Case

This approach is suitable for:

- End-users who simply want to install SuperMQ without modifying the source code.
- Production environments where the chart is deployed directly from a hosted Helm repository.

### Install Steps

#### 1. Add the SuperMQ Helm Repository

The Helm charts are published via GitHub Pages. After installing Helm, add the SuperMQ DevOps Helm repository by running:

```bash
helm repo add magistrala-devops https://absmach.github.io/devops/
helm repo update
```

For a complete list of all available flags to use with the `helm repo add [NAME] [URL] [flags]` command, run `helm repo add --help`

#### 2. Install the SuperMQ Chart

```bash
helm install <release-name> magistrala-devops/magistrala [flags]
```

Replace `<release-name>` with your desired release name. For the complete list of available flags to use with the above command, run `helm install --help`.

Example with release name and flag:

```bash
helm install my-magistrala magistrala-devops/magistrala --version 0.14.0
```

---

#### 3. Upgrading the SuperMQ Chart

To upgrade the chart to a new version or update configurations:

```bash
helm upgrade <release-name> magistrala-devops/magistrala
```

---

#### 4. Uninstalling SuperMQ

To uninstall the SuperMQ release:

```bash
helm uninstall <release-name> -n mg
```

This will remove the SuperMQ release from the previously created `mg` namespace. Use the `--dry-run` flag to see which releases will be uninstalled without actually uninstalling them.

---

### Customizing SuperMQ Installation

To override values in the chart, use either the `--values` flag and pass in a file or use the `--set` flag and pass configuration from the command line, to force a string value use `--set-string`. You can use `--set-file` to set individual values from a file when the value itself is too long for the command line or is dynamically generated. You can also use `--set-json` to set json values (scalars/objects/arrays) from the command line.

For example, if you want to set a custom hostname for the ingress (like `example.com`) and ensure you're using the latest version of the `users` image, you can do this during installation with the following command::

```bash
helm install magistrala -n mg --set ingress.hostname='example.com' --set users.image.tag='latest'
```

If Magistrala is already installed and you want to update it with new settings (for example, changing the ingress hostname or image tag), you can use the `helm upgrade` command:

```bash
helm upgrade magistrala -n mg --set ingress.hostname='example.com' --set users.image.tag='latest'
```

This will apply your changes to the existing installation. For a complete table of the configurable parameters and their default values, see [configurable parameters and their default values](https://github.com/absmach/devops/blob/master/charts/magistrala/README.md). For changes to any of the configurable parameters, equally update the documentation at `charts/magistrala/README.md` using `helm-docs` as described in [Autogenerating Helm Chart Documentation](https://github.com/absmach/devops/blob/master/README.md).

### SuperMQ Core

The SuperMQ Core includes the essential services that are installed by default:

- authn
- users
- things
- adapter_http
- adapter_mqtt
- adapter_coap
- ui

These are the minimum required services to run SuperMQ.

### SuperMQ Add-ons

SuperMQ Add-ons are optional services that are not installed by default. To enable an add-on, you need to specify it during installation. For example, to enable the InfluxDB reader and writer, you would use the following command:

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

### Scaling Services

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

You need to expose the MQTT ports (`1883` for unencrypted and `8883` for encrypted messages) and the CoAP port (`5683` for UDP) in the NGINX Ingress Controller service. You can do that with the following command that edits your service:

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
mosquitto_pub -d -L mqtts://<thing_id>:<thing_secret>@example.com:8883/c/<channel_id>/m  --cert  thing.crt --key thing.key --cafile ca.crt  -m "test-message"
```

[ingress-yaml]: https://github.com/absmach/devops/blob/master/charts/mainflux/templates/ingress.yaml#L141
[ingress-controller-args]: https://kubernetes.github.io/ingress-nginx/user-guide/cli-arguments/
[ingress-controller-tcp-udp]: https://kubernetes.github.io/ingress-nginx/user-guide/exposing-tcp-udp-services/
[authentication]: ./authentication.md
[makefile]: https://github.com/absmach/magistrala/blob/master/docker/ssl/Makefile
[secrets]: https://github.com/absmach/devops/blob/master/charts/mainflux/secrets/secrets.sh
