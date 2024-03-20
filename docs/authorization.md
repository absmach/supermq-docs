# Authorization

Magistrala allows for fine-grained control over user permissions, taking into account hierarchical relationships between entities domains, groups, channels, and things. The structure and functionality of an authorization system implemented using [SpiceDB](https://github.com/authzed/spicedb) and its associated [schema language](https://authzed.com/docs/reference/schema-lang). `auth` service backed by SpiceDB manages permissions for users, domains, groups, channels, and things.

## Domains

Domain contains **Things**, **Channels**, and **Groups**. A **User** can be a member of a domain with different types of available relations. This relation provides access control to the entities in the domain.

### Domain Entities

#### Overview

In Magistrala, **things**, **channels**, and **groups** are inherently associated with one particular domain. This means that every **group**, including its sub-groups, every **thing**, and every **channel** is owned by and belongs to a specific domain. Domain acts like a kind of namespace.

```mermaid
graph TD
   Do[Domain]
   Gr["Groups + Sub Groups"]
   Th[Things]
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
      Th[Thing]
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

Domain holds entities such as `groups`, `channels`, and `things`.
The entities created in a domain don't have any hierarchical structure between them.

Example: In `domain_1` a user creates the following entities `group_1`, `group_2`, `thing_1`, `thing_2`, `channel_1`, `channel_2`. By default, there is no relation between the entities, until the user assigns a relation between the entities

```mermaid
graph
   subgraph domain_1
      direction TB
      Gr1["group_1"]
      Gr2["group_2"]

      Th1["thing_1"]
      Th2["thing_2"]


      Ch1["channel_1"]
      Ch2["channel_2"]

   end
```

##### Channel Thing Connect/Disconnect

`Thing` represents a device (or an application) connected to Magistrala that uses the platform for message exchange with other `things`.

`Channel` is a message conduit between things connected to it. It serves as a message topic that can be consumed by all of the things connected to it.
Things can publish or subscribe to the channel.

Thing and channel can be connected to multiple channels using the following API.

```bash
curl -sSiX POST http://localhost/connect -H "Content-Type: application/json" -H "Authorization: Bearer <domain_user_access_token>" -d @- << EOF
{  
  "thing_id": "<thing_id>",
  "channel_id": "<channel_id>"
}  
EOF 
```

_*The below diagram shows `thing_1` is connected to `channel_1` and `channel_2` , then `thing_2` is connected to `channel_2`. This relationship can be established using the provided request*_

```mermaid
graph
   subgraph domain_1
      direction BT
      Gr1["group_1"]
      Gr2["group_2"]

      Th1["thing_1"]
      Th2["thing_2"]

      Ch1["channel_1"]
      Ch2["channel_2"]


      Th1 --->|connect| Ch1
      Th1 --->|connect| Ch2

      Th2 --->|connect| Ch2
   end
```

##### Channel Group Relation

A group serves as a parent entity that can contain both groups and channels as children. Child groups, in turn, can consist of further child groups or channels, forming a nested hierarchy. Notably, channels, which are distinct entities, cannot have child channels but can connect to multiple things. The concept of parentage signifies the relationship between higher-level entities and their subordinate components. Ancestors in this system refer to entities higher up in the hierarchy, and while a child group can have multiple ancestors, a channel can only belong to a single parent group. This hierarchical arrangement provides a structured and organized framework for managing information within the Magistrala.

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

      Th1["thing_1"]
      Th2["thing_2"]

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

      Th1["thing_1"]
      Th2["thing_2"]

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

An example group with channels, things, and groups (sub-groups) within the domain.
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

      Th1["thing_1"]
      Th2["thing_2"]
      Th3["thing_3"]
      Th4["thing_4"]
      Th5["thing_5"]
      Th6["thing_6"]



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


    Th1["thing_1"]
    Th2["thing_2"]
    Th3["thing_3"]
    Th4["thing_4"]
    Th11["thing_11"]
    Th22["thing_22"]
    Th33["thing_33"]

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

In Magistrala, when a new user registers, they don't automatically have access to domains.
The domain administrator must invite the user to the domain and assign them a role, such as administrator, editor, viewer, or member.

Domain administrator can invite an existing user in Magistrala or invite new users to the domain by e-mail ID.
After the user registers with Magistrala, the user can accept the invitations to the domain.

All the users in Magistrala are allowed to create a new domain.
The user who creates a domain automatically becomes the domain administrator.

Users can have any one of the following relations with a domain

- [Administrator](#domain-administrator)
- [Editor](#domain-editor)
- [Viewer](#domain-viewer)
- [Member](#domain-member)

**Let's take the below domain_1 with entities for explaining about user domain relationship.**

![domain_users](diagrams/domain_users.drawio)

### Domain Administrator

Users with administrator relations have full control over all entities (things, channels, groups) within the domain. They can perform actions like creating, updating, and deleting entities created by others. Administrators are also allowed to create their own entities and can view and update the ones they have created.

**Example:**
**user_1** is **administrator** of **domain_1**. **user_1 can view all entities created by others and have administrator access to all entities in the domain**.

![domain_users_administrator](diagrams/domain_users_administrator.drawio)

### Domain Editor

Users with editor relations have access to update all entities (things, channels, groups) created by others within the domain. Editor are also allowed to create their own entities and can view and update the ones they have created.

**Example:**
**user_2** is **editor** of **domain_1**. **user_2 can view all entities and have edit access to groups and channel entities, view access to thing entities in the domain, and also able to create & manage new things, channels & groups**.

![domain_users_editor](diagrams/domain_users_editor.drawio)

### Domain Viewer

Users with viewer relations have access to view all entities (things, channels, groups) created by others within the domain. Viewer are also allowed to create their own entities and can view and update the ones they have created.

**Example:**
**user_3** is **viewer** of **domain_1**. **user_3 can only view entities that are created by others in the domain and <span style="color:blue"> also able to create & manage new things, channels & groups** </span>

![domain_users_viewer](diagrams/domain_users_viewer.drawio)

### Domain Member

Users with member relations could not view and no access to entities (things, channels, groups) created by others within the domain. Members are also allowed to create their own entities and can view and update the ones they have created.
Domain members will not have access by default to any of the entities in the Domain, access shall be granted for specific entities by the domain administrator or individual entity administrator.

**Example:**
**user_4 , user_5, user_6, user_7, user_8, user_9** is **member** of **domain_1**. **These member relation users can able to create & manage new things, channels & groups in the domain. They can have access to the entities to which they have a relation in the domain. They could not view and manage other entities to which they don't have any relation in domain**.
!!! note "Note: All other users having administrator, editor, viewer relation with domain will also have member relation inherit with domain, which allows them to create new things, channels & groups."

![domain_users_member](diagrams/domain_users_member.drawio)

After the user sign-up to Magistrala, the user is allowed to create a new domain or join an existing domain via invitations, without domain user could not create _things_, _channels_, _groups_.

All operations, including creating, updating, and deleting things, channels, and groups, occur at the domain level. For instance, when a user creates a new thing using an access token, the newly created thing automatically becomes associated with a specific domain. The domain information is extracted from the access token. When the user obtains a token, the user should specify the domain for which they want to operate.

So to do operations on a domain, an access token for the domain is required. This can be obtained in two ways which is explained in [next section](#tokens-and-domain-tokens).

## Tokens and Domain Tokens

JWT token are used in Magistrala for authentication and authorization. The JWT token has domain, exp, iat, iss, sub, type, and user fields.

Example JWT Token:

```json
{
  "domain": "",
  "exp": 1706544967,
  "iat": 1706541367,
  "iss": "magistrala.auth",
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

Actions related to the creation, updation, and deletion of things, channels, and groups are not permitted, requests will fail in authorization. In magistrala operations related to things, channels, and groups take place in domain level. So for these kinds of operations, a JWT token with a domain field containing the operating domain ID is required.

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
  "iss": "magistrala.auth",
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
  "iss": "magistrala.auth",
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
  "iss": "magistrala.auth",
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
  "iss": "magistrala.auth",
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

Users assigned to a domain with any relationship (administrator, editor, viewer, member ) will have access to create entities (things, groups, channels).

Domain administrator or individual entity administrator shall grant access to domain member for specific entities.

## Groups Relations

Like domains, groups also have four types of relations

- [Administrator](#group-administrator)
- [Editor](#group-editor)
- [Viewer](#group-viewer)

### Group Administrator

Group administrator users have access to update, delete, assign, and unassign to the group and also have access to update, delete, assign, and unassign all of its child entities

From the [previous viewer example](#domain-viewer), let's take **user_3** who has **viewer relation** with **domain_1**, which means **user_3 will be able to view all the entities created by others but cannot make any edits or updates on them.** ***<span style="color:blue">user_3 will have access to create entities in domain_1 </span>***

**user_3 creates new thing_101, channel_101, and group_101**.

**user_3 request to create thing_101:**

```bash
curl -sSiX POST 'http://localhost/things' -H "Content-Type: application/json" -H "Authorization: Bearer <DOMAIN_ACCESS_TOKEN_>" -d @- << EOF
{
  "credentials": {
    "secret": "a1ca33c0-367e-402b-a239-ff1255fdc440"
  },
  "name": "thing_101"
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
So **user_3** is **administrator** of **thing_101, channel_101 and group_101.**

![group_users_administrator_1](diagrams/group_users_administrator_1.drawio)

!!! Note "user_3 will also have domain viewer relation to thing_101, channel_101, and group_101"

user_3 can make these entities (thing_101, channel_101, group_101) in a hierarchical structure by assigning relations between entities
Example: Connect thing_101 & channel_101, assign group_101 as parent of channel_101.

**user_3 request for connect thing_101 & channel_101:**

```bash
curl -sSiX POST 'http://localhost/connect' -H "Content-Type: application/json" -H "Authorization: Bearer <DOMAIN_ACCESS_TOKEN_>" -d @- << EOF
{
  "thing_id": "<thing_101_id>",
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

![group_users_administrator_2](diagrams/group_users_administrator_2.drawio)

***Members of domain 1 will not have access by default to any of the entities in domain 1, access shall be granted for specific entities by domain administrator or individual entity administrator.***

**Administrator of group_101 (user_3), assigns user_4 with administrator relation.**
**When domain member user_4 becomes an administrator of group_101, user_4 can able to update, delete, assign, and unassign to group_101. Since group_101 has channel_101 and thing_101 as children. The user_5 has administrator access on group_101 child entities channel_101 and thing_101.**

**user_3 request for assign user_4 as administrator for group_101:**

```bash
curl -sSiX POST 'http://localhost/domains/<DOMINA_1_ID>/users/assign'  -H "Content-Type: application/json" -H "Authorization: Bearer <DOMAIN_ACCESS_TOKEN_>" -d @- << EOF
{
  "user_ids" : ["<user_4 ID>"],
  "relation" : "administrator"
}
```

![group_users_administrator_3](diagrams/group_users_administrator_3.drawio)

### Group Editor

Group editor users have access to view, update, assign, and unassign to the group and also have access to view, update, assign, and unassign all of its child channel and group entities, group editor have only view access to child thing entities in group

**Administrator of group_101 (user_3/user_4), assigns user_5 with editor relation.**
**When domain member user_5 becomes an editor of group_101, user_5 can able to update, assign, and unassign to group_101. Since group_101 has channel_101 and thing_101 as children. The user_5 has editor access to the group child entities channels, things, and groups. In this case, user_5 has editor access to group_101, and also has edit access to its child entities channel_101 and thing_101**

![group_users_editor](diagrams/group_users_editor.drawio)

### Group Viewer

Group viewer users have access to view group and also have access to view all of its child entities

**When domain member user_6 becomes a viewer of group_101, user_6 can able to view all the child and nested child entities in group_101. user_6 can assign child entities under group_101 and also assign child entities under any other group and channels that are children of group_101.**

![group_users_viewer](diagrams/group_users_viewer.drawio)

## Examples

### Domain Viewer with Channel & Thing

user_6 creates new channel and thing with the names channel_201 and thing_201 respectively. Then connects both channel_201 and thing_201.

![group_users_viewer_1](diagrams/group_users_viewer_1.drawio)

Now user_5 can able to assign group_101 as a parent for channel_201

![group_users_viewer_2](diagrams/group_users_viewer_2.drawio)

When channel_201 was assigned as a child of group_101, all the administrators, editors, and viewers of group_101 got the same access (relation) to channel_201 and thing_201

![group_users_viewer_3](diagrams/group_users_viewer_3.drawio)

### Multiple Domain Members with Group, Channel & Thing

user_8 creates a new group with the name group_301
user_9 creates a new thing and channel with the names thing_301 and channel_301 respectively, then connects both thing and channel.
![group_users_member_11](diagrams/group_users_member_11.drawio)

user_8 can able to assign channel_301 as a child of group_301
![group_users_member_12](diagrams/group_users_member_12.drawio)
When channel_301 is assigned as a child of group_301, then the administrators, editors, and viewers of group_301 get the same respective access to channel_301.
The administrator, editor, and viewer of channel_301 get the same respective access to thing_301.
So here user_8 becomes the administrator of both channel_301 and thing_301

user_5 can able to assign group_301 as a child of group_101
![group_users_member_13](diagrams/group_users_member_13.drawio)

When group_301 becomes a child of group_101, then the administrator, editor, and viewer of group_101 get the same respective access to group_301.
The administrator, editor, and viewer of group_301 get the same respective access to channel_301.
The administrator, editor, and viewer of channel_301 get the same respective access to thing_301.
So here user_5 becomes the editor of group_301, channel_301, and thing_301, user_4 becomes administrator of group_301, channel_301, and thing_301.
user_8 has administrator access only to group_301 and its child entities channel_301 and thing_301.
![group_users_member_14](diagrams/group_users_member_14.drawio)

## User Registration

There are two ways to user get registered to Magistrala, self-register and register new users by super admin.
User registration is self register default which can be changed by following environment variable:

```env
MG_USERS_ALLOW_SELF_REGISTER=true
```
