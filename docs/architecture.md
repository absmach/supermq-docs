# Architecture

## Components

Mainflux IoT platform is comprised of the following services:

| Service                        | Description                                                                             |
| :----------------------------- | :-------------------------------------------------------------------------------------- |
| [users][users-service]         | Manages platform's users and auth concerns in regards to users and groups               |
| [things][things-service]       | Manages platform's things, channels and auth concerns in regards to things and channels |
| [http-adapter][http-adapter]   | Provides an HTTP interface for accessing communication channels                         |
| [mqtt-adapter][mqtt-adapter]   | Provides an MQTT and MQTT over WS interface for accessing communication channels        |
| [ws-adapter][ws-adapter]       | Provides a WebSocket interface for accessing communication channels                     |
| [coap-adapter][coap-adapter]   | Provides a CoAP interface for accessing communication channels                          |
| [opcua-adapter][opcua-adapter] | Provides an OPC-UA interface for accessing communication channels                       |
| [lora-adapter][lora-adapter]   | Provides a LoRa Server forwarder for accessing communication channels                   |
| [mainflux-cli][mainflux-cli]   | Command line interface                                                                  |

![arch][architecture]

## Domain Model

The platform is built around 2 main entities: **users** and **things**.

`User` represents the real (human) user of the system. They are represented via their identity, email address, and secret, password, which they use as platform access credentials in order to obtain an access token. Once logged into the system, a user can manage their resources (i.e. groups, things and channels) in CRUD fashion and define access control policies by connecting them.

`Group` represents a logical group of users. It is used to simplify access control management by allowing users to be grouped together. A user is grouped by assigning them to a group with specified policies. This way, a user can be assigned to multiple groups, and each group can have multiple users assigned to it. Users in one group have access to other users in the same group so long as they have the required policy. A group can also be assigned to another group, thus creating a group hierarchy.

`Thing` represents devices (or applications) connected to Mainflux that uses the platform for message exchange with other "things".

`Channel` represents a communication channel. It serves as message topic that can be consumed by all of the things connected to it. It also servers a grouping mechanism for things. A thing can be connected to multiple channels, and a channel can have multiple things connected to it. A user can be connected to a channel as well, thus allowing them to have access to the messages published to that channel and also things connected to that channel with the required policy. A channel can also be assigned to another channel, thus creating a channel hierarchy.

## Messaging

Mainflux uses [NATS][nats] as its default messaging backbone, due to its lightweight and performant nature. You can treat its _subjects_ as physical representation of Mainflux channels, where subject name is constructed using channel unique identifier. Mainflux also provides the ability to change your default message broker to [RabbitMQ][rabbitmq], [VerneMQ][vernemq] or [Kafka][kafka].

In general, there is no constrained put on content that is being exchanged through channels. However, in order to be post-processed and normalized, messages should be formatted using [SenML][senml].

## Edge

Mainflux platform can be run on the edge as well. Deploying Mainflux on a gateway makes it able to collect, store and analyze data, organize and authenticate devices. To connect Mainflux instances running on a gateway with Mainflux in a cloud we can use two gateway services developed for that purpose:

- [Agent][agent]
- [Export][export]

## Unified IoT Platform

Running Mainflux on gateway moves computation from cloud towards the edge thus decentralizing IoT system. Since we can deploy same Mainflux code on gateway and in the cloud there are many benefits but the biggest one is easy deployment and adoption - once the engineers understand how to deploy and maintain the platform, they will have the same known work across the whole edge-fog-cloud continuum. Same set of tools can be used, same patches and bug fixes can be applied. The whole system is much easier to reason about, and the maintenance is much easier and less costly.

[users-service]: https://github.com/mainflux/mainflux/tree/master/users
[things-service]: https://github.com/mainflux/mainflux/tree/master/things
[http-adapter]: https://github.com/mainflux/mainflux/tree/master/http
[mqtt-adapter]: https://github.com/mainflux/mainflux/tree/master/mqtt
[coap-adapter]: https://github.com/mainflux/mainflux/tree/master/coap
[ws-adapter]: https://github.com/mainflux/mainflux/tree/master/ws
[opcua-adapter]: https://github.com/mainflux/mainflux/tree/master/opcua
[lora-adapter]: https://github.com/mainflux/mainflux/tree/master/lora
[mainflux-cli]: https://github.com/mainflux/mainflux/tree/master/cli
[architecture]: img/architecture.jpg
[nats]: https://nats.io/
[rabbitmq]: https://www.rabbitmq.com/
[vernemq]: https://vernemq.com/
[kafka]: https://kafka.apache.org/
[senml]: https://tools.ietf.org/html/draft-ietf-core-senml-08
[agent]: /edge/#agent
[export]: /edge/#export
