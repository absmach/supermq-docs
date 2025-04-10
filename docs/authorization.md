---
title: Authorization
---

SuperMQ allows for fine-grained control over user permissions, taking into account hierarchical relationships between entities domains, groups, channels, and clients. The structure and functionality of an authorization system implemented using [SpiceDB](https://github.com/authzed/spicedb) and its associated [schema language](https://authzed.com/docs/reference/schema-lang). `auth` service backed by SpiceDB manages permissions for users, domains, groups, channels, and clients.

## Domains

Domain contains **Clients**, **Channels**, and **Groups**. A **User** can be a member of a domain with different types of available relations. This relation provides access control to the entities in the domain.

### Domain Entities

#### Overview

In SuperMQ, **clients**, **channels**, and **groups** are inherently associated with one particular domain. This means that every **group**, including its sub-groups, every **client**, and every **channel** is owned by and belongs to a specific domain. Domain acts like a kind of namespace.

```mermaid
graph TD
   Do[Domain]
   Gr["Groups + Sub Groups"]
   Th[Clients]
   Ch[Channels]

   Do --->|owns| Gr
   Do --->|owns| Ch
   Do --->|owns| Th

```

Entities within domains have relationships with other entities in hierarchical structure.

```mermaid
graph
   subgraph Domain
      direction BT
      Gr[Group]
      Th[Client]
      SG["Group (Sub Group)"]
      Ch[Channel]

      Th --->|connects| Ch
      Ch --->|parent| SG
      Ch --->|parent| Gr
      SG --->|parent| Gr
   end
style Domain stroke-width:3px,margin-top:10px,margin-bottom:10px
```

#### Domain Entities Relations

Domain holds entities such as `groups`, `channels`, and `clients`.
The entities created in a domain don't have any hierarchical structure between them.

Example: In `domain_1` a user creates the following entities `group_1`, `group_2`, `client_1`, `client_2`, `channel_1`, `channel_2`. By default, there is no relation between the entities, until the user assigns a relation between the entities

```mermaid
graph
   subgraph domain_1
      direction TB
      Gr1["group_1"]
      Gr2["group_2"]

      Th1["client_1"]
      Th2["client_2"]


      Ch1["channel_1"]
      Ch2["channel_2"]

   end
```

##### Channel Client Connect/Disconnect

`Client` represents a device (or an application) connected to SuperMQ that uses the platform for message exchange with other `clients`.

`Channel` is a message conduit between clients connected to it. It serves as a message topic that can be consumed by all of the clients connected to it.
Clients can publish or subscribe to the channel.

Client and channel can be connected to multiple channels using the following API.

```bash
curl -sSiX POST http://localhost/connect -H "Content-Type: application/json" -H "Authorization: Bearer <domain_user_access_token>" -d @- << EOF
{  
  "client_id": "<client_id>",
  "channel_id": "<channel_id>"
}  
EOF 
```

_*The below diagram shows `client_1` is connected to `channel_1` and `channel_2` , then `client_2` is connected to `channel_2`. This relationship can be established using the provided request*_

```mermaid
graph
   subgraph domain_1
      direction BT
      Gr1["group_1"]
      Gr2["group_2"]

      Th1["client_1"]
      Th2["client_2"]

      Ch1["channel_1"]
      Ch2["channel_2"]


      Th1 --->|connect| Ch1
      Th1 --->|connect| Ch2

      Th2 --->|connect| Ch2
   end
```

##### Channel Group Relation

A group serves as a parent entity that can contain both groups and channels as children. Child groups, in turn, can consist of further child groups or channels, forming a nested hierarchy. Notably, channels, which are distinct entities, cannot have child channels but can connect to multiple clients. The concept of parentage signifies the relationship between higher-level entities and their subordinate components. Ancestors in this system refer to entities higher up in the hierarchy, and while a child group can have multiple ancestors, a channel can only belong to a single parent group. This hierarchical arrangement provides a structured and organized framework for managing information within the SuperMQ.

Assigning a group as the parent of a channel can be achieved through the following request.

```bash
curl -sSiX POST 'http://localhost/channels/<channel_id>/groups/assign' -H "Content-Type: application/json" -H "Authorization: Bearer <domain_user_access_token>" -d @- << EOF
{
  "group_ids" : [ "<group_id_1>", "<group_id_2>" ]
}
EOF
```

_*The diagram below illustrates the parent relationship between `channel_1` and `channel_2` with `group_2`. This relationship can be established using the provided request.*_

```mermaid
graph
   subgraph domain_1
      direction BT
      Gr1["group_1"]
      Gr2["group_2"]

      Th1["client_1"]
      Th2["client_2"]

      Ch1["channel_1"]
      Ch2["channel_2"]


      Th1 --->|connect| Ch1
      Th1 --->|connect| Ch2

      Th2 --->|connect| Ch2

      Ch1 --->|parent| Gr2
      Ch2 --->|parent| Gr2
   end
```

##### Group Group Relation

Groups can establish a parent-child relationship with other groups. The children groups are sub-group and they can also have children groups in nested fashion

Assigning a group as the parent to another group can be achieved through the following request.

```bash
curl -sSiX POST 'http://localhost/groups/<parent_group_id>/groups/assign' -H "Content-Type: application/json" -H "Authorization: Bearer <domain_user_access_token>" -d @- << EOF
{
  "group_ids": ["<child_group_id_1>","<child_group_id_2>"]
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

      Th1["client_1"]
      Th2["client_2"]

      Ch1["channel_1"]
      Ch2["channel_2"]


      Th1 --->|connect| Ch1
      Th1 --->|connect| Ch2

      Th2 --->|connect| Ch2

      Ch1 --->|parent| Gr2
      Ch2 --->|parent| Gr2

      Gr2 --->|parent| Gr1
   end
```

##### Domain Entities Relation Examples

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

      Th1["client_1"]
      Th2["client_2"]
      Th3["client_3"]
      Th4["client_4"]
      Th5["client_5"]
      Th6["client_6"]



      Ch1["channel_1"]
      Ch2["channel_2"]
      Ch3["channel_3"]
      Ch4["channel_4"]

      Gr11 --->|parent| Gr1
      Gr12 --->|parent| Gr1

      Ch1 --->|parent| Gr11
      Th1 --->|connects| Ch1
      Th5 --->|connects| Ch1

      Ch2 --->|parent| Gr1
      Th2 --->|connects| Ch2

      Gr21 --->|parent| Gr2
      Ch3 --->|parent| Gr21
      Th3 --->|connects| Ch3

      Gr22 --->|parent| Gr21
      Ch4 --->|parent| Gr22
      Th4 --->|connects| Ch4
      Th6 --->|connects| Ch4
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


    Th1["client_1"]
    Th2["client_2"]
    Th3["client_3"]
    Th4["client_4"]
    Th11["client_11"]
    Th22["client_22"]
    Th33["client_33"]

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


    Th1 --->|connects| Ch1
    Th11 --->|connects| Ch1

    Th2 --->|connects| Ch2
    Th22 --->|connects| Ch2
    Th3 --->|connects| Ch3
    Th33 --->|connects| Ch3
    Th4 --->|connects| Ch4

  end
```

## User Domain Relationship

In SuperMQ, when a new user registers, they don't automatically have access to domains.
The domain administrator must invite the user to the domain and assign them a role, such as administrator, editor, viewer, or member.

Domain administrator can invite an existing user in SuperMQ or invite new users to the domain by e-mail ID.
After the user registers with SuperMQ, the user can accept the invitations to the domain.

All the users in SuperMQ are allowed to create a new domain.
The user who creates a domain automatically becomes the domain administrator.

Users can have any one of the following relations with a domain

- [Administrator](#domain-administrator)
- [Editor](#domain-editor)
- [Viewer](#domain-viewer)
- [Member](#domain-member)

**Let's take the below domain_1 with entities for explaining about user domain relationship.**

![domain_users](diagrams/domain_users.svg)

### Domain Administrator

Users with administrator relations have full control over all entities (clients, channels, groups) within the domain. They can perform actions like creating, updating, and deleting entities created by others. Administrators are also allowed to create their own entities and can view and update the ones they have created.

**Example:**
**user_1** is **administrator** of **domain_1**. **user_1 can view all entities created by others and have administrator access to all entities in the domain**.

![domain_users_administrator](diagrams/domain_users_administrator.svg)

### Domain Editor

Users with editor relations have access to update all entities (clients, channels, groups) created by others within the domain. Editor are also allowed to create their own entities and can view and update the ones they have created.

**Example:**
**user_2** is **editor** of **domain_1**. **user_2 can view all entities and have edit access to groups and channel entities, view access to client entities in the domain, and also able to create & manage new clients, channels & groups**.

![domain_users_editor](diagrams/domain_users_editor.svg)

### Domain Viewer

Users with viewer relations have access to view all entities (clients, channels, groups) created by others within the domain. Viewer are also allowed to create their own entities and can view and update the ones they have created.

**Example:**
**user_3 can only view entities that are created by others in the domain and <span style={{ color:'blue' }}>also able to create & manage new clients, channels & groups</span>**

![domain_users_viewer](diagrams/domain_users_viewer.svg)

### Domain Member

Users with member relations could not view and no access to entities (clients, channels, groups) created by others within the domain. Members are also allowed to create their own entities and can view and update the ones they have created.
Domain members will not have access by default to any of the entities in the Domain, access shall be granted for specific entities by the domain administrator or individual entity administrator.

**Example:**
**user_4 , user_5, user_6, user_7, user_8, user_9** is **member** of **domain_1**. **These member relation users can able to create & manage new clients, channels & groups in the domain. They can have access to the entities to which they have a relation in the domain. They could not view and manage other entities to which they don't have any relation in domain**.
!!! note "Note: All other users having administrator, editor, viewer relation with domain will also have member relation inherit with domain, which allows them to create new clients, channels & groups."

![domain_users_member](diagrams/domain_users_member.svg)

After the user sign-up to SuperMQ, the user is allowed to create a new domain or join an existing domain via invitations, without domain user could not create _clients_, _channels_, _groups_.

All operations, including creating, updating, and deleting clients, channels, and groups, occur at the domain level. For instance, when a user creates a new client using an access token, the newly created client automatically becomes associated with a specific domain. The domain information is extracted from the access token. When the user obtains a token, the user should specify the domain for which they want to operate.

So to do operations on a domain, an access token for the domain is required. This can be obtained in two ways which is explained in [next section](#tokens-and-domain-tokens).

## Tokens and Domain Tokens

JWT token are used in SuperMQ for authentication and authorization. The JWT token has domain, exp, iat, iss, sub, type, and user fields.

Example JWT Token:

```json
{
  "domain": "",
  "exp": 1706544967,
  "iat": 1706541367,
  "iss": "supermq.auth",
  "sub": "",
  "type": 0,
  "user": "266d00f8-2284-4613-b732-3bd16e7cf8f2"
}
```

In JWT token, the domain field has **domain ID** and the user field has **user ID**.

If the domain field is empty, then with that JWT token following actions are permitted

- User profile update
- Domain creation & listing,
- Accept domain invitations

Actions related to the creation, update, and deletion of clients, channels, and groups are not permitted, requests will fail in authorization. SuperMQ operations related to clients, channels, and groups take place in domain level. So for these kinds of operations, a JWT token with a domain field containing the operating domain ID is required.

There are two ways to obtain JWT token for a particular domain

### Option 1: Passing domain_id while obtaining new token

**Request:**

```bash
curl -sSiX POST 'http://localhost/users/tokens/issue'  -H "Content-Type: application/json" -H "Authorization: Bearer <domain_user_access_token>" -d @- << EOF
{
  "identity": "user1@example.com",
  "secret": "12345678",
  "domain_id": "903f7ede-3308-4206-89c2-e99688b612f7"
}
EOF
```

In this request, if the domain ID is empty or if the field is not added, then in response JWT token will have an empty domain field.

**Response:**

```json
{
  "access_token": "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJkb21haW4iOiI5MDNmN2VkZS0zMzA4LTQyMDYtODljMi1lOTk2ODhiNjEyZjciLCJleHAiOjE3MDY2MDM0NDcsImlhdCI6MTcwNjU5OTg0NywiaXNzIjoibWFnaXN0cmFsYS5hdXRoIiwic3ViIjoiOTAzZjdlZGUtMzMwOC00MjA2LTg5YzItZTk5Njg4YjYxMmY3XzU3NDhkZTY5LTJhNjYtNDBkYS1hODI5LTFiNDdmMDJlOWFkYiIsInR5cGUiOjAsInVzZXIiOiI1NzQ4ZGU2OS0yYTY2LTQwZGEtYTgyOS0xYjQ3ZjAyZTlhZGIifQ.c8a8HhVAbkdq_qZnd1DWHtkoNDPQc6XJY6-UcqqCygRR9svjgkwetN3rmIOWPNV5CjPh5lqlzWv1cOLruKBmzw",
  "refresh_token": "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJkb21haW4iOiI5MDNmN2VkZS0zMzA4LTQyMDYtODljMi1lOTk2ODhiNjEyZjciLCJleHAiOjE3MDY2ODYyNDcsImlhdCI6MTcwNjU5OTg0NywiaXNzIjoibWFnaXN0cmFsYS5hdXRoIiwic3ViIjoiOTAzZjdlZGUtMzMwOC00MjA2LTg5YzItZTk5Njg4YjYxMmY3XzU3NDhkZTY5LTJhNjYtNDBkYS1hODI5LTFiNDdmMDJlOWFkYiIsInR5cGUiOjEsInVzZXIiOiI1NzQ4ZGU2OS0yYTY2LTQwZGEtYTgyOS0xYjQ3ZjAyZTlhZGIifQ.SEMvEw2hchsvPYJWqnHMKlUmgjfqAvFcjeCDXyvS2xSGsscEci3bMrUohaJNkNDWzTBiBinV7nEcPrwbxDfPBQ"
}
```

### Option 2: Get new access and refresh token through the refresh endpoint by passing domain_id

In most of the cases user login domain is under determinable. This method will be useful for those kind of cases.

**Step 1: Get token without domain ID**
**Request:**

```bash
curl -sSiX POST 'http://localhost/users/tokens/issue'  -H "Content-Type: application/json" -H "Authorization: Bearer <domain_user_access_token>" -d @- << EOF
{
  "identity": "user1@example.com",
  "secret": "12345678"
}
EOF
```

**Response:**

```json
{
  "access_token": "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJkb21haW4iOiIiLCJleHAiOjE3MDY2MDM1MjYsImlhdCI6MTcwNjU5OTkyNiwiaXNzIjoibWFnaXN0cmFsYS5hdXRoIiwic3ViIjoiIiwidHlwZSI6MCwidXNlciI6IjU3NDhkZTY5LTJhNjYtNDBkYS1hODI5LTFiNDdmMDJlOWFkYiJ9.Cc2Qj_z3gcUTjDo7lpcUVx9ymnUfClwt28kayHvMhY27eDu1vWMAZb_twQ85pbSlf12juo8P_YJcWKl3rDEokQ",
  "refresh_token": "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJkb21haW4iOiIiLCJleHAiOjE3MDY2ODYzMjYsImlhdCI6MTcwNjU5OTkyNiwiaXNzIjoibWFnaXN0cmFsYS5hdXRoIiwic3ViIjoiIiwidHlwZSI6MSwidXNlciI6IjU3NDhkZTY5LTJhNjYtNDBkYS1hODI5LTFiNDdmMDJlOWFkYiJ9.SiVsctItdR0WFhRbg7omZgR_WDPlLfLF2ov2eqkE1EP8c7RruOEv-KST3xVsohY33t2xevrtorwbjMQsl1YV7Q"
}
```

**Decoded Access Token:**

```json
{
  "domain": "",
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
  "domain": "",
  "exp": 1706686326,
  "iat": 1706599926,
  "iss": "supermq.auth",
  "sub": "",
  "type": 1,
  "user": "5748de69-2a66-40da-a829-1b47f02e9adb"
}
```

In these tokens, the domain field will be empty. As said earlier, this token can be to for user profile update, domain creation & listing, accept domain invitations

**Step 2: List domains users have access**
**Request:**

```bash
curl -sSiX GET 'http://localhost/domains' -H "Authorization: Bearer <ACCESS_TOKEN_FROM_STEP_1>"
```

**Response:**

```json
{
  "total": 1,
  "offset": 0,
  "limit": 10,
  "status": "all",
  "domains": [
    {
      "id": "903f7ede-3308-4206-89c2-e99688b612f7",
      "name": "Domain 1",
      "alias": "domain_1",
      "status": "enabled",
      "permission": "administrator",
      "created_by": "5748de69-2a66-40da-a829-1b47f02e9adb",
      "created_at": "2024-01-30T07:30:36.89495Z",
      "updated_at": "0001-01-01T00:00:00Z"
    }
  ]
}
```

**Step 3: Send Request to Refresh endpoint with domain id**
**Request:**

```bash
curl -sSiX POST 'http://localhost/users/tokens/refresh' -H "Content-Type: application/json" -H "Authorization: Bearer <REFRESH_TOKEN_FROM_STEP_1>" -d @- << EOF
{
  "domain_id": "903f7ede-3308-4206-89c2-e99688b612f7"
}
EOF
```

!!! note "Note: Same request also used for switching between domains."

**Response:**

```json
{
  "access_token": "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJkb21haW4iOiI5MDNmN2VkZS0zMzA4LTQyMDYtODljMi1lOTk2ODhiNjEyZjciLCJleHAiOjE3MDY2MDM3MDYsImlhdCI6MTcwNjYwMDEwNiwiaXNzIjoibWFnaXN0cmFsYS5hdXRoIiwic3ViIjoiOTAzZjdlZGUtMzMwOC00MjA2LTg5YzItZTk5Njg4YjYxMmY3XzU3NDhkZTY5LTJhNjYtNDBkYS1hODI5LTFiNDdmMDJlOWFkYiIsInR5cGUiOjAsInVzZXIiOiI1NzQ4ZGU2OS0yYTY2LTQwZGEtYTgyOS0xYjQ3ZjAyZTlhZGIifQ.3_q4F9CWxmBVjItiE8uR01vlm0du_ISl75E-nfEcc-3IMqHEOLbz1WrDvGbaYcPZ-CQufZuP2j-zqR4lShnu2Q",
  "refresh_token": "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJkb21haW4iOiI5MDNmN2VkZS0zMzA4LTQyMDYtODljMi1lOTk2ODhiNjEyZjciLCJleHAiOjE3MDY2ODY1MDYsImlhdCI6MTcwNjYwMDEwNiwiaXNzIjoibWFnaXN0cmFsYS5hdXRoIiwic3ViIjoiOTAzZjdlZGUtMzMwOC00MjA2LTg5YzItZTk5Njg4YjYxMmY3XzU3NDhkZTY5LTJhNjYtNDBkYS1hODI5LTFiNDdmMDJlOWFkYiIsInR5cGUiOjEsInVzZXIiOiI1NzQ4ZGU2OS0yYTY2LTQwZGEtYTgyOS0xYjQ3ZjAyZTlhZGIifQ.KFUEGEx0LZStpokGnQHoMbpPRA5RUH7AR5RHRC46KcBIUoD4EcuWBiSreFwyRc4v-tcbp-CQQaBNGhqYMW4QZw"
}
```

**Decoded Access Token:**

```json
{
  "domain": "903f7ede-3308-4206-89c2-e99688b612f7",
  "exp": 1706603706,
  "iat": 1706600106,
  "iss": "supermq.auth",
  "sub": "903f7ede-3308-4206-89c2-e99688b612f7_5748de69-2a66-40da-a829-1b47f02e9adb",
  "type": 0,
  "user": "5748de69-2a66-40da-a829-1b47f02e9adb"
}
```

**Decoded Refresh Token:**

```json
{
  "domain": "903f7ede-3308-4206-89c2-e99688b612f7",
  "exp": 1706686506,
  "iat": 1706600106,
  "iss": "supermq.auth",
  "sub": "903f7ede-3308-4206-89c2-e99688b612f7_5748de69-2a66-40da-a829-1b47f02e9adb",
  "type": 1,
  "user": "5748de69-2a66-40da-a829-1b47f02e9adb"
}
```

## Assign Users to Domain

Domain creator becomes administrator of the domain by default. Domain administrator can assign users to a domain with the following relations administrator, editor, viewer, member. The details about these relations are described in this [section](#user-domain-relationship)

User can be assigned to domain with endpoint `/domain/<domain_id>/users/assign` with JSON body like below:

```json
{
  "user_ids" : ["<user_id>"],
  "relation" : "editor"
}
```

- **user_ids** : field contains an array of users' IDs
- **relation** : field contains any one of the following relations **administrator**, **editor**, **viewer**, **member**, The details about these relations are described in this [section](#user-domain-relationship)

**Example Request:**

```bash
curl -sSiX POST 'http://localhost/domains/903f7ede-3308-4206-89c2-e99688b612f7/users/assign'  -H "Content-Type: application/json" -H "Authorization: Bearer <DOMAIN_ACCESS_TOKEN_>"  -d @- << EOF
{
  "user_ids" : ["05dbd66a-ce38-4928-ac86-c1b44909be0d"],
  "relation" : "editor"
}
EOF
```

## Unassign Users from Domain

User can be unassigned to domain with endpoint `/domain/<domain_id>/users/unassign` with JSON body like below:

```json
{
  "user_ids" : ["<user_id>"],
  "relation" : "editor"
}
```

- **user_ids** : field contains an array of users' IDs
- **relation** : field contains any one of the following relations **administrator**, **editor**, **viewer**, **member**, The details about these relations are described in this [section](#user-domain-relationship)

**Example request:**

```bash
curl -sSiX POST 'http://localhost/domains/903f7ede-3308-4206-89c2-e99688b612f7/users/unassign' -H "Content-Type: application/json" -H "Authorization: Bearer <DOMAIN_ACCESS_TOKEN_>" -d @- << EOF
{
  "user_ids" : ["05dbd66a-ce38-4928-ac86-c1b44909be0d"],
  "relation" : "administrator"
}
EOF
```

## User Entities Relationship

Users assigned to a domain with any relationship (administrator, editor, viewer, member ) will have access to create entities (clients, groups, channels).

Domain administrator or individual entity administrator shall grant access to domain member for specific entities.

## Groups Relations

Like domains, groups also have four types of relations

- [Administrator](#group-administrator)
- [Editor](#group-editor)
- [Viewer](#group-viewer)

### Group Administrator

Group administrator users have access to update, delete, assign, and unassign to the group and also have access to update, delete, assign, and unassign all of its child entities

From the [previous viewer example](#domain-viewer), let's take **user_3** who has **viewer relation** with **domain_1**, which means **user_3 will be able to view all the entities created by others but cannot make any edits or updates on them.** **<span style={{ color:'blue' }}>user_3 will have access to create entities in domain_1 </span>**

**user_3 creates new client_101, channel_101, and group_101**.

**user_3 request to create client_101:**

```bash
curl -sSiX POST 'http://localhost/clients' -H "Content-Type: application/json" -H "Authorization: Bearer <DOMAIN_ACCESS_TOKEN_>" -d @- << EOF
{
  "credentials": {
    "secret": "a1ca33c0-367e-402b-a239-ff1255fdc440"
  },
  "name": "client_101"
}
EOF
```

**user_3 request to create channel_101:**

```bash
curl -sSiX POST 'http://localhost/channels' -H "Content-Type: application/json" -H "Authorization: Bearer <DOMAIN_ACCESS_TOKEN_>" -d @- << EOF
{
  "name": "chanel_101"
}
EOF
```

**user_3 request to create group_101:**

```bash
curl -sSiX POST 'http://localhost/groups' -H "Content-Type: application/json" -H "Authorization: Bearer <DOMAIN_ACCESS_TOKEN_>" -d @- << EOF
{
  "name": "group_101"
}
EOF
```

The user who creates the entity will be the administrator of the entity by default.
So **user_3** is **administrator** of **client_101, channel_101 and group_101.**

![group_users_administrator_1](diagrams/group_users_administrator_1.svg)

!!! Note "user_3 will also have domain viewer relation to client_101, channel_101, and group_101"

user_3 can make these entities (client_101, channel_101, group_101) in a hierarchical structure by assigning relations between entities
Example: Connect client_101 & channel_101, assign group_101 as parent of channel_101.

**user_3 request for connect client_101 & channel_101:**

```bash
curl -sSiX POST 'http://localhost/connect' -H "Content-Type: application/json" -H "Authorization: Bearer <DOMAIN_ACCESS_TOKEN_>" -d @- << EOF
{
  "client_id": "<client_101_id>",
  "channel_id": "<channel_101_id>"
}
EOF
```

**user_3 request for assign group_101 as parent of channel_101:**

```bash
curl -sSiX POST 'http://localhost/channels/<channel_101_id>/groups/assign' -H "Content-Type: application/json" -H "Authorization: Bearer <DOMAIN_ACCESS_TOKEN_>" -d @- << EOF
{
  "group_ids" : [ "<group_101_id>" ]
}
EOF
```

![group_users_administrator_2](diagrams/group_users_administrator_2.svg)

**Members of domain 1 will not have access by default to any of the entities in domain 1, access shall be granted for specific entities by domain administrator or individual entity administrator.**

**Administrator of group_101 (user_3), assigns user_4 with administrator relation.**
**When domain member user_4 becomes an administrator of group_101, user_4 can able to update, delete, assign, and unassign to group_101. Since group_101 has channel_101 and client_101 as children. The user_5 has administrator access on group_101 child entities channel_101 and client_101.**

**user_3 request for assign user_4 as administrator for group_101:**

```bash
curl -sSiX POST 'http://localhost/domains/<DOMINA_1_ID>/users/assign'  -H "Content-Type: application/json" -H "Authorization: Bearer <DOMAIN_ACCESS_TOKEN_>" -d @- << EOF
{
  "user_ids" : ["<user_4 ID>"],
  "relation" : "administrator"
}
```

![group_users_administrator_3](diagrams/group_users_administrator_3.svg)

### Group Editor

Group editor users have access to view, update, assign, and unassign to the group and also have access to view, update, assign, and unassign all of its child channel and group entities, group editor have only view access to child client entities in group

**Administrator of group_101 (user_3/user_4), assigns user_5 with editor relation.**
**When domain member user_5 becomes an editor of group_101, user_5 can able to update, assign, and unassign to group_101. Since group_101 has channel_101 and client_101 as children. The user_5 has editor access to the group child entities channels, clients, and groups. In this case, user_5 has editor access to group_101, and also has edit access to its child entities channel_101 and client_101**

![group_users_editor](diagrams/group_users_editor.svg)

### Group Viewer

Group viewer users have access to view group and also have access to view all of its child entities

**When domain member user_6 becomes a viewer of group_101, user_6 can able to view all the child and nested child entities in group_101. user_6 can assign child entities under group_101 and also assign child entities under any other group and channels that are children of group_101.**

![group_users_viewer](diagrams/group_users_viewer.svg)

## Examples

### Domain Viewer with Channel & Client

user_6 creates new channel and client with the names channel_201 and client_201 respectively. Then connects both channel_201 and client_201.

![group_users_viewer_1](diagrams/group_users_viewer_1.svg)

Now user_5 can able to assign group_101 as a parent for channel_201

![group_users_viewer_2](diagrams/group_users_viewer_2.svg)

When channel_201 was assigned as a child of group_101, all the administrators, editors, and viewers of group_101 got the same access (relation) to channel_201 and client_201

![group_users_viewer_3](diagrams/group_users_viewer_3.svg)

### Multiple Domain Members with Group, Channel & Client

user_8 creates a new group with the name group_301
user_9 creates a new client and channel with the names client_301 and channel_301 respectively, then connects both client and channel.
![group_users_member_11](diagrams/group_users_member_11.svg)

user_8 can able to assign channel_301 as a child of group_301
![group_users_member_12](diagrams/group_users_member_12.svg)
When channel_301 is assigned as a child of group_301, then the administrators, editors, and viewers of group_301 get the same respective access to channel_301.
The administrator, editor, and viewer of channel_301 get the same respective access to client_301.
So here user_8 becomes the administrator of both channel_301 and client_301

user_5 can able to assign group_301 as a child of group_101
![group_users_member_13](diagrams/group_users_member_13.svg)

When group_301 becomes a child of group_101, then the administrator, editor, and viewer of group_101 get the same respective access to group_301.
The administrator, editor, and viewer of group_301 get the same respective access to channel_301.
The administrator, editor, and viewer of channel_301 get the same respective access to client_301.
So here user_5 becomes the editor of group_301, channel_301, and client_301, user_4 becomes administrator of group_301, channel_301, and client_301.
user_8 has administrator access only to group_301 and its child entities channel_301 and client_301.
![group_users_member_14](diagrams/group_users_member_14.svg)

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

The PAT scope defines granular permissions across different entities. PATs can be scoped to the following entity types:

| Entity Type  | Description            |
| ------------ | ---------------------- |
| `groups`     | User groups            |
| `channels`   | Communication channels |
| `clients`    | Client applications    |
| `domains`    | Organizational domains |
| `users`      | User accounts          |
| `dashboards` | Dashboard interfaces   |
| `messages`   | Message content        |

**Wildcard Entity IDs**

When defining scopes for PATs, you can use the wildcard character `*` for the `entity_id` field to grant permissions for all entities of a specific type. This is particularly useful for automation tasks that need to operate on multiple resources.

For example:

- `"entity_id": "*"` - Grants permission for all entities of the specified type
- `"entity_id": "specific-id"` - Grants permission only for the entity with the specified ID

Using wildcards should be done carefully, as they grant broader permissions. Always follow the principle of least privilege by granting only the permissions necessary for the intended use case.

### Example Scope JSON

```json
{
    "scopes": [
        {
            "optional_domain_id": "{{DOMAINID}}",
            "entity_type": "clients",
            "operation": "create",
            "entity_id": "*" // this for all clients in domain
        },
        {
            "optional_domain_id": "{{DOMAINID}}",
            "entity_type": "channels",
            "operation": "create",
            "entity_id": "{{CHANNELID}}" // for particular channel in domain
        },
        {
            "entity_type": "dashboards",
            "optional_domain_id": "{{DOMAINID}}",
            "operation": "share",
            "entity_id": "*" // this for all dashboards in domain
        }
    ]
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
