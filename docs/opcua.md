# OPC-UA

OPC Unified Architecture (OPC-UA) is a communication protocol and framework that is widely used in industrial automation and the Industrial Internet of Things (IIoT). It provides a standard platform for connecting industrial devices and systems, allowing them to share data and information seamlessly. Data from the devices is sent to the OPC-UA Server where a client can consume it.

Bridging with an OPC-UA Server can be done over the [opcua-adapter][opcua-adapter]. This service sits between Magistrala and an [OPC-UA Server][opcua-arch] and just forwards the messages from one system to another.


## Run OPC-UA Server

The OPC-UA Server is used for connectivity layer. It allows various methods to read information from the OPC-UA server and its nodes. The current version of the opcua-adapter still experimental and only `Browse` and `Subscribe` methods are implemented. [Public OPC-UA test servers][public-opcua] are available for testing of OPC-UA clients and can be used for development and test purposes.

## Magistrala OPC-UA Adapter

Execute the following command from Magistrala project root to run the opcua-adapter:

```bash
docker-compose -f docker/addons/opcua-adapter/docker-compose.yml up -d
```

### Route Map

The opcua-adapter uses [Redis][redis] database to create a route-map between Magistrala and an OPC-UA Server. As Magistrala uses Things and Channels IDs to sign messages, OPC-UA uses node ID (node namespace and node identifier combination) and server URI. The adapter route-map associates a `Thing ID` with a `Node ID` and a `Channel ID` with a `Server URI`.

The opcua-adapter uses the metadata of provision events emitted by Magistrala system to update its route map. For that, you must provision Magistrala Channels and Things with an extra metadata key in the JSON Body of the HTTP request. It must be a JSON object with key `opcua` which value is another JSON object. This nested JSON object should contain `node_id` or `server_uri` that corresponds to an existent OPC-UA `Node ID` or `Server URI`:

**Channel structure:**

```json
{
  "name": "<channel name>",
  "metadata:": {
    "opcua": {
      "server_uri": "<Server URI>"
    }
  }
}
```

**Thing structure:**

```json
{
  "name": "<thing name>",
  "metadata:": {
    "opcua": {
      "node_id": "<Node ID>"
    }
  }
}
```

### Browse

The opcua-adapter exposes a `/browse` HTTP endpoint accessible with method `GET` and configurable throw HTTP query parameters `server`, `namespace` and `identifier`. The server URI, the node namespace and the node identifier represent the parent node and are used to fetch the list of available children nodes starting from the given one. By default the root node ID (node namespace and node identifier combination) of an OPC-UA server is `ns=0;i=84`. It's also the default value used by the opcua-adapter to do the browsing if only the server URI is specified in the HTTP query.

### Subscribe

To create an OPC-UA subscription, user should connect the Thing to the Channel. This will automatically create the connection, enable the redis route-map and run a subscription to the `server_uri` and `node_id` defined in the Thing and Channel metadata.

### Messaging

To forward OPC-UA messages the opcua-adapter subscribes to the Node ID of an OPC-UA Server URI. It verifies the `server_uri` and the `node_id` of received messages. If the mapping exists it uses corresponding `Channel ID` and `Thing ID` to sign and forwards the content of the OPC-UA message to the Magistrala message broker. If the mapping or the connection between the Thing and the Channel don't exist the subscription stops.

### Sample Use Case

OPC-UA can be used in an industrial setup to monitor process values from the different industrial devices and machines within the industry setup. The industrial devices which are controlled by controllers such as PLCs (Programmable Logic Controllers) send data to the OPC-UA server over TCP/IP. From the OPC-UA server, data is sent to and from Magistrala cloud using the OPC-UA adapter in Magistrala. The devices, known as nodes, are associated with things on Magistrala and the Service URIs are associated with Channels on Magistrala. Data (Messages) received on the channels can be sent to the writers on Magistrala to make it available to the end user.

|       ![OPC-UA][opcua-diagram]      |
| :---------------------------------: |
| Figure 1 - OPC-UA Sample use case   |

[opcua-adapter]: https://github.com/absmach/magistrala/tree/main/opcua
[opcua-arch]: https://en.wikipedia.org/wiki/OPC_Unified_Architecture
[opcua-diagram]: img/opcua/opcua.png
[public-opcua]: https://github.com/node-opcua/node-opcua/wiki/publicly-available-OPC-UA-Servers-and-Clients
[redis]: https://redis.io/
