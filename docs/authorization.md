# Authorization

Magistrala allows for fine-grained control over user permissions, taking into account hierarchical relationships between entities domains, groups, channels and things.The structure and functionality of an authorization system implemented using [Spicedb](https://github.com/authzed/spicedb) and its associated [schema language](https://authzed.com/docs/reference/schema-lang). `auth` service backed by SpiceDB manages permissions for users, domains, groups, channels and things.

## Domains

Domain contains **Things**, **Channels**, and **Groups**. **Users** can be member of Domain with different types of available relation, These relation provides access control to the entities in domain.

### Domain Entities

#### Overview

In Magistrala, **Things**, **Channels**, and **Groups** are inherently associated with one particular Domain. This means that every **Group**, including its sub-groups, every **Thing**, and every **Channel** is owned by and belongs to a specific Domain. Domain acts like kind of namespace.

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

Domain hold all entities such as Groups, Channels and Things.
The entities created in Domain doesn't creates have hierarchical structure within domain.

Example: In Domain_1 a user creates following entities Group 1, Group_2, Thing 1, Thing 2, Channel 1, Channel 2. By default their will be relation betweens the entities, until user assigns relation between entities

```mermaid
graph
   subgraph Domain_1
      direction TB
      Gr1["Group 1"]
      Gr2["Group 2"]

      Th1["Thing 1"]
      Th2["Thing 2"]


      Ch1["Channel 1"]
      Ch2["Channel 2"]

   end
```

##### Channel Thing Connect/Disconnect

`Thing` represents devices (or applications) connected to Magistrala that uses the platform for message exchange with other `things`.

`Channel` represents a communication channel. It serves as message topic that can be consumed by all of the things connected to it.
To Channel communication topics things can publish/Subscribe the messages.

Thing and Channel can be connected to multiple channels using the following API.

```bash
curl --location 'http://localhost/connect' \
--header 'Content-Type: application/json' \
--header 'Accept: application/json' \
--header 'Authorization: Bearer <DOMAIN_USER_ACCESS_TOKEN>' \
--data '{
  "thing_id": "<Thing 1 ID>",
  "channel_id": "<Channel 1 ID>"
}'
```

_*The below diagram shows Thing 1 connect to channel 1 , channel 2 and Thing 2 connect to Thing 2. This relationship can be established using the provided request*_

```mermaid
graph
   subgraph Domain_1
      direction BT
      Gr1["Group 1"]
      Gr2["Group 2"]

      Th1["Thing 1"]
      Th2["Thing 2"]

      Ch1["Channel 1"]
      Ch2["Channel 2"]


      Th1 --->|connect| Ch1
      Th1 --->|connect| Ch2

      Th2 --->|connect| Ch2
   end
```

##### Channel Group Relation

Groups are entities that can be linked as parents to channels.

Assigning a group as the parent of a channel can be achieved through the following request.

```bash
curl --location 'http://localhost/channels/<Channel 1 ID>/groups/assign' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer <DOMAIN_USER_ACCESS_TOKEN>' \
--data '{
    "group_ids" : [ "<Group 2 ID>" ]
}'
```

_*The diagram below illustrates the parent relationship between Channel 1 and Channel 2 with Group 2. This relationship can be established using the provided request.*_

```mermaid
graph
   subgraph Domain_1
      direction BT
      Gr1["Group 1"]
      Gr2["Group 2"]

      Th1["Thing 1"]
      Th2["Thing 2"]

      Ch1["Channel 1"]
      Ch2["Channel 2"]


      Th1 --->|connect| Ch1
      Th1 --->|connect| Ch2

      Th2 --->|connect| Ch2

      Ch1 --->|parent| Gr2
      Ch2 --->|parent| Gr2
   end
```

##### Group Group Relation

Groups can establish a parent-child relationship with other groups. The children groups are SubGroup and they can also children groups in  nested fashion

Assigning a group as the parent to another group can be achieved through the following request.

```bash
curl --location 'http://localhost/groups/<Parent Group ID>/groups/assign' \
--header 'Content-Type: application/json' \
--header 'Accept: application/json' \
--header 'Authorization: Bearer <DOMAIN_USER_ACCESS_TOKEN>' \
--data '{
    "group_ids": ["<Child Group ID>"]
}'
```

_*The diagram below illustrates the parent relationship between Group 1 and Group 2. This relationship can be established using the provided request.*_

```mermaid
graph
   subgraph Domain_1
      direction BT
      Gr1["Group 1"]
      Gr2["Group 2"]

      Th1["Thing 1"]
      Th2["Thing 2"]

      Ch1["Channel 1"]
      Ch2["Channel 2"]


      Th1 --->|connect| Ch1
      Th1 --->|connect| Ch2

      Th2 --->|connect| Ch2

      Ch1 --->|parent| Gr2
      Ch2 --->|parent| Gr2

      Gr2 --->|parent| Gr1
   end
```

##### Domain Entities Relation Examples

An Example Group with channels, things and groups (sub-groups) within domain.
Groups have parent-child relationships, forming a hierarchy where top-level Groups (Group 1 and Group 2) have Groups  (Sub Groups - Group 11, Group 12, Group 21, and Group 22) or Channels (Channel 2) beneath them.

```mermaid
graph
   subgraph Domain_1
      direction BT
      Gr1["Group 1"]
      Gr2["Group 2"]

      Gr11["Group 11 (Sub Group)"]
      Gr12["Group 12 (Sub Group)"]

      Gr21["Group 21 (Sub Group)"]
      Gr22["Group 22 (Sub Group)"]

      Th1["Thing 1"]
      Th2["Thing 2"]
      Th3["Thing 3"]
      Th4["Thing 4"]
      Th5["Thing 5"]
      Th6["Thing 6"]



      Ch1["Channel 1"]
      Ch2["Channel 2"]
      Ch3["Channel 3"]
      Ch4["Channel 4"]

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
  subgraph Domain_1
    direction BT

    Gr1["Group 1"]

    Gr11["Group 11 (Sub Group)"]
    Gr12["Group 12 (Sub Group)"]
    Gr13["Group 13 (Sub Group)"]


    Th1["Thing 1"]
    Th11["Thing 11"]
    Th2["Thing 2"]
    Th22["Thing 22"]
    Th3["Thing 3"]
    Th33["Thing 33"]
    Th4["Thing 4"]

    Ch1["Channel 1"]
    Ch2["Channel 2"]
    Ch3["Channel 3"]
    Ch4["Channel 4"]

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

Domain Administrator can invite an existing user in Magistrala or invite new users to domain by E-mail ID.
After User registering to Magistrala, User can accept the invitations to Domain.

All the Users in Magistrala are allowed to create a new Domain.
Domain creating user becomes domain Administrator by default

User can have any one of the following relation with a domain

- [Administrator](#domain-administrator)
- [Editor](#domain-editor)
- [Viewer](#domain-viewer)
- [Member](#domain-member)

**Lets take the below Domain_1 with entities for explaning about User Domain Relationship.**

![domain_users](diagrams/domain_users.drawio)

### Domain Administrator

Users with administrator relation have full control over all entities (things, channels, groups) within the domain. They can perform actions like creating, updating, and deleting entities created by others. Administrators are also allowed to create their own entities and can view and update the ones they have created.

**Example:**  
**User_1** is **administrator** of **Domain_1**. **User_1 able to view all entities created by others and have administrator access all entities in domain**.

![domain_users_administrator](diagrams/domain_users_administrator.drawio)

### Domain Editor

Users with editor relation have access to update all entities (things, channels, groups) created by others within the domain. Editor are also allowed to create their own entities and can view and update the ones they have created.

**Example:**  
**User_2** is **editor** of **Domain_1**. **User_2 able to view all entities and have edit access to groups and channel entities, view access to thing entities in domain and also able to create & manage new thing ,channels & groups**.

![domain_users_editor](diagrams/domain_users_editor.drawio)

### Domain Viewer

Users with viewer relation have access to view all entities (things, channels, groups) created by others within the domain. Viewer are also allowed to create their own entities and can view and update the ones they have created.

**Example:**  
**User_3** is **viewer** of **Domain_1**. **User_3 able to only view entities which are created by others in domain and <span style="color:blue"> also able to create & manage new things,channels & groups** </span>

![domain_users_viewer](diagrams/domain_users_viewer.drawio)

### Domain Member

Users with Members relation could not view and no access to entities (things, channels, groups) created by others within the domain. Members are also allowed to create their own entities and can view and update the ones they have created.  
Domain Members will not have access by default to any of the entities in Domain, access shall be granted for specific entities by domain administrator or individual entity administrator.  

**Example:**
**User_4 , User_5, User_6, User_7, User_8, User_9** is **member** of **Domain_1**. **These Member relation users can able to create & manage new things,channels & groups in domain. The can have access the entities to which they have relation in domain. They could not view and manage other entities to which they don't have any relation in domain**.
!!! note "Note: All other users having administrator, editor, viewer relation with domain will also have member relation inherit with domain, which allows them to create new things, channels & groups."

![domain_users_member](diagrams/domain_users_member.drawio)

After User Sign-Up to Magistrala, User is allowed to create new Domain or join to an existing domain via invitations, without Domain User could not create create _Things_, _Channels_, _Groups_.

All operations, including creating, updating, and deleting Things, Channels, and Groups, occur at the domain level. For instance, when a user creates a new Thing using an access token, the newly created Thing automatically becomes associated with a specific domain. The domain information is extracted from the access token. When user obtaining a token, user should specify the domain for which they want to operate.

So to do operations on a Domain, An access token for domain is required. This can be obtained by two ways which is explained in [next section](#tokens-and-domain-tokens).

## Tokens and Domain Tokens

JWT Token are used in Magistrala for Authentication and Authorization. The JWT Token have domain, exp, iat, iss, sub, type and user fields.

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

In JWT Token, domain field have **domain ID** and user field have **user ID**.

If the domain field is empty, then with that JWT token following actions are permitted

- User profile Update
- Domain Creatation & listing,
- Accept Domain invitations

Actions related creation, updatation, deletion of Things, Channels, Group are not permitted, request will fails in authorization. In Magistrala operation related to Things, Channels, Groups are takes place in Domain Level. So for these kinds of operations, a JWT token with domain field containing operating domain ID is required.

There are two ways to obtain JWT Token for a particular Domain

### Option 1: Passing domain_id while obtaining new token

**Request:**

```bash
curl --location 'http://localhost/users/tokens/issue' \
--header 'Content-Type: application/json' \
--header 'Accept: application/json' \
--data-raw '{
        "identity": "user1@example.com",
        "secret": "12345678",
        "domain_id": "903f7ede-3308-4206-89c2-e99688b612f7"
}'
```

In this request , if domain id is empty or if field is not added, then in response JWT token will have empty domain field.

**Response:**

```json
{
    "access_token": "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJkb21haW4iOiI5MDNmN2VkZS0zMzA4LTQyMDYtODljMi1lOTk2ODhiNjEyZjciLCJleHAiOjE3MDY2MDM0NDcsImlhdCI6MTcwNjU5OTg0NywiaXNzIjoibWFnaXN0cmFsYS5hdXRoIiwic3ViIjoiOTAzZjdlZGUtMzMwOC00MjA2LTg5YzItZTk5Njg4YjYxMmY3XzU3NDhkZTY5LTJhNjYtNDBkYS1hODI5LTFiNDdmMDJlOWFkYiIsInR5cGUiOjAsInVzZXIiOiI1NzQ4ZGU2OS0yYTY2LTQwZGEtYTgyOS0xYjQ3ZjAyZTlhZGIifQ.c8a8HhVAbkdq_qZnd1DWHtkoNDPQc6XJY6-UcqqCygRR9svjgkwetN3rmIOWPNV5CjPh5lqlzWv1cOLruKBmzw",
    "refresh_token": "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJkb21haW4iOiI5MDNmN2VkZS0zMzA4LTQyMDYtODljMi1lOTk2ODhiNjEyZjciLCJleHAiOjE3MDY2ODYyNDcsImlhdCI6MTcwNjU5OTg0NywiaXNzIjoibWFnaXN0cmFsYS5hdXRoIiwic3ViIjoiOTAzZjdlZGUtMzMwOC00MjA2LTg5YzItZTk5Njg4YjYxMmY3XzU3NDhkZTY5LTJhNjYtNDBkYS1hODI5LTFiNDdmMDJlOWFkYiIsInR5cGUiOjEsInVzZXIiOiI1NzQ4ZGU2OS0yYTY2LTQwZGEtYTgyOS0xYjQ3ZjAyZTlhZGIifQ.SEMvEw2hchsvPYJWqnHMKlUmgjfqAvFcjeCDXyvS2xSGsscEci3bMrUohaJNkNDWzTBiBinV7nEcPrwbxDfPBQ"
}
```

### Option 2: Get new access and refresh token through refresh endpoint by passing domain_id

In most of the cases user login domain in under determinable. This method will be useful for those kind of cases.

**Step 1: Get token without domain id**
**Request:**

```bash
curl --location 'http://localhost/users/tokens/issue' \
--header 'Content-Type: application/json' \
--header 'Accept: application/json' \
--data-raw '{
        "identity": "user1@example.com",
        "secret": "12345678"
}'
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

In this tokens, there domain field will be empty. As said earlier, this token can be to for User profile Update, Domain Creatation & listing, Accept Domain invitations

**Step 2: List Domains user have access**
**Request:**

```bash
curl --location 'http://localhost/domains' \
--header 'Authorization: Bearer <ACCESS_TOKEN_FROM_STEP_1>
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
curl --location 'http://localhost/users/tokens/refresh' \
--header 'Content-Type: application/json' \
--header 'Accept: application/json' \
--header 'Authorization: Bearer <REFRESH_TOKEN_FROM_STEP_1>' \
--data '{
        "domain_id": "903f7ede-3308-4206-89c2-e99688b612f7"
}'
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

Domain creator becomes administator of domain by deafult. Domain Administrator can assign users to domain with following relations administrator, editor, viewer, member. The details about these relations are describe in this [section](#user-domain-relationship)

User can be assigned to domain with endpoint `/domain/<domain_id>/users/assign` with json body like below:

```json
{
    "user_ids" : ["05dbd66a-ce38-4928-ac86-c1b44909be0d"],
    "relation" : "editor"
}
```

- **user_ids** : field contains array of users ids
- **relation** : field contains any one of the following relations **administrator**, **editor**, **viewer**, **member**, The details about these relations are describe in this [section](#user-domain-relationship)

**Example Request:**

```bash
curl --location 'http://localhost/domains/903f7ede-3308-4206-89c2-e99688b612f7/users/assign' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer <DOMAIN_ACCESS_TOKEN_>' \
--data '{
    "user_ids" : ["05dbd66a-ce38-4928-ac86-c1b44909be0d"],
    "relation" : "editor"
}'
```

## Unassign Users from Domain

User can be unassigned to domain with endpoint `/domain/<domain_id>/users/unassign` with json body like below:

```json
{
    "user_ids" : ["05dbd66a-ce38-4928-ac86-c1b44909be0d"],
    "relation" : "editor"
}
```

- **user_ids** : field contains array of users ids
- **relation** : field contains any one of the following relations **administrator**, **editor**, **viewer**, **member**, The details about these relations are describe in this [section](#user-domain-relationship)

**Example Request:**

```bash
curl --location 'http://localhost/domains/903f7ede-3308-4206-89c2-e99688b612f7/users/unassign' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer <DOMAIN_ACCESS_TOKEN_>' \
--data '{
    "user_ids" : ["05dbd66a-ce38-4928-ac86-c1b44909be0d"],
    "relation" : "administrator"
}''
```

## User Entities Relationship

Users assigned to domain with any relationship (Administrator , Editor, Viewer, Member ) will have access to create entities (Things, Groups, Channels).

Domain administrator or individual entity administrator shall grant access to Domain Member for specific entities.

## Groups Relations

Like Domain, Groups also have four types of relations

- [Administrator](#group-administrator)
- [Editor](#group-editor)
- [Viewer](#group-viewer)

### Group Administrator

Group Administrator user have access to update,delete,assign,unassing to group and also have access to update,delete,assign,unassing all of its child entities

From the [previous viewer example](#domain-viewer), lets take **User_3** who has **viewer relation** with **Domain_1**, which means **User_3 will be able to view all the entities created by others but cannot make any edits or updates on them.** ***<span style="color:blue">User_3 will have access to create entities in Domain_1 </span>***

**User_3 creates new Thing 101, Channel 101 and Group 101**.  

**User_3 Request to Create Thing 101:**

```bash
curl --location 'http://localhost/things' \
--header 'Content-Type: application/json' \
--header 'Accept: application/json' \
--header 'Authorization: Bearer <USER_3_DOMAIN_ACCESS_TOKEN>' \
--data '{
    "credentials": {
        "secret": "a1ca33c0-367e-402b-a239-ff1255fdc440"
    },
    "name": "Thing 101"
}'
```

**User_3 Request to Create Channel 101:**

```bash
curl --location 'http://localhost/channels' \
--header 'Content-Type: application/json' \
--header 'Accept: application/json' \
--header 'Authorization: Bearer <USER_3_DOMAIN_ACCESS_TOKEN>' \
--data '{
    "name": "Chanel 101"
}'
```

**User_3 Request to Create Group 101:**

```bash
curl --location 'http://localhost/groups' \
--header 'Content-Type: application/json' \
--header 'Accept: application/json' \
--header 'Authorization: Bearer <USER_3_DOMAIN_ACCESS_TOKEN>' \
--data '{
    "name": "Group 101"
}'
```

The user who creates entity will be administrator of the entity by default.  
So  **User_3** is **administrator** of **Thing 101, Channel 101 and Group 101.**  

![group_users_administrator_1](diagrams/group_users_administrator_1.drawio)

!!! Note "User_3 will also have Domain Viewer relation to Thing 101, Channel 101 and Group 101"

User_3 can make these entities (Thing 101, Channel 101, Group 101) in hierarchical structure by assigning relations between entities  
Example: Connect Thing 101 & Channel 101, Assign Group 101 as parent of Channel 101.  

**User_3 Request for Connect Thing 101 & Channel 101:**

```bash
curl --location 'http://localhost/connect' \
--header 'Content-Type: application/json' \
--header 'Accept: application/json' \
--header 'Authorization: Bearer <USER_3_DOMAIN_ACCESS_TOKEN>' \
--data '{
  "thing_id": "<Thing 101 ID>",
  "channel_id": "<Channel 101 ID>"
}'
```

**User_3 Request for Assign Group 101 as parent of Channel 101:**

```bash
curl --location 'http://localhost/channels/<Channel 101 ID>/groups/assign' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer <USER_3_DOMAIN_ACCESS_TOKEN>' \
--data '{
    "group_ids" : [ "<Group 101 ID>" ]
}'
```

![group_users_administrator_2](diagrams/group_users_administrator_2.drawio)

***Members of Domain 1 will not have access by default to any of the entities in Domain 1, access shall be granted for specific entities by domain administrator or individual entity administrator.***

**Administrator of Group 101 (User_3), assigns User_4 with Administrator relation.**  
**When Domain Member User_4 becomes as Administrator of Group 101, User_4 can able to update, delete, assign,unassign to Group 101. Since Group 101 have Channel 101 and Thing 101 as child. The User_5 have Administrator access on Group 101 child entities Channel 101 and Thing 101.**  

**User_3 Request for Assign User_4 as administrator for Group 101:**

```bash
curl --location 'http://localhost/domains/<DOMINA_1 ID>/users/assign' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer <USER_3_DOMAIN_ACCESS_TOKEN>' \
--data '{
    "user_ids" : ["<User_4 ID>"],
    "relation" : "administrator"
}'
```

![group_users_administrator_3](diagrams/group_users_administrator_3.drawio)

### Group Editor

Group Editor user have access to view,update,assign,unassign to group and also have access to view,update,assign,unassign all of its child Channel and Group entities, Group Editor have only view access to child Thing entities in Group

**Administrator of Group 101 (User_3/User_4), assigns User_5 with Editor relation.**  
**When Domain Member User_5 becomes as Editor of Group 101, User_5 can able to update,assign,unassign to Group 101. Since Group 101 have Channel 101 and Thing 101 as child. The User_5 have Editor access to the Group child entities Channels,Things and Groups , In this case User_5 have editor access to Group 101 , also have edit access to its child entities Channel 101 and Thing 101**  

![group_users_editor](diagrams/group_users_editor.drawio)

### Group Viewer

Group Viewer user have access to view group and also have access to view all of its child entities

**When Domain Member User_6 becomes as Viewer of Group 101, User_6 can able to view all the child and nested child entities in Group 101. User_6 can able assign child entities under Group 101 and also able assign child entities under any other Group and Channels which are child of Group 101.**  

![group_users_viewer](diagrams/group_users_viewer.drawio)

## Examples

### Domain viewer with Channel & Thing

User_6 creates new  Channel and Thing with names Channel 201 Thing 201 respectively. Then connects both Channel 201 and Thing 201.

![group_users_viewer_1](diagrams/group_users_viewer_1.drawio)

Now User_5 can able to assign Group 101 as parent for Channel 201

![group_users_viewer_2](diagrams/group_users_viewer_2.drawio)

When Channel 201 was assigned as child of Group 101, all the administrator,editor and viewer of Group 101 get same access on Channel 201 and Thing 201

![group_users_viewer_3](diagrams/group_users_viewer_3.drawio)

### Multiple Domain members with Group, Channel & Thing

User_8 creates new group with name Group 301
User_9 creates new thing and channel with names Thing 301 and channel 301 respectively, then connects both thing and channel.
![group_users_member_11](diagrams/group_users_member_11.drawio)  
  
User_8 can able to assign Channel 301 as child of Group 301
![group_users_member_12](diagrams/group_users_member_12.drawio)
When Channel 301 is assigned as child of Group 301, then administrator, editor and viewer of Group 301 becomes gets the same respective access to Channel 301 ,
Administrator, editor and viewer of Channel 301 gets the same respective access to Thing 301.
So here User_8 becomes administrator of both Channel 301 and Thing 301
  
User_5 can able to assign Group 301 as child of Group 101
![group_users_member_13](diagrams/group_users_member_13.drawio)

When Group 301 becomes child of Group 101, then administrator, editor and viewer of Group 101 becomes gets the same respective access to Group 301.
Administrator, editor and viewer of Group 301 gets the same respective access to Channel 301.
Administrator, editor and viewer of Channel 301 gets the same respective access to Thing 301.
So here User_5 becomes editor of Group 301,Channel 301 and Thing 301, User_4 becomes administrator of Group 301,Channel 301 and Thing 301.
User_8 have administrator access only to Group 301 and its child entities Channel 301 and Thing 301.
![group_users_member_14](diagrams/group_users_member_14.drawio)

## User Registration

There are two ways to user get registred to Magistrala , Self Register and Register new user by Super Admin.
User Registration is self register default which can be changed by following environment varabile:

```env
MG_USERS_ALLOW_SELF_REGISTER=true
```
