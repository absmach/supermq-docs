---
title: Architecture
---

## Components

SuperMQ IoT platform is comprised of the following services:

| Service                      | Description                                                                                 |
| :--------------------------- | :------------------------------------------------------------------------------------------ |
| [auth][auth-service]         | Handles authorization and authentication for the platfomr as well as managing keys and PATS |
| [users][users-service]       | Manages platform's users and auth concerns in regards to users                              |
| [groups][groups-service]     | Manages platform's groups and auth concerns in regards to groups                            |
| [clients][clients-service]   | Manages platform's clients and auth concerns in regards to clients                          |
| [channels][channels-service] | Manages platform's channels and auth concerns in regards to channels                        |
| [domains][domains-service]   | Manages platform's domains and auth concerns in regards to domains                          |
| [http-adapter][http-adapter] | Provides an HTTP interface for sending messages via HTTP                                    |
| [mqtt-adapter][mqtt-adapter] | Provides an MQTT and MQTT over WS interface for sending and receiving messages via MQTT     |
| [ws-adapter][ws-adapter]     | Provides a WebSocket interface for sending and receiving messages via WS                    |
| [coap-adapter][coap-adapter] | Provides a CoAP interface for sending and receiving messages via CoAP                       |
| [supermq-cli][supermq-cli]   | Command line interface                                                                      |

![arch](img/architecture.svg)

## Domain Model

The platform consists of the following core entities: **user**,**client**,**channel**, **group** and **domain**.

`User` represents the real (human) user of the system. Users are identified by their username and password, which are used as platform access credentials in order to obtain an access token. Once logged into the system, a user can manage their resources (i.e. domains,groups, clients and channels) in CRUD fashion and define access control policies by creating and managing roles for them.

`Group` represents a logical grouping of clients, channels or other groups. It is used to simplify access control management by allowing these entities to be grouped together. When a user becomes the member of a role of a group, they are able to access the entities encompassed by the group. A user can have a role in multiple groups, and each group can have multiple members(users). Groups can have a single parent group and many children groups, this enables shared access to entities to users and a hierarchical structure. A role created for a group determines what a member(user) of the role can do with the group and entities associated with the group.

`Clients` represents devices (or applications) connected to SuperMQ that use the platform for message exchange with other "clients". Clients have roles to which users are members to, determining which actions the role member(user) can perform on them.

`Channel` represents a communication channel. It serves as a message topic that can be consumed by all of the clients connected to it. It also serves as grouping mechanism for clients. A client can be connected to multiple channels, and a channel can have multiple clients connected to it. A user can also have access to a channel thus allowing them access to the messages published to that channel. As mentioned before a channel can belong to a group.A client connected to a channel forms a connection in SuperMQ. The connection can be of three types: a Publish type, where the client can only publish messages to the channel, a Subscribe type, meaning a client can only receive messages sent to the channel and Publish and Subscribe type where the client can both publish and receive messages on the channel. Channels have roles which determine the actions a role member(user) can perform on them.

`Domain` represents a top level organizational unit which encompases entities such as groups, channels and clients. All these entities have to belong to a domain. A user has a role on a domain which determines what actions the user can perform on the domain as well as the entities in the domain. The domain enables access to clients,channels, groups and messages to be shared with other users on the platform. They also offer the collaborative space to perfom CRUD operations on these entities.

Additional functionality is provided by the following services:

`auth` handles authentication and authorization functionality for the platform. The service is used to issue keys and tokens. The service also facilitates fine grained access control to core entities.

`protocol-adapters` These include adapters for HTTP, CoAP, WS and MQTT. These services handle bidirectional communication between the platform and devices and applications. The adapters enable message handling in the system, supporting the PubSub model of the platform.

## Messaging

SuperMQ uses [NATS][nats] as its default messaging backbone, due to its lightweight and performant nature. You can treat its _subjects_ as physical representation of SuperMQ channels, where subject name is constructed using channel unique identifier. SuperMQ also provides the ability to change your default message broker to [RabbitMQ][rabbitmq], [VerneMQ][vernemq] or [Kafka][kafka].

In general, there is no constraint put on content that is being exchanged through channels. However, in order to be post-processed and normalized, messages should be formatted using [SenML][senml].

## Edge

SuperMQ platform can be run on the edge as well. Deploying SuperMQ on a gateway makes it able to collect, store and analyze data, organize and authenticate devices. To connect SuperMQ instances running on a gateway with SuperMQ in a cloud we can use two gateway services developed for that purpose:

- [Agent][agent]
- [Export][export]

## Unified IoT Platform

Running SuperMQ on gateway moves computation from cloud towards the edge thus decentralizing IoT system. Since we can deploy same SuperMQ code on gateway and in the cloud there are many benefits but the biggest one is easy deployment and adoption - once engineers understand how to deploy and maintain the platform, they will be able to apply those same skills to any part of the edge-fog-cloud continuum. This is because the platform is designed to be consistent, making it easy for engineers to move between them. This consistency will save engineers time and effort, and it will also help to improve the reliability and security of the platform. Same set of tools can be used, same patches and bug fixes can be applied. The whole system is much easier to reason about, and the maintenance is much easier and less costly.

[auth-service]: https://github.com/absmach/supermq/tree/main/auth
[users-service]: https://github.com/absmach/supermq/tree/main/users
[groups-service]: https://github.com/absmach/supermq/tree/main/groups
[clients-service]: https://github.com/absmach/supermq/tree/main/clients
[channels-service]: https://github.com/absmach/supermq/tree/main/channels
[domains-service]: https://github.com/absmach/supermq/tree/main/domains
[http-adapter]: https://github.com/absmach/supermq/tree/main/http
[mqtt-adapter]: https://github.com/absmach/supermq/tree/main/mqtt
[coap-adapter]: https://github.com/absmach/supermq/tree/main/coap
[ws-adapter]: https://github.com/absmach/supermq/tree/main/ws
[supermq-cli]: https://github.com/absmach/supermq/tree/main/cli
[nats]: https://nats.io/
[rabbitmq]: https://www.rabbitmq.com/
[vernemq]: https://vernemq.com/
[kafka]: https://kafka.apache.org/
[senml]: https://tools.ietf.org/html/draft-ietf-core-senml-08
[agent]: ./edge.md#agent
[export]: ./edge.md#export
