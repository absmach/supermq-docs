# API

## Reference

API reference in the Swagger UI can be found at:

[https://api.mainflux.io](https://api.mainflux.io)

## Users

### Create User

To start working with the Mainflux system, you need to create a user account.

> Must-have: e-mail (this must be unique as it identifies the user) and password (password must contain at least 8 characters) and status
> Optional: name, tags, metadata, status and role

```bash
curl -s -S -i -X POST -H "Content-Type: application/json" http://localhost/users -d '{"credentials": {"identity": "<user_email>", "secret": "<user_password>"}}'
```

For example:

```bash
curl -s -S -i -X POST -H "Content-Type: application/json" http://localhost/users -d '{"credentials": {"identity": "john.doe@email.com", "secret": "12345678"}, "name": "John Doe", "status": "enabled"}'
```

Response:

```bash
HTTP/1.1 201 Created
Server: nginx/1.23.3
Date: Wed, 05 Apr 2023 09:36:36 GMT
Content-Type: application/json
Content-Length: 227
Connection: keep-alive
Location: /users/f7c55a1f-dde8-4880-9796-b3a0cd05745b
Strict-Transport-Security: max-age=63072000; includeSubdomains
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: *
Access-Control-Allow-Headers: *

{
    "id": "f7c55a1f-dde8-4880-9796-b3a0cd05745b",
    "name": "John Doe",
    "credentials": { "identity": "john.doe@email.com", "secret": "" },
    "created_at": "2023-04-05T09:36:36.40605Z",
    "updated_at": "2023-04-05T09:36:36.40605Z",
    "status": "enabled"
}
```

You can also use <user_token> so that the new user has an owner for example:

```bash
curl -s -S -i -X POST -H "Content-Type: application/json" -H "Authorization: Bearer $USER_TOKEN" http://localhost/users -d '{"credentials": {"identity": "john.doe2@email.com", "secret": "12345678"}}'
```

Response:

```bash
HTTP/1.1 201 Created
Server: nginx/1.23.3
Date: Wed, 05 Apr 2023 09:51:30 GMT
Content-Type: application/json
Content-Length: 259
Connection: keep-alive
Location: /users/838dc3bb-fac9-4b39-ba4c-97a051c7c10d
Strict-Transport-Security: max-age=63072000; includeSubdomains
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: *
Access-Control-Allow-Headers: *

{
    "id": "838dc3bb-fac9-4b39-ba4c-97a051c7c10d",
    "owner": "f7c55a1f-dde8-4880-9796-b3a0cd05745b",
    "credentials": { "identity": "john.doe2@email.com", "secret": "" },
    "created_at": "2023-04-05T09:51:30.404336Z",
    "updated_at": "2023-04-05T09:51:30.404336Z",
    "status": "enabled"
}
```

### Create Token

To log in to the Mainflux system, you need to create a `user_token`.

> Must-have: registered e-mail and password

```bash
curl -s -S -i -X POST -H "Content-Type: application/json" http://localhost/users/tokens/issue -d '{"identity":"<user_email>",
"secret":"<user_password>"}'
```

For example:

```bash
curl -s -S -i -X POST -H "Content-Type: application/json" http://localhost/users/tokens/issue -d '{"identity": "john.doe@email.com", "secret": "12345678"}'
```

Response:

```bash
HTTP/1.1 201 Created
Server: nginx/1.23.3
Date: Wed, 05 Apr 2023 09:43:04 GMT
Content-Type: application/json
Content-Length: 709
Connection: keep-alive
Strict-Transport-Security: max-age=63072000; includeSubdomains
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: *
Access-Control-Allow-Headers: *

{
    "access_token": "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2ODA2ODg2ODQsImlhdCI6MTY4MDY4Nzc4NCwiaWRlbnRpdHkiOiJqb2huLmRvZUBlbWFpbC5jb20iLCJpc3MiOiJjbGllbnRzLmF1dGgiLCJzdWIiOiJmN2M1NWExZi1kZGU4LTQ4ODAtOTc5Ni1iM2EwY2QwNTc0NWIiLCJ0eXBlIjoiYWNjZXNzIn0.IkRNbWm609z3FffXdDn8C0FdfsEtId0woKjRsVu0ZxFXSAWZhczbFpGzWIzj43Pw0NnPaR0qEl-Kckx6vXRreg",
    "refresh_token": "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2ODA3NzQxODQsImlhdCI6MTY4MDY4Nzc4NCwiaWRlbnRpdHkiOiJqb2huLmRvZUBlbWFpbC5jb20iLCJpc3MiOiJjbGllbnRzLmF1dGgiLCJzdWIiOiJmN2M1NWExZi1kZGU4LTQ4ODAtOTc5Ni1iM2EwY2QwNTc0NWIiLCJ0eXBlIjoicmVmcmVzaCJ9.xRpa1F76PWkHsiD8pzAtzrwDNyKKGkL1j6Vwczhr0uKgbAd1pOwYNUQhh6XVYtzFM9S5MYxRpQYfYOkcubW1UQ",
    "access_type": "Bearer"
}
```

### Refresh Token

To issue another access_token after getting expired, you need to use a `refresh_token`.

> Must-have: refresh_token

```bash
curl -s -S -i -X POST -H "Content-Type: application/json" -H "Authorization: Bearer <refresh_token>" http://localhost/users/tokens/refresh
```

For example:

```bash
curl -s -S -i -X POST -H "Content-Type: application/json" -H "Authorization: Bearer $REFRESH_TOKEN" http://localhost/users/tokens/refresh
```

Response:

```bash
HTTP/1.1 201 Created
Server: nginx/1.23.3
Date: Wed, 05 Apr 2023 10:44:15 GMT
Content-Type: application/json
Content-Length: 709
Connection: keep-alive
Strict-Transport-Security: max-age=63072000; includeSubdomains
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: *
Access-Control-Allow-Headers: *

{
    "access_token": "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2ODA2OTIzNTUsImlhdCI6MTY4MDY5MTQ1NSwiaWRlbnRpdHkiOiJqb2huLmRvZUBlbWFpbC5jb20iLCJpc3MiOiJjbGllbnRzLmF1dGgiLCJzdWIiOiJmN2M1NWExZi1kZGU4LTQ4ODAtOTc5Ni1iM2EwY2QwNTc0NWIiLCJ0eXBlIjoiYWNjZXNzIn0.1-YxZd-UhSAyvAN0OkGVZJLl7e2ahDr3AnsSWe_Yhz3w1Ua3Cl1p62NOelZAwm-0qgpZgT-GwI6KG-J7jq_UGQ",
    "refresh_token": "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2ODA3Nzc4NTUsImlhdCI6MTY4MDY5MTQ1NSwiaWRlbnRpdHkiOiJqb2huLmRvZUBlbWFpbC5jb20iLCJpc3MiOiJjbGllbnRzLmF1dGgiLCJzdWIiOiJmN2M1NWExZi1kZGU4LTQ4ODAtOTc5Ni1iM2EwY2QwNTc0NWIiLCJ0eXBlIjoicmVmcmVzaCJ9.GcTF_g31GYpMDqUHOXbyOiG3WnfMCssKmLvM2ZjsSajBHdcdZ_JKn85vOUCKfF-thcFaWL5VXCTSHN11bKdObw",
    "access_type": "Bearer"
}
```

### Get User

You can always check the user entity that is logged in by entering the user ID and `user_token`.

> Must-have: `user_id` and `user_token`

```bash
curl -s -S -i -X GET -H "Authorization: Bearer <user_token>" http://localhost/users/<user_id>
```

For example:

```bash
curl -s -S -i -X GET -H "Authorization: Bearer $USER_TOKEN" http://localhost/users/838dc3bb-fac9-4b39-ba4c-97a051c7c10d
```

Response:

```bash
HTTP/1.1 200 OK
Server: nginx/1.23.3
Date: Wed, 05 Apr 2023 09:52:28 GMT
Content-Type: application/json
Content-Length: 319
Connection: keep-alive
Strict-Transport-Security: max-age=63072000; includeSubdomains
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: *
Access-Control-Allow-Headers: *

{
    "id": "838dc3bb-fac9-4b39-ba4c-97a051c7c10d",
    "owner": "f7c55a1f-dde8-4880-9796-b3a0cd05745b",
    "credentials": {
        "identity": "john.doe2@email.com",
        "secret": "$2a$10$qj7lrJrY8by3r8pRdsTcROlvi3n0rBj5iBTw1aj9FXHUmFqMsntxm"
    },
    "created_at": "2023-04-05T09:51:30.404336Z",
    "updated_at": "2023-04-05T09:51:30.404336Z",
    "status": "enabled"
}
```

### Get Users

You can get all users in the database by querying this endpoint. List all users request accepts limit, offset, email and metadata query parameters.

> Must-have: `user_token`

```bash
curl -s -S -i -X GET -H "Authorization: Bearer <user_token>" http://localhost/users
```

For example:

```bash
curl -s -S -i -X GET -H "Authorization: Bearer $USER_TOKEN" http://localhost/users
```

Response:

```bash
HTTP/1.1 200 OK
Server: nginx/1.23.3
Date: Wed, 05 Apr 2023 09:53:19 GMT
Content-Type: application/json
Content-Length: 285
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
    "users": [{
        "id": "838dc3bb-fac9-4b39-ba4c-97a051c7c10d",
        "owner": "f7c55a1f-dde8-4880-9796-b3a0cd05745b",
        "credentials": { "identity": "john.doe2@email.com", "secret": "" },
        "created_at": "2023-04-05T09:51:30.404336Z",
        "updated_at": "0001-01-01T00:00:00Z",
        "status": "enabled"
    }]
}
```

If you want to paginate your results then use this

> Must have: `user_token`
> Additional parameters: `offset`, `limit`, `metadata`, `name`, `identity`, `tag`, `status` and `visbility`

```bash
curl -s -S -i -X GET -H "Authorization: Bearer <user_token>" http://localhost/users?offset=<offset>&limit=<limit>&identity=<identity>
```

For example:

```bash
curl -s -S -i -X GET -H "Authorization: Bearer $USER_TOKEN" http://localhost/users?offset=0&limit=5&identity=john.doe2@email.com
```

Response:

```bash
HTTP/1.1 200 OK
Server: nginx/1.23.3
Date: Wed, 05 Apr 2023 09:57:11 GMT
Content-Type: application/json
Content-Length: 284
Connection: keep-alive
Strict-Transport-Security: max-age=63072000; includeSubdomains
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: *
Access-Control-Allow-Headers: *

{
    "limit": 5,
    "total": 1,
    "users": [{
        "id": "838dc3bb-fac9-4b39-ba4c-97a051c7c10d",
        "owner": "f7c55a1f-dde8-4880-9796-b3a0cd05745b",
        "credentials": { "identity": "john.doe2@email.com", "secret": "" },
        "created_at": "2023-04-05T09:51:30.404336Z",
        "updated_at": "0001-01-01T00:00:00Z",
        "status": "enabled"
    }]
}
```

### Update User

Updating user's name and metadata

> Must-have: `user_token` and `user_id`

```bash
curl -s -S -i -X PATCH -H "Content-Type: application/json" -H "Authorization: Bearer <user_token>" http://localhost/users/<user_id> -d
'{"metadata":{"foo":"bar"}}'
```

For example:

```bash
curl -s -S -i -X PATCH -H "Content-Type: application/json" -H "Authorization: Bearer $USER_TOKEN" http://localhost/users/838dc3bb-fac9-4b39-ba4c-97a051c7c10d -d '{"name": "new name", "metadata":{"foo":"bar"}}'
```

Response:

```bash
HTTP/1.1 200 OK
Server: nginx/1.23.3
Date: Wed, 05 Apr 2023 10:03:36 GMT
Content-Type: application/json
Content-Length: 302
Connection: keep-alive
Strict-Transport-Security: max-age=63072000; includeSubdomains
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: *
Access-Control-Allow-Headers: *

{
    "id": "838dc3bb-fac9-4b39-ba4c-97a051c7c10d",
    "name": "new name",
    "owner": "f7c55a1f-dde8-4880-9796-b3a0cd05745b",
    "credentials": { "identity": "john.doe2@email.com", "secret": "" },
    "metadata": { "foo": "bar" },
    "created_at": "2023-04-05T09:51:30.404336Z",
    "updated_at": "2023-04-05T10:03:35.996404Z",
    "status": "enabled"
}
```

### Update User Tags

Updating user's tags

> Must-have: `user_token` and `user_id`

```bash
curl -s -S -i -X PATCH -H "Content-Type: application/json" -H "Authorization: Bearer <user_token>" http://localhost/users/<user_id>/tags -d
'{"tags":["<tag_1>", ..., "tag_N"]}'
```

For example:

```bash
curl -s -S -i -X PATCH -H "Content-Type: application/json" -H "Authorization: Bearer $USER_TOKEN" http://localhost/users/838dc3bb-fac9-4b39-ba4c-97a051c7c10d/tags -d '{"tags":["foo","bar"]}'
```

Response:

```bash
HTTP/1.1 200 OK
Server: nginx/1.23.3
Date: Wed, 05 Apr 2023 10:10:24 GMT
Content-Type: application/json
Content-Length: 323
Connection: keep-alive
Strict-Transport-Security: max-age=63072000; includeSubdomains
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: *
Access-Control-Allow-Headers: *

{
    "id": "838dc3bb-fac9-4b39-ba4c-97a051c7c10d",
    "name": "new name",
    "tags": ["foo", "bar"],
    "owner": "f7c55a1f-dde8-4880-9796-b3a0cd05745b",
    "credentials": { "identity": "john.doe2@email.com", "secret": "" },
    "metadata": { "foo": "bar" },
    "created_at": "2023-04-05T09:51:30.404336Z",
    "updated_at": "2023-04-05T10:10:24.172941Z",
    "status": "enabled"
}
```

### Update User Owner

Updating user's owner

> Must-have: `user_token` and `user_id`

```bash
curl -s -S -i -X PATCH -H "Content-Type: application/json" -H "Authorization: Bearer <user_token>" http://localhost/users/<user_id>/owner -d
'{"owner":<owner_id>}'
```

For example:

```bash
curl -s -S -i -X PATCH -H "Content-Type: application/json" -H "Authorization: Bearer $USER_TOKEN" http://localhost/users/838dc3bb-fac9-4b39-ba4c-97a051c7c10d/owner -d '{"owner": "b8b2d3c6-7365-4670-af5c-d6fe0ae2c1d3"}'
```

Response:

```bash
HTTP/1.1 200 OK
Server: nginx/1.23.3
Date: Wed, 05 Apr 2023 10:12:31 GMT
Content-Type: application/json
Content-Length: 323
Connection: keep-alive
Strict-Transport-Security: max-age=63072000; includeSubdomains
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: *
Access-Control-Allow-Headers: *

{
    "id": "838dc3bb-fac9-4b39-ba4c-97a051c7c10d",
    "name": "new name",
    "tags": ["foo", "bar"],
    "owner": "b8b2d3c6-7365-4670-af5c-d6fe0ae2c1d3",
    "credentials": { "identity": "john.doe2@email.com", "secret": "" },
    "metadata": { "foo": "bar" },
    "created_at": "2023-04-05T09:51:30.404336Z",
    "updated_at": "2023-04-05T10:12:31.265837Z",
    "status": "enabled"
}
```


### Update User Identity

Updating user's identity

> Must-have: `user_token` and `user_id`

```bash
curl -s -S -i -X PATCH -H "Content-Type: application/json" -H "Authorization: Bearer <user_token>" http://localhost/users/<user_id>/identity -d
'{"identity":<user_identity>}'
```

For example:

```bash
curl -s -S -i -X PATCH -H "Content-Type: application/json" -H "Authorization: Bearer $USER_TOKEN" http://localhost/users/838dc3bb-fac9-4b39-ba4c-97a051c7c10d/identity -d '{"identity": "updated.john.doe@email.com"}'
```

Response:

```bash
HTTP/1.1 200 OK
Server: nginx/1.23.3
Date: Wed, 05 Apr 2023 10:16:55 GMT
Content-Type: application/json
Content-Length: 330
Connection: keep-alive
Strict-Transport-Security: max-age=63072000; includeSubdomains
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: *
Access-Control-Allow-Headers: *

{
    "id": "838dc3bb-fac9-4b39-ba4c-97a051c7c10d",
    "name": "new name",
    "tags": ["foo", "bar"],
    "owner": "f7c55a1f-dde8-4880-9796-b3a0cd05745b",
    "credentials": { "identity": "updated.john.doe@email.com", "secret": "" },
    "metadata": { "foo": "bar" },
    "created_at": "2023-04-05T09:51:30.404336Z",
    "updated_at": "2023-04-05T10:16:55.924758Z",
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
```

Response:

```bash
HTTP/1.1 201 Created
Server: nginx/1.16.0
Date: Wed, 10 Mar 2021 15:17:36 GMT
Content-Type: application/json
Content-Length: 11
Connection: keep-alive
Strict-Transport-Security: max-age=63072000; includeSubdomains
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: *
Access-Control-Allow-Headers: *
```

### Enable User

Changing the user status to enabled can be done by calling the enable user function

> Must-have: `user_id` and `user_token`

```bash
curl -s -S -i -X GET -H "Authorization: Bearer <user_token>" http://localhost/users/<user_id>/enable
```

For example:

```bash
curl -s -S -i -X POST -H "Authorization: Bearer $USER_TOKEN" http://localhost/users/838dc3bb-fac9-4b39-ba4c-97a051c7c10d/enable
```

Response:

```bash
HTTP/1.1 200 OK
Server: nginx/1.23.3
Date: Wed, 05 Apr 2023 10:40:54 GMT
Content-Type: application/json
Content-Length: 330
Connection: keep-alive
Strict-Transport-Security: max-age=63072000; includeSubdomains
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: *
Access-Control-Allow-Headers: *

{
    "id": "838dc3bb-fac9-4b39-ba4c-97a051c7c10d",
    "name": "new name",
    "tags": ["foo", "bar"],
    "owner": "f7c55a1f-dde8-4880-9796-b3a0cd05745b",
    "credentials": { "identity": "updated.john.doe@email.com", "secret": "" },
    "metadata": { "foo": "bar" },
    "created_at": "2023-04-05T09:51:30.404336Z",
    "updated_at": "2023-04-05T10:16:55.924758Z",
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
curl -s -S -i -X POST -H "Authorization: Bearer $USER_TOKEN" http://localhost/users/838dc3bb-fac9-4b39-ba4c-97a051c7c10d/disable
```

Response:

```bash
HTTP/1.1 200 OK
Server: nginx/1.23.3
Date: Wed, 05 Apr 2023 10:40:29 GMT
Content-Type: application/json
Content-Length: 331
Connection: keep-alive
Strict-Transport-Security: max-age=63072000; includeSubdomains
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: *
Access-Control-Allow-Headers: *

{
    "id": "838dc3bb-fac9-4b39-ba4c-97a051c7c10d",
    "name": "new name",
    "tags": ["foo", "bar"],
    "owner": "f7c55a1f-dde8-4880-9796-b3a0cd05745b",
    "credentials": { "identity": "updated.john.doe@email.com", "secret": "" },
    "metadata": { "foo": "bar" },
    "created_at": "2023-04-05T09:51:30.404336Z",
    "updated_at": "2023-04-05T10:16:55.924758Z",
    "status": "disabled"
}
```

### Get User Memberships

Changing the user status to disabled can be done by calling the disable user function

> Must-have: `user_id` and `user_token`
> Must take into consideration the user identified by the `user_token` needs to be assigned to the same group with `c_list` action

```bash
curl -s -S -i -X GET -H "Authorization: Bearer <user_token>" http://localhost/users/<user_id>/memberships
```

For example:

```bash
curl -s -S -i -X GET -H "Authorization: Bearer $USER_TOKEN" http://localhost/users/838dc3bb-fac9-4b39-ba4c-97a051c7c10d/memberships
```

Response:

```bash
HTTP/1.1 200 OK
Server: nginx/1.23.3
Date: Wed, 05 Apr 2023 11:55:58 GMT
Content-Type: application/json
Content-Length: 287
Connection: keep-alive
Strict-Transport-Security: max-age=63072000; includeSubdomains
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: *
Access-Control-Allow-Headers: *

{
    "total": 1,
    "memberships": [{
        "id": "977bbd33-5b59-4b7a-a9c3-8adda5d98255",
        "owner_id": "f7c55a1f-dde8-4880-9796-b3a0cd05745b",
        "name": "testgroup",
        "description": "test group description",
        "created_at": "2023-04-05T10:56:45.672778Z",
        "updated_at": "2023-04-05T10:56:45.672778Z",
        "status": "enabled"
    }]
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
```

Response:

```bash
HTTP/1.1 201 Created
Server: nginx/1.23.3
Date: Wed, 05 Apr 2023 12:21:34 GMT
Content-Type: application/json
Content-Length: 290
Connection: keep-alive
Location: /things/ee6de1d4-aa1d-443a-9848-7857a90d03bd
Access-Control-Expose-Headers: Location

{
    "id": "ee6de1d4-aa1d-443a-9848-7857a90d03bd",
    "name": "examplething",
    "owner": "f7c55a1f-dde8-4880-9796-b3a0cd05745b",
    "credentials": { "secret": "cae79321-7494-4dc3-bd01-980c2d45cb80" },
    "created_at": "2023-04-05T12:21:34.111149443Z",
    "updated_at": "2023-04-05T12:21:34.111149443Z",
    "status": "enabled"
}
```

### Create Thing with External ID

It is often the case that the user will want to integrate the existing solutions, e.g. an asset management system, with the Mainflux platform. To simplify the integration between the systems and avoid artificial cross-platform reference, such as special fields in Mainflux Things metadata, it is possible to set Mainflux Thing ID with an existing unique ID while create the Thing. This way, the user can set the existing ID as the Thing ID of a newly created Thing to keep reference between Thing and the asset that Thing represents.
There are two limitations - the existing ID have to be in UUID V4 format and it has to be unique in the Mainflux domain.

To create a thing with an external ID, you need provide the UUID v4 format ID together with thing name, and other fields as well as a `user_token`

> Must-have: `user_token`

```bash
curl -s -S -i -X POST -H "Content-Type: application/json" -H "Authorization: Bearer <user_token>" http://localhost/things/bulk -d '[{"id": "<thing_id>","name": "<thing_name>"}]'
```

For example:

```bash
curl -s -S -i -X POST -H "Content-Type: application/json" -H "Authorization: Bearer $USER_TOKEN" http://localhost/things -d '{"id": "977bbd33-5b59-4b7a-a9c3-8adda5d98255", "name": "examplething"}'
```

Response:

```bash
HTTP/1.1 201 Created
Server: nginx/1.23.3
Date: Wed, 05 Apr 2023 12:22:39 GMT
Content-Type: application/json
Content-Length: 290
Connection: keep-alive
Location: /things/977bbd33-5b59-4b7a-a9c3-8adda5d98255
Access-Control-Expose-Headers: Location

{
    "id": "977bbd33-5b59-4b7a-a9c3-8adda5d98255",
    "name": "examplething",
    "owner": "f7c55a1f-dde8-4880-9796-b3a0cd05745b",
    "credentials": { "secret": "a83b9afb-9022-4f9e-ba3d-4354a08c273a" },
    "created_at": "2023-04-05T12:22:39.420312431Z",
    "updated_at": "2023-04-05T12:22:39.420312431Z",
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
```

Response:

```bash
HTTP/1.1 200 OK
Server: nginx/1.23.3
Date: Wed, 05 Apr 2023 12:23:44 GMT
Content-Type: application/json
Content-Length: 601
Connection: keep-alive
Access-Control-Expose-Headers: Location

{
    "total": 2,
    "things": [{
            "id": "726621ec-853d-452e-83ba-5f7fb2020c03",
            "name": "thing_name_1",
            "owner": "f7c55a1f-dde8-4880-9796-b3a0cd05745b",
            "credentials": { "secret": "b356c070-bdff-4680-b24f-9f664838362b" },
            "created_at": "2023-04-05T12:23:44.58539963Z",
            "updated_at": "2023-04-05T12:23:44.58539963Z",
            "status": "enabled"
        },
        {
            "id": "56cd5ebb-9564-491c-8495-3d34138448d1",
            "name": "thing_name_2",
            "owner": "f7c55a1f-dde8-4880-9796-b3a0cd05745b",
            "credentials": { "secret": "eb2670ba-a2be-4ea4-83cb-78adc6f98269" },
            "created_at": "2023-04-05T12:23:44.585402736Z",
            "updated_at": "2023-04-05T12:23:44.585402736Z",
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
```

Response:

```bash
HTTP/1.1 200 OK
Server: nginx/1.23.3
Date: Wed, 05 Apr 2023 12:28:51 GMT
Content-Type: application/json
Content-Length: 601
Connection: keep-alive
Access-Control-Expose-Headers: Location

{
    "total": 2,
    "things": [{
            "id": "eb2670ba-a2be-4ea4-83cb-111111111111",
            "name": "thing_name_1",
            "owner": "f7c55a1f-dde8-4880-9796-b3a0cd05745b",
            "credentials": { "secret": "3a168058-db6a-4ae0-a70a-1c8b43a3a626" },
            "created_at": "2023-04-05T12:28:51.21101426Z",
            "updated_at": "2023-04-05T12:28:51.21101426Z",
            "status": "enabled"
        },
        {
            "id": "eb2670ba-a2be-4ea4-83cb-111111111112",
            "name": "thing_name_2",
            "owner": "f7c55a1f-dde8-4880-9796-b3a0cd05745b",
            "credentials": { "secret": "5f104448-8b6b-4ade-a7b7-a9101865213c" },
            "created_at": "2023-04-05T12:28:51.211016003Z",
            "updated_at": "2023-04-05T12:28:51.211016003Z",
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
curl -s -S -i -X GET -H "Authorization: Bearer $USER_TOKEN" http://localhost/things/ee6de1d4-aa1d-443a-9848-7857a90d03bd
```

Response:

```bash
HTTP/1.1 200 OK
Server: nginx/1.23.3
Date: Wed, 05 Apr 2023 12:31:28 GMT
Content-Type: application/json
Content-Length: 284
Connection: keep-alive
Access-Control-Expose-Headers: Location

{
    "id": "ee6de1d4-aa1d-443a-9848-7857a90d03bd",
    "name": "examplething",
    "owner": "f7c55a1f-dde8-4880-9796-b3a0cd05745b",
    "credentials": { "secret": "cae79321-7494-4dc3-bd01-980c2d45cb80" },
    "created_at": "2023-04-05T12:21:34.111149Z",
    "updated_at": "2023-04-05T12:21:34.111149Z",
    "status": "enabled"
}
```

### Get Things

You can get all things in the database by querying this endpoint. List all things request accepts limit, offset, name and metadata query parameters.

> Must-have: `user_token`

```bash
curl -s -S -i -X GET -H "Authorization: Bearer <user_token>" http://localhost/things
```

For example:

```bash
curl -s -S -i -X GET -H "Authorization: Bearer $USER_TOKEN" http://localhost/things
```

Response:

```bash
HTTP/1.1 200 OK
Server: nginx/1.23.3
Date: Wed, 05 Apr 2023 12:30:33 GMT
Content-Type: application/json
Content-Length: 1696
Connection: keep-alive
Access-Control-Expose-Headers: Location

{
    "limit": 10,
    "total": 6,
    "things": [{
            "id": "ee6de1d4-aa1d-443a-9848-7857a90d03bd",
            "name": "examplething",
            "owner": "f7c55a1f-dde8-4880-9796-b3a0cd05745b",
            "credentials": { "secret": "cae79321-7494-4dc3-bd01-980c2d45cb80" },
            "created_at": "2023-04-05T12:21:34.111149Z",
            "updated_at": "0001-01-01T00:00:00Z",
            "status": "enabled"
        },
        {
            "id": "977bbd33-5b59-4b7a-a9c3-8adda5d98255",
            "name": "examplething",
            "owner": "f7c55a1f-dde8-4880-9796-b3a0cd05745b",
            "credentials": { "secret": "a83b9afb-9022-4f9e-ba3d-4354a08c273a" },
            "created_at": "2023-04-05T12:22:39.420312Z",
            "updated_at": "0001-01-01T00:00:00Z",
            "status": "enabled"
        },
        {
            "id": "726621ec-853d-452e-83ba-5f7fb2020c03",
            "name": "thing_name_1",
            "owner": "f7c55a1f-dde8-4880-9796-b3a0cd05745b",
            "credentials": { "secret": "b356c070-bdff-4680-b24f-9f664838362b" },
            "created_at": "2023-04-05T12:23:44.585399Z",
            "updated_at": "0001-01-01T00:00:00Z",
            "status": "enabled"
        },
        {
            "id": "56cd5ebb-9564-491c-8495-3d34138448d1",
            "name": "thing_name_2",
            "owner": "f7c55a1f-dde8-4880-9796-b3a0cd05745b",
            "credentials": { "secret": "eb2670ba-a2be-4ea4-83cb-78adc6f98269" },
            "created_at": "2023-04-05T12:23:44.585402Z",
            "updated_at": "0001-01-01T00:00:00Z",
            "status": "enabled"
        },
        {
            "id": "eb2670ba-a2be-4ea4-83cb-111111111111",
            "name": "thing_name_1",
            "owner": "f7c55a1f-dde8-4880-9796-b3a0cd05745b",
            "credentials": { "secret": "3a168058-db6a-4ae0-a70a-1c8b43a3a626" },
            "created_at": "2023-04-05T12:28:51.211014Z",
            "updated_at": "0001-01-01T00:00:00Z",
            "status": "enabled"
        },
        {
            "id": "eb2670ba-a2be-4ea4-83cb-111111111112",
            "name": "thing_name_2",
            "owner": "f7c55a1f-dde8-4880-9796-b3a0cd05745b",
            "credentials": { "secret": "5f104448-8b6b-4ade-a7b7-a9101865213c" },
            "created_at": "2023-04-05T12:28:51.211016Z",
            "updated_at": "0001-01-01T00:00:00Z",
            "status": "enabled"
        }
    ]
}
```

If you want to paginate your results then use this

> Must have: `user_token`
> Additional parameters: `offset`, `limit`, `metadata`, `status`, `tags` and `name`

```bash
curl -s -S -i -X GET -H "Authorization: Bearer <user_token>" http://localhost/things?offset=<offset>&limit=<limit>&name=<name>
```

For example:

```bash
curl -s -S -i -X GET -H "Authorization: Bearer $USER_TOKEN" http://localhost/things?offset=1&limit=5&name=thing_name_2
```

Response:

```bash
HTTP/1.1 200 OK
Server: nginx/1.23.3
Date: Wed, 05 Apr 2023 12:34:15 GMT
Content-Type: application/json
Content-Length: 321
Connection: keep-alive
Access-Control-Expose-Headers: Location

{
    "limit": 5,
    "offset": 1,
    "total": 2,
    "things": [{
        "id": "eb2670ba-a2be-4ea4-83cb-111111111112",
        "name": "thing_name_2",
        "owner": "f7c55a1f-dde8-4880-9796-b3a0cd05745b",
        "credentials": { "secret": "5f104448-8b6b-4ade-a7b7-a9101865213c" },
        "created_at": "2023-04-05T12:28:51.211016Z",
        "updated_at": "0001-01-01T00:00:00Z",
        "status": "enabled"
    }]
}
```

### Update Thing

Updating a thing name and metadata

> Must-have: `user_token` and `thing_id`

```bash
curl -s -S -i -X PUT -H "Content-Type: application/json" -H  "Authorization: Bearer <user_token>" http://localhost/things/<thing_id> -d '{"name": "<thing_name>"}'
```

For example:

```bash
curl -s -S -i -X PATCH -H "Content-Type: application/json" -H "Authorization: Bearer $USER_TOKEN" http://localhost/things/ee6de1d4-aa1d-443a-9848-7857a90d03bd -d '{"name": "new name"}'
```

Response:

```bash
HTTP/1.1 200 OK
Server: nginx/1.23.3
Date: Wed, 05 Apr 2023 12:36:15 GMT
Content-Type: application/json
Content-Length: 280
Connection: keep-alive
Access-Control-Expose-Headers: Location

{
    "id": "ee6de1d4-aa1d-443a-9848-7857a90d03bd",
    "name": "new name",
    "owner": "f7c55a1f-dde8-4880-9796-b3a0cd05745b",
    "credentials": { "secret": "cae79321-7494-4dc3-bd01-980c2d45cb80" },
    "created_at": "2023-04-05T12:21:34.111149Z",
    "updated_at": "2023-04-05T12:36:15.721722Z",
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
curl -s -S -i -X PATCH -H "Content-Type: application/json" -H "Authorization: Bearer $USER_TOKEN" http://localhost/things/ee6de1d4-aa1d-443a-9848-7857a90d03bd/tags -d '{"tags": ["tag"]}'
```

Response:

```bash
HTTP/1.1 200 OK
Server: nginx/1.23.3
Date: Wed, 05 Apr 2023 12:37:47 GMT
Content-Type: application/json
Content-Length: 295
Connection: keep-alive
Access-Control-Expose-Headers: Location

{
    "id": "ee6de1d4-aa1d-443a-9848-7857a90d03bd",
    "name": "new name",
    "tags": ["tag"],
    "owner": "f7c55a1f-dde8-4880-9796-b3a0cd05745b",
    "credentials": { "secret": "cae79321-7494-4dc3-bd01-980c2d45cb80" },
    "created_at": "2023-04-05T12:21:34.111149Z",
    "updated_at": "2023-04-05T12:37:47.760544Z",
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
curl -s -S -i -X PATCH -H "Content-Type: application/json" -H "Authorization: Bearer $USER_TOKEN" http://localhost/things/ee6de1d4-aa1d-443a-9848-7857a90d03bd -d '{"owner": "f7c55a1f-dde8-4880-9796-b3a0cd05745b"}'
```

Response:

```bash
HTTP/1.1 200 OK
Server: nginx/1.23.3
Date: Wed, 05 Apr 2023 15:04:32 GMT
Content-Type: application/json
Content-Length: 294
Connection: keep-alive
Access-Control-Expose-Headers: Location

{
    "id": "ee6de1d4-aa1d-443a-9848-7857a90d03bd",
    "name": "new name",
    "tags": ["tag"],
    "owner": "f7c55a1f-dde8-4880-9796-b3a0cd05745b",
    "credentials": { "secret": "cae79321-7494-4dc3-bd01-980c2d45cb80" },
    "created_at": "2023-04-05T12:21:34.111149Z",
    "updated_at": "2023-04-05T15:04:32.76775Z",
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
curl -s -S -i -X PATCH -H "Content-Type: application/json" -H "Authorization: Bearer $USER_TOKEN" http://localhost/things/ee6de1d4-aa1d-443a-9848-7857a90d03bd/secret -d '{"secret": "secret-key"}'
```

Response:

```bash
HTTP/1.1 200 OK
Server: nginx/1.23.3
Date: Wed, 05 Apr 2023 15:05:52 GMT
Content-Type: application/json
Content-Length: 269
Connection: keep-alive
Access-Control-Expose-Headers: Location

{
    "id": "ee6de1d4-aa1d-443a-9848-7857a90d03bd",
    "name": "new name",
    "tags": ["tag"],
    "owner": "f7c55a1f-dde8-4880-9796-b3a0cd05745b",
    "credentials": { "secret": "secret-key" },
    "created_at": "2023-04-05T12:21:34.111149Z",
    "updated_at": "2023-04-05T15:05:52.755776Z",
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
curl -s -S -i -X POST -H "Content-Type: application/json" -H "Authorization: Bearer $USER_TOKEN" http://localhost/things/ee6de1d4-aa1d-443a-9848-7857a90d03bd/enable
```

Response:

```bash
HTTP/1.1 200 OK
Server: nginx/1.23.3
Date: Wed, 05 Apr 2023 15:08:12 GMT
Content-Type: application/json
Content-Length: 269
Connection: keep-alive
Access-Control-Expose-Headers: Location

{
    "id": "ee6de1d4-aa1d-443a-9848-7857a90d03bd",
    "name": "new name",
    "tags": ["tag"],
    "owner": "f7c55a1f-dde8-4880-9796-b3a0cd05745b",
    "credentials": { "secret": "secret-key" },
    "created_at": "2023-04-05T12:21:34.111149Z",
    "updated_at": "2023-04-05T15:05:52.755776Z",
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
curl -s -S -i -X POST -H "Content-Type: application/json" -H "Authorization: Bearer $USER_TOKEN" http://localhost/things/ee6de1d4-aa1d-443a-9848-7857a90d03bd/disable
```

Response:

```bash
HTTP/1.1 200 OK
Server: nginx/1.23.3
Date: Wed, 05 Apr 2023 15:07:24 GMT
Content-Type: application/json
Content-Length: 270
Connection: keep-alive
Access-Control-Expose-Headers: Location

{
    "id": "ee6de1d4-aa1d-443a-9848-7857a90d03bd",
    "name": "new name",
    "tags": ["tag"],
    "owner": "f7c55a1f-dde8-4880-9796-b3a0cd05745b",
    "credentials": { "secret": "secret-key" },
    "created_at": "2023-04-05T12:21:34.111149Z",
    "updated_at": "2023-04-05T15:05:52.755776Z",
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
```

Response:

```bash
HTTP/1.1 201 Created
Server: nginx/1.23.3
Date: Wed, 05 Apr 2023 15:14:15 GMT
Content-Type: application/json
Content-Length: 225
Connection: keep-alive
Location: /channels/1365b640-11cc-4d7e-8e7e-3b86e7651045
Access-Control-Expose-Headers: Location

{
    "id": "1365b640-11cc-4d7e-8e7e-3b86e7651045",
    "owner_id": "f7c55a1f-dde8-4880-9796-b3a0cd05745b",
    "name": "examplechannel",
    "created_at": "2023-04-05T15:14:15.815801Z",
    "updated_at": "2023-04-05T15:14:15.815801Z",
    "status": "enabled"
}
```

### Create Channel with external ID

Channel is a group of things that could represent a special category in existing systems, e.g. a building level channel could represent the level of a smarting building system. For helping to keep the reference, it is possible to set an existing ID while creating the Mainflux channel. There are two limitations - the existing ID has to be in UUID V4 format and it has to be unique in the Mainflux domain.

To create a channel with external ID, the user needs provide a UUID v4 format unique ID, and a `user_token`

> Must-have: `user_token`

```bash
curl -s -S -i -X POST -H "Content-Type: application/json" -H "Authorization: Bearer <user_token>" http://localhost/channels -d '{"id": "<channel_id>","name": "<channel_name>"}'
```

For example:

```bash
curl -s -S -i -X POST -H "Content-Type: application/json" -H "Authorization: Bearer $USER_TOKEN" http://localhost/channels -d '{"id": "ee6de1d4-aa1d-443a-9848-7857a90d03bd", "name": "examplechannel2"}'
```

Response:

```bash
HTTP/1.1 201 Created
Server: nginx/1.23.3
Date: Wed, 05 Apr 2023 15:15:57 GMT
Content-Type: application/json
Content-Length: 226
Connection: keep-alive
Location: /channels/ee6de1d4-aa1d-443a-9848-7857a90d03bd
Access-Control-Expose-Headers: Location

{
    "id": "ee6de1d4-aa1d-443a-9848-7857a90d03bd",
    "owner_id": "f7c55a1f-dde8-4880-9796-b3a0cd05745b",
    "name": "examplechannel2",
    "created_at": "2023-04-05T15:15:57.911075Z",
    "updated_at": "2023-04-05T15:15:57.911075Z",
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
```

Response:

```bash
HTTP/1.1 200 OK
Server: nginx/1.23.3
Date: Wed, 05 Apr 2023 15:17:09 GMT
Content-Type: application/json
Content-Length: 465
Connection: keep-alive
Access-Control-Expose-Headers: Location

{
    "channels": [{
            "id": "830cf52a-4928-4cfb-af44-e82a696c9ac9",
            "owner_id": "f7c55a1f-dde8-4880-9796-b3a0cd05745b",
            "name": "channel_name_1",
            "created_at": "2023-04-05T15:17:09.340468Z",
            "updated_at": "2023-04-05T15:17:09.340468Z",
            "status": "enabled"
        },
        {
            "id": "a902ae6e-da9a-46a8-a555-cd2fc87c64a9",
            "owner_id": "f7c55a1f-dde8-4880-9796-b3a0cd05745b",
            "name": "channel_name_2",
            "created_at": "2023-04-05T15:17:09.344149Z",
            "updated_at": "2023-04-05T15:17:09.344149Z",
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
```

Response:

```bash
HTTP/1.1 200 OK
Server: nginx/1.23.3
Date: Wed, 05 Apr 2023 15:19:13 GMT
Content-Type: application/json
Content-Length: 467
Connection: keep-alive
Access-Control-Expose-Headers: Location

{                              
  "channels": [
    {
      "id": "977bbd33-5b59-4b7a-a9c3-111111111111",
      "owner_id": "f7c55a1f-dde8-4880-9796-b3a0cd05745b",
      "name": "channel_name_1a",
      "created_at": "2023-04-05T15:19:13.151359Z",
      "updated_at": "2023-04-05T15:19:13.151359Z",
      "status": "enabled"
    },
    {
      "id": "977bbd33-5b59-4b7a-a9c3-111111111112",
      "owner_id": "f7c55a1f-dde8-4880-9796-b3a0cd05745b",
      "name": "channel_name_2a",
      "created_at": "2023-04-05T15:19:13.154335Z",
      "updated_at": "2023-04-05T15:19:13.154335Z",
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
curl -s -S -i -X GET -H "Authorization: Bearer $USER_TOKEN" http://localhost/channels/1365b640-11cc-4d7e-8e7e-3b86e7651045
```

Response:

```bash
HTTP/1.1 200 OK
Server: nginx/1.23.3
Date: Wed, 05 Apr 2023 15:20:13 GMT
Content-Type: application/json
Content-Length: 225
Connection: keep-alive
Access-Control-Expose-Headers: Location

{
    "id": "1365b640-11cc-4d7e-8e7e-3b86e7651045",
    "owner_id": "f7c55a1f-dde8-4880-9796-b3a0cd05745b",
    "name": "examplechannel",
    "created_at": "2023-04-05T15:14:15.815801Z",
    "updated_at": "2023-04-05T15:14:15.815801Z",
    "status": "enabled"
}
```

### Get Channels

You can get all channels in the database by querying this endpoint. List all channels request accepts limit, offset, name and metadata query parameters.

> Must-have: `user_token`

```bash
curl -s -S -i -X GET -H "Authorization: Bearer <user_token>" http://localhost/channels
```

For example:

```bash
curl -s -S -i -X GET -H "Authorization: Bearer $USER_TOKEN" http://localhost/channels
```

Response:

```bash
HTTP/1.1 200 OK
Server: nginx/1.23.3
Date: Wed, 05 Apr 2023 15:20:54 GMT
Content-Type: application/json
Content-Length: 1378
Connection: keep-alive
Access-Control-Expose-Headers: Location

{
    "total": 6,
    "channels": [{
            "id": "1365b640-11cc-4d7e-8e7e-3b86e7651045",
            "owner_id": "f7c55a1f-dde8-4880-9796-b3a0cd05745b",
            "name": "examplechannel",
            "created_at": "2023-04-05T15:14:15.815801Z",
            "updated_at": "2023-04-05T15:14:15.815801Z",
            "status": "enabled"
        },
        {
            "id": "ee6de1d4-aa1d-443a-9848-7857a90d03bd",
            "owner_id": "f7c55a1f-dde8-4880-9796-b3a0cd05745b",
            "name": "examplechannel2",
            "created_at": "2023-04-05T15:15:57.911075Z",
            "updated_at": "2023-04-05T15:15:57.911075Z",
            "status": "enabled"
        },
        {
            "id": "830cf52a-4928-4cfb-af44-e82a696c9ac9",
            "owner_id": "f7c55a1f-dde8-4880-9796-b3a0cd05745b",
            "name": "channel_name_1",
            "created_at": "2023-04-05T15:17:09.340468Z",
            "updated_at": "2023-04-05T15:17:09.340468Z",
            "status": "enabled"
        },
        {
            "id": "a902ae6e-da9a-46a8-a555-cd2fc87c64a9",
            "owner_id": "f7c55a1f-dde8-4880-9796-b3a0cd05745b",
            "name": "channel_name_2",
            "created_at": "2023-04-05T15:17:09.344149Z",
            "updated_at": "2023-04-05T15:17:09.344149Z",
            "status": "enabled"
        },
        {
            "id": "977bbd33-5b59-4b7a-a9c3-111111111111",
            "owner_id": "f7c55a1f-dde8-4880-9796-b3a0cd05745b",
            "name": "channel_name_1a",
            "created_at": "2023-04-05T15:19:13.151359Z",
            "updated_at": "2023-04-05T15:19:13.151359Z",
            "status": "enabled"
        },
        {
            "id": "977bbd33-5b59-4b7a-a9c3-111111111112",
            "owner_id": "f7c55a1f-dde8-4880-9796-b3a0cd05745b",
            "name": "channel_name_2a",
            "created_at": "2023-04-05T15:19:13.154335Z",
            "updated_at": "2023-04-05T15:19:13.154335Z",
            "status": "enabled"
        }
    ]
}
```

### Update Channel

Update channel entity

> Must-have: `user_token` and `channel_id`

```bash
curl -s -S -i -X PUT -H "Content-Type: application/json" -H  "Authorization: Bearer <user_token>" http://localhost/channels/<channel_id> -d '{"name": "<channel_name>"}'
```

For example:

```bash
curl -s -S -i -X PUT -H "Content-Type: application/json" -H "Authorization: Bearer $USER_TOKEN" http://localhost/channels/1365b640-11cc-4d7e-8e7e-3b86e7651045 -d '{"name": "new name", "metadata": {"foo": "bar"}}'
```

Response:

```bash
HTTP/1.1 200 OK
Server: nginx/1.23.3
Date: Wed, 05 Apr 2023 15:22:56 GMT
Content-Type: application/json
Content-Length: 244
Connection: keep-alive
Access-Control-Expose-Headers: Location

{
    "id": "1365b640-11cc-4d7e-8e7e-3b86e7651045",
    "owner_id": "f7c55a1f-dde8-4880-9796-b3a0cd05745b",
    "name": "new name",
    "metadata": { "foo": "bar" },
    "created_at": "2023-04-05T15:14:15.815801Z",
    "updated_at": "2023-04-05T15:22:55.995476Z",
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
curl -s -S -i -X POST -H "Content-Type: application/json" -H "Authorization: Bearer $USER_TOKEN" http://localhost/channels/1365b640-11cc-4d7e-8e7e-3b86e7651045/enable
```

Response:

```bash
HTTP/1.1 200 OK
Server: nginx/1.23.3
Date: Wed, 05 Apr 2023 15:24:30 GMT
Content-Type: application/json
Content-Length: 244
Connection: keep-alive
Access-Control-Expose-Headers: Location

{
    "id": "1365b640-11cc-4d7e-8e7e-3b86e7651045",
    "owner_id": "f7c55a1f-dde8-4880-9796-b3a0cd05745b",
    "name": "new name",
    "metadata": { "foo": "bar" },
    "created_at": "2023-04-05T15:14:15.815801Z",
    "updated_at": "2023-04-05T15:22:55.995476Z",
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
curl -s -S -i -X POST -H "Content-Type: application/json" -H "Authorization: Bearer $USER_TOKEN" http://localhost/channels/1365b640-11cc-4d7e-8e7e-3b86e7651045/disable
```

Response:

```bash
HTTP/1.1 200 OK
Server: nginx/1.23.3
Date: Wed, 05 Apr 2023 15:24:04 GMT
Content-Type: application/json
Content-Length: 245
Connection: keep-alive
Access-Control-Expose-Headers: Location

{
    "id": "1365b640-11cc-4d7e-8e7e-3b86e7651045",
    "owner_id": "f7c55a1f-dde8-4880-9796-b3a0cd05745b",
    "name": "new name",
    "metadata": { "foo": "bar" },
    "created_at": "2023-04-05T15:14:15.815801Z",
    "updated_at": "2023-04-05T15:22:55.995476Z",
    "status": "disabled"
}
```

### Connect

Connect things to channels

> Must-have: `user_token`, `channel_id` and `thing_id`

```bash
curl -s -S -i -X POST -H "Content-Type: application/json" -H "Authorization: Bearer <user_token>" http://localhost/connect -d '{"group_ids": ["<channel_id>"], "client_ids": ["<thing_id>"]}'
```

For example:

```bash
curl -s -S -i -X POST -H "Content-Type: application/json" -H "Authorization: Bearer $USER_TOKEN" http://localhost/connect -d '{"group_ids": ["830cf52a-4928-4cfb-af44-e82a696c9ac9"], "client_ids": ["ee6de1d4-aa1d-443a-9848-7857a90d03bd"]}'
```

Response:

```bash
HTTP/1.1 201 Created
Server: nginx/1.23.3
Date: Wed, 05 Apr 2023 15:35:29 GMT
Content-Type: application/json
Content-Length: 231
Connection: keep-alive
Access-Control-Expose-Headers: Location

{
    "policies": [{
        "owner_id": "",
        "subject": "ee6de1d4-aa1d-443a-9848-7857a90d03bd",
        "object": "830cf52a-4928-4cfb-af44-e82a696c9ac9",
        "actions": ["m_write", "m_read"],
        "created_at": "0001-01-01T00:00:00Z",
        "updated_at": "0001-01-01T00:00:00Z"
    }]
}
```

Connect thing to channel

> Must-have: `user_token`, `channel_id` and `thing_id`

```bash
curl -s -S -i -X POST -H "Content-Type: application/json" -H "Authorization: Bearer <user_token>" http://localhost/channels/<channel_id>/things/<thing_id>
```

For example:

```bash
curl -s -S -i -X POST -H "Content-Type: application/json" -H "Authorization: Bearer $USER_TOKEN" http://localhost/channels/830cf52a-4928-4cfb-af44-e82a696c9ac9/things/977bbd33-5b59-4b7a-a9c3-8adda5d98255
```

Response:

```bash
HTTP/1.1 201 Created
Server: nginx/1.23.3
Date: Wed, 05 Apr 2023 15:37:01 GMT
Content-Type: application/json
Content-Length: 281
Connection: keep-alive
Access-Control-Expose-Headers: Location

{
    "policies": [{
        "owner_id": "f7c55a1f-dde8-4880-9796-b3a0cd05745b",
        "subject": "977bbd33-5b59-4b7a-a9c3-8adda5d98255",
        "object": "830cf52a-4928-4cfb-af44-e82a696c9ac9",
        "actions": ["m_write", "m_read"],
        "created_at": "2023-04-05T15:37:01.120301Z",
        "updated_at": "2023-04-05T15:37:01.120301Z"
    }]
}
```

### Disconnect

Disconnect things from channels specified by lists of IDs.

> Must-have: `user_token`, `group_ids` and `client_ids`

```bash
curl -s -S -i -X PUT -H "Content-Type: application/json" -H "Authorization: Bearer <user_token>" http://localhost/disconnect -d '{"client_ids": ["<thing_id_1>", "<thing_id_2>"], "group_ids": ["<channel_id_1>", "<channel_id_2>"]}'
```

For example:

```bash
curl -s -S -i -X POST -H "Content-Type: application/json" -H "Authorization: Bearer $USER_TOKEN" http://localhost/disconnect -d '{"group_ids": ["830cf52a-4928-4cfb-af44-e82a696c9ac9"], "client_ids": ["ee6de1d4-aa1d-443a-9848-7857a90d03bd"]}'
```

Response:

```bash
HTTP/1.1 204 No Content
Server: nginx/1.23.3
Date: Wed, 05 Apr 2023 15:39:19 GMT
Content-Type: application/json
Connection: keep-alive
Access-Control-Expose-Headers: Location
```

Disconnect thing from the channel

> Must-have: `user_token`, `channel_id` and `thing_id`

```bash
curl -s -S -i -X DELETE -H "Content-Type: application/json" -H "Authorization: Bearer <user_token>" http://localhost/channels/<channel_id>/things/<thing_id>
```

For example:

```bash
curl -s -S -i -X DELETE -H "Content-Type: application/json" -H "Authorization: Bearer $USER_TOKEN" http://localhost/channels/830cf52a-4928-4cfb-af44-e82a696c9ac9/things/977bbd33-5b59-4b7a-a9c3-8adda5d98255
```

Response:

```bash
HTTP/1.1 204 No Content
Server: nginx/1.23.3
Date: Wed, 05 Apr 2023 15:40:58 GMT
Content-Type: application/json
Connection: keep-alive
Access-Control-Expose-Headers: Location
```

### Access by Key

Checks if thing has access to a channel

> Must-have: `channel_id` and `thing_secret`

```bash
curl -s -S -i -X POST -H "Content-Type: application/json" http://localhost/identify/channels/<channel_id>/access-by-key -d '{"client_id": "<thing_secret>", "action": "m_read" | "m_write", "entity_type": "group"}'
```

For example:

```bash
curl -s -S -i -X POST -H "Content-Type: application/json" -H "Authorization: Bearer $USER_TOKEN" http://localhost/identify/channels/830cf52a-4928-4cfb-af44-e82a696c9ac9/access-by-key -d '{"client_id": "a83b9afb-9022-4f9e-ba3d-4354a08c273a", "action": "m_read", "entity_type": "group"}'
```

Response:

```bash
HTTP/1.1 200 OK
Server: nginx/1.23.3
Date: Wed, 05 Apr 2023 15:46:43 GMT
Content-Type: application/json
Content-Length: 46
Connection: keep-alive
Access-Control-Expose-Headers: Location

{"id":"977bbd33-5b59-4b7a-a9c3-8adda5d98255"}
```

### Access by ID

Checks if thing has access to a channel

> Must-have: `channel_id` and `thing_id`

```bash
curl -s -S -i -X POST -H "Content-Type: application/json" http://localhost/identify/channels/<channel_id>/access-by-id -d '{"client_id": "<thing_id>", "action": "m_read" | "m_write", "entity_type": "group"}'
```

For example:

```bash
curl -s -S -i -X POST -H "Content-Type: application/json" -H "Authorization: Bearer $USER_TOKEN" http://localhost/identify/channels/830cf52a-4928-4cfb-af44-e82a696c9ac9/access-by-id -d '{"client_id": "977bbd33-5b59-4b7a-a9c3-8adda5d98255", "action": "m_read", "entity_type": "group"}'
```

Response:

```bash
HTTP/1.1 200 OK
Server: nginx/1.23.3
Date: Wed, 05 Apr 2023 15:45:04 GMT
Content-Type: application/json
Content-Length: 0
Connection: keep-alive
Access-Control-Expose-Headers: Location
```

### Identify

Validates thing's key and returns it's ID if key is valid

> Must-have: `thing_secret`

```bash
curl -s -S -i -X POST -H "Content-Type: application/json" http://localhost/identify -d '{"token": "<thing_secret>"}'
```

For example:

```bash
curl -s -S -i -X POST -H "Content-Type: application/json" http://localhost/identify -d '{"token": "a83b9afb-9022-4f9e-ba3d-4354a08c273a"}'
```

Response:

```bash
HTTP/1.1 200 OK
Server: nginx/1.23.3
Date: Wed, 05 Apr 2023 15:47:43 GMT
Content-Type: application/json
Content-Length: 46
Connection: keep-alive
Access-Control-Expose-Headers: Location

{"id":"977bbd33-5b59-4b7a-a9c3-8adda5d98255"}
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
curl -s -S -i -X POST -H "Content-Type: application/senml+json" -H "Authorization: Thing a83b9afb-9022-4f9e-ba3d-4354a08c273a" http://localhost/http/channels/830cf52a-4928-4cfb-af44-e82a696c9ac9/messages -d '[{"bn":"some-base-name:","bt":1.276020076001e+09,"bu":"A","bver":5,"n":"voltage","u":"V","v":120.1}, {"n":"current","t":-5,"v":1.2}, {"n":"current","t":-4,"v":1.3}]'
```

Response:

```bash
HTTP/1.1 202 Accepted
Server: nginx/1.23.3
Date: Wed, 05 Apr 2023 15:58:35 GMT
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
curl -s -S -i -H "Authorization: Thing a83b9afb-9022-4f9e-ba3d-4354a08c273a" http://localhost:9009/channels/830cf52a-4928-4cfb-af44-e82a696c9ac9/messages
```

Response:

```bash
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
            "channel": "830cf52a-4928-4cfb-af44-e82a696c9ac9",
            "publisher": "977bbd33-5b59-4b7a-a9c3-8adda5d98255",
            "protocol": "http",
            "name": "some-base-name:voltage",
            "unit": "V",
            "time": 1276020076.001,
            "value": 120.1
        },
        {
            "channel": "830cf52a-4928-4cfb-af44-e82a696c9ac9",
            "publisher": "977bbd33-5b59-4b7a-a9c3-8adda5d98255",
            "protocol": "http",
            "name": "some-base-name:current",
            "unit": "A",
            "time": 1276020072.001,
            "value": 1.3
        },
        {
            "channel": "830cf52a-4928-4cfb-af44-e82a696c9ac9",
            "publisher": "977bbd33-5b59-4b7a-a9c3-8adda5d98255",
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
> Nice-to-have: `parent_id`, `metadata`, `owner_id`, `description` and `status`

```bash
curl -s -S -i -X POST -H "Content-Type: application/json" -H "Authorization: Bearer <user_token>" http://localhost/groups -d '{"name": "<group_name>", "description": "<group_description>"}'
```

For example:

```bash
curl -s -S -i -X POST -H "Content-Type: application/json" -H "Authorization: Bearer $USER_TOKEN" http://localhost/groups -d '{"name": "testgroup",
"description": "test group description"}'
```

Response:

```bash
HTTP/1.1 201 Created
Server: nginx/1.23.3
Date: Wed, 05 Apr 2023 10:56:45 GMT
Content-Type: application/json
Content-Length: 259
Connection: keep-alive
Location: /groups/977bbd33-5b59-4b7a-a9c3-8adda5d98255
Access-Control-Expose-Headers: Location

{
    "id": "977bbd33-5b59-4b7a-a9c3-8adda5d98255",
    "owner_id": "f7c55a1f-dde8-4880-9796-b3a0cd05745b",
    "name": "testgroup",
    "description": "test group description",
    "created_at": "2023-04-05T10:56:45.672778Z",
    "updated_at": "2023-04-05T10:56:45.672778Z",
    "status": "enabled"
}
```

When you use `parent_id` make sure the parent is an already exisiting group

```bash
curl -s -S -i -X POST -H "Content-Type: application/json" -H "Authorization: Bearer <user_token>" http://localhost/groups -d '{"name": "<group_name>", "description": "<group_description>", "parent_id": "<parent_id>"}'
```

For example:

```bash
curl -s -S -i -X POST -H "Content-Type: application/json" -H "Authorization: Bearer $USER_TOKEN" http://localhost/groups -d '{"name": "testgroup2",
"description": "test group 2 description", "parent_id": "977bbd33-5b59-4b7a-a9c3-8adda5d98255"}'
```

Response:

```bash
HTTP/1.1 201 Created
Server: nginx/1.23.3
Date: Wed, 05 Apr 2023 10:57:26 GMT
Content-Type: application/json
Content-Length: 313
Connection: keep-alive
Location: /groups/7aeafccb-7c07-4c0e-a321-85ae014a73eb
Access-Control-Expose-Headers: Location

{
    "id": "7aeafccb-7c07-4c0e-a321-85ae014a73eb",
    "owner_id": "f7c55a1f-dde8-4880-9796-b3a0cd05745b",
    "parent_id": "977bbd33-5b59-4b7a-a9c3-8adda5d98255",
    "name": "testgroup2",
    "description": "test group 2 description",
    "created_at": "2023-04-05T10:57:26.310361Z",
    "updated_at": "2023-04-05T10:57:26.310361Z",
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
curl -s -S -i -X GET -H "Content-Type: application/json" -H "Authorization: Bearer $USER_TOKEN" http://localhost/groups/7aeafccb-7c07-4c0e-a321-85ae014a73eb
```

Response:

```bash
HTTP/1.1 200 OK
Server: nginx/1.23.3
Date: Wed, 05 Apr 2023 10:58:30 GMT
Content-Type: application/json
Content-Length: 313
Connection: keep-alive
Access-Control-Expose-Headers: Location

{
    "id": "7aeafccb-7c07-4c0e-a321-85ae014a73eb",
    "owner_id": "f7c55a1f-dde8-4880-9796-b3a0cd05745b",
    "parent_id": "977bbd33-5b59-4b7a-a9c3-8adda5d98255",
    "name": "testgroup2",
    "description": "test group 2 description",
    "created_at": "2023-04-05T10:57:26.310361Z",
    "updated_at": "2023-04-05T10:57:26.310361Z",
    "status": "enabled"
}
```

### Get groups

Get all groups, list requests accepts limit and offset query parameters

> Must-have: `user_token`

```bash
curl -s -S -i -X GET -H "Content-Type: application/json" -H "Authorization: Bearer <user_token>" http://localhost/groups
```

For example:

```bash
curl -s -S -i -X GET -H "Content-Type: application/json" -H "Authorization: Bearer $USER_TOKEN" http://localhost/groups
```

Response:

```bash
HTTP/1.1 200 OK
Server: nginx/1.23.3
Date: Wed, 05 Apr 2023 10:59:23 GMT
Content-Type: application/json
Content-Length: 595
Connection: keep-alive
Access-Control-Expose-Headers: Location

{
    "total": 2,
    "groups": [{
            "id": "977bbd33-5b59-4b7a-a9c3-8adda5d98255",
            "owner_id": "f7c55a1f-dde8-4880-9796-b3a0cd05745b",
            "name": "testgroup",
            "description": "test group description",
            "created_at": "2023-04-05T10:56:45.672778Z",
            "updated_at": "2023-04-05T10:56:45.672778Z",
            "status": "enabled"
        },
        {
            "id": "7aeafccb-7c07-4c0e-a321-85ae014a73eb",
            "owner_id": "f7c55a1f-dde8-4880-9796-b3a0cd05745b",
            "parent_id": "977bbd33-5b59-4b7a-a9c3-8adda5d98255",
            "name": "testgroup2",
            "description": "test group 2 description",
            "created_at": "2023-04-05T10:57:26.310361Z",
            "updated_at": "2023-04-05T10:57:26.310361Z",
            "status": "enabled"
        }
    ]
}
```

### Get Group Parents

Get all group parents, list requests accepts limit and offset query parameters

> Must-have: `user_token` and `group_id`

```bash
curl -s -S -i -X GET -H "Content-Type: application/json" -H "Authorization: Bearer <user_token>" http://localhost/groups/<group_id>/parents
```

For example:

```bash
curl -s -S -i -X GET -H "Content-Type: application/json" -H "Authorization: Bearer $USER_TOKEN" http://localhost/groups/7aeafccb-7c07-4c0e-a321-85ae014a73eb/parents?tree=true
```

Response:

```bash
HTTP/1.1 200 OK
Server: nginx/1.23.3
Date: Wed, 05 Apr 2023 11:39:00 GMT
Content-Type: application/json
Content-Length: 643
Connection: keep-alive
Access-Control-Expose-Headers: Location

{
    "limit": 10,
    "total": 2,
    "groups": [{
        "id": "977bbd33-5b59-4b7a-a9c3-8adda5d98255",
        "owner_id": "f7c55a1f-dde8-4880-9796-b3a0cd05745b",
        "name": "testgroup",
        "description": "test group description",
        "children": [{
            "id": "7aeafccb-7c07-4c0e-a321-85ae014a73eb",
            "owner_id": "f7c55a1f-dde8-4880-9796-b3a0cd05745b",
            "parent_id": "977bbd33-5b59-4b7a-a9c3-8adda5d98255",
            "name": "new name",
            "description": "new description",
            "metadata": { "foo": "bar" },
            "level": 1,
            "created_at": "2023-04-05T10:57:26.310361Z",
            "updated_at": "2023-04-05T11:02:08.823858Z",
            "status": "enabled"
        }],
        "created_at": "2023-04-05T10:56:45.672778Z",
        "updated_at": "2023-04-05T10:56:45.672778Z",
        "status": "enabled"
    }]
}
```

### Get Group Children

Get all group children, list requests accepts limit and offset query parameters

> Must-have: `user_token`

```bash
curl -s -S -i -X GET -H "Content-Type: application/json" -H "Authorization: Bearer <user_token>" http://localhost/groups/<group_id>/children
```

For example:

```bash
curl -s -S -i -X GET -H "Content-Type: application/json" -H "Authorization: Bearer $USER_TOKEN" http://localhost/groups/977bbd33-5b59-4b7a-a9c3-8adda5d98255/children?tree=true
```

Response:

```bash
HTTP/1.1 200 OK
Server: nginx/1.23.3
Date: Wed, 05 Apr 2023 11:40:34 GMT
Content-Type: application/json
Content-Length: 782
Connection: keep-alive
Access-Control-Expose-Headers: Location

{
    "limit": 10,
    "total": 2,
    "groups": [{
        "id": "977bbd33-5b59-4b7a-a9c3-8adda5d98255",
        "owner_id": "f7c55a1f-dde8-4880-9796-b3a0cd05745b",
        "name": "testgroup",
        "description": "test group description",
        "level": 1,
        "path": "977bbd33-5b59-4b7a-a9c3-8adda5d98255",
        "children": [{
            "id": "7aeafccb-7c07-4c0e-a321-85ae014a73eb",
            "owner_id": "f7c55a1f-dde8-4880-9796-b3a0cd05745b",
            "parent_id": "977bbd33-5b59-4b7a-a9c3-8adda5d98255",
            "name": "new name",
            "description": "new description",
            "metadata": { "foo": "bar" },
            "level": 2,
            "path": "977bbd33-5b59-4b7a-a9c3-8adda5d98255.7aeafccb-7c07-4c0e-a321-85ae014a73eb",
            "created_at": "2023-04-05T10:57:26.310361Z",
            "updated_at": "2023-04-05T11:02:08.823858Z",
            "status": "enabled"
        }],
        "created_at": "2023-04-05T10:56:45.672778Z",
        "updated_at": "2023-04-05T10:56:45.672778Z",
        "status": "enabled"
    }]
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
curl -s -S -i -X PUT -H "Content-Type: application/json" -H "Authorization: Bearer $USER_TOKEN" http://localhost/groups/7aeafccb-7c07-4c0e-a321-85ae014a73eb -d '{"name": "new name", "description": "new description", "metadata": {"foo":"bar"}}'
```

Response:

```bash
HTTP/1.1 200 OK
Server: nginx/1.23.3
Date: Wed, 05 Apr 2023 11:02:08 GMT
Content-Type: application/json
Content-Length: 327
Connection: keep-alive
Access-Control-Expose-Headers: Location

{
    "id": "7aeafccb-7c07-4c0e-a321-85ae014a73eb",
    "owner_id": "f7c55a1f-dde8-4880-9796-b3a0cd05745b",
    "parent_id": "977bbd33-5b59-4b7a-a9c3-8adda5d98255",
    "name": "new name",
    "description": "new description",
    "metadata": { "foo": "bar" },
    "created_at": "2023-04-05T10:57:26.310361Z",
    "updated_at": "2023-04-05T11:02:08.823858Z",
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
curl -s -S -i -X POST -H "Content-Type: application/json" -H "Authorization: Bearer $USER_TOKEN" http://localhost/groups/7aeafccb-7c07-4c0e-a321-85ae014a73eb/disable
```

Response:

```bash
HTTP/1.1 200 OK
Server: nginx/1.23.3
Date: Wed, 05 Apr 2023 11:03:36 GMT
Content-Type: application/json
Content-Length: 328
Connection: keep-alive
Access-Control-Expose-Headers: Location

{
    "id": "7aeafccb-7c07-4c0e-a321-85ae014a73eb",
    "owner_id": "f7c55a1f-dde8-4880-9796-b3a0cd05745b",
    "parent_id": "977bbd33-5b59-4b7a-a9c3-8adda5d98255",
    "name": "new name",
    "description": "new description",
    "metadata": { "foo": "bar" },
    "created_at": "2023-04-05T10:57:26.310361Z",
    "updated_at": "2023-04-05T11:02:08.823858Z",
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
curl -s -S -i -X POST -H "Content-Type: application/json" -H "Authorization: Bearer $USER_TOKEN" http://localhost/groups/7aeafccb-7c07-4c0e-a321-85ae014a73eb/enable
```

Response:

```bash
HTTP/1.1 200 OK
Server: nginx/1.23.3
Date: Wed, 05 Apr 2023 11:04:29 GMT
Content-Type: application/json
Content-Length: 327
Connection: keep-alive
Access-Control-Expose-Headers: Location

{
    "id": "7aeafccb-7c07-4c0e-a321-85ae014a73eb",
    "owner_id": "f7c55a1f-dde8-4880-9796-b3a0cd05745b",
    "parent_id": "977bbd33-5b59-4b7a-a9c3-8adda5d98255",
    "name": "new name",
    "description": "new description",
    "metadata": { "foo": "bar" },
    "created_at": "2023-04-05T10:57:26.310361Z",
    "updated_at": "2023-04-05T11:02:08.823858Z",
    "status": "enabled"
}
```

### Assign

Assign user, thing or channel to a group

> Must-have: `user_token`, `group_id`, `member_id` and `member_action`

```bash
curl -s -S -i -X POST -H "Content-Type: application/json" -H "Authorization: Bearer <user_token>" http://localhost/policies -d '{"subject": "<user_id>" | "<thing_id_>" | "<channel_id_>", "object": "<group_id>", "actions":["<client_actions>" | "<group_actions>"]}'
```

For example:

```bash
curl -s -S -i -X POST -H "Content-Type: application/json" -H "Authorization: Bearer $USER_TOKEN" http://localhost/policies -d '{"subject": "838dc3bb-fac9-4b39-ba4c-97a051c7c10d", "object": "977bbd33-5b59-4b7a-a9c3-8adda5d98255", "actions":["g_add", "c_list"]}'
```

Response:

```bash
HTTP/1.1 201 Created
Server: nginx/1.23.3
Date: Wed, 05 Apr 2023 11:48:01 GMT
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

### Members

Get list of ID's from group

> Must-have: `user_token` and `group_id`
> Must take into consideration the user identified by the `user_token` needs to be assigned to the same group with `g_list` action

```bash
curl -s -S -i -X GET -H "Content-Type: application/json" -H "Authorization: Bearer <user_token>" http://localhost/groups/<group_id>/members  
```

For example:

```bash
curl -s -S -i -X GET -H "Content-Type: application/json" -H "Authorization: Bearer $USER_TOKEN" http://localhost/groups/977bbd33-5b59-4b7a-a9c3-8adda5d98255/members
```

Response:

```bash
HTTP/1.1 200 OK
Server: nginx/1.23.3
Date: Wed, 05 Apr 2023 11:52:06 GMT
Content-Type: application/json
Content-Length: 532
Connection: keep-alive
Access-Control-Expose-Headers: Location

{
    "limit": 10,
    "total": 2,
    "members": [{
            "id": "f7c55a1f-dde8-4880-9796-b3a0cd05745b",
            "name": "John Doe",
            "credentials": { "identity": "john.doe@email.com", "secret": "" },
            "created_at": "2023-04-05T09:36:36.40605Z",
            "updated_at": "0001-01-01T00:00:00Z",
            "status": "enabled"
        },
        {
            "id": "838dc3bb-fac9-4b39-ba4c-97a051c7c10d",
            "name": "new name",
            "tags": ["foo", "bar"],
            "credentials": { "identity": "updated.john.doe@email.com", "secret": "" },
            "metadata": { "foo": "bar" },
            "created_at": "2023-04-05T09:51:30.404336Z",
            "updated_at": "0001-01-01T00:00:00Z",
            "status": "enabled"
        }
    ]
}
```

### Unassign

Unassign user, thing or channel from group

> Must-have: `user_token`, `group_id`, `member_id` and `action`

```bash
curl -s -S -i -X DELETE -H "Content-Type: application/json" -H "Authorization: Bearer <user_token>" http://localhost/policies/<group_id>/"<user_id>" | "<thing_id_>" | "<channel_id_>" -d '{ "actions":["<client_actions>" | "<group_actions>"]}'
```

For example:

```bash
curl -s -S -i -X DELETE -H "Content-Type: application/json" -H "Authorization: Bearer $USER_TOKEN" http://localhost/policies/977bbd33-5b59-4b7a-a9c3-8adda5d98255/838dc3bb-fac9-4b39-ba4c-97a051c7c10d -d '{"actions":["g_add", "c_list"]}'
```

Response:

```bash
HTTP/1.1 204 No Content
Server: nginx/1.23.3
Date: Wed, 05 Apr 2023 11:59:32 GMT
Content-Type: application/json
Connection: keep-alive
Strict-Transport-Security: max-age=63072000; includeSubdomains
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: *
Access-Control-Allow-Headers: *
```

## Policies

### Add policies

Only policies defined on [Predefined Policies section](/authorization/#summary-of-defined-policies) are allowed.

> Must-have: user_token, object, subject_id and actions

```bash
curl -s -S -i -X POST -H "Content-Type: application/json" -H "Authorization: Bearer <user_token>" http://localhost/policies -d '{"subject": "<user_id>" | "<thing_id_>" | "<channel_id_>", "object": "<group_id>", "actions":["<client_actions>" | "<group_actions>"]}'
```

For example:

```bash
curl -s -S -i -X POST -H "Content-Type: application/json" -H "Authorization: Bearer $USER_TOKEN" http://localhost/policies -d '{"subject": "838dc3bb-fac9-4b39-ba4c-97a051c7c10d", "object": "977bbd33-5b59-4b7a-a9c3-8adda5d98255", "actions":["g_add", "c_list"]}'
```

Response:

```bash
HTTP/1.1 201 Created
Server: nginx/1.23.3
Date: Wed, 05 Apr 2023 11:48:01 GMT
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

### Update policies

Only policies defined on [Predefined Policies section](/authorization/#summary-of-defined-policies) are allowed.

> Must-have: user_token, object, subject_id and actions

```bash
curl -s -S -i -X PUT -H "Content-Type: application/json" -H "Authorization: Bearer <user_token>" http://localhost/policies -d '{"subject": "<user_id>" | "<thing_id_>" | "<channel_id_>", "object": "<group_id>", "actions":["<client_actions>" | "<group_actions>"]}'
```

For example:

```bash
curl -s -S -i -X PUT -H "Content-Type: application/json" -H "Authorization: Bearer $USER_TOKEN" http://localhost/policies -d '{"subject": "838dc3bb-fac9-4b39-ba4c-97a051c7c10d", "object": "977bbd33-5b59-4b7a-a9c3-8adda5d98255", "actions":["g_add", "c_list"]}'
```

Response:

```bash
HTTP/1.1 204 No Content
Server: nginx/1.23.3
Date: Wed, 05 Apr 2023 12:20:05 GMT
Content-Type: application/json
Connection: keep-alive
Strict-Transport-Security: max-age=63072000; includeSubdomains
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: *
Access-Control-Allow-Headers: *
```

### Delete policies

Only policies defined on [Predefined Policies section](/authorization/#summary-of-defined-policies) are allowed.

> Must-have: `user_token`, `group_id`, `member_id` and `action`

```bash
curl -s -S -i -X DELETE -H "Content-Type: application/json" -H "Authorization: Bearer <user_token>" http://localhost/policies/<group_id>/"<user_id>" | "<thing_id_>" | "<channel_id_>" -d '{ "actions":["<client_actions>" | "<group_actions>"]}'
```

For example:

```bash
curl -s -S -i -X DELETE -H "Content-Type: application/json" -H "Authorization: Bearer $USER_TOKEN" http://localhost/policies/977bbd33-5b59-4b7a-a9c3-8adda5d98255/838dc3bb-fac9-4b39-ba4c-97a051c7c10d -d '{"actions":["g_add", "c_list"]}'
```

Response:

```bash
HTTP/1.1 204 No Content
Server: nginx/1.23.3
Date: Wed, 05 Apr 2023 11:59:32 GMT
Content-Type: application/json
Connection: keep-alive
Strict-Transport-Security: max-age=63072000; includeSubdomains
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: *
Access-Control-Allow-Headers: *
```
