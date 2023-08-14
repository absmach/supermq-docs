# CLI

Mainflux CLI makes it easy to manage users, things, channels and messages.

CLI can be downloaded as separate asset from [project realeses][releases] or it can be built with `GNU Make` tool:

Get the mainflux code

```bash
go get github.com/mainflux/mainflux
```

Build the mainflux-cli

```bash
make cli
```

which will build `mainflux-cli` in `<project_root>/build` folder.

Executing `build/mainflux-cli` without any arguments will output help with all available commands and flags:

```bash
Usage:
  mainflux-cli [command]

Available Commands:
  bootstrap     Bootstrap management
  certs         Certificates management
  channels      Channels management
  completion    Generate the autocompletion script for the specified shell
  groups        Groups management
  health        Health Check
  help          Help about any command
  messages      Send or read messages
  policies      Policies management
  provision     Provision things and channels from a config file
  subscription  Subscription management
  things        Things management
  users         Users management

Flags:
  -b, --bootstrap-url string   Bootstrap service URL (default "http://localhost")
  -s, --certs-url string       Certs service URL (default "http://localhost")
  -c, --config string          Config path
  -C, --contact string         Subscription contact query parameter
  -y, --content-type string    Message content type (default "application/senml+json")
  -e, --email string           User email query parameter
  -h, --help                   help for mainflux-cli
  -p, --http-url string        HTTP adapter URL (default "http://localhost/http")
  -i, --insecure               Do not check for TLS cert
  -l, --limit uint             Limit query parameter (default 10)
  -m, --metadata string        Metadata query parameter
  -n, --name string            Name query parameter
  -o, --offset uint            Offset query parameter
  -r, --raw                    Enables raw output mode for easier parsing of output
  -R, --reader-url string      Reader URL (default "http://localhost")
  -z, --state string           Bootstrap state query parameter
  -S, --status string          User status query parameter
  -t, --things-url string      Things service URL (default "http://localhost")
  -T, --topic string           Subscription topic query parameter
  -u, --users-url string       Users service URL (default "http://localhost")

Use "mainflux-cli [command] --help" for more information about a command.
```

It is also possible to use the docker image `mainflux/cli` to execute CLI command:

```bash
docker run -it --rm mainflux/cli -u http://<IP_SERVER> [command]
```

For example:

```bash
docker run -it --rm mainflux/cli -u http://192.168.160.1 users token admin@example.com 12345678

{
  "access_token": "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2ODA2MjEzMDcsImlhdCI6MTY4MDYyMDQwNywiaWRlbnRpdHkiOiJhZG1pbkBleGFtcGxlLmNvbSIsImlzcyI6ImNsaWVudHMuYXV0aCIsInN1YiI6ImYxZTA5Y2YxLTgzY2UtNDE4ZS1iZDBmLWU3M2I3M2MxNDM2NSIsInR5cGUiOiJhY2Nlc3MifQ.iKdBv3Ko7PKuhjTC6Xs-DvqfKScjKted3ZMorTwpXCd4QrRSsz6NK_lARG6LjpE0JkymaCMVMZlzykyQ6ZgwpA",
  "access_type": "Bearer",
  "refresh_token": "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2ODA3MDY4MDcsImlhdCI6MTY4MDYyMDQwNywiaWRlbnRpdHkiOiJhZG1pbkBleGFtcGxlLmNvbSIsImlzcyI6ImNsaWVudHMuYXV0aCIsInN1YiI6ImYxZTA5Y2YxLTgzY2UtNDE4ZS1iZDBmLWU3M2I3M2MxNDM2NSIsInR5cGUiOiJyZWZyZXNoIn0.-0tOtXFZi48VS-FxkCnVxnW2RUkJvqUmzRz3_EYSSKFyKealoFrv7sZIUvrdvKomnUFzXshP0EygL8vjWP1SFw"
}
```

You can execute each command with `-h` flag for more information about that command, e.g.

```bash
mainflux-cli channels -h
```

Response should look like this:

```bash
Channels management: create, get, update or delete Channel and get list of Things connected or not connected to a Channel

Usage:
  mainflux-cli channels [command]

Available Commands:
  connections Connections list
  create      Create channel
  disable     Change channel status to disabled
  enable      Change channel status to enabled
  get         Get channel
  update      Update channel

Flags:
  -h, --help   help for channels

Global Flags:
  -b, --bootstrap-url string   Bootstrap service URL (default "http://localhost")
  -s, --certs-url string       Certs service URL (default "http://localhost")
  -c, --config string          Config path
  -C, --contact string         Subscription contact query parameter
  -y, --content-type string    Message content type (default "application/senml+json")
  -e, --email string           User email query parameter
  -h, --help                   help for mainflux-cli
  -p, --http-url string        HTTP adapter URL (default "http://localhost/http")
  -i, --insecure               Do not check for TLS cert
  -l, --limit uint             Limit query parameter (default 10)
  -m, --metadata string        Metadata query parameter
  -n, --name string            Name query parameter
  -o, --offset uint            Offset query parameter
  -r, --raw                    Enables raw output mode for easier parsing of output
  -R, --reader-url string      Reader URL (default "http://localhost")
  -z, --state string           Bootstrap state query parameter
  -S, --status string          User status query parameter
  -t, --things-url string      Things service URL (default "http://localhost")
  -T, --topic string           Subscription topic query parameter
  -u, --users-url string       Users service URL (default "http://localhost")


Use "mainflux-cli channels [command] --help" for more information about a command.
```

## Service

### Get Mainflux Things services health check

```bash
mainflux-cli health
```

Response should look like this:

```json
{
  "build_time": "2023-06-26_13:16:16",
  "commit": "8589ad58f4ac30a198c101a7b8aa7ac2c54b2d05",
  "description": "things service",
  "status": "pass",
  "version": "0.13.0"
}
```

### Users management

#### Create User

Mainflux has two options for user creation. Either the `<user_token>` is provided or not. If the `<user_token>` is provided then the created user will be owned by the user identified by the `<user_token>`. Otherwise, when the token is not used, since everybody can create new users, the user will not have an owner. However, the token is still required, in order to be consistent. For more details, please see [Authorization page](authorization.md).

```bash
mainflux-cli users create <user_name> <user_email> <user_password>

mainflux-cli users create <user_name> <user_email> <user_password> <user_token>
```

#### Login User

```bash
mainflux-cli users token <user_email> <user_password>
```

#### Get User Token From Refresh Token

```bash
mainflux-cli users refreshtoken <refresh_token>
```

#### Get User

```bash
mainflux-cli users get <user_id> <user_token>
```

#### Get Users

```bash
mainflux-cli users get all <user_token>
```

#### Update User Metadata

```bash
mainflux-cli users update <user_id> '{"name":"value1", "metadata":{"value2": "value3"}}' <user_token>
```

#### Update User Tags

```bash
mainflux-cli users update tags <user_id> '["tag1", "tag2"]' <user_token>
```

#### Update User Identity

```bash
mainflux-cli users update identity <user_id> <user_email> <user_token>
```

#### Update User Owner

```bash
mainflux-cli users update owner <user_id> <owner_id> <user_token>
```

#### Update User Password

```bash
mainflux-cli users password <old_password> <password> <user_token>
```

#### Enable User

```bash
mainflux-cli users enable <user_id> <user_token>
```

#### Disable User

```bash
mainflux-cli users disable <user_id> <user_token>
```

#### Get Profile of the User identified by the token

```bash
mainflux-cli users profile <user_token>
```

### Groups management

#### Create Group

```bash
mainflux-cli groups create '{"name":"<group_name>","description":"<description>","parentID":"<parent_id>","metadata":"<metadata>"}' <user_token>
```

#### Get Group

```bash
mainflux-cli groups get <group_id> <user_token>
```

#### Get Groups

```bash
mainflux-cli groups get all <user_token>
```

#### Update Group

```bash
mainflux-cli groups update '{"id":"<group_id>","name":"<group_name>","description":"<description>","metadata":"<metadata>"}' <user_token>
```

#### Get Group Members

```bash
mainflux-cli groups members <group_id> <user_token>
```

#### Get Memberships

```bash
mainflux-cli groups membership <member_id> <user_token>
```

#### Assign Members to Group

```bash
mainflux-cli groups assign <member_ids> <member_type> <group_id> <user_token>
```

#### Unassign Members to Group

```bash
mainflux-cli groups unassign <member_ids> <group_id>  <user_token>
```

#### Enable Group

```bash
mainflux-cli groups enable <group_id> <user_token>
```

#### Disable Group

```bash
mainflux-cli groups disable <group_id> <user_token>
```

### Things management

#### Create Thing

```bash
mainflux-cli things create '{"name":"myThing"}' <user_token>
```

#### Create Thing with metadata

```bash
mainflux-cli things create '{"name":"myThing", "metadata": {"key1":"value1"}}' <user_token>
```

#### Bulk Provision Things

```bash
mainflux-cli provision things <file> <user_token>
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
mainflux-cli things update <thing_id> '{"name":"value1", "metadata":{"key1": "value2"}}' <user_token>
```

#### Update Thing Tags

```bash
mainflux-cli things update tags <thing_id> '["tag1", "tag2"]' <user_token>
```

#### Update Thing Owner

```bash
mainflux-cli things update owner <thing_id> <owner_id> <user_token>
```

#### Update Thing Secret

```bash
mainflux-cli things update secret <thing_id> <secet> <user_token>
```

#### Identify Thing

```bash
mainflux-cli things identify <thing_secret>
```

#### Enable Thing

```bash
mainflux-cli things enable <thing_id> <user_token>
```

#### Disable Thing

```bash
mainflux-cli things disable <thing_id> <user_token>
```

#### Get Thing

```bash
mainflux-cli things get <thing_id> <user_token>
```

#### Get Things

```bash
mainflux-cli things get all <user_token>
```

#### Get a subset list of provisioned Things

```bash
mainflux-cli things get all --offset=1 --limit=5 <user_token>
```

#### Share Thing

```bash
mainflux-cli things share <channel_id> <user_id> <allowed_actions> <user_token>
```

### Channels management

#### Create Channel

```bash
mainflux-cli channels create '{"name":"myChannel"}' <user_token>
```

#### Bulk Provision Channels

```bash
mainflux-cli provision channels <file> <user_token>
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
mainflux-cli channels update '{"id":"<channel_id>","name":"myNewName"}' <user_token>
```

#### Enable Channel

```bash
mainflux-cli channels enable <channel_id> <user_token>
```

#### Disable Channel

```bash
mainflux-cli channels disable <channel_id> <user_token>
```

#### Get Channel

```bash
mainflux-cli channels get <channel_id> <user_token>
```

#### Get Channels

```bash
mainflux-cli channels get all <user_token>
```

#### Get a subset list of provisioned Channels

```bash
mainflux-cli channels get all --offset=1 --limit=5 <user_token>
```

#### Connect Thing to Channel

```bash
mainflux-cli things connect <thing_id> <channel_id> <user_token>
```

#### Bulk Connect Things to Channels

```bash
mainflux-cli provision connect <file> <user_token>
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
mainflux-cli things disconnect <thing_id> <channel_id> <user_token>
```

#### Get a subset list of Channels connected to Thing

```bash
mainflux-cli things connections <thing_id> <user_token>
```

#### Get a subset list of Things connected to Channel

```bash
mainflux-cli channels connections <channel_id> <user_token>
```

### Messaging

#### Send a message over HTTP

```bash
mainflux-cli messages send <channel_id> '[{"bn":"Dev1","n":"temp","v":20}, {"n":"hum","v":40}, {"bn":"Dev2", "n":"temp","v":20}, {"n":"hum","v":40}]' <thing_secret>
```

#### Read messages over HTTP

```bash
mainflux-cli messages read <channel_id> <user_token> -R <reader_url>
```

### Bootstrap

#### Add configuration

```bash
mainflux-cli bootstrap create '{"external_id": "myExtID", "external_key": "myExtKey", "name": "myName", "content": "myContent"}' <user_token> -b <bootstrap-url>
```

#### View configuration

```bash
mainflux-cli bootstrap get <thing_id> <user_token> -b <bootstrap-url>
```

#### Update configuration

```bash
mainflux-cli bootstrap update '{"mainflux_id":"<thing_id>", "name": "newName", "content": "newContent"}' <user_token> -b <bootstrap-url>
```

#### Remove configuration

```bash
mainflux-cli bootstrap remove <thing_id> <user_token> -b <bootstrap-url>
```

#### Bootstrap configuration

```bash
mainflux-cli bootstrap bootstrap <external_id> <external_key> -b <bootstrap-url>
```

## Config

```bash
mainflux-cli config <parameter> <value>
```

Response should look like this:

```bash
  ok 
```

This command is used to set the flags to be used by CLI in a local TOML file. The default location of the TOML file is near the binaries. To change the location of the TOML file you can run the command:

```
  mainflux-cli config <parameter> <value> -c "cli/file_name.toml"
```


The possible parameters that can be set using the config command are:

```
  - bootstrap_url     
  - certs_url         
  - http_adapter_url  
  - msg_content_type 
  - reader_url        
  - things_url           
  - tls_verification    
  - users_url         
  - state
  - status
  - topic
  - contact
  - email
  - limit
  - metadata
  - name
  - offset
  - raw_output
```

[releases]: https://github.com/mainflux/mainflux/releases
