# Clients

The Clients service is a component that will replace and unify the Mainflux Things and Users services. The purpose of this service is to represent generic client accounts. Each client is identified using its identity and secret. The client will differ from Things service to Users service but we aim to achieve 1:1 implementation between the clients whilst changing how client secret works. This includes client secret generation, usage, modification and storage

## Generic Client Entity

The client entity is represented by the Client struct in Go. The fields of this struct are as follows:

```golang
// Credentials represent client credentials: its
// "identity" which can be a username, email, generated name;
// and "secret" which can be a password or access token.
type Credentials struct {
  Identity string `json:"identity,omitempty"` // username or generated login ID
  Secret   string `json:"secret"`             // password or token
}

// Client represents generic Client.
type Client struct {
  ID          string      `json:"id"`
  Name        string      `json:"name,omitempty"`
  Tags        []string    `json:"tags,omitempty"`
  Owner       string      `json:"owner,omitempty"` // nullable
  Credentials Credentials `json:"credentials"`
  Metadata    Metadata    `json:"metadata,omitempty"`
  CreatedAt   time.Time   `json:"created_at"`
  UpdatedAt   time.Time   `json:"updated_at,omitempty"`
  UpdatedBy   string      `json:"updated_by,omitempty"`
  Status      Status      `json:"status"`         // 1 for enabled, 0 for disabled
  Role        Role        `json:"role,omitempty"` // 1 for admin, 0 for normal user
}
```

- `ID` is a unique identifier for each client. It is a string value.
- `Name` is an optional field that represents the name of the client.
- `Tags` is an optional field that represents the tags related to the client. It is a slice of string values.
- `Owner` is an optional field that represents the owner of the client.
- `Credentials` is a struct that represents the client credentials. It contains two fields:
  - `Identity` This is the identity of the client, which can be a username, email, or generated name.
  - `Secret` This is the secret of the client, which can be a password, secret key, or access token.
- `Metadata` is an optional field that is used for customized describing of the client.
- `CreatedAt` is a field that represents the time when the client was created. It is a time.Time value.
- `UpdatedAt` is a field that represents the time when the client was last updated. It is a time.Time value.
- `UpdatedBy` is a field that represents the user who last updated the client.
- `Status` is a field that represents the status for the client. It can be either 1 for enabled or 0 for disabled.
- `Role` is an optional field that represents the role of the client. It can be either 1 for admin or 0 for the user.

## Usage

The Clients service can be used to create, read, update, and delete client accounts. The service provides an API that can be used to interact with the client entities. The client entity can be serialized to and from JSON format for communication with other services.

## Users service

For grouping Mainflux entities there are `groups` object in the `auth` service. Grouping of entities can be done for `things` and `users` but additionally you can use `groups` for grouping some external entities as well. Groups are organized like a tree, group can have one parent and children. Group with no parent is root of the tree.

### Create a user

```bash
curl -isSX POST 'http://localhost/users' -H 'Content-Type: application/json' -H 'Accept: application/json' --data-raw '{"credentials": {"identity": "example@mainflux.com", "secret": "12345678"}, "name": "example user", "tags": ["tag"], "metadata": {}, "status": "enabled"}'
```

Response

```bash
HTTP/1.1 201 Created
Server: nginx/1.23.3
Date: Thu, 15 Jun 2023 11:32:49 GMT
Content-Type: application/json
Content-Length: 242
Connection: keep-alive
Location: /users/a97b5d58-7375-4343-987c-9c1a79fa65d2
Access-Control-Expose-Headers: Location

{
  "id": "a97b5d58-7375-4343-987c-9c1a79fa65d2",
  "name": "example user",
  "tags": ["tag"],
  "credentials": { "identity": "example@mainflux.com", "secret": "" },
  "created_at": "2023-06-15T11:32:49.85689Z",
  "updated_at": "0001-01-01T00:00:00Z",
  "status": "enabled"
}
```

### Fetch a user

```bash
curl -issX GET 'http://localhost/users/a97b5d58-7375-4343-987c-9c1a79fa65d2' -H 'Accept: application/json' -H "Authorization: Bearer $ADMIN_TOKEN"
```

Response

```bash
HTTP/1.1 200 OK
Server: nginx/1.23.3
Date: Thu, 15 Jun 2023 11:34:21 GMT
Content-Type: application/json
Content-Length: 302
Connection: keep-alive
Access-Control-Expose-Headers: Location

{
  "id": "a97b5d58-7375-4343-987c-9c1a79fa65d2",
  "name": "example user",
  "tags": ["tag"],
  "credentials": {
    "identity": "example@mainflux.com",
    "secret": "$2a$10$yN4c7xUnTb9DFoiqLOLuIOb44pfnKIWQfi8KpeKDw9QxctK/mB5FC"
  },
  "created_at": "2023-06-15T11:32:49.85689Z",
  "updated_at": "0001-01-01T00:00:00Z",
  "status": "enabled"
}
```

### Update a user

```bash
curl -isSX PATCH 'http://localhost/users/a97b5d58-7375-4343-987c-9c1a79fa65d2' -H 'Content-Type: application/json' -H 'Accept: application/json' -H "Authorization: Bearer $ADMIN_TOKEN" -d '{"name": "newname", "metadata": {"updated": "metadata update"}}'
```

Response

```bash
HTTP/1.1 200 OK
Server: nginx/1.23.3
Date: Thu, 15 Jun 2023 11:35:19 GMT
Content-Type: application/json
Content-Length: 337
Connection: keep-alive
Access-Control-Expose-Headers: Location

{
  "id": "a97b5d58-7375-4343-987c-9c1a79fa65d2",
  "name": "newname",
  "tags": ["tag"],
  "credentials": { "identity": "example@mainflux.com", "secret": "" },
  "metadata": { "updated": "metadata update" },
  "created_at": "2023-06-15T11:32:49.85689Z",
  "updated_at": "2023-06-15T11:35:19.283805Z",
  "updated_by": "532311a4-c13b-4061-b991-98dcae7a934e",
  "status": "enabled"
}
```

### Disable a user

```bash
curl -isSX POST 'http://localhost/users/a97b5d58-7375-4343-987c-9c1a79fa65d2/disable' -H 'Content-Type: application/json' -H 'Accept: application/json' -H "Authorization: Bearer $ADMIN_TOKEN"
```

Response

```bash
HTTP/1.1 200 OK
Server: nginx/1.23.3
Date: Thu, 15 Jun 2023 11:35:50 GMT
Content-Type: application/json
Content-Length: 338
Connection: keep-alive
Access-Control-Expose-Headers: Location

{
  "id": "a97b5d58-7375-4343-987c-9c1a79fa65d2",
  "name": "newname",
  "tags": ["tag"],
  "credentials": { "identity": "example@mainflux.com", "secret": "" },
  "metadata": { "updated": "metadata update" },
  "created_at": "2023-06-15T11:32:49.85689Z",
  "updated_at": "2023-06-15T11:35:19.283805Z",
  "updated_by": "532311a4-c13b-4061-b991-98dcae7a934e",
  "status": "disabled"
}
```

### Create a group

```bash
curl -isSX POST 'http://localhost/groups' -H 'Content-Type: application/json' -H 'Accept: application/json' -H "Authorization: Bearer $ADMIN_TOKEN" -d '{"name": "newgroup", "description": "new group", "metadata": {},"status": "enabled"}'
```

Response

```bash
HTTP/1.1 201 Created
Server: nginx/1.23.3
Date: Thu, 15 Jun 2023 11:36:42 GMT
Content-Type: application/json
Content-Length: 238
Connection: keep-alive
Location: /groups/b9b13722-bff4-45cf-96ac-c9ea634e1d15
Access-Control-Expose-Headers: Location

{
  "id": "b9b13722-bff4-45cf-96ac-c9ea634e1d15",
  "owner_id": "532311a4-c13b-4061-b991-98dcae7a934e",
  "name": "newgroup",
  "description": "new group",
  "created_at": "2023-06-15T11:36:42.696351Z",
  "updated_at": "0001-01-01T00:00:00Z",
  "status": "enabled"
}
```

### Fetch a group

```bash
curl -isSX GET 'http://localhost/groups/b9b13722-bff4-45cf-96ac-c9ea634e1d15' -H 'Accept: application/json' -H "Authorization: Bearer $ADMIN_TOKEN"
```

Response

```bash
HTTP/1.1 200 OK
Server: nginx/1.23.3
Date: Thu, 15 Jun 2023 11:41:49 GMT
Content-Type: application/json
Content-Length: 238
Connection: keep-alive
Access-Control-Expose-Headers: Location

{
  "id": "b9b13722-bff4-45cf-96ac-c9ea634e1d15",
  "owner_id": "532311a4-c13b-4061-b991-98dcae7a934e",
  "name": "newgroup",
  "description": "new group",
  "created_at": "2023-06-15T11:36:42.696351Z",
  "updated_at": "0001-01-01T00:00:00Z",
  "status": "enabled"
}
```

### Update a group

```bash
curl -isSX PUT 'http://localhost/groups/b9b13722-bff4-45cf-96ac-c9ea634e1d15' -H 'Content-Type: application/json' -H 'Accept: application/json' -H "Authorization: Bearer $ADMIN_TOKEN" -d '{"name": "new name", "metadata": {"isActive": false, "age": 40, "address": "701 Harbor Lane, Sheatown, Minnesota, 3159"}, "description": "new group description"}'
```

Response

```bash
HTTP/1.1 200 OK
Server: nginx/1.23.3
Date: Thu, 15 Jun 2023 11:42:30 GMT
Content-Type: application/json
Content-Length: 403
Connection: keep-alive
Access-Control-Expose-Headers: Location

{
  "id": "b9b13722-bff4-45cf-96ac-c9ea634e1d15",
  "owner_id": "532311a4-c13b-4061-b991-98dcae7a934e",
  "name": "new name",
  "description": "new group description",
  "metadata": {
    "address": "701 Harbor Lane, Sheatown, Minnesota, 3159",
    "age": 40,
    "isActive": false
  },
  "created_at": "2023-06-15T11:36:42.696351Z",
  "updated_at": "2023-06-15T11:42:30.978852Z",
  "updated_by": "532311a4-c13b-4061-b991-98dcae7a934e",
  "status": "enabled"
}
```

### Disable a group

```bash
curl -isSX POST 'http://localhost/groups/b9b13722-bff4-45cf-96ac-c9ea634e1d15/disable' -H 'Content-Type: application/json' -H 'Accept: application/json' -H "Authorization: Bearer $ADMIN_TOKEN"
```

Response

```bash
HTTP/1.1 200 OK
Server: nginx/1.23.3
Date: Thu, 15 Jun 2023 11:43:05 GMT
Content-Type: application/json
Content-Length: 404
Connection: keep-alive
Access-Control-Expose-Headers: Location

{
  "id": "b9b13722-bff4-45cf-96ac-c9ea634e1d15",
  "owner_id": "532311a4-c13b-4061-b991-98dcae7a934e",
  "name": "new name",
  "description": "new group description",
  "metadata": {
    "address": "701 Harbor Lane, Sheatown, Minnesota, 3159",
    "age": 40,
    "isActive": false
  },
  "created_at": "2023-06-15T11:36:42.696351Z",
  "updated_at": "2023-06-15T11:42:30.978852Z",
  "updated_by": "532311a4-c13b-4061-b991-98dcae7a934e",
  "status": "disabled"
}

```

### Connect user to group

```bash
curl -isSX POST 'http://localhost/policies' -H 'Content-Type: application/json' -H 'Accept: application/json' -H "Authorization: Bearer $ADMIN_TOKEN" -d '{"subject": "a97b5d58-7375-4343-987c-9c1a79fa65d2", "object": "b9b13722-bff4-45cf-96ac-c9ea634e1d15", "actions": ["c_list", "g_list"]}'
```

Response

```bash
HTTP/1.1 201 Created
Server: nginx/1.23.3
Date: Thu, 15 Jun 2023 11:43:52 GMT
Content-Type: application/json
Content-Length: 0
Connection: keep-alive
Access-Control-Expose-Headers: Location
```

### List members of a group

```bash
curl -isSX GET 'http://localhost/groups/b9b13722-bff4-45cf-96ac-c9ea634e1d15/members' -H 'Accept: application/json' -H "Authorization: Bearer $ADMIN_TOKEN"
```

Response

```bash
HTTP/1.1 200 OK
Server: nginx/1.23.3
Date: Thu, 15 Jun 2023 11:44:08 GMT
Content-Type: application/json
Content-Length: 320
Connection: keep-alive
Access-Control-Expose-Headers: Location

{
  "limit": 10,
  "total": 1,
  "members": [
    {
      "id": "a97b5d58-7375-4343-987c-9c1a79fa65d2",
      "name": "newname",
      "tags": ["tag"],
      "credentials": { "identity": "example@mainflux.com", "secret": "" },
      "metadata": { "updated": "metadata update" },
      "created_at": "2023-06-15T11:32:49.85689Z",
      "updated_at": "2023-06-15T11:35:19.283805Z",
      "status": "enabled"
    }
  ]
}
```

### List memberships of a group

```bash
curl -isSX GET 'http://localhost/users/a97b5d58-7375-4343-987c-9c1a79fa65d2/memberships' -H 'Accept: application/json' -H "Authorization: Bearer $ADMIN_TOKEN"
```

Response

```bash
HTTP/1.1 200 OK
Server: nginx/1.23.3
Date: Thu, 15 Jun 2023 11:44:35 GMT
Content-Type: application/json
Content-Length: 452
Connection: keep-alive
Access-Control-Expose-Headers: Location

{
  "limit": 0,
  "offset": 0,
  "total": 1,
  "memberships": [
    {
      "id": "b9b13722-bff4-45cf-96ac-c9ea634e1d15",
      "owner_id": "532311a4-c13b-4061-b991-98dcae7a934e",
      "name": "new name",
      "description": "new group description",
      "metadata": {
        "address": "701 Harbor Lane, Sheatown, Minnesota, 3159",
        "age": 40,
        "isActive": false
      },
      "created_at": "2023-06-15T11:36:42.696351Z",
      "updated_at": "2023-06-15T11:42:30.978852Z",
      "updated_by": "532311a4-c13b-4061-b991-98dcae7a934e",
      "status": "enabled"
    }
  ]
}
```

### Disconnect user from a group

```bash
curl -isSX DELETE 'http://localhost/policies/b9b13722-bff4-45cf-96ac-c9ea634e1d15/a97b5d58-7375-4343-987c-9c1a79fa65d2' -H 'Accept: application/json' -H "Authorization: Bearer $ADMIN_TOKEN"
```

Response

```bash
HTTP/1.1 204 No Content
Server: nginx/1.23.3
Date: Thu, 15 Jun 2023 11:45:02 GMT
Content-Type: application/json
Connection: keep-alive
Access-Control-Expose-Headers: Location
```

## Things service

### Create a thing

```bash
curl -isSX POST 'http://localhost/things' -H 'Content-Type: application/json' -H 'Accept: application/json' -H "Authorization: Bearer $ADMIN_TOKEN" -d '{"name": "new thing", "tags": ["tag"], "metadata": {}, "status": "enabled"}'
```

Response

```bash
HTTP/1.1 201 Created
Server: nginx/1.23.3
Date: Thu, 15 Jun 2023 11:45:28 GMT
Content-Type: application/json
Content-Length: 291
Connection: keep-alive
Location: /things/604320a4-9e5a-43fd-a8e0-4967ff7799c3
Access-Control-Expose-Headers: Location

{
  "id": "604320a4-9e5a-43fd-a8e0-4967ff7799c3",
  "name": "new thing",
  "tags": ["tag"],
  "owner": "532311a4-c13b-4061-b991-98dcae7a934e",
  "credentials": { "secret": "fa88572e-e79f-4c1b-a05b-5a7be919a979" },
  "created_at": "2023-06-15T11:45:28.85782811Z",
  "updated_at": "0001-01-01T00:00:00Z",
  "status": "enabled"
}
```

### Fetch a thing

```bash
curl -isSX GET 'http://localhost/things/604320a4-9e5a-43fd-a8e0-4967ff7799c3' -H 'Accept: application/json' -H "Authorization: Bearer $ADMIN_TOKEN"
```

Response

```bash
HTTP/1.1 200 OK
Server: nginx/1.23.3
Date: Thu, 15 Jun 2023 11:46:05 GMT
Content-Type: application/json
Content-Length: 289
Connection: keep-alive
Access-Control-Expose-Headers: Location

{
  "id": "604320a4-9e5a-43fd-a8e0-4967ff7799c3",
  "name": "new thing",
  "tags": ["tag"],
  "owner": "532311a4-c13b-4061-b991-98dcae7a934e",
  "credentials": { "secret": "fa88572e-e79f-4c1b-a05b-5a7be919a979" },
  "created_at": "2023-06-15T11:45:28.857828Z",
  "updated_at": "0001-01-01T00:00:00Z",
  "status": "enabled"
}
```

### Update a thing

```bash
curl -isSX PATCH 'http://localhost/things/604320a4-9e5a-43fd-a8e0-4967ff7799c3' -H 'Content-Type: application/json' -H 'Accept: application/json' -H "Authorization: Bearer $ADMIN_TOKEN" -d '{"name": "newname", "metadata": {"name": "Stephenson Rasmussen", "address": "614 Winthrop Street, Saticoy, Virgin Islands, 2106", "latitude": -21.137186, "longitude": 167.43566}}'
```

Response

```bash
HTTP/1.1 200 OK
Server: nginx/1.23.3
Date: Thu, 15 Jun 2023 11:46:35 GMT
Content-Type: application/json
Content-Length: 496
Connection: keep-alive
Access-Control-Expose-Headers: Location

{
  "id": "604320a4-9e5a-43fd-a8e0-4967ff7799c3",
  "name": "newname",
  "tags": ["tag"],
  "owner": "532311a4-c13b-4061-b991-98dcae7a934e",
  "credentials": { "secret": "fa88572e-e79f-4c1b-a05b-5a7be919a979" },
  "metadata": {
    "address": "614 Winthrop Street, Saticoy, Virgin Islands, 2106",
    "latitude": -21.137186,
    "longitude": 167.43566,
    "name": "Stephenson Rasmussen"
  },
  "created_at": "2023-06-15T11:45:28.857828Z",
  "updated_at": "2023-06-15T11:46:35.322466Z",
  "updated_by": "532311a4-c13b-4061-b991-98dcae7a934e",
  "status": "enabled"
}
```

### Disable a thing

```bash
curl -isSX POST 'http://localhost/things/604320a4-9e5a-43fd-a8e0-4967ff7799c3/disable' -H 'Accept: application/json' -H "Authorization: Bearer $ADMIN_TOKEN"
```

Response

```bash
HTTP/1.1 200 OK
Server: nginx/1.23.3
Date: Thu, 15 Jun 2023 11:47:10 GMT
Content-Type: application/json
Content-Length: 497
Connection: keep-alive
Access-Control-Expose-Headers: Location

{
  "id": "604320a4-9e5a-43fd-a8e0-4967ff7799c3",
  "name": "newname",
  "tags": ["tag"],
  "owner": "532311a4-c13b-4061-b991-98dcae7a934e",
  "credentials": { "secret": "fa88572e-e79f-4c1b-a05b-5a7be919a979" },
  "metadata": {
    "address": "614 Winthrop Street, Saticoy, Virgin Islands, 2106",
    "latitude": -21.137186,
    "longitude": 167.43566,
    "name": "Stephenson Rasmussen"
  },
  "created_at": "2023-06-15T11:45:28.857828Z",
  "updated_at": "2023-06-15T11:46:35.322466Z",
  "updated_by": "532311a4-c13b-4061-b991-98dcae7a934e",
  "status": "disabled"
}
```

### Create a channel

```bash
curl -isSX POST 'http://localhost/channels' -H 'Content-Type: application/json' -H 'Accept: application/json' -H "Authorization: Bearer $ADMIN_TOKEN" -d '{"name": "new channel", "description": "new channel description", "metadata": {}, "status": "enabled"}'
```

Response

```bash
HTTP/1.1 201 Created
Server: nginx/1.23.3
Date: Thu, 15 Jun 2023 11:47:50 GMT
Content-Type: application/json
Content-Length: 255
Connection: keep-alive
Location: /channels/0bcb5165-398f-4613-8ab9-8a3620213cc9
Access-Control-Expose-Headers: Location

{
  "id": "0bcb5165-398f-4613-8ab9-8a3620213cc9",
  "owner_id": "532311a4-c13b-4061-b991-98dcae7a934e",
  "name": "new channel",
  "description": "new channel description",
  "created_at": "2023-06-15T11:47:50.155894Z",
  "updated_at": "0001-01-01T00:00:00Z",
  "status": "enabled"
}
```

### Fetch a channel

```bash
curl -isSX GET 'http://localhost/channels/0bcb5165-398f-4613-8ab9-8a3620213cc9' -H 'Accept: application/json' -H "Authorization: Bearer $ADMIN_TOKEN"
```

Response

```bash
HTTP/1.1 200 OK
Server: nginx/1.23.3
Date: Thu, 15 Jun 2023 11:48:23 GMT
Content-Type: application/json
Content-Length: 255
Connection: keep-alive
Access-Control-Expose-Headers: Location

{
  "id": "0bcb5165-398f-4613-8ab9-8a3620213cc9",
  "owner_id": "532311a4-c13b-4061-b991-98dcae7a934e",
  "name": "new channel",
  "description": "new channel description",
  "created_at": "2023-06-15T11:47:50.155894Z",
  "updated_at": "0001-01-01T00:00:00Z",
  "status": "enabled"
}
```

### Update a channel

```bash
curl -isSX PUT 'http://localhost/channels/0bcb5165-398f-4613-8ab9-8a3620213cc9' -H 'Content-Type: application/json' -H 'Accept: application/json' -H "Authorization: Bearer $ADMIN_TOKEN" -d '{"name": "new name", "metadata": {"updated": true}, "description": "new description"}'
```

Response

```bash
HTTP/1.1 200 OK
Server: nginx/1.23.3
Date: Thu, 15 Jun 2023 11:48:49 GMT
Content-Type: application/json
Content-Length: 331
Connection: keep-alive
Access-Control-Expose-Headers: Location

{
  "id": "0bcb5165-398f-4613-8ab9-8a3620213cc9",
  "owner_id": "532311a4-c13b-4061-b991-98dcae7a934e",
  "name": "new name",
  "description": "new description",
  "metadata": { "updated": true },
  "created_at": "2023-06-15T11:47:50.155894Z",
  "updated_at": "2023-06-15T11:48:49.351445Z",
  "updated_by": "532311a4-c13b-4061-b991-98dcae7a934e",
  "status": "enabled"
}
```

### Disable a channel

```bash
curl -isSX POST 'http://localhost/channels/0bcb5165-398f-4613-8ab9-8a3620213cc9/disable' -H 'Accept: application/json' -H "Authorization: Bearer $ADMIN_TOKEN"
```

Response

```bash
HTTP/1.1 200 OK
Server: nginx/1.23.3
Date: Thu, 15 Jun 2023 11:49:36 GMT
Content-Type: application/json
Content-Length: 332
Connection: keep-alive
Access-Control-Expose-Headers: Location

{
  "id": "0bcb5165-398f-4613-8ab9-8a3620213cc9",
  "owner_id": "532311a4-c13b-4061-b991-98dcae7a934e",
  "name": "new name",
  "description": "new description",
  "metadata": { "updated": true },
  "created_at": "2023-06-15T11:47:50.155894Z",
  "updated_at": "2023-06-15T11:48:49.351445Z",
  "updated_by": "532311a4-c13b-4061-b991-98dcae7a934e",
  "status": "disabled"
}
```

### Connect thing to a channel

```bash
curl -isSX POST 'http://localhost/channels/0bcb5165-398f-4613-8ab9-8a3620213cc9/things/604320a4-9e5a-43fd-a8e0-4967ff7799c3' -H 'Accept: application/json' -H "Authorization: Bearer $ADMIN_TOKEN"
```

Response

```bash
HTTP/1.1 201 Created
Server: nginx/1.23.3
Date: Thu, 15 Jun 2023 11:50:32 GMT
Content-Type: application/json
Content-Length: 290
Connection: keep-alive
Access-Control-Expose-Headers: Location

{
  "policies": [
    {
      "owner_id": "532311a4-c13b-4061-b991-98dcae7a934e",
      "subject": "604320a4-9e5a-43fd-a8e0-4967ff7799c3",
      "object": "0bcb5165-398f-4613-8ab9-8a3620213cc9",
      "actions": ["m_write", "m_read"],
      "created_at": "2023-06-15T11:50:32.603772Z",
      "updated_at": "0001-01-01T00:00:00Z",
      "updated_by": ""
    }
  ]
}
```

### Disconnect thing from a channel

```bash
curl -isSX DELETE 'http://localhost/channels/0bcb5165-398f-4613-8ab9-8a3620213cc9/things/604320a4-9e5a-43fd-a8e0-4967ff7799c3' -H 'Accept: application/json' -H "Authorization: Bearer $ADMIN_TOKEN"
```

Response

```bash
HTTP/1.1 204 No Content
Server: nginx/1.23.3
Date: Thu, 15 Jun 2023 11:51:17 GMT
Content-Type: application/json
Connection: keep-alive
Access-Control-Expose-Headers: Location
```

### Fetching members of a channel

```bash
curl -isSX GET 'http://localhost/channels/0bcb5165-398f-4613-8ab9-8a3620213cc9/things' -H 'Accept: application/json' -H "Authorization: Bearer $ADMIN_TOKEN"
```

Response

```bash
HTTP/1.1 200 OK
Server: nginx/1.23.3
Date: Thu, 15 Jun 2023 11:52:00 GMT
Content-Type: application/json
Content-Length: 424
Connection: keep-alive
Access-Control-Expose-Headers: Location

{
  "limit": 10,
  "total": 1,
  "things": [
    {
      "id": "604320a4-9e5a-43fd-a8e0-4967ff7799c3",
      "name": "newname",
      "tags": ["tag"],
      "credentials": { "secret": "fa88572e-e79f-4c1b-a05b-5a7be919a979" },
      "metadata": {
        "address": "614 Winthrop Street, Saticoy, Virgin Islands, 2106",
        "latitude": -21.137186,
        "longitude": 167.43566,
        "name": "Stephenson Rasmussen"
      },
      "created_at": "2023-06-15T11:45:28.857828Z",
      "updated_at": "0001-01-01T00:00:00Z",
      "status": "enabled"
    }
  ]
}
```

### Fetching memberships of a thing

```bash
curl -isSX GET 'http://localhost/things/604320a4-9e5a-43fd-a8e0-4967ff7799c3/channels' -H 'Accept: application/json' -H "Authorization: Bearer $ADMIN_TOKEN"
```

Response

```bash
HTTP/1.1 200 OK
Server: nginx/1.23.3
Date: Thu, 15 Jun 2023 11:52:26 GMT
Content-Type: application/json
Content-Length: 356
Connection: keep-alive
Access-Control-Expose-Headers: Location

{
  "total": 1,
  "channels": [
    {
      "id": "0bcb5165-398f-4613-8ab9-8a3620213cc9",
      "owner_id": "532311a4-c13b-4061-b991-98dcae7a934e",
      "name": "new name",
      "description": "new description",
      "metadata": { "updated": true },
      "created_at": "2023-06-15T11:47:50.155894Z",
      "updated_at": "2023-06-15T11:48:49.351445Z",
      "updated_by": "532311a4-c13b-4061-b991-98dcae7a934e",
      "status": "enabled"
    }
  ]
}
```
