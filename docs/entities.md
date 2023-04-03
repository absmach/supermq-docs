# Clients

The Clients service is a component that will replace and unify the Mainflux Things and Users services. The purpose of this service is to represent generic client accounts. Each client is identified using its identity and secret. The client will differ from Things service to Users service but we aim to achieve 1:1 implementation between the clients whilst changing how client secret works. This includes client secret generation, usage, modification and storage

## Generic Client Entity

The client entity is represented by the Client struct in Go. The fields of this struct are as follows:

```golang
// Credentials represent client credentials: it is
// "identity" which can be a username, email, or generated name;
// and "secret" which can be a password, secret key or access token.
type Credentials struct {
    Identity string `json:"identity"` // username or generated login ID
    Secret   string `json:"secret"`   // password or token
}

// Client represents a generic Client account.
// Each client is identified using its identity and secret
type Client struct {
    ID          string      `json:"id"`
    Name        string      `json:"name,omitempty"`
    Tags        []string    `json:"tags,omitempty"` // tags related to the client
    Owner       string      `json:"owner,omitempty"`
    Credentials Credentials `json:"credentials"`
    Metadata    Metadata    `json:"metadata,omitempty"` // metadata used for customized describing of the client
    CreatedAt   time.Time   `json:"created_at"`
    UpdatedAt   time.Time   `json:"updated_at"`
    Status      Status      `json:"status"`         // status for the client which can be either 1 for enabled, 0 for disabled
    Role        Role        `json:"role,omitempty"` // role of the client which can be either 1 for admin, 0 for the user
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
- `Status` is a field that represents the status for the client. It can be either 1 for enabled or 0 for disabled.
- `Role` is an optional field that represents the role of the client. It can be either 1 for admin or 0 for the user.

## Usage

The Clients service can be used to create, read, update, and delete client accounts. The service provides an API that can be used to interact with the client entities. The client entity can be serialized to and from JSON format for communication with other services.

## Users service

For grouping Mainflux entities there are `groups` object in the `auth` service. Grouping of entities can be done for `things` and `users` but additionally you can use `groups` for grouping some external entities as well. Groups are organized like a tree, group can have one parent and children. Group with no parent is root of the tree.

### Create a user

```bash
curl -isSX POST 'http://localhost:8180/users' -H 'Content-Type: application/json' -H 'Accept: application/json' --data-raw '{"credentials": {"identity": "example@mainflux.com", "secret": "12345678"}, "name": "example user", "tags": ["tag"], "metadata": {}, "status": "enabled"}'
```

Response

```bash
HTTP/1.1 201 Created
Server: nginx/1.23.3
Date: Mon, 03 Apr 2023 13:13:13 GMT
Content-Type: application/json
Content-Length: 250
Connection: keep-alive
Location: /users/adf0a03d-4832-4e25-a4e7-d14e6fd2653b
Access-Control-Expose-Headers: Location

{"id":"adf0a03d-4832-4e25-a4e7-d14e6fd2653b","name":"example user","tags":["tag"],"credentials":{"identity":"example@mainflux.com","secret":""},"created_at":"2023-04-03T13:13:13.873058Z","updated_at":"2023-04-03T13:13:13.873058Z","status":"enabled"}
```

### Fetch a user

```bash
curl -ssX GET 'http://localhost:8180/users/e6f8c485-c993-4518-81bd-d12de1a371e3' -H 'Accept: application/json' -H 'Authorization: Bearer $USER_TOKEN'
```

Response

```bash
HTTP/1.1 200 OK
Server: nginx/1.23.3
Date: Mon, 03 Apr 2023 19:24:13 GMT
Content-Type: application/json
Content-Length: 310
Connection: keep-alive
Access-Control-Expose-Headers: Location

{"id":"e6f8c485-c993-4518-81bd-d12de1a371e3","name":"example user","tags":["tag"],"credentials":{"identity":"example@mainflux.com","secret":"$2a$10$8jP4lZjDZlVBwUU2JIGOPeeGeQ.RoPuw9eCQ0aVb.BmR0sLggQh1q"},"created_at":"2023-04-03T19:21:29.064658Z","updated_at":"2023-04-03T19:21:29.064658Z","status":"enabled"}
```

### Update a user

```bash
curl -isSX PATCH 'http://localhost:8180/users/e6f8c485-c993-4518-81bd-d12de1a371e3' -H 'Content-Type: application/json' -H 'Accept: application/json' -H 'Authorization: Bearer $USER_TOKEN' -d '{"name": "newname", "metadata": {"updated": "metadata update"}}'
```

Response

```bash
HTTP/1.1 200 OK
Server: nginx/1.23.3
Date: Mon, 03 Apr 2023 19:27:26 GMT
Content-Type: application/json
Content-Length: 286
Connection: keep-alive
Access-Control-Expose-Headers: Location

{"id":"e6f8c485-c993-4518-81bd-d12de1a371e3","name":"newname","tags":["tag"],"credentials":{"identity":"example@mainflux.com","secret":""},"metadata":{"updated":"metadata update"},"created_at":"2023-04-03T19:21:29.064658Z","updated_at":"2023-04-03T19:27:26.747974Z","status":"enabled"}
```

### Disable a user

```bash
curl -isSX POST 'http://localhost:8180/users/e6f8c485-c993-4518-81bd-d12de1a371e3/disable' -H 'Content-Type: application/json' -H 'Accept: application/json' -H 'Authorization: Bearer $USER_TOKEN'
```

Response

```bash
HTTP/1.1 200 OK
Server: nginx/1.23.3
Date: Mon, 03 Apr 2023 19:29:44 GMT
Content-Type: application/json
Content-Length: 287
Connection: keep-alive
Access-Control-Expose-Headers: Location

{"id":"e6f8c485-c993-4518-81bd-d12de1a371e3","name":"newname","tags":["tag"],"credentials":{"identity":"example@mainflux.com","secret":""},"metadata":{"updated":"metadata update"},"created_at":"2023-04-03T19:21:29.064658Z","updated_at":"2023-04-03T19:27:26.747974Z","status":"disabled"}
```

### Create a group

```bash
curl -isSX POST 'http://localhost:8180/groups' -H 'Content-Type: application/json' -H 'Accept: application/json' -H 'Authorization: Bearer $USER_TOKEN' -d '{"name": "newgroup", "description": "new group", "metadata": {},"status": "enabled"}'
```

Response

```bash
HTTP/1.1 201 Created
Server: nginx/1.23.3
Date: Mon, 03 Apr 2023 19:32:17 GMT
Content-Type: application/json
Content-Length: 245
Connection: keep-alive
Location: /groups/f9904878-86d8-47e1-91b2-f134161b8c30
Access-Control-Expose-Headers: Location

{"id":"f9904878-86d8-47e1-91b2-f134161b8c30","owner_id":"e6f8c485-c993-4518-81bd-d12de1a371e3","name":"newgroup","description":"new group","created_at":"2023-04-03T19:32:17.977839Z","updated_at":"2023-04-03T19:32:17.977839Z","status":"enabled"}
```

### Fetch a group

```bash
curl -isSX GET 'http://localhost:8180/groups/f9904878-86d8-47e1-91b2-f134161b8c30' -H 'Accept: application/json' -H 'Authorization: Bearer $USER_TOKEN'
```

Response

```bash
HTTP/1.1 200 OK
Server: nginx/1.23.3
Date: Mon, 03 Apr 2023 19:41:20 GMT
Content-Type: application/json
Content-Length: 245
Connection: keep-alive
Access-Control-Expose-Headers: Location

{"id":"f9904878-86d8-47e1-91b2-f134161b8c30","owner_id":"e6f8c485-c993-4518-81bd-d12de1a371e3","name":"newgroup","description":"new group","created_at":"2023-04-03T19:32:17.977839Z","updated_at":"2023-04-03T19:32:17.977839Z","status":"enabled"}
```

### Update a group

```bash
curl -X PUT 'http://localhost:8180/groups/f9904878-86d8-47e1-91b2-f134161b8c30' -H 'Content-Type: application/json' -H 'Accept: application/json' -H 'Authorization: Bearer $USER_TOKEN' -d '{"name": "new name", "metadata": {"isActive": false, "age": 40, "address": "701 Harbor Lane, Sheatown, Minnesota, 3159"}, "description": "new group description"}'
```

Response

```bash
HTTP/1.1 200 OK
Server: nginx/1.23.3
Date: Mon, 03 Apr 2023 19:43:17 GMT
Content-Type: application/json
Content-Length: 350
Connection: keep-alive
Access-Control-Expose-Headers: Location

{"id":"f9904878-86d8-47e1-91b2-f134161b8c30","owner_id":"e6f8c485-c993-4518-81bd-d12de1a371e3","name":"new name","description":"new group description","metadata":{"address":"701 Harbor Lane, Sheatown, Minnesota, 3159","age":40,"isActive":false},"created_at":"2023-04-03T19:32:17.977839Z","updated_at":"2023-04-03T19:43:17.34955Z","status":"enabled"}
```

### Disable a group

```bash
curl -isSX POST 'http://localhost:8180/groups/f9904878-86d8-47e1-91b2-f134161b8c30/disable' -H 'Content-Type: application/json' -H 'Accept: application/json' -H 'Authorization: Bearer $USER_TOKEN'
```

Response

```bash
HTTP/1.1 200 OK
Server: nginx/1.23.3
Date: Mon, 03 Apr 2023 19:45:15 GMT
Content-Type: application/json
Content-Length: 351
Connection: keep-alive
Access-Control-Expose-Headers: Location

{"id":"f9904878-86d8-47e1-91b2-f134161b8c30","owner_id":"e6f8c485-c993-4518-81bd-d12de1a371e3","name":"new name","description":"new group description","metadata":{"address":"701 Harbor Lane, Sheatown, Minnesota, 3159","age":40,"isActive":false},"created_at":"2023-04-03T19:32:17.977839Z","updated_at":"2023-04-03T19:43:17.34955Z","status":"disabled"}

```

### Connect user to group

```bash
curl -isSX POST 'http://localhost:8180/policies' -H 'Content-Type: application/json' -H 'Accept: application/json' -H 'Authorization: Bearer $USER_TOKEN' -d '{"subject": "e6f8c485-c993-4518-81bd-d12de1a371e3", "object": "f9904878-86d8-47e1-91b2-f134161b8c30", "actions": ["c_list", "g_list"]}'
```

Response

```bash
HTTP/1.1 201 Created
Server: nginx/1.23.3
Date: Mon, 03 Apr 2023 19:46:37 GMT
Content-Type: application/json
Content-Length: 0
Connection: keep-alive
Access-Control-Expose-Headers: Location
```

### List members of a group

```bash
curl -isSX GET 'http://localhost:8180/groups/f9904878-86d8-47e1-91b2-f134161b8c30/members' -H 'Accept: application/json' -H 'Authorization: Bearer $USER_TOKEN'
```

Response

```bash
HTTP/1.1 200 OK
Server: nginx/1.23.3
Date: Mon, 03 Apr 2023 19:49:53 GMT
Content-Type: application/json
Content-Length: 314
Connection: keep-alive
Access-Control-Expose-Headers: Location

{"limit":10,"total":1,"members":[{"id":"e6f8c485-c993-4518-81bd-d12de1a371e3","name":"newname","tags":["tag"],"credentials":{"identity":"example@mainflux.com","secret":""},"metadata":{"updated":"metadata update"},"created_at":"2023-04-03T19:21:29.064658Z","updated_at":"0001-01-01T00:00:00Z","status":"enabled"}]}
```

### List memberships of a group

```bash
curl -isSX GET 'http://localhost:8180/users/e6f8c485-c993-4518-81bd-d12de1a371e3/memberships' -H 'Accept: application/json' -H 'Authorization: Bearer $USER_TOKEN'
```

Response

```bash
HTTP/1.1 200 OK
Server: nginx/1.23.3
Date: Mon, 03 Apr 2023 19:50:56 GMT
Content-Type: application/json
Content-Length: 378
Connection: keep-alive
Access-Control-Expose-Headers: Location

{"total":1,"memberships":[{"id":"f9904878-86d8-47e1-91b2-f134161b8c30","owner_id":"e6f8c485-c993-4518-81bd-d12de1a371e3","name":"new name","description":"new group description","metadata":{"address":"701 Harbor Lane, Sheatown, Minnesota, 3159","age":40,"isActive":false},"created_at":"2023-04-03T19:32:17.977839Z","updated_at":"2023-04-03T19:43:17.34955Z","status":"enabled"}]}
```

### Disconnect user from a group

```bash
curl -isSX DELETE 'http://localhost:8180/policies/f9904878-86d8-47e1-91b2-f134161b8c30/e6f8c485-c993-4518-81bd-d12de1a371e3' -H 'Accept: application/json' -H 'Authorization: Bearer $USER_TOKEN'
```

Response

```bash
HTTP/1.1 204 No Content
Server: nginx/1.23.3
Date: Mon, 03 Apr 2023 19:52:08 GMT
Content-Type: application/json
Content-Length: 378
Connection: keep-alive
Access-Control-Expose-Headers: Location
```

## Things service

### Create a thing

```bash
curl -isSX POST 'http://localhost/things' -H 'Content-Type: application/json' -H 'Accept: application/json' -H 'Authorization: Bearer $USER_TOKEN' -d '{"name": "new thing", "tags": ["tag"], "metadata": {}, "status": "enabled"}'
```

Response

```bash
HTTP/1.1 201 Created
Server: nginx/1.23.3
Date: Mon, 03 Apr 2023 20:12:47 GMT
Content-Type: application/json
Content-Length: 302
Connection: keep-alive
Location: /things/5b4eb2bd-4b63-4b74-86fd-0ebd411454fc
Access-Control-Expose-Headers: Location

{"id":"5b4eb2bd-4b63-4b74-86fd-0ebd411454fc","name":"new thing","tags":["tag"],"owner":"e6f8c485-c993-4518-81bd-d12de1a371e3","credentials":{"secret":"06c1d538-124c-4da5-ad3d-43a05e1fdb41"},"created_at":"2023-04-03T20:12:47.486442525Z","updated_at":"2023-04-03T20:12:47.486442525Z","status":"enabled"}
```

### Fetch a thing

```bash
curl -isSX GET 'http://localhost/things/5b4eb2bd-4b63-4b74-86fd-0ebd411454fc' -H 'Accept: application/json' -H 'Authorization: Bearer $USER_TOKEN'
```

Response

```bash
HTTP/1.1 200 OK
Server: nginx/1.23.3
Date: Mon, 03 Apr 2023 20:13:36 GMT
Content-Type: application/json
Content-Length: 296
Connection: keep-alive
Access-Control-Expose-Headers: Location

{"id":"5b4eb2bd-4b63-4b74-86fd-0ebd411454fc","name":"new thing","tags":["tag"],"owner":"e6f8c485-c993-4518-81bd-d12de1a371e3","credentials":{"secret":"06c1d538-124c-4da5-ad3d-43a05e1fdb41"},"created_at":"2023-04-03T20:12:47.486442Z","updated_at":"2023-04-03T20:12:47.486442Z","status":"enabled"}
```

### Update a thing

```bash
curl -isSX PATCH 'http://localhost/things/5b4eb2bd-4b63-4b74-86fd-0ebd411454fc' -H 'Content-Type: application/json' -H 'Accept: application/json' -H 'Authorization: Bearer $USER_TOKEN' -d '{"name": "newname", "metadata": {"name": "Stephenson Rasmussen", "address": "614 Winthrop Street, Saticoy, Virgin Islands, 2106", "latitude": -21.137186, "longitude": 167.43566}}'
```

Response

```bash
HTTP/1.1 200 OK
Server: nginx/1.23.3
Date: Mon, 03 Apr 2023 20:14:23 GMT
Content-Type: application/json
Content-Length: 444
Connection: keep-alive
Access-Control-Expose-Headers: Location

{"id":"5b4eb2bd-4b63-4b74-86fd-0ebd411454fc","name":"newname","tags":["tag"],"owner":"e6f8c485-c993-4518-81bd-d12de1a371e3","credentials":{"secret":"06c1d538-124c-4da5-ad3d-43a05e1fdb41"},"metadata":{"address":"614 Winthrop Street, Saticoy, Virgin Islands, 2106","latitude":-21.137186,"longitude":167.43566,"name":"Stephenson Rasmussen"},"created_at":"2023-04-03T20:12:47.486442Z","updated_at":"2023-04-03T20:14:23.195651Z","status":"enabled"}

```

### Disable a thing

```bash
curl -isSX POST 'http://localhost/things/5b4eb2bd-4b63-4b74-86fd-0ebd411454fc/disable' -H 'Accept: application/json' -H 'Authorization: Bearer $USER_TOKEN'
```

Response

```bash
HTTP/1.1 200 OK
Server: nginx/1.23.3
Date: Mon, 03 Apr 2023 20:15:01 GMT
Content-Type: application/json
Content-Length: 445
Connection: keep-alive
Access-Control-Expose-Headers: Location

{"id":"5b4eb2bd-4b63-4b74-86fd-0ebd411454fc","name":"newname","tags":["tag"],"owner":"e6f8c485-c993-4518-81bd-d12de1a371e3","credentials":{"secret":"06c1d538-124c-4da5-ad3d-43a05e1fdb41"},"metadata":{"address":"614 Winthrop Street, Saticoy, Virgin Islands, 2106","latitude":-21.137186,"longitude":167.43566,"name":"Stephenson Rasmussen"},"created_at":"2023-04-03T20:12:47.486442Z","updated_at":"2023-04-03T20:14:23.195651Z","status":"disabled"}
```

### Create a channel

```bash
curl -isSX POST 'http://localhost/channels' -H 'Content-Type: application/json' -H 'Accept: application/json' -H 'Authorization: Bearer $USER_TOKEN' -d '{"name": "new channel", "description": "new channel description", "metadata": {}, "status": "enabled"}'
```

Response

```bash
HTTP/1.1 201 Created
Server: nginx/1.23.3
Date: Mon, 03 Apr 2023 20:17:07 GMT
Content-Type: application/json
Content-Length: 280
Connection: keep-alive
Location: /channels/825b3571-6c39-4482-bceb-a863a4b9af34
Access-Control-Expose-Headers: Location

{"id":"825b3571-6c39-4482-bceb-a863a4b9af34","owner_id":"e6f8c485-c993-4518-81bd-d12de1a371e3","name":"new channel","description":"new channel description","level":0,"path":"","created_at":"2023-04-03T20:17:07.48832Z","updated_at":"2023-04-03T20:17:07.48832Z","status":"enabled"}

```

### Fetch a channel

```bash
curl -isSX GET 'http://localhost/channels/825b3571-6c39-4482-bceb-a863a4b9af34' -H 'Accept: application/json' -H 'Authorization: Bearer $USER_TOKEN'
```

Response

```bash
HTTP/1.1 200 OK
Server: nginx/1.23.3
Date: Mon, 03 Apr 2023 20:17:48 GMT
Content-Type: application/json
Content-Length: 280
Connection: keep-alive
Access-Control-Expose-Headers: Location

{"id":"825b3571-6c39-4482-bceb-a863a4b9af34","owner_id":"e6f8c485-c993-4518-81bd-d12de1a371e3","name":"new channel","description":"new channel description","level":0,"path":"","created_at":"2023-04-03T20:17:07.48832Z","updated_at":"2023-04-03T20:17:07.48832Z","status":"enabled"}

```

### Update a channel

```bash
curl -isSX PUT 'http://localhost/channels/825b3571-6c39-4482-bceb-a863a4b9af34' -H 'Content-Type: application/json' -H 'Accept: application/json' -H 'Authorization: Bearer $USER_TOKEN' -d '{"name": "new name", "metadata": {"updated": true}, "description": "new description"}'
```

Response

```bash
HTTP/1.1 200 OK
Server: nginx/1.23.3
Date: Mon, 03 Apr 2023 20:18:42 GMT
Content-Type: application/json
Content-Length: 298
Connection: keep-alive
Access-Control-Expose-Headers: Location

{"id":"825b3571-6c39-4482-bceb-a863a4b9af34","owner_id":"e6f8c485-c993-4518-81bd-d12de1a371e3","name":"new name","description":"new description","metadata":{"updated":true},"level":0,"path":"","created_at":"2023-04-03T20:17:07.48832Z","updated_at":"2023-04-03T20:18:42.854229Z","status":"enabled"}

```

### Disable a channel

```bash
curl -isSX POST 'http://localhost/channels/825b3571-6c39-4482-bceb-a863a4b9af34/disable' -H 'Accept: application/json' -H 'Authorization: Bearer $USER_TOKEN'
```

Response

```bash
HTTP/1.1 200 OK
Server: nginx/1.23.3
Date: Mon, 03 Apr 2023 20:19:25 GMT
Content-Type: application/json
Content-Length: 299
Connection: keep-alive
Access-Control-Expose-Headers: Location

{"id":"825b3571-6c39-4482-bceb-a863a4b9af34","owner_id":"e6f8c485-c993-4518-81bd-d12de1a371e3","name":"new name","description":"new description","metadata":{"updated":true},"level":0,"path":"","created_at":"2023-04-03T20:17:07.48832Z","updated_at":"2023-04-03T20:18:42.854229Z","status":"disabled"}
```

### Connect thing to a channel

```bash
curl -isSX POST 'http://localhost/channels/825b3571-6c39-4482-bceb-a863a4b9af34/things/5b4eb2bd-4b63-4b74-86fd-0ebd411454fc' -H 'Accept: application/json' -H 'Authorization: Bearer $USER_TOKEN'
```

Response

```bash
HTTP/1.1 201 Created
Server: nginx/1.23.3
Date: Mon, 03 Apr 2023 20:20:50 GMT
Content-Type: application/json
Content-Length: 266
Connection: keep-alive
Access-Control-Expose-Headers: Location

{"owner_id":"e6f8c485-c993-4518-81bd-d12de1a371e3","subject":"5b4eb2bd-4b63-4b74-86fd-0ebd411454fc","object":"825b3571-6c39-4482-bceb-a863a4b9af34","actions":["m_write","m_read"],"created_at":"2023-04-03T20:20:50.687803Z","updated_at":"2023-04-03T20:20:50.687803Z"}
```

### Disconnect thing from a channel

```bash
curl -isSX DELETE 'http://localhost/channels/825b3571-6c39-4482-bceb-a863a4b9af34/things/5b4eb2bd-4b63-4b74-86fd-0ebd411454fc' -H 'Accept: application/json' -H 'Authorization: Bearer $USER_TOKEN'
```

Response

```bash
HTTP/1.1 204 No Content
Server: nginx/1.23.3
Date: Mon, 03 Apr 2023 20:21:35 GMT
Content-Type: application/json
Connection: keep-alive
Access-Control-Expose-Headers: Location
```

### Fetching members of a channel

```bash
curl -isSX GET 'http://localhost/channels/825b3571-6c39-4482-bceb-a863a4b9af34/things' -H 'Accept: application/json' -H 'Authorization: Bearer $USER_TOKEN'
```

Response

```bash
HTTP/1.1 200 OK
Server: nginx/1.23.3
Date: Mon, 03 Apr 2023 20:25:52 GMT
Content-Type: application/json
Content-Length: 424
Connection: keep-alive
Access-Control-Expose-Headers: Location

{"limit":10,"total":1,"things":[{"id":"5b4eb2bd-4b63-4b74-86fd-0ebd411454fc","name":"newname","tags":["tag"],"credentials":{"secret":"06c1d538-124c-4da5-ad3d-43a05e1fdb41"},"metadata":{"address":"614 Winthrop Street, Saticoy, Virgin Islands, 2106","latitude":-21.137186,"longitude":167.43566,"name":"Stephenson Rasmussen"},"created_at":"2023-04-03T20:12:47.486442Z","updated_at":"0001-01-01T00:00:00Z","status":"enabled"}]}
```

### Fetching memberships of a thing

```bash
curl -isSX GET 'http://localhost/things/5b4eb2bd-4b63-4b74-86fd-0ebd411454fc/channels' -H 'Accept: application/json' -H 'Authorization: Bearer $USER_TOKEN'
```

Response

```bash
HTTP/1.1 200 OK
Server: nginx/1.23.3
Date: Mon, 03 Apr 2023 20:25:09 GMT
Content-Type: application/json
Content-Length: 323
Connection: keep-alive
Access-Control-Expose-Headers: Location

{"total":1,"channels":[{"id":"825b3571-6c39-4482-bceb-a863a4b9af34","owner_id":"e6f8c485-c993-4518-81bd-d12de1a371e3","name":"new name","description":"new description","metadata":{"updated":true},"level":0,"path":"","created_at":"2023-04-03T20:17:07.48832Z","updated_at":"2023-04-03T20:18:42.854229Z","status":"enabled"}]}
```
