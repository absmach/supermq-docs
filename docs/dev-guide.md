# Developer's guide

## Getting Mainflux

Mainflux source can be found in the official [Mainflux GitHub repository][mainflux-repo]. You should fork this repository in order to make changes to the project. The forked version of the repository should be cloned using the following:

```bash
git clone <forked repository> $SOMEPATH/mainflux
cd $SOMEPATH/mainflux
```

**Note:** If your `$SOMEPATH` is equal to `$GOPATH/src/github.com/mainflux/mainflux`, make sure that your `$GOROOT` and `$GOPATH` do not overlap (otherwise, go modules won't work).

## Building

### Prerequisites

Make sure that you have [Protocol Buffers][protocol-buffers] (version 21.12) compiler (`protoc`) installed.

[Go Protobuf][golang-protobuf] installation instructions are [here][protobuf-install]. Go Protobuf uses C bindings, so you will need to install [C++ protobuf][protobuf] as a prerequisite. Mainflux uses `Protocol Buffers for Go with Gadgets` to generate faster marshaling and unmarshaling Go code. Protocol Buffers for Go with Gadgets installation instructions can be found [here][google-protobuf].

A copy of [Go][go-install] (version 1.19.4) and docker template (version 3.7) will also need to be installed on your system.

If any of these versions seem outdated, the latest can always be found in our [CI script][mf-ci-scripts].

### Build All Services

Use the _GNU Make_ tool to build all Mainflux services:

```bash
make
```

Build artifacts will be put in the `build` directory.

> N.B. All Mainflux services are built as a statically linked binaries. This way they can be portable (transferred to any platform just by placing them there and running them) as they contain all needed libraries and do not relay on shared system libraries. This helps creating [FROM scratch][scratch-docker] dockers.

### Build Individual Microservice

Individual microservices can be built with:

```bash
make <microservice_name>
```

For example:

```bash
make http
```

will build the HTTP Adapter microservice.

### Building Dockers

Dockers can be built with:

```bash
make dockers
```

or individually with:

```bash
make docker_<microservice_name>
```

For example:

```bash
make docker_http
```

> N.B. Mainflux creates `FROM scratch` docker containers which are compact and small in size.
>
> N.B. The `things-db` and `users-db` containers are built from a vanilla PostgreSQL docker image downloaded from docker hub which does not persist the data when these containers are rebuilt. Thus, **rebuilding of all docker containers with `make dockers` or rebuilding the `things-db` and `users-db` containers separately with `make docker_things-db` and `make docker_users-db` respectively, will cause data loss. All your users, things, channels and connections between them will be lost!** As we use this setup only for development, we don't guarantee any permanent data persistence. Though, in order to enable data retention, we have configured persistent volumes for each container that stores some data. If you want to update your Mainflux dockerized installation and want to keep your data, use `make cleandocker` to clean the containers and images and keep the data (stored in docker persistent volumes) and then `make run` to update the images and the containers. Check the [Cleaning up your dockerized Mainflux setup][cleanup-docker] section for details. Please note that this kind of updating might not work if there are database changes.

#### Building Docker images for development

In order to speed up build process, you can use commands such as:

```bash
make dockers_dev
```

or individually with

```bash
make docker_dev_<microservice_name>
```

Commands `make dockers` and `make dockers_dev` are similar. The main difference is that building images in the development mode is done on the local machine, rather than an intermediate image, which makes building images much faster. Before running this command, corresponding binary needs to be built in order to make changes visible. This can be done using `make` or `make <service_name>` command. Commands `make dockers_dev` and `make docker_dev_<service_name>` should be used only for development to speed up the process of image building. **For deployment images, commands from section above should be used.**

### Suggested workflow

When the project is first cloned to your system, you will need to make sure and build all of the Mainflux services.

```bash
make
make dockers_dev
```

As you develop and test changes, only the services related to your changes will need to be rebuilt. This will reduce compile time and create a much more enjoyable development experience.

```bash
make <microservice_name>
make docker_dev_<microservice_name>
make run
```

### Overriding the default docker-compose configuration

Sometimes, depending on the use case and the user's needs it might be useful to override or add some extra parameters to the docker-compose configuration. These configuration changes can be done by specifying multiple compose files with the [docker-compose command line option -f][docker-compose-ref] as described [here][docker-compose-extend].
The following format of the `docker-compose` command can be used to extend or override the configuration:

```bash
docker-compose -f docker/docker-compose.yml -f docker/docker-compose.custom1.yml -f docker/docker-compose.custom2.yml up [-d]
```

In the command above each successive file overrides the previous parameters.

A practical example in our case would be to enable debugging and tracing in NATS so that we can see better how are the messages moving around.

`docker-compose.nats-debugging.yml`

```yaml
version: "3"

services:
  nats:
    command: --debug -DV
```

When we have the override files in place, to compose the whole infrastructure including the persistent volumes we can execute:

```bash
docker-compose -f docker/docker-compose.yml -f docker/docker-compose.nats-debugging.yml up -d
```

**Note:** Please store your customizations to some folder outside the Mainflux's source folder and maybe add them to some other git repository. You can always apply your customizations by pointing to the right file using `docker-compose -f ...`.

### Cleaning up your dockerized Mainflux setup

If you want to clean your whole dockerized Mainflux installation you can use the `make pv=true cleandocker` command. Please note that **by default the `make cleandocker` command will stop and delete all of the containers and images, but NOT DELETE persistent volumes**. If you want to delete the gathered data in the system (the persistent volumes) please use the following command `make pv=true cleandocker` (pv = persistent volumes). This form of the command will stop and delete the containers, the images and will also delete the persistent volumes.

### MQTT Microservice

The MQTT Microservice in Mainflux is special, as it is currently the only microservice written in NodeJS. It is not compiled, but node modules need to be downloaded in order to start the service:

```bash
cd mqtt
npm install
```

Note that there is a shorthand for doing these commands with `make` tool:

```bash
make mqtt
```

After that, the MQTT Adapter can be started from top directory (as it needs to find `*.proto` files) with:

```bash
node mqtt/mqtt.js
```

#### Troubleshooting

Depending on your use case, MQTT topics, message size, the number of clients and the frequency with which the messages are sent it can happen that you experience some problems.

Up until now it has been noticed that in case of high load, big messages and many clients it can happen that the MQTT microservice crashes with the following error:

```bash
mainflux-mqtt   | FATAL ERROR: CALL_AND_RETRY_LAST Allocation failed - JavaScript heap out of memory
mainflux-mqtt exited with code 137
```

This problem is caused the default allowed memory in node (V8). [V8 gives the user 1.7GB per default][increase-nodes-memory]. To fix the problem you should add the following environment variable `NODE_OPTIONS:--max-old-space-size=SPACE_IN_MB` in the [environment section][mf-aedes] of the aedes.yml configuration. To find the right value for the `--max-old-space-size` parameter you'll have to experiment a bit depending on your needs.

The Mainflux MQTT service uses the [Aedes MQTT Broker][aedes-mqtt-broker] for implementation of the MQTT related things. Therefore, for some questions or problems you can also check out the Aedes's documentation or reach out its contributors.

### Protobuf

If you've made any changes to `.proto` files, you should call `protoc` command prior to compiling individual microservices.

To do this by hand, execute:

```bash
protoc -I. --go_out=. --go_opt=paths=source_relative pkg/messaging/*.proto
protoc -I. --go_out=. --go_opt=paths=source_relative --go-grpc_out=. --go-grpc_opt=paths=source_relative users/policies/*.proto
protoc -I. --go_out=. --go_opt=paths=source_relative --go-grpc_out=. --go-grpc_opt=paths=source_relative things/policies/*.proto
```

A shorthand to do this via `make` tool is:

```bash
make proto
```

> N.B. This must be done once at the beginning in order to generate protobuf Go structures needed for the build. However, if you don't change any of `.proto` files, this step is not mandatory, since all generated files are included in the repository (those are files with `.pb.go` extension).

### Cross-compiling for ARM

Mainflux can be compiled for ARM platform and run on Raspberry Pi or other similar IoT gateways, by following the instructions [here][go-cross-compile] or [here][go-arm] as well as information found [here][wiki-go-arm]. The environment variables `GOARCH=arm` and `GOARM=7` must be set for the compilation.

Cross-compilation for ARM with Mainflux make:

```bash
GOOS=linux GOARCH=arm GOARM=7 make
```

## Running tests

To run all of the tests you can execute:

```bash
make test
```

Dockertest is used for the tests, so to run them, you will need the Docker daemon/service running.

## Installing

Installing Go binaries is simple: just move them from `build` to `$GOBIN` (do not fortget to add `$GOBIN` to your `$PATH`).

You can execute:

```bash
make install
```

which will do this copying of the binaries.

> N.B. Only Go binaries will be installed this way. The MQTT adapter is a NodeJS script and will stay in the `mqtt` dir.

## Deployment

### Prerequisites

Mainflux depends on several infrastructural services, notably the default message broker, [NATS][nats] and [PostgreSQL][postgresql] database.

#### Message Broker

Mainflux uses NATS as it's default central message bus. For development purposes (when not run via Docker), it expects that NATS is installed on the local system.

To do this execute:

```bash
go install github.com/nats-io/nats-server/v2@latest
```

This will install `nats-server` binary that can be simply run by executing:

```bash
nats-server
```

If you want to change the default message broker to [RabbitMQ][rabbitmq], [VerneMQ][vernemq] or [Kafka][kafka] you need to install it on the local system.
To run using a different broker you need to set the `MF_BROKER_TYPE` env variable to `nats`, `rabbitmq` or `vernemq` during make and run process.

```bash
MF_BROKER_TYPE=<broker-type> make
MF_BROKER_TYPE=<broker-type> make run
```

#### PostgreSQL

Mainflux uses PostgreSQL to store metadata (`users`, `things` and `channels` entities alongside with authorization tokens). It expects that PostgreSQL DB is installed, set up and running on the local system.

Information how to set-up (prepare) PostgreSQL database can be found [here][postgres-roles], and it is done by executing following commands:

```bash
# Create `users` and `things` databases
sudo -u postgres createdb users
sudo -u postgres createdb things

# Set-up Postgres roles
sudo su - postgres
psql -U postgres
postgres=# CREATE ROLE mainflux WITH LOGIN ENCRYPTED PASSWORD 'mainflux';
postgres=# ALTER USER mainflux WITH LOGIN ENCRYPTED PASSWORD 'mainflux';
```

### Mainflux Services

Running of the Mainflux microservices can be tricky, as there is a lot of them and each demand configuration in the form of environment variables.

The whole system (set of microservices) can be run with one command:

```bash
make rundev
```

which will properly configure and run all microservices.

Please assure that MQTT microservice has `node_modules` installed, as explained in _MQTT Microservice_ chapter.

> N.B. `make rundev` actually calls helper script `scripts/run.sh`, so you can inspect this script for the details.

[mainflux-repo]: https://github.com/Mainflux/mainflux
[protocol-buffers]: https://developers.google.com/protocol-buffers/
[golang-protobuf]: https://github.com/golang/protobuf
[protobuf-install]: https://github.com/golang/protobuf#installation
[protobuf]: https://github.com/google/protobuf
[google-protobuf]: "google.golang.org/protobuf/proto"
[go-install]: https://golang.org/doc/install
[mf-ci-scripts]: https://github.com/mainflux/mainflux/blob/master/scripts/ci.sh
[scratch-docker]: https://hub.docker.com/_/scratch/
[cleanup-docker]: #cleaning-up-your-dockerized-mainflux-setup
[docker-compose-ref]: https://docs.docker.com/compose/reference/overview/
[docker-compose-extend]: https://docs.docker.com/compose/extends/
[increase-nodes-memory]: https://medium.com/tomincode/increasing-nodes-memory-337dfb1a60dd
[mf-aedes]: https://github.com/mainflux/mainflux/blob/master/docker/aedes.yml#L31
[aedes-mqtt-broker]: https://github.com/mcollina/aedes
[go-cross-compile]: https://dave.cheney.net/2015/08/22/cross-compilation-with-go-1-5
[go-arm]: https://www.alexruf.net/golang/arm/raspberrypi/2016/01/16/cross-compile-with-go-1-5-for-raspberry-pi.html
[wiki-go-arm]: https://github.com/golang/go/wiki/GoArm
[nats]: https://www.nats.io/
[postgresql]: https://www.postgresql.org/
[rabbitmq]: https://www.rabbitmq.com/download.html
[vernemq]: https://vernemq.com/downloads/
[kafka]: https://kafka.apache.org/quickstart
[postgres-roles]: https://support.rackspace.com/how-to/postgresql-creating-and-dropping-roles/
