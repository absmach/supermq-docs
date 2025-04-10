---
title: Overview
---

SuperMQ operates with several key entities that define the structure and interactions within the system. This document provides an overview of these entities, explaining their attributes and how they interact.

## User

A **User** represents an individual interacting with the system. Each user has a unique **Username** and **Secret**. Users can have different roles and permissions, manage clients, and be assigned to domains or groups.
This User entity is structured in Go with specific fields:

```go
type User struct {
 ID             string      `json:"id"`
 FirstName      string      `json:"first_name,omitempty"`
 LastName       string      `json:"last_name,omitempty"`
 Tags           []string    `json:"tags,omitempty"`
 Metadata       Metadata    `json:"metadata,omitempty"`
 Status         Status      `json:"status"`                    // 0 for enabled, 1 for disabled
 Role           Role        `json:"role"`                      // 0 for normal user, 1 for admin
 ProfilePicture string      `json:"profile_picture,omitempty"` // profile picture URL
 Credentials    Credentials `json:"credentials,omitempty"`
 Permissions    []string    `json:"permissions,omitempty"`
 Email          string      `json:"email,omitempty"`
 CreatedAt      time.Time   `json:"created_at,omitempty"`
 UpdatedAt      time.Time   `json:"updated_at,omitempty"`
 UpdatedBy      string      `json:"updated_by,omitempty"`
}

// Credentials represent user credentials: its
// "username"  a user's unique username;
// and "secret" which can be a password or access token.
type Credentials struct {
 Username string `json:"username,omitempty"` // username or profile name
 Secret   string `json:"secret,omitempty"`   // password or token
}
```

### User Attributes

- `ID` is a unique identifier for each user. It is a string value.
- `FirstName` is a required field that represents the first name of the user.
- `LastName` is a required field that represents the last name of the user.
- `Email` is a required filed that represents the email address of the user which can be used to log them in.
- `Tags` is an optional field that represents the tags related to the user. It is a slice of string values.
- `Credentials` is a struct that represents the user's authentication details. It contains two fields:
  - `Username` This is the username of the user, which must be unique.
  - `Secret` This is the secret of the user, which can be a password, secret key, or access token.
- `Metadata` is an optional field that is used for customized describing of the user.
- `CreatedAt` is a field that represents the time when the user was created. It is a `time.Time` value.
- `UpdatedAt` is a field that represents the time when the user was last updated. It is a `time.Time` value.
- `UpdatedBy` is a field that represents the user who last updated the user.
- `Status` is a field that represents the status for the user. It can be either 1 for enabled or 0 for disabled.
- `Role` is an optional field that represents the role of the user. It can be either 1 for admin or 0 for the user.
- `ProfilePicture` is a string url that leads to an image in the database that can be used as the user's profile picture.
- `Permissions` is a list of actions the user is allowed to perform.

The **Users Service** allows for creating, updating, reading, and deleting **Users** and **Groups**.
Users can bear multiple permissions that allow them various actions over other services and entities in the platform.

The API endpoint for interacting with users are described in the [Users API](https://github.com/absmach/supermq-docs/blob/main/docs/api.md#users).

## Role

A **Role** defines a set of permissions that a user can have within the system. Roles allow for fine-grained access control by associating users with actions they are allowed to perform.

```go
type Role struct {
 ID        string    `json:"id"`
 Name      string    `json:"name"`
 EntityID  string    `json:"entity_id"`
 CreatedBy string    `json:"created_by"`
 CreatedAt time.Time `json:"created_at"`
 UpdatedBy string    `json:"updated_by"`
 UpdatedAt time.Time `json:"updated_at"`
}
```

### Role Attributes

- `ID` is a unique identifier for each role. It is a string value.
- `Name` is a required field representing the name of the role. It is a string value.
- `EntityID` is the ID of the user associated with the role. It is a string value.
- `CreatedBy` is the ID of the user who created the role. It is a string value.
- `CreatedAt` is a field that represents the time when the role was created. It is a `time.Time` value.
- `UpdatedBy` is an optional field representing the user who last updated the role. It is a string value.
- `UpdatedAt` is a field that represents the time when the role was last updated. It is a `time.Time` value.
- `OptionalActions` is an optional list of actions that can be assigned to the role.
- `OptionalMembers` is an optional list of members associated with the role.

## Group

A **Group** is a hierarchical structure used to organize clients and channels within a domain. A group entity is structured in Go with these specific fields:

```go
type Group struct {
 ID                        string    `json:"id"`
 Domain                    string    `json:"domain_id,omitempty"`
 Parent                    string    `json:"parent_id,omitempty"`
 Name                      string    `json:"name"`
 Description               string    `json:"description,omitempty"`
 Metadata                  Metadata  `json:"metadata,omitempty"`
 Level                     int       `json:"level,omitempty"`
 Path                      string    `json:"path,omitempty"`
 Children                  []*Group  `json:"children,omitempty"`
 CreatedAt                 time.Time `json:"created_at"`
 UpdatedAt                 time.Time `json:"updated_at,omitempty"`
 UpdatedBy                 string    `json:"updated_by,omitempty"`
 Status                    Status    `json:"status"`
 RoleID                    string    `json:"role_id,omitempty"`
 RoleName                  string    `json:"role_name,omitempty"`
 Actions                   []string  `json:"actions,omitempty"`
 AccessType                string    `json:"access_type,omitempty"`
 AccessProviderId          string    `json:"access_provider_id,omitempty"`
 AccessProviderRoleId      string    `json:"access_provider_role_id,omitempty"`
 AccessProviderRoleName    string    `json:"access_provider_role_name,omitempty"`
 AccessProviderRoleActions []string  `json:"access_provider_role_actions,omitempty"`
}
```

### Group Attributes

- `ID` is a unique identifier for each group. It is a string value.
- `Domain` is an optional field that represents the ID of the domain the group belongs to. It is a string value.
- `Parent` is an optional field that contains the ID of the parent group. It is a string value.
- `Name` is a required field representing the name of the group. It is a string value.
- `Description` is an optional field describing the group’s purpose. It is a string value.
- `Metadata` is an optional field that provides additional structured data about the group.
- `Level` is an optional field that represents the depth of the group within the hierarchy. It is an integer value. Root node is level 1.
- `Path` is an optional field representing the full hierarchical path from the root to this group. It is a string value consisting of group IDs. Paths are unique per domain.
- `Children` is an optional field representing sub-groups contained within this group.
- `CreatedAt` is a field that represents the time when the group was created. It is a `time.Time` value.
- `UpdatedAt` is a field that represents the time when the group was last updated. It is a `time.Time` value.
- `UpdatedBy` is an optional field representing the user who last updated the group. It is a string value.
- `Status` is a field that represents whether the group is enabled or disabled.
- `RoleID` is an optional field representing the role ID associated with the group. It is a string value.
- `RoleName` is an optional field representing the role name associated with the group. It is a string value.
- `Actions` is an optional list of actions allowed on the group.
- `AccessType` is an optional field defining a group's reach. It is a string value.
- `AccessProviderId` is an optional field representing the ID of the entity providing access to the group. It is a string value.
- `AccessProviderRoleId` is an optional field representing the role ID assigned by the access provider. It is a string value.
- `AccessProviderRoleName` is an optional field representing the role name assigned by the access provider. It is a string value.
- `AccessProviderRoleActions` is an optional list of actions assigned by the access provider.

The API endpoint for interacting with groups are described in the [groups API](https://github.com/absmach/supermq-docs/blob/main/docs/api.md#groups).

## Client

A **Client** represents a device or service that connects to channels for communication.

```go
type Client struct {
 ID          string      `json:"id"`
 Name        string      `json:"name,omitempty"`
 Tags        []string    `json:"tags,omitempty"`
 Domain      string      `json:"domain_id,omitempty"`
 ParentGroup string      `json:"parent_group_id,omitempty"`
 Credentials Credentials `json:"credentials,omitempty"`
 Metadata    Metadata    `json:"metadata,omitempty"`
 CreatedAt   time.Time   `json:"created_at,omitempty"`
 UpdatedAt   time.Time   `json:"updated_at,omitempty"`
 UpdatedBy   string      `json:"updated_by,omitempty"`
 Status      Status      `json:"status,omitempty"` // 1 for enabled, 0 for disabled
 Identity    string      `json:"identity,omitempty"`
 // Extended
 ParentGroupPath           string                 `json:"parent_group_path,omitempty"`
 RoleID                    string                 `json:"role_id,omitempty"`
 RoleName                  string                 `json:"role_name,omitempty"`
 Actions                   []string               `json:"actions,omitempty"`
 AccessType                string                 `json:"access_type,omitempty"`
 AccessProviderId          string                 `json:"access_provider_id,omitempty"`
 AccessProviderRoleId      string                 `json:"access_provider_role_id,omitempty"`
 AccessProviderRoleName    string                 `json:"access_provider_role_name,omitempty"`
 AccessProviderRoleActions []string               `json:"access_provider_role_actions,omitempty"`
 ConnectionTypes           []connections.ConnType `json:"connection_types,omitempty"`
}

type Credentials struct {
 Identity string `json:"identity,omitempty"` // username or generated login ID
 Secret   string `json:"secret,omitempty"`   // password or token
}
```

### Client Attributes

- `ID` is a unique identifier for each client. It is a string value.
- `Name` is an optional field that represents the name of the client. It is a string value.
- `Tags` is an optional field that represents tags related to the client. It is a slice of string values.
- `Domain` is an optional field that represents the ID of the domain to which the client belongs. It is a string value.
- `ParentGroup` is an optional field that contains the ID of the group that owns the client. It is a string value.
- `Credentials` is an optional struct representing authentication details for the client, containing:
  - `Identity` is a unique identifier assigned to the client. It is a string value.
  - `Secret` is a password, access token, or other authentication mechanism. It is a string value that is always generated upon client creation if not specified.
- `Metadata` is an optional field that provides additional structured data about the client.
- `CreatedAt` is a field that represents the time when the client was created. It is a `time.Time` value.
- `UpdatedAt` is a field that represents the time when the client was last updated. It is a `time.Time` value.
- `UpdatedBy` is an optional field that represents the user who last updated the client. It is a string value.
- `Status` is a field that represents whether the client is enabled (`1`) or disabled (`0`). It is an integer value.
- `Identity` is an optional field that represents a unique identifier assigned to the client. It is a string value.
- `ParentGroupPath` is an optional field representing the hierarchical path of the parent group. It is a string value.
- `RoleID` is an optional field representing the role ID assigned to the client. It is a string value.
- `RoleName` is an optional field representing the role name assigned to the client. It is a string value.
- `Actions` is an optional list of actions that the client is allowed to perform.
- `AccessType` is an optional field defining how access is controlled. It is a string value.
- `AccessProviderId` is an optional field representing the ID of the entity providing access to the client. It is a string value.
- `AccessProviderRoleId` is an optional field representing the role ID assigned by the access provider. It is a string value.
- `AccessProviderRoleName` is an optional field representing the role name assigned by the access provider. It is a string value.
- `AccessProviderRoleActions` is an optional list of actions assigned by the access provider.
- `ConnectionTypes` is an optional field representing different connection protocols the client can use. It is a slice of connection types.

Hence any phsical device with an embeded system can be handed a unique key (**secret**) that will be used as a token during publishing and subscribing to a channel can be classified as a client.

The API endpoint for interacting with clients are described in the [clients API][clients-api].

## Channel

A **Channel** is a message conduit between clients connected to it.
It serves as a message topic that can be consumed by all of the clients connected to it.
Clients can publish or subscribe to the Channel.

```go
type Channel struct {
 ID          string           `json:"id"`
 Name        string           `json:"name,omitempty"`
 Tags        []string         `json:"tags,omitempty"`
 ParentGroup string           `json:"parent_group_id,omitempty"`
 Domain      string           `json:"domain_id,omitempty"`
 Metadata    clients.Metadata `json:"metadata,omitempty"`
 CreatedBy   string           `json:"created_by,omitempty"`
 CreatedAt   time.Time        `json:"created_at,omitempty"`
 UpdatedAt   time.Time        `json:"updated_at,omitempty"`
 UpdatedBy   string           `json:"updated_by,omitempty"`
 Status      clients.Status   `json:"status,omitempty"` // 1 for enabled, 0 for disabled
 // Extended
 ParentGroupPath           string                 `json:"parent_group_path,omitempty"`
 RoleID                    string                 `json:"role_id,omitempty"`
 RoleName                  string                 `json:"role_name,omitempty"`
 Actions                   []string               `json:"actions,omitempty"`
 AccessType                string                 `json:"access_type,omitempty"`
 AccessProviderId          string                 `json:"access_provider_id,omitempty"`
 AccessProviderRoleId      string                 `json:"access_provider_role_id,omitempty"`
 AccessProviderRoleName    string                 `json:"access_provider_role_name,omitempty"`
 AccessProviderRoleActions []string               `json:"access_provider_role_actions,omitempty"`
 ConnectionTypes           []connections.ConnType `json:"connection_types,omitempty"`
}
```

### Channel Attributes

- `ID` is a unique identifier for each channel. It is a string value.
- `Name` is an optional field that represents the name of the channel. It is a string value.
- `Tags` is an optional field that represents tags related to the channel. It is a slice of string values.
- `ParentGroup` is an optional field that contains the ID of the group that owns the channel. It is a string value.
- `Domain` is an optional field that represents the ID of the domain under which the channel exists. It is a string value.
- `Metadata` is an optional field that provides additional structured data about the channel.
- `CreatedBy` is an optional field representing the ID of the user who created the channel. It is a string value.
- `CreatedAt` is a field that represents the time when the channel was created. It is a `time.Time` value.
- `UpdatedAt` is a field that represents the time when the channel was last updated. It is a `time.Time` value.
- `UpdatedBy` is an optional field that represents the user who last updated the channel. It is a string value.
- `Status` is a field that represents whether the channel is enabled (`1`) or disabled (`0`). It is an integer value.
- `ParentGroupPath` is an optional field that represents the full hierarchical path of the parent group. It is a string value.
- `RoleID` is an optional field representing the role ID assigned to the channel. It is a string value.
- `RoleName` is an optional field representing the role name assigned to the channel. It is a string value.
- `Actions` is an optional list of actions that can be performed on the channel.
- `AccessType` is an optional field defining how access to the channel is managed. It is a string value.
- `AccessProviderId` is an optional field representing the ID of the entity providing access to the channel. It is a string value.
- `AccessProviderRoleId` is an optional field representing the role ID assigned by the access provider. It is a string value.
- `AccessProviderRoleName` is an optional field representing the role name assigned by the access provider. It is a string value.
- `AccessProviderRoleActions` is an optional list of actions assigned by the access provider.
- `ConnectionTypes` is an optional field representing different connection protocols supported by the channel. It is a slice of connection types.

The API endpoint for interacting with channels are described in the [channels API][channels-api].

## Domain

A **Domain** is a logical grouping that separates different tenants and governs access control.

```go
type Domain struct {
 ID        string    `json:"id"`
 Name      string    `json:"name"`
 Metadata  Metadata  `json:"metadata,omitempty"`
 Tags      []string  `json:"tags,omitempty"`
 Alias     string    `json:"alias,omitempty"`
 Status    Status    `json:"status"`
 RoleID    string    `json:"role_id,omitempty"`
 RoleName  string    `json:"role_name,omitempty"`
 Actions   []string  `json:"actions,omitempty"`
 CreatedBy string    `json:"created_by,omitempty"`
 CreatedAt time.Time `json:"created_at"`
 UpdatedBy string    `json:"updated_by,omitempty"`
 UpdatedAt time.Time `json:"updated_at,omitempty"`
}
```

### Domain Attributes

- `ID` is a unique identifier for each domain. It is a string value.
- `Name` is a required field representing the name of the domain. It is a string value.
- `Metadata` is an optional field that provides additional structured data about the domain.
- `Tags` is an optional field that represents tags related to the domain. It is a slice of string values.
- `Alias` is an optional field that represents an alternate identifier for the domain. It is a string value.
- `Status` is a field that represents whether the domain is enabled or disabled.
- `RoleID` is an optional field representing the role ID assigned to the domain. It is a string value.
- `RoleName` is an optional field representing the role name assigned to the domain. It is a string value.
- `Actions` is an optional list of allowed operations within the domain.
- `CreatedBy` is an optional field representing the user who created the domain. It is a string value.
- `CreatedAt` is a field that represents the time when the domain was created. It is a `time.Time` value.
- `UpdatedBy` is an optional field representing the user who last updated the domain. It is a string value.
- `UpdatedAt` is a field that represents the time when the domain was last updated. It is a `time.Time` value.

The API endpoint for interacting with Domains are described in the [domains API][domains-api].

[clients-api]: https://github.com/absmach/supermq-docs/blob/main/docs/api.md#clients
[channels-api]: https://github.com/absmach/supermq-docs/blob/main/docs/api.md#channels
[domains-api]: https://github.com/absmach/supermq-docs/blob/main/docs/api.md
