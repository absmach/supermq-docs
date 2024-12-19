---
title: CLI
---


SuperMQ CLI makes it easy to manage users, things, channels and messages.

CLI can be downloaded as separate asset from [project realeses][releases] or it can be built with `GNU Make` tool:

Get the SuperMQ code

```bash
go get github.com/absmach/supermq
```

Build the supermq-cli

```bash
make cli
```

which will build `supermq-cli` in `<project_root>/build` folder.

Executing `build/supermq-cli` without any arguments will output help with all available commands and flags:

```bash
Usage:
  supermq-cli [command]

Available Commands:
  bootstrap    Bootstrap management
  certs        Certificates management
  channels     Channels management
  completion   Generate the autocompletion script for the specified shell
  config       CLI local config
  domains      Domains management
  groups       Groups management
  health       Health Check
  help         Help about any command
  invitations  Invitations management
  messages     Send or read messages
  provision    Provision things and channels from a config file
  subscription Subscription management
  things       Things management
  users        Users management

Flags:
  -b, --bootstrap-url string     Bootstrap service URL (default "http://localhost:9013")
  -s, --certs-url string         Certs service URL (default "http://localhost:9019")
  -c, --config string            Config path
  -C, --contact string           Subscription contact query parameter
  -y, --content-type string      Message content type (default "application/senml+json")
  -d, --domains-url string       Domains service URL (default "http://localhost:8189")
  -h, --help                     help for supermq-cli
  -H, --host-url string          Host URL (default "http://localhost")
  -p, --http-url string          HTTP adapter URL (default "http://localhost/http")
  -I, --identity string          User identity query parameter
  -i, --insecure                 Do not check for TLS cert
  -v, --invitations-url string   Inivitations URL (default "http://localhost:9020")
  -l, --limit uint               Limit query parameter (default 10)
  -m, --metadata string          Metadata query parameter
  -n, --name string              Name query parameter
  -o, --offset uint              Offset query parameter
  -r, --raw                      Enables raw output mode for easier parsing of output
  -R, --reader-url string        Reader URL (default "http://localhost")
  -z, --state string             Bootstrap state query parameter
  -S, --status string            User status query parameter
  -t, --things-url string        Things service URL (default "http://localhost:9000")
  -T, --topic string             Subscription topic query parameter
  -u, --users-url string         Users service URL (default "http://localhost:9002")

Use "supermq-cli [command] --help" for more information about a command.
```

It is also possible to use the docker image `supermq/cli` to execute CLI command:

```bash
docker run -it --rm supermq/cli -u http://<IP_SERVER> [command]
```

For example:

```bash
docker run -it --rm supermq/cli -u http://192.168.160.1 users token admin@example.com 12345678

{
  "access_token": "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2ODA2MjEzMDcsImlhdCI6MTY4MDYyMDQwNywiaWRlbnRpdHkiOiJhZG1pbkBleGFtcGxlLmNvbSIsImlzcyI6ImNsaWVudHMuYXV0aCIsInN1YiI6ImYxZTA5Y2YxLTgzY2UtNDE4ZS1iZDBmLWU3M2I3M2MxNDM2NSIsInR5cGUiOiJhY2Nlc3MifQ.iKdBv3Ko7PKuhjTC6Xs-DvqfKScjKted3ZMorTwpXCd4QrRSsz6NK_lARG6LjpE0JkymaCMVMZlzykyQ6ZgwpA",
  "access_type": "Bearer",
  "refresh_token": "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2ODA3MDY4MDcsImlhdCI6MTY4MDYyMDQwNywiaWRlbnRpdHkiOiJhZG1pbkBleGFtcGxlLmNvbSIsImlzcyI6ImNsaWVudHMuYXV0aCIsInN1YiI6ImYxZTA5Y2YxLTgzY2UtNDE4ZS1iZDBmLWU3M2I3M2MxNDM2NSIsInR5cGUiOiJyZWZyZXNoIn0.-0tOtXFZi48VS-FxkCnVxnW2RUkJvqUmzRz3_EYSSKFyKealoFrv7sZIUvrdvKomnUFzXshP0EygL8vjWP1SFw"
}
```

You can execute each command with `-h` flag for more information about that command, e.g.

```bash
supermq-cli channels -h
```

Response should look like this:

```bash
Channels management: create, get, update or delete Channel and get list of Things connected or not connected to a Channel

Usage:
  supermq-cli channels [command]

Available Commands:
  assign      Assign users or groups to a channel
  connections Connections list
  create      Create channel
  delete      Delete channel
  disable     Change channel status to disabled
  enable      Change channel status to enabled
  get         Get channel
  groups      List groups
  unassign    Unassign users or groups from a channel
  update      Update channel
  users       List users

Flags:
  -h, --help   help for channels

Global Flags:
  -b, --bootstrap-url string     Bootstrap service URL (default "http://localhost:9013")
  -s, --certs-url string         Certs service URL (default "http://localhost:9019")
  -c, --config string            Config path
  -C, --contact string           Subscription contact query parameter
  -y, --content-type string      Message content type (default "application/senml+json")
  -d, --domains-url string       Domains service URL (default "http://localhost:8189")
  -H, --host-url string          Host URL (default "http://localhost")
  -p, --http-url string          HTTP adapter URL (default "http://localhost/http")
  -I, --identity string          User identity query parameter
  -i, --insecure                 Do not check for TLS cert
  -v, --invitations-url string   Inivitations URL (default "http://localhost:9020")
  -l, --limit uint               Limit query parameter (default 10)
  -m, --metadata string          Metadata query parameter
  -n, --name string              Name query parameter
  -o, --offset uint              Offset query parameter
  -r, --raw                      Enables raw output mode for easier parsing of output
  -R, --reader-url string        Reader URL (default "http://localhost")
  -z, --state string             Bootstrap state query parameter
  -S, --status string            User status query parameter
  -t, --things-url string        Things service URL (default "http://localhost:9000")
  -T, --topic string             Subscription topic query parameter
  -u, --users-url string         Users service URL (default "http://localhost:9002")

Use "supermq-cli channels [command] --help" for more information about a command.
```

## Service

### Get SuperMQ services health check

```bash
supermq-cli health <service>
```

For "things" service, the response should look like this:

```json
{
  "build_time": "2024-03-13_16:12:26",
  "commit": "3bf59689fb74388415d2655eb43b5d736ac82fc2",
  "description": "things service",
  "status": "pass",
  "version": "v0.14.0"
}
```

### Users management

#### Create User

SuperMQ has two options for user creation. Either the `<user_token>` is provided or not. If the `<user_token>` is provided then the created user will be owned by the user identified by the `<user_token>`. Otherwise, when the token is not used, since everybody can create new users, the user will not have an owner. However, the token is still required, in order to be consistent. For more details, please see [Authorization page](authorization.md).

```bash
supermq-cli users create <user_name> <user_email> <user_password>

supermq-cli users create <user_name> <user_email> <user_password> <user_token>
```

#### Login User

```bash
supermq-cli users token <user_email> <user_password>
```

Since v0.14.0, SuperMQ supports domains. Domains are used to separate different tenants, and almost all the activities in SuperMQ happen under a particular domain. Only two types of actions do not happen within a domain: login where you get to list domains and log in to them, and invitations management to accept domain membership sent by other users.
An access token with a domain is required for all the other actions on Things, Channels, and Groups. To obtain token within the domain, use the following command:

```bash
supermq-cli users token <user_email> <user_password> <domain_id>
```

#### Get User Token From Refresh Token

```bash
supermq-cli users refreshtoken <refresh_token>
```

#### Get User

```bash
supermq-cli users get <user_id> <user_token>
```

#### Get Users

```bash
supermq-cli users get all <user_token>
```

#### Update User Metadata

```bash
supermq-cli users update <user_id> '{"name":"value1", "metadata":{"value2": "value3"}}' <user_token>
```

#### Update User Tags

```bash
supermq-cli users update tags <user_id> '["tag1", "tag2"]' <user_token>
```

#### Update User Identity

```bash
supermq-cli users update identity <user_id> <user_email> <user_token>
```

#### Update User Owner

```bash
supermq-cli users update owner <user_id> <owner_id> <user_token>
```

#### Update User Password

```bash
supermq-cli users password <old_password> <password> <user_token>
```

#### Enable User

```bash
supermq-cli users enable <user_id> <user_token>
```

#### Disable User

```bash
supermq-cli users disable <user_id> <user_token>
```

#### Get Profile of the User identified by the token

```bash
supermq-cli users profile <user_token>
```

### Groups management

#### Create Group

```bash
supermq-cli groups create '{"name":"<group_name>","description":"<description>","parentID":"<parent_id>","metadata":"<metadata>"}' <user_token>
```

#### Get Group

```bash
supermq-cli groups get <group_id> <user_token>
```

#### Get Groups

```bash
supermq-cli groups get all <user_token>
```

#### Update Group

```bash
supermq-cli groups update '{"id":"<group_id>","name":"<group_name>","description":"<description>","metadata":"<metadata>"}' <user_token>
```

#### Get Group Members

```bash
supermq-cli groups members <group_id> <user_token>
```

#### Get Memberships

```bash
supermq-cli groups membership <member_id> <user_token>
```

#### Assign Members to Group

```bash
supermq-cli groups assign <member_ids> <member_type> <group_id> <user_token>
```

#### Unassign Members to Group

```bash
supermq-cli groups unassign <member_ids> <group_id>  <user_token>
```

#### Enable Group

```bash
supermq-cli groups enable <group_id> <user_token>
```

#### Disable Group

```bash
supermq-cli groups disable <group_id> <user_token>
```

### Domain management

#### Creating a New Domain

```bash
supermq-cli domains create <domain_name> <domain_alias> <user_token>
```

In this command:

- `<domain_name>` is the name you want to give to the new domain.
- `<domain_alias>` is the alias for the new domain.
- `<user_token>` is your user token.

Here's an example creating a new domain with the name `mydomain` and the alias `myalias` with the user access token stored in the `ADMIN_ACCESS` environment variable:

```bash
supermq-cli domains create "mydomain" "myalias" $ADMIN_ACCESS
```

After running the command, you should see output similar to this:

```bash
{
  "alias": "myalias",
  "created_at": "2024-03-27T09:35:03.61728Z",
  "created_by": "f905b21e-3755-4f73-8444-0fd6db6b96e3",
  "id": "6fcfec51-423d-4f69-b5c5-1ed1c9ae547c",
  "name": "mydomain",
  "status": "enabled",
  "updated_at": "0001-01-01T00:00:00Z"
}
```

#### Get domains

For a single domain

```bash
supermq-cli domains get <domain_id> <user_token>
```

where:

- `<domain_id>` is the unique identifier of the domain you want to retrieve information about.
- `<user_token>` is your user token.

For example

```bash
supermq-cli domains get "6fcfec51-423d-4f69-b5c5-1ed1c9ae547c" $ADMIN_ACCESS
```

The ouptut should look like

```bash
{
  "alias": "myalias",
  "created_at": "2024-03-27T09:35:03.61728Z",
  "created_by": "f905b21e-3755-4f73-8444-0fd6db6b96e3",
  "id": "6fcfec51-423d-4f69-b5c5-1ed1c9ae547c",
  "name": "mydomain",
  "status": "enabled",
  "updated_at": "0001-01-01T00:00:00Z"
}
```

For all domains

```bash
supermq-cli domains get all <user_token>
```

For example

```bash
supermq-cli domains get all $ADMIN_ACCESS
```

After running this command, you will receive information about all domains. The output should look something like this:

```bash
{
  "domains": [
    {
      "alias": "myalias",
      "created_at": "2024-03-27T09:35:03.61728Z",
      "created_by": "f905b21e-3755-4f73-8444-0fd6db6b96e3",
      "id": "6fcfec51-423d-4f69-b5c5-1ed1c9ae547c",
      "name": "mydomain",
      "status": "enabled",
      "updated_at": "0001-01-01T00:00:00Z"
    },
    {
      "alias": "mydomain",
      "created_at": "2024-03-21T07:57:50.320928Z",
      "created_by": "3d57bf0e-409b-42ee-9adb-abcfb3d4b710",
      "id": "5b6d3cf9-14fc-4283-9ff9-fdd6127ef402",
      "name": "mydomain",
      "permission": "administrator",
      "status": "enabled",
      "updated_at": "0001-01-01T00:00:00Z"
    }
  ],
  "limit": 10,
  "offset": 0,
  "total": 2
}
```

#### Updating Domains

```bash
supermq-cli domains update <domain_id> '{"name" : "<new_domain_name>", "alias" : "<new_domain_alias>", "metadata" : "<new_metadata>"}' <user_token>
```

In this command:

- `<domain_id>` is the unique identifier of the domain you want to update.
- `<new_domain_name>` is the new name you want to give to the domain.
- `<new_domain_alias>` is the new alias for the domain.
- `<new_metadata>` is the new metadata for the domain.
- `<user_token>` is your user token.

Here's an example in which we're updating the domain with the ID `6fcfec51-423d-4f69-b5c5-1ed1c9ae547c` to have the name `domain_name` instead of `mydomain`, the alias `domain_alias` instead of `myalias`, and adding new metadata `{"location" : "london"}`.

```bash
supermq-cli domains update "6fcfec51-423d-4f69-b5c5-1ed1c9ae547c" '{"name" : "domain_name", "alias" : "domain_alias", "metadata" : {"location" : "london"}}' $ADMIN_ACCESS
```

After running the command, you should see an output similar to this:

```bash
{
  "alias": "domain_alias",
  "created_at": "2024-03-27T09:35:03.61728Z",
  "created_by": "f905b21e-3755-4f73-8444-0fd6db6b96e3",
  "id": "6fcfec51-423d-4f69-b5c5-1ed1c9ae547c",
  "metadata": {
    "location": "london"
  },
  "name": "domain_name",
  "status": "enabled",
  "updated_at": "2024-03-27T09:56:43.66215Z",
  "updated_by": "f905b21e-3755-4f73-8444-0fd6db6b96e3"
}
```

#### Disable a domain

```bash
supermq-cli domains disable <domain_id> <user_token>
```

In this command:

- `<domain_id>` is the unique identifier of the domain you want to disable.
- `<user_token>` is your user token.

For example,

```bash
supermq-cli domains disable "6fcfec51-423d-4f69-b5c5-1ed1c9ae547c" $ADMIN_ACCESS
```

#### Enable a domain

```bash
supermq-cli domains enable <domain_id> <user_token>
```

In this command:

- `<domain_id>` is the unique identifier of the domain you want to enable.
- `<user_token>` is your user token.

For example,

```bash
supermq-cli domains enable "6fcfec51-423d-4f69-b5c5-1ed1c9ae547c" $ADMIN_ACCESS
```

#### Assigning Users to a Domain

```bash
supermq-cli domains assign users <relation> <user_ids> <domain_id> <user_token>
```

In this command:

- `<relation>` is the relationship of the user to the domain (for example, 'Administrator', 'Editor', 'Viewer', or 'Member').
- `<user_ids>` is a list of user IDs that you want to assign to the domain.
- `<domain_id>` is the unique identifier of the domain to which you want to assign the users.
- `<user_token>` is your user token.

For example,

```bash
supermq-cli domains assign users "member" "6a8c0864-1d95-4053-a335-a6399c0ccb0a" "6fcfec51-423d-4f69-b5c5-1ed1c9ae547c" $ADMIN_ACCESS
```

#### List Domain users

```bash
supermq-cli domains users <domain_id>  <user_token>
```

For example, if your domain ID is `6fcfec51-423d-4f69-b5c5-1ed1c9ae547c` and your user token is stored in the `ADMIN_ACCESS` environment variable, you would type:

```bash
supermq-cli domains users "6fcfec51-423d-4f69-b5c5-1ed1c9ae547c" $ADMIN_ACCESS
```

After you run this command, the system will show you a list of users in the domain, like this:

```bash
{
  "limit": 10,
  "offset": 0,
  "total": 2,
  "users": [
    {
      "created_at": "2024-03-21T08:06:55.232067Z",
      "credentials": {
        "identity": "user1@email.com"
      },
      "id": "6a8c0864-1d95-4053-a335-a6399c0ccb0a",
      "metadata": {
        "location": "london"
      },
      "name": "user1",
      "status": "enabled",
      "tags": [
        "male",
        "developer"
      ],
      "updated_at": "2024-03-25T10:31:26.557439Z"
    },
    {
      "created_at": "2024-03-25T09:21:03.821017Z",
      "credentials": {
        "identity": "user3@example.com"
      },
      "id": "78411c55-adfe-4940-bbbf-e973d60a4e14",
      "name": "user3",
      "status": "enabled",
      "updated_at": "0001-01-01T00:00:00Z"
    }
  ]
}
```

This output tells you that there are currently 2 users in the domain.

#### Unassign users from a domain

```bash
supermq-cli domains unassign users <relation> <user_ids> <domain_id> <user_token>
```

For example, if you want to remove a user with the ID `6a8c0864-1d95-4053-a335-a6399c0ccb0a` from a domain with the ID `6fcfec51-423d-4f69-b5c5-1ed1c9ae547c`, and the user is a member of the domain, you would type:

```bash
supermq-cli domains unassign users "member" "6a8c0864-1d95-4053-a335-a6399c0ccb0a" "6fcfec51-423d-4f69-b5c5-1ed1c9ae547c" $ADMIN_ACCESS
```

### Things management

#### Create Thing

```bash
supermq-cli things create '{"name":"myThing"}' <user_token>
```

#### Create Thing with metadata

```bash
supermq-cli things create '{"name":"myThing", "metadata": {"key1":"value1"}}' <user_token>
```

#### Bulk Provision Things

```bash
supermq-cli provision things <file> <user_token>
```

- `file` - A CSV or JSON file containing thing names (must have extension `.csv` or `.json`)
- `user_token` - A valid user auth token for the current system

An example CSV file might be:

```csv
thing1,
thing2,
thing3,
```

in which the first column is thing names.

A comparable JSON file would be

```json
[
  {
    "name": "<thing1_name>",
    "status": "enabled"
  },
  {
    "name": "<thing2_name>",
    "status": "disabled"
  },
  {
    "name": "<thing3_name>",
    "status": "enabled",
    "credentials": {
      "identity": "<thing3_identity>",
      "secret": "<thing3_secret>"
    }
  }
]
```

With JSON you can be able to specify more fields of the channels you want to create

#### Update Thing

```bash
supermq-cli things update <thing_id> '{"name":"value1", "metadata":{"key1": "value2"}}' <user_token>
```

#### Update Thing Tags

```bash
supermq-cli things update tags <thing_id> '["tag1", "tag2"]' <user_token>
```

#### Update Thing Owner

```bash
supermq-cli things update owner <thing_id> <owner_id> <user_token>
```

#### Update Thing Secret

```bash
supermq-cli things update secret <thing_id> <secet> <user_token>
```

#### Identify Thing

```bash
supermq-cli things identify <thing_secret>
```

#### Enable Thing

```bash
supermq-cli things enable <thing_id> <user_token>
```

#### Disable Thing

```bash
supermq-cli things disable <thing_id> <user_token>
```

#### Get Thing

```bash
supermq-cli things get <thing_id> <user_token>
```

#### Get Things

```bash
supermq-cli things get all <user_token>
```

#### Get a subset list of provisioned Things

```bash
supermq-cli things get all --offset=1 --limit=5 <user_token>
```

#### Share Thing

```bash
supermq-cli things share <channel_id> <user_id> <allowed_actions> <user_token>
```

### Channels management

#### Create Channel

```bash
supermq-cli channels create '{"name":"myChannel"}' <user_token>
```

#### Bulk Provision Channels

```bash
supermq-cli provision channels <file> <user_token>
```

- `file` - A CSV or JSON file containing channel names (must have extension `.csv` or `.json`)
- `user_token` - A valid user auth token for the current system

An example CSV file might be:

```csv
<channel1_name>,
<channel2_name>,
<channel3_name>,
```

in which the first column is channel names.

A comparable JSON file would be

```json
[
  {
    "name": "<channel1_name>",
    "description": "<channel1_description>",
    "status": "enabled"
  },
  {
    "name": "<channel2_name>",
    "description": "<channel2_description>",
    "status": "disabled"
  },
  {
    "name": "<channel3_name>",
    "description": "<channel3_description>",
    "status": "enabled"
  }
]
```

With JSON you can be able to specify more fields of the channels you want to create

#### Update Channel

```bash
supermq-cli channels update '{"id":"<channel_id>","name":"myNewName"}' <user_token>
```

#### Enable Channel

```bash
supermq-cli channels enable <channel_id> <user_token>
```

#### Disable Channel

```bash
supermq-cli channels disable <channel_id> <user_token>
```

#### Get Channel

```bash
supermq-cli channels get <channel_id> <user_token>
```

#### Get Channels

```bash
supermq-cli channels get all <user_token>
```

#### Get a subset list of provisioned Channels

```bash
supermq-cli channels get all --offset=1 --limit=5 <user_token>
```

#### Connect Thing to Channel

```bash
supermq-cli things connect <thing_id> <channel_id> <user_token>
```

#### Bulk Connect Things to Channels

```bash
supermq-cli provision connect <file> <user_token>
```

- `file` - A CSV or JSON file containing thing and channel ids (must have extension `.csv` or `.json`)
- `user_token` - A valid user auth token for the current system

An example CSV file might be

```csv
<thing_id1>,<channel_id1>
<thing_id2>,<channel_id2>
```

in which the first column is thing IDs and the second column is channel IDs. A connection will be created for each thing to each channel. This example would result in 4 connections being created.

A comparable JSON file would be

```json
{
  "subjects": ["<thing_id1>", "<thing_id2>"],
  "objects": ["<channel_id1>", "<channel_id2>"]
}
```

#### Disconnect Thing from Channel

```bash
supermq-cli things disconnect <thing_id> <channel_id> <user_token>
```

#### Get a subset list of Channels connected to Thing

```bash
supermq-cli things connections <thing_id> <user_token>
```

#### Get a subset list of Things connected to Channel

```bash
supermq-cli channels connections <channel_id> <user_token>
```

### Messaging

#### Send a message over HTTP

```bash
supermq-cli messages send <channel_id> '[{"bn":"Dev1","n":"temp","v":20}, {"n":"hum","v":40}, {"bn":"Dev2", "n":"temp","v":20}, {"n":"hum","v":40}]' <thing_secret>
```

#### Read messages over HTTP

```bash
supermq-cli messages read <channel_id> <user_token> -R <reader_url>
```

### Bootstrap

#### Add configuration

```bash
supermq-cli bootstrap create '{"external_id": "myExtID", "external_key": "myExtKey", "name": "myName", "content": "myContent"}' <user_token> -b <bootstrap-url>
```

#### View configuration

```bash
supermq-cli bootstrap get <thing_id> <user_token> -b <bootstrap-url>
```

#### Update configuration

```bash
supermq-cli bootstrap update '{"supermq_id":"<thing_id>", "name": "newName", "content": "newContent"}' <user_token> -b <bootstrap-url>
```

#### Remove configuration

```bash
supermq-cli bootstrap remove <thing_id> <user_token> -b <bootstrap-url>
```

#### Bootstrap configuration

```bash
supermq-cli bootstrap bootstrap <external_id> <external_key> -b <bootstrap-url>
```

## Config

SuperMQ CLI tool supports configuration files that contain some of the basic settings so you don't have to specify them through flags. Once you set the settings, they remain stored locally.

```bash
supermq-cli config <parameter> <value>
```

Response should look like this:

```bash
  ok
```

This command is used to set the flags to be used by CLI in a local TOML file. The default location of the TOML file is in the same directory as the CLI binary. To change the location of the TOML file you can run the command:

```bash
  supermq-cli config <parameter> <value> -c "cli/file_name.toml"
```

The possible parameters that can be set using the config command are:

| Flag             | Description                                          | Default                  |
| ---------------- | ---------------------------------------------------- | ------------------------ |
| bootstrap_url    | Bootstrap service URL                                |   [bootstrap_url][bootstrap]|
| certs_url        | Certs service URL                                    | [certs_url][certs]  |
| http_adapter_url | HTTP adapter URL                                     |  [http_adapter_url][http_adapter] |
| msg_content_type | Message content type                                 | "application/senml+json" |
| reader_url       | Reader URL                                           | [reader_url][reader]       |
| things_url       | Things service URL                                   | [things_url][things]  |
| tls_verification | Do not check for TLS cert                            |                          |
| users_url        | Users service URL                                    | [users_url][users]  |
| state            | Bootstrap state query parameter                      |                          |
| status           | User status query parameter                          |                          |
| topic            | Subscription topic query parameter                   |                          |
| contact          | Subscription contact query parameter                 |                          |
| email            | User email query parameter                           |                          |
| limit            | Limit query parameter                                | 10                       |
| metadata         | Metadata query parameter                             |                          |
| name             | Name query parameter                                 |                          |
| offset           | Offset query parameter                               |                          |
| raw_output       | Enables raw output mode for easier parsing of output |                          |

[releases]: https://github.com/absmach/supermq/releases
[bootstrap]: http://localhost:9013
[certs]: http://localhost:9019
[http_adapter]:http://localhost/http
[reader]: http://localhost
[things]: http://localhost:9000
[users]:http://localhost:9002
