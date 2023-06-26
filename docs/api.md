# API

## Reference

API reference in the Swagger UI can be found at: [https://api.mainflux.io][api]

## Users

### Create User

To start working with the Mainflux system, you need to create a user account.

> Must-have: identity, which can be email-address (this must be unique as it identifies the user) and secret (password must contain at least 8 characters)
>
> Optional: name, tags, metadata, status and role

```bash
curl -s -S -i -X POST -H "Content-Type: application/json" http://localhost/users -d '{"credentials": {"identity": "<user_identity>", "secret": "<user_secret>"}}'
```

For example:

```bash
curl -s -S -i -X POST -H "Content-Type: application/json" http://localhost/users -d '{"credentials": {"identity": "john.doe@email.com", "secret": "12345678"}, "name": "John Doe"}'

HTTP/1.1 201 Created
Server: nginx/1.23.3
Date: Wed, 14 Jun 2023 13:45:38 GMT
Content-Type: application/json
Content-Length: 223
Connection: keep-alive
Location: /users/4f22fa45-50ca-491b-a7c9-680a2608dc13
Access-Control-Expose-Headers: Location

{
  "id": "4f22fa45-50ca-491b-a7c9-680a2608dc13",
  "name": "John Doe",
  "credentials": { "identity": "john.doe@email.com", "secret": "" },
  "created_at": "2023-06-14T13:45:38.808423Z",
  "updated_at": "0001-01-01T00:00:00Z",
  "status": "enabled"
}
```

You can also use <user_token> so that the owner of the new user is the one identified by the <user_token> for example:

```bash
curl -s -S -i -X POST -H "Content-Type: application/json" -H "Authorization: Bearer $USER_TOKEN" http://localhost/users -d '{"credentials": {"identity": "john.doe2@email.com", "secret": "12345678"}}'

HTTP/1.1 201 Created
Server: nginx/1.23.3
Date: Wed, 14 Jun 2023 13:46:47 GMT
Content-Type: application/json
Content-Length: 252
Connection: keep-alive
Location: /users/1890c034-7ef9-4cde-83df-d78ea1d4d281
Access-Control-Expose-Headers: Location

{
  "id": "1890c034-7ef9-4cde-83df-d78ea1d4d281",
  "owner": "94939159-d129-4f17-9e4e-cc2d615539d7",
  "credentials": { "identity": "john.doe2@email.com", "secret": "" },
  "created_at": "2023-06-14T13:46:47.322648Z",
  "updated_at": "0001-01-01T00:00:00Z",
  "status": "enabled"
}
```

### Create Token

To log in to the Mainflux system, you need to create a `user_token`.

> Must-have: registered identity and secret.

```bash
curl -s -S -i -X POST -H "Content-Type: application/json" http://localhost/users/tokens/issue -d '{"identity":"<user_identity>", "secret":"<user_secret>"}'
```

For example:

```bash
curl -s -S -i -X POST -H "Content-Type: application/json" http://localhost/users/tokens/issue -d '{"identity": "john.doe@email.com", "secret": "12345678"}'

HTTP/1.1 201 Created
Server: nginx/1.23.3
Date: Wed, 14 Jun 2023 13:47:32 GMT
Content-Type: application/json
Content-Length: 709
Connection: keep-alive
Access-Control-Expose-Headers: Location

{
  "access_token": "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2ODY3NTEzNTIsImlhdCI6MTY4Njc1MDQ1MiwiaWRlbnRpdHkiOiJqb2huLmRvZUBlbWFpbC5jb20iLCJpc3MiOiJjbGllbnRzLmF1dGgiLCJzdWIiOiI5NDkzOTE1OS1kMTI5LTRmMTctOWU0ZS1jYzJkNjE1NTM5ZDciLCJ0eXBlIjoiYWNjZXNzIn0.AND1sm6mN2wgUxVkDhpipCoNa87KPMghGaS5-4dU0iZaqGIUhWScrEJwOahT9ts1TZSd1qEcANTIffJ_y2Pbsg",
  "refresh_token": "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2ODY4MzY4NTIsImlhdCI6MTY4Njc1MDQ1MiwiaWRlbnRpdHkiOiJqb2huLmRvZUBlbWFpbC5jb20iLCJpc3MiOiJjbGllbnRzLmF1dGgiLCJzdWIiOiI5NDkzOTE1OS1kMTI5LTRmMTctOWU0ZS1jYzJkNjE1NTM5ZDciLCJ0eXBlIjoicmVmcmVzaCJ9.z3OWCHhNHNuvkzBqEAoLKWS6vpFLkIYXhH9cZogSCXd109-BbKVlLvYKmja-hkhaj_XDJKySDN3voiazBr_WTA",
  "access_type": "Bearer"
}
```

### Refresh Token

To issue another `access_token` after getting expired, you need to use a `refresh_token`.

> Must-have: refresh_token

```bash
curl -s -S -i -X POST -H "Content-Type: application/json" -H "Authorization: Bearer <refresh_token>" http://localhost/users/tokens/refresh
```

For example:

```bash
curl -s -S -i -X POST -H "Content-Type: application/json" -H "Authorization: Bearer $REFRESH_TOKEN" http://localhost/users/tokens/refresh

HTTP/1.1 201 Created
Server: nginx/1.23.3
Date: Wed, 14 Jun 2023 13:49:45 GMT
Content-Type: application/json
Content-Length: 709
Connection: keep-alive
Access-Control-Expose-Headers: Location

{
  "access_token": "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2ODY3NTE0ODUsImlhdCI6MTY4Njc1MDU4NSwiaWRlbnRpdHkiOiJqb2huLmRvZUBlbWFpbC5jb20iLCJpc3MiOiJjbGllbnRzLmF1dGgiLCJzdWIiOiI5NDkzOTE1OS1kMTI5LTRmMTctOWU0ZS1jYzJkNjE1NTM5ZDciLCJ0eXBlIjoiYWNjZXNzIn0.zZcUH12x7Tlnecrc3AAFnu3xbW4wAOGifWZMnba2EnhosHWDuSN4N7s2S7OxPOrBGAG_daKvkA65mi5n1sxi9A",
  "refresh_token": "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2ODY4MzY5ODUsImlhdCI6MTY4Njc1MDU4NSwiaWRlbnRpdHkiOiJqb2huLmRvZUBlbWFpbC5jb20iLCJpc3MiOiJjbGllbnRzLmF1dGgiLCJzdWIiOiI5NDkzOTE1OS1kMTI5LTRmMTctOWU0ZS1jYzJkNjE1NTM5ZDciLCJ0eXBlIjoicmVmcmVzaCJ9.AjxJ5xlUUSjW99ECUAU19ONeCs8WlRl52Ost2qGTADxHGYBjPMqctruyoTYJbdORtL5f2RTxZsnLX_1vLKRY2A",
  "access_type": "Bearer"
}
```

### Get User Profile

You can always check the user profile that is logged in by using the `user_token`.

> Must-have: `user_token`

```bash
curl -s -S -i -X GET -H "Authorization: Bearer <user_token>" http://localhost/users/profile
```

For example:

```bash
curl -s -S -i -X GET -H "Authorization: Bearer $USER_TOKEN" http://localhost/users/profile

HTTP/1.1 200 OK
Server: nginx/1.23.3
Date: Wed, 14 Jun 2023 13:51:59 GMT
Content-Type: application/json
Content-Length: 312
Connection: keep-alive
Access-Control-Expose-Headers: Location

{
  "id": "1890c034-7ef9-4cde-83df-d78ea1d4d281",
  "owner": "94939159-d129-4f17-9e4e-cc2d615539d7",
  "credentials": {
    "identity": "john.doe2@email.com",
    "secret": "$2a$10$pgpEKv0K5Xs9ULyBCVzGyeBwWIUleIH5IqXZ4XnLI6/.Aw2CHujr."
  },
  "created_at": "2023-06-14T13:46:47.322648Z",
  "updated_at": "0001-01-01T00:00:00Z",
  "status": "enabled"
}
```

### Get User

You can always check the user entity by entering the user ID and `user_token`.

> Must-have: `user_id` and `user_token`

```bash
curl -s -S -i -X GET -H "Authorization: Bearer <user_token>" http://localhost/users/<user_id>
```

For example:

```bash
curl -s -S -i -X GET -H "Authorization: Bearer $USER_TOKEN" http://localhost/users/1890c034-7ef9-4cde-83df-d78ea1d4d281

HTTP/1.1 200 OK
Server: nginx/1.23.3
Date: Wed, 14 Jun 2023 13:51:59 GMT
Content-Type: application/json
Content-Length: 312
Connection: keep-alive
Access-Control-Expose-Headers: Location

{
  "id": "1890c034-7ef9-4cde-83df-d78ea1d4d281",
  "owner": "94939159-d129-4f17-9e4e-cc2d615539d7",
  "credentials": {
    "identity": "john.doe2@email.com",
    "secret": "$2a$10$pgpEKv0K5Xs9ULyBCVzGyeBwWIUleIH5IqXZ4XnLI6/.Aw2CHujr."
  },
  "created_at": "2023-06-14T13:46:47.322648Z",
  "updated_at": "0001-01-01T00:00:00Z",
  "status": "enabled"
}
```

### Get Users

You can get all users in the database by querying this endpoint.

> Must-have: `user_token`

```bash
curl -s -S -i -X GET -H "Authorization: Bearer <user_token>" http://localhost/users
```

For example:

```bash
curl -s -S -i -X GET -H "Authorization: Bearer $USER_TOKEN" http://localhost/users

HTTP/1.1 200 OK
Server: nginx/1.23.3
Date: Wed, 14 Jun 2023 13:52:36 GMT
Content-Type: application/json
Content-Length: 285
Connection: keep-alive
Access-Control-Expose-Headers: Location

{
  "limit": 10,
  "total": 1,
  "users": [
    {
      "id": "1890c034-7ef9-4cde-83df-d78ea1d4d281",
      "owner": "94939159-d129-4f17-9e4e-cc2d615539d7",
      "credentials": { "identity": "john.doe2@email.com", "secret": "" },
      "created_at": "2023-06-14T13:46:47.322648Z",
      "updated_at": "0001-01-01T00:00:00Z",
      "status": "enabled"
    }
  ]
}
```

If you want to paginate your results then use this

> Must have: `user_token`
>
> Additional parameters: `offset`, `limit`, `metadata`, `name`, `identity`, `tag`, `status` and `visbility`

```bash
curl -s -S -i -X GET -H "Authorization: Bearer <user_token>" http://localhost/users?offset=<offset>&limit=<limit>&identity=<identity>
```

For example:

```bash
curl -s -S -i -X GET -H "Authorization: Bearer $USER_TOKEN" http://localhost/users?offset=0&limit=5&identity=john.doe2@email.com

HTTP/1.1 200 OK
Server: nginx/1.23.3
Date: Wed, 14 Jun 2023 13:53:16 GMT
Content-Type: application/json
Content-Length: 284
Connection: keep-alive
Access-Control-Expose-Headers: Location

{
  "limit": 5,
  "total": 1,
  "users": [
    {
      "id": "1890c034-7ef9-4cde-83df-d78ea1d4d281",
      "owner": "94939159-d129-4f17-9e4e-cc2d615539d7",
      "credentials": { "identity": "john.doe2@email.com", "secret": "" },
      "created_at": "2023-06-14T13:46:47.322648Z",
      "updated_at": "0001-01-01T00:00:00Z",
      "status": "enabled"
    }
  ]
}
```

### Update User

Updating user's name and/or metadata

> Must-have: `user_token` and `user_id`

```bash
curl -s -S -i -X PATCH -H "Content-Type: application/json" -H "Authorization: Bearer <user_token>" http://localhost/users/<user_id> -d
'{"metadata":{"foo":"bar"}}'
```

For example:

```bash
curl -s -S -i -X PATCH -H "Content-Type: application/json" -H "Authorization: Bearer $USER_TOKEN" http://localhost/users/1890c034-7ef9-4cde-83df-d78ea1d4d281 -d '{"name": "new name", "metadata":{"foo":"bar"}}'

HTTP/1.1 200 OK
Server: nginx/1.23.3
Date: Wed, 14 Jun 2023 13:54:40 GMT
Content-Type: application/json
Content-Length: 354
Connection: keep-alive
Access-Control-Expose-Headers: Location

{
  "id": "1890c034-7ef9-4cde-83df-d78ea1d4d281",
  "name": "new name",
  "owner": "94939159-d129-4f17-9e4e-cc2d615539d7",
  "credentials": { "identity": "john.doe2@email.com", "secret": "" },
  "metadata": { "foo": "bar" },
  "created_at": "2023-06-14T13:46:47.322648Z",
  "updated_at": "2023-06-14T13:54:40.208005Z",
  "updated_by": "94939159-d129-4f17-9e4e-cc2d615539d7",
  "status": "enabled"
}
```

### Update User Tags

Updating user's tags

> Must-have: `user_token` and `user_id`

```bash
curl -s -S -i -X PATCH -H "Content-Type: application/json" -H "Authorization: Bearer <user_token>" http://localhost/users/<user_id>/tags -d '{"tags":["<tag_1>", ..., "tag_N"]}'
```

For example:

```bash
curl -s -S -i -X PATCH -H "Content-Type: application/json" -H "Authorization: Bearer $USER_TOKEN" http://localhost/users/1890c034-7ef9-4cde-83df-d78ea1d4d281/tags -d '{"tags":["foo","bar"]}'

HTTP/1.1 200 OK
Server: nginx/1.23.3
Date: Wed, 14 Jun 2023 13:55:18 GMT
Content-Type: application/json
Content-Length: 375
Connection: keep-alive
Access-Control-Expose-Headers: Location

{
  "id": "1890c034-7ef9-4cde-83df-d78ea1d4d281",
  "name": "new name",
  "tags": ["foo", "bar"],
  "owner": "94939159-d129-4f17-9e4e-cc2d615539d7",
  "credentials": { "identity": "john.doe2@email.com", "secret": "" },
  "metadata": { "foo": "bar" },
  "created_at": "2023-06-14T13:46:47.322648Z",
  "updated_at": "2023-06-14T13:55:18.353027Z",
  "updated_by": "94939159-d129-4f17-9e4e-cc2d615539d7",
  "status": "enabled"
}
```

### Update User Owner

Updating user's owner

> Must-have: `user_token` and `user_id`

```bash
curl -s -S -i -X PATCH -H "Content-Type: application/json" -H "Authorization: Bearer <user_token>" http://localhost/users/<user_id>/owner -d '{"owner":<owner_id>}'
```

For example:

```bash
curl -s -S -i -X PATCH -H "Content-Type: application/json" -H "Authorization: Bearer $USER_TOKEN" http://localhost/users/1890c034-7ef9-4cde-83df-d78ea1d4d281/owner -d '{"owner": "532311a4-c13b-4061-b991-98dcae7a934e"}'

HTTP/1.1 200 OK
Server: nginx/1.23.3
Date: Wed, 14 Jun 2023 13:56:32 GMT
Content-Type: application/json
Content-Length: 375
Connection: keep-alive
Access-Control-Expose-Headers: Location

{
  "id": "1890c034-7ef9-4cde-83df-d78ea1d4d281",
  "name": "new name",
  "tags": ["foo", "bar"],
  "owner": "532311a4-c13b-4061-b991-98dcae7a934e",
  "credentials": { "identity": "john.doe2@email.com", "secret": "" },
  "metadata": { "foo": "bar" },
  "created_at": "2023-06-14T13:46:47.322648Z",
  "updated_at": "2023-06-14T13:56:32.059484Z",
  "updated_by": "94939159-d129-4f17-9e4e-cc2d615539d7",
  "status": "enabled"
}
```

### Update User Identity

Updating user's identity

> Must-have: `user_token` and `user_id`

```bash
curl -s -S -i -X PATCH -H "Content-Type: application/json" -H "Authorization: Bearer <user_token>" http://localhost/users/<user_id>/identity -d '{"identity":<user_identity>}'
```

For example:

```bash
curl -s -S -i -X PATCH -H "Content-Type: application/json" -H "Authorization: Bearer $USER_TOKEN" http://localhost/users/1890c034-7ef9-4cde-83df-d78ea1d4d281/identity -d '{"identity": "updated.john.doe@email.com"}'

HTTP/1.1 200 OK
Server: nginx/1.23.3
Date: Wed, 14 Jun 2023 13:59:53 GMT
Content-Type: application/json
Content-Length: 382
Connection: keep-alive
Access-Control-Expose-Headers: Location

{
  "id": "1890c034-7ef9-4cde-83df-d78ea1d4d281",
  "name": "new name",
  "tags": ["foo", "bar"],
  "owner": "94939159-d129-4f17-9e4e-cc2d615539d7",
  "credentials": { "identity": "updated.john.doe@email.com", "secret": "" },
  "metadata": { "foo": "bar" },
  "created_at": "2023-06-14T13:46:47.322648Z",
  "updated_at": "2023-06-14T13:59:53.422595Z",
  "updated_by": "94939159-d129-4f17-9e4e-cc2d615539d7",
  "status": "enabled"
}
```

### Change Secret

Changing the user secret can be done by calling the update secret function

> Must-have: `user_token`, `old_secret` and password (`new_secret`)

```bash
curl -s -S -i -X PATCH -H "Content-Type: application/json" -H "Authorization: Bearer <user_token>" http://localhost/users/secret -d '{"old_secret":"<old_secret>", "new_secret":"<new_secret>"}'
```

For example:

```bash
curl -s -S -i -X PATCH -H "Content-Type: application/json" -H "Authorization: Bearer $USER_TOKEN" http://localhost/users/secret -d '{"old_secret":"12345678", "new_secret":"12345678a"}'

HTTP/1.1 200 OK
Server: nginx/1.23.3
Date: Wed, 14 Jun 2023 14:00:35 GMT
Content-Type: application/json
Content-Length: 281
Connection: keep-alive
Access-Control-Expose-Headers: Location
```

### Enable User

Changing the user status to enabled can be done by calling the enable user function

> Must-have: `user_id` and `user_token`

```bash
curl -s -S -i -X GET -H "Authorization: Bearer <user_token>" http://localhost/users/<user_id>/enable
```

For example:

```bash
curl -s -S -i -X POST -H "Authorization: Bearer $USER_TOKEN" http://localhost/users/1890c034-7ef9-4cde-83df-d78ea1d4d281/enable

HTTP/1.1 200 OK
Server: nginx/1.23.3
Date: Wed, 14 Jun 2023 14:01:25 GMT
Content-Type: application/json
Content-Length: 382
Connection: keep-alive
Access-Control-Expose-Headers: Location

{
  "id": "1890c034-7ef9-4cde-83df-d78ea1d4d281",
  "name": "new name",
  "tags": ["foo", "bar"],
  "owner": "94939159-d129-4f17-9e4e-cc2d615539d7",
  "credentials": { "identity": "updated.john.doe@email.com", "secret": "" },
  "metadata": { "foo": "bar" },
  "created_at": "2023-06-14T13:46:47.322648Z",
  "updated_at": "2023-06-14T13:59:53.422595Z",
  "updated_by": "94939159-d129-4f17-9e4e-cc2d615539d7",
  "status": "enabled"
}
```

### Disable User

Changing the user status to disabled can be done by calling the disable user function

> Must-have: `user_id` and `user_token`

```bash
curl -s -S -i -X GET -H "Authorization: Bearer <user_token>" http://localhost/users/<user_id>/disable
```

For example:

```bash
curl -s -S -i -X POST -H "Authorization: Bearer $USER_TOKEN" http://localhost/users/1890c034-7ef9-4cde-83df-d78ea1d4d281/disable

HTTP/1.1 200 OK
Server: nginx/1.23.3
Date: Wed, 14 Jun 2023 14:01:23 GMT
Content-Type: application/json
Content-Length: 383
Connection: keep-alive
Access-Control-Expose-Headers: Location

{
  "id": "1890c034-7ef9-4cde-83df-d78ea1d4d281",
  "name": "new name",
  "tags": ["foo", "bar"],
  "owner": "94939159-d129-4f17-9e4e-cc2d615539d7",
  "credentials": { "identity": "updated.john.doe@email.com", "secret": "" },
  "metadata": { "foo": "bar" },
  "created_at": "2023-06-14T13:46:47.322648Z",
  "updated_at": "2023-06-14T13:59:53.422595Z",
  "updated_by": "94939159-d129-4f17-9e4e-cc2d615539d7",
  "status": "disabled"
}
```

### Get User Memberships

You can get all groups a user is assigned to by calling the get user memberships function.

If you want to paginate your results then use this `offset`, `limit`, `metadata`, `name`, `status`, `parentID`, `ownerID`, `tree` and `dir` query parameters.

> Must-have: `user_id` and `user_token`
>
> Must take into consideration the user identified by the `user_token` needs to be assigned to the same group with `c_list` action or is the owner of the user identified by the `user_id`.

```bash
curl -s -S -i -X GET -H "Authorization: Bearer <user_token>" http://localhost/users/<user_id>/memberships
```

For example:

```bash
curl -s -S -i -X GET -H "Authorization: Bearer $USER_TOKEN" http://localhost/users/1890c034-7ef9-4cde-83df-d78ea1d4d281/memberships

HTTP/1.1 200 OK
Server: nginx/1.23.3
Date: Thu, 15 Jun 2023 11:22:18 GMT
Content-Type: application/json
Content-Length: 367
Connection: keep-alive
Access-Control-Expose-Headers: Location

{
  "limit": 0,
  "offset": 0,
  "memberships": [
    {
      "id": "2766ae94-9a08-4418-82ce-3b91cf2ccd3e",
      "owner_id": "94939159-d129-4f17-9e4e-cc2d615539d7",
      "name": "new name",
      "description": "new description",
      "metadata": { "foo": "bar" },
      "created_at": "2023-06-15T09:41:42.860481Z",
      "updated_at": "2023-06-15T10:17:56.475241Z",
      "updated_by": "94939159-d129-4f17-9e4e-cc2d615539d7",
      "status": "enabled"
    }
  ]
}
```

## Things

### Create Thing

To create a thing, you need the thing and a `user_token`

> Must-have: `user_token`

```bash
curl -s -S -i -X POST -H "Content-Type: application/json" -H "Authorization: Bearer <user_token>" http://localhost/things -d '{"name": "<thing_name>"}'
```

For example:

```bash
curl -s -S -i -X POST -H "Content-Type: application/json" -H "Authorization: Bearer $USER_TOKEN" http://localhost/things -d '{"name": "examplething"}'

HTTP/1.1 201 Created
Server: nginx/1.23.3
Date: Thu, 15 Jun 2023 09:04:04 GMT
Content-Type: application/json
Content-Length: 280
Connection: keep-alive
Location: /things/48101ecd-1535-40c6-9ed8-5b1d21e371bb
Access-Control-Expose-Headers: Location

{
  "id": "48101ecd-1535-40c6-9ed8-5b1d21e371bb",
  "name": "examplething",
  "owner": "94939159-d129-4f17-9e4e-cc2d615539d7",
  "credentials": { "secret": "c3f8c096-c60f-4375-8494-bca20a12fca7" },
  "created_at": "2023-06-15T09:04:04.292602664Z",
  "updated_at": "0001-01-01T00:00:00Z",
  "status": "enabled"
}
```

### Create Thing with External ID

It is often the case that the user will want to integrate the existing solutions, e.g. an asset management system, with the Mainflux platform. To simplify the integration between the systems and avoid artificial cross-platform reference, such as special fields in Mainflux Things metadata, it is possible to set Mainflux Thing ID with an existing unique ID while create the Thing. This way, the user can set the existing ID as the Thing ID of a newly created Thing to keep reference between Thing and the asset that Thing represents.

The limitation is that the existing ID has to be unique in the Mainflux domain.

To create a thing with an external ID, you need provide the ID together with thing name, and other fields as well as a `user_token`

> Must-have: `user_token`

```bash
curl -s -S -i -X POST -H "Content-Type: application/json" -H "Authorization: Bearer <user_token>" http://localhost/things -d '{"id": "<thing_id>","name": "<thing_name>"}'
```

For example:

```bash
curl -s -S -i -X POST -H "Content-Type: application/json" -H "Authorization: Bearer $USER_TOKEN" http://localhost/things -d '{"id": "2766ae94-9a08-4418-82ce-3b91cf2ccd3e", "name": "examplething"}'

HTTP/1.1 201 Created
Server: nginx/1.23.3
Date: Thu, 15 Jun 2023 09:05:06 GMT
Content-Type: application/json
Content-Length: 280
Connection: keep-alive
Location: /things/2766ae94-9a08-4418-82ce-3b91cf2ccd3e
Access-Control-Expose-Headers: Location

{
  "id": "2766ae94-9a08-4418-82ce-3b91cf2ccd3e",
  "name": "examplething",
  "owner": "94939159-d129-4f17-9e4e-cc2d615539d7",
  "credentials": { "secret": "65ca03bd-eb6b-420b-9d5d-46d459d4f71c" },
  "created_at": "2023-06-15T09:05:06.538170496Z",
  "updated_at": "0001-01-01T00:00:00Z",
  "status": "enabled"
}
```

### Create Thing with External Secret

It is often the case that the user will want to integrate the existing solutions, e.g. an asset management system, with the Mainflux platform. To simplify the integration between the systems and avoid artificial cross-platform reference, such as special fields in Mainflux Things metadata, it is possible to set Mainflux Thing secret with an existing unique secret while create the Thing. This way, the user can set the existing secret as the Thing secret of a newly created Thing to keep reference between Thing and the asset that Thing represents.
The limitation is that the existing secret has to be unique in the Mainflux domain.

To create a thing with an external secret, you need provide the secret together with thing name, and other fields as well as a `user_token`

> Must-have: `user_token`

```bash
curl -s -S -i -X POST -H "Content-Type: application/json" -H "Authorization: Bearer <user_token>" http://localhost/things -d '{"name": "<thing_name>", "credentials": {"secret": "<thing_secret>"}}'
```

For example:

```bash
curl -s -S -i -X POST -H "Content-Type: application/json" -H "Authorization: Bearer $USER_TOKEN" http://localhost/things -d '{"name": "examplething", "credentials": {"secret": "secret"}}'

HTTP/1.1 201 Created
Server: nginx/1.23.3
Date: Thu, 15 Jun 2023 09:05:06 GMT
Content-Type: application/json
Content-Length: 280
Connection: keep-alive
Location: /things/2766ae94-9a08-4418-82ce-3b91cf2ccd3e
Access-Control-Expose-Headers: Location

{
  "id": "2766ae94-9a08-4418-82ce-3b91cf2ccd3e",
  "name": "examplething",
  "owner": "94939159-d129-4f17-9e4e-cc2d615539d7",
  "credentials": { "secret": "secret" },
  "created_at": "2023-06-15T09:05:06.538170496Z",
  "updated_at": "0001-01-01T00:00:00Z",
  "status": "enabled"
}
```

### Create Things

You can create multiple things at once by entering a series of things structures and a `user_token`

> Must-have: `user_token` and at least two things

```bash
curl -s -S -i -X POST -H "Content-Type: application/json" -H "Authorization: Bearer <user_token>" http://localhost/things/bulk -d '[{"name": "<thing_name_1>"}, {"name": "<thing_name_2>"}]'
```

For example:

```bash
curl -s -S -i -X POST -H "Content-Type: application/json" -H "Authorization: Bearer $USER_TOKEN" http://localhost/things/bulk -d '[{"name": "thing_name_1"}, {"name": "thing_name_2"}]'

HTTP/1.1 200 OK
Server: nginx/1.23.3
Date: Thu, 15 Jun 2023 09:05:45 GMT
Content-Type: application/json
Content-Length: 583
Connection: keep-alive
Access-Control-Expose-Headers: Location

{
  "total": 2,
  "things": [
    {
      "id": "19f59b2d-1e9c-43db-bc84-5432bd52a83f",
      "name": "thing_name_1",
      "owner": "94939159-d129-4f17-9e4e-cc2d615539d7",
      "credentials": { "secret": "941c380a-3a41-40e9-8b79-3087daa4f3a6" },
      "created_at": "2023-06-15T09:05:45.719182307Z",
      "updated_at": "0001-01-01T00:00:00Z",
      "status": "enabled"
    },
    {
      "id": "3709f2b0-9c73-413f-992e-7f6f9b396b0d",
      "name": "thing_name_2",
      "owner": "94939159-d129-4f17-9e4e-cc2d615539d7",
      "credentials": { "secret": "798ee6be-311b-4640-99e4-0ccb19e0dcb9" },
      "created_at": "2023-06-15T09:05:45.719186184Z",
      "updated_at": "0001-01-01T00:00:00Z",
      "status": "enabled"
    }
  ]
}
```

### Create Things with external ID

The same as creating a Thing with external ID the user can create multiple things at once by providing UUID v4 format unique ID in a series of things together with a `user_token`

> Must-have: `user_token` and at least two things

```bash
curl -s -S -i -X POST -H "Content-Type: application/json" -H "Authorization: Bearer <user_token>" http://localhost/things/bulk -d '[{"id": "<thing_id_1>","name": "<thing_name_1>"},{"id": "<thing_id_2>","name": "<thing_name_2>"}]'
```

For example:

```bash
curl -s -S -i -X POST -H "Content-Type: application/json" -H "Authorization: Bearer $USER_TOKEN" http://localhost/things/bulk -d '[{"id": "eb2670ba-a2be-4ea4-83cb-111111111111","name": "thing_name_1"},{"id": "eb2670ba-a2be-4ea4-83cb-111111111112","name": "thing_name_2"}]'

HTTP/1.1 200 OK
Server: nginx/1.23.3
Date: Thu, 15 Jun 2023 09:06:17 GMT
Content-Type: application/json
Content-Length: 583
Connection: keep-alive
Access-Control-Expose-Headers: Location

{
  "total": 2,
  "things": [
    {
      "id": "eb2670ba-a2be-4ea4-83cb-111111111111",
      "name": "thing_name_1",
      "owner": "94939159-d129-4f17-9e4e-cc2d615539d7",
      "credentials": { "secret": "325cda17-3a52-465d-89a7-2b63c7d0e3a6" },
      "created_at": "2023-06-15T09:06:17.967825372Z",
      "updated_at": "0001-01-01T00:00:00Z",
      "status": "enabled"
    },
    {
      "id": "eb2670ba-a2be-4ea4-83cb-111111111112",
      "name": "thing_name_2",
      "owner": "94939159-d129-4f17-9e4e-cc2d615539d7",
      "credentials": { "secret": "67b6cbb8-4a9e-4d32-8b9c-d7cd3352aa2b" },
      "created_at": "2023-06-15T09:06:17.967828689Z",
      "updated_at": "0001-01-01T00:00:00Z",
      "status": "enabled"
    }
  ]
}
```

### Get Thing

You can get thing entity by entering the thing ID and `user_token`

> Must-have: `user_token` and `thing_id`

```bash
curl -s -S -i -X GET -H "Authorization: Bearer <user_token>" http://localhost/things/<thing_id>
```

For example:

```bash
curl -s -S -i -X GET -H "Authorization: Bearer $USER_TOKEN" http://localhost/things/48101ecd-1535-40c6-9ed8-5b1d21e371bb

HTTP/1.1 200 OK
Server: nginx/1.23.3
Date: Thu, 15 Jun 2023 09:07:30 GMT
Content-Type: application/json
Content-Length: 277
Connection: keep-alive
Access-Control-Expose-Headers: Location

{
  "id": "48101ecd-1535-40c6-9ed8-5b1d21e371bb",
  "name": "examplething",
  "owner": "94939159-d129-4f17-9e4e-cc2d615539d7",
  "credentials": { "secret": "c3f8c096-c60f-4375-8494-bca20a12fca7" },
  "created_at": "2023-06-15T09:04:04.292602Z",
  "updated_at": "0001-01-01T00:00:00Z",
  "status": "enabled"
}
```

### Get Things

You can get all things in the database by querying this endpoint.

> Must-have: `user_token`

```bash
curl -s -S -i -X GET -H "Authorization: Bearer <user_token>" http://localhost/things
```

For example:

```bash
curl -s -S -i -X GET -H "Authorization: Bearer $USER_TOKEN" http://localhost/things

HTTP/1.1 200 OK
Server: nginx/1.23.3
Date: Thu, 15 Jun 2023 09:07:59 GMT
Content-Type: application/json
Transfer-Encoding: chunked
Connection: keep-alive
Access-Control-Expose-Headers: Location

{
  "limit": 10,
  "total": 8,
  "things": [
    {
      "id": "f3047c10-f2c7-4d53-b3c0-bc56c560c546",
      "name": "weio",
      "owner": "94939159-d129-4f17-9e4e-cc2d615539d7",
      "credentials": { "secret": "6d11a91f-0bd8-41aa-8e1b-4c6338329c9c" },
      "created_at": "2023-06-14T12:04:12.740098Z",
      "updated_at": "0001-01-01T00:00:00Z",
      "status": "enabled"
    },
    {
      "id": "04b0b2d1-fdaf-4b66-96a0-740a3151db4c",
      "name": "bob",
      "owner": "94939159-d129-4f17-9e4e-cc2d615539d7",
      "credentials": { "secret": "a1e5d77f-8903-4cef-87b1-d793a3c28de3" },
      "created_at": "2023-06-14T12:04:56.245743Z",
      "updated_at": "0001-01-01T00:00:00Z",
      "status": "enabled"
    },
    {
      "id": "48101ecd-1535-40c6-9ed8-5b1d21e371bb",
      "name": "examplething",
      "owner": "94939159-d129-4f17-9e4e-cc2d615539d7",
      "credentials": { "secret": "c3f8c096-c60f-4375-8494-bca20a12fca7" },
      "created_at": "2023-06-15T09:04:04.292602Z",
      "updated_at": "0001-01-01T00:00:00Z",
      "status": "enabled"
    },
    {
      "id": "2766ae94-9a08-4418-82ce-3b91cf2ccd3e",
      "name": "examplething",
      "owner": "94939159-d129-4f17-9e4e-cc2d615539d7",
      "credentials": { "secret": "65ca03bd-eb6b-420b-9d5d-46d459d4f71c" },
      "created_at": "2023-06-15T09:05:06.53817Z",
      "updated_at": "0001-01-01T00:00:00Z",
      "status": "enabled"
    },
    {
      "id": "19f59b2d-1e9c-43db-bc84-5432bd52a83f",
      "name": "thing_name_1",
      "owner": "94939159-d129-4f17-9e4e-cc2d615539d7",
      "credentials": { "secret": "941c380a-3a41-40e9-8b79-3087daa4f3a6" },
      "created_at": "2023-06-15T09:05:45.719182Z",
      "updated_at": "0001-01-01T00:00:00Z",
      "status": "enabled"
    },
    {
      "id": "3709f2b0-9c73-413f-992e-7f6f9b396b0d",
      "name": "thing_name_2",
      "owner": "94939159-d129-4f17-9e4e-cc2d615539d7",
      "credentials": { "secret": "798ee6be-311b-4640-99e4-0ccb19e0dcb9" },
      "created_at": "2023-06-15T09:05:45.719186Z",
      "updated_at": "0001-01-01T00:00:00Z",
      "status": "enabled"
    },
    {
      "id": "eb2670ba-a2be-4ea4-83cb-111111111111",
      "name": "thing_name_1",
      "owner": "94939159-d129-4f17-9e4e-cc2d615539d7",
      "credentials": { "secret": "325cda17-3a52-465d-89a7-2b63c7d0e3a6" },
      "created_at": "2023-06-15T09:06:17.967825Z",
      "updated_at": "0001-01-01T00:00:00Z",
      "status": "enabled"
    },
    {
      "id": "eb2670ba-a2be-4ea4-83cb-111111111112",
      "name": "thing_name_2",
      "owner": "94939159-d129-4f17-9e4e-cc2d615539d7",
      "credentials": { "secret": "67b6cbb8-4a9e-4d32-8b9c-d7cd3352aa2b" },
      "created_at": "2023-06-15T09:06:17.967828Z",
      "updated_at": "0001-01-01T00:00:00Z",
      "status": "enabled"
    }
  ]
}
```

If you want to paginate your results then use this

> Must have: `user_token`
>
> Additional parameters: `offset`, `limit`, `metadata`, `name`, `status`, `tags` and `visibility`

```bash
curl -s -S -i -X GET -H "Authorization: Bearer <user_token>" http://localhost/things?offset=<offset>&limit=<limit>&name=<name>
```

For example:

```bash
curl -s -S -i -X GET -H "Authorization: Bearer $USER_TOKEN" http://localhost/things?offset=1&limit=5&name=thing_name_2

HTTP/1.1 200 OK
Server: nginx/1.23.3
Date: Thu, 15 Jun 2023 09:08:39 GMT
Content-Type: application/json
Content-Length: 321
Connection: keep-alive
Access-Control-Expose-Headers: Location

{
  "limit": 5,
  "offset": 1,
  "total": 2,
  "things": [
    {
      "id": "eb2670ba-a2be-4ea4-83cb-111111111112",
      "name": "thing_name_2",
      "owner": "94939159-d129-4f17-9e4e-cc2d615539d7",
      "credentials": { "secret": "67b6cbb8-4a9e-4d32-8b9c-d7cd3352aa2b" },
      "created_at": "2023-06-15T09:06:17.967828Z",
      "updated_at": "0001-01-01T00:00:00Z",
      "status": "enabled"
    }
  ]
}
```

### Update Thing

Updating a thing name and/or metadata

> Must-have: `user_token` and `thing_id`

```bash
curl -s -S -i -X PUT -H "Content-Type: application/json" -H  "Authorization: Bearer <user_token>" http://localhost/things/<thing_id> -d '{"name": "<thing_name>"}'
```

For example:

```bash
curl -s -S -i -X PATCH -H "Content-Type: application/json" -H "Authorization: Bearer $USER_TOKEN" http://localhost/things/48101ecd-1535-40c6-9ed8-5b1d21e371bb -d '{"name": "new name"}'

HTTP/1.1 200 OK
Server: nginx/1.23.3
Date: Thu, 15 Jun 2023 09:09:12 GMT
Content-Type: application/json
Content-Length: 332
Connection: keep-alive
Access-Control-Expose-Headers: Location

{
  "id": "48101ecd-1535-40c6-9ed8-5b1d21e371bb",
  "name": "new name",
  "owner": "94939159-d129-4f17-9e4e-cc2d615539d7",
  "credentials": { "secret": "c3f8c096-c60f-4375-8494-bca20a12fca7" },
  "created_at": "2023-06-15T09:04:04.292602Z",
  "updated_at": "2023-06-15T09:09:12.267074Z",
  "updated_by": "94939159-d129-4f17-9e4e-cc2d615539d7",
  "status": "enabled"
}
```

### Update Thing Tags

Updating a thing tags

> Must-have: `user_token` and `thing_id`

```bash
curl -s -S -i -X PUT -H "Content-Type: application/json" -H  "Authorization: Bearer <user_token>" http://localhost/things/<thing_id>/tags -d '{"tags": ["tag_1", ..., "tag_N"]}'
```

For example:

```bash
curl -s -S -i -X PATCH -H "Content-Type: application/json" -H "Authorization: Bearer $USER_TOKEN" http://localhost/things/48101ecd-1535-40c6-9ed8-5b1d21e371bb/tags -d '{"tags": ["tag"]}'

HTTP/1.1 200 OK
Server: nginx/1.23.3
Date: Thu, 15 Jun 2023 09:09:44 GMT
Content-Type: application/json
Content-Length: 347
Connection: keep-alive
Access-Control-Expose-Headers: Location

{
  "id": "48101ecd-1535-40c6-9ed8-5b1d21e371bb",
  "name": "new name",
  "tags": ["tag"],
  "owner": "94939159-d129-4f17-9e4e-cc2d615539d7",
  "credentials": { "secret": "c3f8c096-c60f-4375-8494-bca20a12fca7" },
  "created_at": "2023-06-15T09:04:04.292602Z",
  "updated_at": "2023-06-15T09:09:44.766726Z",
  "updated_by": "94939159-d129-4f17-9e4e-cc2d615539d7",
  "status": "enabled"
}
```

### Update Thing Owner

Updating a thing entity

> Must-have: `user_token` and `thing_id`

```bash
curl -s -S -i -X PUT -H "Content-Type: application/json" -H  "Authorization: Bearer <user_token>" http://localhost/things/<thing_id>/owner -d '{"owner": "<owner_id>"}'
```

For example:

```bash
curl -s -S -i -X PATCH -H "Content-Type: application/json" -H "Authorization: Bearer $USER_TOKEN" http://localhost/things/48101ecd-1535-40c6-9ed8-5b1d21e371bb -d '{"owner": "f7c55a1f-dde8-4880-9796-b3a0cd05745b"}'

HTTP/1.1 200 OK
Server: nginx/1.23.3
Date: Thu, 15 Jun 2023 09:09:44 GMT
Content-Type: application/json
Content-Length: 347
Connection: keep-alive
Access-Control-Expose-Headers: Location

{
  "id": "48101ecd-1535-40c6-9ed8-5b1d21e371bb",
  "name": "new name",
  "tags": ["tag"],
  "owner": "f7c55a1f-dde8-4880-9796-b3a0cd05745b",
  "credentials": { "secret": "c3f8c096-c60f-4375-8494-bca20a12fca7" },
  "created_at": "2023-06-15T09:04:04.292602Z",
  "updated_at": "2023-06-15T09:09:44.766726Z",
  "updated_by": "94939159-d129-4f17-9e4e-cc2d615539d7",
  "status": "enabled"
}
```

### Update Thing Secret

Updating a thing secret

> Must-have: `user_token` and `thing_id`

```bash
curl -s -S -i -X PUT -H "Content-Type: application/json" -H  "Authorization: Bearer <user_token>" http://localhost/things/<thing_id>/secret -d '{"secret": "<thing_secret>"}'
```

For example:

```bash
curl -s -S -i -X PATCH -H "Content-Type: application/json" -H "Authorization: Bearer $USER_TOKEN" http://localhost/things/48101ecd-1535-40c6-9ed8-5b1d21e371bb/secret -d '{"secret": "secret-key"}'

HTTP/1.1 200 OK
Server: nginx/1.23.3
Date: Thu, 15 Jun 2023 09:10:52 GMT
Content-Type: application/json
Content-Length: 321
Connection: keep-alive
Access-Control-Expose-Headers: Location

{
  "id": "48101ecd-1535-40c6-9ed8-5b1d21e371bb",
  "name": "new name",
  "tags": ["tag"],
  "owner": "94939159-d129-4f17-9e4e-cc2d615539d7",
  "credentials": { "secret": "secret-key" },
  "created_at": "2023-06-15T09:04:04.292602Z",
  "updated_at": "2023-06-15T09:10:52.051497Z",
  "updated_by": "94939159-d129-4f17-9e4e-cc2d615539d7",
  "status": "enabled"
}
```

### Enable Thing

To enable a thing you need a `thing_id` and a `user_token`

> Must-have: `user_token` and `thing_id`

```bash
curl -s -S -i -X POST -H "Content-Type: application/json" -H  "Authorization: Bearer <user_token>" http://localhost/things/<thing_id>/enable
```

For example:

```bash
curl -s -S -i -X POST -H "Content-Type: application/json" -H "Authorization: Bearer $USER_TOKEN" http://localhost/things/48101ecd-1535-40c6-9ed8-5b1d21e371bb/enable

HTTP/1.1 200 OK
Server: nginx/1.23.3
Date: Thu, 15 Jun 2023 09:11:43 GMT
Content-Type: application/json
Content-Length: 321
Connection: keep-alive
Access-Control-Expose-Headers: Location

{
  "id": "48101ecd-1535-40c6-9ed8-5b1d21e371bb",
  "name": "new name",
  "tags": ["tag"],
  "owner": "94939159-d129-4f17-9e4e-cc2d615539d7",
  "credentials": { "secret": "secret-key" },
  "created_at": "2023-06-15T09:04:04.292602Z",
  "updated_at": "2023-06-15T09:10:52.051497Z",
  "updated_by": "94939159-d129-4f17-9e4e-cc2d615539d7",
  "status": "enabled"
}
```

### Disable Thing

To disable a thing you need a `thing_id` and a `user_token`

> Must-have: `user_token` and `thing_id`

```bash
curl -s -S -i -X POST -H "Content-Type: application/json" -H  "Authorization: Bearer <user_token>" http://localhost/things/<thing_id>/disable
```

For example:

```bash
curl -s -S -i -X POST -H "Content-Type: application/json" -H "Authorization: Bearer $USER_TOKEN" http://localhost/things/48101ecd-1535-40c6-9ed8-5b1d21e371bb/disable

HTTP/1.1 200 OK
Server: nginx/1.23.3
Date: Thu, 15 Jun 2023 09:11:38 GMT
Content-Type: application/json
Content-Length: 322
Connection: keep-alive
Access-Control-Expose-Headers: Location

{
  "id": "48101ecd-1535-40c6-9ed8-5b1d21e371bb",
  "name": "new name",
  "tags": ["tag"],
  "owner": "94939159-d129-4f17-9e4e-cc2d615539d7",
  "credentials": { "secret": "secret-key" },
  "created_at": "2023-06-15T09:04:04.292602Z",
  "updated_at": "2023-06-15T09:10:52.051497Z",
  "updated_by": "94939159-d129-4f17-9e4e-cc2d615539d7",
  "status": "disabled"
}
```

## Channels

### Create Channel

To create a channel, you need a `user_token`

> Must-have: `user_token`

```bash
curl -s -S -i -X POST -H "Content-Type: application/json" -H "Authorization: Bearer <user_token>" http://localhost/channels -d '{"name": "<channel_name>"}'
```

For example:

```bash
curl -s -S -i -X POST -H "Content-Type: application/json" -H "Authorization: Bearer $USER_TOKEN" http://localhost/channels -d '{"name": "examplechannel"}'

HTTP/1.1 201 Created
Server: nginx/1.23.3
Date: Thu, 15 Jun 2023 09:12:51 GMT
Content-Type: application/json
Content-Length: 218
Connection: keep-alive
Location: /channels/aecf0902-816d-4e38-a5b3-a1ad9a7cf9e8
Access-Control-Expose-Headers: Location

{
  "id": "aecf0902-816d-4e38-a5b3-a1ad9a7cf9e8",
  "owner_id": "94939159-d129-4f17-9e4e-cc2d615539d7",
  "name": "examplechannel",
  "created_at": "2023-06-15T09:12:51.162431Z",
  "updated_at": "0001-01-01T00:00:00Z",
  "status": "enabled"
}
```

### Create Channel with external ID

Channel is a group of things that could represent a special category in existing systems, e.g. a building level channel could represent the level of a smarting building system. For helping to keep the reference, it is possible to set an existing ID while creating the Mainflux channel. There are two limitations - the existing ID has to be in UUID V4 format and it has to be unique in the Mainflux domain.

To create a channel with external ID, the user needs provide a UUID v4 format unique ID, and a `user_token`

> Must-have: `user_token`, `name`
>
> Nice-to-have: `parent_id`, `metadata`, `owner_id`, `description` and `status`

```bash
curl -s -S -i -X POST -H "Content-Type: application/json" -H "Authorization: Bearer <user_token>" http://localhost/channels -d '{"id": "<channel_id>","name": "<channel_name>"}'
```

For example:

```bash
curl -s -S -i -X POST -H "Content-Type: application/json" -H "Authorization: Bearer $USER_TOKEN" http://localhost/channels -d '{"id": "48101ecd-1535-40c6-9ed8-5b1d21e371bb", "name": "examplechannel2"}'

HTTP/1.1 201 Created
Server: nginx/1.23.3
Date: Thu, 15 Jun 2023 09:15:11 GMT
Content-Type: application/json
Content-Length: 219
Connection: keep-alive
Location: /channels/48101ecd-1535-40c6-9ed8-5b1d21e371bb
Access-Control-Expose-Headers: Location

{
  "id": "48101ecd-1535-40c6-9ed8-5b1d21e371bb",
  "owner_id": "94939159-d129-4f17-9e4e-cc2d615539d7",
  "name": "examplechannel2",
  "created_at": "2023-06-15T09:15:11.477695Z",
  "updated_at": "0001-01-01T00:00:00Z",
  "status": "enabled"
}
```

### Create Channels

The same as creating a channel with external ID the user can create multiple channels at once by providing UUID v4 format unique ID in a series of channels together with a `user_token`

> Must-have: `user_token` and at least 2 channels

```bash
curl -s -S -i -X POST -H "Content-Type: application/json" -H "Authorization: Bearer <user_token>" http://localhost/channels/bulk -d '[{"name": "<channel_name_1>"}, {"name": "<channel_name_2>"}]'
```

For example:

```bash
curl -s -S -i -X POST -H "Content-Type: application/json" -H "Authorization: Bearer $USER_TOKEN" http://localhost/channels/bulk -d '[{"name": "channel_name_1"}, {"name": "channel_name_2"}]'

HTTP/1.1 200 OK
Server: nginx/1.23.3
Date: Thu, 15 Jun 2023 09:15:44 GMT
Content-Type: application/json
Content-Length: 450
Connection: keep-alive
Access-Control-Expose-Headers: Location

{
  "channels": [
    {
      "id": "cb81bbff-850d-471f-bd74-c15d6e1a6c4e",
      "owner_id": "94939159-d129-4f17-9e4e-cc2d615539d7",
      "name": "channel_name_1",
      "created_at": "2023-06-15T09:15:44.154283Z",
      "updated_at": "0001-01-01T00:00:00Z",
      "status": "enabled"
    },
    {
      "id": "fc9bf029-b1d3-4408-8d53-fc576247a4b3",
      "owner_id": "94939159-d129-4f17-9e4e-cc2d615539d7",
      "name": "channel_name_2",
      "created_at": "2023-06-15T09:15:44.15721Z",
      "updated_at": "0001-01-01T00:00:00Z",
      "status": "enabled"
    }
  ]
}
```

### Create Channels with external ID

As with things, you can create multiple channels with external ID at once

> Must-have: `user_token` and at least 2 channels

```bash
curl -s -S -i -X POST -H "Content-Type: application/json" -H "Authorization: Bearer <user_token>" http://localhost/channels/bulk -d '[{"id": "<channel_id_1>","name": "<channel_name_1>"}, {"id": "<channel_id_2>","name": "<channel_name_2>"}]'
```

For example:

```bash
curl -s -S -i -X POST -H "Content-Type: application/json" -H "Authorization: Bearer $USER_TOKEN" http://localhost/channels/bulk -d '[{"id": "977bbd33-5b59-4b7a-a9c3-111111111111","name": "channel_name_1a"}, {"id": "977bbd33-5b59-4b7a-a9c3-111111111112","name": "channel_name_2a"}]'

HTTP/1.1 200 OK
Server: nginx/1.23.3
Date: Thu, 15 Jun 2023 09:16:16 GMT
Content-Type: application/json
Content-Length: 453
Connection: keep-alive
Access-Control-Expose-Headers: Location

{
  "channels": [
    {
      "id": "977bbd33-5b59-4b7a-a9c3-111111111111",
      "owner_id": "94939159-d129-4f17-9e4e-cc2d615539d7",
      "name": "channel_name_1a",
      "created_at": "2023-06-15T09:16:16.931016Z",
      "updated_at": "0001-01-01T00:00:00Z",
      "status": "enabled"
    },
    {
      "id": "977bbd33-5b59-4b7a-a9c3-111111111112",
      "owner_id": "94939159-d129-4f17-9e4e-cc2d615539d7",
      "name": "channel_name_2a",
      "created_at": "2023-06-15T09:16:16.934486Z",
      "updated_at": "0001-01-01T00:00:00Z",
      "status": "enabled"
    }
  ]
}
```

### Get Channel

Get a channel entity for a logged in user

> Must-have: `user_token` and `channel_id`

```bash
curl -s -S -i -X GET -H "Authorization: Bearer <user_token>" http://localhost/channels/<channel_id>
```

For example:

```bash
curl -s -S -i -X GET -H "Authorization: Bearer $USER_TOKEN" http://localhost/channels/aecf0902-816d-4e38-a5b3-a1ad9a7cf9e8

HTTP/1.1 200 OK
Server: nginx/1.23.3
Date: Thu, 15 Jun 2023 09:17:17 GMT
Content-Type: application/json
Content-Length: 218
Connection: keep-alive
Access-Control-Expose-Headers: Location

{
  "id": "aecf0902-816d-4e38-a5b3-a1ad9a7cf9e8",
  "owner_id": "94939159-d129-4f17-9e4e-cc2d615539d7",
  "name": "examplechannel",
  "created_at": "2023-06-15T09:12:51.162431Z",
  "updated_at": "0001-01-01T00:00:00Z",
  "status": "enabled"
}
```

### Get Channels

You can get all channels for a logged in user.

If you want to paginate your results then use this `offset`, `limit`, `metadata`, `name`, `status`, `parentID`, `ownerID`, `tree` and `dir` query parameters.

> Must-have: `user_token`

```bash
curl -s -S -i -X GET -H "Authorization: Bearer <user_token>" http://localhost/channels
```

For example:

```bash
curl -s -S -i -X GET -H "Authorization: Bearer $USER_TOKEN" http://localhost/channels

HTTP/1.1 200 OK
Server: nginx/1.23.3
Date: Thu, 15 Jun 2023 09:17:46 GMT
Content-Type: application/json
Content-Length: 1754
Connection: keep-alive
Access-Control-Expose-Headers: Location

{
  "total": 8,
  "channels": [
    {
      "id": "17129934-4f48-4163-bffe-0b7b532edc5c",
      "owner_id": "94939159-d129-4f17-9e4e-cc2d615539d7",
      "name": "betty",
      "created_at": "2023-06-14T12:10:07.950311Z",
      "updated_at": "0001-01-01T00:00:00Z",
      "status": "enabled"
    },
    {
      "id": "48101ecd-1535-40c6-9ed8-5b1d21e371bb",
      "owner_id": "94939159-d129-4f17-9e4e-cc2d615539d7",
      "name": "examplechannel2",
      "created_at": "2023-06-15T09:15:11.477695Z",
      "updated_at": "0001-01-01T00:00:00Z",
      "status": "enabled"
    },
    {
      "id": "977bbd33-5b59-4b7a-a9c3-111111111111",
      "owner_id": "94939159-d129-4f17-9e4e-cc2d615539d7",
      "name": "channel_name_1a",
      "created_at": "2023-06-15T09:16:16.931016Z",
      "updated_at": "0001-01-01T00:00:00Z",
      "status": "enabled"
    },
    {
      "id": "977bbd33-5b59-4b7a-a9c3-111111111112",
      "owner_id": "94939159-d129-4f17-9e4e-cc2d615539d7",
      "name": "channel_name_2a",
      "created_at": "2023-06-15T09:16:16.934486Z",
      "updated_at": "0001-01-01T00:00:00Z",
      "status": "enabled"
    },
    {
      "id": "aecf0902-816d-4e38-a5b3-a1ad9a7cf9e8",
      "owner_id": "94939159-d129-4f17-9e4e-cc2d615539d7",
      "name": "examplechannel",
      "created_at": "2023-06-15T09:12:51.162431Z",
      "updated_at": "0001-01-01T00:00:00Z",
      "status": "enabled"
    },
    {
      "id": "b3867a52-675d-4f05-8cd0-df5a08a63ff3",
      "owner_id": "94939159-d129-4f17-9e4e-cc2d615539d7",
      "name": "mychan",
      "created_at": "2023-06-14T12:09:34.205894Z",
      "updated_at": "0001-01-01T00:00:00Z",
      "status": "enabled"
    },
    {
      "id": "cb81bbff-850d-471f-bd74-c15d6e1a6c4e",
      "owner_id": "94939159-d129-4f17-9e4e-cc2d615539d7",
      "name": "channel_name_1",
      "created_at": "2023-06-15T09:15:44.154283Z",
      "updated_at": "0001-01-01T00:00:00Z",
      "status": "enabled"
    },
    {
      "id": "fc9bf029-b1d3-4408-8d53-fc576247a4b3",
      "owner_id": "94939159-d129-4f17-9e4e-cc2d615539d7",
      "name": "channel_name_2",
      "created_at": "2023-06-15T09:15:44.15721Z",
      "updated_at": "0001-01-01T00:00:00Z",
      "status": "enabled"
    }
  ]
}
```

### Update Channel

Update channel name and/or metadata.

> Must-have: `user_token` and `channel_id`

```bash
curl -s -S -i -X PUT -H "Content-Type: application/json" -H  "Authorization: Bearer <user_token>" http://localhost/channels/<channel_id> -d '{"name": "<channel_name>"}'
```

For example:

```bash
curl -s -S -i -X PUT -H "Content-Type: application/json" -H "Authorization: Bearer $USER_TOKEN" http://localhost/channels/aecf0902-816d-4e38-a5b3-a1ad9a7cf9e8 -d '{"name": "new name", "metadata": {"foo": "bar"}}'

HTTP/1.1 200 OK
Server: nginx/1.23.3
Date: Thu, 15 Jun 2023 09:18:26 GMT
Content-Type: application/json
Content-Length: 296
Connection: keep-alive
Access-Control-Expose-Headers: Location

{
  "id": "aecf0902-816d-4e38-a5b3-a1ad9a7cf9e8",
  "owner_id": "94939159-d129-4f17-9e4e-cc2d615539d7",
  "name": "new name",
  "metadata": { "foo": "bar" },
  "created_at": "2023-06-15T09:12:51.162431Z",
  "updated_at": "2023-06-15T09:18:26.886913Z",
  "updated_by": "94939159-d129-4f17-9e4e-cc2d615539d7",
  "status": "enabled"
}
```

### Enable Channel

To enable a channel you need a `channel_id` and a `user_token`

> Must-have: `user_token` and `channel_id`

```bash
curl -s -S -i -X POST -H "Content-Type: application/json" -H  "Authorization: Bearer <user_token>" http://localhost/channels/<channel_id>/enable
```

For example:

```bash
curl -s -S -i -X POST -H "Content-Type: application/json" -H "Authorization: Bearer $USER_TOKEN" http://localhost/channels/aecf0902-816d-4e38-a5b3-a1ad9a7cf9e8/enable

HTTP/1.1 200 OK
Server: nginx/1.23.3
Date: Thu, 15 Jun 2023 09:19:29 GMT
Content-Type: application/json
Content-Length: 296
Connection: keep-alive
Access-Control-Expose-Headers: Location

{
  "id": "aecf0902-816d-4e38-a5b3-a1ad9a7cf9e8",
  "owner_id": "94939159-d129-4f17-9e4e-cc2d615539d7",
  "name": "new name",
  "metadata": { "foo": "bar" },
  "created_at": "2023-06-15T09:12:51.162431Z",
  "updated_at": "2023-06-15T09:18:26.886913Z",
  "updated_by": "94939159-d129-4f17-9e4e-cc2d615539d7",
  "status": "enabled"
}
```

### Disable Channel

To disable a channel you need a `channel_id` and a `user_token`

> Must-have: `user_token` and `channel_id`

```bash
curl -s -S -i -X POST -H "Content-Type: application/json" -H  "Authorization: Bearer <user_token>" http://localhost/channels/<channel_id>/disable
```

For example:

```bash
curl -s -S -i -X POST -H "Content-Type: application/json" -H "Authorization: Bearer $USER_TOKEN" http://localhost/channels/aecf0902-816d-4e38-a5b3-a1ad9a7cf9e8/disable

HTTP/1.1 200 OK
Server: nginx/1.23.3
Date: Thu, 15 Jun 2023 09:19:24 GMT
Content-Type: application/json
Content-Length: 297
Connection: keep-alive
Access-Control-Expose-Headers: Location

{
  "id": "aecf0902-816d-4e38-a5b3-a1ad9a7cf9e8",
  "owner_id": "94939159-d129-4f17-9e4e-cc2d615539d7",
  "name": "new name",
  "metadata": { "foo": "bar" },
  "created_at": "2023-06-15T09:12:51.162431Z",
  "updated_at": "2023-06-15T09:18:26.886913Z",
  "updated_by": "94939159-d129-4f17-9e4e-cc2d615539d7",
  "status": "disabled"
}
```

### Connect

Connect things to channels

> Must-have: `user_token`, `channel_id` and `thing_id`
>
> `actions` is optional, if not provided, the default action is `read` and `write`.

```bash
curl -s -S -i -X POST -H "Content-Type: application/json" -H "Authorization: Bearer <user_token>" http://localhost/connect -d '{"objects": ["<channel_id>"], "subjects": ["<thing_id>"], "actions": ["<action>"]}'
```

For example:

```bash
curl -s -S -i -X POST -H "Content-Type: application/json" -H "Authorization: Bearer $USER_TOKEN" http://localhost/connect -d '{"objects": ["aecf0902-816d-4e38-a5b3-a1ad9a7cf9e8"], "subjects": ["48101ecd-1535-40c6-9ed8-5b1d21e371bb"]}'

HTTP/1.1 201 Created
Server: nginx/1.23.3
Date: Thu, 15 Jun 2023 09:21:37 GMT
Content-Type: application/json
Content-Length: 247
Connection: keep-alive
Access-Control-Expose-Headers: Location

{
  "policies": [
    {
      "owner_id": "",
      "subject": "48101ecd-1535-40c6-9ed8-5b1d21e371bb",
      "object": "aecf0902-816d-4e38-a5b3-a1ad9a7cf9e8",
      "actions": ["m_write", "m_read"],
      "created_at": "0001-01-01T00:00:00Z",
      "updated_at": "0001-01-01T00:00:00Z",
      "updated_by": ""
    }
  ]
}
```

Connect thing to channel

> Must-have: `user_token`, `channel_id` and `thing_id`
>
> `actions` is optional, if not provided, the default action is `read` and `write`.

```bash
curl -s -S -i -X POST -H "Content-Type: application/json" -H "Authorization: Bearer <user_token>" http://localhost/things/policies -d '{"subject": "<thing_id>", "object": "<channel_id>", "actions": ["<action>"]}'
```

For example:

```bash
curl -s -S -i -X POST -H "Content-Type: application/json" -H "Authorization: Bearer $USER_TOKEN" http://localhost/things/policies -d '{"subject": "48101ecd-1535-40c6-9ed8-5b1d21e371bb", "object": "aecf0902-816d-4e38-a5b3-a1ad9a7cf9e8"}'

HTTP/1.1 201 Created
Server: nginx/1.23.3
Date: Thu, 15 Jun 2023 09:23:28 GMT
Content-Type: application/json
Content-Length: 290
Connection: keep-alive
Access-Control-Expose-Headers: Location

{
  "policies": [
    {
      "owner_id": "94939159-d129-4f17-9e4e-cc2d615539d7",
      "subject": "48101ecd-1535-40c6-9ed8-5b1d21e371bb",
      "object": "aecf0902-816d-4e38-a5b3-a1ad9a7cf9e8",
      "actions": ["m_write", "m_read"],
      "created_at": "2023-06-15T09:23:28.769729Z",
      "updated_at": "0001-01-01T00:00:00Z",
      "updated_by": ""
    }
  ]
}
```

### Disconnect

Disconnect things from channels specified by lists of IDs.

> Must-have: `user_token`, `channel_ids` and `thing_ids`

```bash
curl -s -S -i -X PUT -H "Content-Type: application/json" -H "Authorization: Bearer <user_token>" http://localhost/disconnect -d '{"subjects": ["<thing_id_1>", "<thing_id_2>"], "objects": ["<channel_id_1>", "<channel_id_2>"]}'
```

For example:

```bash
curl -s -S -i -X POST -H "Content-Type: application/json" -H "Authorization: Bearer $USER_TOKEN" http://localhost/disconnect -d '{"objects": ["aecf0902-816d-4e38-a5b3-a1ad9a7cf9e8"], "subjects": ["48101ecd-1535-40c6-9ed8-5b1d21e371bb"]}'

HTTP/1.1 204 No Content
Server: nginx/1.23.3
Date: Thu, 15 Jun 2023 09:23:07 GMT
Content-Type: application/json
Connection: keep-alive
Access-Control-Expose-Headers: Location
```

Disconnect thing from the channel

> Must-have: `user_token`, `channel_id` and `thing_id`

```bash
curl -s -S -i -X DELETE -H "Content-Type: application/json" -H "Authorization: Bearer <user_token>" http://localhost/things/policies -d '{"subject": "<thing_id>", "object": "<channel_id>"}'
```

For example:

```bash
curl -s -S -i -X DELETE -H "Content-Type: application/json" -H "Authorization: Bearer $USER_TOKEN" http://localhost/things/policies -d '{"subject": "48101ecd-1535-40c6-9ed8-5b1d21e371bb", "object": "aecf0902-816d-4e38-a5b3-a1ad9a7cf9e8"}'

HTTP/1.1 204 No Content
Server: nginx/1.23.3
Date: Thu, 15 Jun 2023 09:25:23 GMT
Content-Type: application/json
Connection: keep-alive
Access-Control-Expose-Headers: Location
```

### Access by Key

Checks if thing has access to a channel

> Must-have: `channel_id`, `thing_secret`, `action` and `entity_type`

```bash
curl -s -S -i -X POST -H "Content-Type: application/json" http://localhost/channels/<channel_id>/access -d '{"subject": "<thing_secret>", "action": "m_read" | "m_write", "entity_type": "group"}'
```

For example:

```bash
curl -s -S -i -X POST -H "Content-Type: application/json" http://localhost/channels/aecf0902-816d-4e38-a5b3-a1ad9a7cf9e8/access -d '{"subject": "48101ecd-1535-40c6-9ed8-5b1d21e371bb", "action": "m_read", "entity_type": "group"}'

HTTP/1.1 200 OK
Server: nginx/1.23.3
Date: Thu, 15 Jun 2023 09:39:26 GMT
Content-Type: application/json
Content-Length: 0
Connection: keep-alive
Access-Control-Expose-Headers: Location
```

### Identify

Validates thing's key and returns it's ID if key is valid

> Must-have: `thing_secret`

```bash
curl -s -S -i -X POST -H "Content-Type: application/json" -H "Authorization: Thing <thing_secret>" http://localhost/identify
```

For example:

```bash
curl -s -S -i -X POST -H "Content-Type: application/json" -H "Authorization: Thing 6d11a91f-0bd8-41aa-8e1b-4c6338329c9c" http://localhost/identify

HTTP/1.1 200 OK
Server: nginx/1.23.3
Date: Thu, 15 Jun 2023 09:28:16 GMT
Content-Type: application/json
Content-Length: 46
Connection: keep-alive
Access-Control-Expose-Headers: Location

{ "id": "f3047c10-f2c7-4d53-b3c0-bc56c560c546" }
```

## Messages

### Send Messages

Sends message via HTTP protocol

> Must-have: `thing_secret` and `channel_id`

```bash
curl -s -S -i -X POST -H "Content-Type: application/senml+json" -H "Authorization: Thing <thing_secret>" http://localhost/http/channels/<channel_id>/messages -d '[{"bn":"some-base-name:","bt":1.276020076001e+09,"bu":"A","bver":5,"n":"voltage","u":"V","v":120.1}, {"n":"current","t":-5,"v":1.2}, {"n":"current","t":-4,"v":1.3}]'
```

For example:

```bash
curl -s -S -i -X POST -H "Content-Type: application/senml+json" -H "Authorization: Thing a83b9afb-9022-4f9e-ba3d-4354a08c273a" http://localhost/http/channels/aecf0902-816d-4e38-a5b3-a1ad9a7cf9e8/messages -d '[{"bn":"some-base-name:","bt":1.276020076001e+09,"bu":"A","bver":5,"n":"voltage","u":"V","v":120.1}, {"n":"current","t":-5,"v":1.2}, {"n":"current","t":-4,"v":1.3}]'

HTTP/1.1 202 Accepted
Server: nginx/1.23.3
Date: Thu, 15 Jun 2023 09:40:44 GMT
Content-Length: 0
Connection: keep-alive
```

### Read Messages

Reads messages from database for a given channel

> Must-have: `thing_secret` and `channel_id`

```bash
curl -s -S -i -H "Authorization: Thing <thing_secret>" http://localhost:<service_port>/channels/<channel_id>/messages?offset=0&limit=5
```

For example:

```bash
curl -s -S -i -H "Authorization: Thing a83b9afb-9022-4f9e-ba3d-4354a08c273a" http://localhost:9009/channels/aecf0902-816d-4e38-a5b3-a1ad9a7cf9e8/messages

HTTP/1.1 200 OK
Content-Type: application/json
Date: Wed, 05 Apr 2023 16:01:49 GMT
Content-Length: 660

{
    "offset": 0,
    "limit": 10,
    "format": "messages",
    "total": 3,
    "messages": [{
            "channel": "aecf0902-816d-4e38-a5b3-a1ad9a7cf9e8",
            "publisher": "2766ae94-9a08-4418-82ce-3b91cf2ccd3e",
            "protocol": "http",
            "name": "some-base-name:voltage",
            "unit": "V",
            "time": 1276020076.001,
            "value": 120.1
        },
        {
            "channel": "aecf0902-816d-4e38-a5b3-a1ad9a7cf9e8",
            "publisher": "2766ae94-9a08-4418-82ce-3b91cf2ccd3e",
            "protocol": "http",
            "name": "some-base-name:current",
            "unit": "A",
            "time": 1276020072.001,
            "value": 1.3
        },
        {
            "channel": "aecf0902-816d-4e38-a5b3-a1ad9a7cf9e8",
            "publisher": "2766ae94-9a08-4418-82ce-3b91cf2ccd3e",
            "protocol": "http",
            "name": "some-base-name:current",
            "unit": "A",
            "time": 1276020071.001,
            "value": 1.2
        }
    ]
}
```

## Groups

### Create group

To create a group, you need the group name and a `user_token`

> Must-have: `user_token`, `name`
>
> Nice-to-have: `parent_id`, `metadata`, `owner_id`, `description` and `status`

```bash
curl -s -S -i -X POST -H "Content-Type: application/json" -H "Authorization: Bearer <user_token>" http://localhost/groups -d '{"name": "<group_name>", "description": "<group_description>"}'
```

For example:

```bash
curl -s -S -i -X POST -H "Content-Type: application/json" -H "Authorization: Bearer $USER_TOKEN" http://localhost/groups -d '{"name": "testgroup", "description": "test group description"}'

HTTP/1.1 201 Created
Server: nginx/1.23.3
Date: Thu, 15 Jun 2023 09:41:42 GMT
Content-Type: application/json
Content-Length: 252
Connection: keep-alive
Location: /groups/2766ae94-9a08-4418-82ce-3b91cf2ccd3e
Access-Control-Expose-Headers: Location

{
  "id": "2766ae94-9a08-4418-82ce-3b91cf2ccd3e",
  "owner_id": "94939159-d129-4f17-9e4e-cc2d615539d7",
  "name": "testgroup",
  "description": "test group description",
  "created_at": "2023-06-15T09:41:42.860481Z",
  "updated_at": "0001-01-01T00:00:00Z",
  "status": "enabled"
}
```

When you use `parent_id` make sure the parent is an already exisiting group

```bash
curl -s -S -i -X POST -H "Content-Type: application/json" -H "Authorization: Bearer <user_token>" http://localhost/groups -d '{"name": "<group_name>", "description": "<group_description>", "parent_id": "<parent_id>"}'
```

For example:

```bash
curl -s -S -i -X POST -H "Content-Type: application/json" -H "Authorization: Bearer $USER_TOKEN" http://localhost/groups -d '{"name": "testgroup2", "description": "test group 2 description", "parent_id": "2766ae94-9a08-4418-82ce-3b91cf2ccd3e"}'

HTTP/1.1 201 Created
Server: nginx/1.23.3
Date: Thu, 15 Jun 2023 09:42:34 GMT
Content-Type: application/json
Content-Length: 306
Connection: keep-alive
Location: /groups/dd2dc8d4-f7cf-42f9-832b-81cae9a8e90a
Access-Control-Expose-Headers: Location

{
  "id": "dd2dc8d4-f7cf-42f9-832b-81cae9a8e90a",
  "owner_id": "94939159-d129-4f17-9e4e-cc2d615539d7",
  "parent_id": "2766ae94-9a08-4418-82ce-3b91cf2ccd3e",
  "name": "testgroup2",
  "description": "test group 2 description",
  "created_at": "2023-06-15T09:42:34.063997Z",
  "updated_at": "0001-01-01T00:00:00Z",
  "status": "enabled"
}
```

### Get group

Get a group entity for a logged in user

> Must-have: `user_token` and `group_id`

```bash
curl -s -S -i -X GET -H "Content-Type: application/json" -H "Authorization: Bearer <user_token>" http://localhost/groups/<group_id>
```

For example:

```bash
curl -s -S -i -X GET -H "Content-Type: application/json" -H "Authorization: Bearer $USER_TOKEN" http://localhost/groups/2766ae94-9a08-4418-82ce-3b91cf2ccd3e

HTTP/1.1 200 OK
Server: nginx/1.23.3
Date: Thu, 15 Jun 2023 10:00:52 GMT
Content-Type: application/json
Content-Length: 252
Connection: keep-alive
Access-Control-Expose-Headers: Location

{
  "id": "2766ae94-9a08-4418-82ce-3b91cf2ccd3e",
  "owner_id": "94939159-d129-4f17-9e4e-cc2d615539d7",
  "name": "testgroup",
  "description": "test group description",
  "created_at": "2023-06-15T09:41:42.860481Z",
  "updated_at": "0001-01-01T00:00:00Z",
  "status": "enabled"
}
```

### Get groups

You can get all groups for a logged in user.

If you want to paginate your results then use this `offset`, `limit`, `metadata`, `name`, `status`, `parentID`, `ownerID`, `tree` and `dir` query parameters.

> Must-have: `user_token`

```bash
curl -s -S -i -X GET -H "Content-Type: application/json" -H "Authorization: Bearer <user_token>" http://localhost/groups
```

For example:

```bash
curl -s -S -i -X GET -H "Content-Type: application/json" -H "Authorization: Bearer $USER_TOKEN" http://localhost/groups

HTTP/1.1 200 OK
Server: nginx/1.23.3
Date: Thu, 15 Jun 2023 10:13:50 GMT
Content-Type: application/json
Content-Length: 807
Connection: keep-alive
Access-Control-Expose-Headers: Location

{
  "limit": 0,
  "offset": 0,
  "total": 3,
  "groups": [
    {
      "id": "0a4a2c33-2d0e-43df-b51c-d905aba99e17",
      "owner_id": "94939159-d129-4f17-9e4e-cc2d615539d7",
      "name": "a",
      "created_at": "2023-06-14T13:33:52.249784Z",
      "updated_at": "0001-01-01T00:00:00Z",
      "status": "enabled"
    },
    {
      "id": "2766ae94-9a08-4418-82ce-3b91cf2ccd3e",
      "owner_id": "94939159-d129-4f17-9e4e-cc2d615539d7",
      "name": "testgroup",
      "description": "test group description",
      "created_at": "2023-06-15T09:41:42.860481Z",
      "updated_at": "0001-01-01T00:00:00Z",
      "status": "enabled"
    },
    {
      "id": "dd2dc8d4-f7cf-42f9-832b-81cae9a8e90a",
      "owner_id": "94939159-d129-4f17-9e4e-cc2d615539d7",
      "parent_id": "2766ae94-9a08-4418-82ce-3b91cf2ccd3e",
      "name": "testgroup2",
      "description": "test group 2 description",
      "created_at": "2023-06-15T09:42:34.063997Z",
      "updated_at": "0001-01-01T00:00:00Z",
      "status": "enabled"
    }
  ]
}
```

### Get Group Parents

You can get all groups that are parents of a group for a logged in user.

If you want to paginate your results then use this `offset`, `limit`, `metadata`, `name`, `status`, `parentID`, `ownerID`, `tree` and `dir` query parameters.

> Must-have: `user_token` and `group_id`

```bash
curl -s -S -i -X GET -H "Content-Type: application/json" -H "Authorization: Bearer <user_token>" http://localhost/groups/<group_id>/parents
```

For example:

```bash
curl -s -S -i -X GET -H "Content-Type: application/json" -H "Authorization: Bearer $USER_TOKEN" http://localhost/groups/dd2dc8d4-f7cf-42f9-832b-81cae9a8e90a/parents?tree=true

HTTP/1.1 200 OK
Server: nginx/1.23.3
Date: Thu, 15 Jun 2023 10:16:03 GMT
Content-Type: application/json
Content-Length: 627
Connection: keep-alive
Access-Control-Expose-Headers: Location

{
  "limit": 10,
  "offset": 0,
  "total": 3,
  "groups": [
    {
      "id": "2766ae94-9a08-4418-82ce-3b91cf2ccd3e",
      "owner_id": "94939159-d129-4f17-9e4e-cc2d615539d7",
      "name": "testgroup",
      "description": "test group description",
      "level": -1,
      "children": [
        {
          "id": "dd2dc8d4-f7cf-42f9-832b-81cae9a8e90a",
          "owner_id": "94939159-d129-4f17-9e4e-cc2d615539d7",
          "parent_id": "2766ae94-9a08-4418-82ce-3b91cf2ccd3e",
          "name": "testgroup2",
          "description": "test group 2 description",
          "created_at": "2023-06-15T09:42:34.063997Z",
          "updated_at": "0001-01-01T00:00:00Z",
          "status": "enabled"
        }
      ],
      "created_at": "2023-06-15T09:41:42.860481Z",
      "updated_at": "0001-01-01T00:00:00Z",
      "status": "enabled"
    }
  ]
}
```

### Get Group Children

You can get all groups that are children of a group for a logged in user.

If you want to paginate your results then use this `offset`, `limit`, `metadata`, `name`, `status`, `parentID`, `ownerID`, `tree` and `dir` query parameters.

> Must-have: `user_token`

```bash
curl -s -S -i -X GET -H "Content-Type: application/json" -H "Authorization: Bearer <user_token>" http://localhost/groups/<group_id>/children
```

For example:

```bash
curl -s -S -i -X GET -H "Content-Type: application/json" -H "Authorization: Bearer $USER_TOKEN" http://localhost/groups/2766ae94-9a08-4418-82ce-3b91cf2ccd3e/children?tree=true

HTTP/1.1 200 OK
Server: nginx/1.23.3
Date: Thu, 15 Jun 2023 10:17:13 GMT
Content-Type: application/json
Content-Length: 755
Connection: keep-alive
Access-Control-Expose-Headers: Location

{
  "limit": 10,
  "offset": 0,
  "total": 3,
  "groups": [
    {
      "id": "2766ae94-9a08-4418-82ce-3b91cf2ccd3e",
      "owner_id": "94939159-d129-4f17-9e4e-cc2d615539d7",
      "name": "testgroup",
      "description": "test group description",
      "path": "2766ae94-9a08-4418-82ce-3b91cf2ccd3e",
      "children": [
        {
          "id": "dd2dc8d4-f7cf-42f9-832b-81cae9a8e90a",
          "owner_id": "94939159-d129-4f17-9e4e-cc2d615539d7",
          "parent_id": "2766ae94-9a08-4418-82ce-3b91cf2ccd3e",
          "name": "testgroup2",
          "description": "test group 2 description",
          "level": 1,
          "path": "2766ae94-9a08-4418-82ce-3b91cf2ccd3e.dd2dc8d4-f7cf-42f9-832b-81cae9a8e90a",
          "created_at": "2023-06-15T09:42:34.063997Z",
          "updated_at": "0001-01-01T00:00:00Z",
          "status": "enabled"
        }
      ],
      "created_at": "2023-06-15T09:41:42.860481Z",
      "updated_at": "0001-01-01T00:00:00Z",
      "status": "enabled"
    }
  ]
}
```

### Update group

Update group entity

> Must-have: `user_token` and `group_id`

```bash
curl -s -S -i -X PUT -H "Content-Type: application/json" -H  "Authorization: Bearer <user_token>" http://localhost/groups/<group_id> -d '{"name": "<group_name>"}'
```

For example:

```bash
curl -s -S -i -X PUT -H "Content-Type: application/json" -H "Authorization: Bearer $USER_TOKEN" http://localhost/groups/2766ae94-9a08-4418-82ce-3b91cf2ccd3e -d '{"name": "new name", "description": "new description", "metadata": {"foo":"bar"}}'

HTTP/1.1 200 OK
Server: nginx/1.23.3
Date: Thu, 15 Jun 2023 10:17:56 GMT
Content-Type: application/json
Content-Length: 328
Connection: keep-alive
Access-Control-Expose-Headers: Location

{
  "id": "2766ae94-9a08-4418-82ce-3b91cf2ccd3e",
  "owner_id": "94939159-d129-4f17-9e4e-cc2d615539d7",
  "name": "new name",
  "description": "new description",
  "metadata": { "foo": "bar" },
  "created_at": "2023-06-15T09:41:42.860481Z",
  "updated_at": "2023-06-15T10:17:56.475241Z",
  "updated_by": "94939159-d129-4f17-9e4e-cc2d615539d7",
  "status": "enabled"
}
```

### Disable group

Disable a group entity

> Must-have: `user_token` and `group_id`

```bash
curl -s -S -i -X POST -H "Content-Type: application/json" -H "Authorization: Bearer <user_token>" http://localhost/groups/<group_id>/disable
```

For example:

```bash
curl -s -S -i -X POST -H "Content-Type: application/json" -H "Authorization: Bearer $USER_TOKEN" http://localhost/groups/2766ae94-9a08-4418-82ce-3b91cf2ccd3e/disable

HTTP/1.1 200 OK
Server: nginx/1.23.3
Date: Thu, 15 Jun 2023 10:18:28 GMT
Content-Type: application/json
Content-Length: 329
Connection: keep-alive
Access-Control-Expose-Headers: Location

{
  "id": "2766ae94-9a08-4418-82ce-3b91cf2ccd3e",
  "owner_id": "94939159-d129-4f17-9e4e-cc2d615539d7",
  "name": "new name",
  "description": "new description",
  "metadata": { "foo": "bar" },
  "created_at": "2023-06-15T09:41:42.860481Z",
  "updated_at": "2023-06-15T10:17:56.475241Z",
  "updated_by": "94939159-d129-4f17-9e4e-cc2d615539d7",
  "status": "disabled"
}
```

### Enable group

Enable a group entity

> Must-have: `user_token` and `group_id`

```bash
curl -s -S -i -X POST -H "Content-Type: application/json" -H "Authorization: Bearer <user_token>" http://localhost/groups/<group_id>/enable
```

For example:

```bash
curl -s -S -i -X POST -H "Content-Type: application/json" -H "Authorization: Bearer $USER_TOKEN" http://localhost/groups/2766ae94-9a08-4418-82ce-3b91cf2ccd3e/enable

HTTP/1.1 200 OK
Server: nginx/1.23.3
Date: Thu, 15 Jun 2023 10:18:55 GMT
Content-Type: application/json
Content-Length: 328
Connection: keep-alive
Access-Control-Expose-Headers: Location

{
  "id": "2766ae94-9a08-4418-82ce-3b91cf2ccd3e",
  "owner_id": "94939159-d129-4f17-9e4e-cc2d615539d7",
  "name": "new name",
  "description": "new description",
  "metadata": { "foo": "bar" },
  "created_at": "2023-06-15T09:41:42.860481Z",
  "updated_at": "2023-06-15T10:17:56.475241Z",
  "updated_by": "94939159-d129-4f17-9e4e-cc2d615539d7",
  "status": "enabled"
}
```

### Assign

Assign user to a group

> Must-have: `user_token`, `group_id`, `member_id` and `member_action`

```bash
curl -s -S -i -X POST -H "Content-Type: application/json" -H "Authorization: Bearer <user_token>" http://localhost/users/policies -d '{"subject": "<user_id>", "object": "<group_id>", "actions":["<member_action>"]}'
```

For example:

```bash
curl -s -S -i -X POST -H "Content-Type: application/json" -H "Authorization: Bearer $USER_TOKEN" http://localhost/users/policies -d '{"subject": "1890c034-7ef9-4cde-83df-d78ea1d4d281", "object": "2766ae94-9a08-4418-82ce-3b91cf2ccd3e", "actions":["g_list", "c_list"]}'

HTTP/1.1 201 Created
Server: nginx/1.23.3
Date: Thu, 15 Jun 2023 10:19:59 GMT
Content-Type: application/json
Content-Length: 0
Connection: keep-alive
Access-Control-Expose-Headers: Location
```

### Members

You can get all users assigned to a group.

If you want to paginate your results then use this `offset`, `limit`, `metadata`, `name`, `status`, `identity`, and `tag` query parameters.

> Must-have: `user_token` and `group_id`
>
> Must take into consideration the user identified by the `user_token` needs to be assigned to the same group with `g_list` action or be the owner of the group.

```bash
curl -s -S -i -X GET -H "Content-Type: application/json" -H "Authorization: Bearer <user_token>" http://localhost/groups/<group_id>/members
```

For example:

```bash
curl -s -S -i -X GET -H "Content-Type: application/json" -H "Authorization: Bearer $USER_TOKEN" http://localhost/groups/2766ae94-9a08-4418-82ce-3b91cf2ccd3e/members

HTTP/1.1 200 OK
Server: nginx/1.23.3
Date: Thu, 15 Jun 2023 11:21:29 GMT
Content-Type: application/json
Content-Length: 318
Connection: keep-alive
Access-Control-Expose-Headers: Location

{
  "limit": 10,
  "total": 1,
  "members": [
    {
      "id": "1890c034-7ef9-4cde-83df-d78ea1d4d281",
      "name": "new name",
      "tags": ["foo", "bar"],
      "credentials": { "identity": "updated.john.doe@email.com", "secret": "" },
      "metadata": { "foo": "bar" },
      "created_at": "2023-06-14T13:46:47.322648Z",
      "updated_at": "2023-06-14T13:59:53.422595Z",
      "status": "enabled"
    }
  ]
}
```

### Unassign

Unassign user from group

> Must-have: `user_token`, `group_id` and `user_id`

```bash
curl -s -S -i -X DELETE -H "Content-Type: application/json" -H "Authorization: Bearer <user_token>" http://localhost/users/policies -d '{"subject": "<user_id>", "object": "<group_id>"}'
```

For example:

```bash
curl -s -S -i -X DELETE -H "Content-Type: application/json" -H "Authorization: Bearer $USER_TOKEN" http://localhost/users/policies -d '{"subject": "1890c034-7ef9-4cde-83df-d78ea1d4d281", "object": "2766ae94-9a08-4418-82ce-3b91cf2ccd3e"}'

HTTP/1.1 204 No Content
Server: nginx/1.23.3
Date: Thu, 15 Jun 2023 11:25:27 GMT
Content-Type: application/json
Connection: keep-alive
Access-Control-Expose-Headers: Location
```

## Policies

### Add policies

Only actions defined on [Predefined Policies section][predefined-policies] are allowed.

> Must-have: user_token, object, subject_id and actions

```bash
curl -s -S -i -X POST -H "Content-Type: application/json" -H "Authorization: Bearer <user_token>" http://localhost/users/policies -d '{"subject": "<user_id>", "object": "<group_id>", "actions":["<actions>"]}'
```

```bash
curl -s -S -i -X POST -H "Content-Type: application/json" -H "Authorization: Bearer <user_token>" http://localhost/things/policies -d '{"subject": "<thing_id>" | "<user_id>", "object": "<channel_id>", "actions":["<actions>"]}'
```

For example:

```bash
curl -s -S -i -X POST -H "Content-Type: application/json" -H "Authorization: Bearer $USER_TOKEN" http://localhost/users/policies -d '{"subject": "1890c034-7ef9-4cde-83df-d78ea1d4d281", "object": "2766ae94-9a08-4418-82ce-3b91cf2ccd3e", "actions":["g_add", "c_list"]}'

HTTP/1.1 201 Created
Server: nginx/1.23.3
Date: Thu, 15 Jun 2023 11:26:50 GMT
Content-Type: application/json
Content-Length: 0
Connection: keep-alive
Access-Control-Expose-Headers: Location
```

### Update policies

Only actions defined on [Predefined Policies section][predefined-policies] are allowed.

> Must-have: user_token, subject, object and actions

```bash
curl -s -S -i -X PUT -H "Content-Type: application/json" -H "Authorization: Bearer <user_token>" http://localhost/users/policies -d '{"subject": "<user_id>", "object": "<group_id>", "actions":["<actions>"]}'
```

```bash
curl -s -S -i -X PUT -H "Content-Type: application/json" -H "Authorization: Bearer <user_token>" http://localhost/things/policies -d '{"subject": "<thing_id>" | "<user_id>", "object": "<channel_id>", "actions":["<actions>"]}'
```

For example:

```bash
curl -s -S -i -X PUT -H "Content-Type: application/json" -H "Authorization: Bearer $USER_TOKEN" http://localhost/users/policies -d '{"subject": "1890c034-7ef9-4cde-83df-d78ea1d4d281", "object": "2766ae94-9a08-4418-82ce-3b91cf2ccd3e", "actions":["g_list", "c_list"]}'

HTTP/1.1 204 No Content
Server: nginx/1.23.3
Date: Thu, 15 Jun 2023 11:27:19 GMT
Content-Type: application/json
Connection: keep-alive
Access-Control-Expose-Headers: Location
```

### Delete policies

Only policies defined on [Predefined Policies section][predefined-policies] are allowed.

> Must-have: `user_token`, `group_id` and `member_id`

```bash
curl -s -S -i -X DELETE -H "Content-Type: application/json" -H "Authorization: Bearer <user_token>" http://localhost/things/policies -d '{"subject": "<user_id>", "object": "<group_id>"}'
```

```bash
curl -s -S -i -X DELETE -H "Content-Type: application/json" -H "Authorization: Bearer <user_token>" http://localhost/things/policies -d '{"subject": "<thing_id>" | "<user_id>", "object": "<channel_id>", "actions":["<actions>"]}'
```

For example:

```bash
curl -s -S -i -X DELETE -H "Content-Type: application/json" -H "Authorization: Bearer $USER_TOKEN" http://localhost/things/policies -d '{"subject": "1890c034-7ef9-4cde-83df-d78ea1d4d281", "object": "2766ae94-9a08-4418-82ce-3b91cf2ccd3e"}'

HTTP/1.1 204 No Content
Server: nginx/1.23.3
Date: Thu, 15 Jun 2023 11:28:31 GMT
Content-Type: application/json
Connection: keep-alive
Access-Control-Expose-Headers: Location
```

[api]: https://api.mainflux.io
[predefined-policies]: /authorization/#summary-of-defined-policies
