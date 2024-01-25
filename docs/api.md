# API

## Reference

API reference in the Swagger UI can be found at: [https://api.magistrala.abstractmachines.fr][api]

## Users

### Create User

To start working with the Mainflux system, you need to create a user account.

> Identity, which can be email-address (this must be unique as it identifies the user) and secret (password must contain at least 8 characters).

```bash
curl -sSiX POST http://localhost/users -H "Content-Type: application/json" [-H "Authorization: Bearer <user_token>"] -d @- << EOF
{
  "name": "[name]",
  "tags": ["[tag1]", "[tag2]"],
  "credentials": {
    "identity": "<user_identity>",
    "secret": "<user_secret>"
  },
  "metadata": {
    "[key1]": "[value1]",
    "[key2]": "[value2]"
  },
  "status": "[status]",
  "role": "[role]"
}
EOF
```

For example:

```bash
curl -sSiX POST http://localhost/users -H "Content-Type: application/json" -d @- << EOF
{
  "name": "John Doe",
  "credentials": {
    "identity": "john.doe@email.com",
    "secret": "12345678"
  }
}
EOF

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
  "credentials": { "identity": "john.doe@email.com" },
  "created_at": "2023-06-14T13:45:38.808423Z",
  "updated_at": "0001-01-01T00:00:00Z",
  "status": "enabled"
}
```

You can also use `<user_token>` so that the owner of the new user is the one identified by the `<user_token>` for example:

```bash
curl -sSiX POST http://localhost/users -H "Content-Type: application/json" -H "Authorization: Bearer <user_token>" -d @- << EOF
{
  "name": "John Doe",
  "credentials": {
    "identity": "jane.doe@email.com",
    "secret": "12345678"
  },
}
EOF

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
  "credentials": { "identity": "jane.doe@email.com" },
  "created_at": "2023-06-14T13:46:47.322648Z",
  "updated_at": "0001-01-01T00:00:00Z",
  "status": "enabled"
}
```

### Create Token

To log in to the Mainflux system, you need to create a `user_token`.

```bash
curl -sSiX POST http://localhost/users/tokens/issue -H "Content-Type: application/json" -d @- << EOF
{
  "identity": "<user_identity>",
  "secret": "<user_secret>"
}
EOF
```

For example:

```bash
curl -sSiX POST http://localhost/users/tokens/issue -H "Content-Type: application/json" -d @- << EOF
{
  "identity": "john.doe@email.com",
  "secret": "12345678"
}
EOF

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

```bash
curl -sSiX POST http://localhost/users/tokens/refresh -H "Content-Type: application/json" -H "Authorization: Bearer <refresh_token>"
```

For example:

```bash
curl -sSiX POST http://localhost/users/tokens/refresh -H "Content-Type: application/json" -H "Authorization: Bearer <refresh_token>"

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

You can always check the user profile that is logged-in by using the `user_token`.

```bash
curl -sSiX GET http://localhost/users/profile -H "Authorization: Bearer <user_token>"
```

For example:

```bash
curl -sSiX GET http://localhost/users/profile -H "Authorization: Bearer <user_token>"

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
    "identity": "jane.doe@email.com"
  },
  "created_at": "2023-06-14T13:46:47.322648Z",
  "updated_at": "0001-01-01T00:00:00Z",
  "status": "enabled"
}
```

### Get User

You can always check the user entity by entering the user ID and `user_token`.

```bash
curl -sSiX GET http://localhost/users/<user_id> -H "Authorization: Bearer <user_token>"
```

For example:

```bash
curl -sSiX GET http://localhost/users/1890c034-7ef9-4cde-83df-d78ea1d4d281  -H "Authorization: Bearer <user_token>"

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
    "identity": "jane.doe@email.com"
  },
  "created_at": "2023-06-14T13:46:47.322648Z",
  "updated_at": "0001-01-01T00:00:00Z",
  "status": "enabled"
}
```

### Get Users

You can get all users in the database by querying `/users` endpoint.

```bash
curl -sSiX GET http://localhost/users -H "Authorization: Bearer <user_token>"
```

For example:

```bash
curl -sSiX GET http://localhost/users -H "Authorization: Bearer <user_token>"

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
      "credentials": { "identity": "jane.doe@email.com" },
      "created_at": "2023-06-14T13:46:47.322648Z",
      "updated_at": "0001-01-01T00:00:00Z",
      "status": "enabled"
    }
  ]
}
```

If you want to paginate your results then use `offset`, `limit`, `metadata`, `name`, `identity`, `tag`, `status` and `visbility` as query parameters.

```bash
curl -sSiX GET http://localhost/users?[offset=<offset>]&[limit=<limit>]&[identity=<identity>]&[name=<name>]&[tag=<tag>]&[status=<status>]&[visibility=<visibility>] -H "Authorization: Bearer <user_token>"
```

For example:

```bash
curl -sSiX GET http://localhost/users?offset=0&limit=5&identity=jane.doe@email.com -H "Authorization: Bearer <user_token>"

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
      "credentials": { "identity": "jane.doe@email.com" },
      "created_at": "2023-06-14T13:46:47.322648Z",
      "updated_at": "0001-01-01T00:00:00Z",
      "status": "enabled"
    }
  ]
}
```

### Update User

Updating user's name and/or metadata

```bash
curl -sSiX PATCH http://localhost/users/<user_id> -H "Content-Type: application/json" -H "Authorization: Bearer <user_token>" -d @- << EOF
{
  "name": "[new_name]",
  "metadata": {
    "[key]": "[value]",
  }
}
EOF
```

For example:

```bash
curl -sSiX PATCH http://localhost/users/1890c034-7ef9-4cde-83df-d78ea1d4d281 -H "Content-Type: application/json" -H "Authorization: Bearer <user_token>" -d @- << EOF
{
  "name": "Jane Doe",
  "metadata": {
    "location": "london",
  }
}
EOF

HTTP/1.1 200 OK
Server: nginx/1.23.3
Date: Wed, 14 Jun 2023 13:54:40 GMT
Content-Type: application/json
Content-Length: 354
Connection: keep-alive
Access-Control-Expose-Headers: Location

{
  "id": "1890c034-7ef9-4cde-83df-d78ea1d4d281",
  "name": "Jane Doe",
  "owner": "94939159-d129-4f17-9e4e-cc2d615539d7",
  "credentials": { "identity": "jane.doe@email.com" },
  "metadata": { "location": "london" },
  "created_at": "2023-06-14T13:46:47.322648Z",
  "updated_at": "2023-06-14T13:54:40.208005Z",
  "updated_by": "94939159-d129-4f17-9e4e-cc2d615539d7",
  "status": "enabled"
}
```

### Update User Tags

Updating user's tags

```bash
curl -sSiX PATCH http://localhost/users/<user_id>/tags -H "Content-Type: application/json" -H "Authorization: Bearer <user_token>" -d @- << EOF
{
  "tags": [
    "[tag_1]",
    ...
    "[tag_N]"
  ]
}
EOF
```

For example:

```bash
curl -sSiX PATCH http://localhost/users/1890c034-7ef9-4cde-83df-d78ea1d4d281/tags -H "Content-Type: application/json" -H "Authorization: Bearer <user_token>" -d @- << EOF
{
  "tags": ["male", "developer"]
}
EOF

HTTP/1.1 200 OK
Server: nginx/1.23.3
Date: Wed, 14 Jun 2023 13:55:18 GMT
Content-Type: application/json
Content-Length: 375
Connection: keep-alive
Access-Control-Expose-Headers: Location

{
  "id": "1890c034-7ef9-4cde-83df-d78ea1d4d281",
  "name": "Jane Doe",
  "tags": ["male", "developer"],
  "owner": "94939159-d129-4f17-9e4e-cc2d615539d7",
  "credentials": { "identity": "jane.doe@email.com" },
  "metadata": { "location": "london" },
  "created_at": "2023-06-14T13:46:47.322648Z",
  "updated_at": "2023-06-14T13:55:18.353027Z",
  "updated_by": "94939159-d129-4f17-9e4e-cc2d615539d7",
  "status": "enabled"
}
```

### Update User Owner

Updating user's owner

```bash
curl -sSiX PATCH http://localhost/users/<user_id>/owner -H "Content-Type: application/json" -H "Authorization: Bearer <user_token>" -d @- << EOF
{
  "owner": "<owner_id>"
}
EOF
```

For example:

```bash
curl -sSiX PATCH http://localhost/users/1890c034-7ef9-4cde-83df-d78ea1d4d281/owner -H "Content-Type: application/json" -H "Authorization: Bearer <user_token>" -d @- << EOF
{
  "owner": "532311a4-c13b-4061-b991-98dcae7a934e"
}
EOF

HTTP/1.1 200 OK
Server: nginx/1.23.3
Date: Wed, 14 Jun 2023 13:56:32 GMT
Content-Type: application/json
Content-Length: 375
Connection: keep-alive
Access-Control-Expose-Headers: Location

{
  "id": "1890c034-7ef9-4cde-83df-d78ea1d4d281",
  "name": "Jane Doe",
  "tags": ["male", "developer"],
  "owner": "532311a4-c13b-4061-b991-98dcae7a934e",
  "credentials": { "identity": "jane.doe@email.com" },
  "metadata": { "location": "london" },
  "created_at": "2023-06-14T13:46:47.322648Z",
  "updated_at": "2023-06-14T13:56:32.059484Z",
  "updated_by": "94939159-d129-4f17-9e4e-cc2d615539d7",
  "status": "enabled"
}
```

### Update User Identity

Updating user's identity

```bash
curl -sSiX PATCH http://localhost/users/<user_id>/identity -H "Content-Type: application/json" -H "Authorization: Bearer <user_token>" -d @- << EOF
{
  "identity": "<user_identity>"
}
EOF
```

For example:

```bash
curl -sSiX PATCH http://localhost/users/1890c034-7ef9-4cde-83df-d78ea1d4d281/identity -H "Content-Type: application/json" -H "Authorization: Bearer <user_token>" -d @- << EOF
{
  "identity": "updated.jane.doe@gmail.com"
}
EOF

HTTP/1.1 200 OK
Server: nginx/1.23.3
Date: Wed, 14 Jun 2023 13:59:53 GMT
Content-Type: application/json
Content-Length: 382
Connection: keep-alive
Access-Control-Expose-Headers: Location

{
  "id": "1890c034-7ef9-4cde-83df-d78ea1d4d281",
  "name": "Jane Doe",
  "tags": ["male", "developer"],
  "owner": "94939159-d129-4f17-9e4e-cc2d615539d7",
  "credentials": { "identity": "updated.jane.doe@gmail.com" },
  "metadata": { "location": "london" },
  "created_at": "2023-06-14T13:46:47.322648Z",
  "updated_at": "2023-06-14T13:59:53.422595Z",
  "updated_by": "94939159-d129-4f17-9e4e-cc2d615539d7",
  "status": "enabled"
}
```

### Change Secret

Changing the user secret can be done by calling the update secret method

```bash
curl -sSiX PATCH http://localhost/users/secret -H "Content-Type: application/json" -H "Authorization: Bearer <user_token>" -d @- << EOF
{
  "old_secret": "<old_secret>",
  "new_secret": "<new_secret>"
}
EOF
```

For example:

```bash
curl -sSiX PATCH http://localhost/users/secret -H "Content-Type: application/json" -H "Authorization: Bearer <user_token>" -d @- << EOF
{
  "old_secret": "12345678",
  "new_secret": "12345678a"
}
EOF

HTTP/1.1 200 OK
Server: nginx/1.23.3
Date: Wed, 14 Jun 2023 14:00:35 GMT
Content-Type: application/json
Content-Length: 281
Connection: keep-alive
Access-Control-Expose-Headers: Location
```

### Enable User

Changing the user status to enabled can be done by calling the enable user method

```bash
curl -sSiX POST http://localhost/users/<user_id>/enable -H "Authorization: Bearer <user_token>"
```

For example:

```bash
curl -sSiX POST http://localhost/users/1890c034-7ef9-4cde-83df-d78ea1d4d281/enable -H "Authorization: Bearer <user_token>"

HTTP/1.1 200 OK
Server: nginx/1.23.3
Date: Wed, 14 Jun 2023 14:01:25 GMT
Content-Type: application/json
Content-Length: 382
Connection: keep-alive
Access-Control-Expose-Headers: Location

{
  "id": "1890c034-7ef9-4cde-83df-d78ea1d4d281",
  "name": "Jane Doe",
  "tags": ["male", "developer"],
  "owner": "94939159-d129-4f17-9e4e-cc2d615539d7",
  "credentials": { "identity": "updated.jane.doe@gmail.com" },
  "metadata": { "location": "london" },
  "created_at": "2023-06-14T13:46:47.322648Z",
  "updated_at": "2023-06-14T13:59:53.422595Z",
  "updated_by": "94939159-d129-4f17-9e4e-cc2d615539d7",
  "status": "enabled"
}
```

### Disable User

Changing the user status to disabled can be done by calling the disable user method

```bash
curl -sSiX POST http://localhost/users/<user_id>/disable -H "Authorization: Bearer <user_token>"
```

For example:

```bash
curl -sSiX POST http://localhost/users/1890c034-7ef9-4cde-83df-d78ea1d4d281/disable -H "Authorization: Bearer <user_token>"

HTTP/1.1 200 OK
Server: nginx/1.23.3
Date: Wed, 14 Jun 2023 14:01:23 GMT
Content-Type: application/json
Content-Length: 383
Connection: keep-alive
Access-Control-Expose-Headers: Location

{
  "id": "1890c034-7ef9-4cde-83df-d78ea1d4d281",
  "name": "Jane Doe",
  "tags": ["male", "developer"],
  "owner": "94939159-d129-4f17-9e4e-cc2d615539d7",
  "credentials": { "identity": "updated.jane.doe@gmail.com" },
  "metadata": { "location": "london" },
  "created_at": "2023-06-14T13:46:47.322648Z",
  "updated_at": "2023-06-14T13:59:53.422595Z",
  "updated_by": "94939159-d129-4f17-9e4e-cc2d615539d7",
  "status": "disabled"
}
```

### Get User Memberships

You can get all groups a user is assigned to by calling the get user memberships method.

If you want to paginate your results then use `offset`, `limit`, `metadata`, `name`, `status`, `parentID`, `ownerID`, `tree` and `dir` as query parameters.

> The user identified by the `user_token` must be assigned to the same group as the user with id `user_id` with `c_list` action. Alternatively, the user identified by the `user_token` must be the owner of the user with id `user_id`.

```bash
curl -sSiX GET http://localhost/users/<user_id>/memberships -H "Authorization: Bearer <user_token>"
```

For example:

```bash
curl -sSiX GET http://localhost/users/1890c034-7ef9-4cde-83df-d78ea1d4d281/memberships -H "Authorization: Bearer <user_token>"

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
      "name": "Data analysts",
      "description": "This group would be responsible for analyzing data collected from sensors.",
      "metadata": { "location": "london" },
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

```bash
curl -sSiX POST http://localhost/things -H "Content-Type: application/json" -H "Authorization: Bearer <user_token>" -d @- << EOF
{
  "id": "[thing_id]",
  "name":"[thing_name]",
  "tags": ["[tag1]", "[tag2]"],
  "credentials": {
      "identity": "[thing-identity]",
      "secret":"[thing-secret]"
  },
    "metadata": {
      "[key1]": "[value1]",
      "[key2]": "[value2]"
  },
  "status": "[enabled|disabled]"
}
EOF
```

For example:

```bash
curl -sSiX POST http://localhost/things -H "Content-Type: application/json" -H "Authorization: Bearer <user_token>" -d @- << EOF
{
  "name":"Temperature Sensor"
}
EOF

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
  "name": "Temperature Sensor",
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

To create a thing with an external ID, you need to provide the ID together with thing name, and other fields as well as a `user_token`

For example:

```bash
curl -sSiX POST http://localhost/things -H "Content-Type: application/json" -H "Authorization: Bearer <user_token>" -d @- << EOF
{
  "id": "2766ae94-9a08-4418-82ce-3b91cf2ccd3e",
  "name":"Temperature Sensor"
}
EOF

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
  "name": "Temperature Sensor",
  "owner": "94939159-d129-4f17-9e4e-cc2d615539d7",
  "credentials": { "secret": "65ca03bd-eb6b-420b-9d5d-46d459d4f71c" },
  "created_at": "2023-06-15T09:05:06.538170496Z",
  "updated_at": "0001-01-01T00:00:00Z",
  "status": "enabled"
}
```

### Create Thing with External Secret

It is often the case that the user will want to integrate the existing solutions, e.g. an asset management system, with the Mainflux platform. To simplify the integration between the systems and avoid artificial cross-platform reference, such as special fields in Mainflux Things metadata, it is possible to set Mainflux Thing secret with an existing unique secret when creating the Thing. This way, the user can set the existing secret as the Thing secret of a newly created Thing to keep reference between Thing and the asset that Thing represents.
The limitation is that the existing secret has to be unique in the Mainflux domain.

To create a thing with an external secret, you need to provide the secret together with thing name, and other fields as well as a `user_token`

For example:

```bash
curl -sSiX POST http://localhost/things -H "Content-Type: application/json" -H "Authorization: Bearer <user_token>" -d @- << EOF
{
  "name":"Temperature Sensor"
  "credentials": {
    "secret": "94939159-9a08-4f17-9e4e-3b91cf2ccd3e"
  }
}
EOF

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
  "name": "Temperature Sensor",
  "owner": "94939159-d129-4f17-9e4e-cc2d615539d7",
  "credentials": { "secret": "94939159-9a08-4f17-9e4e-3b91cf2ccd3e" },
  "created_at": "2023-06-15T09:05:06.538170496Z",
  "updated_at": "0001-01-01T00:00:00Z",
  "status": "enabled"
}
```

### Create Things

You can create multiple things at once by entering a series of things structures and a `user_token`

```bash
curl -sSiX POST http://localhost/things/bulk -H "Content-Type: application/json" -H "Authorization: Bearer <user_token>" -d @- << EOF
[
  {
    "id": "[thing_id]",
    "name":"[thing_name]",
    "tags": ["[tag1]", "[tag2]"],
    "credentials": {
        "identity": "[thing-identity]",
        "secret":"[thing-secret]"
    },
      "metadata": {
        "[key1]": "[value1]",
        "[key2]": "[value2]"
    },
    "status": "[enabled|disabled]"
  },
  {
    "id": "[thing_id]",
    "name":"[thing_name]",
    "tags": ["[tag1]", "[tag2]"],
    "credentials": {
        "identity": "[thing-identity]",
        "secret":"[thing-secret]"
    },
      "metadata": {
        "[key1]": "[value1]",
        "[key2]": "[value2]"
    },
    "status": "[enabled|disabled]"
  }
]
EOF
```

For example:

```bash
curl -sSiX POST http://localhost/things/bulk -H "Content-Type: application/json" -H "Authorization: Bearer <user_token>" -d @- << EOF
[
  {
    "name":"Motion Sensor"
  },
  {
    "name":"Light Sensor"
  }
]
EOF

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
      "name": "Motion Sensor",
      "owner": "94939159-d129-4f17-9e4e-cc2d615539d7",
      "credentials": { "secret": "941c380a-3a41-40e9-8b79-3087daa4f3a6" },
      "created_at": "2023-06-15T09:05:45.719182307Z",
      "updated_at": "0001-01-01T00:00:00Z",
      "status": "enabled"
    },
    {
      "id": "3709f2b0-9c73-413f-992e-7f6f9b396b0d",
      "name": "Light Sensor",
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

For example:

```bash
curl -sSiX POST http://localhost/things/bulk -H "Content-Type: application/json" -H "Authorization: Bearer <user_token>" -d @- << EOF
[
  {
    "id": "eb2670ba-a2be-4ea4-83cb-111111111111",
    "name":"Motion Sensor"
  },
  {
    "id": "eb2670ba-a2be-4ea4-83cb-111111111112",
    "name":"Light Sensor"
  }
]
EOF

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
      "name": "Motion Sensor",
      "owner": "94939159-d129-4f17-9e4e-cc2d615539d7",
      "credentials": { "secret": "325cda17-3a52-465d-89a7-2b63c7d0e3a6" },
      "created_at": "2023-06-15T09:06:17.967825372Z",
      "updated_at": "0001-01-01T00:00:00Z",
      "status": "enabled"
    },
    {
      "id": "eb2670ba-a2be-4ea4-83cb-111111111112",
      "name": "Light Sensor",
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

```bash
curl -sSiX GET http://localhost/things/<thing_id> -H "Authorization: Bearer <user_token>"
```

For example:

```bash
curl -sSiX GET http://localhost/things/48101ecd-1535-40c6-9ed8-5b1d21e371bb -H "Authorization: Bearer <user_token>"

HTTP/1.1 200 OK
Server: nginx/1.23.3
Date: Thu, 15 Jun 2023 09:07:30 GMT
Content-Type: application/json
Content-Length: 277
Connection: keep-alive
Access-Control-Expose-Headers: Location

{
  "id": "48101ecd-1535-40c6-9ed8-5b1d21e371bb",
  "name": "Temperature Sensor",
  "owner": "94939159-d129-4f17-9e4e-cc2d615539d7",
  "credentials": { "secret": "c3f8c096-c60f-4375-8494-bca20a12fca7" },
  "created_at": "2023-06-15T09:04:04.292602Z",
  "updated_at": "0001-01-01T00:00:00Z",
  "status": "enabled"
}
```

### Get Things

You can get all things in the database by querying `/things` endpoint.

```bash
curl -sSiX GET http://localhost/things -H "Authorization: Bearer <user_token>"
```

For example:

```bash
curl -sSiX GET http://localhost/things -H "Authorization: Bearer <user_token>"

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
      "name": "Humidity Sensor",
      "owner": "94939159-d129-4f17-9e4e-cc2d615539d7",
      "credentials": { "secret": "6d11a91f-0bd8-41aa-8e1b-4c6338329c9c" },
      "created_at": "2023-06-14T12:04:12.740098Z",
      "updated_at": "0001-01-01T00:00:00Z",
      "status": "enabled"
    },
    {
      "id": "04b0b2d1-fdaf-4b66-96a0-740a3151db4c",
      "name": "UV Sensor",
      "owner": "94939159-d129-4f17-9e4e-cc2d615539d7",
      "credentials": { "secret": "a1e5d77f-8903-4cef-87b1-d793a3c28de3" },
      "created_at": "2023-06-14T12:04:56.245743Z",
      "updated_at": "0001-01-01T00:00:00Z",
      "status": "enabled"
    },
    {
      "id": "48101ecd-1535-40c6-9ed8-5b1d21e371bb",
      "name": "Temperature Sensor",
      "owner": "94939159-d129-4f17-9e4e-cc2d615539d7",
      "credentials": { "secret": "c3f8c096-c60f-4375-8494-bca20a12fca7" },
      "created_at": "2023-06-15T09:04:04.292602Z",
      "updated_at": "0001-01-01T00:00:00Z",
      "status": "enabled"
    },
    {
      "id": "2766ae94-9a08-4418-82ce-3b91cf2ccd3e",
      "name": "Temperature Sensor",
      "owner": "94939159-d129-4f17-9e4e-cc2d615539d7",
      "credentials": { "secret": "65ca03bd-eb6b-420b-9d5d-46d459d4f71c" },
      "created_at": "2023-06-15T09:05:06.53817Z",
      "updated_at": "0001-01-01T00:00:00Z",
      "status": "enabled"
    },
    {
      "id": "19f59b2d-1e9c-43db-bc84-5432bd52a83f",
      "name": "Motion Sensor",
      "owner": "94939159-d129-4f17-9e4e-cc2d615539d7",
      "credentials": { "secret": "941c380a-3a41-40e9-8b79-3087daa4f3a6" },
      "created_at": "2023-06-15T09:05:45.719182Z",
      "updated_at": "0001-01-01T00:00:00Z",
      "status": "enabled"
    },
    {
      "id": "3709f2b0-9c73-413f-992e-7f6f9b396b0d",
      "name": "Light Sensor",
      "owner": "94939159-d129-4f17-9e4e-cc2d615539d7",
      "credentials": { "secret": "798ee6be-311b-4640-99e4-0ccb19e0dcb9" },
      "created_at": "2023-06-15T09:05:45.719186Z",
      "updated_at": "0001-01-01T00:00:00Z",
      "status": "enabled"
    },
    {
      "id": "eb2670ba-a2be-4ea4-83cb-111111111111",
      "name": "Motion Sensor",
      "owner": "94939159-d129-4f17-9e4e-cc2d615539d7",
      "credentials": { "secret": "325cda17-3a52-465d-89a7-2b63c7d0e3a6" },
      "created_at": "2023-06-15T09:06:17.967825Z",
      "updated_at": "0001-01-01T00:00:00Z",
      "status": "enabled"
    },
    {
      "id": "eb2670ba-a2be-4ea4-83cb-111111111112",
      "name": "Light Sensor",
      "owner": "94939159-d129-4f17-9e4e-cc2d615539d7",
      "credentials": { "secret": "67b6cbb8-4a9e-4d32-8b9c-d7cd3352aa2b" },
      "created_at": "2023-06-15T09:06:17.967828Z",
      "updated_at": "0001-01-01T00:00:00Z",
      "status": "enabled"
    }
  ]
}
```

If you want to paginate your results then use `offset`, `limit`, `metadata`, `name`, `status`, `tags` and `visibility` as query parameters.

```bash
curl -sSiX GET http://localhost/things?[offset=<offset>]&[limit=<limit>]&name=[name]&[status=<status>] -H "Authorization: Bearer <user_token>"
```

For example:

```bash
curl -sSiX GET http://localhost/things?offset=1&limit=5&name=Light Sensor -H "Authorization: Bearer <user_token>"

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
      "name": "Light Sensor",
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

```bash
curl -sSiX PATCH http://localhost/things/<thing_id> -H "Content-Type: application/json" -H "Authorization: Bearer <user_token>" -d @- << EOF
{
  "name":"[thing_name]",
  "metadata": {
      "[key1]": "[value1]",
      "[key2]": "[value2]"
  }
}
EOF
```

For example:

```bash
curl -sSiX PATCH http://localhost/things/48101ecd-1535-40c6-9ed8-5b1d21e371bb -H "Content-Type: application/json" -H "Authorization: Bearer <user_token>" -d @- << EOF
{
  "name":"Pressure Sensor"
}
EOF

HTTP/1.1 200 OK
Server: nginx/1.23.3
Date: Thu, 15 Jun 2023 09:09:12 GMT
Content-Type: application/json
Content-Length: 332
Connection: keep-alive
Access-Control-Expose-Headers: Location

{
  "id": "48101ecd-1535-40c6-9ed8-5b1d21e371bb",
  "name": "Pressure Sensor",
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

```bash
curl -sSiX PATCH http://localhost/things/<thing_id>/tags -H "Content-Type: application/json" -H "Authorization: Bearer <user_token>" -d @- << EOF
{
  "tags": ["tag_1", ..., "tag_N"]
}
EOF
```

For example:

```bash
curl -sSiX PATCH http://localhost/things/48101ecd-1535-40c6-9ed8-5b1d21e371bb/tags -H "Content-Type: application/json" -H "Authorization: Bearer <user_token>" -d @- << EOF
{
  "tags": ["sensor", "smart"]
}
EOF

HTTP/1.1 200 OK
Server: nginx/1.23.3
Date: Thu, 15 Jun 2023 09:09:44 GMT
Content-Type: application/json
Content-Length: 347
Connection: keep-alive
Access-Control-Expose-Headers: Location

{
  "id": "48101ecd-1535-40c6-9ed8-5b1d21e371bb",
  "name": "Pressure Sensor",
  "tags": ["sensor", "smart"],
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

```bash
curl -sSiX PATCH http://localhost/things/<thing_id>/owner -H "Content-Type: application/json" -H "Authorization: Bearer <user_token>" -d @- << EOF
{
  "owner": "[owner_id]"
}
EOF
```

For example:

```bash
curl -sSiX PATCH http://localhost/things/48101ecd-1535-40c6-9ed8-5b1d21e371bb/owner -H "Content-Type: application/json" -H "Authorization: Bearer <user_token>" -d @- << EOF
{
  "owner": "f7c55a1f-dde8-4880-9796-b3a0cd05745b"
}
EOF

HTTP/1.1 200 OK
Server: nginx/1.23.3
Date: Thu, 15 Jun 2023 09:09:44 GMT
Content-Type: application/json
Content-Length: 347
Connection: keep-alive
Access-Control-Expose-Headers: Location

{
  "id": "48101ecd-1535-40c6-9ed8-5b1d21e371bb",
  "name": "Pressure Sensor",
  "tags": ["sensor", "smart"],
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

```bash
curl -sSiX PATCH http://localhost/things/<thing_id>/secret -H "Content-Type: application/json" -H "Authorization: Bearer <user_token>" -d @- << EOF
{
  "secret": "<thing_secret>"
}
EOF
```

For example:

```bash
curl -sSiX PATCH http://localhost/things/48101ecd-1535-40c6-9ed8-5b1d21e371bb/secret -H "Content-Type: application/json" -H "Authorization: Bearer <user_token>" -d @- << EOF
{
  "secret": "94939159-9a08-4f17-9e4e-3b91cf2ccd3e"
}
EOF

HTTP/1.1 200 OK
Server: nginx/1.23.3
Date: Thu, 15 Jun 2023 09:10:52 GMT
Content-Type: application/json
Content-Length: 321
Connection: keep-alive
Access-Control-Expose-Headers: Location

{
  "id": "48101ecd-1535-40c6-9ed8-5b1d21e371bb",
  "name": "Pressure Sensor",
  "tags": ["sensor", "smart"],
  "owner": "94939159-d129-4f17-9e4e-cc2d615539d7",
  "credentials": { "secret": "94939159-9a08-4f17-9e4e-3b91cf2ccd3e" },
  "created_at": "2023-06-15T09:04:04.292602Z",
  "updated_at": "2023-06-15T09:10:52.051497Z",
  "updated_by": "94939159-d129-4f17-9e4e-cc2d615539d7",
  "status": "enabled"
}
```

### Enable Thing

To enable a thing you need a `thing_id` and a `user_token`

```bash
curl -sSiX POST http://localhost/things/<thing_id>/enable -H "Content-Type: application/json" -H  "Authorization: Bearer <user_token>"
```

For example:

```bash
curl -sSiX POST http://localhost/things/48101ecd-1535-40c6-9ed8-5b1d21e371bb/enable -H "Content-Type: application/json" -H  "Authorization: Bearer <user_token>"

HTTP/1.1 200 OK
Server: nginx/1.23.3
Date: Thu, 15 Jun 2023 09:11:43 GMT
Content-Type: application/json
Content-Length: 321
Connection: keep-alive
Access-Control-Expose-Headers: Location

{
  "id": "48101ecd-1535-40c6-9ed8-5b1d21e371bb",
  "name": "Pressure Sensor",
  "tags": ["sensor", "smart"],
  "owner": "94939159-d129-4f17-9e4e-cc2d615539d7",
  "credentials": { "secret": "94939159-9a08-4f17-9e4e-3b91cf2ccd3e" },
  "created_at": "2023-06-15T09:04:04.292602Z",
  "updated_at": "2023-06-15T09:10:52.051497Z",
  "updated_by": "94939159-d129-4f17-9e4e-cc2d615539d7",
  "status": "enabled"
}
```

### Disable Thing

To disable a thing you need a `thing_id` and a `user_token`

```bash
curl -sSiX POST http://localhost/things/<thing_id>/disable  -H "Content-Type: application/json" -H  "Authorization: Bearer <user_token>"
```

For example:

```bash
curl -sSiX POST http://localhost/things/48101ecd-1535-40c6-9ed8-5b1d21e371bb/disable  -H "Content-Type: application/json" -H  "Authorization: Bearer <user_token>"

HTTP/1.1 200 OK
Server: nginx/1.23.3
Date: Thu, 15 Jun 2023 09:11:38 GMT
Content-Type: application/json
Content-Length: 322
Connection: keep-alive
Access-Control-Expose-Headers: Location

{
  "id": "48101ecd-1535-40c6-9ed8-5b1d21e371bb",
  "name": "Pressure Sensor",
  "tags": ["sensor", "smart"],
  "owner": "94939159-d129-4f17-9e4e-cc2d615539d7",
  "credentials": { "secret": "94939159-9a08-4f17-9e4e-3b91cf2ccd3e" },
  "created_at": "2023-06-15T09:04:04.292602Z",
  "updated_at": "2023-06-15T09:10:52.051497Z",
  "updated_by": "94939159-d129-4f17-9e4e-cc2d615539d7",
  "status": "disabled"
}
```

## Channels

### Create Channel

To create a channel, you need a `user_token`

```bash
curl -sSiX POST http://localhost/channels -H "Content-Type: application/json" -H "Authorization: Bearer <user_token>" -d @- << EOF
{
  "id": "[channel_id]",
  "name":"[channel_name]",
  "description":"[channel_description]",
  "owner_id": "[owner_id]",
  "metadata": {
      "[key1]": "[value1]",
      "[key2]": "[value2]"
  },
  "status": "[enabled|disabled]"
}
EOF
```

For example:

```bash
curl -sSiX POST http://localhost/channels -H "Content-Type: application/json" -H "Authorization: Bearer <user_token>" -d @- << EOF
{
  "name": "Temperature Data"
}
EOF

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
  "name": "Temperature Data",
  "created_at": "2023-06-15T09:12:51.162431Z",
  "updated_at": "0001-01-01T00:00:00Z",
  "status": "enabled"
}
```

### Create Channel with external ID

Channel is a group of things that could represent a special category in existing systems, e.g. a building level channel could represent the level of a smarting building system. For helping to keep the reference, it is possible to set an existing ID while creating the Mainflux channel. There are two limitations - the existing ID has to be in UUID V4 format and it has to be unique in the Mainflux domain.

To create a channel with external ID, the user needs to provide a UUID v4 format unique ID, and a `user_token`

For example:

```bash
curl -sSiX POST http://localhost/channels -H "Content-Type: application/json" -H "Authorization: Bearer <user_token>" -d @- << EOF
{
  "id": "48101ecd-1535-40c6-9ed8-5b1d21e371bb",
  "name": "Humidity Data"
}
EOF

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
  "name": "Humidity Data",
  "created_at": "2023-06-15T09:15:11.477695Z",
  "updated_at": "0001-01-01T00:00:00Z",
  "status": "enabled"
}
```

### Create Channels

The same as creating a channel with external ID the user can create multiple channels at once by providing UUID v4 format unique ID in a series of channels together with a `user_token`

```bash
curl -sSiX POST http://localhost/channels/bulk -H "Content-Type: application/json" -H "Authorization: Bearer <user_token>" -d @- << EOF
[
  {
    "id": "[channel_id]",
    "name":"[channel_name]",
    "description":"[channel_description]",
    "owner_id": "[owner_id]",
    "metadata": {
        "[key1]": "[value1]",
        "[key2]": "[value2]"
    },
    "status": "[enabled|disabled]"
  },
  {
    "id": "[channel_id]",
    "name":"[channel_name]",
    "description":"[channel_description]",
    "owner_id": "[owner_id]",
    "metadata": {
        "[key1]": "[value1]",
        "[key2]": "[value2]"
    },
    "status": "[enabled|disabled]"
  }
]
EOF
```

For example:

```bash
curl -sSiX POST http://localhost/channels/bulk -H "Content-Type: application/json" -H "Authorization: Bearer <user_token>" -d @- << EOF
[
  {
    "name":"Light Data"
  },
  {
    "name":"Pressure Data"
  }
]
EOF

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
      "name": "Light Data",
      "created_at": "2023-06-15T09:15:44.154283Z",
      "updated_at": "0001-01-01T00:00:00Z",
      "status": "enabled"
    },
    {
      "id": "fc9bf029-b1d3-4408-8d53-fc576247a4b3",
      "owner_id": "94939159-d129-4f17-9e4e-cc2d615539d7",
      "name": "Pressure Data",
      "created_at": "2023-06-15T09:15:44.15721Z",
      "updated_at": "0001-01-01T00:00:00Z",
      "status": "enabled"
    }
  ]
}
```

### Create Channels with external ID

As with things, you can create multiple channels with external ID at once

For example:

```bash
curl -sSiX POST http://localhost/channels/bulk -H "Content-Type: application/json" -H "Authorization: Bearer <user_token>" -d @- << EOF
[
  {
    "id": "977bbd33-5b59-4b7a-a9c3-111111111111",
    "name":"Light Data"
  },
  {
    "id": "977bbd33-5b59-4b7a-a9c3-111111111112",
    "name":"Pressure Data"
  }
]
EOF

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
      "name": "Light Data",
      "created_at": "2023-06-15T09:16:16.931016Z",
      "updated_at": "0001-01-01T00:00:00Z",
      "status": "enabled"
    },
    {
      "id": "977bbd33-5b59-4b7a-a9c3-111111111112",
      "owner_id": "94939159-d129-4f17-9e4e-cc2d615539d7",
      "name": "Pressure Data",
      "created_at": "2023-06-15T09:16:16.934486Z",
      "updated_at": "0001-01-01T00:00:00Z",
      "status": "enabled"
    }
  ]
}
```

### Get Channel

Get a channel entity for a logged-in user

```bash
curl -sSiX GET http://localhost/channels/<channel_id> -H "Authorization: Bearer <user_token>"
```

For example:

```bash
curl -sSiX GET http://localhost/channels/aecf0902-816d-4e38-a5b3-a1ad9a7cf9e8 -H "Authorization: Bearer <user_token>"

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
  "name": "Temperature Data",
  "created_at": "2023-06-15T09:12:51.162431Z",
  "updated_at": "0001-01-01T00:00:00Z",
  "status": "enabled"
}
```

### Get Channels

You can get all channels for a logged-in user.

If you want to paginate your results then use `offset`, `limit`, `metadata`, `name`, `status`, `parentID`, `ownerID`, `tree` and `dir` as query parameters.

```bash
curl -sSiX GET http://localhost/channels -H "Authorization: Bearer <user_token>"
```

For example:

```bash
curl -sSiX GET http://localhost/channels -H "Authorization: Bearer <user_token>"

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
      "name": "Tokyo",
      "created_at": "2023-06-14T12:10:07.950311Z",
      "updated_at": "0001-01-01T00:00:00Z",
      "status": "enabled"
    },
    {
      "id": "48101ecd-1535-40c6-9ed8-5b1d21e371bb",
      "owner_id": "94939159-d129-4f17-9e4e-cc2d615539d7",
      "name": "Humidity Data",
      "created_at": "2023-06-15T09:15:11.477695Z",
      "updated_at": "0001-01-01T00:00:00Z",
      "status": "enabled"
    },
    {
      "id": "977bbd33-5b59-4b7a-a9c3-111111111111",
      "owner_id": "94939159-d129-4f17-9e4e-cc2d615539d7",
      "name": "Light Data",
      "created_at": "2023-06-15T09:16:16.931016Z",
      "updated_at": "0001-01-01T00:00:00Z",
      "status": "enabled"
    },
    {
      "id": "977bbd33-5b59-4b7a-a9c3-111111111112",
      "owner_id": "94939159-d129-4f17-9e4e-cc2d615539d7",
      "name": "Pressure Data",
      "created_at": "2023-06-15T09:16:16.934486Z",
      "updated_at": "0001-01-01T00:00:00Z",
      "status": "enabled"
    },
    {
      "id": "aecf0902-816d-4e38-a5b3-a1ad9a7cf9e8",
      "owner_id": "94939159-d129-4f17-9e4e-cc2d615539d7",
      "name": "Temperature Data",
      "created_at": "2023-06-15T09:12:51.162431Z",
      "updated_at": "0001-01-01T00:00:00Z",
      "status": "enabled"
    },
    {
      "id": "b3867a52-675d-4f05-8cd0-df5a08a63ff3",
      "owner_id": "94939159-d129-4f17-9e4e-cc2d615539d7",
      "name": "London",
      "created_at": "2023-06-14T12:09:34.205894Z",
      "updated_at": "0001-01-01T00:00:00Z",
      "status": "enabled"
    },
    {
      "id": "cb81bbff-850d-471f-bd74-c15d6e1a6c4e",
      "owner_id": "94939159-d129-4f17-9e4e-cc2d615539d7",
      "name": "Light Data",
      "created_at": "2023-06-15T09:15:44.154283Z",
      "updated_at": "0001-01-01T00:00:00Z",
      "status": "enabled"
    },
    {
      "id": "fc9bf029-b1d3-4408-8d53-fc576247a4b3",
      "owner_id": "94939159-d129-4f17-9e4e-cc2d615539d7",
      "name": "Pressure Data",
      "created_at": "2023-06-15T09:15:44.15721Z",
      "updated_at": "0001-01-01T00:00:00Z",
      "status": "enabled"
    }
  ]
}
```

### Update Channel

Update channel name and/or metadata.

```bash
curl -sSiX PUT http://localhost/channels/<channel_id> -H "Content-Type: application/json" -H "Authorization: Bearer <user_token>" -d @- << EOF
{
  "name":"[channel_name]",
  "description":"[channel_description]",
  "metadata": {
      "[key1]": "[value1]",
      "[key2]": "[value2]"
  }
}
EOF
```

For example:

```bash
curl -sSiX PUT http://localhost/channels/aecf0902-816d-4e38-a5b3-a1ad9a7cf9e8 -H "Content-Type: application/json" -H "Authorization: Bearer <user_token>" -d @- << EOF
{
  "name":"Jane Doe",
  "metadata": {
      "location": "london"
  }
}
EOF

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
  "name": "Jane Doe",
  "metadata": { "location": "london" },
  "created_at": "2023-06-15T09:12:51.162431Z",
  "updated_at": "2023-06-15T09:18:26.886913Z",
  "updated_by": "94939159-d129-4f17-9e4e-cc2d615539d7",
  "status": "enabled"
}
```

### Enable Channel

To enable a channel you need a `channel_id` and a `user_token`

```bash
curl -sSiX POST http://localhost/channels/<channel_id>/enable -H "Content-Type: application/json" -H  "Authorization: Bearer <user_token>"
```

For example:

```bash
curl -sSiX POST http://localhost/channels/aecf0902-816d-4e38-a5b3-a1ad9a7cf9e8/enable -H "Content-Type: application/json" -H  "Authorization: Bearer <user_token>"

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
  "name": "Jane Doe",
  "metadata": { "location": "london" },
  "created_at": "2023-06-15T09:12:51.162431Z",
  "updated_at": "2023-06-15T09:18:26.886913Z",
  "updated_by": "94939159-d129-4f17-9e4e-cc2d615539d7",
  "status": "enabled"
}
```

### Disable Channel

To disable a channel you need a `channel_id` and a `user_token`

```bash
curl -sSiX POST http://localhost/channels/<channel_id>/disable -H "Content-Type: application/json" -H  "Authorization: Bearer <user_token>"
```

For example:

```bash
curl -sSiX POST http://localhost/channels/aecf0902-816d-4e38-a5b3-a1ad9a7cf9e8/disable -H "Content-Type: application/json" -H  "Authorization: Bearer <user_token>"

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
  "name": "Jane Doe",
  "metadata": { "location": "london" },
  "created_at": "2023-06-15T09:12:51.162431Z",
  "updated_at": "2023-06-15T09:18:26.886913Z",
  "updated_by": "94939159-d129-4f17-9e4e-cc2d615539d7",
  "status": "disabled"
}
```

### Connect

Connect things to channels

> `actions` is optional, if not provided, the default action is `m_read` and `m_write`.

```bash
curl -sSiX POST http://localhost/connect -H "Content-Type: application/json" -H "Authorization: Bearer <user_token>" -d @- << EOF
{
  "subjects": ["<thing_id>"],
  "objects": ["<channel_id>"],
  "actions": ["[action]"]
}
EOF
```

For example:

```bash
curl -sSiX POST http://localhost/connect -H "Content-Type: application/json" -H "Authorization: Bearer <user_token>" -d @- << EOF
{
  "subjects": ["48101ecd-1535-40c6-9ed8-5b1d21e371bb"],
  "objects": ["aecf0902-816d-4e38-a5b3-a1ad9a7cf9e8"]
}
EOF

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

> `actions` is optional, if not provided, the default actions are `m_read` and `m_write`.

```bash
curl -sSiX POST http://localhost/things/policies -H "Content-Type: application/json" -H "Authorization: Bearer <user_token>" -d @- << EOF
{
  "subject": "<thing_id>",
  "object": "<channel_id>",
  "actions": ["<action>", "[action]"]]
}
EOF
```

For example:

```bash
curl -sSiX POST http://localhost/things/policies -H "Content-Type: application/json" -H "Authorization: Bearer <user_token>" -d @- << EOF
{
  "subject": "48101ecd-1535-40c6-9ed8-5b1d21e371bb",
  "object": "aecf0902-816d-4e38-a5b3-a1ad9a7cf9e8"
}
EOF

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

```bash
curl -sSiX POST http://localhost/disconnect -H "Content-Type: application/json" -H "Authorization: Bearer <user_token>" -d @- << EOF
{
  "subjects": ["<thing_id_1>", "[thing_id_2]"],
  "objects": ["<channel_id_1>", "[channel_id_2]"]
}
EOF
```

For example:

```bash
curl -sSiX POST http://localhost/disconnect -H "Content-Type: application/json" -H "Authorization: Bearer <user_token>" -d @- << EOF
{
  "subjects": ["48101ecd-1535-40c6-9ed8-5b1d21e371bb"],
  "objects": ["aecf0902-816d-4e38-a5b3-a1ad9a7cf9e8"]
}
EOF

HTTP/1.1 204 No Content
Server: nginx/1.23.3
Date: Thu, 15 Jun 2023 09:23:07 GMT
Content-Type: application/json
Connection: keep-alive
Access-Control-Expose-Headers: Location
```

Disconnect thing from the channel

```bash
curl -sSiX DELETE http://localhost/things/policies/<subject_id>/<object_id> -H "Content-Type: application/json" -H "Authorization: Bearer <user_token>"
```

For example:

```bash
curl -sSiX DELETE http://localhost/things/policies/48101ecd-1535-40c6-9ed8-5b1d21e371bb/aecf0902-816d-4e38-a5b3-a1ad9a7cf9e8 -H "Content-Type: application/json" -H "Authorization: Bearer <user_token>"

HTTP/1.1 204 No Content
Server: nginx/1.23.3
Date: Thu, 15 Jun 2023 09:25:23 GMT
Content-Type: application/json
Connection: keep-alive
Access-Control-Expose-Headers: Location
```

### Access by Key

Checks if thing has access to a channel

```bash
curl -sSiX POST http://localhost/channels/<channel_id>/access -H "Content-Type: application/json" -H "Authorization: Bearer <user_token>" -d @- << EOF
{
  "subject": "<thing_secret>",
  "action": "m_read" | "m_write",
  "entity_type": "thing"
}
EOF
```

For example:

```bash
curl -sSiX POST http://localhost/channels/aecf0902-816d-4e38-a5b3-a1ad9a7cf9e8/access -H "Content-Type: application/json" -H "Authorization: Bearer <user_token>" -d @- << EOF
{
  "subject": "48101ecd-1535-40c6-9ed8-5b1d21e371bb",
  "action": "m_read",
  "entity_type": "thing"
}
EOF

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

```bash
curl -sSiX POST http://localhost/identify -H "Content-Type: application/json" -H "Authorization: Thing <thing_secret>"
```

For example:

```bash
curl -sSiX POST http://localhost/identify -H "Content-Type: application/json" -H "Authorization: Thing 6d11a91f-0bd8-41aa-8e1b-4c6338329c9c"

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

```bash
curl -sSiX POST http://localhost/http/channels/<channel_id>/messages -H "Content-Type: application/senml+json" -H "Authorization: Thing <thing_secret>" -d @- << EOF
[
  {
    "bn": "<base_name>",
    "bt": "[base_time]",
    "bu": "[base_unit]",
    "bver": [base_version],
    "n": "<measurement_name>",
    "u": "<measurement_unit>",
    "v": <measurement_value>,
  },
  {
    "n": "[measurement_name]",
    "t": <measurement_time>,
    "v": <measurement_value>,
  }
]
EOF
```

For example:

```bash
curl -sSiX POST http://localhost/http/channels/aecf0902-816d-4e38-a5b3-a1ad9a7cf9e8/messages -H "Content-Type: application/senml+json" -H "Authorization: Thing a83b9afb-9022-4f9e-ba3d-4354a08c273a" -d @- << EOF
[
  {
    "bn": "some-base-name:",
    "bt": 1.276020076001e+09,
    "bu": "A",
    "bver": 5,
    "n": "voltage",
    "u": "V",
    "v": 120.1
  },
  {
    "n": "current",
    "t": -5,
    "v": 1.2
  },
  {
    "n": "current",
    "t": -4,
    "v": 1.3
  }
]
EOF
HTTP/1.1 202 Accepted
Server: nginx/1.23.3
Date: Thu, 15 Jun 2023 09:40:44 GMT
Content-Length: 0
Connection: keep-alive
```

### Read Messages

Reads messages from database for a given channel

```bash
curl -sSiX GET http://localhost:<service_port>/channels/<channel_id>/messages?[offset=<offset>]&[limit=<limit>] -H "Authorization: Thing <thing_secret>"
```

For example:

```bash
curl -sSiX GET http://localhost:9009/channels/aecf0902-816d-4e38-a5b3-a1ad9a7cf9e8/messages -H "Authorization: Thing a83b9afb-9022-4f9e-ba3d-4354a08c273a"

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

```bash
curl -sSiX POST http://localhost/groups -H "Content-Type: application/json" -H "Authorization: Bearer <user_token>" -d @- << EOF
{
  "name":"<group_name>",
  "description":"[group_description]",
  "parent_id": "[parent_id]",
  "owner_id": "[owner_id]",
  "metadata": {
      "[key1]": "[value1]",
      "[key2]": "[value2]"
  },
  "status": "[enabled|disabled]"
}
EOF
```

For example:

```bash
curl -sSiX POST http://localhost/groups -H "Content-Type: application/json" -H "Authorization: Bearer <user_token>" -d @- << EOF
{
  "name": "Security Engineers",
  "description": "This group would be responsible for securing the platform."
}
EOF

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
  "name": "Security Engineers",
  "description": "This group would be responsible for securing the platform.",
  "created_at": "2023-06-15T09:41:42.860481Z",
  "updated_at": "0001-01-01T00:00:00Z",
  "status": "enabled"
}
```

When you use `parent_id` make sure the parent is an already exisiting group

For example:

```bash
curl -sSiX POST http://localhost/groups -H "Content-Type: application/json" -H "Authorization: Bearer <user_token>" -d @- << EOF
{
  "name": "Customer Support",
  "description": "This group would be responsible for providing support to users of the platform.",
  "parent_id": "2766ae94-9a08-4418-82ce-3b91cf2ccd3e"
}
EOF

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
  "name": "Customer Support",
  "description": "This group would be responsible for providing support to users of the platform.",
  "created_at": "2023-06-15T09:42:34.063997Z",
  "updated_at": "0001-01-01T00:00:00Z",
  "status": "enabled"
}
```

### Get group

Get a group entity for a logged-in user

```bash
curl -sSiX GET http://localhost/groups/<group_id> -H "Content-Type: application/json" -H "Authorization: Bearer <user_token>"
```

For example:

```bash
curl -sSiX GET http://localhost/groups/2766ae94-9a08-4418-82ce-3b91cf2ccd3e -H "Content-Type: application/json" -H "Authorization: Bearer <user_token>"

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
  "name": "Security Engineers",
  "description": "This group would be responsible for securing the platform.",
  "created_at": "2023-06-15T09:41:42.860481Z",
  "updated_at": "0001-01-01T00:00:00Z",
  "status": "enabled"
}
```

### Get groups

You can get all groups for a logged-in user.

If you want to paginate your results then use `offset`, `limit`, `metadata`, `name`, `status`, `parentID`, `ownerID`, `tree` and `dir` as query parameters.

```bash
curl -sSiX GET http://localhost/groups -H "Content-Type: application/json" -H "Authorization: Bearer <user_token>"
```

For example:

```bash
curl -sSiX GET http://localhost/groups -H "Content-Type: application/json" -H "Authorization: Bearer <user_token>"

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
      "name": "Sensor Operators",
      "created_at": "2023-06-14T13:33:52.249784Z",
      "updated_at": "0001-01-01T00:00:00Z",
      "status": "enabled"
    },
    {
      "id": "2766ae94-9a08-4418-82ce-3b91cf2ccd3e",
      "owner_id": "94939159-d129-4f17-9e4e-cc2d615539d7",
      "name": "Security Engineers",
      "description": "This group would be responsible for securing the platform.",
      "created_at": "2023-06-15T09:41:42.860481Z",
      "updated_at": "0001-01-01T00:00:00Z",
      "status": "enabled"
    },
    {
      "id": "dd2dc8d4-f7cf-42f9-832b-81cae9a8e90a",
      "owner_id": "94939159-d129-4f17-9e4e-cc2d615539d7",
      "parent_id": "2766ae94-9a08-4418-82ce-3b91cf2ccd3e",
      "name": "Customer Support",
      "description": "This group would be responsible for providing support to users of the platform.",
      "created_at": "2023-06-15T09:42:34.063997Z",
      "updated_at": "0001-01-01T00:00:00Z",
      "status": "enabled"
    }
  ]
}
```

### Get Group Parents

You can get all groups that are parents of a group for a logged-in user.

If you want to paginate your results then use `offset`, `limit`, `metadata`, `name`, `status`, `parentID`, `ownerID`, `tree` and `dir` as query parameters.

```bash
curl -sSiX GET http://localhost/groups/<group_id>/parents -H "Content-Type: application/json" -H "Authorization: Bearer <user_token>"
```

For example:

```bash
curl -sSiX GET http://localhost/groups/dd2dc8d4-f7cf-42f9-832b-81cae9a8e90a/parents?tree=true -H "Content-Type: application/json" -H "Authorization: Bearer <user_token>"

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
      "name": "Security Engineers",
      "description": "This group would be responsible for securing the platform.",
      "level": -1,
      "children": [
        {
          "id": "dd2dc8d4-f7cf-42f9-832b-81cae9a8e90a",
          "owner_id": "94939159-d129-4f17-9e4e-cc2d615539d7",
          "parent_id": "2766ae94-9a08-4418-82ce-3b91cf2ccd3e",
          "name": "Customer Support",
          "description": "This group would be responsible for providing support to users of the platform.",
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

You can get all groups that are children of a group for a logged-in user.

If you want to paginate your results then use `offset`, `limit`, `metadata`, `name`, `status`, `parentID`, `ownerID`, `tree` and `dir` as query parameters.

```bash
curl -sSiX GET http://localhost/groups/<group_id>/children -H "Content-Type: application/json" -H "Authorization: Bearer <user_token>"
```

For example:

```bash
curl -sSiX GET http://localhost/groups/2766ae94-9a08-4418-82ce-3b91cf2ccd3e/children?tree=true -H "Content-Type: application/json" -H "Authorization: Bearer <user_token>"

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
      "name": "Security Engineers",
      "description": "This group would be responsible for securing the platform.",
      "path": "2766ae94-9a08-4418-82ce-3b91cf2ccd3e",
      "children": [
        {
          "id": "dd2dc8d4-f7cf-42f9-832b-81cae9a8e90a",
          "owner_id": "94939159-d129-4f17-9e4e-cc2d615539d7",
          "parent_id": "2766ae94-9a08-4418-82ce-3b91cf2ccd3e",
          "name": "Customer Support",
          "description": "This group would be responsible for providing support to users of the platform.",
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

```bash
curl -sSiX PUT http://localhost/groups/<group_id> -H "Content-Type: application/json" -H "Authorization: Bearer <user_token>" -d @- << EOF
{
  "name":"[group_name]",
  "description":"[group_description]",
  "metadata": {
      "[key1]": "[value1]",
      "[key2]": "[value2]"
  }
}
EOF
```

For example:

```bash
curl -sSiX PUT http://localhost/groups/2766ae94-9a08-4418-82ce-3b91cf2ccd3e  -H "Content-Type: application/json" -H "Authorization: Bearer <user_token>" -d @- << EOF
{
  "name":"Data Analysts",
  "description":"This group would be responsible for analyzing data collected from sensors.",
  "metadata": {
      "location": "london"
  }
}
EOF

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
  "name": "Data Analysts",
  "description": "This group would be responsible for analyzing data collected from sensors.",
  "metadata": { "location": "london" },
  "created_at": "2023-06-15T09:41:42.860481Z",
  "updated_at": "2023-06-15T10:17:56.475241Z",
  "updated_by": "94939159-d129-4f17-9e4e-cc2d615539d7",
  "status": "enabled"
}
```

### Disable group

Disable a group entity

```bash
curl -sSiX POST http://localhost/groups/<group_id>/disable -H "Content-Type: application/json" -H "Authorization: Bearer <user_token>"
```

For example:

```bash
curl -sSiX POST http://localhost/groups/2766ae94-9a08-4418-82ce-3b91cf2ccd3e/disable -H "Content-Type: application/json" -H "Authorization: Bearer <user_token>"

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
  "name": "Data Analysts",
  "description": "This group would be responsible for analyzing data collected from sensors.",
  "metadata": { "location": "london" },
  "created_at": "2023-06-15T09:41:42.860481Z",
  "updated_at": "2023-06-15T10:17:56.475241Z",
  "updated_by": "94939159-d129-4f17-9e4e-cc2d615539d7",
  "status": "disabled"
}
```

### Enable group

Enable a group entity

```bash
curl -sSiX POST http://localhost/groups/<group_id>/enable -H "Content-Type: application/json" -H "Authorization: Bearer <user_token>"
```

For example:

```bash
curl -sSiX POST http://localhost/groups/2766ae94-9a08-4418-82ce-3b91cf2ccd3e/enable -H "Content-Type: application/json" -H "Authorization: Bearer <user_token>"

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
  "name": "Data Analysts",
  "description": "This group would be responsible for analyzing data collected from sensors.",
  "metadata": { "location": "london" },
  "created_at": "2023-06-15T09:41:42.860481Z",
  "updated_at": "2023-06-15T10:17:56.475241Z",
  "updated_by": "94939159-d129-4f17-9e4e-cc2d615539d7",
  "status": "enabled"
}
```

### Assign

Assign user to a group

```bash
curl -sSiX POST http://localhost/users/policies -H "Content-Type: application/json" -H "Authorization: Bearer <user_token>" -d @- << EOF
{
  "subject": "<user_id>",
  "object": "<group_id>",
  "actions": ["<member_action>"]
}
EOF
```

For example:

```bash
curl -sSiX POST http://localhost/users/policies -H "Content-Type: application/json" -H "Authorization: Bearer <user_token>" -d @- << EOF
{
  "subject": "1890c034-7ef9-4cde-83df-d78ea1d4d281",
  "object": "2766ae94-9a08-4418-82ce-3b91cf2ccd3e",
  "actions": ["g_list", "c_list"]
}
EOF

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

If you want to paginate your results then use `offset`, `limit`, `metadata`, `name`, `status`, `identity`, and `tag` as query parameters.

> Must take into consideration the user identified by the `user_token` needs to be assigned to the same group identified by `group_id` with `g_list` action or be the owner of the group identified by `group_id`.

```bash
curl -sSiX GET http://localhost/groups/<group_id>/members -H "Content-Type: application/json" -H "Authorization: Bearer <user_token>"
```

For example:

```bash
curl -sSiX GET http://localhost/groups/2766ae94-9a08-4418-82ce-3b91cf2ccd3e/members -H "Content-Type: application/json" -H "Authorization: Bearer <user_token>"

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
      "name": "Jane Doe",
      "tags": ["male", "developer"],
      "credentials": { "identity": "updated.jane.doe@gmail.com" },
      "metadata": { "location": "london" },
      "created_at": "2023-06-14T13:46:47.322648Z",
      "updated_at": "2023-06-14T13:59:53.422595Z",
      "status": "enabled"
    }
  ]
}
```

### Unassign

Unassign user from group

```bash
curl -sSiX DELETE http://localhost/users/policies/<subject_id>/<object_id> -H "Content-Type: application/json" -H "Authorization: Bearer <user_token>"
```

For example:

```bash
curl -sSiX DELETE http://localhost/users/policies/1890c034-7ef9-4cde-83df-d78ea1d4d281/2766ae94-9a08-4418-82ce-3b91cf2ccd3e  -H "Content-Type: application/json" -H "Authorization: Bearer <user_token>"

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

```bash
curl -sSiX POST http://localhost/users/policies -H "Content-Type: application/json" -H "Authorization: Bearer <user_token>" -d @- << EOF
{
  "subject": "<user_id>",
  "object": "<group_id>",
  "actions": ["<actions>", "[actions]"]
}
EOF
```

```bash
curl -sSiX POST http://localhost/things/policies -H "Content-Type: application/json" -H "Authorization: Bearer <user_token>" -d @- << EOF
{
  "subject": "<thing_id>",
  "object": "<channel_id>",
  "actions": ["<actions>", "[actions]"]
}
EOF
```

```bash
curl -sSiX POST http://localhost/things/policies -H "Content-Type: application/json" -H "Authorization: Bearer <user_token>" -d @- << EOF
{
  "subject": "<user_id>",
  "object": "<channel_id>",
  "actions": ["<actions>", "[actions]"]
  "external": true
}
EOF
```

For example:

```bash
curl -sSiX POST http://localhost/users/policies -H "Content-Type: application/json" -H "Authorization: Bearer <user_token>" -d @- << EOF
{
  "subject": "1890c034-7ef9-4cde-83df-d78ea1d4d281",
  "object": "2766ae94-9a08-4418-82ce-3b91cf2ccd3e",
  "actions": ["g_add", "c_list"]
}
EOF

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

```bash
curl -sSiX PUT http://localhost/users/policies -H "Content-Type: application/json" -H "Authorization: Bearer <user_token>" -d @- << EOF
{
  "subject": "<user_id>",
  "object": "<group_id>",
  "actions": ["<actions>", "[actions]"]
}
EOF
```

```bash
curl -sSiX PUT http://localhost/things/policies -H "Content-Type: application/json" -H "Authorization: Bearer <user_token>" -d @- << EOF
{
  "subject": "<thing_id> | <user_id>",
  "object": "<channel_id>",
  "actions": ["<actions>", "[actions]"]
}
EOF
```

For example:

```bash
curl -sSiX PUT http://localhost/users/policies -H "Content-Type: application/json" -H "Authorization: Bearer <user_token>" -d @- << EOF
{
  "subject": "1890c034-7ef9-4cde-83df-d78ea1d4d281",
  "object": "2766ae94-9a08-4418-82ce-3b91cf2ccd3e",
  "actions": ["g_list", "c_list"]
}
EOF

HTTP/1.1 204 No Content
Server: nginx/1.23.3
Date: Thu, 15 Jun 2023 11:27:19 GMT
Content-Type: application/json
Connection: keep-alive
Access-Control-Expose-Headers: Location
```

### Delete policies

Only policies defined on [Predefined Policies section][predefined-policies] are allowed.

```bash
curl -sSiX DELETE http://localhost/users/policies/<user_id>/<channel_id> -H "Content-Type: application/json" -H "Authorization: Bearer <user_token>"
```

```bash
curl -sSiX DELETE http://localhost/things/policies/<thing_id>/<channel_id> -H "Content-Type: application/json" -H "Authorization: Bearer <user_token>"
```

For example:

```bash
curl -sSiX DELETE http://localhost/users/policies/1890c034-7ef9-4cde-83df-d78ea1d4d281/2766ae94-9a08-4418-82ce-3b91cf2ccd3e -H "Content-Type: application/json" -H "Authorization: Bearer <user_token>"

HTTP/1.1 204 No Content
Server: nginx/1.23.3
Date: Thu, 15 Jun 2023 11:28:31 GMT
Content-Type: application/json
Connection: keep-alive
Access-Control-Expose-Headers: Location
```

[api]: https://api.mainflux.io
[predefined-policies]: /authorization/#summary-of-defined-policies
