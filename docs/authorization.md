---
title: Authorization
---

SuperMQ allows for fine-grained control over permitted user actions, taking into account hierarchical relationships between entities domains, groups, channels, and clients. The structure and functionality of an authorization system implemented using [SpiceDB](https://github.com/authzed/spicedb) and its associated [schema language](https://authzed.com/docs/reference/schema-lang). The `auth` service backed by SpiceDB manages permissions for users, domains, groups, channels, and clients.

## Domains

Domain contains **Clients**, **Channels** and **Groups**. A **User** can be a member of a domain role. The role determines the actions that are the user is permitted to perform on the domains and subsequently entities belonging to the domain i.e clients, channels and groups.

### Domain Entities

#### Overview

In SuperMQ, **clients**, **channels**, and **groups** are inherently associated with one particular domain. This means that every **group**, including its sub-groups, every **client**, and every **channel** is owned by and belongs to a specific domain. Domain acts like a kind of namespace.
In SuperMQ, **clients**, **channels**, and **groups** are inherently associated with one particular domain. This means that every **group**, including its sub-groups, every **client**, and every **channel** is owned by and belongs to a specific domain. Domain acts like a kind of namespace.

```mermaid
graph TD
   Do[Domain]
   Gr["Groups + Sub Groups"]
   Cl[Clients]
   Ch[Channels]

   Do --->|owns| Gr
   Do --->|owns| Ch
   Do --->|owns| Cl

```

Entities within domains have relationships with other entities in hierarchical structure.

```mermaid
graph
   subgraph Domain
      direction BT
      Gr[Group]
      Cl[Client]
      SG["Group (Sub Group)"]
      Ch[Channel]

      Cl --->|connects| Ch
      Cl --->|parent| Gr
      Ch --->|parent| SG
      Ch --->|parent| Gr
      SG --->|parent| Gr
   end
style Domain stroke-width:3px,margin-top:10px,margin-bottom:10px
```

#### Domain Entities Relations

Domain holds entities such as `groups`, `channels`, and `clients`.
Domain holds entities such as `groups`, `channels`, and `clients`.
The entities created in a domain don't have any hierarchical structure between them.

Example: In `domain_1` a user creates the following entities `group_1`, `group_2`, `client_1`, `client_2`, `channel_1`, `channel_2`. By default, there is no relation between the entities, until the user assigns a relation between the entities
Example: In `domain_1` a user creates the following entities `group_1`, `group_2`, `client_1`, `client_2`, `channel_1`, `channel_2`. By default, there is no relation between the entities, until the user assigns a relation between the entities

```mermaid
graph
   subgraph domain_1
      direction TB
      Gr1["group_1"]
      Gr2["group_2"]

      Cl1["client_1"]
      Cl2["client_2"]


      Ch1["channel_1"]
      Ch2["channel_2"]

   end
```

##### Channel Client Connect/Disconnect
##### Channel Client Connect/Disconnect

`Client` represents a device (or an application) connected to SuperMQ that uses the platform for message exchange with other `clients`.
`Client` represents a device (or an application) connected to SuperMQ that uses the platform for message exchange with other `clients`.

`Channel` is a message conduit between clients connected to it. It serves as a message topic that can be consumed by all of the clients connected to it.
Clients can publish, subscribe or publish and subscribe to the channel.

Multiple clients and channels can be connected using the following API.

```bash
curl -sSiX POST http://localhost/<domain_id>/channels/connect -H "Content-Type: application/json" -H "Authorization: Bearer <user_access_token>" -d @- << EOF
{
  "channel_ids": [
    "<channel_1_id",
    "<channel_2_id"
  ],
  "client_ids": [
    "<client_1_id>",
    "<client_2_id>"
  ],
  "types": [
    "subscribe",
    "publish"
  ]
}
EOF
```

_*The below diagram shows `client_1` is connected to `channel_1` and `channel_2` , then `client_2` is connected to `channel_1` and `channel_2`. This relationship can be established using the provided request*_

```mermaid
graph
   subgraph domain_1
      direction BT
      Gr1["group_1"]
      Gr2["group_2"]

      Cl1["client_1"]
      Cl2["client_2"]

      Ch1["channel_1"]
      Ch2["channel_2"]


      Cl1 --->|connect| Ch1
      Cl1 --->|connect| Ch2

      Cl2 --->|connect| Ch2
      Cl2 --->|connect| Ch2
   end
```

##### Channel Group Relation

A group serves as a parent entity that can contain both groups, clients and channels as children. Child groups, in turn, can consist of further child groups, clients or channels, forming a nested hierarchy. Notably, channels, which are distinct entities, cannot have child channels but can connect to multiple clients. The concept of parentage signifies the relationship between higher-level entities and their subordinate components. Ancestors in this system refer to entities higher up in the hierarchy, and while a child group can have multiple ancestors, a channel can only belong to a single parent group. This hierarchical arrangement provides a structured and organized framework for managing information within the SuperMQ.

Assigning a group as the parent of a channel can be achieved through the following request.

```bash
curl -sSiX POST 'http://localhost/<domain_id>/channels/<channel_id>/parent' -H "Content-Type: application/json" -H "Authorization: Bearer <user_access_token>" -d @- << EOF
{
  "parent_group_id": "<parent_group_id>"
}
EOF
```

_*The diagram below illustrates the parent relationship between `channel_1` with `group_2`. This relationship can be established using the provided request.*_

```mermaid
graph
   subgraph domain_1
      direction BT
      Gr1["group_1"]
      Gr2["group_2"]

      Cl1["client_1"]
      Cl2["client_2"]

      Ch1["channel_1"]
      Ch2["channel_2"]


      Cl1 --->|connect| Ch1
      Cl1 --->|connect| Ch2

      Cl2 --->|connect| Ch1
      Cl2 --->|connect| Ch2

      Ch1 --->|parent| Gr2
   end
```

##### Group Group Relation

Groups can establish a parent-child relationship with other groups. The children groups are sub-group and they can also have children groups in nested fashion

Assigning a group as the parent to another group can be achieved through the following request.

```bash
curl -sSiX POST 'http://localhost/<domain_id>/groups/<group_id>/children' -H "Content-Type: application/json" -H "Authorization: Bearer <user_access_token>" -d @- << EOF
{
  "groups": ["<child_group_id_1>","<child_group_id_2>"]
}
EOF
```

_*The diagram below illustrates the parent relationship between `group_1` and `group_2`. This relationship can be established using the provided request.*_

```mermaid
graph
   subgraph domain_1
      direction BT
      Gr1["group_1"]
      Gr2["group_2"]

      Cl1["client_1"]
      Cl2["client_2"]

      Ch1["channel_1"]
      Ch2["channel_2"]


       Cl1 --->|connect| Ch1
      Cl1 --->|connect| Ch2

      Cl2 --->|connect| Ch1
      Cl2 --->|connect| Ch2

      Ch1 --->|parent| Gr2

      Gr2 --->|parent| Gr1
   end
```

##### Domain Entities Relation Examples

An example group with channels, clients, and groups (sub-groups) within the domain.
An example group with channels, clients, and groups (sub-groups) within the domain.
Groups have parent-child relationships, forming a hierarchy where top-level groups (`group_1` and `group_2`) have groups (sub-groups - `group_11`, `group_12`, `group_21`, and `group_22`) or channels (`channel_2`) beneath them.

```mermaid
graph
   subgraph domain_1
      direction BT
      Gr1["group_1"]
      Gr2["group_2"]

      Gr11["group_11 (Sub Group)"]
      Gr12["group_12 (Sub Group)"]

      Gr21["group_21 (Sub Group)"]
      Gr22["group_22 (Sub Group)"]

      Cl1["client_1"]
      Cl2["client_2"]
      Cl3["client_3"]
      Cl4["client_4"]
      Cl5["client_5"]
      Cl6["client_6"]



      Ch1["channel_1"]
      Ch2["channel_2"]
      Ch3["channel_3"]
      Ch4["channel_4"]

      Gr11 --->|parent| Gr1
      Gr12 --->|parent| Gr1

      Ch1 --->|parent| Gr11
      Cl1 --->|connects| Ch1
      Cl5 --->|connects| Ch1

      Ch2 --->|parent| Gr1
      Cl2 --->|connects| Ch2

      Gr21 --->|parent| Gr2
      Ch3 --->|parent| Gr21
      Cl3 --->|connects| Ch3

      Gr22 --->|parent| Gr21
      Ch4 --->|parent| Gr22
      Cl4 --->|connects| Ch4
      Cl6 --->|connects| Ch4
   end
```

Another example

```mermaid
graph
  subgraph domain_1
    direction BT

    Gr1["group_1"]

    Gr11["group_11 (Sub Group)"]
    Gr12["group_12 (Sub Group)"]
    Gr13["group_13 (Sub Group)"]


    Cl1["client_1"]
    Cl2["client_2"]
    Cl3["client_3"]
    Cl4["client_4"]
    Cl11["client_11"]
    Cl22["client_22"]
    Cl33["client_33"]

    Ch1["channel_1"]
    Ch2["channel_2"]
    Ch3["channel_3"]
    Ch4["channel_4"]

    Gr11 --->|parent| Gr1
    Ch4 --->|parent| Gr1
    Gr12 --->|parent| Gr11
    Gr13 --->|parent| Gr12

    Ch1 --->|parent| Gr11
    Ch2 --->|parent| Gr12
    Ch3 --->|parent| Gr13


    Cl1 --->|connects| Ch1
    Cl11 --->|connects| Ch1

    Cl2 --->|connects| Ch2
    Cl22 --->|connects| Ch2
    Cl3 --->|connects| Ch3
    Cl33 --->|connects| Ch3
    Cl4 --->|connects| Ch4

  end
```

## User Domain Relationship

In SuperMQ, when a new user registers, they don't automatically have access to domains.
The domain administrator must invite the user to a role or add them manually to a role associated with the domain.

Domain administrator can invite an existing user in SuperMQ or invite new users to the domain by e-mail ID.
After the user registers with SuperMQ, the user can accept the invitation to the domain.

All the users in SuperMQ are allowed to create a new domain.
The user who creates a domain automatically becomes a member of the default _*`admin`*_ role.

Users can have any one role that is associated with the domain. The administrator can create a role wth any number of actions associated to the role and give the role a custom name. A user who is invited or assigned to the role is able to perform the actions that are specified by the role.

**Let's take the below domain_1 with entities for explaining about user domain relationship.**

![domain_users](diagrams/domain_users.svg) <!-- to be replaced -->

The following are the available actions on a domin are specified in the [roles page](./authz-spec.md)

## Tokens

JWT token are used in SuperMQ for authentication and authorization. The JWT token has exp, iat, iss, sub, type, and user fields.

Example JWT Token:

```json
{
  "exp": 1706544967,
  "iat": 1706541367,
  "iss": "supermq.auth",
  "sub": "",
  "type": 0,
  "user": "266d00f8-2284-4613-b732-3bd16e7cf8f2"
}
```

In JWT token the user field has **user ID**.

All actions involving CRUD operations on users, domains, groups, channels and clients will require a token.

An access token is generated by sending user credentials to the `tokens/issue` endpoint. _\*This endpoint does not require an access token to be provided._\*

### Obtaining a new token

**Request:**

```bash
curl -sSiX POST 'http://localhost/users/tokens/issue'  -H "Content-Type: application/json" -d @- << EOF
{
  "username": "user1@example.com",
  "password": "12345678",
}
EOF
```

**Response:**

```json
{
  "access_token": "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJkb21haW4iOiI5MDNmN2VkZS0zMzA4LTQyMDYtODljMi1lOTk2ODhiNjEyZjciLCJleHAiOjE3MDY2MDM0NDcsImlhdCI6MTcwNjU5OTg0NywiaXNzIjoibWFnaXN0cmFsYS5hdXRoIiwic3ViIjoiOTAzZjdlZGUtMzMwOC00MjA2LTg5YzItZTk5Njg4YjYxMmY3XzU3NDhkZTY5LTJhNjYtNDBkYS1hODI5LTFiNDdmMDJlOWFkYiIsInR5cGUiOjAsInVzZXIiOiI1NzQ4ZGU2OS0yYTY2LTQwZGEtYTgyOS0xYjQ3ZjAyZTlhZGIifQ",
  "refresh_token": "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJkb21haW4iOiI5MDNmN2VkZS0zMzA4LTQyMDYtODljMi1lOTk2ODhiNjEyZjciLCJleHAiOjE3MDY2ODYyNDcsImlhdCI6MTcwNjU5OTg0NywiaXNzIjoibWFnaXN0cmFsYS5hdXRoIiwic3ViIjoiOTAzZjdlZGUtMzMwOC00MjA2LTg5YzItZTk5Njg4YjYxMmY3XzU3NDhkZTY5LTJhNjYtNDBkYS1hODI5LTFiNDdmMDJlOWFkYiIsInR5cGUiOjEsInVzZXIiOiI1NzQ4ZGU2OS0yYTY2LTQwZGEtYTgyOS0xYjQ3ZjAyZTlhZGIifQ"
}
```

**Decoded Access Token:**

```json
{
  "exp": 1706603526,
  "iat": 1706599926,
  "iss": "supermq.auth",
  "sub": "",
  "type": 0,
  "user": "5748de69-2a66-40da-a829-1b47f02e9adb"
}
```

**Decoded Refresh Token:**

```json
{
  "exp": 1706686326,
  "iat": 1706599926,
  "iss": "supermq.auth",
  "sub": "",
  "type": 1,
  "user": "5748de69-2a66-40da-a829-1b47f02e9adb"
}
```

## Add User to Domain Role

Domain creator becomes administrator of the domain by default as they are a member of the default _*`admin`*_ role. Domain administrator can create roles with various actions on the domain and add other users as members to these roles. More about roles is highlighted in the [roles page](./authz-spec.md)

The process of adding a user as a member to a domain role is a as follows:

### 1. Create domain role

This is done by making a post request to the `domain/<domain_id>/roles` endpoint.

**Example Request:**

```bash
curl -sSiX POST 'http://localhost/domains/c01ed106-e52d-4aa4-bed3-39f360177cfa/roles'  -H "Content-Type: application/json" -H "Authorization: Bearer <user_access_token>"  -d @- << EOF
{
 "role_name": "roleName",
  "optional_actions": [
    "read",
    "update",
    "delete"
  ],
}
```

**Example Response:**

```json
{
  "role_id": "bb7edb32-2eac-4aad-aebe-ed96fe073879",
  "role_name": "roleName",
  "entity_id": "bb7edb32-2eac-4aad-aebe-ed96fe073879",
  "created_by": "bb7edb32-2eac-4aad-aebe-ed96fe073879",
  "created_at": "2019-11-26 13:31:52",
  "updated_by": "",
  "updated_at": ""
}
```

### 2. Add user as domain role member

This is done by making a post request to the `domains/<domain_id>/roles/<role_id>/members` endpoint.

**Example Reqest:**

```bash
curl -sSiX POST 'http://localhost/domains/c01ed106-e52d-4aa4-bed3-39f360177cfa/roles/bb7edb32-2eac-4aad-aebe-ed96fe073879/members'  -H "Content-Type: application/json" -H "Authorization: Bearer <user_access_token>"  -d @- << EOF
{
  "members": [
    "5dc1ce4b-7cc9-4f12-98a6-9d74cc4980bb"
  ]
}
```

## Remove User from domain role

A user can be removed as a member of a domain role by making a post request to the `domains/<domain_id>/roles/<role_id>members/delete` endpoint.

**Example Request:**

```bash
curl -sSiX POST 'http://localhost/domains/c01ed106-e52d-4aa4-bed3-39f360177cfa/roles/bb7edb32-2eac-4aad-aebe-ed96fe073879/members/delete'  -H "Content-Type: application/json" -H "Authorization: Bearer <user_access_token>"  -d @- << EOF
{
  "members": [
    "5dc1ce4b-7cc9-4f12-98a6-9d74cc4980bb"
  ]
}
```

## User Entities Relationship

Users who are members of a domain role will have access to entities i.e groups, channels and clients belonging to the domain. The user has a _*`domain`*_ access type to the entities and can only perform the actions specified by the domain role on the entities in the domain.

## Groups Relations

Like domains, groups also have roles. A user has access to a group if they create it, are assigned as a group role member, are added to a domain with the group or have a role in a the parent group of the group.

A user is able to perform actions on a group if they are members of a group role. Managing roles in groups is simila to managing roles in domains.

To add a user to a group role, the process is as follows:

### 1. Create group role

This is done by making a post request to the `/<domain_id>/groups/<group_id>/roles` endpoint.

**Example Request:**

```bash
curl -sSiX POST 'http://localhost/c01ed106-e52d-4aa4-bed3-39f360177cfa/groups/bad9b020-b71c-4ed3-8b7d-6099bb2ffbc5/roles'  -H "Content-Type: application/json" -H "Authorization: Bearer <user_access_token>"  -d @- << EOF
{
 "role_name": "roleName",
  "optional_actions": [
    "read",
    "update",
    "delete"
  ],
}
```

**Example Response:**

```json
{
  "role_id": "bb7edb32-2eac-4aad-aebe-ed96fe073879",
  "role_name": "roleName",
  "entity_id": "bb7edb32-2eac-4aad-aebe-ed96fe073879",
  "created_by": "bb7edb32-2eac-4aad-aebe-ed96fe073879",
  "created_at": "2019-11-26 13:31:52",
  "updated_by": "",
  "updated_at": ""
}
```

### 2. Add user as group role member

This is done by making a post request to the `/<domain_id>/groups/<group_id>/roles/<role_id>/members` endpoint.

**Example Reqest:**

```bash
curl -sSiX POST 'http://localhost/c01ed106-e52d-4aa4-bed3-39f360177cfa/groups/bad9b020-b71c-4ed3-8b7d-6099bb2ffbc5/roles/bb7edb32-2eac-4aad-aebe-ed96fe073879/members'  -H "Content-Type: application/json" -H "Authorization: Bearer <user_access_token>"  -d @- << EOF
{
  "members": [
    "5dc1ce4b-7cc9-4f12-98a6-9d74cc4980bb"
  ]
}
```

## Clients Relations

Like domains, clients also have roles. A user has access to a client if they create it, are assigned as a client role member, are added to a domain with the client or have a role in a the parent group of the client.

A user is able to perform actions on a group if they are members of a client role. Managing roles in groups is simila to managing roles in clients.

To add a user to a client role, the process is as follows:

### 1. Create client role

This is done by making a post request to the `/<domain_id>/clients/<client_id>/roles` endpoint.

**Example Request:**

```bash
curl -sSiX POST 'http://localhost/c01ed106-e52d-4aa4-bed3-39f360177cfa/clients/bad9b020-b71c-4ed3-8b7d-6099bb2ffbc5/roles'  -H "Content-Type: application/json" -H "Authorization: Bearer <user_access_token>"  -d @- << EOF
{
 "role_name": "roleName",
  "optional_actions": [
    "read",
    "update",
    "delete"
  ],
}
```

**Example Response:**

```json
{
  "role_id": "bb7edb32-2eac-4aad-aebe-ed96fe073879",
  "role_name": "roleName",
  "entity_id": "bb7edb32-2eac-4aad-aebe-ed96fe073879",
  "created_by": "bb7edb32-2eac-4aad-aebe-ed96fe073879",
  "created_at": "2019-11-26 13:31:52",
  "updated_by": "",
  "updated_at": ""
}
```

### 2. Add user as client role member

This is done by making a post request to the `/<domain_id>/clients/<client_id>/roles/<role_id>/members` endpoint.

**Example Reqest:**

```bash
curl -sSiX POST 'http://localhost/c01ed106-e52d-4aa4-bed3-39f360177cfa/clients/bad9b020-b71c-4ed3-8b7d-6099bb2ffbc5/roles/bb7edb32-2eac-4aad-aebe-ed96fe073879/members'  -H "Content-Type: application/json" -H "Authorization: Bearer <user_access_token>"  -d @- << EOF
{
  "members": [
    "5dc1ce4b-7cc9-4f12-98a6-9d74cc4980bb"
  ]
}
```

## Channels Relations

Like domains, channels also have roles. A user has access to a channel if they create it, are assigned as a channel role member, are added to a domain with the channel or have a role in a the parent group of the channel.

A user is able to perform actions on a channel if they are members of a client role. Managing roles in groups is simila to managing roles in clients.

To add a user to a client role, the process is as follows:

### 1. Create channel role

This is done by making a post request to the `/<domain_id>/channels/<channel_id>/roles` endpoint.

**Example Request:**

```bash
curl -sSiX POST 'http://localhost/c01ed106-e52d-4aa4-bed3-39f360177cfa/channels/bad9b020-b71c-4ed3-8b7d-6099bb2ffbc5/roles'  -H "Content-Type: application/json" -H "Authorization: Bearer <user_access_token>"  -d @- << EOF
{
 "role_name": "roleName",
  "optional_actions": [
    "read",
    "update",
    "delete"
  ],
}
```

**Example Response:**

```json
{
  "role_id": "bb7edb32-2eac-4aad-aebe-ed96fe073879",
  "role_name": "roleName",
  "entity_id": "bb7edb32-2eac-4aad-aebe-ed96fe073879",
  "created_by": "bb7edb32-2eac-4aad-aebe-ed96fe073879",
  "created_at": "2019-11-26 13:31:52",
  "updated_by": "",
  "updated_at": ""
}
```

### 2. Add user as channel role member

This is done by making a post request to the `/<domain_id>/channels/<channel_id>/roles/<role_id>/members` endpoint.

**Example Reqest:**

```bash
curl -sSiX POST 'http://localhost/c01ed106-e52d-4aa4-bed3-39f360177cfa/channels/bad9b020-b71c-4ed3-8b7d-6099bb2ffbc5/roles/bb7edb32-2eac-4aad-aebe-ed96fe073879/members'  -H "Content-Type: application/json" -H "Authorization: Bearer <user_access_token>"  -d @- << EOF
{
  "members": [
    "5dc1ce4b-7cc9-4f12-98a6-9d74cc4980bb"
  ]
}
```

## User Registration

There are two ways to user get registered to SuperMQ, self-register and register new users by super admin.
User registration is self register default which can be changed by following environment variable:

```env
SMQ_USERS_ALLOW_SELF_REGISTER=true
```

## SuperMQ Personal Access Token (PAT) Authentication

### PAT Overview

Personal Access Tokens (PATs) in SuperMQ provide a secure method for authentication and authorization, similar to JSON Web Tokens (JWTs). PATs enable fine-grained access control with customizable scopes and permissions. They are particularly useful for automation, CI/CD pipelines, and integrating with third-party services. They are designed with the following features:

- **Scoped Access**: Each token can be limited to specific operations on specific resources
- **Expiration Control**: Set custom expiration times for tokens
- **Revocable**: Tokens can be revoked at any time
- **Auditable**: Track when tokens were last used
- **Secure**: Tokens are stored as hashes, not in plaintext

PATs have the following fields:

- ID: Unique identifier for the token
- UserId: User ID associated with the token
- Name: User-defined name for easy identification
- Description: Explanation of the token's purpose
- Secret: Securely hashed token for authentication
- IssuedAt: Timestamp of token creation
- ExpiresAt: Timestamp when the token becomes invalid
- UpdatedAt: Last modification timestamp
- LastUsedAt: Timestamp of most recent token usage
- Status: Indicates the statusof the PAT ie active, revoked, expired and all status
- RevokedAt: Timestamp of token revocation

### Token Structure

A PAT consists of three parts separated by underscores:

```
pat_<encoded-user-and-pat-id>_<random-string>
```

Where:

- `pat` is a fixed prefix
- `<encoded-user-and-pat-id>` is a base64-encoded combination of the user ID and PAT ID
- `<random-string>` is a randomly generated string for additional security

### PAT Operations

SuperMQ supports the following operations for PATs:

| Operation   | Description                          |
| ----------- | ------------------------------------ |
| `create`    | Create a new resource                |
| `read`      | Read/view a resource                 |
| `list`      | List resources                       |
| `update`    | Update/modify a resource             |
| `delete`    | Delete a resource                    |
| `share`     | Share a resource with others         |
| `unshare`   | Remove sharing permissions           |
| `publish`   | Publish messages to a channel        |
| `subscribe` | Subscribe to messages from a channel |

### Scope Structure

The PAT scope defines granular permissions across different system components:

- Users: Operations that can be performed by users
- Domains: Permissions for entities within domains (groups, channels, clients)
- Dashboard: Dashboard-related operations
- Messaging: Publish and subscribe permissions

### Example Scope JSON

```json
{
  "users": {
    "create": ["*"],
    "read": ["*"],
    "list": ["*"],
    "update": ["*"],
    "delete": ["*"]
  },
  "domains": {
    "domain_1": {
      "entities": {
        "groups": {
          "create": ["*"] // this for all groups in domain
        },
        "channels": {
          // for particular channel in domain
          "delete": ["0241e6fe-2113-4731-9cfa-5c74626652b8"]
        },
        "clients": {
          "update": ["*"] // this for all clients in domain
        }
      }
    }
  }
}
```

### PAT Endpoint Operations

SuperMQ exposes a couple of endpoints that allow the user to create,retrieve, update, delete and list pats and their respective scopes.

#### Creating a PAT

```bash
curl --location 'http://localhost:9001/pats' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer <access_token>' \
--data '{
    "name": "test pat",
    "description": "testing pat",
    "duration": "24h"
}'
```

Response:

```json
{
    "id": "d309ebe9-42f2-4324-9e60-4cea9fbef684",
    "user_id": "3aa2aa87-f29b-455d-aa68-1e874804f786",
    "name": "Test",
    "description": "testing pat",
    "secret": "pat_OqKqh/KbRV2qaB6HSAT3htMJ6+lC8kMknmBM6p++9oQ=_-F&M2NiTyNEbnh84MKbpoU57-x6p+m+ZwGeJwn#7+zoX*XbvLYIDr90|Y82GDd2%AhNv&$wo+hcHr==-|7g8q3zqTSVdXTd&b%Jw",
    "issued_at": "2025-03-19T10:50:27.034964845Z",
    "expires_at": "2025-03-20T10:50:27.034964845Z",
    "updated_at": "0001-01-01T00:00:00Z",
    "last_used_at": "0001-01-01T00:00:00Z",
    "revoked_at": "0001-01-01T00:00:00Z",
    "status": "active"
}
```

#### Update PAT Name

```bash
curl --location --request PATCH 'http://localhost:9001/pats/{{PATID}}/name' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer <access_token>' \
--data '{
    "name": "new pat"
}'
```

Response:

```json
{
    "id": "d309ebe9-42f2-4324-9e60-4cea9fbef684",
    "user_id": "3aa2aa87-f29b-455d-aa68-1e874804f786",
    "name": "new pat",
    "description": "testing pat",
    "secret": "G8rHXtDLGaibHlifU3d+RACTw52S+s+Rhg4dRrp1NBw=.Yw7kKMTlao0XtEmBUIUBs5yTpBYXJ15vbA==",
    "issued_at": "2025-03-19T10:50:27.034964Z",
    "expires_at": "2025-03-20T10:50:27.034964845Z",
    "updated_at": "2025-03-19T11:04:51.46114Z",
    "last_used_at": "0001-01-01T00:00:00Z",
    "revoked_at": "0001-01-01T00:00:00Z",
    "status": "active"
}
```

#### Update PAT Description

```bash
curl --location --request PATCH 'http://localhost:9001/pats/{{PATID}}/description' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer <access_token>' \
--data '{
    "description": "new description"
}'
```

Response:

```json
{
    "id": "d309ebe9-42f2-4324-9e60-4cea9fbef684",
    "user_id": "3aa2aa87-f29b-455d-aa68-1e874804f786",
    "name": "new pat",
    "description": "new description",
    "secret": "G8rHXtDLGaibHlifU3d+RACTw52S+s+Rhg4dRrp1NBw=.Yw7kKMTlao0XtEmBUIUBs5yTpBYXJ15vbA==",
    "issued_at": "2025-03-19T10:50:27.034964Z",
    "expires_at": "2025-03-20T10:50:27.034964845Z",
    "updated_at": "2025-03-19T11:16:58.969111Z",
    "last_used_at": "0001-01-01T00:00:00Z",
    "revoked_at": "0001-01-01T00:00:00Z",
    "status": "active"
}
```

#### Retrieve PAT

```bash
curl --location 'http://localhost:9001/pats/{{PATID}}' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer <access_token>'
```

Response:

```json
{
    "id": "d309ebe9-42f2-4324-9e60-4cea9fbef684",
    "user_id": "3aa2aa87-f29b-455d-aa68-1e874804f786",
    "name": "new pat",
    "description": "new description",
    "secret": "G8rHXtDLGaibHlifU3d+RACTw52S+s+Rhg4dRrp1NBw=.Yw7kKMTlao0XtEmBUIUBs5yTpBYXJ15vbA==",
    "issued_at": "2025-03-19T10:50:27.034964Z",
    "expires_at": "2025-03-20T10:50:27.034964845Z",
    "updated_at": "2025-03-19T11:16:58.969111Z",
    "last_used_at": "0001-01-01T00:00:00Z",
    "revoked_at": "0001-01-01T00:00:00Z",
    "status": "active"
}
```

#### Revoke PAT

```bash
curl --location --request PATCH 'http://localhost:9001/pats/{{PATID}}/secret/revoke' \
--header 'Authorization: Bearer <access_token>'
```

> **NOTE:**
> No response is expected.

#### Reset PAT

```bash
curl --location --request PATCH 'http://localhost:9001/pats/d309ebe9-42f2-4324-9e60-4cea9fbef684/secret/reset' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer <access_token>' \
--data '{
    "duration": "10h"
}'
```

Response:
```json
{
    "id": "d309ebe9-42f2-4324-9e60-4cea9fbef684",
    "user_id": "3aa2aa87-f29b-455d-aa68-1e874804f786",
    "name": "new pat",
    "description": "new description",
    "secret": "pat_OqKqh/KbRV2qaB6HSAT3htMJ6+lC8kMknmBM6p++9oQ=_C5UuBv4Ps8w64#rLrMovFAbLKWmZovPn&X0^aXTbSqckoAz-7rirv4uWQZIr9EBKbGH&Y+!35!J-=@WXeFSA^YKscD2SJxkiOy!o",
    "issued_at": "2025-03-19T10:50:27.034964Z",
    "expires_at": "2025-03-19T21:49:33.280402Z",
    "updated_at": "2025-03-19T11:49:33.280403Z",
    "last_used_at": "0001-01-01T00:00:00Z",
    "revoked_at": "0001-01-01T00:00:00Z",
    "status": "active"
}
```

> **NOTE:**
> The secret is changed with every reset.

#### Listing PATs

By default, the listing endpoint retrieves only active PATs. To view tokens with other statuses, you must specify the desired status using the query parameter. Here are examples of how to retrieve PATs with different statuses:



```bash
curl --location 'http://localhost:9001/pats' \
--header 'Authorization: Bearer <access_token>'
```

```bash
curl --location 'http://localhost:9001/pats?status=revoked' \
--header 'Authorization: Bearer <access_token>'
```

```bash
curl --location 'http://localhost:9001/pats?status=expired' \
--header 'Authorization: Bearer <access_token>'
```

```bash
curl --location 'http://localhost:9001/pats?status=all' \
--header 'Authorization: Bearer <access_token>'
```

Response:

```json
{
    "total": 3,
    "offset": 0,
    "limit": 10,
    "pats": [
        {
            "id": "33ba6126-1f1d-4fc1-90ae-cb4975e9ea22",
            "user_id": "3aa2aa87-f29b-455d-aa68-1e874804f786",
            "name": "Test 2",
            "description": "Test PAT",
            "issued_at": "2025-03-19T14:22:44.683746Z",
            "expires_at": "2025-03-20T14:22:44.683746Z",
            "updated_at": "0001-01-01T00:00:00Z",
            "last_used_at": "0001-01-01T00:00:00Z",
            "revoked_at": "0001-01-01T00:00:00Z",
            "status": "active"
        },
        {
            "id": "6fcbcaa8-f16b-451b-8b2b-54247a34f25f",
            "user_id": "3aa2aa87-f29b-455d-aa68-1e874804f786",
            "name": "Test 1",
            "description": "Test PAT",
            "issued_at": "2025-03-19T14:22:31.07042Z",
            "expires_at": "2025-03-20T14:22:31.07042Z",
            "updated_at": "0001-01-01T00:00:00Z",
            "last_used_at": "0001-01-01T00:00:00Z",
            "revoked_at": "0001-01-01T00:00:00Z",
            "status": "active"
        },
        {
            "id": "d309ebe9-42f2-4324-9e60-4cea9fbef684",
            "user_id": "3aa2aa87-f29b-455d-aa68-1e874804f786",
            "name": "new pat",
            "description": "new description",
            "issued_at": "2025-03-19T10:50:27.034964Z",
            "expires_at": "2025-03-19T21:49:33.280402Z",
            "updated_at": "2025-03-19T11:49:33.280403Z",
            "last_used_at": "0001-01-01T00:00:00Z",
            "revoked": true,
            "revoked_at": "2025-03-19T14:23:27.982673Z",
            "status": "revoked"
        }
    ]
}
```

> **NOTE:**
> The listing API can be used to search for Personal Access Tokens (PATs) by either their name or their complete id.
> This allows you to retrieve specific token information without having to browse through all existing tokens.

```json
curl --location 'http://localhost:9001/pats?name=pat&id=9155be55-fb02-40c8-9213-9e2a651d8631' \
--header 'Authorization: Bearer <access_token>'
```


#### Adding Scopes to a PAT

```bash
curl --location --request PATCH 'http://localhost:9001/pats/{{PATID}}/scope/add' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer <access_token>' \
--data '{
    "scopes": [
        {
            "optional_domain_id": "{{DOMAINID}}",
            "entity_type": "clients",
            "operation": "create",
            "entity_id": "*"
        },
        {
            "optional_domain_id": "{{DOMAINID}}",
            "entity_type": "channels",
            "operation": "create",
            "entity_id": "*"
        },
        {
            "entity_type": "dashboards",
            "optional_domain_id": "{{DOMAINID}}",
            "operation": "share",
            "entity_id": "*"
        }
    ]
}'
```

> **NOTE:**
> No response is expected.


#### Listing Scopes for a PAT

```bash
curl --location 'http://localhost:9001/pats/{{PATID}}/scopes' \
--header 'Authorization: Bearer <access_token>'
```

Response:

```json
{
    "total": 3,
    "offset": 0,
    "limit": 10,
    "scopes": [
        {
            "id": "bcfc02b6-f29a-4b3d-8c05-6e60b266faf6",
            "pat_id": "d309ebe9-42f2-4324-9e60-4cea9fbef684",
            "optional_domain_id": "69bdd878-5d6a-4d32-afa9-d9a623b44a6e",
            "entity_type": "channels",
            "entity_id": "*",
            "operation": "create"
        },
        {
            "id": "0fe730f9-2a40-4147-8ac3-8df9ac4e8717",
            "pat_id": "d309ebe9-42f2-4324-9e60-4cea9fbef684",
            "optional_domain_id": "69bdd878-5d6a-4d32-afa9-d9a623b44a6e",
            "entity_type": "clients",
            "entity_id": "*",
            "operation": "create"
        },
        {
            "id": "a9535a49-bf83-4e86-85ac-fc59d8575f9a",
            "pat_id": "d309ebe9-42f2-4324-9e60-4cea9fbef684",
            "optional_domain_id": "69bdd878-5d6a-4d32-afa9-d9a623b44a6e",
            "entity_type": "dashboards",
            "entity_id": "*",
            "operation": "share"
        }
    ]
}
```

#### Deleting Scopes for a PAT

The scope id is required in order to delete the dashboard scope with operation share.

```bash
curl --location --request PATCH 'http://localhost:9001/pats/{{PATID}}/scope/remove' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer <access_token>' \
--data '{
    "scopes_id": ["a9535a49-bf83-4e86-85ac-fc59d8575f9a"]
}'
```

> **NOTE:**
> No response is expected.

#### Deleting all Scopes for a PAT

```bash
curl --location --request DELETE 'http://localhost:9001/pats/{{PATID}}/scope' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer <access_token>'
```

> **NOTE:**
> No response is expected.

### Authentication and Authorization Process

1. **Authentication**: The system first verifies that the PAT was legitimately issued by the platform.
2. **Authorization**: The system then checks if the requested API operation is permitted by the token's defined scope.

When making API requests, include the PAT in the Authorization header:

```json
Authorization: Bearer pat_<encoded-user-and-pat-id>_<random-string>
```

#### Example: Creating a Client Using PAT

```bash
curl --location 'http://localhost:9006/c16c980a-9d4c-4793-8fb2-c81304cf1d9f/clients' \
--header 'accept: application/json' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer pat_etKoiXKTR6a0zdgsBHC00qJQAiaV3EKFh+Lmk+SgqXY=_u7@5fyjgti9V@#Bw^bS*SPmX3OnH=HTvKwmIbxIuyBjoI|6FASo9egjKD^u-M$b|2Dpt3CXZtv&4k+hmYYjk&C$57AV59P%-iDV0' \
--data '{
  "name": "test client",
  "tags": [
    "tag1",
    "tag2"
  ],
  "metadata":{"units":"km"},
  "status": "enabled"
}'
```

This example shows how to create a client in a specific domain (`c16c980a-9d4c-4793-8fb2-c81304cf1d9f`) using a PAT for authentication. The PAT must have the appropriate scope (e.g., `clients` entity type with `create` operation) for this domain.

#### Example of Authorization Failure

If the PAT used above with client and channel creation permissions attempts to create a group, the request will be denied and
the expected is error:

```bash
{
    "error": "",
    "message": "failed to authorize PAT"
}
```

## Usage

For more information about API, please check out the [API documentation](https://docs.api.supermq.abstractmachines.fr/?urls.primaryName=auth.yml).
