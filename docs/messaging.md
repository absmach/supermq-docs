# Messaging

Once a channel is provisioned and thing is connected to it, it can start to
publish messages on the channel. The following sections will provide an example
of message publishing for each of the supported protocols.

## HTTP

To publish message over channel, thing should send following request:

```
curl -s -S -i --cacert docker/ssl/certs/ca.crt -X POST -H "Content-Type: application/senml+json" -H "Authorization: Thing <thing_key>" https://localhost/http/channels/<channel_id>/messages -d '[{"bn":"some-base-name:","bt":1.276020076001e+09, "bu":"A","bver":5, "n":"voltage","u":"V","v":120.1}, {"n":"current","t":-5,"v":1.2}, {"n":"current","t":-4,"v":1.3}]'
```

Note that if you're going to use senml message format, you should always send
messages as an array.

For more information about the HTTP messaging service API, please check out the [API documentation](https://github.com/mainflux/mainflux/blob/master/api/http.yml).

## MQTT

To send and receive messages over MQTT you could use [Mosquitto tools](https://mosquitto.org),
or [Paho](https://www.eclipse.org/paho/) if you want to use MQTT over WebSocket.

To publish message over channel, thing should call following command:

```
mosquitto_pub -u <thing_id> -P <thing_key> -t channels/<channel_id>/messages -h localhost -m '[{"bn":"some-base-name:","bt":1.276020076001e+09, "bu":"A","bver":5, "n":"voltage","u":"V","v":120.1}, {"n":"current","t":-5,"v":1.2}, {"n":"current","t":-4,"v":1.3}]'
```

To subscribe to channel, thing should call following command:

```
mosquitto_sub -u <thing_id> -P <thing_key> -t channels/<channel_id>/messages -h localhost
```

If you want to use standard topic such as `channels/<channel_id>/messages` with SenML content type (JSON or CBOR), you should use following topic `channels/<channel_id>/messages`.

If you are using TLS to secure MQTT connection, add `--cafile docker/ssl/certs/ca.crt`
to every command.

## CoAP

CoAP adapter implements CoAP protocol using underlying UDP and according to [RFC 7252](https://tools.ietf.org/html/rfc7252). To send and receive messages over CoAP, you can use [CoAP CLI](https://github.com/mainflux/coap-cli). To set the add-on, please follow the installation instructions provided [here](https://github.com/mainflux/coap-cli).

###
Examples:

```
coap-cli get channels/0bb5ba61-a66e-4972-bab6-26f19962678f/messages/subtopic -auth 1e1017e6-dee7-45b4-8a13-00e6afeb66eb -o
```
```
coap-cli post channels/0bb5ba61-a66e-4972-bab6-26f19962678f/messages/subtopic -auth 1e1017e6-dee7-45b4-8a13-00e6afeb66eb -d "hello world"
```
```
coap-cli post channels/0bb5ba61-a66e-4972-bab6-26f19962678f/messages/subtopic -auth 1e1017e6-dee7-45b4-8a13-00e6afeb66eb -d "hello world" -h 0.0.0.0 -p 1234
```
To send a message, use `POST` request.
To subscribe, send `GET` request with Observe option (flag `o`) set to false. There are two ways to unsubscribe:
  1) Send `GET` request with Observe option set to true.
  2) Forget the token and send `RST` message as a response to `CONF` message received by the server.

The most of the notifications received from the Adapter are non-confirmable. By [RFC 7641](https://tools.ietf.org/html/rfc7641#page-18):

> Server must send a notification in a confirmable message instead of a non-confirmable message at least every 24 hours. This prevents a client that went away or is no longer interested from remaining in the list of observers indefinitely.

CoAP Adapter sends these notifications every 12 hours. To configure this period, please check [adapter documentation](https://www.github.com/mainflux/mainflux/tree/master/coap/README.md) If the client is no longer interested in receiving notifications, the second scenario described above can be used to unsubscribe.

## WebSocket

To publish and receive messages over channel using web socket, you should first
send handshake request to `/channels/<channel_id>/messages` path. Don't forget
to send `Authorization` header with thing authorization token. In order to pass
message content type to WS adapter you can use `Content-Type` header.

If you are not able to send custom headers in your handshake request, send them as
query parameter `authorization` and `content-type`. Then your path should look like
this `/channels/<channel_id>/messages?authorization=<thing_auth_key>&content-type=<content-type>`.

If you are using the docker environment prepend the url with `ws`. So for example
`/ws/channels/<channel_id>/messages?authorization=<thing_auth_key>&content-type=<content-type>`.

### Basic nodejs example

```javascript
const WebSocket = require('ws');
// do not verify self-signed certificates if you are using one
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'
// c02ff576-ccd5-40f6-ba5f-c85377aad529 is an example of a thing_auth_key
const ws = new WebSocket('ws://localhost:8190/ws/channels/1/messages?authorization=c02ff576-ccd5-40f6-ba5f-c85377aad529')
ws.on('open', () => {
    ws.send('something')
})
ws.on('message', (data) => {
    console.log(data)
})
ws.on('error', (e) => {
    console.log(e)
})
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
	thingKey := "c02ff576-ccd5-40f6-ba5f-c85377aad529"

	socketUrl := "ws://localhost:8190/channels/" + channelId + "/messages/?authorization=" + thingKey

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

Mainflux also supports [MQTT-over-WS](https://www.hivemq.com/blog/mqtt-essentials-special-mqtt-over-websockets/#:~:text=In%20MQTT%20over%20WebSockets%2C%20the,(WebSockets%20also%20leverage%20TCP).), along with pure WS protocol. this bring numerous benefits for IoT applications that are derived from the properties of MQTT - like QoS and PUB/SUB features.

There are 2 reccomended Javascript libraries for implementing browser support for Mainflux MQTT-over-WS connectivity:

1. [Eclipse Paho JavaScript Client](https://www.eclipse.org/paho/index.php?page=clients/js/index.php)
2. [MQTT.js](https://github.com/mqttjs/MQTT.js)

As WS is an extension of HTTP protocol, Mainflux exposes it on port `80`, so it's usage is practically transparent.
Additionally, please notice that since same port as for HTTP is used (`80`), and extension URL `/mqtt` should be used -
i.e. connection URL should be `ws://<host_addr>/mqtt`.

For quick testing you can use [HiveMQ UI tool](http://www.hivemq.com/demos/websocket-client/).

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
var loc = { hostname: 'localhost', port: 80 }
// Create a client instance
client = new Paho.MQTT.Client(loc.hostname, Number(loc.port), "clientId")
// Connect the client
client.connect({onSuccess:onConnect});
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

For more information and examples checkout [official nats.io documentation](https://nats.io/documentation/writing_applications/subscribing/), [official rabbitmq documentation](https://www.rabbitmq.com/documentation.html), [official vernemq documentation](https://docs.vernemq.com/) and [official kafka documentation](https://kafka.apache.org/documentation/)
