# Provision

Provisioning is a process of configuration of an IoT platform in which system operator creates and sets-up different entities used in the platform - users, groups, channels and things.

## Platform management

### Users Management

#### Account Creation

Use the Magistrala API to create user account:

```bash
curl -s -S -i --cacert docker/ssl/certs/ca.crt -X POST -H "Content-Type: application/json" https://localhost/users -d '{"name": "John Doe", "credentials": {"identity": "john.doe@email.com", "secret": "12345678"}, "status": "enabled"}'
```

Response should look like this:

```bash
HTTP/2 201
server: nginx/1.23.3
date: Tue, 04 Apr 2023 08:40:39 GMT
content-type: application/json
content-length: 229
location: /users/71db4bb0-591e-4f76-b766-b39ced9fc6b8
strict-transport-security: max-age=63072000; includeSubdomains
x-frame-options: DENY
x-content-type-options: nosniff
access-control-allow-origin: *
access-control-allow-methods: *
access-control-allow-headers: *

{
    "id": "71db4bb0-591e-4f76-b766-b39ced9fc6b8",
    "name": "John Doe",
    "credentials": { "identity": "john.doe@email.com" },
    "created_at": "2023-04-04T08:40:39.319602Z",
    "updated_at": "2023-04-04T08:40:39.319602Z",
    "status": "enabled"
}
```

Note that when using official `docker-compose`, all services are behind `nginx` proxy and all traffic is `TLS` encrypted.

#### Obtaining an Authorization Token

In order for this user to be able to authenticate to the system, you will have to create an authorization token for them:

```bash
curl -s -S -i --cacert docker/ssl/certs/ca.crt -X POST -H "Content-Type: application/json" https://localhost/users/tokens/issue -d '{"identity":"john.doe@email.com", "secret":"12345678"}'
```

Response should look like this:

```bash
HTTP/2 201
server: nginx/1.23.3
date: Tue, 04 Apr 2023 08:40:58 GMT
content-type: application/json
content-length: 709
strict-transport-security: max-age=63072000; includeSubdomains
x-frame-options: DENY
x-content-type-options: nosniff
access-control-allow-origin: *
access-control-allow-methods: *
access-control-allow-headers: *

{
    "access_token": "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2ODA2NTE2NTgsImlhdCI6MTY4MDU5NzY1OCwiaWRlbnRpdHkiOiJqb2huLmRvZUBlbWFpbC5jb20iLCJpc3MiOiJjbGllbnRzLmF1dGgiLCJzdWIiOiI3MWRiNGJiMC01OTFlLTRmNzYtYjc2Ni1iMzljZWQ5ZmM2YjgiLCJ0eXBlIjoiYWNjZXNzIn0.E4v79FvikIVs-eYOJAgepBX67G2Pzd9YnC-k3xkVrRQcAjHSdMx685jttr9-uuZtF1q3yIpvV-NdQJ2CG5eDtw",
    "refresh_token": "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2ODA2ODQwNTgsImlhdCI6MTY4MDU5NzY1OCwiaWRlbnRpdHkiOiJqb2huLmRvZUBlbWFpbC5jb20iLCJpc3MiOiJjbGllbnRzLmF1dGgiLCJzdWIiOiI3MWRiNGJiMC01OTFlLTRmNzYtYjc2Ni1iMzljZWQ5ZmM2YjgiLCJ0eXBlIjoicmVmcmVzaCJ9.K236Hz9nsm3dnvW6i7myu5xWcBaNFEMAIeekWkiS_X9y0sQ1LZwl997hkkj4IHFFrbn8KLfmkOfTOqVWgUREFg",
    "access_type": "Bearer"
}
```

For more information about the Users service API, please check out the [API documentation](https://api.mainflux.io/?urls.primaryName=users.yml).

### System Provisioning

Before proceeding, make sure that you have created a new account and obtained an authorization token. You can set your `access_token` in the `USER_TOKEN` environment variable:

```bash
USER_TOKEN=<access_token>
```

#### Provisioning Things

> This endpoint will be depreciated in 1.0.0. It will be replaced with the bulk endpoint currently found at /things/bulk.

Things are created by executing request `POST /things` with a JSON payload. Note that you will need `user_token` in order to create things that belong to this particular user.

```bash
curl -s -S -i --cacert docker/ssl/certs/ca.crt -X POST -H "Content-Type: application/json" -H "Authorization: Bearer $USER_TOKEN" https://localhost/things -d '{"name":"weio"}'
```

Response will contain `Location` header whose value represents path to newly created thing:

```bash
HTTP/2 201
server: nginx/1.23.3
date: Tue, 04 Apr 2023 09:06:50 GMT
content-type: application/json
content-length: 282
location: /things/9dd12d93-21c9-4147-92fe-769386efb6cc
access-control-expose-headers: Location

{
    "id": "9dd12d93-21c9-4147-92fe-769386efb6cc",
    "name": "weio",
    "owner": "71db4bb0-591e-4f76-b766-b39ced9fc6b8",
    "credentials": { "secret": "551e9869-d10f-4682-8319-5a4b18073313" },
    "created_at": "2023-04-04T09:06:50.460258649Z",
    "updated_at": "2023-04-04T09:06:50.460258649Z",
    "status": "enabled"
}
```

#### Bulk Provisioning Things

Multiple things can be created by executing a `POST /things/bulk` request with a JSON payload. The payload should contain a JSON array of the things to be created. If there is an error any of the things, none of the things will be created.

```bash
curl -s -S -i --cacert docker/ssl/certs/ca.crt -X POST -H "Content-Type: application/json" -H "Authorization: Bearer $USER_TOKEN" https://localhost/things/bulk -d '[{"name":"weio"},{"name":"bob"}]'
```

The response's body will contain a list of the created things.

```json
HTTP/2 200
server: nginx/1.23.3
date: Tue, 04 Apr 2023 08:42:04 GMT
content-type: application/json
content-length: 586
access-control-expose-headers: Location

{
    "total": 2,
    "things": [{
            "id": "1b1cd38f-62cd-4f17-b47e-5ff4e97881e8",
            "name": "weio",
            "owner": "71db4bb0-591e-4f76-b766-b39ced9fc6b8",
            "credentials": { "secret": "43bd950e-0b3f-46f6-a92c-296a6a0bfe66" },
            "created_at": "2023-04-04T08:42:04.168388927Z",
            "updated_at": "2023-04-04T08:42:04.168388927Z",
            "status": "enabled"
        },
        {
            "id": "b594af97-9550-4b11-86e1-2b6db7e329b9",
            "name": "bob",
            "owner": "71db4bb0-591e-4f76-b766-b39ced9fc6b8",
            "credentials": { "secret": "9f89f52e-1b06-4416-8294-ae753b0c4bea" },
            "created_at": "2023-04-04T08:42:04.168390109Z",
            "updated_at": "2023-04-04T08:42:04.168390109Z",
            "status": "enabled"
        }
    ]
}
```

#### Retrieving Provisioned Things

In order to retrieve data of provisioned things that are written in database, you can send following request:

```bash
curl -s -S -i --cacert docker/ssl/certs/ca.crt -H "Authorization: Bearer $USER_TOKEN" https://localhost/things
```

Notice that you will receive only those things that were provisioned by `user_token` owner.

```json
HTTP/2 200
server: nginx/1.23.3
date: Tue, 04 Apr 2023 08:42:27 GMT
content-type: application/json
content-length: 570
access-control-expose-headers: Location

{
    "limit": 10,
    "total": 2,
    "things": [{
            "id": "1b1cd38f-62cd-4f17-b47e-5ff4e97881e8",
            "name": "weio",
            "owner": "71db4bb0-591e-4f76-b766-b39ced9fc6b8",
            "credentials": { "secret": "43bd950e-0b3f-46f6-a92c-296a6a0bfe66" },
            "created_at": "2023-04-04T08:42:04.168388Z",
            "updated_at": "0001-01-01T00:00:00Z",
            "status": "enabled"
        },
        {
            "id": "b594af97-9550-4b11-86e1-2b6db7e329b9",
            "name": "bob",
            "owner": "71db4bb0-591e-4f76-b766-b39ced9fc6b8",
            "credentials": { "secret": "9f89f52e-1b06-4416-8294-ae753b0c4bea" },
            "created_at": "2023-04-04T08:42:04.16839Z",
            "updated_at": "0001-01-01T00:00:00Z",
            "status": "enabled"
        }
    ]
}
```

You can specify `offset` and `limit` parameters in order to fetch a specific subset of things. In that case, your request should look like:

```bash
curl -s -S -i --cacert docker/ssl/certs/ca.crt -H "Authorization: Bearer $USER_TOKEN" https://localhost/things?offset=0&limit=5
```

You can specify `name` and/or `metadata` parameters in order to fetch specific subset of things. When specifying metadata you can specify just a part of the metadata JSON you want to match.

```bash
curl -s -S -i --cacert docker/ssl/certs/ca.crt -H "Authorization: Bearer $USER_TOKEN" https://localhost/things?offset=0&limit=5&name="weio"
```

```bash
HTTP/2 200
server: nginx/1.23.3
date: Tue, 04 Apr 2023 08:43:09 GMT
content-type: application/json
content-length: 302
access-control-expose-headers: Location

{
    "limit": 5,
    "total": 1,
    "things": [{
        "id": "1b1cd38f-62cd-4f17-b47e-5ff4e97881e8",
        "name": "weio",
        "owner": "71db4bb0-591e-4f76-b766-b39ced9fc6b8",
        "credentials": { "secret": "43bd950e-0b3f-46f6-a92c-296a6a0bfe66" },
        "created_at": "2023-04-04T08:42:04.168388Z",
        "updated_at": "0001-01-01T00:00:00Z",
        "status": "enabled"
    }]
}
```

If you don't provide them, default values will be used instead: 0 for `offset` and 10 for `limit`. Note that `limit` cannot be set to values greater than 100. Providing invalid values will be considered malformed request.

#### Disable Things

This is a special endpoint that allows you to disable a thing, soft deleting it from the database. In order to disable you own thing you can send following request:

```bash
curl -s -S -i --cacert docker/ssl/certs/ca.crt -X POST -H "Authorization: Bearer $USER_TOKEN" https://localhost/things/1b1cd38f-62cd-4f17-b47e-5ff4e97881e8/disable
```

```bash
HTTP/2 200
server: nginx/1.23.3
date: Tue, 04 Apr 2023 09:00:40 GMT
content-type: application/json
content-length: 277
access-control-expose-headers: Location

{
    "id": "1b1cd38f-62cd-4f17-b47e-5ff4e97881e8",
    "name": "weio",
    "owner": "71db4bb0-591e-4f76-b766-b39ced9fc6b8",
    "credentials": { "secret": "43bd950e-0b3f-46f6-a92c-296a6a0bfe66" },
    "created_at": "2023-04-04T08:42:04.168388Z",
    "updated_at": "2023-04-04T08:42:04.168388Z",
    "status": "disabled"
}
```

#### Provisioning Channels

> This endpoint will be depreciated in 1.0.0. It will be replaced with the bulk endpoint currently found at /channels/bulk.

Channels are created by executing request `POST /channels`:

```bash
curl -s -S -i --cacert docker/ssl/certs/ca.crt -X POST -H "Content-Type: application/json" -H "Authorization: Bearer $USER_TOKEN" https://localhost/channels -d '{"name":"mychan"}'
```

After sending request you should receive response with `Location` header that contains path to newly created channel:

```bash
HTTP/2 201
server: nginx/1.23.3
date: Tue, 04 Apr 2023 09:18:10 GMT
content-type: application/json
content-length: 235
location: /channels/0a67a8ee-eda9-408e-af83-f895096b7359
access-control-expose-headers: Location

{
    "id": "0a67a8ee-eda9-408e-af83-f895096b7359",
    "owner_id": "71db4bb0-591e-4f76-b766-b39ced9fc6b8",
    "name": "mychan",
    "created_at": "2023-04-04T09:18:10.26603Z",
    "updated_at": "2023-04-04T09:18:10.26603Z",
    "status": "enabled"
}
```

#### Bulk Provisioning Channels

Multiple channels can be created by executing a `POST /things/bulk` request with a JSON payload. The payload should contain a JSON array of the channels to be created. If there is an error any of the channels, none of the channels will be created.

```bash
curl -s -S -i --cacert docker/ssl/certs/ca.crt -X POST -H "Content-Type: application/json" -H "Authorization: Bearer $USER_TOKEN" https://localhost/channels/bulk -d '[{"name":"joe"},{"name":"betty"}]'
```

The response's body will contain a list of the created channels.

```json
HTTP/2 200
server: nginx/1.23.3
date: Tue, 04 Apr 2023 09:11:16 GMT
content-type: application/json
content-length: 487
access-control-expose-headers: Location

{
    "channels": [{
            "id": "5ec1beb9-1b76-47e6-a9ef-baf9e4ae5820",
            "owner_id": "71db4bb0-591e-4f76-b766-b39ced9fc6b8",
            "name": "joe",
            "created_at": "2023-04-04T09:11:16.131972Z",
            "updated_at": "2023-04-04T09:11:16.131972Z",
            "status": "disabled"
        },
        {
            "id": "ff1316f1-d3c6-4590-8bf3-33774d79eab2",
            "owner_id": "71db4bb0-591e-4f76-b766-b39ced9fc6b8",
            "name": "betty",
            "created_at": "2023-04-04T09:11:16.138881Z",
            "updated_at": "2023-04-04T09:11:16.138881Z",
            "status": "disabled"
        }
    ]
}
```

#### Retrieving Provisioned Channels

In order to retrieve data of provisioned channels that are written in database, you can send following request:

```bash
curl -s -S -i --cacert docker/ssl/certs/ca.crt -H "Authorization: Bearer $USER_TOKEN" https://localhost/channels
```

Notice that you will receive only those things that were provisioned by `user_token` owner.

```json
HTTP/2 200
server: nginx/1.23.3
date: Tue, 04 Apr 2023 09:13:48 GMT
content-type: application/json
content-length: 495
access-control-expose-headers: Location

{
    "total": 2,
    "channels": [{
            "id": "5ec1beb9-1b76-47e6-a9ef-baf9e4ae5820",
            "owner_id": "71db4bb0-591e-4f76-b766-b39ced9fc6b8",
            "name": "joe",
            "created_at": "2023-04-04T09:11:16.131972Z",
            "updated_at": "2023-04-04T09:11:16.131972Z",
            "status": "enabled"
        },
        {
            "id": "ff1316f1-d3c6-4590-8bf3-33774d79eab2",
            "owner_id": "71db4bb0-591e-4f76-b766-b39ced9fc6b8",
            "name": "betty",
            "created_at": "2023-04-04T09:11:16.138881Z",
            "updated_at": "2023-04-04T09:11:16.138881Z",
            "status": "enabled"
        }
    ]
}
```

You can specify `offset` and `limit` parameters in order to fetch specific subset of channels. In that case, your request should look like:

```bash
curl -s -S -i --cacert docker/ssl/certs/ca.crt -H "Authorization: Bearer $USER_TOKEN" https://localhost/channels?offset=0&limit=5
```

If you don't provide them, default values will be used instead: 0 for `offset` and 10 for `limit`. Note that `limit` cannot be set to values greater than 100. Providing invalid values will be considered malformed request.

#### Disabling Channels

This is a special endpoint that allows you to disable a channel, soft deleting it from the database. In order to disable you own channel you can send following request:

```bash
curl -s -S -i --cacert docker/ssl/certs/ca.crt -X POST -H "Authorization: Bearer $USER_TOKEN" https://localhost/channels/5ec1beb9-1b76-47e6-a9ef-baf9e4ae5820/disable
```

```bash
HTTP/2 200
server: nginx/1.23.3
date: Tue, 04 Apr 2023 09:16:31 GMT
content-type: application/json
content-length: 235
access-control-expose-headers: Location

{
    "id": "5ec1beb9-1b76-47e6-a9ef-baf9e4ae5820",
    "owner_id": "71db4bb0-591e-4f76-b766-b39ced9fc6b8",
    "name": "joe",
    "created_at": "2023-04-04T09:11:16.131972Z",
    "updated_at": "2023-04-04T09:11:16.131972Z",
    "status": "disabled"
}
```

### Access Control

Channel can be observed as a communication group of things. Only things that are connected to the channel can send and receive messages from other things in this channel. Things that are not connected to this channel are not allowed to communicate over it. Users may also be assigned to channels, thus sharing things between users. With the necessary policies in place, users can be granted access to things that are not owned by them.

A user who is the owner of a channel or a user that has been assigned to the channel with the required policy can connect things to the channel. This is equivalent of giving permissions to these things to communicate over given communication group.

To connect a thing to the channel you should send following request:

> This endpoint will be depreciated in 1.0.0. It will be replaced with the bulk endpoint found at /connect.

```bash
curl -s -S -i --cacert docker/ssl/certs/ca.crt -X PUT -H "Authorization: Bearer $USER_TOKEN" https://localhost/channels/<channel_id>/things/<thing_id>
```

```bash
HTTP/2 201
server: nginx/1.23.3
date: Tue, 04 Apr 2023 09:20:23 GMT
content-type: application/json
content-length: 266
access-control-expose-headers: Location

{
    "owner_id": "71db4bb0-591e-4f76-b766-b39ced9fc6b8",
    "subject": "b594af97-9550-4b11-86e1-2b6db7e329b9",
    "object": "ff1316f1-d3c6-4590-8bf3-33774d79eab2",
    "actions": ["m_write", "m_read"],
    "created_at": "2023-04-04T09:20:23.015342Z",
    "updated_at": "2023-04-04T09:20:23.015342Z"
}
```

To connect multiple things to a channel, you can send the following request:

```bash
curl -s -S -i --cacert docker/ssl/certs/ca.crt -X POST -H "Content-Type: application/json" -H "Authorization: Bearer $USER_TOKEN" https://localhost/connect -d '{"channel_ids":["<channel_id>", "<channel_id>"],"thing_ids":["<thing_id>", "<thing_id>"]}'
```

You can observe which things are connected to specific channel:

```bash
curl -s -S -i --cacert docker/ssl/certs/ca.crt -H "Authorization: Bearer $USER_TOKEN" https://localhost/channels/<channel_id>/things
```

Response that you'll get should look like this:

```json
HTTP/2 200
server: nginx/1.23.3
date: Tue, 04 Apr 2023 09:53:21 GMT
content-type: application/json
content-length: 254
access-control-expose-headers: Location

{
    "limit": 10,
    "total": 1,
    "things": [{
        "id": "b594af97-9550-4b11-86e1-2b6db7e329b9",
        "name": "bob",
        "credentials": { "secret": "9f89f52e-1b06-4416-8294-ae753b0c4bea" },
        "created_at": "2023-04-04T08:42:04.16839Z",
        "updated_at": "0001-01-01T00:00:00Z",
        "status": "enabled"
    }]
}
```

You can observe to which channels is specified thing connected:

```bash
curl -s -S -i --cacert docker/ssl/certs/ca.crt -H "Authorization: Bearer $USER_TOKEN" https://localhost/things/<thing_id>/channels
```

Response that you'll get should look like this:

```bash
HTTP/2 200
server: nginx/1.23.3
date: Tue, 04 Apr 2023 09:57:10 GMT
content-type: application/json
content-length: 261
access-control-expose-headers: Location

{
    "total": 1,
    "channels": [{
        "id": "ff1316f1-d3c6-4590-8bf3-33774d79eab2",
        "owner_id": "71db4bb0-591e-4f76-b766-b39ced9fc6b8",
        "name": "betty",
        "created_at": "2023-04-04T09:11:16.138881Z",
        "updated_at": "2023-04-04T09:11:16.138881Z",
        "status": "enabled"
    }]
}
```

If you want to disconnect your thing from the channel, send following request:

> This endpoint will be depreciated in 1.0.0. It will be replaced with the bulk endpoint found at /disconnect.

```bash
curl -s -S -i --cacert docker/ssl/certs/ca.crt -X DELETE -H "Authorization: Bearer $USER_TOKEN" https://localhost/channels/<channel_id>/things/<thing_id>
```

Response that you'll get should look like this:

```bash
HTTP/2 204
server: nginx/1.23.3
date: Tue, 04 Apr 2023 09:57:53 GMT
access-control-expose-headers: Location
```

For more information about the Things service API, please check out the [API documentation](https://api.mainflux.io/?urls.primaryName=things.yml).

## Provision Service

Provisioning is a process of configuration of an IoT platform in which system operator creates and sets-up different entities used in the platform - users, channels and things. It is part of process of setting up IoT applications where we connect devices on edge with platform in cloud. For provisioning we can use [Magistrala CLI][cli] for creating users and for each node in the edge (eg. gateway) required number of things, channels, connecting them and creating certificates if needed. Provision service is used to set up initial application configuration once user is created. Provision service creates things, channels, connections and certificates. Once user is created we can use provision to create a setup for edge node in one HTTP request instead of issuing several CLI commands.

Provision service provides an HTTP API to interact with [Magistrala][provision-api].

For gateways to communicate with [Magistrala][magistrala] configuration is required (MQTT host, thing, channels, certificates...). Gateway will send a request to [Bootstrap][bootstrap] service providing `<external_id>` and `<external_key>` in HTTP request to get the configuration. To make a request to [Bootstrap][bootstrap] service you can use [Agent][agent] service on a gateway.

To create bootstrap configuration you can use [Bootstrap][bootstrap] or `Provision` service. [Magistrala UI][mfxui] uses [Bootstrap][bootstrap] service for creating gateway configurations. `Provision` service should provide an easy way of provisioning your gateways i.e creating bootstrap configuration and as many things and channels that your setup requires.

Also, you may use provision service to create certificates for each thing. Each service running on gateway may require more than one thing and channel for communication.
If, for example, you are using services [Agent][agent] and [Export][exp] on a gateway you will need two channels for `Agent` (`data` and `control`) and one thing for `Export`.
Additionally, if you enabled mTLS each service will need its own thing and certificate for access to [Magistrala][magistrala].
Your setup could require any number of things and channels, this kind of setup we can call `provision layout`.

Provision service provides a way of specifying this `provision layout` and creating a setup according to that layout by serving requests on `/mapping` endpoint. Provision layout is configured in [config.toml][conftoml].

### Configuration

The service is configured using the environment variables presented in the following [table][config]. Note that any unset variables will be replaced with their default values.

By default, call to `/mapping` endpoint will create one thing and two channels (`control` and `data`) and connect it as this is typical setup required by [Agent](/edge/#agent). If there is a requirement for different provision layout we can use [config][conftoml] file in addition to environment variables.

For the purposes of running provision as an add-on in docker composition environment variables seems more suitable. Environment variables are set in [.env][env].

Configuration can be specified in [config.toml][conftoml]. Config file can specify all the settings that environment variables can configure and in addition `/mapping` endpoint provision layout can be configured.

In `config.toml` we can enlist an array of things and channels that we want to create and make connections between them which we call provision layout.

Things Metadata can be whatever suits your needs. Thing that has metadata with `external_id` will have bootstrap configuration created, `external_id` value will be populated with value from [request](#example)).
Bootstrap configuration can be fetched with [Agent][agent]. For channel's metadata `type` is reserved for `control` and `data` which we use with [Agent][agent].

Example of provision layout below

```toml
[bootstrap]
  [bootstrap.content]
    [bootstrap.content.agent.edgex]
      url = "http://localhost:48090/api/v1/"

    [bootstrap.content.agent.log]
      level = "info"

    [bootstrap.content.agent.mqtt]
      mtls = false
      qos = 0
      retain = false
      skip_tls_ver = true
      url = "localhost:1883"

    [bootstrap.content.agent.server]
      nats_url = "localhost:4222"
      port = "9000"

    [bootstrap.content.agent.heartbeat]
      interval = "30s"

    [bootstrap.content.agent.terminal]
      session_timeout = "30s"

    [bootstrap.content.export.exp]
      log_level = "debug"
      nats = "nats://localhost:4222"
      port = "8172"
      cache_url = "localhost:6379"
      cache_pass = ""
      cache_db = "0"

    [bootstrap.content.export.mqtt]
      ca_path = "ca.crt"
      cert_path = "thing.crt"
      channel = ""
      host = "tcp://localhost:1883"
      mtls = false
      password = ""
      priv_key_path = "thing.key"
      qos = 0
      retain = false
      skip_tls_ver = false
      username = ""

    [[bootstrap.content.export.routes]]
      mqtt_topic = ""
      nats_topic = "channels"
      subtopic = ""
      type = "mfx"
      workers = 10

    [[bootstrap.content.export.routes]]
      mqtt_topic = ""
      nats_topic = "export"
      subtopic = ""
      type = "default"
      workers = 10

[[things]]
  name = "thing"

  [things.metadata]
    external_id = "xxxxxx"

[[channels]]
  name = "control-channel"

  [channels.metadata]
    type = "control"

[[channels]]
  name = "data-channel"

  [channels.metadata]
    type = "data"

[[channels]]
  name = "export-channel"

  [channels.metadata]
    type = "export"
```

`[bootstrap.content]` will be marshalled and saved into `content` field in bootstrap configs when request to `/mappings` is made, `content` field from bootstrap config is used to create `Agent` and `Export` configuration files upon `Agent` fetching bootstrap configuration.

### Authentication

In order to create necessary entities provision service needs to authenticate against Magistrala.
To provide authentication credentials to the provision service you can pass it in as an environment variable or in a config file as Magistrala user and password or as API token (that can be issued on `/users/tokens/issue` endpoint of [users service][users].

Additionally, users or API token can be passed in Authorization header, this authentication takes precedence over others.

- `username`, `password` - (`MF_PROVISION_USER`, `MF_PROVISION_PASSWORD` in [.env][env], `mf_user`, `mf_pass` in [config.toml][conftoml]
- API Key - (`MF_PROVISION_API_KEY` in [.env][env] or [config.toml][conftoml]
- `Authorization: Bearer Token|ApiKey` - request authorization header containing users token. Check [auth][auth].

### Running

Provision service can be run as a standalone or in docker composition as addon to the core docker composition.

Standalone:

```bash
MF_PROVISION_BS_SVC_URL=http://localhost:9013/things \
MF_PROVISION_THINGS_LOCATION=http://localhost:9000 \
MF_PROVISION_USERS_LOCATION=http://localhost:9002 \
MF_PROVISION_CONFIG_FILE=docker/addons/provision/configs/config.toml \
build/magistrala-provision
```

Docker composition:

```bash
docker-compose -f docker/addons/provision/docker-compose.yml up
```

### Provision

For the case that credentials or API token is passed in configuration file or environment variables, call to `/mapping` endpoint doesn't require `Authentication` header:

```bash
curl -s -S  -X POST  http://localhost:9016/mapping  -H 'Content-Type: application/json' -d '{"external_id": "33:52:77:99:43", "external_key": "223334fw2"}'
```

In the case that provision service is not deployed with credentials or API key or you want to use user other than one being set in environment (or config file):

```bash
curl -s -S  -X POST  http://localhost:9016/mapping -H "Authorization: Bearer <token|api_key>" -H 'Content-Type: application/json' -d '{"external_id": "<external_id>", "external_key": "<external_key>"}'
```

Or if you want to specify a name for thing different than in `config.toml` you can specify post data as:

```json
{
  "name": "<name>",
  "external_id": "<external_id>",
  "external_key": "<external_key>"
}
```

Response contains created things, channels and certificates if any:

```json
{
  "things": [
    {
      "id": "c22b0c0f-8c03-40da-a06b-37ed3a72c8d1",
      "name": "thing",
      "key": "007cce56-e0eb-40d6-b2b9-ed348a97d1eb",
      "metadata": {
        "external_id": "33:52:79:C3:43"
      }
    }
  ],
  "channels": [
    {
      "id": "064c680e-181b-4b58-975e-6983313a5170",
      "name": "control-channel",
      "metadata": {
        "type": "control"
      }
    },
    {
      "id": "579da92d-6078-4801-a18a-dd1cfa2aa44f",
      "name": "data-channel",
      "metadata": {
        "type": "data"
      }
    }
  ],
  "whitelisted": {
    "c22b0c0f-8c03-40da-a06b-37ed3a72c8d1": true
  }
}
```

### Example

Deploy Magistrala UI docker composition as it contains all the required services for provisioning to work ( `certs`, `bootstrap` and Magistrala core)

```bash
git clone https://github.com/absmach/magistrala-ui
cd magistrala-ui
docker-compose -f docker/docker-compose.yml up
```

Create user and obtain access token

```bash
magistrala-cli -m https://mainflux.com users create john.doe@email.com 12345678

# Retrieve token
magistrala-cli -m https://mainflux.com users token john.doe@email.com 12345678

created: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE1OTY1ODU3MDUsImlhdCI6MTU5NjU0OTcwNSwiaXNzIjoibWFpbmZsdXguYXV0aG4iLCJzdWIiOiJtaXJrYXNoQGdtYWlsLmNvbSIsInR5cGUiOjB9._vq0zJzFc9tQqc8x74kpn7dXYefUtG9IB0Cb-X2KMK8
```

Put a value of token into environment variable

```bash
TOKEN=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE1OTY1ODU3MDUsImlhdCI6MTU5NjU0OTcwNSwiaXNzIjoibWFpbmZsdXguYXV0aG4iLCJzdWIiOiJtaXJrYXNoQGdtYWlsLmNvbSIsInR5cGUiOjB9._vq0zJzFc9tQqc8x74kpn7dXYefUtG9IB0Cb-X2KMK8
```

Make a call to provision endpoint

```bash
curl -s -S  -X POST  http://magistrala.com:9016/mapping -H "Authorization: Bearer $TOKEN" -H 'Content-Type: application/json'   -d '{"name":"edge-gw",  "external_id" : "gateway", "external_key":"external_key" }'
```

To check the results you can make a call to bootstrap endpoint

```bash
curl -s -S -X GET http://magistrala.com:9013/things/bootstrap/gateway -H "Authorization: Thing external_key" -H 'Content-Type: application/json'
```

Or you can start `Agent` with:

```bash
git clone https://github.com/absmach/agent.git
cd agent
make
MF_AGENT_BOOTSTRAP_ID=gateway MF_AGENT_BOOTSTRAP_KEY=external_key MF_AGENT_BOOTSTRAP_URL=http://magistrala.ccom:9013/things/bootstrap build/magistrala-agent
```

Agent will retrieve connections parameters and connect to Magistrala cloud.

For more information about the Provision service API, please check out the [API documentation](https://github.com/absmach/magistrala/blob/master/api/provision.yml).

[magistrala]: https://github.com/absmach/magistrala
[bootstrap]: https://github.com/absmach/magistrala/tree/main/bootstrap
[agent]: https://github.com/absmach/agent
[mgui]: https://github.com/absmach/magistrala-ui
[config]: https://github.com/absmach/magistrala/tree/main/provision#configuration
[env]: https://github.com/absmach/magistrala/blob/master/.env
[conftoml]: https://github.com/absmach/magistrala/blob/master/docker/addons/provision/configs/config.toml
[users]: https://github.com/absmach/magistrala/blob/master/users/README.md
[exp]: https://github.com/absmach/export
[cli]: https://github.com/absmach/magistrala/tree/main/cli
[auth]: authentication.md
[provision-api]: https://api.mainflux.io/?urls.primaryName=provision.yml
