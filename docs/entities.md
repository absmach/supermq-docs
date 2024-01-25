# Entities

Client is a component that will replace and unify the Magistrala Things and Users services. The purpose is to represent generic client accounts. Each client is identified using its identity and secret. The client will differ from Things service to Users service but we aim to achieve 1:1 implementation between the clients whilst changing how client secret works. This includes client secret generation, usage, modification and storage

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

Currently, we have the things service and the users service as 2 deployments of the client entity. The things service is used to create, read, update, and delete things. The users service is used to create, read, update, and delete users. The client entity will be used to replace the things and users services. The client entity can be serialized to and from JSON format for communication with other services.

## Users service

For grouping Magistrala entities there are `groups` object in the `users` service. The users groups can be used for grouping `users` only. Groups are organized like a tree, group can have one parent and children. Group with no parent is root of the tree.

### Users

- The API endpoint for interacting with users are described in the [users API][users-api].
- The CLI for interacting with users are described in the [users CLI][users-cli].

### Groups

- The API endpoint for interacting with groups are described in the [groups API][groups-api].
- The CLI for interacting with groups are described in the [groups CLI][groups-cli].

## Things service

### Things

- The API endpoint for interacting with things are described in the [things API][things-api].
- The CLI for interacting with things are described in the [things CLI][things-cli].

### Channels

- The API endpoint for interacting with channels are described in the [channels API][channels-api].
- The CLI for interacting with channels are described in the [channels CLI][channels-cli].

[users-api]: /api/#users
[groups-api]: /api/#groups
[things-api]: /api/#things
[channels-api]: /api/#channels
[users-cli]: /cli/#users-management
[groups-cli]: /cli/#groups-management
[things-cli]: /cli/#things-management
[channels-cli]: /cli/#channels-management
