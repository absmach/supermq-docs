# Authorization

## Policies

Mainflux uses policies to control permissions on entities: **users**, **things**, **groups** and **channels**. Under the hood, Mainflux uses its own fine grained access control list. Policies define permissions for the entities. For example, _which user_ has _access_ to _a specific thing_. Such policies have three main components: **subject**, **object**, and **action**.

To put it briefly:

**Subject**: As the name suggests, it is the subject that will have the policy such as _users_ or _things_. Mainflux uses entity UUID on behalf of the real entities.

**Object**: Objects are Mainflux entities (e.g. _channels_ or _group_ ) represented by their UUID.

**Action**: This is the action that the subject wants to do on the object. This is one of the supported actions (read, write, update, delete, list or add)

Above this we have a domain specifier called **entityType**. This either specific group level access or client level acess. With client entity a client can have an action to another client in the same group. While group entity a client has an action to a group i.e direct association.

All three components create a single policy.

```go
// Policy represents an argument struct for making policy-related function calls.

type Policy struct {
    Subject   string    `json:"subject"`
    Object    string    `json:"object"`
    Actions   []string  `json:"actions"`
}

var examplePolicy = Policy{
    Subject: userID,
    Object:  groupID,
    Actions: []string{groupListAction},
}
```

Policies handling initial implementation are meant to be used on the **Group** level.

There are three types of policies:

- **m\_** Policy for messages i.e read or write action.
- **g\_** Policy for Group rights i.e add, list, update or delete action.
- **c\_** Policy for Clients that are group members i.e list, update or delete action.

**m\_** Policy represents client rights to send and receive messages to a channel. Only channel members with corresponding rights can publish or receive messages to/from the channel. **m_read** and **m_write** are the only supported actions. With **m_read** the client can read messages from the channel. With **m_write** the client can write messages to the channel.

**g\_** Policy represents the client's rights to modify the group/channel itself. Only group/channel members with correct rights can modify or update the group/channel, or add/remove members to/from the group. **g_add**, **g_list**, **g_update** and **g_delete** are the only supported actions. With **g_add** the client can add members to the group/channel. With **g_list** the client can list the group/channel or list its members. With **g_update** the client can update the group/channel. With **g_delete** the client can delete the group/channel.

Finally, the **c\_** policy represents the rights the member has over other members of the group/channel. Only group/channel members with correct rights can modify or update other members of the group/channel. **c_list**, **c_update**, **c_share** and **c_delete** are the only supported actions. With **c_list** the client can list the group/channel or other members of the group/channel. With **c_update** the client can update other members of the group/channel. With **c_share** the client can share the group/channel with other clients. With **c_delete** the client can delete other members of the group/channel.

By default, mainflux adds listing action to **c\_** and **g\_** policies. This means that all members of the group/channel can list the group/channel or its members. When adding a new member to a group with **g_add**, **g_update** or **g_delete** action, mainflux will automatically add **g_list** action to the new member's policy. This means that the new member will be able to list the group/channel. When adding a new member to a group/channel with **c_update** or **c_delete** action, mainflux will automatically add **c_list** action to the new member's policy. This means that the new member will be able to list the members of the group/channel.

## Example

The rules are specified in the **policies** association table. The table looks like this:

| subject | object | actions                                     |
| ------- | ------ | ------------------------------------------- |
| clientA | groupA | ["g_add", "g_list", "g_update", "g_delete"] |
| clientB | groupA | ["c_list", "c_update", "c_delete"]          |
| clientC | groupA | ["c_update"]                                |
| clientD | groupA | ["c_list"]                                  |
| clientE | groupB | ["c_list", "c_update", "c_delete"]          |
| clientF | groupB | ["c_update"]                                |
| clientD | groupB | ["c_list"]                                  |
| clientG | groupC | ["m_read"]                                  |
| clientH | groupC | ["m_read", "m_write"]                       |

Actions such as `c_list`, and `c_update` represent actions that allowed for the client with `client_id` to execute over all the other clients that are members of the group with `gorup_id`. Actions such as `g_update` represent actions allowed for the client with `client_id` to execute against a group with `group_id`.

For the sake of simplicity, all the operations at the moment are executed on the **group level** - the group acts as a namespace in the context of authorization and is required.

1. Actions for `clientA`

   - they can add members to `groupA`
   - when `clientA` lists groups `groupA` will be listed
   - `clientA` can list members of `groupA`
   - they can update `groupA`
   - they can change the status of `groupA`

2. Actions for `clientB`

   - when they list clients they will list `clientA`, `clientC` and `clientD` since they are connected in the same group `groupA` and they have `c_list` actions.
   - they can update clients connected to the same group they are connected in i.e they can update `clientA`, `clientC` and `clientD` since they are in the same `groupA`
   - they can change clients status of clients connected to the same group they are connected in i.e they are able to change the status of `clientA`, `clientC` and `clientD` since they are in the same group `groupA`

3. Actions for `clientC`

   - they can update clients connected to the same group they are connected in i.e they can update `clientA`, `clientB` and `clientD` since they are in the same `groupA`

4. Actions for `clientD`

   - when they list clients they will list `clientA`, `clientB` and `clientC` since they are connected in the same group `groupA` and they have `c_list` actions and also `clientE` and `clientF` since they are connected to the same group `groupB` and they have `c_list` actions

5. Actions for `clientE`

   - when they list clients they will list `clientF` and `clientD` since they are connected in the same group `groupB` and they have `c_list` actions
   - they can update clients connected to the same group they are connected in i.e they can update `clientF` and `clientD` since they are in the same `groupB`
   - they can change clients status of clients connected to the same group they are connected in i.e they are able to change the status of `clientF` and `clientD` since they are in the same group `groupB`

6. Actions for `clientF`

   - they can update clients connected to the same group they are connected in i.e they can update `clientE`, and `clientD` since they are in the same `groupB`

7. Actions for `clientG`

   - they can read messages posted in group `groupC`

8. Actions for `clientH`

   - they can read from `groupC` and write messages to `groupC`

If the user has no such policy, the operation will be denied; otherwise, the operation will be allowed.

In order to check whether a user has the policy or not, Mainflux makes a gRPC call to policies API, then policies sub-service handles the checking existence of the policy.

All policies are stored in the Postgres Database. The database responsible for storing all policies is deployed along with the Mainflux.

## Predefined Policies

Mainflux comes with predefined policies.

### Users service related policies

- By default, Mainflux allows anybody to create a user.
- The admin has a special policy indicating that the user is admin. This is implemented using roles as the following:
  `<admin_id>` has `admin` role as part of its description.

### Things service related policies

- There are 3 policies regarding `Things`: `c_update`, `c_list`, `c_share` and `c_delete`.
- When a user creates a thing, the user will have `c_update`, `c_list` and `c_delete` policies on the `Thing` since they are the owner.
- In order to view a thing, you need `c_list` policy on that thing.
- In order to update the thing, you need a `c_update` policy on that thing.
- In order to share a thing, you need a `c_share` policy on that thing.
- In order to remove a thing, you need a `c_delete` policy on that thing.

### Group entity related policies

- Once the user creates a new group, the user will have a `g_add`, `g_update`, `g_list` and `g_delete` policy on the group.

### Summary of Defined Policies

## Add User Policies

You can add policies as well through an HTTP endpoint. _Only_ admin or member with `g_add` policy to the object can use this endpoint. Therefore, you need an authentication token.

_user_token_ must belong to the user.

> Must-have: user_token, group_id, user_id and policy_actions

```bash
curl -isSX POST 'http://localhost/users/policies' -H "Content-Type: application/json" -H "Authorization: Bearer <user_token>" -d '{"subject": "<user_id>", "object": "<group_id>", "actions": ["<action_1>", ..., "<action_N>"]}'
```

For example:

```bash
curl -isSX POST 'http://localhost/users/policies' -H "Content-Type: application/json" -H "Authorization: Bearer $USER_TOKEN" -d '{"subject": "0b530292-3c1d-4c7d-aff5-b141b5c5d3e9", "object": "0a4a2c33-2d0e-43df-b51c-d905aba99e17", "actions": ["c_list", "g_list"]}'

HTTP/1.1 201 Created
Server: nginx/1.23.3
Date: Wed, 14 Jun 2023 13:40:06 GMT
Content-Type: application/json
Content-Length: 0
Connection: keep-alive
Access-Control-Expose-Headers: Location
```

## Updating Policies

> Must-have: user_token, group_id, user_id and policy_actions

```bash
curl -isSX PUT 'http://localhost/users/policies' -H "Content-Type: application/json" -H "Authorization: Bearer <user_token>" -d '{"subject": "<user_id>", "object": "<group_id>", "actions": ["<action_1>", ..., "<action_N>"]}'
```

For example:

```bash
curl -isSX PUT 'http://localhost/users/policies' -H "Content-Type: application/json" -H "Authorization: Bearer $USER_TOKEN" -d '{"subject": "0b530292-3c1d-4c7d-aff5-b141b5c5d3e9", "object": "0a4a2c33-2d0e-43df-b51c-d905aba99e17", "actions": ["c_delete"]}'

HTTP/1.1 204 No Content
Server: nginx/1.23.3
Date: Wed, 14 Jun 2023 13:41:00 GMT
Content-Type: application/json
Connection: keep-alive
Access-Control-Expose-Headers: Location
```

## Lisiting Policies

> Must-have: user_token

```bash
curl -isSX GET 'http://localhost/users/policies' -H "Content-Type: application/json" -H "Authorization: Bearer <user_token>"
```

For example:

```bash
curl -isSX GET 'http://localhost/users/policies' -H "Content-Type: application/json" -H "Authorization: Bearer $USER_TOKEN"

HTTP/1.1 200 OK
Server: nginx/1.23.3
Date: Wed, 14 Jun 2023 13:41:32 GMT
Content-Type: application/json
Content-Length: 305
Connection: keep-alive
Access-Control-Expose-Headers: Location

{
  "limit": 10,
  "offset": 0,
  "total": 1,
  "policies": [
    {
      "owner_id": "94939159-d129-4f17-9e4e-cc2d615539d7",
      "subject": "0b530292-3c1d-4c7d-aff5-b141b5c5d3e9",
      "object": "0a4a2c33-2d0e-43df-b51c-d905aba99e17",
      "actions": ["c_delete"],
      "created_at": "2023-06-14T13:40:06.582315Z",
      "updated_at": "2023-06-14T13:41:00.636733Z"
    }
  ]
}
```

## Delete Policies

The admin can delete policies. Only policies defined on [Predefined Policies section](/authorization/#summary-of-the-defined-policies) are allowed.

> Must-have: user_token, object, subjects_ids and policies

```bash
curl -isSX DELETE -H "Accept: application/json" -H "Authorization: Bearer <user_token>" http://localhost/users/policies -d '{"subject": "user_id", "object": "<group_id>"}'
```

For example:

```bash
curl -isSX DELETE -H 'Accept: application/json' -H "Authorization: Bearer $USER_TOKEN" http://localhost/users/policies -d '{"subject": "0b530292-3c1d-4c7d-aff5-b141b5c5d3e9", "object": "0a4a2c33-2d0e-43df-b51c-d905aba99e17"}'

HTTP/1.1 204 No Content
Server: nginx/1.23.3
Date: Wed, 14 Jun 2023 13:43:46 GMT
Content-Type: application/json
Connection: keep-alive
Access-Control-Expose-Headers: Location
```

If you delete policies, the policy will be removed from the policy storage. Further authorization checks related to that policy will fail.
