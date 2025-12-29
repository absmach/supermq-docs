---
slug: magistrala-user-guide
title: Revolutionizing Industrial IoT with an Open Source Platform
authors: osodo
description: Learn how Magistrala simplifies Industrial IoT with robust features like multi-protocol support, scalable architecture, and enhanced security.
tags: ['Magistrala', 'IIoT', 'User Guide', 'Industrial Automation', 'Open Source']
---


# Magistrala: Revolutionizing Industrial IoT with an Open Source Platform

In the world of Industrial Internet of Things (IIoT), businesses are always on the lookout for reliable, scalable, and secure ways to handle their connected devices and data. That's where Magistrala comes in—an open-source IIoT platform that's transforming the way we approach industrial automation and remote monitoring.

<!-- truncate -->

## Key Advantages of Magistrala

1. **Protocol Flexibility**: Magistrala's support for multiple protocols ensures that devices with different communication methods can easily connect and interact within the same ecosystem.

2. **Comprehensive Device Management**: The platform excels in handling large-scale device deployments, simplifying the process of provisioning and maintaining numerous connected devices.

3. **Enhanced Security**: With fine-grained access control, Magistrala ensures that only authorized entities can access sensitive data and system functionalities.

4. **Insightful Monitoring**: Extensive logging and instrumentation support allows for detailed system analysis, facilitating efficient troubleshooting and performance optimization.

5. **Efficient Deployment**: Leveraging container-based deployment with Docker, Magistrala enables quick and consistent setup across various environments.

6. **Robust Data Handling**: The platform's efficient data ingestion, processing, and storage capabilities support real-time analytics and informed decision-making.

7. **Scalability and Reliability**: Designed to be scalable and distributed, Magistrala maintains high availability even as demands increase.

8. **Multi-Tenancy Support**: Multiple users can operate independently within the same platform, enhancing flexibility and resource utilization.

9. **Customizable and Extensible**: Magistrala's architecture allows for easy customization and extension to meet specific business needs.

**Please note:** Magistrala offers a variety of services, each detailed comprehensively in the [architecture documentation][architecture].

## Getting Started with Magistrala

Setting up Magistrala is straightforward. First, the following are needed:

- [Docker](https://docs.docker.com/install/) (version 26.0.0 and above)
- [Go](https://golang.org/doc/install) (version 1.21 and above)

With Docker (version 26.0.0 and above) and Go (version 1.21 and above) installed on your system, you clone the official Magistrala GitHub repository and have the platform up and running in no time. Here's a quick guide to get you started:

- From the terminal, clone the Magistrala repository and navigate to the newly created directory:

  ```bash
  git clone https://github.com/absmach/magistrala.git
  cd magistrala
  ```

- Build and install the binaries:

  ```bash
  make && make install
  ```

**Note:** This process will compile the binaries into the `<project_root>/build` directory. If the `$GOBIN` environment variable is set, the binaries will also be copied to the `go/bin` directory.

To start Magistrala Docker services, execute the following command from the project's root directory:

```bash
make run_stable
```

Magistrala offers multiple interaction options, including a CLI, SDK, HTTP API, and UI, catering to different user preferences and use cases.

### Using the CLI

Magistrala's Command Line Interface (CLI) provides a powerful way to interact with the platform. There are many commands available through the CLI. For more information, refer to the [Magistrala CLI Documentation](https://docs.magistrala.abstractmachines.fr/cli/). To explore available commands and get usage details, run:

```bash
magistrala-cli --help
```

Here is the expected result:

```bash
Usage:
  magistrala-cli [command]

Available Commands:
  bootstrap    Bootstrap management
  certs        Certificates management
  channels     Channels management
  completion   Generate the autocompletion script for the specified shell
  config       CLI local config
  domains      Domains management
  groups       Groups management
  health       Health Check
  help         Help about any command
  invitations  Invitations management
  journal      journal log
  messages     Send or read messages
  provision    Provision things and channels from a config file
  subscription Subscription management
  things       Things management
  users        Users management

Flags:
  -b, --bootstrap-url string     Bootstrap service URL
  -s, --certs-url string         Certs service URL
  -c, --config string            Config path
  -C, --contact string           Subscription contact query parameter
  -y, --content-type string      Message content type (default "application/senml+json")
  -x, --curl                     Convert HTTP request to cURL command
  -d, --domains-url string       Domains service URL
  -h, --help                     help for magistrala-cli
  -H, --host-url string          Host URL
  -p, --http-url string          HTTP adapter URL
  -I, --identity string          User identity query parameter
  -i, --insecure                 Do not check for TLS cert
  -v, --invitations-url string   Inivitations URL
  -a, --journal-url string       Journal Log URL
  -l, --limit uint               Limit query parameter (default 10)
  -m, --metadata string          Metadata query parameter
  -n, --name string              Name query parameter
  -o, --offset uint              Offset query parameter
  -r, --raw                      Enables raw output mode for easier parsing of output
  -R, --reader-url string        Reader URL
  -z, --state string             Bootstrap state query parameter
  -S, --status string            User status query parameter
  -t, --things-url string        Things service URL
  -T, --topic string             Subscription topic query parameter
  -u, --users-url string         Users service URL

Use "magistrala-cli [command] --help" for more information about a command.
```

Here are some basic operations with detailed explanations:

- Create a user:

```bash
magistrala-cli users create John johndoe@example.com 12345678
```

This command creates a new user named John with the email `johndoe@example.com` and password `12345678`.

- After creating a user, you need to generate an access token for them. To do so, run:

```bash
magistrala-cli users token johndoe@example.com 12345678
```

This generates an access token and a refresh token for the created user. The access token is used for authentication in subsequent operations, while the refresh token allows you to generate a new access token when the existing access token expires. For convenience, both tokens can be set as environment variables for easy access:

```bash
ACCESSTOKEN=eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3MTgxOTI2MTIsImlhdCI6MTcxODE4OTAxMiwiaXNzIjoibWFnaXN0cmFsYS5hdXRoIiwidHlwZSI6MCwidXNlciI6ImMxYjQ3OWQwLWEzNDYtNGZiYy1hN2FkLWVkNGFiNjcxYTIyZCJ9._Qlri9FN_E2vJLZIVQzyeeg9I_ggVRi_CKS52xlUD8YEkSKWkTlmr02WlKdhvR-aZzaDyudICLtCPtadMCGCzg

REFRESHTOKEN=eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3MjU3MDM4NTUsImlhdCI6MTcyNTYxNzQ1NSwiaXNzIjoibWFnaXN0cmFsYS5hdXRoIiwidHlwZSI6MSwidXNlciI6IjM0YzNhMDhjLTBkMzEtNGU3Ny1iNjBlLTA0OTBiOTc5NzQyMSJ9.v9tFiX2NKiykg1SmmwNQrSDlcsNrYp7isF0kqTzyo8wiJuYfvO7GwCKNb1aGPx6uR6_VYGQlfN6aoxAKP_42WQ
```

**Note:** The access token is valid for 15 minutes before it expires. After this period, the user will need to use the refresh token to obtain a new access token.

- Create a domain (workspace):

After creating a user and generating access and refresh tokens, you need to add the user to a domain to access resources within the platform. To assign the user to a domain, you need to create a domain (workspace) using the following command:

```bash
magistrala-cli domains create workspace alias $ACCESSTOKEN
```

This creates a new domain with the name "workspace" with an alias. The $ACCESSTOKEN is the token generated in the previous step.

Save the domain ID in an environment variable `DOMAINID` for ease of use for logging in:

```bash
DOMAINID=9a00bc60-2e07-4503-8144-a24e748175d0
```

To login into the created domain/ workspace, you need to embed the token with the domain ID. Including the domain ID in the token ensures that the token is specific to the domain/workspace, which is essential for managing access and permissions within that particular domain/workspace. To do so, run:

```bash
magistrala-cli users token johndoe@example.com 12345678 $DOMAINID
```

Update the `ACCESSTOKEN` and `REFRESHTOKEN` environment variables with the newly generated tokens (token with domain ID attached).

While logged into your domain, you can perform a variety of operations. Some of the key operations include:

- User Management: Manage users within your domain, including creating, updating, and deleting user accounts.
- Things Management: Manage devices or "things" associated with your domain, including adding, updating, and monitoring their status.
- Channel Management: Configure and manage channels for data communication within the domain.
- Domain Management: Handle domain-specific settings and configurations.

For more detailed information on these operations, refer to the [Magistrala CLI Documentation](https://docs.magistrala.abstractmachines.fr/cli/). Let us go through some of the operations.

- Create a thing (device):

```bash
magistrala-cli things create '{
  "name": "Distance Sensor Assembly Line 1",
  "metadata": {
    "type": "sensor",
    "location": "Assembly Line 1",
    "manufacturer": "TechMeasure Inc.",
    "model": "DS-5000",
    "installation_date": "2024-01-15",
    "maintenance_due": "2025-01-15",
    "communication_protocol": "MQTT",
    "battery_level": 95,
    "unit": "mm",
    "sampling_interval": "100ms",
    "data_type": "float",
    "min_value": 0,
    "max_value": 1000,
    "precision": 0.1,
    "threshold_warning": 50,
    "threshold_critical": 25
  },
  "tags": [
    "distance",
    "assembly",
    "quality-control"
  ],
  "status": "enabled"
}' $ACCESSTOKEN
```

This creates a new thing named `Distance Sensor` with metadata specifying its units as `centimeters`.

- Create a channel:

```bash
magistrala-cli channels create '{
  "name": "Assembly Line 1 Product Gap",
  "description": "This is a channel for quality control distance sensors",
  "metadata": {
    "unit": "mm",
    "sampling_interval": "100ms",
    "data_type": "float",
    "min_value": 0,
    "max_value": 1000,
    "precision": 0.1,
    "threshold_warning": 50,
    "threshold_critical": 25
  },
  "status": "enabled"
}' $ACCESSTOKEN
```

This creates a new channel named "Distance" which can be used for communication.

- Connect a thing to a channel:

```bash
magistrala-cli things connect $THINGID $CHANNELID $ACCESSTOKEN
```

This connects the previously created thing to the channel. $THINGID and $CHANNELID are environment variables used to store the Thing and Channel IDs, similar to how the access token is stored. These IDs are generated when the Thing and Channel are created.

- Send a message:

```bash
magistrala-cli messages send $CHANNELID '[{"bn": "DS-5000-AL1-001", "n": "Distance_AssemblyLine1", "u": "mm","v": 152.3}, { "n": "BatteryLevel", "u": "%", "v": 95}, { "n": "SignalStrength", "u": "dBm", "v": -65}]' <thing_secret>
```

This sends a message to the specified channel. The message contains temperature and humidity readings. Replace thing_secret with the secret of the thing.

**Note:** The secret for the thing can be specified during its creation. If not provided, it will be automatically generated by the platform. To view the generated secret, please access the thing's profile as follows:

```bash
magistrala-cli things get $THINGID $ACCESSTOKEN
```

Please note that appropriate access control is required to view the thing's credentials. For more information, please refer to the [documentation][Authorization].

- Read messages:

```bash
magistrala-cli messages read $CHANNELID $ACCESSTOKEN -R <reader_url>
```

**Note:** Magistrala implements various message readers that consume magistrala messages. There are five readers that magistrala implements: - InfluxDB Reader - Cassandra Reader - MongoDB Reader - PostgreSQL Reader - Timescale Reader

For more information on how to install and run readers and writers, please refer to the [documentation][storage].

You can also update a Thing's tags, secret, and metadata. Here's an example of how to do that:

```bash
magistrala-cli things update secret $THINGID $THINGSECRET $ACCESSTOKEN
```

**Note:** Make sure to replace `$THINGID`, `$THINGSECRET`, and `$ACCESSTOKEN` with your actual Thing ID, Thing secret, and access token values, respectively.

Within your domain, you have the ability to invite or assign other users as members, guests, contributors, editors, or administrators. This allows you to grant varying levels of permissions to users over different entities. To assign a user to a domain, use the following command:

```bash
magistrala-cli domains assign users member '[<user_id>]' $DOMAINID $ACCESSTOKEN
```

For example:

```bash
magistrala-cli domains assign users member '["2e8a9cda-5085-45cb-81fe-c9c7b938c25c"]' $DOMAINID $ACCESSTOKEN
```

**Note:** Assigning a user adds them automatically to the domain. However, if invited, the user will need to accept the invitation.

### Using the API

Magistrala also provides RESTful API access for seamless integration with web services and applications. You can use standard HTTP methods to interact with the platform, making it easy to integrate with existing web-based systems.No additional installation is required for this, as you can use tools like curl or any HTTP client library in your preferred programming language.

Let's revisit the CLI process, but this time using the API. Here's how to achieve the same results with API commands.

- To create a user:

```bash
curl -sSiX POST http://localhost:9002/users -H "Content-Type: application/json" -d @- << EOF
{
  "name": "John Doe",
  "credentials": {
    "identity": "john.doe@example.com",
    "secret": "12345678"
  }
}
EOF
```

- To obtain a token for logging into the platform:

```bash
curl -sSiX POST 'http://localhost:9002/users/tokens/issue' \
-H 'Content-Type: application/json' -d @- << EOF
{
  "identity": "john.doe@example.com",
  "secret": "12345678"
}
EOF
```

- To create a domain, execute the following `curl` command:

```bash
curl --location 'http://localhost:8189/domains' \
-H 'accept: application/json' \
-H 'Content-Type: application/json' \
-H 'Authorization: Bearer eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJkb21haW4iOiIzNzFiMjM1MS0wMGQ3LTQ2OWUtYWY5YS02OTQzYWM1NzgwYTUiLCJleHAiOjE3MjQ3NTc3MjMsImlhdCI6MTcyNDc1NDEyMywiaXNzIjoibWFnaXN0cmFsYS5hdXRoIiwic3ViIjoiNWJiMGE0ZDYtZTc0Mi00NDc3LWJmZmQtNThlYzQ4NjBiMDUxIiwidHlwZSI6MCwidXNlciI6IjViYjBhNGQ2LWU3NDItNDQ3Ny1iZmZkLTU4ZWM0ODYwYjA1MSJ9.LmO_coGSgOk3Lm7ogxibPza3zFJI0eVM6t39__j2YpNkNvx7sxKC28FvP5m9bsT0Ta6IKySiz2MaXrQc-Nheqg' \
-d '{
  "name": "workspace",
  "tags": [
    "tag1",
    "tag2"
  ],
  "metadata": {
    "domain": "example.com"
  },
  "alias": "alias"
}'
```

- Similarly, to log in to your newly created domain:

```bash
curl --location 'http://localhost:9002/users/tokens/issue' \
--header 'Content-Type: application/json' \
--data-raw '{
    "identity": "john.doe@example.com",
    "secret": "12345678",
    "domain_id": "371b2351-00d7-469e-af9a-6943ac5780a5"
}'
```

- Creating a Thing and a Channel is straightforward; run the respective commands:

```bash
curl --location 'http://localhost:9000/things' \
--header 'accept: application/json' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJkb21haW4iOiIzNzFiMjM1MS0wMGQ3LTQ2OWUtYWY5YS02OTQzYWM1NzgwYTUiLCJleHAiOjE3MjQ3NTc3MjMsImlhdCI6MTcyNDc1NDEyMywiaXNzIjoibWFnaXN0cmFsYS5hdXRoIiwic3ViIjoiNWJiMGE0ZDYtZTc0Mi00NDc3LWJmZmQtNThlYzQ4NjBiMDUxIiwidHlwZSI6MCwidXNlciI6IjViYjBhNGQ2LWU3NDItNDQ3Ny1iZmZkLTU4ZWM0ODYwYjA1MSJ9.LmO_coGSgOk3Lm7ogxibPza3zFJI0eVM6t39__j2YpNkNvx7sxKC28FvP5m9bsT0Ta6IKySiz2MaXrQc-Nheqg' \
--data '{
  "name": "Distance Sensor Assembly Line 1",
  "metadata": {
    "type": "sensor",
    "location": "Assembly Line 1",
    "manufacturer": "TechMeasure Inc.",
    "model": "DS-5000",
    "installation_date": "2024-01-15",
    "maintenance_due": "2025-01-15",
    "communication_protocol": "MQTT",
    "battery_level": 95,
    "unit": "mm",
    "sampling_interval": "100ms",
    "data_type": "float",
    "min_value": 0,
    "max_value": 1000,
    "precision": 0.1,
    "threshold_warning": 50,
    "threshold_critical": 25
  },
  "tags": [
    "distance",
    "assembly",
    "quality-control"
  ],
  "status": "enabled"
}'
```

```bash
curl --location 'http://localhost:9000/channels' \
--header 'accept: application/json' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJkb21haW4iOiIzNzFiMjM1MS0wMGQ3LTQ2OWUtYWY5YS02OTQzYWM1NzgwYTUiLCJleHAiOjE3MjQ3NjE5ODEsImlhdCI6MTcyNDc1ODM4MSwiaXNzIjoibWFnaXN0cmFsYS5hdXRoIiwic3ViIjoiNWJiMGE0ZDYtZTc0Mi00NDc3LWJmZmQtNThlYzQ4NjBiMDUxIiwidHlwZSI6MCwidXNlciI6IjViYjBhNGQ2LWU3NDItNDQ3Ny1iZmZkLTU4ZWM0ODYwYjA1MSJ9.F4aS-VkJjDDo6iKAYG0M9kcXus6P8tC-onsTIaUSyaTgTWrdAhgeGlNN1RWzciDhpJ-w4EFHWd8OtB6WWai5pg' \
--data '
{
  "name": "Assembly Line 1 Product Gap",
  "description": "This is a channel for quality control distance sensors",
  "metadata": {
    "unit": "mm",
    "sampling_interval": "100ms",
    "data_type": "float",
    "min_value": 0,
    "max_value": 1000,
    "precision": 0.1,
    "threshold_warning": 50,
    "threshold_critical": 25
  },
  "status": "enabled"
}'
```

- To connect the two, use the following command:

```bash
curl --location --request POST 'http://localhost:9000/channels/c4935742-1422-4636-9442-e7eeb7c8c681/things/3c04aa29-8992-4ee4-85a6-80a4004a60d7/connect' \
--header 'accept: */*' \
--header 'Authorization: Bearer eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJkb21haW4iOiIzNzFiMjM1MS0wMGQ3LTQ2OWUtYWY5YS02OTQzYWM1NzgwYTUiLCJleHAiOjE3MjQ3NjE5ODEsImlhdCI6MTcyNDc1ODM4MSwiaXNzIjoibWFnaXN0cmFsYS5hdXRoIiwic3ViIjoiNWJiMGE0ZDYtZTc0Mi00NDc3LWJmZmQtNThlYzQ4NjBiMDUxIiwidHlwZSI6MCwidXNlciI6IjViYjBhNGQ2LWU3NDItNDQ3Ny1iZmZkLTU4ZWM0ODYwYjA1MSJ9.F4aS-VkJjDDo6iKAYG0M9kcXus6P8tC-onsTIaUSyaTgTWrdAhgeGlNN1RWzciDhpJ-w4EFHWd8OtB6WWai5pg'
```

- To send a message over HTTP, you’ll need the Channel ID and Thing Secret. The endpoint URL will look like this: `https://localhost/http/channels/{channel_id}/messages`. Here’s how to do it:

```bash
curl --location 'http://localhost/http/channels/c4935742-1422-4636-9442-e7eeb7c8c681/messages' \
--header 'Content-Type: application/senml+json' \
--header 'Authorization: Thing 91f6e004-9f9e-4f95-9b72-a04befbdf584' \
--data '[{"bn": "DS-5000-AL1-001", "n": "Distance_AssemblyLine1", "u": "mm","v": 152.3}, { "n": "BatteryLevel", "u": "%", "v": 95}, { "n": "SignalStrength", "u": "dBm", "v": -65}]'
```

- To read the message, use a similar command:

```bash
curl --location 'http://localhost/http/channels/aecf0902-816d-4e38-a5b3-a1ad9a7cf9e8/messages' \
--header 'Authorization: Thing a83b9afb-9022-4f9e-ba3d-4354a08c273a'
```

The `--curl` flag in `magistrala-cli`, provides the equivalent `curl` request that the CLI would execute. This can be helpful for debugging or using the command outside of the CLI. For example, when you create a new user with the following command:

```bash
magistrala-cli users create john johndoe@example.com 12345678 --curl
```

You will receive the equivalent curl command:

```bash
2024/09/06 15:00:30 curl -X 'POST' -d '{"id":"","name":"john","credentials":{"identity":"johndoe@example.com","secret":"12345678"},"created_at":"0001-01-01T00:00:00Z","updated_at":"0001-01-01T00:00:00Z","status":"enabled"}' -H 'Content-Type: application/json' 'http://localhost:9002/users'
```

The output shows the HTTP request that the CLI would execute, allowing you to copy and paste it for manual execution with `curl`. For more information about using HTTP api, refer to the [documentation][swagger-docs] on swagger.

Note: While the CLI and API endpoints are powerful, they can be more tedious. Many of these tasks can be easily managed through the UI.

## Adapters

Magistrala provides various adapters for clients to publish and subscribe, including CoAP, HTTP, HTTPS, MQTT, MQTTS, WS, and WSS. Let's explore how to utilize some of these adapters.

### MQTT

MQTT is ideal for lightweight publish-subscribe messaging, perfect for resource-constrained devices. We'll use the Mosquitto MQTT client for this example.

#### Installing Mosquitto

- Visit the official [Mosquitto website][mosquitto-site] to download the package.

- Follow the following installation instructions if you are on Ubuntu:

```bash
sudo apt-add-repository ppa:mosquitto-dev/mosquitto-ppa
sudo apt-get update
sudo apt-get install mosquitto mosquitto-clients
```

- Verify the installation:

```bash
mosquitto_pub --help
```

#### Using MQTT with Magistrala

Once Mosquitto is installed, you can use it with Magistrala:

- Subscribe to a channel:

```bash
mosquitto_sub -i magistrala -u $THINGID -P $THINGSECRET -t channels/$CHANNELID/messages -h localhost -p 1883
```

This command subscribes to messages on a specific channel. Here's what each part means:
`-i magistrala`: Sets the id-prefix to "magistrala", `-u $THINGID`: Uses the Thing ID as the username, `-P $THINGSECRET`: Uses the Thing secret as the password, `-t channels/$CHANNELID/messages`: Specifies the topic to subscribe to, `-h localhost -p 1883`: Connects to the local MQTT broker on the default port

- Publish a message:

```bash
mosquitto_pub -i magistrala -u $THINGID -P $THINGSECRET -t channels/$CHANNELID/messages -h localhost -p 1883 -m '[{"bn": "DS-5000-AL1-001", "n": "Distance_AssemblyLine1", "u": "mm","v": 152.3}, { "n": "BatteryLevel", "u": "%", "v": 95}, { "n": "SignalStrength", "u": "dBm", "v": -65}]'
```

This command publishes a message to a specific channel. The parameters are similar to the subscribe command, with `-m` specifying the message content in SenML format.

### CoAP

CoAP is designed for Internet of Things (IoT) applications, offering efficient communication for low-power devices. We'll use the CoAP CLI tool for this example.

#### Installing CoAP CLI

- Visit the CoAP CLI GitHub [releases page][coap-repo]

- Download the appropriate version for your operating system.

- For Ubuntu, move the downloaded file to a directory in your PATH, for example:

```bash
sudo mv coap-cli-linux /usr/local/bin/coap-cli
```

- Make the file executable:

```bash
sudo chmod +x /usr/local/bin/coap-cli
```

- Verify the installation:

```bash
coap-cli --help
```

#### Using CoAP with Magistrala

Once the CoAP CLI is installed, you can use it with Magistrala:

- Subscribe to a channel:

```bash
coap-cli get channels/$CHANNELID/messages --auth $THINGSECRET -o
```

This command retrieves messages from a specific channel. Here's what each part means:
`get`: Specifies the GET method, `channels/$CHANNELID/messages`: Specifies the topic, `--auth $THINGSECRET`: Provides authentication using the Thing secret,
`-o`: Enables observing the resource for updates

- Publish a message:

```bash
coap-cli post channels/$CHANNELID/messages -auth $THINGSECRET -d '[{"bn": "DS-5000-AL1-001", "n": "Distance_AssemblyLine1", "u": "mm","v": 152.3}, { "n": "BatteryLevel", "u": "%", "v": 95}, { "n": "SignalStrength", "u": "dBm", "v": -65}]'
```

This command sends a message to a specific channel. The `-d` parameter specifies the message content.

### WebSocket

WebSocket enables real-time, bidirectional communication between clients and servers. We'll use the Websocat tool for this example.

#### Installing Websocat

- Visit the Websocat GitHub [releases page][websocat-repo]
- Download the appropriate version for your operating system.
- Move the downloaded file to a directory in your PATH, for example:

```bash
sudo mv websocat.x86_64-unknown-linux-musl /usr/local/bin/websocat
```

- Make the file executable:

```bash
sudo chmod +x /usr/local/bin/websocat
```

- Verify the installation:

```bash
websocat --help
```

#### Using WebSocket with Magistrala

Once Websocat is installed, you can use it with Magistrala:

```bash
websocat "ws://localhost:8186/channels/$CHANNELID/messages?authorization=$THINGSECRET" <<< '[{"bn": "DS-5000-AL1-001", "n": "Distance_AssemblyLine1", "u": "mm","v": 152.3}, { "n": "BatteryLevel", "u": "%", "v": 95}, { "n": "SignalStrength", "u": "dBm", "v": -65}]'
```

This command opens a WebSocket connection to a specific channel and sends a message. The URL includes the channel ID and Thing secret for authentication.

### HTTP/HTTPS

Here’s an example of how you can send a message using the HTTP adapter. To illustrate, you can use the following `curl` command:

```bash
curl -X POST -H "Content-Type: application/senml+json" -H "Authorization: Thing $THINGSECRET" -d '[{"bn": "DS-5000-AL1-001", "n": "Distance_AssemblyLine1", "u": "mm","v": 152.3}, { "n": "BatteryLevel", "u": "%", "v": 95}, { "n": "SignalStrength", "u": "dBm", "v": -65}]' http://localhost:8008/http/channels/$CHANNELID/messages
```

This command sends a POST request to the Magistrala HTTP adapter, publishing a temperature reading to a specific channel. The Thing secret is used for authentication.

## Summary

Magistrala stands out as a comprehensive, flexible, and powerful open source IIoT platform. Its multi-protocol support, robust security features, and scalable architecture make it an excellent choice for businesses looking to implement or upgrade their IIoT infrastructure. Whether you're managing a small network of sensors or a large-scale industrial automation system, Magistrala provides the tools and capabilities to streamline your IoT operations and drive innovation in your industry.

The platform's ease of use, from initial setup to ongoing management, combined with its versatile connectivity options, positions Magistrala as a top contender in the IIoT space. By offering support for MQTT, CoAP, WebSocket, and HTTP/HTTPS, Magistrala ensures that developers can choose the most appropriate protocol for their specific use case, whether it's real-time data streaming, efficient communication for battery-powered devices, or integration with web services.

As the IIoT landscape continues to evolve, Magistrala's open-source nature and extensible architecture provide a future-proof solution that can adapt to emerging technologies and changing business needs. By choosing Magistrala, organizations can build a solid foundation for their IIoT initiatives, enabling them to harness the full potential of connected devices and data-driven insights in their industrial operations.

## Contact Us

We're here to support you in your journey with Magistrala. Whether you have questions, need assistance, or want to contribute to the project, we encourage you to reach out through the following channels:

1. **GitHub Repository**:
   For bug reports, feature requests, or code contributions, please visit our [GitHub repository][magistrala-repo]

2. **Documentation**:
   For detailed guides and API references, check out our comprehensive [documentation][docs]

3. **Social Media**:
   Follow us for the latest updates, tips, and news:

   - Twitter: [Twitter handle][Twitter-handle]
   - LinkedIn: [LinkedIn page][LinkedIn-page]

4. **Professional Services**:
   For enterprise support, custom development, or consulting services, please contact:
   [@drasko][drasko] directly, and he will point you out to the best-matching support team.

We value your feedback and are committed to continually improving Magistrala to meet the evolving needs of the IIoT community. Don't hesitate to get in touch – we're excited to hear from you and support your IIoT initiatives!

## Keywords

IIoT, Open Source, IoT Platform, Industrial Automation, Remote Monitoring, MQTT, CoAP, WebSocket, Device Management, Scalability, Security, Docker, Go, Multi-Tenancy, Data Processing, Real-Time Analytics, Edge Computing, Sensor Networks, Industrial IoT, Connected Devices, IoT Middleware, Protocol Bridging, Cloud Platform, IoT Security, IoT Data Management, Customer Support, Community Engagement, Open Source Community, IIoT Support, Developer Resources

[architecture]: https://docs.magistrala.abstractmachines.fr/architecture/
[authorization]: https://docs.magistrala.abstractmachines.fr/authorization/#domain-viewer-with-channel-thing
[storage]: https://docs.magistrala.abstractmachines.fr/storage/#readers
[magistrala-repo]: https://github.com/absmach/magistrala
[mosquitto-site]: https://mosquitto.org/download/
[swagger-docs]: https://docs.api.magistrala.abstractmachines.fr/
[coap-repo]: https://github.com/absmach/coap-cli/releases/tag/v0.3.3
[websocat-repo]: https://github.com/vi/websocat?tab=readme-ov-file#installation
[drasko]: https://github.com/drasko
[docs]: https://docs.magistrala.abstractmachines.fr
[Twitter-handle]: https://x.com/absmach
[LinkedIn-page]: https://www.linkedin.com/company/abstract-machines/
