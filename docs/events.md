# Events

In order to be easily integratable system, Mainflux is using [Redis Streams][redis-streams] as an event log for event sourcing. Services that are publishing events to Redis Streams are `things` service, `bootstrap` service and `mqtt` adapter.

## Things Service

For every operation that has side effects (that is changing service state) `things` service will generate new event and publish it to Redis Stream called `mainflux.things`. Every event has its own event ID that is automatically generated and `operation` field that can have one of the following values:

- `thing.create` for thing creation,
- `thing.update` for thing update,
- `thing.remove` for thing removal,
- `thing.connect` for connecting a thing to a channel,
- `thing.disconnect` for disconnecting thing from a channel,
- `channel.create` for channel creation,
- `channel.update` for channel update,
- `channel.remove` for channel removal.

By fetching and processing these events you can reconstruct `things` service state. If you store some of your custom data in `metadata` field, this is the perfect way to fetch it and process it. If you want to integrate through [docker-compose.yml][mf-docker-compose] you can use `mainflux-es-redis` service. Just connect to it and consume events from Redis Stream named `mainflux.things`.

### Thing create event

Whenever thing is created, `things` service will generate new `create` event. This event will have the following format:

```redis
1) "1555334740911-0"
2)  1) "operation"
    2) "thing.create"
    3) "name"
    4) "d0"
    5) "id"
    6) "3c36273a-94ea-4802-84d6-a51de140112e"
    7) "owner"
    8) "john.doe@email.com"
    9) "metadata"
   10) "{}"
```

As you can see from this example, every odd field represents field name while every even field represents field value. This is standard event format for Redis Streams. If you want to extract `metadata` field from this event, you'll have to read it as string first and then you can deserialize it to some structured format.

### Thing update event

Whenever thing instance is updated, `things` service will generate new `update` event. This event will have the following format:

```redis
1) "1555336161544-0"
2) 1) "operation"
   2) "thing.update"
   3) "name"
   4) "weio"
   5) "id"
   6) "3c36273a-94ea-4802-84d6-a51de140112e"
```

Note that thing update event will contain only those fields that were updated using update endpoint.

### Thing remove event

Whenever thing instance is removed from the system, `things` service will generate and publish new `remove` event. This event will have the following format:

```redis
1) 1) "1555339313003-0"
2) 1) "id"
   2) "3c36273a-94ea-4802-84d6-a51de140112e"
   3) "operation"
   4) "thing.remove"
```

### Channel create event

Whenever channel instance is created, `things` service will generate and publish new `create` event. This event will have the following format:

```redis
1) "1555334740918-0"
2) 1) "id"
   2) "16fb2748-8d3b-4783-b272-bb5f4ad4d661"
   3) "owner"
   4) "john.doe@email.com"
   5) "operation"
   6) "channel.create"
   7) "name"
   8) "c1"
```

### Channel update event

Whenever channel instance is updated, `things` service will generate and publish new `update` event. This event will have the following format:

```redis
1) "1555338870341-0"
2) 1) "name"
   2) "chan"
   3) "id"
   4) "d9d8f31b-f8d4-49c5-b943-6db10d8e2949"
   5) "operation"
   6) "channel.update"
```

Note that update channel event will contain only those fields that were updated using update channel endpoint.

### Channel remove event

Whenever channel instance is removed from the system, `things` service will generate and publish new `remove` event. This event will have the following format:

```redis
1) 1) "1555339429661-0"
2) 1) "id"
   2) "d9d8f31b-f8d4-49c5-b943-6db10d8e2949"
   3) "operation"
   4) "channel.remove"
```

### Connect thing to a channel event

Whenever thing is connected to a channel on `things` service, `things` service will generate and publish new `connect` event. This event will have the following format:

```redis
1) "1555334740920-0"
2) 1) "chan_id"
   2) "d9d8f31b-f8d4-49c5-b943-6db10d8e2949"
   3) "thing_id"
   4) "3c36273a-94ea-4802-84d6-a51de140112e"
   5) "operation"
   6) "thing.connect"
```

### Disconnect thing from a channel event

Whenever thing is disconnected from a channel on `things` service, `things` service will generate and publish new `disconnect` event. This event will have the following format:

```redis
1) "1555334740920-0"
2) 1) "chan_id"
   2) "d9d8f31b-f8d4-49c5-b943-6db10d8e2949"
   3) "thing_id"
   4) "3c36273a-94ea-4802-84d6-a51de140112e"
   5) "operation"
   6) "thing.disconnect"
```

> **Note:** Every one of these events will omit fields that were not used or are not
> relevant for specific operation. Also, field ordering is not guaranteed, so DO NOT
> rely on it.

## Bootstrap Service

Bootstrap service publishes events to Redis Stream called `mainflux.bootstrap`. Every event from this service contains `operation` field which indicates one of the following event types:

- `config.create` for configuration creation,
- `config.update` for configuration update,
- `config.remove` for configuration removal,
- `thing.bootstrap` for device bootstrap,
- `thing.state_change` for device state change,
- `thing.update_connections` for device connection update.

If you want to integrate through [docker-compose.yml][bootstrap-docker-compose] you can use `mainflux-es-redis` service. Just connect to it and consume events from Redis Stream named `mainflux.bootstrap`.

### Configuration create event

Whenever configuration is created, `bootstrap` service will generate and publish new `create` event. This event will have the following format:

```redis
1) "1555404899581-0"
2)  1) "owner"
    2) "john.doe@email.com"
    3) "name"
    4) "some"
    5) "channels"
    6) "ff13ca9c-7322-4c28-a25c-4fe5c7b753fc, c3642289-501d-4974-82f2-ecccc71b2d82, c3642289-501d-4974-82f2-ecccc71b2d83, cd4ce940-9173-43e3-86f7-f788e055eb14"
    7) "externalID"
    8) "9c:b6:d:eb:9f:fd"
    9) "content"
   10) "{}"
   11) "timestamp"
   12) "1555404899"
   13) "operation"
   14) "config.create"
   15) "thing_id"
   16) "63a110d4-2b77-48d2-aa46-2582681eeb82"
```

### Configuration update event

Whenever configuration is updated, `bootstrap` service will generate and publish new `update` event. This event will have the following format:

```redis
1) "1555405104368-0"
2)  1) "content"
    2) "NOV_MGT_HOST: http://127.0.0.1:7000\nDOCKER_MGT_HOST: http://127.0.0.1:2375\nAGENT_MGT_HOST: https://127.0.0.1:7003\nMF_MQTT_HOST: tcp://104.248.142.133:8443"
    3) "timestamp"
    4) "1555405104"
    5) "operation"
    6) "config.update"
    7) "thing_id"
    8) "63a110d4-2b77-48d2-aa46-2582681eeb82"
    9) "name"
   10) "weio"
```

### Configuration remove event

Whenever configuration is removed, `bootstrap` service will generate and publish new `remove` event. This event will have the following format:

```redis
1) "1555405464328-0"
2) 1) "thing_id"
   2) "63a110d4-2b77-48d2-aa46-2582681eeb82"
   3) "timestamp"
   4) "1555405464"
   5) "operation"
   6) "config.remove"
```

### Thing bootstrap event

Whenever thing is bootstrapped, `bootstrap` service will generate and publish new `bootstrap` event. This event will have the following format:

```redis
1) "1555405173785-0"
2) 1) "externalID"
   2) "9c:b6:d:eb:9f:fd"
   3) "success"
   4) "1"
   5) "timestamp"
   6) "1555405173"
   7) "operation"
   8) "thing.bootstrap"
```

### Thing change state event

Whenever thing's state changes, `bootstrap` service will generate and publish new `change state` event. This event will have the following format:

```redis
1) "1555405294806-0"
2) 1) "thing_id"
   2) "63a110d4-2b77-48d2-aa46-2582681eeb82"
   3) "state"
   4) "0"
   5) "timestamp"
   6) "1555405294"
   7) "operation"
   8) "thing.state_change"
```

### Thing update connections event

Whenever thing's list of connections is updated, `bootstrap` service will generate and publish new `update connections` event. This event will have the following format:

```redis
1) "1555405373360-0"
2) 1) "operation"
   2) "thing.update_connections"
   3) "thing_id"
   4) "63a110d4-2b77-48d2-aa46-2582681eeb82"
   5) "channels"
   6) "ff13ca9c-7322-4c28-a25c-4fe5c7b753fc, 925461e6-edfb-4755-9242-8a57199b90a5, c3642289-501d-4974-82f2-ecccc71b2d82"
   7) "timestamp"
   8) "1555405373"
```

## MQTT Adapter

Instead of using heartbeat to know when client is connected through MQTT adapter one can fetch events from Redis Streams that MQTT adapter publishes. MQTT adapter publishes events every time client connects and disconnects to stream named `mainflux.mqtt`.

Events that are coming from MQTT adapter have following fields:

- `thing_id` ID of a thing that has connected to MQTT adapter,
- `timestamp` is in Epoch UNIX Time Stamp format,
- `event_type` can have two possible values, connect and disconnect,
- `instance` represents MQTT adapter instance.

If you want to integrate through [docker-compose.yml][mf-docker-compose] you can use `mainflux-es-redis` service. Just connect to it and consume events from Redis Stream named `mainflux.mqtt`.

Example of connect event:

```redis
1) 1) "1555351214144-0"
2) 1) "thing_id"
   1) "1c597a85-b68e-42ff-8ed8-a3a761884bc4"
   2) "timestamp"
   3) "1555351214"
   4) "event_type"
   5) "connect"
   6) "instance"
   7) "mqtt-adapter-1"
```

Example of disconnect event:

```redis
1) 1) "1555351214188-0"
2) 1) "thing_id"
   2) "1c597a85-b68e-42ff-8ed8-a3a761884bc4"
   3) "timestamp"
   4) "1555351214"
   5) "event_type"
   6) "disconnect"
   7) "instance"
   8) "mqtt-adapter-1"
```

[redis-streams]: https://redis.io/topics/streams-intro
[mf-docker-compose]: https://github.com/mainflux/mainflux/blob/master/docker/docker-compose.yml
[bootstrap-docker-compose]: https://github.com/mainflux/mainflux/blob/master/docker/addons/bootstrap/docker-compose.yml
