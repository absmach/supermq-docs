# Getting Started

## Step 1 - Run the System

Before proceeding, install the following prerequisites:

- [Docker](https://docs.docker.com/install/) (version 18.09)
- [Docker compose](https://docs.docker.com/compose/install/) (version 1.24.1)

Once everything is installed, execute the following command from project root:

```bash
make run
```

This will start Mainflux docker composition, which will output the logs from the containers.

## Step 2 - Install the CLI

Open a new terminal from which you can interact with the running Mainflux system. The easiest way to do this is by using the Mainflux CLI,
which can be downloaded as a tarball from GitHub (here we use release `0.13.0` but be sure to use the [latest CLI release](https://github.com/mainflux/mainflux/releases)):

```bash
wget -O- https://github.com/mainflux/mainflux/releases/download/0.13.0/mainflux-cli_0.13.0_linux-amd64.tar.gz | tar xvz -C $GOBIN
```

> Make sure that `$GOBIN` is added to your `$PATH` so that `mainflux-cli` command can be accessible system-wide

### Build mainflux-cli

Build `mainflux-cli` if the pre-built CLI is not compatible with your OS, i.e MacOS. Please see the [CLI](cli.md) for further details.

## Step 3 - Provision the System

Once installed, you can use the CLI to quick-provision the system for testing:

```bash
mainflux-cli provision test
```

This command actually creates a temporary testing user, logs it in, then creates two things and two channels on behalf of this user.
This quickly provisions a Mainflux system with one simple testing scenario.

You can read more about system provisioning in the dedicated [Provisioning](/provision/#platform-management) chapter

Output of the command follows this pattern:

```json
{
  "created_at": "2023-04-04T08:02:47.686337Z",
  "credentials": {
    "identity": "crazy_feistel@email.com",
    "secret": "12345678"
  },
  "id": "0216df07-8f08-40ef-ba91-ff0e700f387a",
  "name": "crazy_feistel",
  "status": "enabled",
  "updated_at": "2023-04-04T08:02:47.686337Z"
}


{
  "access_token": "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2ODA1OTYyNjcsImlhdCI6MTY4MDU5NTM2NywiaWRlbnRpdHkiOiJjcmF6eV9mZWlzdGVsQGVtYWlsLmNvbSIsImlzcyI6ImNsaWVudHMuYXV0aCIsInN1YiI6IjAyMTZkZjA3LThmMDgtNDBlZi1iYTkxLWZmMGU3MDBmMzg3YSIsInR5cGUiOiJhY2Nlc3MifQ.EpaFDcRjYAHwqhejLfay5ju8L1a7VdhXKohUlwTv7YTeOK-ClfNNx6KznV05Swdj6lgvbmVAfe0wz2JMpfMjdw",
  "access_type": "Bearer",
  "refresh_token": "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2ODA2ODE3NjcsImlhdCI6MTY4MDU5NTM2NywiaWRlbnRpdHkiOiJjcmF6eV9mZWlzdGVsQGVtYWlsLmNvbSIsImlzcyI6ImNsaWVudHMuYXV0aCIsInN1YiI6IjAyMTZkZjA3LThmMDgtNDBlZi1iYTkxLWZmMGU3MDBmMzg3YSIsInR5cGUiOiJyZWZyZXNoIn0.3xcrkIBbi2a8firNHtnK6I8sBBOgrQ6XBa3x7cybKc6omOuqrkkNjXGjKU9tgShvjpfCWT48AR1VqO_VxJxL8g"
}


[
  {
    "created_at": "2023-04-04T08:02:47.81865461Z",
    "credentials": {
      "secret": "fc9473d8-6756-4fcc-968f-ea43cd0b803b"
    },
    "id": "5d5e593b-7629-4cc3-bebc-b20d8ab9dbef",
    "name": "d0",
    "owner": "0216df07-8f08-40ef-ba91-ff0e700f387a",
    "status": "enabled",
    "updated_at": "2023-04-04T08:02:47.81865461Z"
  },
  {
    "created_at": "2023-04-04T08:02:47.818661382Z",
    "credentials": {
      "secret": "56a4b1bd-9750-42b3-a3cb-cf5ee2b86fe4"
    },
    "id": "45048a8e-c602-4e91-9556-a9d3af6617fb",
    "name": "d1",
    "owner": "0216df07-8f08-40ef-ba91-ff0e700f387a",
    "status": "enabled",
    "updated_at": "2023-04-04T08:02:47.818661382Z"
  }
]


[
  {
    "created_at": "2023-04-04T08:02:47.857619Z",
    "id": "a31e16f8-343c-4366-8b4f-c95e190937f4",
    "name": "c0",
    "owner_id": "0216df07-8f08-40ef-ba91-ff0e700f387a",
    "status": "enabled",
    "updated_at": "2023-04-04T08:02:47.857619Z"
  },
  {
    "created_at": "2023-04-04T08:02:47.867336Z",
    "id": "e20ad0bb-c490-47dd-9366-fb8ffd56c5dc",
    "name": "c1",
    "owner_id": "0216df07-8f08-40ef-ba91-ff0e700f387a",
    "status": "enabled",
    "updated_at": "2023-04-04T08:02:47.867336Z"
  }
]

```

In the Mainflux system terminal (where docker compose is running) you should see following logs:

```bash
...
mainflux-users  | {"level":"info","message":"Method register_client with id 0216df07-8f08-40ef-ba91-ff0e700f387a using token  took 87.335902ms to complete without errors.","ts":"2023-04-04T08:02:47.722776862Z"}
mainflux-users  | {"level":"info","message":"Method issue_token of type Bearer for client crazy_feistel@email.com took 55.342161ms to complete without errors.","ts":"2023-04-04T08:02:47.783884818Z"}
mainflux-users  | {"level":"info","message":"Method identify for token eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2ODA1OTYyNjcsImlhdCI6MTY4MDU5NTM2NywiaWRlbnRpdHkiOiJjcmF6eV9mZWlzdGVsQGVtYWlsLmNvbSIsImlzcyI6ImNsaWVudHMuYXV0aCIsInN1YiI6IjAyMTZkZjA3LThmMDgtNDBlZi1iYTkxLWZmMGU3MDBmMzg3YSIsInR5cGUiOiJhY2Nlc3MifQ.EpaFDcRjYAHwqhejLfay5ju8L1a7VdhXKohUlwTv7YTeOK-ClfNNx6KznV05Swdj6lgvbmVAfe0wz2JMpfMjdw with id 0216df07-8f08-40ef-ba91-ff0e700f387a took 1.389463ms to complete without errors.","ts":"2023-04-04T08:02:47.817018631Z"}
mainflux-things | {"level":"info","message":"Method create_things 2 things using token eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2ODA1OTYyNjcsImlhdCI6MTY4MDU5NTM2NywiaWRlbnRpdHkiOiJjcmF6eV9mZWlzdGVsQGVtYWlsLmNvbSIsImlzcyI6ImNsaWVudHMuYXV0aCIsInN1YiI6IjAyMTZkZjA3LThmMDgtNDBlZi1iYTkxLWZmMGU3MDBmMzg3YSIsInR5cGUiOiJhY2Nlc3MifQ.EpaFDcRjYAHwqhejLfay5ju8L1a7VdhXKohUlwTv7YTeOK-ClfNNx6KznV05Swdj6lgvbmVAfe0wz2JMpfMjdw took 48.137759ms to complete without errors.","ts":"2023-04-04T08:02:47.853310066Z"}
mainflux-users  | {"level":"info","message":"Method identify for token eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2ODA1OTYyNjcsImlhdCI6MTY4MDU5NTM2NywiaWRlbnRpdHkiOiJjcmF6eV9mZWlzdGVsQGVtYWlsLmNvbSIsImlzcyI6ImNsaWVudHMuYXV0aCIsInN1YiI6IjAyMTZkZjA3LThmMDgtNDBlZi1iYTkxLWZmMGU3MDBmMzg3YSIsInR5cGUiOiJhY2Nlc3MifQ.EpaFDcRjYAHwqhejLfay5ju8L1a7VdhXKohUlwTv7YTeOK-ClfNNx6KznV05Swdj6lgvbmVAfe0wz2JMpfMjdw with id 0216df07-8f08-40ef-ba91-ff0e700f387a took 302.571µs to complete without errors.","ts":"2023-04-04T08:02:47.856820523Z"}
mainflux-things | {"level":"info","message":"Method create_channel for 2 channels using token eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2ODA1OTYyNjcsImlhdCI6MTY4MDU5NTM2NywiaWRlbnRpdHkiOiJjcmF6eV9mZWlzdGVsQGVtYWlsLmNvbSIsImlzcyI6ImNsaWVudHMuYXV0aCIsInN1YiI6IjAyMTZkZjA3LThmMDgtNDBlZi1iYTkxLWZmMGU3MDBmMzg3YSIsInR5cGUiOiJhY2Nlc3MifQ.EpaFDcRjYAHwqhejLfay5ju8L1a7VdhXKohUlwTv7YTeOK-ClfNNx6KznV05Swdj6lgvbmVAfe0wz2JMpfMjdw took 15.340692ms to complete without errors.","ts":"2023-04-04T08:02:47.872089509Z"}
mainflux-users  | {"level":"info","message":"Method identify for token eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2ODA1OTYyNjcsImlhdCI6MTY4MDU5NTM2NywiaWRlbnRpdHkiOiJjcmF6eV9mZWlzdGVsQGVtYWlsLmNvbSIsImlzcyI6ImNsaWVudHMuYXV0aCIsInN1YiI6IjAyMTZkZjA3LThmMDgtNDBlZi1iYTkxLWZmMGU3MDBmMzg3YSIsInR5cGUiOiJhY2Nlc3MifQ.EpaFDcRjYAHwqhejLfay5ju8L1a7VdhXKohUlwTv7YTeOK-ClfNNx6KznV05Swdj6lgvbmVAfe0wz2JMpfMjdw with id 0216df07-8f08-40ef-ba91-ff0e700f387a took 271.162µs to complete without errors.","ts":"2023-04-04T08:02:47.875812318Z"}
mainflux-things | {"level":"info","message":"Method add_policy for client with id 5d5e593b-7629-4cc3-bebc-b20d8ab9dbef using token eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2ODA1OTYyNjcsImlhdCI6MTY4MDU5NTM2NywiaWRlbnRpdHkiOiJjcmF6eV9mZWlzdGVsQGVtYWlsLmNvbSIsImlzcyI6ImNsaWVudHMuYXV0aCIsInN1YiI6IjAyMTZkZjA3LThmMDgtNDBlZi1iYTkxLWZmMGU3MDBmMzg3YSIsInR5cGUiOiJhY2Nlc3MifQ.EpaFDcRjYAHwqhejLfay5ju8L1a7VdhXKohUlwTv7YTeOK-ClfNNx6KznV05Swdj6lgvbmVAfe0wz2JMpfMjdw took 28.632906ms to complete without errors.","ts":"2023-04-04T08:02:47.904041832Z"}
mainflux-users  | {"level":"info","message":"Method identify for token eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2ODA1OTYyNjcsImlhdCI6MTY4MDU5NTM2NywiaWRlbnRpdHkiOiJjcmF6eV9mZWlzdGVsQGVtYWlsLmNvbSIsImlzcyI6ImNsaWVudHMuYXV0aCIsInN1YiI6IjAyMTZkZjA3LThmMDgtNDBlZi1iYTkxLWZmMGU3MDBmMzg3YSIsInR5cGUiOiJhY2Nlc3MifQ.EpaFDcRjYAHwqhejLfay5ju8L1a7VdhXKohUlwTv7YTeOK-ClfNNx6KznV05Swdj6lgvbmVAfe0wz2JMpfMjdw with id 0216df07-8f08-40ef-ba91-ff0e700f387a took 269.959µs to complete without errors.","ts":"2023-04-04T08:02:47.906989497Z"}
mainflux-things | {"level":"info","message":"Method add_policy for client with id 5d5e593b-7629-4cc3-bebc-b20d8ab9dbef using token eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2ODA1OTYyNjcsImlhdCI6MTY4MDU5NTM2NywiaWRlbnRpdHkiOiJjcmF6eV9mZWlzdGVsQGVtYWlsLmNvbSIsImlzcyI6ImNsaWVudHMuYXV0aCIsInN1YiI6IjAyMTZkZjA3LThmMDgtNDBlZi1iYTkxLWZmMGU3MDBmMzg3YSIsInR5cGUiOiJhY2Nlc3MifQ.EpaFDcRjYAHwqhejLfay5ju8L1a7VdhXKohUlwTv7YTeOK-ClfNNx6KznV05Swdj6lgvbmVAfe0wz2JMpfMjdw took 6.303771ms to complete without errors.","ts":"2023-04-04T08:02:47.910594262Z"}
mainflux-users  | {"level":"info","message":"Method identify for token eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2ODA1OTYyNjcsImlhdCI6MTY4MDU5NTM2NywiaWRlbnRpdHkiOiJjcmF6eV9mZWlzdGVsQGVtYWlsLmNvbSIsImlzcyI6ImNsaWVudHMuYXV0aCIsInN1YiI6IjAyMTZkZjA3LThmMDgtNDBlZi1iYTkxLWZmMGU3MDBmMzg3YSIsInR5cGUiOiJhY2Nlc3MifQ.EpaFDcRjYAHwqhejLfay5ju8L1a7VdhXKohUlwTv7YTeOK-ClfNNx6KznV05Swdj6lgvbmVAfe0wz2JMpfMjdw with id 0216df07-8f08-40ef-ba91-ff0e700f387a took 364.448µs to complete without errors.","ts":"2023-04-04T08:02:47.912905436Z"}
mainflux-things | {"level":"info","message":"Method add_policy for client with id 45048a8e-c602-4e91-9556-a9d3af6617fb using token eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2ODA1OTYyNjcsImlhdCI6MTY4MDU5NTM2NywiaWRlbnRpdHkiOiJjcmF6eV9mZWlzdGVsQGVtYWlsLmNvbSIsImlzcyI6ImNsaWVudHMuYXV0aCIsInN1YiI6IjAyMTZkZjA3LThmMDgtNDBlZi1iYTkxLWZmMGU3MDBmMzg3YSIsInR5cGUiOiJhY2Nlc3MifQ.EpaFDcRjYAHwqhejLfay5ju8L1a7VdhXKohUlwTv7YTeOK-ClfNNx6KznV05Swdj6lgvbmVAfe0wz2JMpfMjdw took 7.73352ms to complete without errors.","ts":"2023-04-04T08:02:47.920205467Z"}
...

```

This proves that these provisioning commands were sent from the CLI to the Mainflux system.

## Step 4 - Send Messages

Once system is provisioned, a `thing` can start sending messages on a `channel`:

```bash
mainflux-cli messages send <channel_id> '[{"bn":"some-base-name:","bt":1.276020076001e+09, "bu":"A","bver":5, "n":"voltage","u":"V","v":120.1}, {"n":"current","t":-5,"v":1.2}, {"n":"current","t":-4,"v":1.3}]' <thing_secret>
```

For example:

```bash
mainflux-cli messages send a31e16f8-343c-4366-8b4f-c95e190937f4 '[{"bn":"some-base-name:","bt":1.276020076001e+09, "bu":"A","bver":5, "n":"voltage","u":"V","v":120.1}, {"n":"current","t":-5,"v":1.2}, {"n":"current","t":-4,"v":1.3}]' fc9473d8-6756-4fcc-968f-ea43cd0b803b
```

In the Mainflux system terminal you should see following logs:

```bash
...
mainflux-things | {"level":"info","message":"Method authorize_by_key for channel with id a31e16f8-343c-4366-8b4f-c95e190937f4 by client with secret fc9473d8-6756-4fcc-968f-ea43cd0b803b took 7.048706ms to complete without errors.","ts":"2023-04-04T08:06:09.750992633Z"}
mainflux-broker | [1] 2023/04/04 08:06:09.753072 [TRC] 192.168.144.11:60616 - cid:10 - "v1.18.0:go" - <<- [PUB channels.a31e16f8-343c-4366-8b4f-c95e190937f4 261]
mainflux-broker | [1] 2023/04/04 08:06:09.754037 [TRC] 192.168.144.11:60616 - cid:10 - "v1.18.0:go" - <<- MSG_PAYLOAD: ["\n$a31e16f8-343c-4366-8b4f-c95e190937f4\x1a$5d5e593b-7629-4cc3-bebc-b20d8ab9dbef\"\x04http*\xa6\x01[{\"bn\":\"some-base-name:\",\"bt\":1.276020076001e+09, \"bu\":\"A\",\"bver\":5, \"n\":\"voltage\",\"u\":\"V\",\"v\":120.1}, {\"n\":\"current\",\"t\":-5,\"v\":1.2}, {\"n\":\"current\",\"t\":-4,\"v\":1.3}]0\xd9\xe6\x8b\xc9Ø\xab\xa9\x17"]
mainflux-broker | [1] 2023/04/04 08:06:09.755550 [TRC] 192.168.144.13:58572 - cid:8 - "v1.18.0:go" - ->> [MSG channels.a31e16f8-343c-4366-8b4f-c95e190937f4 1 261]
mainflux-http   | {"level":"info","message":"Method publish to channel a31e16f8-343c-4366-8b4f-c95e190937f4 took 15.979094ms to complete without errors.","ts":"2023-04-04T08:06:09.75232571Z"}
...
```

This proves that messages have been correctly sent through the system via the protocol adapter (`mainflux-http`).
