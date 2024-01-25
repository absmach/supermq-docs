# Events

In order to be easily integratable system, Magistrala is using [Redis Streams][redis-streams] as an event log for event sourcing. Services that are publishing events to Redis Streams are `users` service, `things` service, `bootstrap` service and `mqtt` adapter.

## Users Service

For every operation `users` service will generate new event and publish it to Redis Stream called `mainflux.users`. Every event has its own event ID that is automatically generated and `operation` field that can have one of the following values:

- `user.create` for user creation
- `user.update` for user update
- `user.remove` for user change of state
- `user.view` for user view
- `user.view_profile` for user profile view
- `user.list` for listing users
- `user.list_by_group` for listing users by group
- `user.identify` for user identification
- `user.generate_reset_token` for generating reset token
- `user.issue_token` for issuing token
- `user.refresh_token` for refreshing token
- `user.reset_secret` for resetting secret
- `user.send_password_reset` for sending password reset
- `group.create` for group creation
- `group.update` for group update
- `group.remove` for group change of state
- `group.view` for group view
- `group.list` for listing groups
- `group.list_by_user` for listing groups by user
- `policy.authorize` for policy authorization
- `policy.add` for policy creation
- `policy.update` for policy update
- `policy.remove` for policy deletion
- `policy.list` for listing policies

By fetching and processing these events you can reconstruct `users` service state. If you store some of your custom data in `metadata` field, this is the perfect way to fetch it and process it. If you want to integrate through [docker-compose.yml][mf-docker-compose] you can use `mainflux-es-redis` service. Just connect to it and consume events from Redis Stream named `mainflux.users`.

### User create event

Whenever user is created, `users` service will generate new `create` event. This event will have the following format:

```redis
1) "1693307171926-0"
2)  1) "occurred_at"
    2) "1693307171925834295"
    3) "operation"
    4) "user.create"
    5) "id"
    6) "e1b982d8-a332-4bc2-aaff-4bbaa86880fc"
    7) "status"
    8) "enabled"
    9) "created_at"
    10) "2023-08-29T11:06:11.914074Z"
    11) "name"
    12) "-dry-sun"
    13) "metadata"
    14) "{}"
    15) "identity"
    16) "-small-flower@email.com"
```

As you can see from this example, every odd field represents field name while every even field represents field value. This is standard event format for Redis Streams. If you want to extract `metadata` field from this event, you'll have to read it as string first and then you can deserialize it to some structured format.

### User view event

Whenever user is viewed, `users` service will generate new `view` event. This event will have the following format:

```redis
1) "1693307172248-0"
2)  1) "name"
    2) "-holy-pond"
    3) "owner"
    4) "e1b982d8-a332-4bc2-aaff-4bbaa86880fc"
    5) "created_at"
    6) "2023-08-29T11:06:12.032254Z"
    7) "status"
    8) "enabled"
    9) "operation"
    10) "user.view"
    11) "id"
    12) "56d2a797-dcb9-4fab-baf9-7c75e707b2c0"
    13) "identity"
    14) "-snowy-wave@email.com"
    15) "metadata"
    16) "{}"
    17) "occurred_at"
    18) "1693307172247989798"
```

### User view profile event

Whenever user profile is viewed, `users` service will generate new `view_profile` event. This event will have the following format:

```redis
1) "1693308867001-0"
2)  1) "id"
    2) "64fd20bf-e8fb-46bf-9b64-2a6572eda21b"
    3) "name"
    4) "admin"
    5) "identity"
    6) "admin@example.com"
    7) "metadata"
    8) "{\"role\":\"admin\"}"
    9) "created_at"
    10) "2023-08-29T10:55:23.048948Z"
    11) "status"
    12) "enabled"
    13) "occurred_at"
    14) "1693308867001792403"
    15) "operation"
    16) "user.view_profile"
```

### User list event

Whenever user list is fetched, `users` service will generate new `list` event. This event will have the following format:

```redis
1) "1693307172254-0"
2)  1) "status"
    2) "enabled"
    3) "occurred_at"
    4) "1693307172254687479"
    5) "operation"
    6) "user.list"
    7) "total"
    8) "0"
    9) "offset"
    10) "0"
    11) "limit"
    12) "10"
```

### User list by group event

Whenever user list by group is fetched, `users` service will generate new `list_by_group` event. This event will have the following format:

```redis
1) "1693308952544-0"
2)  1) "operation"
    2) "user.list_by_group"
    3) "total"
    4) "0"
    5) "offset"
    6) "0"
    7) "limit"
    8) "10"
    9) "group_id"
    10) "bc7fb023-70d5-41aa-bf73-3eab1cf001c9"
    11) "status"
    12) "enabled"
    13) "occurred_at"
    14) "1693308952544612677"
```

### User identify event

Whenever user is identified, `users` service will generate new `identify` event. This event will have the following format:

```redis
1) "1693307172168-0"
2) 1) "operation"
    2) "user.identify"
    3) "user_id"
    4) "e1b982d8-a332-4bc2-aaff-4bbaa86880fc"
    5) "occurred_at"
    6) "1693307172167980303"
```

### User generate reset token event

Whenever user reset token is generated, `users` service will generate new `generate_reset_token` event. This event will have the following format:

```redis
1) "1693310458376-0"
2) 1) "operation"
    2) "user.generate_reset_token"
    3) "email"
    4) "rodneydav@gmail.com"
    5) "host"
    6) "http://localhost"
    7) "occurred_at"
    8) "1693310458376066097"
```

### User issue token event

Whenever user token is issued, `users` service will generate new `issue_token` event. This event will have the following format:

```redis
1) "1693307171987-0"
2) 1) "operation"
    2) "user.issue_token"
    3) "identity"
    4) "-small-flower@email.com"
    5) "occurred_at"
    6) "1693307171987023095"
```

### User refresh token event

Whenever user token is refreshed, `users` service will generate new `refresh_token` event. This event will have the following format:

```redis
1) "1693309886622-0"
2) 1) "operation"
    2) "user.refresh_token"
    3) "occurred_at"
    4) "1693309886622414715"
```

### User reset secret event

Whenever user secret is reset, `users` service will generate new `reset_secret` event. This event will have the following format:

```redis
1) "1693311075789-0"
2)  1) "operation"
    2) "user.update_secret"
    3) "updated_by"
    4) "34591d29-13eb-49f8-995b-e474911eeb8a"
    5) "name"
    6) "rodney"
    7) "created_at"
    8) "2023-08-29T11:59:51.456429Z"
    9) "status"
    10) "enabled"
    11) "occurred_at"
    12) "1693311075789446621"
    13) "updated_at"
    14) "2023-08-29T12:11:15.785039Z"
    15) "id"
    16) "34591d29-13eb-49f8-995b-e474911eeb8a"
    17) "identity"
    18) "rodneydav@gmail.com"
    19) "metadata"
    20) "{}"
```

### User update event

Whenever user instance is updated, `users` service will generate new `update` event. This event will have the following format:

```redis
1) "1693307172308-0"
2)  1) "operation"
    2) "user.update"
    3) "updated_by"
    4) "e1b982d8-a332-4bc2-aaff-4bbaa86880fc"
    5) "id"
    6) "56d2a797-dcb9-4fab-baf9-7c75e707b2c0"
    7) "metadata"
    8) "{\"Update\":\"rough-leaf\"}"
    9) "updated_at"
    10) "2023-08-29T11:06:12.294444Z"
    11) "name"
    12) "fragrant-voice"
    13) "identity"
    14) "-snowy-wave@email.com"
    15) "created_at"
    16) "2023-08-29T11:06:12.032254Z"
    17) "status"
    18) "enabled"
    19) "occurred_at"
    20) "1693307172308305030"
```

### User update identity event

Whenever user identity is updated, `users` service will generate new `update_identity` event. This event will have the following format:

```redis
1) "1693307172321-0"
2)  1) "metadata"
    2) "{\"Update\":\"rough-leaf\"}"
    3) "created_at"
    4) "2023-08-29T11:06:12.032254Z"
    5) "status"
    6) "enabled"
    7) "updated_at"
    8) "2023-08-29T11:06:12.310276Z"
    9) "updated_by"
    10) "e1b982d8-a332-4bc2-aaff-4bbaa86880fc"
    11) "id"
    12) "56d2a797-dcb9-4fab-baf9-7c75e707b2c0"
    13) "name"
    14) "fragrant-voice"
    15) "operation"
    16) "user.update_identity"
    17) "identity"
    18) "wandering-brook"
    19) "occurred_at"
    20) "1693307172320906479"
```

### User update tags event

Whenever user tags are updated, `users` service will generate new `update_tags` event. This event will have the following format:

```redis
1) "1693307172332-0"
2)  1) "name"
    2) "fragrant-voice"
    3) "identity"
    4) "wandering-brook"
    5) "metadata"
    6) "{\"Update\":\"rough-leaf\"}"
    7) "status"
    8) "enabled"
    9) "updated_at"
    10) "2023-08-29T11:06:12.323039Z"
    11) "updated_by"
    12) "e1b982d8-a332-4bc2-aaff-4bbaa86880fc"
    13) "id"
    14) "56d2a797-dcb9-4fab-baf9-7c75e707b2c0"
    15) "occurred_at"
    16) "1693307172332766275"
    17) "operation"
    18) "user.update_tags"
    19) "tags"
    20) "[patient-thunder]"
    21) "created_at"
    22) "2023-08-29T11:06:12.032254Z"
```

### User remove event

Whenever user instance changes state in the system, `users` service will generate and publish new `remove` event. This event will have the following format:

```redis
1) "1693307172345-0"
2)  1) "operation"
    2) "user.remove"
    3) "id"
    4) "56d2a797-dcb9-4fab-baf9-7c75e707b2c0"
    5) "status"
    6) "disabled"
    7) "updated_at"
    8) "2023-08-29T11:06:12.323039Z"
    9) "updated_by"
    10) "e1b982d8-a332-4bc2-aaff-4bbaa86880fc"
    11) "occurred_at"
    12) "1693307172345419824"

1) "1693307172359-0"
2)  1) "id"
    2) "56d2a797-dcb9-4fab-baf9-7c75e707b2c0"
    3) "status"
    4) "enabled"
    5) "updated_at"
    6) "2023-08-29T11:06:12.323039Z"
    7) "updated_by"
    8) "e1b982d8-a332-4bc2-aaff-4bbaa86880fc"
    9) "occurred_at"
    10) "1693307172359445655"
    11) "operation"
    12) "user.remove"
```

### Group create event

Whenever group is created, `users` service will generate new `create` event. This event will have the following format:

```redis
1) "1693307172153-0"
2)  1) "name"
    2) "-fragrant-resonance"
    3) "metadata"
    4) "{}"
    5) "occurred_at"
    6) "1693307172152850138"
    7) "operation"
    8) "group.create"
    9) "id"
    10) "bc7fb023-70d5-41aa-bf73-3eab1cf001c9"
    11) "status"
    12) "enabled"
    13) "created_at"
    14) "2023-08-29T11:06:12.129484Z"
    15) "owner"
    16) "e1b982d8-a332-4bc2-aaff-4bbaa86880fc"
```

As you can see from this example, every odd field represents field name while every even field represents field value. This is standard event format for Redis Streams. If you want to extract `metadata` field from this event, you'll have to read it as string first and then you can deserialize it to some structured format.

### Group update event

Whenever group instance is updated, `users` service will generate new `update` event. This event will have the following format:

```redis
1) "1693307172445-0"
2)  1) "operation"
    2) "group.update"
    3) "owner"
    4) "e1b982d8-a332-4bc2-aaff-4bbaa86880fc"
    5) "name"
    6) "young-paper"
    7) "occurred_at"
    8) "1693307172445370750"
    9) "updated_at"
    10) "2023-08-29T11:06:12.429555Z"
    11) "updated_by"
    12) "e1b982d8-a332-4bc2-aaff-4bbaa86880fc"
    13) "id"
    14) "bc7fb023-70d5-41aa-bf73-3eab1cf001c9"
    15) "metadata"
    16) "{\"Update\":\"spring-wood\"}"
    17) "created_at"
    18) "2023-08-29T11:06:12.129484Z"
    19) "status"
    20) "enabled"
```

### Group view event

Whenever group is viewed, `users` service will generate new `view` event. This event will have the following format:

```redis
1) "1693307172257-0"
2)  1) "occurred_at"
    2) "1693307172257041358"
    3) "operation"
    4) "group.view"
    5) "id"
    6) "bc7fb023-70d5-41aa-bf73-3eab1cf001c9"
    7) "owner"
    8) "e1b982d8-a332-4bc2-aaff-4bbaa86880fc"
    9) "name"
    10) "-fragrant-resonance"
    11) "metadata"
    12) "{}"
    13) "created_at"
    14) "2023-08-29T11:06:12.129484Z"
    15) "status"
    16) "enabled"
```

### Group list event

Whenever group list is fetched, `users` service will generate new `list` event. This event will have the following format:

```redis
1) "1693307172264-0"
2)  1) "occurred_at"
    2) "1693307172264183217"
    3) "operation"
    4) "group.list"
    5) "total"
    6) "0"
    7) "offset"
    8) "0"
    9) "limit"
    10) "10"
    11) "status"
    12) "enabled"
```

### Group list by user event

Whenever group list by user is fetched, `users` service will generate new `list_by_user` event. This event will have the following format:

```redis
1) "1693308937283-0"
2)  1) "limit"
    2) "10"
    3) "channel_id"
    4) "bb1a7b38-cd79-410d-aca7-e744decd7b8e"
    5) "status"
    6) "enabled"
    7) "occurred_at"
    8) "1693308937282933017"
    9) "operation"
    10) "group.list_by_user"
    11) "total"
    12) "0"
    13) "offset"
    14) "0"
```

### Group remove event

Whenever group instance changes state in the system, `users` service will generate and publish new `remove` event. This event will have the following format:

```redis
1) "1693307172460-0"
2)  1) "updated_by"
    2) "e1b982d8-a332-4bc2-aaff-4bbaa86880fc"
    3) "occurred_at"
    4) "1693307172459828786"
    5) "operation"
    6) "group.remove"
    7) "id"
    8) "bc7fb023-70d5-41aa-bf73-3eab1cf001c9"
    9) "status"
    10) "disabled"
    11) "updated_at"
    12) "2023-08-29T11:06:12.429555Z"

1) "1693307172473-0"
2)  1) "id"
    2) "bc7fb023-70d5-41aa-bf73-3eab1cf001c9"
    3) "status"
    4) "enabled"
    5) "updated_at"
    6) "2023-08-29T11:06:12.429555Z"
    7) "updated_by"
    8) "e1b982d8-a332-4bc2-aaff-4bbaa86880fc"
    9) "occurred_at"
    10) "1693307172473661564"
    11) "operation"
    12) "group.remove"
```

### Policy authorize event

Whenever policy is authorized, `users` service will generate new `authorize` event. This event will have the following format:

```redis
1) "1693311470724-0"
2)  1) "entity_type"
    2) "thing"
    3) "object"
    4) "8a85e2d5-e783-43ee-8bea-d6d0f8039e78"
    5) "actions"
    6) "c_list"
    7) "occurred_at"
    8) "1693311470724174126"
    9) "operation"
    10) "policies.authorize"
```

### Policy add event

Whenever policy is added, `users` service will generate new `add` event. This event will have the following format:

```redis
1) "1693311470721-0"
2)  1) "operation"
    2) "policies.add"
    3) "owner_id"
    4) "fe2e5de0-9900-4ac5-b364-eae0c35777fb"
    5) "subject"
    6) "12510af8-b6a7-410d-944c-9feded199d6d"
    7) "object"
    8) "8a85e2d5-e783-43ee-8bea-d6d0f8039e78"
    9) "actions"
    10) "[g_add,c_list]"
    11) "created_at"
    12) "2023-08-29T12:17:50.715541Z"
    13) "occurred_at"
    14) "1693311470721394773"
```

### Policy update event

Whenever policy is updated, `users` service will generate new `update` event. This event will have the following format:

```redis
1) "1693312500101-0"
2)  1) "updated_at"
    2) "2023-08-29T12:35:00.095028Z"
    3) "occurred_at"
    4) "1693312500101367995"
    5) "operation"
    6) "policies.update"
    7) "owner_id"
    8) "fe2e5de0-9900-4ac5-b364-eae0c35777fb"
    9) "subject"
    10) "12510af8-b6a7-410d-944c-9feded199d6d"
    11) "object"
    12) "8a85e2d5-e783-43ee-8bea-d6d0f8039e78"
    13) "actions"
    14) "[g_add,c_list]"
    15) "created_at"
    16) "2023-08-29T12:17:50.715541Z"
```

### Policy remove event

Whenever policy is removed, `users` service will generate new `remove` event. This event will have the following format:

```redis
1) "1693312590631-0"
2)  1) "occurred_at"
    2) "1693312590631691388"
    3) "operation"
    4) "policies.delete"
    5) "subject"
    6) "12510af8-b6a7-410d-944c-9feded199d6d"
    7) "object"
    8) "8a85e2d5-e783-43ee-8bea-d6d0f8039e78"
    9) "actions"
    10) "[g_add,c_list]"
```

### Policy list event

Whenever policy list is fetched, `things` service will generate new `list` event. This event will have the following format:

```redis
1) "1693312633649-0"
2)  1) "operation"
    2) "policies.list"
    3) "total"
    4) "0"
    5) "limit"
    6) "10"
    7) "offset"
    8) "0"
    9) "occurred_at"
    10) "1693312633649171129"
```

## Things Service

For every operation that has side effects (that is changing service state) `things` service will generate new event and publish it to Redis Stream called `mainflux.things`. Every event has its own event ID that is automatically generated and `operation` field that can have one of the following values:

- `thing.create` for thing creation
- `thing.update` for thing update
- `thing.remove` for thing change of state
- `thing.view` for thing view
- `thing.list` for listing things
- `thing.list_by_channel` for listing things by channel
- `thing.identify` for thing identification
- `channel.create` for channel creation
- `channel.update` for channel update
- `channel.remove` for channel change of state
- `channel.view` for channel view
- `channel.list` for listing channels
- `channel.list_by_thing` for listing channels by thing
- `policy.authorize` for policy authorization
- `policy.add` for policy creation
- `policy.update` for policy update
- `policy.remove` for policy deletion
- `policy.list` for listing policies

By fetching and processing these events you can reconstruct `things` service state. If you store some of your custom data in `metadata` field, this is the perfect way to fetch it and process it. If you want to integrate through [docker-compose.yml][mf-docker-compose] you can use `mainflux-es-redis` service. Just connect to it and consume events from Redis Stream named `mainflux.things`.

### Thing create event

Whenever thing is created, `things` service will generate new `create` event. This event will have the following format:

```redis
1) 1) "1693311470576-0"
2)  1) "operation"
    2) "thing.create"
    3) "id"
    4) "12510af8-b6a7-410d-944c-9feded199d6d"
    5) "status"
    6) "enabled"
    7) "created_at"
    8) "2023-08-29T12:17:50.566453Z"
    9) "name"
    10) "-broken-cloud"
    11) "owner"
    12) "fe2e5de0-9900-4ac5-b364-eae0c35777fb"
    13) "metadata"
    14) "{}"
    15) "occurred_at"
    16) "1693311470576589894"
```

As you can see from this example, every odd field represents field name while every even field represents field value. This is standard event format for Redis Streams. If you want to extract `metadata` field from this event, you'll have to read it as string first and then you can deserialize it to some structured format.

### Thing update event

Whenever thing instance is updated, `things` service will generate new `update` event. This event will have the following format:

```redis
1) "1693311470669-0"
2)  1) "operation"
    2) "thing.update"
    3) "updated_at"
    4) "2023-08-29T12:17:50.665752Z"
    5) "updated_by"
    6) "fe2e5de0-9900-4ac5-b364-eae0c35777fb"
    7) "owner"
    8) "fe2e5de0-9900-4ac5-b364-eae0c35777fb"
    9) "created_at"
    10) "2023-08-29T12:17:50.566453Z"
    11) "status"
    12) "enabled"
    13) "id"
    14) "12510af8-b6a7-410d-944c-9feded199d6d"
    15) "name"
    16) "lingering-sea"
    17) "metadata"
    18) "{\"Update\":\"nameless-glitter\"}"
    19) "occurred_at"
    20) "1693311470669567023"
```

### Thing update secret event

Whenever thing secret is updated, `things` service will generate new `update_secret` event. This event will have the following format:

```redis
1) "1693311470676-0"
2)  1) "id"
    2) "12510af8-b6a7-410d-944c-9feded199d6d"
    3) "name"
    4) "lingering-sea"
    5) "metadata"
    6) "{\"Update\":\"nameless-glitter\"}"
    7) "status"
    8) "enabled"
    9) "occurred_at"
    10) "1693311470676563107"
    11) "operation"
    12) "thing.update_secret"
    13) "updated_at"
    14) "2023-08-29T12:17:50.672865Z"
    15) "updated_by"
    16) "fe2e5de0-9900-4ac5-b364-eae0c35777fb"
    17) "owner"
    18) "fe2e5de0-9900-4ac5-b364-eae0c35777fb"
    19) "created_at"
    20) "2023-08-29T12:17:50.566453Z"
```

### Thing update tags event

Whenever thing tags are updated, `things` service will generate new `update_tags` event. This event will have the following format:

```redis
1) "1693311470682-0"
2)  1) "operation"
    2) "thing.update_tags"
    3) "owner"
    4) "fe2e5de0-9900-4ac5-b364-eae0c35777fb"
    5) "metadata"
    6) "{\"Update\":\"nameless-glitter\"}"
    7) "status"
    8) "enabled"
    9) "occurred_at"
    10) "1693311470682522926"
    11) "updated_at"
    12) "2023-08-29T12:17:50.679301Z"
    13) "updated_by"
    14) "fe2e5de0-9900-4ac5-b364-eae0c35777fb"
    15) "id"
    16) "12510af8-b6a7-410d-944c-9feded199d6d"
    17) "name"
    18) "lingering-sea"
    19) "tags"
    20) "[morning-pine]"
    21) "created_at"
    22) "2023-08-29T12:17:50.566453Z"
```

### Thing remove event

Whenever thing instance is removed from the system, `things` service will generate and publish new `remove` event. This event will have the following format:

```redis
1) "1693311470689-0"
2)  1) "updated_by"
    2) "fe2e5de0-9900-4ac5-b364-eae0c35777fb"
    3) "occurred_at"
    4) "1693311470688911826"
    5) "operation"
    6) "thing.remove"
    7) "id"
    8) "12510af8-b6a7-410d-944c-9feded199d6d"
    9) "status"
    10) "disabled"
    11) "updated_at"
    12) "2023-08-29T12:17:50.679301Z"

1) "1693311470695-0"
2)  1) "operation"
    2) "thing.remove"
    3) "id"
    4) "12510af8-b6a7-410d-944c-9feded199d6d"
    5) "status"
    6) "enabled"
    7) "updated_at"
    8) "2023-08-29T12:17:50.679301Z"
    9) "updated_by"
    10) "fe2e5de0-9900-4ac5-b364-eae0c35777fb"
    11) "occurred_at"
    12) "1693311470695446948"
```

### Thing view event

Whenever thing is viewed, `things` service will generate new `view` event. This event will have the following format:

```redis
1) "1693311470608-0"
2)  1) "operation"
    2) "thing.view"
    3) "id"
    4) "12510af8-b6a7-410d-944c-9feded199d6d"
    5) "name"
    6) "-broken-cloud"
    7) "owner"
    8) "fe2e5de0-9900-4ac5-b364-eae0c35777fb"
    9) "metadata"
    10) "{}"
    11) "created_at"
    12) "2023-08-29T12:17:50.566453Z"
    13) "status"
    14) "enabled"
    15) "occurred_at"
    16) "1693311470608701504"
```

### Thing list event

Whenever thing list is fetched, `things` service will generate new `list` event. This event will have the following format:

```redis
1) "1693311470613-0"
2)  1) "occurred_at"
    2) "1693311470613173088"
    3) "operation"
    4) "thing.list"
    5) "total"
    6) "0"
    7) "offset"
    8) "0"
    9) "limit"
    10) "10"
    11) "status"
    12) "enabled"
```

### Thing list by channel event

Whenever thing list by channel is fetched, `things` service will generate new `list_by_channel` event. This event will have the following format:

```redis
1) "1693312322620-0"
2)  1) "operation"
    2) "thing.list_by_channel"
    3) "total"
    4) "0"
    5) "offset"
    6) "0"
    7) "limit"
    8) "10"
    9) "channel_id"
    10) "8d77099e-4911-4140-8555-7d3be65a1694"
    11) "status"
    12) "enabled"
    13) "occurred_at"
    14) "1693312322620481072"
```

### Thing identify event

Whenever thing is identified, `things` service will generate new `identify` event. This event will have the following format:

```redis
1) "1693312391155-0"
2) 1) "operation"
    2) "thing.identify"
    3) "thing_id"
    4) "dc82d6bf-973b-4582-9806-0230cee11c20"
    5) "occurred_at"
    6) "1693312391155123548"
```

### Channel create event

Whenever channel instance is created, `things` service will generate and publish new `create` event. This event will have the following format:

```redis
1)  1) "1693311470584-0"
2)  1) "owner"
    2) "fe2e5de0-9900-4ac5-b364-eae0c35777fb"
    3) "name"
    4) "-frosty-moon"
    5) "metadata"
    6) "{}"
    7) "occurred_at"
    8) "1693311470584416323"
    9) "operation"
    10) "channel.create"
    11) "id"
    12) "8a85e2d5-e783-43ee-8bea-d6d0f8039e78"
    13) "status"
    14) "enabled"
    15) "created_at"
    16) "2023-08-29T12:17:50.57866Z"
```

### Channel update event

Whenever channel instance is updated, `things` service will generate and publish new `update` event. This event will have the following format:

```redis
1) "1693311470701-0"
2)  1) "updated_by"
    2) "fe2e5de0-9900-4ac5-b364-eae0c35777fb"
    3) "owner"
    4) "fe2e5de0-9900-4ac5-b364-eae0c35777fb"
    5) "created_at"
    6) "2023-08-29T12:17:50.57866Z"
    7) "status"
    8) "enabled"
    9) "operation"
    10) "channel.update"
    11) "updated_at"
    12) "2023-08-29T12:17:50.698278Z"
    13) "metadata"
    14) "{\"Update\":\"silent-hill\"}"
    15) "occurred_at"
    16) "1693311470701812291"
    17) "id"
    18) "8a85e2d5-e783-43ee-8bea-d6d0f8039e78"
    19) "name"
    20) "morning-forest"
```

Note that update channel event will contain only those fields that were updated using update channel endpoint.

### Channel remove event

Whenever channel instance is removed from the system, `things` service will generate and publish new `remove` event. This event will have the following format:

```redis
1) "1693311470708-0"
2)  1) "status"
    2) "disabled"
    3) "updated_at"
    4) "2023-08-29T12:17:50.698278Z"
    5) "updated_by"
    6) "fe2e5de0-9900-4ac5-b364-eae0c35777fb"
    7) "occurred_at"
    8) "1693311470708219296"
    9) "operation"
    10) "channel.remove"
    11) "id"
    12) "8a85e2d5-e783-43ee-8bea-d6d0f8039e78"

1) "1693311470714-0"
2)  1) "occurred_at"
    2) "1693311470714118979"
    3) "operation"
    4) "channel.remove"
    5) "id"
    6) "8a85e2d5-e783-43ee-8bea-d6d0f8039e78"
    7) "status"
    8) "enabled"
    9) "updated_at"
    10) "2023-08-29T12:17:50.698278Z"
    11) "updated_by"
    12) "fe2e5de0-9900-4ac5-b364-eae0c35777fb"
```

### Channel view event

Whenever channel is viewed, `things` service will generate new `view` event. This event will have the following format:

```redis
1) "1693311470615-0"
2)  1) "id"
    2) "8a85e2d5-e783-43ee-8bea-d6d0f8039e78"
    3) "owner"
    4) "fe2e5de0-9900-4ac5-b364-eae0c35777fb"
    5) "name"
    6) "-frosty-moon"
    7) "metadata"
    8) "{}"
    9) "created_at"
    10) "2023-08-29T12:17:50.57866Z"
    11) "status"
    12) "enabled"
    13) "occurred_at"
    14) "1693311470615693019"
    15) "operation"
    16) "channel.view"
```

### Channel list event

Whenever channel list is fetched, `things` service will generate new `list` event. This event will have the following format:

```redis
1) "1693311470619-0"
2)  1) "limit"
    2) "10"
    3) "status"
    4) "enabled"
    5) "occurred_at"
    6) "1693311470619194337"
    7) "operation"
    8) "channel.list"
    9) "total"
    10) "0"
    11) "offset"
    12) "0"
```

### Channel list by thing event

Whenever channel list by thing is fetched, `things` service will generate new `list_by_thing` event. This event will have the following format:

```redis
1) "1693312299484-0"
2)  1) "occurred_at"
    2) "1693312299484000183"
    3) "operation"
    4) "channel.list_by_thing"
    5) "total"
    6) "0"
    7) "offset"
    8) "0"
    9) "limit"
    10) "10"
    11) "thing_id"
    12) "dc82d6bf-973b-4582-9806-0230cee11c20"
    13) "status"
    14) "enabled"
```

### Policy authorize event

Whenever policy is authorized, `things` service will generate new `authorize` event. This event will have the following format:

```redis
1) "1693311470724-0"
2)  1) "entity_type"
    2) "thing"
    3) "object"
    4) "8a85e2d5-e783-43ee-8bea-d6d0f8039e78"
    5) "actions"
    6) "m_read"
    7) "occurred_at"
    8) "1693311470724174126"
    9) "operation"
    10) "policies.authorize"
```

### Policy add event

Whenever policy is added, `things` service will generate new `add` event. This event will have the following format:

```redis
1) "1693311470721-0"
2)  1) "operation"
    2) "policies.add"
    3) "owner_id"
    4) "fe2e5de0-9900-4ac5-b364-eae0c35777fb"
    5) "subject"
    6) "12510af8-b6a7-410d-944c-9feded199d6d"
    7) "object"
    8) "8a85e2d5-e783-43ee-8bea-d6d0f8039e78"
    9) "actions"
    10) "[m_write,m_read]"
    11) "created_at"
    12) "2023-08-29T12:17:50.715541Z"
    13) "occurred_at"
    14) "1693311470721394773"
```

### Policy update event

Whenever policy is updated, `things` service will generate new `update` event. This event will have the following format:

```redis
1) "1693312500101-0"
2)  1) "updated_at"
    2) "2023-08-29T12:35:00.095028Z"
    3) "occurred_at"
    4) "1693312500101367995"
    5) "operation"
    6) "policies.update"
    7) "owner_id"
    8) "fe2e5de0-9900-4ac5-b364-eae0c35777fb"
    9) "subject"
    10) "12510af8-b6a7-410d-944c-9feded199d6d"
    11) "object"
    12) "8a85e2d5-e783-43ee-8bea-d6d0f8039e78"
    13) "actions"
    14) "[m_write,m_read]"
    15) "created_at"
    16) "2023-08-29T12:17:50.715541Z"
```

### Policy remove event

Whenever policy is removed, `things` service will generate new `remove` event. This event will have the following format:

```redis
1) "1693312590631-0"
2)  1) "occurred_at"
    2) "1693312590631691388"
    3) "operation"
    4) "policies.delete"
    5) "subject"
    6) "12510af8-b6a7-410d-944c-9feded199d6d"
    7) "object"
    8) "8a85e2d5-e783-43ee-8bea-d6d0f8039e78"
    9) "actions"
    10) "[m_write,m_read]"
```

### Policy list event

Whenever policy list is fetched, `things` service will generate new `list` event. This event will have the following format:

```redis
1) "1693312633649-0"
2)  1) "operation"
    2) "policies.list"
    3) "total"
    4) "0"
    5) "limit"
    6) "10"
    7) "offset"
    8) "0"
    9) "occurred_at"
    10) "1693312633649171129"
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
1) "1693313286544-0"
2)  1) "state"
    2) "0"
    3) "operation"
    4) "config.create"
    5) "name"
    6) "demo"
    7) "channels"
    8) "[8d77099e-4911-4140-8555-7d3be65a1694]"
    9) "client_cert"
    10) "-----BEGIN ENCRYPTED PRIVATE KEY-----MIIFHDBOBgkqhkiG9w0BBQ0wQTApBgkqhkiG9w0BBQwwHAQIc+VAU9JPnIkCAggAMAwGCCqGSIb3DQIJBQAwFAYIKoZIhvcNAwcECImSB+9qZ8dmBIIEyBW/rZlECWnEcMuTXhfJFe+3HP4rV+TXEEuigwCbtVPHWXoZj7KqGiOFgFaDL5Ne/GRwVD6geaTeQVl3aoHzo8mY0yuX2L36Ho2yHF/Bw89WT3hgP0lZ1lVO7O7n8DwybOaoJ+1S3akyb6OPbqcxJou1IGzKV1kz77R8V8nOFSd1BOepNbanGxVG8Jkgc37dQnICXwwaYkTx9PQBtSux1j3KgX0p+VAUNoUFi7N6b0MeO8iEuLU1dUiVwlH/jtitg0W3AvSV+5gezTT2VQW3CVlz6IBTPI1Rfl/3ss18Tao0NiPUmXMIgreBCamXvb0aJm8JxVbhoFYqWVNVocBD+n1+NwhCRlZM5Kgaes5S2JuFnjTAqEYytlQqEySbaN57XYCDNVmQz2iViz/+npuR9SCGwnNvV/TNsKRwav+0NC0pbf3LNk/KL9/X5ccmPhB5Rl7IS/v1BBLYX/jYWVN0dJiSA7fVIr9Acr7IbxWEQ2Y2qh1wdhayi4FBUHY3weivYSU3uGZizsSGJP/N6DutBgS1aXd5X/CqfF7VzRaKF4cfLO4XxTYUEjOztUNMN2XmW0o+ULjQmbouRPs/PIFmh6rc+h42m6p4SkjcsIKOy+mPTeJqhOVmYoMzO8+7mmXDOjFwvi/w97sdmbjII8Zn2iR/N8GuY23vv5h6LQ3tQ5kTA4IuPbYCVLeggd4iMM6TgpuJn0aG7yo4tDFqMeadCVhP2Bp3JQa8r3B2IJstTTF1OtZCrInjSus9ViOiM02Iz3ZmyglsMonJDlWeJL5jKBgqPbLR82IDhIY4IO6SqoVsWu4iWuLW5/TM3fdfYG3Wdvu7Suz7/anLAaMQEzKhObwgDdKmv4PkF75frex969CB1pQqSVnXmz4GrtxVUzWtlflaTSdSegpUXWLhG+jUNKTu+ptxDNM/JBxRNLSzdvsGbkI0qycOCliVpKkkvuiBGtiDWNax6KhV4/oRjkEkTRks9Xeko+q3uY4B//AGxsotsVhF5vhUDTOl5IX7a7wCPtbTGiaR79eprRzGnP9yP38djVrvXprJFU8P7GUr/f2qJt2jDYuCkaqAMsfjdu6YHitjj3ty4vrASgxJ0vsroWhjgiCwgASqM7GnweHSHy5/OZK8jCZX+g+B63Mu4ec+/nNnjvuLqBBZN/FSzXU5fVmYznfPaqW+1Xep+Aj1yGk3L3tvnKLc3sZ1HAJQEjud5dbME6e0JGxh5xOCnzWUR+YL/96KJAcgkxDJ1DxxHv0Uu/5kO5InOsPjs4YKuzqD4nUmGsFsJzTxG626wdGXJMO4YCRKkKtnNeWqMaslM3paN19/tTWyEbaDqc5mVzYLIb3Mzju+OV4GniDeVIvSIsXK5aFGj1PEhfCprQCqUzdNhFU8hF4kUVhn9dp0ExveT7btHSMlEZAWHRkDuLqaImpQkjYmwt90cxtdZwQvjTDtsFmQrvcSp8n1K3P5PwZpVtIw2UHpx+NjE8ZYwOozpXl/oOMzVTB8mi1dQGFkpac9cwnzCZof0ub4iutBeKc4WeEOytvY+CY7hc+/ncCprZ08nlkQarQV7jhfJj658GfBMLGzJtYkCrHwi/AoseIXa5W7eX+lz7O92H2M5QnEkPStQ9lsz2VkYA==-----END ENCRYPTED PRIVATE KEY-----"
    11) "ca_cert"
    12) "-----BEGIN ENCRYPTED PRIVATE KEY-----MIIFHDBOBgkqhkiG9w0BBQ0wQTApBgkqhkiG9w0BBQwwHAQIc+VAU9JPnIkCAggAMAwGCCqGSIb3DQIJBQAwFAYIKoZIhvcNAwcECImSB+9qZ8dmBIIEyBW/rZlECWnEcMuTXhfJFe+3HP4rV+TXEEuigwCbtVPHWXoZj7KqGiOFgFaDL5Ne/GRwVD6geaTeQVl3aoHzo8mY0yuX2L36Ho2yHF/Bw89WT3hgP0lZ1lVO7O7n8DwybOaoJ+1S3akyb6OPbqcxJou1IGzKV1kz77R8V8nOFSd1BOepNbanGxVG8Jkgc37dQnICXwwaYkTx9PQBtSux1j3KgX0p+VAUNoUFi7N6b0MeO8iEuLU1dUiVwlH/jtitg0W3AvSV+5gezTT2VQW3CVlz6IBTPI1Rfl/3ss18Tao0NiPUmXMIgreBCamXvb0aJm8JxVbhoFYqWVNVocBD+n1+NwhCRlZM5Kgaes5S2JuFnjTAqEYytlQqEySbaN57XYCDNVmQz2iViz/+npuR9SCGwnNvV/TNsKRwav+0NC0pbf3LNk/KL9/X5ccmPhB5Rl7IS/v1BBLYX/jYWVN0dJiSA7fVIr9Acr7IbxWEQ2Y2qh1wdhayi4FBUHY3weivYSU3uGZizsSGJP/N6DutBgS1aXd5X/CqfF7VzRaKF4cfLO4XxTYUEjOztUNMN2XmW0o+ULjQmbouRPs/PIFmh6rc+h42m6p4SkjcsIKOy+mPTeJqhOVmYoMzO8+7mmXDOjFwvi/w97sdmbjII8Zn2iR/N8GuY23vv5h6LQ3tQ5kTA4IuPbYCVLeggd4iMM6TgpuJn0aG7yo4tDFqMeadCVhP2Bp3JQa8r3B2IJstTTF1OtZCrInjSus9ViOiM02Iz3ZmyglsMonJDlWeJL5jKBgqPbLR82IDhIY4IO6SqoVsWu4iWuLW5/TM3fdfYG3Wdvu7Suz7/anLAaMQEzKhObwgDdKmv4PkF75frex969CB1pQqSVnXmz4GrtxVUzWtlflaTSdSegpUXWLhG+jUNKTu+ptxDNM/JBxRNLSzdvsGbkI0qycOCliVpKkkvuiBGtiDWNax6KhV4/oRjkEkTRks9Xeko+q3uY4B//AGxsotsVhF5vhUDTOl5IX7a7wCPtbTGiaR79eprRzGnP9yP38djVrvXprJFU8P7GUr/f2qJt2jDYuCkaqAMsfjdu6YHitjj3ty4vrASgxJ0vsroWhjgiCwgASqM7GnweHSHy5/OZK8jCZX+g+B63Mu4ec+/nNnjvuLqBBZN/FSzXU5fVmYznfPaqW+1Xep+Aj1yGk3L3tvnKLc3sZ1HAJQEjud5dbME6e0JGxh5xOCnzWUR+YL/96KJAcgkxDJ1DxxHv0Uu/5kO5InOsPjs4YKuzqD4nUmGsFsJzTxG626wdGXJMO4YCRKkKtnNeWqMaslM3paN19/tTWyEbaDqc5mVzYLIb3Mzju+OV4GniDeVIvSIsXK5aFGj1PEhfCprQCqUzdNhFU8hF4kUVhn9dp0ExveT7btHSMlEZAWHRkDuLqaImpQkjYmwt90cxtdZwQvjTDtsFmQrvcSp8n1K3P5PwZpVtIw2UHpx+NjE8ZYwOozpXl/oOMzVTB8mi1dQGFkpac9cwnzCZof0ub4iutBeKc4WeEOytvY+CY7hc+/ncCprZ08nlkQarQV7jhfJj658GfBMLGzJtYkCrHwi/AoseIXa5W7eX+lz7O92H2M5QnEkPStQ9lsz2VkYA==-----END ENCRYPTED PRIVATE KEY-----"
    13) "occurred_at"
    14) "1693313286544243035"
    15) "thing_id"
    16) "dc82d6bf-973b-4582-9806-0230cee11c20"
    17) "content"
    18) "{   \"server\": {     \"address\": \"127.0.0.1\",     \"port\": 8080   },   \"database\": {     \"host\": \"localhost\",     \"port\": 5432,     \"username\": \"user\",     \"password\": \"password\",     \"dbname\": \"mydb\"   },   \"logging\": {     \"level\": \"info\",     \"file\": \"app.log\"   } }"
    19) "owner"
    20) "64fd20bf-e8fb-46bf-9b64-2a6572eda21b"
    21) "external_id"
    22) "209327A2FA2D47E3B05F118D769DC521"
    23) "client_key"
    24) "-----BEGIN ENCRYPTED PRIVATE KEY-----MIIFHDBOBgkqhkiG9w0BBQ0wQTApBgkqhkiG9w0BBQwwHAQIc+VAU9JPnIkCAggAMAwGCCqGSIb3DQIJBQAwFAYIKoZIhvcNAwcECImSB+9qZ8dmBIIEyBW/rZlECWnEcMuTXhfJFe+3HP4rV+TXEEuigwCbtVPHWXoZj7KqGiOFgFaDL5Ne/GRwVD6geaTeQVl3aoHzo8mY0yuX2L36Ho2yHF/Bw89WT3hgP0lZ1lVO7O7n8DwybOaoJ+1S3akyb6OPbqcxJou1IGzKV1kz77R8V8nOFSd1BOepNbanGxVG8Jkgc37dQnICXwwaYkTx9PQBtSux1j3KgX0p+VAUNoUFi7N6b0MeO8iEuLU1dUiVwlH/jtitg0W3AvSV+5gezTT2VQW3CVlz6IBTPI1Rfl/3ss18Tao0NiPUmXMIgreBCamXvb0aJm8JxVbhoFYqWVNVocBD+n1+NwhCRlZM5Kgaes5S2JuFnjTAqEYytlQqEySbaN57XYCDNVmQz2iViz/+npuR9SCGwnNvV/TNsKRwav+0NC0pbf3LNk/KL9/X5ccmPhB5Rl7IS/v1BBLYX/jYWVN0dJiSA7fVIr9Acr7IbxWEQ2Y2qh1wdhayi4FBUHY3weivYSU3uGZizsSGJP/N6DutBgS1aXd5X/CqfF7VzRaKF4cfLO4XxTYUEjOztUNMN2XmW0o+ULjQmbouRPs/PIFmh6rc+h42m6p4SkjcsIKOy+mPTeJqhOVmYoMzO8+7mmXDOjFwvi/w97sdmbjII8Zn2iR/N8GuY23vv5h6LQ3tQ5kTA4IuPbYCVLeggd4iMM6TgpuJn0aG7yo4tDFqMeadCVhP2Bp3JQa8r3B2IJstTTF1OtZCrInjSus9ViOiM02Iz3ZmyglsMonJDlWeJL5jKBgqPbLR82IDhIY4IO6SqoVsWu4iWuLW5/TM3fdfYG3Wdvu7Suz7/anLAaMQEzKhObwgDdKmv4PkF75frex969CB1pQqSVnXmz4GrtxVUzWtlflaTSdSegpUXWLhG+jUNKTu+ptxDNM/JBxRNLSzdvsGbkI0qycOCliVpKkkvuiBGtiDWNax6KhV4/oRjkEkTRks9Xeko+q3uY4B//AGxsotsVhF5vhUDTOl5IX7a7wCPtbTGiaR79eprRzGnP9yP38djVrvXprJFU8P7GUr/f2qJt2jDYuCkaqAMsfjdu6YHitjj3ty4vrASgxJ0vsroWhjgiCwgASqM7GnweHSHy5/OZK8jCZX+g+B63Mu4ec+/nNnjvuLqBBZN/FSzXU5fVmYznfPaqW+1Xep+Aj1yGk3L3tvnKLc3sZ1HAJQEjud5dbME6e0JGxh5xOCnzWUR+YL/96KJAcgkxDJ1DxxHv0Uu/5kO5InOsPjs4YKuzqD4nUmGsFsJzTxG626wdGXJMO4YCRKkKtnNeWqMaslM3paN19/tTWyEbaDqc5mVzYLIb3Mzju+OV4GniDeVIvSIsXK5aFGj1PEhfCprQCqUzdNhFU8hF4kUVhn9dp0ExveT7btHSMlEZAWHRkDuLqaImpQkjYmwt90cxtdZwQvjTDtsFmQrvcSp8n1K3P5PwZpVtIw2UHpx+NjE8ZYwOozpXl/oOMzVTB8mi1dQGFkpac9cwnzCZof0ub4iutBeKc4WeEOytvY+CY7hc+/ncCprZ08nlkQarQV7jhfJj658GfBMLGzJtYkCrHwi/AoseIXa5W7eX+lz7O92H2M5QnEkPStQ9lsz2VkYA==-----END ENCRYPTED PRIVATE KEY-----"
```

### Configuration update event

Whenever configuration is updated, `bootstrap` service will generate and publish new `update` event. This event will have the following format:

```redis
1) "1693313985263-0"
2)  1) "state"
    2) "0"
    3) "operation"
    4) "config.update"
    5) "thing_id"
    6) "dc82d6bf-973b-4582-9806-0230cee11c20"
    7) "content"
    8) "{   \"server\": {     \"address\": \"127.0.0.1\",     \"port\": 8080   },   \"database\": {     \"host\": \"localhost\",     \"port\": 5432,     \"username\": \"user\",     \"password\": \"password\",     \"dbname\": \"mydb\"   } }"
    9) "name"
    10) "demo"
    11) "occurred_at"
    12) "1693313985263381501"
```

### Certificate update event

Whenever certificate is updated, `bootstrap` service will generate and publish new `update` event. This event will have the following format:

```redis
1) "1693313759203-0"
2)  1) "thing_key"
    2) "dc82d6bf-973b-4582-9806-0230cee11c20"
    3) "client_cert"
    4) "-----BEGIN ENCRYPTED PRIVATE KEY-----MIIFHDBOBgkqhkiG9w0BBQ0wQTApBgkqhkiG9w0BBQwwHAQIc+VAU9JPnIkCAggAMAwGCCqGSIb3DQIJBQAwFAYIKoZIhvcNAwcECImSB+9qZ8dmBIIEyBW/rZlECWnEcMuTXhfJFe+3HP4rV+TXEEuigwCbtVPHWXoZj7KqGiOFgFaDL5Ne/GRwVD6geaTeQVl3aoHzo8mY0yuX2L36Ho2yHF/Bw89WT3hgP0lZ1lVO7O7n8DwybOaoJ+1S3akyb6OPbqcxJou1IGzKV1kz77R8V8nOFSd1BOepNbanGxVG8Jkgc37dQnICXwwaYkTx9PQBtSux1j3KgX0p+VAUNoUFi7N6b0MeO8iEuLU1dUiVwlH/jtitg0W3AvSV+5gezTT2VQW3CVlz6IBTPI1Rfl/3ss18Tao0NiPUmXMIgreBCamXvb0aJm8JxVbhoFYqWVNVocBD+n1+NwhCRlZM5Kgaes5S2JuFnjTAqEYytlQqEySbaN57XYCDNVmQz2iViz/+npuR9SCGwnNvV/TNsKRwav+0NC0pbf3LNk/KL9/X5ccmPhB5Rl7IS/v1BBLYX/jYWVN0dJiSA7fVIr9Acr7IbxWEQ2Y2qh1wdhayi4FBUHY3weivYSU3uGZizsSGJP/N6DutBgS1aXd5X/CqfF7VzRaKF4cfLO4XxTYUEjOztUNMN2XmW0o+ULjQmbouRPs/PIFmh6rc+h42m6p4SkjcsIKOy+mPTeJqhOVmYoMzO8+7mmXDOjFwvi/w97sdmbjII8Zn2iR/N8GuY23vv5h6LQ3tQ5kTA4IuPbYCVLeggd4iMM6TgpuJn0aG7yo4tDFqMeadCVhP2Bp3JQa8r3B2IJstTTF1OtZCrInjSus9ViOiM02Iz3ZmyglsMonJDlWeJL5jKBgqPbLR82IDhIY4IO6SqoVsWu4iWuLW5/TM3fdfYG3Wdvu7Suz7/anLAaMQEzKhObwgDdKmv4PkF75frex969CB1pQqSVnXmz4GrtxVUzWtlflaTSdSegpUXWLhG+jUNKTu+ptxDNM/JBxRNLSzdvsGbkI0qycOCliVpKkkvuiBGtiDWNax6KhV4/oRjkEkTRks9Xeko+q3uY4B//AGxsotsVhF5vhUDTOl5IX7a7wCPtbTGiaR79eprRzGnP9yP38djVrvXprJFU8P7GUr/f2qJt2jDYuCkaqAMsfjdu6YHitjj3ty4vrASgxJ0vsroWhjgiCwgASqM7GnweHSHy5/OZK8jCZX+g+B63Mu4ec+/nNnjvuLqBBZN/FSzXU5fVmYznfPaqW+1Xep+Aj1yGk3L3tvnKLc3sZ1HAJQEjud5dbME6e0JGxh5xOCnzWUR+YL/96KJAcgkxDJ1DxxHv0Uu/5kO5InOsPjs4YKuzqD4nUmGsFsJzTxG626wdGXJMO4YCRKkKtnNeWqMaslM3paN19/tTWyEbaDqc5mVzYLIb3Mzju+OV4GniDeVIvSIsXK5aFGj1PEhfCprQCqUzdNhFU8hF4kUVhn9dp0ExveT7btHSMlEZAWHRkDuLqaImpQkjYmwt90cxtdZwQvjTDtsFmQrvcSp8n1K3P5PwZpVtIw2UHpx+NjE8ZYwOozpXl/oOMzVTB8mi1dQGFkpac9cwnzCZof0ub4iutBeKc4WeEOytvY+CY7hc+/ncCprZ08nlkQarQV7jhfJj658GfBMLGzJtYkCrHwi/AoseIXa5W7eX+lz7O92H2M5QnEkPStQ9lsz2VkYA==-----END ENCRYPTED PRIVATE KEY-----"
    5) "client_key"
    6) "-----BEGIN ENCRYPTED PRIVATE KEY-----MIIFHDBOBgkqhkiG9w0BBQ0wQTApBgkqhkiG9w0BBQwwHAQIc+VAU9JPnIkCAggAMAwGCCqGSIb3DQIJBQAwFAYIKoZIhvcNAwcECImSB+9qZ8dmBIIEyBW/rZlECWnEcMuTXhfJFe+3HP4rV+TXEEuigwCbtVPHWXoZj7KqGiOFgFaDL5Ne/GRwVD6geaTeQVl3aoHzo8mY0yuX2L36Ho2yHF/Bw89WT3hgP0lZ1lVO7O7n8DwybOaoJ+1S3akyb6OPbqcxJou1IGzKV1kz77R8V8nOFSd1BOepNbanGxVG8Jkgc37dQnICXwwaYkTx9PQBtSux1j3KgX0p+VAUNoUFi7N6b0MeO8iEuLU1dUiVwlH/jtitg0W3AvSV+5gezTT2VQW3CVlz6IBTPI1Rfl/3ss18Tao0NiPUmXMIgreBCamXvb0aJm8JxVbhoFYqWVNVocBD+n1+NwhCRlZM5Kgaes5S2JuFnjTAqEYytlQqEySbaN57XYCDNVmQz2iViz/+npuR9SCGwnNvV/TNsKRwav+0NC0pbf3LNk/KL9/X5ccmPhB5Rl7IS/v1BBLYX/jYWVN0dJiSA7fVIr9Acr7IbxWEQ2Y2qh1wdhayi4FBUHY3weivYSU3uGZizsSGJP/N6DutBgS1aXd5X/CqfF7VzRaKF4cfLO4XxTYUEjOztUNMN2XmW0o+ULjQmbouRPs/PIFmh6rc+h42m6p4SkjcsIKOy+mPTeJqhOVmYoMzO8+7mmXDOjFwvi/w97sdmbjII8Zn2iR/N8GuY23vv5h6LQ3tQ5kTA4IuPbYCVLeggd4iMM6TgpuJn0aG7yo4tDFqMeadCVhP2Bp3JQa8r3B2IJstTTF1OtZCrInjSus9ViOiM02Iz3ZmyglsMonJDlWeJL5jKBgqPbLR82IDhIY4IO6SqoVsWu4iWuLW5/TM3fdfYG3Wdvu7Suz7/anLAaMQEzKhObwgDdKmv4PkF75frex969CB1pQqSVnXmz4GrtxVUzWtlflaTSdSegpUXWLhG+jUNKTu+ptxDNM/JBxRNLSzdvsGbkI0qycOCliVpKkkvuiBGtiDWNax6KhV4/oRjkEkTRks9Xeko+q3uY4B//AGxsotsVhF5vhUDTOl5IX7a7wCPtbTGiaR79eprRzGnP9yP38djVrvXprJFU8P7GUr/f2qJt2jDYuCkaqAMsfjdu6YHitjj3ty4vrASgxJ0vsroWhjgiCwgASqM7GnweHSHy5/OZK8jCZX+g+B63Mu4ec+/nNnjvuLqBBZN/FSzXU5fVmYznfPaqW+1Xep+Aj1yGk3L3tvnKLc3sZ1HAJQEjud5dbME6e0JGxh5xOCnzWUR+YL/96KJAcgkxDJ1DxxHv0Uu/5kO5InOsPjs4YKuzqD4nUmGsFsJzTxG626wdGXJMO4YCRKkKtnNeWqMaslM3paN19/tTWyEbaDqc5mVzYLIb3Mzju+OV4GniDeVIvSIsXK5aFGj1PEhfCprQCqUzdNhFU8hF4kUVhn9dp0ExveT7btHSMlEZAWHRkDuLqaImpQkjYmwt90cxtdZwQvjTDtsFmQrvcSp8n1K3P5PwZpVtIw2UHpx+NjE8ZYwOozpXl/oOMzVTB8mi1dQGFkpac9cwnzCZof0ub4iutBeKc4WeEOytvY+CY7hc+/ncCprZ08nlkQarQV7jhfJj658GfBMLGzJtYkCrHwi/AoseIXa5W7eX+lz7O92H2M5QnEkPStQ9lsz2VkYA==-----END ENCRYPTED PRIVATE KEY-----"
    7) "ca_cert"
    8) "-----BEGIN ENCRYPTED PRIVATE KEY-----MIIFHDBOBgkqhkiG9w0BBQ0wQTApBgkqhkiG9w0BBQwwHAQIc+VAU9JPnIkCAggAMAwGCCqGSIb3DQIJBQAwFAYIKoZIhvcNAwcECImSB+9qZ8dmBIIEyBW/rZlECWnEcMuTXhfJFe+3HP4rV+TXEEuigwCbtVPHWXoZj7KqGiOFgFaDL5Ne/GRwVD6geaTeQVl3aoHzo8mY0yuX2L36Ho2yHF/Bw89WT3hgP0lZ1lVO7O7n8DwybOaoJ+1S3akyb6OPbqcxJou1IGzKV1kz77R8V8nOFSd1BOepNbanGxVG8Jkgc37dQnICXwwaYkTx9PQBtSux1j3KgX0p+VAUNoUFi7N6b0MeO8iEuLU1dUiVwlH/jtitg0W3AvSV+5gezTT2VQW3CVlz6IBTPI1Rfl/3ss18Tao0NiPUmXMIgreBCamXvb0aJm8JxVbhoFYqWVNVocBD+n1+NwhCRlZM5Kgaes5S2JuFnjTAqEYytlQqEySbaN57XYCDNVmQz2iViz/+npuR9SCGwnNvV/TNsKRwav+0NC0pbf3LNk/KL9/X5ccmPhB5Rl7IS/v1BBLYX/jYWVN0dJiSA7fVIr9Acr7IbxWEQ2Y2qh1wdhayi4FBUHY3weivYSU3uGZizsSGJP/N6DutBgS1aXd5X/CqfF7VzRaKF4cfLO4XxTYUEjOztUNMN2XmW0o+ULjQmbouRPs/PIFmh6rc+h42m6p4SkjcsIKOy+mPTeJqhOVmYoMzO8+7mmXDOjFwvi/w97sdmbjII8Zn2iR/N8GuY23vv5h6LQ3tQ5kTA4IuPbYCVLeggd4iMM6TgpuJn0aG7yo4tDFqMeadCVhP2Bp3JQa8r3B2IJstTTF1OtZCrInjSus9ViOiM02Iz3ZmyglsMonJDlWeJL5jKBgqPbLR82IDhIY4IO6SqoVsWu4iWuLW5/TM3fdfYG3Wdvu7Suz7/anLAaMQEzKhObwgDdKmv4PkF75frex969CB1pQqSVnXmz4GrtxVUzWtlflaTSdSegpUXWLhG+jUNKTu+ptxDNM/JBxRNLSzdvsGbkI0qycOCliVpKkkvuiBGtiDWNax6KhV4/oRjkEkTRks9Xeko+q3uY4B//AGxsotsVhF5vhUDTOl5IX7a7wCPtbTGiaR79eprRzGnP9yP38djVrvXprJFU8P7GUr/f2qJt2jDYuCkaqAMsfjdu6YHitjj3ty4vrASgxJ0vsroWhjgiCwgASqM7GnweHSHy5/OZK8jCZX+g+B63Mu4ec+/nNnjvuLqBBZN/FSzXU5fVmYznfPaqW+1Xep+Aj1yGk3L3tvnKLc3sZ1HAJQEjud5dbME6e0JGxh5xOCnzWUR+YL/96KJAcgkxDJ1DxxHv0Uu/5kO5InOsPjs4YKuzqD4nUmGsFsJzTxG626wdGXJMO4YCRKkKtnNeWqMaslM3paN19/tTWyEbaDqc5mVzYLIb3Mzju+OV4GniDeVIvSIsXK5aFGj1PEhfCprQCqUzdNhFU8hF4kUVhn9dp0ExveT7btHSMlEZAWHRkDuLqaImpQkjYmwt90cxtdZwQvjTDtsFmQrvcSp8n1K3P5PwZpVtIw2UHpx+NjE8ZYwOozpXl/oOMzVTB8mi1dQGFkpac9cwnzCZof0ub4iutBeKc4WeEOytvY+CY7hc+/ncCprZ08nlkQarQV7jhfJj658GfBMLGzJtYkCrHwi/AoseIXa5W7eX+lz7O92H2M5QnEkPStQ9lsz2VkYA==-----END ENCRYPTED PRIVATE KEY-----"
    9) "operation"
    10) "cert.update"
    11) "occurred_at"
    12) "1693313759203076553"
```

### Configuration list event

Whenever configuration list is fetched, `bootstrap` service will generate new `list` event. This event will have the following format:

```redis
1) "1693339274766-0"
2) 1) "occurred_at"
    2) "1693339274766130265"
    3) "offset"
    4) "0"
    5) "limit"
    6) "10"
    7) "operation"
    8) "config.list"
```

### Configuration view event

Whenever configuration is viewed, `bootstrap` service will generate new `view` event. This event will have the following format:

```redis
1) 1) "1693339152105-0"
2)  1) "thing_id"
    2) "74f00d13-d370-42c0-b528-04fff995275c"
    3) "name"
    4) "demo"
    5) "external_id"
    6) "FF-41-EF-BC-90-BC"
    7) "channels"
    8) "[90aae157-d47f-4d71-9a68-b000c0025ae8]"
    9) "client_cert"
    10) "-----BEGIN PRIVATE KEY-----MIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDVYaZsyd76aSWZexY/OyX8hVdE+ruT3OZrE6gFSjDiaAA2Uf5/eHT1BJdR4LviooXix8vfc/g5CAN/z98zmUmAzx9lk5T4sRhJfqYQ2yDEt1tVDwD3RzL9RHXRWiZu4thk253jOpT15VFvOf5wE6mhVozFl9OetVJb4eqKbHx9RY0rMXwiBiCC2LcUtcp6rVjp4pK6VGjehA8siVX9bnRsIY776jDb/pm2n+y5G+bd1CifSdgTrr7QLKFlx0//5lyslmfUbf76kg9bZ8Qe2NdFKvcpEZ4ENxtwMrqW2i1pTExVHNpka8rhA5936qpDKu1ce+kccIbFsPRAHU5PyXfNAgMBAAECggEAAtBt4c4WcGuwlkHxp4B/3hZix0Md9DOb9QTmWLjYxN5QRRHMbyFHPEVaOuHhjc9M6r0YgD2cTsw/QjvwmqfxOI9YFP6JnsS0faD7pF9EzbNes1QmVByOnJkpi0r1aiL4baQZL0+sz+1n/IqMQ4LO4D+ETcV/LKmsM2VbCDD+wfwsVkTmgaqKtXIFQ3bOU5LjRcxCZFs81z3mYDyP4hfnlmTWOOXcf8yLqx5LGH8erCGXgrhZiN5/mhkzUpkF75Eo4qt3jVZEt+d48RnPsk0TO0rqs4j5F3d/6Dboi3UpRlHZ4vEM7MeDGoMuXTh59MzbV1e/03sY2jTtB2NVQ51pFQKBgQD0kjYorDqu5e82Orp5rRkS58nUDgq3vaxNKJq+32LuuTuNjRrM57XoyBAVnBlfTP5IOQaxjYPNxHkZhYdYREyZKx96g6FZUWLQxKO+vP+E25MXSsnP8FMkQNfgSvMCxfIyFO3aVbDUme6bIScPNCTzKVWSWTj5Zyyig9VQpoRJ5wKBgQDfWlF7krUefQEvdJFxd9IGBvlkWkGi942Hh0H6vJCzhMQO8DeHZjO4oiiCEpRmBdkLDlZs81mykmyFEpjcmv4JD23HQ9IPi0/4Bsuu3SDXF4HC5/QYldaG0behBmMmDYuaQ0NHY5rpCnpZBteYT6V6lcBm/AIKwvz+N8fY2fDCKwKBgQDfBCjQw+SrMc8FI16Br7+KhsR7UuahEBt7LIiXfvom98//TuleafhuMWjBW9ujFIFXeHDLHWFQFFXdWO7HJVi33yPQQxGxcc5q0rUCLDPQga1Kcw8+R0Z5a4uu4olgQQKOepk+HB+obkmvOfb1HTaIaWu3jRawDk4cT50H8x/0hwKBgB63eB9LhNclj+Ur3djCBsNHcELp2r8D1pX99wf5qNjXeHMpfCmF17UbsAB7d6c0RK4tkZs4OGzDkGMYtKcaNbefRJSz8g6rNRtCK/7ncF3EYNciOUKsUK2H5/4gN8CC+mEDwRvvSd2k0ECwHTRYN8TNFYHURJ+gQ1Te7QAYsPCzAoGBAMZnbAY1Q/gK11JaPE2orFb1IltDRKB2IXh5Ton0ZCqhmOhMLQ+4t7DLPUKdXlsBZa/IIm5XehBg6VajbG0zulKLzO4YHuWEduwYON+4DNQxLWhBCBauOZ7+dcGUvYkeKoySYs6hznV9mlMHe1TuhCO8zHjpvBXOrlAR8VX5BXKz-----END PRIVATE KEY-----"
    11) "state"
    12) "0"
    13) "operation"
    14) "config.view"
    15) "content"
    16) "{\"device_id\": \"12345\",\"secure_connection\": true,\"sensor_config\": {\"temperature\": true,\"humidity\": true,\"pressure\": false}}"
    17) "owner"
    18) "b2972472-c93c-408f-9b77-0f8a81ee47af"
    19) "occurred_at"
    20) "1693339152105496336"
```

### Configuration remove event

Whenever configuration is removed, `bootstrap` service will generate and publish new `remove` event. This event will have the following format:

```redis
1) "1693339203771-0"
2) 1) "occurred_at"
    2) "1693339203771705590"
    3) "thing_id"
    4) "853f37b9-513a-41a2-a575-bbaa746961a6"
    5) "operation"
    6) "config.remove"
```

### Configuration remove handler

Whenever a thing is removed, `bootstrap` service will generate and publish new `config.remove_handler` event. This event will have the following format:

```redis
1) 1) "1693337955655-0"
2) 1) "config_id"
    2) "0198b458-573e-415a-aa05-052ddab9709d"
    3) "operation"
    4) "config.remove_handler"
    5) "occurred_at"
    6) "1693337955654969489"
```

### Thing bootstrap event

Whenever thing is bootstrapped, `bootstrap` service will generate and publish new `bootstrap` event. This event will have the following format:

```redis
1) 1) "1693339161600-0"
2)  1) "occurred_at"
    2) "1693339161600369325"
    3) "external_id"
    4) "FF-41-EF-BC-90-BC"
    5) "success"
    6) "1"
    7) "operation"
    8) "thing.bootstrap"
    9) "thing_id"
    10) "74f00d13-d370-42c0-b528-04fff995275c"
    11) "content"
    12) "{\"device_id\": \"12345\",\"secure_connection\": true,\"sensor_config\": {\"temperature\": true,\"humidity\": true,\"pressure\": false}}"
    13) "owner"
    14) "b2972472-c93c-408f-9b77-0f8a81ee47af"
    15) "name"
    16) "demo"
    17) "channels"
    18) "[90aae157-d47f-4d71-9a68-b000c0025ae8]"
    19) "ca_cert"
    20) "-----BEGIN PRIVATE KEY-----MIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDVYaZsyd76aSWZexY/OyX8hVdE+ruT3OZrE6gFSjDiaAA2Uf5/eHT1BJdR4LviooXix8vfc/g5CAN/z98zmUmAzx9lk5T4sRhJfqYQ2yDEt1tVDwD3RzL9RHXRWiZu4thk253jOpT15VFvOf5wE6mhVozFl9OetVJb4eqKbHx9RY0rMXwiBiCC2LcUtcp6rVjp4pK6VGjehA8siVX9bnRsIY776jDb/pm2n+y5G+bd1CifSdgTrr7QLKFlx0//5lyslmfUbf76kg9bZ8Qe2NdFKvcpEZ4ENxtwMrqW2i1pTExVHNpka8rhA5936qpDKu1ce+kccIbFsPRAHU5PyXfNAgMBAAECggEAAtBt4c4WcGuwlkHxp4B/3hZix0Md9DOb9QTmWLjYxN5QRRHMbyFHPEVaOuHhjc9M6r0YgD2cTsw/QjvwmqfxOI9YFP6JnsS0faD7pF9EzbNes1QmVByOnJkpi0r1aiL4baQZL0+sz+1n/IqMQ4LO4D+ETcV/LKmsM2VbCDD+wfwsVkTmgaqKtXIFQ3bOU5LjRcxCZFs81z3mYDyP4hfnlmTWOOXcf8yLqx5LGH8erCGXgrhZiN5/mhkzUpkF75Eo4qt3jVZEt+d48RnPsk0TO0rqs4j5F3d/6Dboi3UpRlHZ4vEM7MeDGoMuXTh59MzbV1e/03sY2jTtB2NVQ51pFQKBgQD0kjYorDqu5e82Orp5rRkS58nUDgq3vaxNKJq+32LuuTuNjRrM57XoyBAVnBlfTP5IOQaxjYPNxHkZhYdYREyZKx96g6FZUWLQxKO+vP+E25MXSsnP8FMkQNfgSvMCxfIyFO3aVbDUme6bIScPNCTzKVWSWTj5Zyyig9VQpoRJ5wKBgQDfWlF7krUefQEvdJFxd9IGBvlkWkGi942Hh0H6vJCzhMQO8DeHZjO4oiiCEpRmBdkLDlZs81mykmyFEpjcmv4JD23HQ9IPi0/4Bsuu3SDXF4HC5/QYldaG0behBmMmDYuaQ0NHY5rpCnpZBteYT6V6lcBm/AIKwvz+N8fY2fDCKwKBgQDfBCjQw+SrMc8FI16Br7+KhsR7UuahEBt7LIiXfvom98//TuleafhuMWjBW9ujFIFXeHDLHWFQFFXdWO7HJVi33yPQQxGxcc5q0rUCLDPQga1Kcw8+R0Z5a4uu4olgQQKOepk+HB+obkmvOfb1HTaIaWu3jRawDk4cT50H8x/0hwKBgB63eB9LhNclj+Ur3djCBsNHcELp2r8D1pX99wf5qNjXeHMpfCmF17UbsAB7d6c0RK4tkZs4OGzDkGMYtKcaNbefRJSz8g6rNRtCK/7ncF3EYNciOUKsUK2H5/4gN8CC+mEDwRvvSd2k0ECwHTRYN8TNFYHURJ+gQ1Te7QAYsPCzAoGBAMZnbAY1Q/gK11JaPE2orFb1IltDRKB2IXh5Ton0ZCqhmOhMLQ+4t7DLPUKdXlsBZa/IIm5XehBg6VajbG0zulKLzO4YHuWEduwYON+4DNQxLWhBCBauOZ7+dcGUvYkeKoySYs6hznV9mlMHe1TuhCO8zHjpvBXOrlAR8VX5BXKz-----END PRIVATE KEY-----"

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

### Channel update handler event

Whenever channel is updated, `bootstrap` service will generate and publish new `update handler` event. This event will have the following format:

```redis
1) "1693339403536-0"
2)  1) "operation"
    2) "channel.update_handler"
    3) "channel_id"
    4) "0e602731-36ba-4a29-adba-e5761f356158"
    5) "name"
    6) "dry-sky"
    7) "metadata"
    8) "{\"log\":\"info\"}"
    9) "occurred_at"
    10) "1693339403536636387"
```

### Channel remove handler event

Whenever channel is removed, `bootstrap` service will generate and publish new `remove handler` event. This event will have the following format:

```redis
1) "1693339468719-0"
2) 1) "config_id"
    2) "0198b458-573e-415a-aa05-052ddab9709d"
    3) "operation"
    4) "config.remove_handler"
    5) "occurred_at"
    6) "1693339468719177463"
```

## MQTT Adapter

Instead of using heartbeat to know when client is connected through MQTT adapter one can fetch events from Redis Streams that MQTT adapter publishes. MQTT adapter publishes events every time client connects and disconnects to stream named `mainflux.mqtt`.

Events that are coming from MQTT adapter have following fields:

- `thing_id` ID of a thing that has connected to MQTT adapter,
- `event_type` can have two possible values, connect and disconnect,
- `instance` represents MQTT adapter instance.
- `occurred_at` is in Epoch UNIX Time Stamp format.

If you want to integrate through [docker-compose.yml][mf-docker-compose] you can use `mainflux-es-redis` service. Just connect to it and consume events from Redis Stream named `mainflux.mqtt`.

Example of connect event:

```redis
1) 1) "1693312937469-0"
2) 1) "thing_id"
    1) "76a58221-e319-492a-be3e-b3d15631e92a"
    2) "event_type"
    3) "connect"
    4) "instance"
    5) ""
    6) "occurred_at"
    7) "1693312937469719069"
```

Example of disconnect event:

```redis
1) 1) "1693312937471-0"
2) 1) "thing_id"
    2) "76a58221-e319-492a-be3e-b3d15631e92a"
    3) "event_type"
    4) "disconnect"
    5) "instance"
    6) ""
    7) "occurred_at"
    8) "1693312937471064150"
```

[redis-streams]: https://redis.io/topics/streams-intro
[mf-docker-compose]: https://github.com/absmach/magistrala/blob/master/docker/docker-compose.yml
[bootstrap-docker-compose]: https://github.com/absmach/magistrala/blob/master/docker/addons/bootstrap/docker-compose.yml
