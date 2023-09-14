# Messaging

Once a channel is provisioned and thing is connected to it, it can start to publish messages on the channel. The following sections will provide an example of message publishing for each of the supported protocols.

## HTTP

To publish message over channel, thing should send following request:

```bash
curl -s -S -i --cacert docker/ssl/certs/ca.crt -X POST -H "Content-Type: application/senml+json" -H "Authorization: Thing <thing_secret>" https://localhost/http/channels/<channel_id>/messages -d '[{"bn":"some-base-name:","bt":1.276020076001e+09, "bu":"A","bver":5, "n":"voltage","u":"V","v":120.1}, {"n":"current","t":-5,"v":1.2}, {"n":"current","t":-4,"v":1.3}]'
```

Note that if you're going to use senml message format, you should always send messages as an array.

For more information about the HTTP messaging service API, please check out the [API documentation][http-api].

## MQTT

To send and receive messages over MQTT you could use [Mosquitto tools][mosquitto], or [Paho][paho] if you want to use MQTT over WebSocket.

To publish message over channel, thing should call following command:

```bash
mosquitto_pub -u <thing_id> -P <thing_secret> -t channels/<channel_id>/messages -h localhost -m '[{"bn":"some-base-name:","bt":1.276020076001e+09, "bu":"A","bver":5, "n":"voltage","u":"V","v":120.1}, {"n":"current","t":-5,"v":1.2}, {"n":"current","t":-4,"v":1.3}]'
```

To subscribe to channel, thing should call following command:

```bash
mosquitto_sub -u <thing_id> -P <thing_secret> -t channels/<channel_id>/messages -h localhost
```

If you want to use standard topic such as `channels/<channel_id>/messages` with SenML content type (JSON or CBOR), you should use following topic `channels/<channel_id>/messages`.

If you are using TLS to secure MQTT connection, add `--cafile docker/ssl/certs/ca.crt`
to every command.

## CoAP

CoAP adapter implements CoAP protocol using underlying UDP and according to [RFC 7252][rfc7252]. To send and receive messages over CoAP, you can use [CoAP CLI][coap-cli]. To set the add-on, please follow the installation instructions provided [here][coap-cli].

Examples:

```bash
coap-cli get channels/<channel_id>/messages/subtopic -auth <thing_secret> -o
```

```bash
coap-cli post channels/<channel_id>/messages/subtopic -auth <thing_secret> -d "hello world"
```

```bash
coap-cli post channels/<channel_id>/messages/subtopic -auth <thing_secret> -d "hello world" -h 0.0.0.0 -p 1234
```

To send a message, use `POST` request. To subscribe, send `GET` request with Observe option (flag `o`) set to false. There are two ways to unsubscribe:

1. Send `GET` request with Observe option set to true.
2. Forget the token and send `RST` message as a response to `CONF` message received by the server.

The most of the notifications received from the Adapter are non-confirmable. By [RFC 7641][rfc7641]:

> Server must send a notification in a confirmable message instead of a non-confirmable message at least every 24 hours. This prevents a client that went away or is no longer interested from remaining in the list of observers indefinitely.

CoAP Adapter sends these notifications every 12 hours. To configure this period, please check [adapter documentation][coap] If the client is no longer interested in receiving notifications, the second scenario described above can be used to unsubscribe.

## WebSocket

To publish and receive messages over channel using web socket, you should first send handshake request to `/channels/<channel_id>/messages` path. Don't forget to send `Authorization` header with thing authorization token. In order to pass message content type to WS adapter you can use `Content-Type` header.

If you are not able to send custom headers in your handshake request, send them as query parameter `authorization` and `content-type`. Then your path should look like this `/channels/<channel_id>/messages?authorization=<thing_secret>&content-type=<content-type>`.

If you are using the docker environment prepend the url with `ws`. So for example `/ws/channels/<channel_id>/messages?authorization=<thing_secret>&content-type=<content-type>`.

### Basic nodejs example

```javascript
const WebSocket = require("ws");
// do not verify self-signed certificates if you are using one
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
// c02ff576-ccd5-40f6-ba5f-c85377aad529 is an example of a thing_auth_key
const ws = new WebSocket(
  "ws://localhost:8186/ws/channels/1/messages?authorization=c02ff576-ccd5-40f6-ba5f-c85377aad529"
);
ws.on("open", () => {
  ws.send("something");
});
ws.on("message", (data) => {
  console.log(data);
});
ws.on("error", (e) => {
  console.log(e);
});
```

### Basic golang example

```golang
package main

import (
	"log"
	"os"
	"os/signal"
	"time"

	"github.com/gorilla/websocket"
)

var done chan interface{}
var interrupt chan os.Signal

func receiveHandler(connection *websocket.Conn) {
	defer close(done)

	for {
		_, msg, err := connection.ReadMessage()
		if err != nil {
			log.Fatal("Error in receive: ", err)
			return
		}

		log.Printf("Received: %s\n", msg)
	}
}

func main() {
	done = make(chan interface{})
	interrupt = make(chan os.Signal)

	signal.Notify(interrupt, os.Interrupt)

	channelId := "30315311-56ba-484d-b500-c1e08305511f"
	thingSecret := "c02ff576-ccd5-40f6-ba5f-c85377aad529"

	socketUrl := "ws://localhost:8186/channels/" + channelId + "/messages/?authorization=" + thingKey

	conn, _, err := websocket.DefaultDialer.Dial(socketUrl, nil)
	if err != nil {
		log.Fatal("Error connecting to Websocket Server: ", err)
	} else {
		log.Println("Connected to the ws adapter")
	}
	defer conn.Close()

	go receiveHandler(conn)

	for {
		select {

		case <-interrupt:
			log.Println("Interrupt occured, closing the connection...")
			conn.Close()
			err := conn.WriteMessage(websocket.TextMessage, []byte("closed this ws client just now"))
			if err != nil {
				log.Println("Error during closing websocket: ", err)
				return
			}

			select {
			case <-done:
				log.Println("Receiver Channel Closed! Exiting...")

			case <-time.After(time.Duration(1) * time.Second):
				log.Println("Timeout in closing receiving channel. Exiting...")
			}
			return
		}
	}
}
```

## MQTT-over-WS

Mainflux also supports [MQTT-over-WS][mqtt-over-websockets], along with pure WS protocol. this bring numerous benefits for IoT applications that are derived from the properties of MQTT - like QoS and PUB/SUB features.

There are 2 reccomended Javascript libraries for implementing browser support for Mainflux MQTT-over-WS connectivity:

1. [Eclipse Paho JavaScript Client][paho-js]
2. [MQTT.js][mqttjs]

As WS is an extension of HTTP protocol, Mainflux exposes it on port `8008`, so it's usage is practically transparent.
Additionally, please notice that since same port as for HTTP is used (`8008`), and extension URL `/mqtt` should be used -
i.e. connection URL should be `ws://<host_addr>/mqtt`.

For quick testing you can use [HiveMQ UI tool][websocket-client].

Here is an example of a browser application connecting to Mainflux server and sending and receiving messages over WebSocket using MQTT.js library:

```javascript
<script src="https://unpkg.com/mqtt/dist/mqtt.min.js"></script>
<script>
    // Initialize a mqtt variable globally
    console.log(mqtt)

    // connection option
    const options = {
        clean: true, // retain session
        connectTimeout: 4000, // Timeout period
        // Authentication information
        clientId: '14d6c682-fb5a-4d28-b670-ee565ab5866c',
        username: '14d6c682-fb5a-4d28-b670-ee565ab5866c',
        password: 'ec82f341-d4b5-4c77-ae05-34877a62428f',
    }

    var channelId = '08676a76-101d-439c-b62e-d4bb3b014337'
    var topic = 'channels/' + channelId + '/messages'

    // Connect string, and specify the connection method by the protocol
    // ws Unencrypted WebSocket connection
    // wss Encrypted WebSocket connection
    const connectUrl = 'ws://localhost/mqtt'
    const client = mqtt.connect(connectUrl, options)

    client.on('reconnect', (error) => {
        console.log('reconnecting:', error)
    })

    client.on('error', (error) => {
        console.log('Connection failed:', error)
    })

    client.on('connect', function () {
        console.log('client connected:' + options.clientId)
        client.subscribe(topic, { qos: 0 })
        client.publish(topic, 'WS connection demo!', { qos: 0, retain: false })
    })

    client.on('message', function (topic, message, packet) {
        console.log('Received Message:= ' + message.toString() + '\nOn topic:= ' + topic)
    })

    client.on('close', function () {
        console.log(options.clientId + ' disconnected')
    })
</script>
```

**N.B.** Eclipse Paho lib adds sub-URL `/mqtt` automaticlly, so procedure for connecting to the server can be something like this:

```javascript
var loc = { hostname: "localhost", port: 8008 };
// Create a client instance
client = new Paho.MQTT.Client(loc.hostname, Number(loc.port), "clientId");
// Connect the client
client.connect({ onSuccess: onConnect });
```

## Subtopics

In order to use subtopics and give more meaning to your pub/sub channel, you can simply add any suffix to base `/channels/<channel_id>/messages` topic.

Example subtopic publish/subscribe for bedroom temperature would be `channels/<channel_id>/messages/bedroom/temperature`.

Subtopics are generic and multilevel. You can use almost any suffix with any depth.

Topics with subtopics are propagated to Message broker in the following format `channels.<channel_id>.<optional_subtopic>`.

Our example topic `channels/<channel_id>/messages/bedroom/temperature` will be translated to appropriate Message Broker topic `channels.<channel_id>.bedroom.temperature`.

You can use multilevel subtopics, that have multiple parts. These parts are separated by `.` or `/` separators.
When you use combination of these two, have in mind that behind the scene, `/` separator will be replaced with `.`.
Every empty part of subtopic will be removed. What this means is that subtopic `a///b` is equivalent to `a/b`.
When you want to subscribe, you can use the default Message Broker, NATS, wildcards `*` and `>`. Every subtopic part can have `*` or `>` as it's value, but if there is any other character beside these wildcards, subtopic will be invalid. What this means is that subtopics such as `a.b*c.d` will be invalid, while `a.b.*.c.d` will be valid.

Authorization is done on channel level, so you only have to have access to channel in order to have access to
it's subtopics.

**Note:** When using MQTT, it's recommended that you use standard MQTT wildcards `+` and `#`.

## MQTT Broker

Mainflux supports the MQTT protocol for message exchange. MQTT is a lightweight Publish/Subscribe messaging protocol used to connect restricted devices in low bandwidth, high-latency or unreliable networks. The publish-subscribe messaging pattern requires a message broker. The broker is responsible for distributing messages to and from clients connected to the MQTT adapter.

Mainflux supports [MQTT version 3.1.1][mqtt-v3.1.1]. The MQTT adapter is based on [Eclipse Paho][paho] MQTT client library. The adapter is configured to use [nats][nats-mqtt] as the default MQTT broker, but you can use [vernemq][vernemq] too.

### Configuration

In the dev environment, docker profiles are preferred when handling different MQTT and message brokers supported by Mainflux.

Mainflux uses two types of brokers:

1. `MQTT_BROKER`: Handles MQTT communication between MQTT adapters and message broker.
2. `MESSAGE_BROKER`: Manages communication between adapters and Mainflux writer services.

`MQTT_BROKER` can be either `vernemq` or `nats`.
`MESSAGE_BROKER` can be either `nats` or `rabbitmq`.

Each broker has a unique profile for configuration. The available profiles are:

- `vernemq_nats`: Uses `vernemq` as MQTT_BROKER and `nats` as MESSAGE_BROKER.
- `vernemq_rabbitmq`: Uses `vernemq` as MQTT_BROKER and `rabbitmq` as MESSAGE_BROKER.
- `nats_nats`: Uses `nats` as both MQTT_BROKER and MESSAGE_BROKER.
- `nats_rabbitmq`: Uses `nats` as MQTT_BROKER and `rabbitmq` as MESSAGE_BROKER.

The following command will run VerneMQ as an MQTT broker and Nats as a message broker:

```bash
MF_MQTT_BROKER_TYPE=vernemq MF_BROKER_TYPE=nats make run
```

The following command will run NATS as an MQTT broker and RabbitMQ as a message broker:

```bash
MF_MQTT_BROKER_TYPE=nats MF_BROKER_TYPE=rabbitmq make run
```

By default, NATS is used as an MQTT broker and RabbitMQ as a message broker.

### Nats MQTT Broker

NATS support for MQTT and it is designed to empower users to leverage their existing IoT deployments. NATS offers significant advantages in terms of security and observability when used end-to-end. NATS server as a drop-in replacement for MQTT is compelling. This approach allows you to retain your existing IoT investments while benefiting from NATS' secure, resilient, and scalable access to your streams and services.

#### Architecture

To enable MQTT support on NATS, JetStream needs to be enabled. This is done by default in Mainflux. This is because persistence is necessary for sessions and retained messages, even for QoS 0 retained messages. Communication between MQTT and NATS involves creating similar NATS subscriptions when MQTT clients subscribe to topics. This ensures that the interest is registered in the NATS cluster, and messages are delivered accordingly. When MQTT publishers send messages, they are converted to NATS subjects, and matching NATS subscriptions receive the MQTT messages.

NATS supports up to QoS 1 subscriptions, where the server retains messages until it receives the PUBACK for the corresponding packet identifier. If PUBACK is not received within the "ack_wait" interval, the message is resent. The maximum value for "max_ack_pending" is 65535.

NATS Server persists all sessions, even if they are created with the "clean session" flag. Sessions are identified by client identifiers. If two connections attempt to use the same client identifier, the server will close the existing connection and accept the new one, reducing the flapping rate.

NATS supports MQTT in a NATS cluster, with the replication factor automatically set based on cluster size.

#### Limitations

- NATS does not support QoS 2 messages. Hence Mainflux inherently does not support QoS 2 messages.
- MQTT wildcard "#" may cause the NATS server to create two subscriptions.
- MQTT concurrent sessions may result in the new connection being evicted instead of the existing one.

### Vernemq MQTT Broker

VerneMQ is a powerful MQTT publish/subscribe message broker designed to implement the OASIS industry standard MQTT protocol. It is built to take messaging and IoT applications to the next level by providing a unique set of features related to scalability, reliability, high-performance, and operational simplicity.

Key features of VerneMQ include:

- Low Entry and Exit Risk: VerneMQ is open-source and Apache 2 licensed, allowing unrestricted commercial re-use without upfront investment.
- Carrier-Grade Reliability: Built on OTP (Open Telecom Platform), VerneMQ leverages telecom-grade technology for soft-realtime, distributed control, and messaging applications. It is highly fault-tolerant and capable of continuous operation.
- Scalability: VerneMQ can scale to handle millions of clients, limited only by the underlying hardware. You can easily add nodes to a VerneMQ cluster for horizontal scalability.
- Cluster Operations & Monitoring: VerneMQ comes with built-in extensible metrics systems and allows cluster-wide instant live reconfiguration. It focuses on production tooling and enterprise operations for operational peace of mind.
- Lower Total Cost of Ownership (TCO): VerneMQ offers a favourable TCO compared to many messaging Platform-as-a-Service (PaaS) solutions.
- Full MQTT Support: VerneMQ implements the full MQTT 3.1, 3.1.1, and 5.0 specifications, including various QoS levels, authentication and authorization options, TLS/SSL encryption, WebSockets support, clustering, and more.

#### Architecture

VerneMQ is designed from the ground up to work as a distributed message broker, ensuring continued operation even in the event of node or network failures. It can easily scale both horizontally and vertically to handle large numbers of concurrent clients.

VerneMQ uses a master-less clustering technology, which means there are no special nodes like masters or slaves to consider when adding or removing nodes, making cluster operation safe and simple. This allows MQTT clients to connect to any cluster node and receive messages from any other node. However, it acknowledges the challenges of fulfilling MQTT specification guarantees in a distributed environment, particularly during network partitions.

## Message Broker

Mainflux supports multiple message brokers for message exchange. Message brokers are used to distribute messages to and from clients connected to the different protocols adapters and writers. Writers, which are responsible for storing messages in the database, are connected to the message broker using wildcard subscriptions. This means that writers will receive all messages published to the message broker. Clients can subscribe to the message broker using topic and subtopic combinations. The message broker will then forward all messages published to the topic and subtopic combination to the client.

Mainflux supports [NATS][nats], [RabbitMQ][rabbitmq] and [Kafka][kafka] as message brokers.

### NATS JetStream

Since Mainflux supports configurable message brokers, you can use Nats with JetStream enabled as a message broker. To do so, you need to set `MF_BROKER_TYPE` to `nats` and set `MF_NATS_URL` to the url of your nats instance. When using `make` command to start Mainflux `MF_BROKER_URL` is automatically set to `MF_NATS_URL`.

Since Mainflux is using `nats:2.9.21-alpine` docker image with the following configuration:

```conf
max_payload: 1MB
max_connections: 1M
port: $MF_NATS_PORT
http_port: $MF_NATS_HTTP_PORT
trace: true

jetstream {
    store_dir: "/data"
    cipher: "aes"
    key: $MF_NATS_JETSTREAM_KEY
    max_mem: 1G
}
```

These are the default values but you can change them by editing the configuration file. For more information about nats configuration checkout [official nats documentation][nats-jestream]. The health check endpoint is exposed on `MF_NATS_HTTP_PORT` and its `/healthz` path.

#### Architecture

The main reason of using Nats with JetStream enabled is to have a distributed system with high availability and minimal dependencies. Nats is configure to run as the default message broker, but you can use any other message broker supported by Mainflux. Nats is configured to use JetStream, which is a distributed streaming platform built on top of nats. JetStream is used to store messages and to provide high availability. This makes nats to be used as the default event store, but you can use any other event store supported by Mainflux. Nats with JetStream enabled is also used as a key-value store for caching purposes. This makes nats to be used as the default cache store, but you can use any other cache store supported by Mainflux.

This versatile architecture allows you to use nats alone for the MQTT broker, message broker, event store and cache store. This is the default configuration, but you can use any other MQTT broker, message broker, event store and cache store supported by Mainflux.

### RabbitMQ

Since Mainflux uses a configurable message broker, you can use RabbitMQ as a message broker. To do so, you need to set `MF_BROKER_TYPE` to `rabbitmq` and set `MF_RABBITMQ_URL` to the url of your RabbitMQ instance. When using `make` command to start Mainflux `MF_BROKER_URL` is automatically set to `MF_RABBITMQ_URL`.

Since Mainflux is using `rabbitmq:3.9.20-management-alpine` docker image, the management console is available at port `MF_RABBITMQ_HTTP_PORT`

#### Architecture

Mainflux has one exchange for the entire platform called `messages`. This exchange is of type `topic`. The exchange is `durable` i.e. it will survive broker restarts and remain declared when there are no remaining bindings. The exchange does not `auto-delete` when all queues have finished using it. When declaring the exchange `no_wait` is set to `false` which means that the broker will wait for a confirmation from the server that the exchange was successfully declared. The exchange is not `internal` i.e. other exchanges can publish messages to it.

Mainflux uses topic-based routing to route messages to the appropriate queues. The routing key is in the format `channels.<channel_id>.<optional_subtopic>`. A few valid routing key examples: `channels.318BC587-A68B-40D3-9026-3356FA4E702C`, `channels.318BC587-A68B-40D3-9026-3356FA4E702C.bedroom.temperature`.

The AMQP published message doesn't contain any headers. The message body is the payload of the message.

When subscribing to messages from a channel, a queue is created with the name `channels.<channel_id>.<optional_subtopic>`. The queue is `durable` i.e. it will survive broker restarts and remain declared when there are no remaining consumers or bindings. The queue does not `auto-delete` when all consumers have finished using it. The queue is not `exclusive` i.e. it can be accessed in other connections. When declaring the queue we set `no_wait` to `false` which means that the broker waits for a confirmation from the server that the queue was successfully declared. The queue is not passive i.e. the server creates the queue if it does not exist.

The queue is then bound to the exchange with the routing key `channels.<channel_id>.<optional_subtopic>`. The binding is not no-wait i.e. the broker waits for a confirmation from the server that the binding was successfully created.

Once this is done, the consumer can start consuming messages from the queue with a specific client ID. The consumer is not `no-local` i.e. the server will not send messages to the connection that published them. The consumer is not `exclusive` i.e. the queue can be accessed in other connections. The consumer is `no-ack` i.e. the server acknowledges
deliveries to this consumer prior to writing the delivery to the network.

When Unsubscribing from a channel, the queue is unbound from the exchange and deleted.

For more information and examples checkout [official nats.io documentation][nats], [official rabbitmq documentation][rabbitmq], [official vernemq documentation][vernemq] and [official kafka documentation][kafka].

[nats-jestream]: https://docs.nats.io/nats-concepts/jetstream
[http-api]: https://github.com/mainflux/mainflux/blob/master/api/openapi/http.yml
[mosquitto]: https://mosquitto.org
[paho]: https://www.eclipse.org/paho/
[rfc7252]: https://tools.ietf.org/html/rfc7252
[coap-cli]: https://github.com/mainflux/coap-cli
[rfc7641]: https://tools.ietf.org/html/rfc7641#page-18
[coap]: https://www.github.com/mainflux/mainflux/tree/master/coap/README.md
[mqtt-over-websockets]: https://www.hivemq.com/blog/mqtt-essentials-special-mqtt-over-websockets/#:~:text=In%20MQTT%20over%20WebSockets%2C%20the,(WebSockets%20also%20leverage%20TCP).
[paho-js]: https://www.eclipse.org/paho/index.php?page=clients/js/index.php
[mqttjs]: https://github.com/mqttjs/MQTT.js
[websocket-client]: http://www.hivemq.com/demos/websocket-client/
[nats]: https://nats.io/documentation/writing_applications/subscribing/
[rabbitmq]: https://www.rabbitmq.com/documentation.html
[vernemq]: https://docs.vernemq.com/
[kafka]: https://kafka.apache.org/documentation/
[nats-mqtt]: https://docs.nats.io/running-a-nats-service/configuration/mqtt
[mqtt-v3.1.1]: https://docs.oasis-open.org/mqtt/mqtt/v3.1.1/os/mqtt-v3.1.1-os.html
