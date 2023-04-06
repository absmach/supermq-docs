# Authorization

## Policies

Mainflux uses policies to control permissions on entities: **users**, **things**, and **groups**. Under the hood, Mainflux uses its own fine grained access control list.

Policies define permissions for the entities. For example, *which user* has *access* to *a specific thing*. Such policies have three main components: **subject**, **object**, and **action**.

To put it briefly:

**Subject**: As the name suggests, it is the subject that will have the policy such as *users* or *things*. Mainflux uses entity UUID on behalf of the real entities.

**Object**: Objects are Mainflux entities (e.g. *channels* or *group* or *things*) represented by their UUID.

**Action**: This is the action that the subject wants to do on the object. This is one of the supported actions (read, write, update, delete, list or add)

Above this we have a domain specifier called **entityType**. This either specific group level access or client level acess. With group level access a client can have an action to another client in the same group. While client level access a client has an action to a group i.e direct association.

All three components create a single policy.

```go
// Policy represents an argument struct for making policy-related function calls.

type Policy struct {
    Subject   string    `json:"subject"`
    Object    string    `json:"object"`
    Actions   []string  `json:"actions"`
}

var examplePolicy = Policy{
    Subject: userToken,
    Object:  groupID,
    Actions: []string{groupListAction},
}
```

Policies handling initial implementation are meant to be used on the **Group** level.

There are three types of policies:

- **m_** Policy for messages i.e read or write action.
- **g_** Policy for Group rights i.e add, list, update or delete action.
- **c_** Policy for Clients that are group members i.e add, list, update or delete action.

**m_** Policy represents client rights to send and receive messages to a channel. Only channel members with corresponding rights can publish or receive messages to/from the channel.

**g_** Policy represents the client's rights to modify the group/channel itself. Only group/channel members with correct rights can modify or update the group/channel, or add/remove members to/from the group.

Finally, the **c_** policy represents the rights the member has over other members of the group/channel.

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
      - they can update `groupA`
      - they can change the status of `groupA`

2. Actions for `clientB`

      - when they list clients they will list `clientA`, `clientC` and `clientD` since they are connected in the same group `groupA` and they have `c_list` actions
      - they can update clients connected to the same group they are connected in i.e they can update `clientA`, `clientC` and `clientD` since they are in the same `groupA`
      - they can change clients status of clients connected to the same group they are connected in i.e they are able to change the status of `clientA`, `clientC` and `clientD` since they are in the same group `groupA`

3. Actions for `clientC`

      - they can update clients connected to the same group they are connected in i.e they can update `clientA`, `clientB` and `clientD` since they are in the same `groupA`

4. Actions for `clientD`

      - when they list clients they will list `clientA`, `clientB` and `clientC` since they are connected in the same group `groupA` and they have `c_list` actions and also `clientE` and `clientF` since they are connected to the same group `groupB` and they have `c_list` actions

5. Actions for `clientE`

      - when they list clients they will list `clientF` and `clientD` since they are connected in the same group `groupB` and they have `c_list` actions
      - they can update clients connected to the same group they are connected in i.e they can update `clientF` and `clientD` since they are in the same `groupB`

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

- There are 3 policies regarding `Things`: `c_add`, `c_update`, `c_list` and `c_delete`.
- When a user creates a thing, the user will have `c_update`, `c_list` and `c_delete` policies on the `Thing` since they are the owner.
- In order to view a thing, you need `c_list` policy on that thing.
- In order to update and share the thing, you need a `c_update` policy on that thing.
- In order to remove a thing, you need a `c_delete` policy on that thing.

### Group entity related policies

- Once the user creates a new group, the user will have a `g_add`, `g_update`, `g_list` and `g_delete` policy on the group.

### Summary of Defined Policies

## Add Policies

You can add policies as well through an HTTP endpoint. *Only* admin can use this endpoint. Therefore, you need an authentication token for the admin.

*admin_token* must belong to the admin.

> Must-have: admin_token, object_id, subjects_id and policy_actions

```bash
curl -isSX POST 'http://localhost/policies' -H 'Content-Type: application/json' -H 'Authorization: Bearer <admin_token>' -d '{"subject": "<client_id>", "object": "<object_id>", "actions": ["<action_1>", ..., "<action_N>"]}'
```

For example:

```bash
curl -isSX POST 'http://localhost/policies' -H 'Content-Type: application/json' -H 'Authorization: Bearer <admin_token>' -d '{"subject": "3ad70dcb-b612-45a4-802a-06b166cd0372", "object": "6f048d29-3eef-4282-a649-f452d7910b53", "actions": ["c_list", "g_list"]}'

HTTP/1.1 201 Created
Server: nginx/1.23.3
Date: Wed, 05 Apr 2023 08:31:35 GMT
Content-Type: application/json
Content-Length: 0
Connection: keep-alive
Strict-Transport-Security: max-age=63072000; includeSubdomains
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: *
Access-Control-Allow-Headers: *
```

## Updating Policies

> Must-have: admin_token, object_id, subjects_id and policy_actions

```bash
curl -isSX PUT 'http://localhost/policies' -H 'Content-Type: application/json' -H 'Authorization: Bearer <admin_token>' -d '{"subject": "<client_id>", "object": "<object_id>", "actions": ["<action_1>", ..., "<action_N>"]}'
```

For example:

```bash
curl -isSX PUT 'http://localhost/policies' -H 'Content-Type: application/json' -H 'Authorization: Bearer <admin_token>' -d '{"subject": "3ad70dcb-b612-45a4-802a-06b166cd0372", "object": "6f048d29-3eef-4282-a649-f452d7910b53", "actions": ["c_delete"]}'

HTTP/1.1 204 No Content
Server: nginx/1.23.3
Date: Wed, 05 Apr 2023 08:38:38 GMT
Content-Type: application/json
Connection: keep-alive
Strict-Transport-Security: max-age=63072000; includeSubdomains
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: *
Access-Control-Allow-Headers: *
```

## Lisiting Policies

> Must-have: admin_token

```bash
curl -isSX GET 'http://localhost/policies' -H 'Content-Type: application/json' -H 'Authorization: Bearer <admin_token>'
```

For example:

```bash
curl -isSX GET 'http://localhost/policies' -H 'Content-Type: application/json' -H 'Authorization: Bearer <admin_token>'

HTTP/1.1 200 OK
Server: nginx/1.23.3
Date: Wed, 05 Apr 2023 08:38:12 GMT
Content-Type: application/json
Content-Length: 290
Connection: keep-alive
Strict-Transport-Security: max-age=63072000; includeSubdomains
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: *
Access-Control-Allow-Headers: *

{
    "limit": 10,
    "total": 1,
    "policies": [{
        "owner_id": "6ff06698-4dac-4281-866b-af0e500c4509",
        "subject": "3ad70dcb-b612-45a4-802a-06b166cd0372",
        "object": "6f048d29-3eef-4282-a649-f452d7910b53",
        "actions": ["c_delete"],
        "created_at": "0001-01-01T00:00:00Z",
        "updated_at": "0001-01-01T00:00:00Z"
    }]
}
```

## Delete Policies

The admin can delete policies. Only policies defined on [Predefined Policies section](/authorization/#summary-of-the-defined-policies) are allowed.

> Must-have: admin_token, object, subjects_ids and policies

```bash
curl -isSX DELETE -H "Accept: application/json" -H "Authorization: Bearer <user_token>" http://localhost/policie/<subject_id>/<object_id> -H 'Content-Type: application/json'
```

For example:

```bash
curl -isSX DELETE -H 'Accept: application/json' -H 'Authorization: Bearer $USER_TOKEN' http://localhost/policies/6f048d29-3eef-4282-a649-f452d7910b53/3ad70dcb-b612-45a4-802a-06b166cd0372

HTTP/1.1 204 No Content
Server: nginx/1.23.3
Date: Wed, 05 Apr 2023 08:40:22 GMT
Content-Type: application/json
Connection: keep-alive
Strict-Transport-Security: max-age=63072000; includeSubdomains
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: *
Access-Control-Allow-Headers: *
```

If you delete policies, the policy will be removed from the policy storage. Further authorization checks related to that policy will fail.

For example, let's assume `user1` has `read` policy on the thing `thing-123`. If you delete the policy `user1` will not be able to view the `thing-123` anymore because the policy which allows `user1` to view `thing-123` is deleted by the admin.
