---
title: Kubernetes
---

SuperMQ can be easily deployed on the Kubernetes platform using Helm Charts from the official [SuperMQ DevOps GitHub repository](https://github.com/absmach/supermq-devops).

## Prerequisites

### 1. Install Docker

K3d requires Docker to run Kubernetes clusters inside Docker containers. Follow the official [Docker installation guide](https://docs.docker.com/get-docker/) to install Docker.

Once installed, verify the installation:

```bash
docker --version
```

### 2. Install Kubernetes via K3d

K3d is a lightweight Kubernetes distribution that runs inside Docker, ideal for local development.

```bash
curl -s https://raw.githubusercontent.com/k3d-io/k3d/main/install.sh | bash
```

For more information on K3d, refer to the official [K3d documentation](https://k3d.io/).

### 3. Install kubectl

`kubectl` is the command-line tool used to interact with your Kubernetes cluster.

```bash
curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
sudo install -o root -g root -m 0755 kubectl /usr/local/bin/kubectl
```

Verify the installation:

```bash
kubectl version --client
```

### 4. Install Helm v3

Helm is a package manager for Kubernetes, simplifying application installation and management.

```bash
curl https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3 | bash
```

Verify the installation:

```bash
helm version
```

### 5. Add Helm Repositories

The **Helm stable repository** contains Helm charts that you can use to install applications on Kubernetes.

```bash
helm repo add stable https://charts.helm.sh/stable
helm repo update
```

Bitnami offers a collection of popular Helm charts for various applications.

```bash
helm repo add bitnami https://charts.bitnami.com/bitnami
helm repo update
```

### 6. Install Nginx Ingress Controller

The Nginx Ingress Controller manages external access to services within your Kubernetes cluster.

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

## Deploying SuperMQ

There are two primary ways to deploy SuperMQ, depending on your needs:

### 1. Manual Local Deployment

This method involves **cloning the chart source code**, modifying it locally, and installing SuperMQ from disk.

This approach is useful if you want to:

- Directly interact with the chart source files.
- Modify the chart before installation.
- Perform development or testing on the chart.

Follow the steps below to manually install SuperMQ from source:

#### 1. Clone SuperMQ Helm Chart Repository

```bash
git clone https://github.com/absmach/supermq-devops.git
cd supermq-devops/charts/supermq # Ensure you're in the directory containing Chart.yaml
```

#### 2. Add Required Helm Repositories

```bash
helm repo add nats https://nats-io.github.io/k8s/helm/charts/
helm repo add jaegertracing https://jaegertracing.github.io/helm-charts
helm repo add hashicorp https://helm.releases.hashicorp.com
helm repo update
```

> This ensures that all necessary repositories are available for dependencies. For a complete list of all available flags to use with the `helm repo add [NAME] [URL] [flags]` command, run `helm repo add --help`

#### 3. Update Dependencies

Once the repositories have been added, update the on-disk dependencies to match the `Chart.yaml` file by running:

```bash
helm dependency update
```

If the repositories are set up correctly, this will resolve and download all chart dependencies to `charts/supermq/charts`.

> **Note**: Make sure you're running this command from within the `charts/supermq/` directory — the one containing the `Chart.yaml` file.

You can confirm the dependencies were fetched correctly by listing the contents of the `charts/` directory:

```bash
ls charts/
```

#### 4. Create Namespace and Deploy SuperMQ

First, create a namespace for SuperMQ (if it doesn’t already exist):

```bash
kubectl create namespace smq
```

Then deploy the SuperMQ Helm chart into the `smq` namespace:

```bash
helm install supermq . -n smq
```

> **Note**: Make sure you're in the `charts/supermq/` directory containing the `Chart.yaml` when running the install command.

If you encounter an error related to **snippet annotations** when using the NGINX Ingress Controller, you can enable them by upgrading the controller with the following flag:

```bash
helm upgrade ingress-nginx ingress-nginx/ingress-nginx -n ingress-nginx --set controller.allowSnippetAnnotations=true
```

Make sure the NGINX Ingress repository is added:

```bash
helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx
helm repo update
```

---

### 2. **Post-Deployment Verification**

Once the chart is installed, you can verify that SuperMQ is running correctly:

#### View all resources in the `smq` namespace

```bash
kubectl get all -n smq
```

#### List all running pods:

```bash
kubectl get pods -n smq
```

#### List all services

```bash
kubectl get services -n smq
```

#### View logs from a specific pod

```bash
kubectl logs <pod-name> -n smq
```

Replace `<pod-name>` with the actual name of the pod you want to inspect.

### 3. Interacting with SuperMQ Services After Deployment

Once SuperMQ is successfully deployed, you can interact with its services in the following ways:

- **Web-based User Interface (UI)**
- **SuperMQ CLI tool** (see the [CLI Documentation](https://docs.supermq.abstractmachines.fr/cli/))
- **HTTP API Clients** (e.g., `curl`, Postman)

#### Accessing Services via Ingress

SuperMQ uses the `ingress-nginx-controller` to expose services through Kubernetes Ingress resources. Depending on where you're running your cluster, the method for accessing the services differs slightly.

#### **DigitalOcean (DO) Deployment**

If you're deploying on DigitalOcean, a LoadBalancer service is automatically provisioned. To find the public IP address:

```bash
kubectl get svc -A | grep LoadBalancer
```

You’ll see output like:

```plaintext
ingress-nginx   ingress-nginx-controller   LoadBalancer   10.245.192.202   138.68.126.8   80:30424/TCP,443:31752/TCP   64d
```

Here, the public IP is **`138.68.126.8`** — this is the address you'll use to access SuperMQ services via the web UI, CLI, or API clients.

---

#### **Local Deployment (e.g., with `kind`, `minikube`, or `k3d`)**

If you're running locally, a LoadBalancer may not be automatically available. You can use one of the following approaches:

- **Minikube:**

  ```bash
  minikube tunnel
  ```

  This exposes LoadBalancer services on your host network.

- **Kind or k3d:**
  Port-forward directly to the ingress controller:

  ```bash
  kubectl port-forward -n ingress-nginx svc/ingress-nginx-controller 8080:80
  ```

  Then access SuperMQ at [http://localhost:8080](http://localhost:8080).

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

##### 2. Set Up the Request Body

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

---

### Installing SuperMQ from Published Chart

SuperMQ Helm charts are published to a secure, private **OCI registry**. This installation method is recommended for production and CI/CD pipelines, supporting authentication, RBAC, signed charts, and versioned releases.

#### 1. Authenticate with Private OCI registry

Use your Private OCI registry username/password:

```bash
helm registry login supermq.example.com
```

> **Note:** Replace `supermq.example.com` with your actual Private OCI registry domain.

#### 2. Install the Chart (Choose One Option)

##### 🔹 Option A — Pull and install locally

```bash
helm pull oci://supermq.example.com/supermq/supermq --version 0.16.7
helm install supermq ./supermq-0.16.7.tgz -n smq
```

##### 🔹 Option B — Install directly from OCI

```bash
helm install supermq oci://supermq.example.com/supermq/supermq \
  --version 0.16.7 \
  -f custom-values.yaml \
  -n smq
```

#### 3. Verify the Installation

```bash
helm list -n smq
kubectl get pods -n smq
```

---

### Adding SuperMQ as a Dependency in a Parent Chart

If you're building a **parent Helm chart** (e.g. `magistrala`) and want to include SuperMQ as a dependency from your Private OCI registry, follow these steps:

#### 1. Define the Dependency in `Chart.yaml`

Update your `Chart.yaml` in the parent chart directory:

```yaml
dependencies:
  - name: supermq
    version: "0.16.7"
    repository: "oci://supermq.example.com/supermq"
```

> Be sure to replace `supermq.example.com` with your actual Private OCI registry domain.

#### 2. Authenticate with Private OCI registry (if not already done)

```bash
helm registry login supermq.example.com
```

#### 3. Download Dependencies

From the root of your parent chart (where `Chart.yaml` is located), run:

```bash
helm dependency update
```

---

## Upgrading the SuperMQ Chart

To upgrade your SuperMQ deployment — whether you're:

- updating to a **newer chart version**,
- applying changes to your `values.yaml`, or
- overriding individual parameters via `--set` —  
  use the following command:

```bash
helm upgrade <release-name> supermq-devops/supermq -f custom-values.yaml
```

> **Replace `<release-name>`** with the name of your existing Helm release (e.g., `supermq`), and  
> **`custom-values.yaml`** with your configuration file (if applicable).

For a complete table of configurable parameters and their default values, see the [configurable parameters reference](https://github.com/absmach/supermq-devops/blob/master/charts/supermq/README.md).

> **Note:** You only need to update the documentation at `charts/supermq/README.md` if you’re making changes to the chart source (e.g., adding or modifying parameters in `values.yaml` or templates).  
> In such cases, regenerate the docs using `helm-docs` as outlined in [Autogenerating Helm Chart Documentation](https://github.com/absmach/supermq-devops/blob/master/README.md).

### Optional: Upgrade to a Specific Version

If you want to upgrade to a particular chart version:

```bash
helm upgrade <release-name> supermq-devops/supermq --version 0.14.0 -f custom-values.yaml
```

> Use `helm search repo supermq-devops/supermq --versions` to view all available versions.

### Verify the Upgrade

Once the upgrade command runs successfully, verify that your deployment is up-to-date:

```bash
helm list -n <namespace>
kubectl get pods -n <namespace>
```

---

## Publishing SuperMQ to Private OCI registry (OCI Registry)

To publish the SuperMQ chart to a Private OCI registry follow these steps:

### 1. Package the Chart

From the root of your SuperMQ Helm chart (where `Chart.yaml` and `values.yaml` are located), run:

```bash
helm package .
```

This will create a `.tgz` archive using the version defined in `Chart.yaml`, for example:

```bash
supermq-0.16.7.tgz
```

> **Note:** If you want to override the version defined in `Chart.yaml`, you can use the `--version` flag, for example:  
> `helm package . --version 0.16.8`

### 2. Authenticate with Private OCI registry (if not already logged in)

```bash
helm registry login supermq.example.com
```

> **Note:** Replace `supermq.example.com` with your actual Private OCI registry domain or IP address.

---

### 3. Push the Chart to Private OCI registry

```bash
helm push supermq-0.16.7.tgz oci://supermq.example.com/supermq
```

If successful, you'll see:

```bash
Pushed: supermq.example.com/supermq/supermq:0.16.7
Digest: sha256:<hash>
```

> **Note:** Make sure the **project (`supermq`) exists** in Private OCI registry before pushing, or the push will fail.

---

### 4. (Optional) Verify the Chart Exists

You can browse Private OCI registry's web UI or use the Helm CLI to pull or inspect the chart:

```bash
helm show chart oci://supermq.example.com/supermq/supermq --version 0.16.7
```

> **Note:** Replace `supermq.example.com` with your actual Private OCI registry domain or IP address.

---

## Uninstalling SuperMQ

To uninstall the SuperMQ release:

```bash
helm uninstall <release-name> -n smq
```

This will remove the SuperMQ release from the previously created `smq` namespace. Use the `--dry-run` flag to see which releases will be uninstalled without actually uninstalling them.

To delete all data and resources from your cluster (or at least from the target namespace), the following two options are available:

### Option 1: Delete the Entire Namespace

Deleting the entire namespace will remove all resources contained within it in one go. Later you can recreate the namespace.

```sh
kubectl delete namespace smq

# Wait for deletion to complete (you can check the status with "kubectl get ns")
# Then recreate the namespace:
kubectl create namespace smq
```

### Option 2: Delete All Resources Within the Namespace

If you prefer to keep the namespace and simply clear out all the resources, run these commands:

```sh
# Delete all workloads and services (Deployments, Pods, Services, etc.)
kubectl delete all --all -n smq

# Delete all PersistentVolumeClaims in the namespace
kubectl delete pvc --all -n smq

# Optionally, delete other resource types if needed (e.g., ConfigMaps, Secrets, ServiceAccounts)
kubectl delete configmap --all -n smq
kubectl delete secret --all -n smq
kubectl delete serviceaccount --all -n smq
```

If your cluster is dynamically provisioning persistent volumes, the associated PVs may be automatically deleted (if their reclaim policy is set to `Delete`). If you need to manually remove all PVs (and you’re sure no other namespace depends on them), run:

```sh
kubectl delete pv --all
```

### Option 3: Force Clear a Stuck Namespace

Sometimes the namespace may be stuck in the **Terminating** phase because some resources (such as pods or PVCs) still have finalizers. If you encounter an error like:

> `secrets "sh.helm.release.v1.supermq.v1" is forbidden: unable to create new content in namespace smq because it is being terminated`
>
> follow these steps to force-clear the namespace:

#### 1. Force-Delete All Pods

Force-delete all pods in the namespace to remove any that might be stuck:

```sh
kubectl delete pods --all --force --grace-period=0 -n smq
```

#### 2. Remove Finalizers from PersistentVolumeClaims (PVCs)

List the PVCs in the namespace:

```sh
kubectl get pvc -n smq
```

For each PVC that is preventing deletion (they often have a finalizer like `kubernetes.io/pvc-protection`), remove the finalizer using:

```sh
kubectl patch pvc <pvc-name> -p '{"metadata":{"finalizers":null}}' -n smq
```

For example, if you have PVCs named `pvc-1` and `pvc-2`:

```sh
kubectl patch pvc pvc-1 -p '{"metadata":{"finalizers":null}}' -n smq
kubectl patch pvc pvc-2 -p '{"metadata":{"finalizers":null}}' -n smq
```

Tp patch all the stuck PVCs in one go, run the follwing command:

```sh
NAMESPACE="smq"

# Get all Terminating PVCs
kubectl get pvc -n $NAMESPACE | grep Terminating | awk '{print $1}' | while read pvc; do
    echo "Patching and deleting PVC: $pvc"

    # Patch to remove finalizers
    kubectl patch pvc $pvc -n $NAMESPACE --type=json -p '[{"op": "remove", "path": "/metadata/finalizers"}]'

    # Force delete the PVC
    kubectl delete pvc $pvc -n $NAMESPACE --force --grace-period=0
done
```

#### 3. Delete All Remaining Resources (Optional)

To ensure no lingering resources remain:

```sh
kubectl delete all --all --force --grace-period=0 -n smq
kubectl delete configmap --all -n smq
kubectl delete secret --all -n smq
kubectl delete serviceaccount --all -n smq
```

#### 4. Remove Finalizers from the Namespace

Patch the namespace to remove its finalizers so that it can be fully deleted:

```sh
kubectl patch namespace smq -p '{"spec":{"finalizers":[]}}'
```

#### 5. Verify

Check that the namespace is deleted:

```sh
kubectl get namespace smq
```

After clearing the namespace (using any of the options above), you can recreate the namespace and install your Helm release into a fresh `smq` namespace:

---

## Customizing SuperMQ Installation

To override values in the chart, use either the `--values` flag and pass in a file or use the `--set` flag and pass configuration from the command line, to force a string value use `--set-string`. You can use `--set-file` to set individual values from a file when the value itself is too long for the command line or is dynamically generated. You can also use `--set-json` to set json values (scalars/objects/arrays) from the command line.

For example, if you want to set a custom hostname for the ingress (like `example.com`) and ensure you're using the latest version of the `users` image, you can do this during installation with the following command::

```bash
helm install supermq -n smq --set ingress.hostname='example.com' --set users.image.tag='latest'
```

If SuperMQ is already installed and you want to update it with new settings (for example, changing the ingress hostname or image tag), you can use the `helm upgrade` command:

---

## SuperMQ Core

The **SuperMQ Core** consists of the essential services needed to run a functional deployment of the SuperMQ platform. These services are enabled by default and can be customized through the `values.yaml` file.

### Core Services Overview

| Service        | Description                                                          |
| -------------- | -------------------------------------------------------------------- |
| `auth`         | Handles user authentication and token generation via gRPC and HTTP.  |
| `users`        | Manages user registration, password policies, and account lifecycle. |
| `clients`      | Registers and manages clients (devices, apps) and their credentials. |
| `adapter_http` | HTTP protocol adapter for interacting with SuperMQ over REST APIs.   |
| `adapter_mqtt` | MQTT protocol adapter + broker integration for real-time messaging.  |
| `adapter_coap` | Lightweight CoAP protocol adapter for constrained devices.           |
| `ui`           | Web-based User Interface for managing SuperMQ and its services.      |

These services are enabled and configured out of the box in the default Helm chart configuration.

## SuperMQ Add-ons

SuperMQ Add-ons are optional services that are not installed by default. To enable an add-on, you need to specify it during installation using the following command:

```bash
helm install supermq . -n smq --set vault=true
```

---

## Scaling Services

By default, the `defaults.replicaCount` is set to `3`, which serves as a **global fallback** for services that don’t define their own `replicaCount`. However, in this chart configuration, **most core and add-on services explicitly override it with `replicaCount: 1`**.

To ensure better high availability and load balancing across nodes in your Kubernetes cluster, you should scale individual services based on your deployment size.

You can set replica counts per service like this:

```bash
helm install supermq . -n smq \
  --set auth.replicaCount=3 \
  --set clients.replicaCount=3 \
  --set mqtt.replicaCount=3 \
  --set ui.replicaCount=2 \
  --set envoy.replicaCount=2
```

Alternatively, modify your `values.yaml` directly:

```yaml
auth:
  replicaCount: 3

clients:
  replicaCount: 3

mqtt:
  replicaCount: 3

ui:
  replicaCount: 2

envoy:
  replicaCount: 2
```

---

## Additional Steps to Configure Ingress Controller

To allow your host to send MQTT messages on ports `1883` and `8883`, you need to configure the NGINX Ingress Controller with some additional steps.

### 1. Configure TCP and UDP Services

The NGINX Ingress Controller uses ConfigMaps to expose TCP and UDP services. The necessary ConfigMaps are included in the Helm chart in the [ingress.yaml][ingress-yaml] file assuming that location of ConfigMaps should be `ingress-nginx/tcp-services` and `ingress-nginx/udp-services`. These locations are set with `--tcp-services-configmap` and `--udp-services-configmap` flags and you can check it in deployment of Ingress Controller or add it there in [args section for nginx-ingress-controller][ingress-controller-args] if it's not already specified. This is explained in [NGINX Ingress documentation][ingress-controller-tcp-udp]

### 2. Expose the Required Ports in the Ingress Service

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

### 1. Generating Certificates

For testing purposes, you can generate the necessary TLS certificates. Detailed instructions are provided in the [authentication][authentication] chapter of this document. You can use [this script][makefile] to generate the certificates. After replacing all instances of `localhost` with your actual hostname, run the following commands:

```bash
make ca
make server_cert
make client_cert KEY=<client_secret>
```

This will generate the following certificates in the `certs` folder, which you’ll use to set up TLS and mTLS:

```bash
ca.crt
ca.key
ca.srl
supermq-server.crt
supermq-server.key
client.crt
client.key
```

### 2. Creating Kubernetes Secrets

Create kubernetes secrets using those certificates by running commands from [secrets script][secrets]. In this example secrets are created in `smq` namespace:

```bash
kubectl -n smq create secret tls supermq-server --key supermq-server.key --cert supermq-server.crt

kubectl -n smq create secret generic ca --from-file=ca.crt
```

You can check if they are succesfully created:

```bash
kubectl get secrets -n smq
```

### 3. Configuring Ingress for TLS

To secure your ingress with a TLS certificate, set the following values in your Helm configuration:

- `ingress.hostname` to your hostname
- `ingress.tls.hostname` to your hostname
- `ingress.tls.secret` to `supermq-server`

After updating your Helm chart, your ingress will be secured with the TLS certificate.

### 4. Configuring Ingress for mTLS

For mTLS you need to set `nginx_internal.mtls.tls="supermq-server"` and `nginx_internal.mtls.intermediate_crt="ca"`.

### 5. Testing MQTT with mTLS

You can test sending an MQTT message with the following command:

```bash
mosquitto_pub -d -L mqtts://<client_id>:<client_secret>@example.com:8883/m/<domain_id>/c/<channel_id> --cert client.crt --key client.key --cafile ca.crt -m "test-message"
```

[ingress-yaml]: https://github.com/absmach/devops/blob/master/charts/mainflux/templates/ingress.yaml#L141
[ingress-controller-args]: https://kubernetes.github.io/ingress-nginx/user-guide/cli-arguments/
[ingress-controller-tcp-udp]: https://kubernetes.github.io/ingress-nginx/user-guide/exposing-tcp-udp-services/
[authentication]: ./authentication.md
[makefile]: https://github.com/absmach/supermq/blob/master/docker/ssl/Makefile
[secrets]: https://github.com/absmach/devops/blob/master/charts/mainflux/secrets/secrets.sh
