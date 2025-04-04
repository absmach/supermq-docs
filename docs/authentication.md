---
title: Authentication
---


## User authentication

For user authentication SuperMQ uses Authentication keys. There are two types of authentication keys:

- User key - keys issued to the user upon login request
- Recovery key - password recovery key

Authentication keys are represented and distributed by the corresponding [JWT][jwt]. User keys are issued when user logs in. Each user request (other than registration and login) contains user key that is used to authenticate the user.

Recovery key is the password recovery key. It's short-lived token used for password recovery process.

The following actions are supported:

- create (all key types)
- verify (all key types)

## Federated authentication

Federated authentication is a process of authenticating users using external identity providers. SuperMQ supports federated authentication using [OpenID Connect][oidc] protocol. SuperMQ is a resource provider and it uses [Google Identity Platform][google-identity-platform] as an identity provider. To use federated authentication, you need to create a project in Google Cloud Platform and enable Google Identity Platform API. After that, you need to create OAuth 2.0 credentials and configure the consent screen. This can be done by following Google's [documentation][google-identity-platform-docs]. Once you have created OAuth 2.0 credentials, you need to set the following environment variables:

```bash
SMQ_USERS_GOOGLE_CLIENT_ID=985229335584-m2mft8lqbgfn5gfw9ftrm3r2sgu4tsrw.apps.googleusercontent.com
SMQ_USERS_GOOGLE_CLIENT_SECRET=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YUIpw
SMQ_UI_GOOGLE_REDIRECT_URL=http://localhost/google-callback
SMQ_USERS_GOOGLE_STATE=pGXVNhEeKfycuBzk5InlSfMlEU9UrhlkTUOSqhsgDzXP2Y4RsN
SMQ_USERS_UI_REDIRECT_URL=http://localhost:9090
```

1. `SMQ_USERS_GOOGLE_CLIENT_ID` - Google OAuth 2.0 client ID
2. `SMQ_USERS_GOOGLE_CLIENT_SECRET` - Google OAuth 2.0 client secret
3. `SMQ_UI_GOOGLE_REDIRECT_URL` - Google OAuth 2.0 redirect URL to handle callback after successful authentication. This URL must be registered in the Google Cloud Platform.
4. `SMQ_USERS_GOOGLE_STATE` - Random string used to protect against cross-site request forgery attacks.
5. `SMQ_USERS_UI_REDIRECT_URL` - URL to redirect user after successful authentication. This can be your SuperMQ UI URL.

SuperMQ handles the authentication callback at `<MG_BASE_URL>/google-callback` endpoint, where `<MG_BASE_URL>` is the base URL of your SuperMQ instance. This endpoint needs to be registered in the Google Cloud Platform and it must match the value of `MG_UI_GOOGLE_REDIRECT_URL` environment variable. If an error occurs, the error message is sent from the backend using a query paramters with the key `error`. The UI will read the error message from the query parameter and display it to the user. When a user signs up, SuperMQ creates a local copy of the user with an ID provided by Google, the name and email address provided by Google and the password is left empty as the user is authenticated using Google, i.e. external user. The user can be created only once, so if the user already exists, the error will be sent to the UI via the error cookie. Finally, the user is redirected to the URL provided in `MG_USERS_UI_REDIRECT_URL` environment variable upon successful authentication. This should be the base URL of your UI.

The `SMQ_USERS_GOOGLE_CLIENT_ID`, `SMQ_USERS_GOOGLE_CLIENT_SECRET`, `SMQ_UI_GOOGLE_REDIRECT_URL` and `SMQ_USERS_GOOGLE_STATE` environment variables should be the same for the UI and users service. The `SMQ_USERS_UI_REDIRECT_URL` environment variable should be the URL of your UI which is used to redirect the user after successful authentication.

SuperMQ uses the `access_token` provided by Google only to fetch user information which includes user id, name, given name, family name, picture and locale. The `access_token` is not stored in the database and it's not used for any other purpose. The `id_token` is not used as it presents challenges on refreshing it, thus SuperMQ issues its own `access_token` and `refresh_token` stored in the HTTP-only cookie and it's used to authenticate the user in the subsequent requests.

## Authentication with SuperMQ keys

By default, SuperMQ uses SuperMQ Thing secret for authentication. The Thing secret is a secret key that's generated at the Thing creation. In order to authenticate, the Thing needs to send its secret with the message. The way the secret is passed depends on the protocol used to send a message and differs from adapter to adapter. For more details on how this secret is passed around, please check out [messaging section][messaging]. This is the default SuperMQ authentication mechanism and this method is used if the composition is started using the following command:

```bash
docker-compose -f docker/docker-compose.yml up
```

## Mutual TLS Authentication with X.509 Certificates

In most of the cases, HTTPS, WSS, MQTTS or secure CoAP are secure enough. However, sometimes you might need an even more secure connection. SuperMQ supports mutual TLS authentication (_mTLS_) based on [X.509 certificates][rf5280]. By default, the TLS protocol only proves the identity of the server to the client using the X.509 certificate and the authentication of the client to the server is left to the application layer. TLS also offers client-to-server authentication using client-side X.509 authentication. This is called two-way or mutual authentication. SuperMQ currently supports mTLS over HTTP, WS, MQTT and MQTT over WS protocols. In order to run Docker composition with mTLS turned on, you can execute the following command from the project root:

```bash
AUTH=x509 docker-compose -f docker/docker-compose.yml up -d
```

Mutual authentication includes client-side certificates. Certificates can be generated using the simple script provided [here][ssl-makefile]. In order to create a valid certificate, you need to create SuperMQ thing using the process described in the [provisioning section][provision]. After that, you need to fetch created thing secret. Thing secret will be used to create x.509 certificate for the corresponding thing. To create a certificate, execute the following commands:

```bash
cd docker/ssl
make ca CN=<common_name> O=<organization> OU=<organizational_unit> emailAddress=<email_address>
make server_cert CN=<common_name> O=<organization> OU=<organizational_unit> emailAddress=<email_address>
make thing_cert THING_SECRET=<thing_secret> CRT_FILE_NAME=<cert_name> O=<organization> OU=<organizational_unit> emailAddress=<email_address>
```

These commands use [OpenSSL][openssl] tool, so please make sure that you have it installed and set up before running these commands. The default values for Makefile variables are

```env
CRT_LOCATION = certs
THING_SECRET = d7cc2964-a48b-4a6e-871a-08da28e7883d
O = SuperMQ
OU = supermq_ca
EA = info@supermq.com
CN = localhost
CRT_FILE_NAME = thing
```

Normally, in order to get things running, you will need to specify only `THING_SECRET`. The other variables are not mandatory and the termination should work with the default values.

- Command `make ca` will generate a self-signed certificate that will later be used as a CA to sign other generated certificates. CA will expire in 3 years.
- Command `make server_cert` will generate and sign (with previously created CA) server cert, which will expire after 1000 days. This cert is used as a SuperMQ server-side certificate in usual TLS flow to establish HTTPS or MQTTS connection.
- Command `make thing_cert` will finally generate and sign a client-side certificate and private key for the thing.

In this example `<thing_secret>` represents secret of the thing and `<cert_name>` represents the name of the certificate and key file which will be saved in `docker/ssl/certs` directory. Generated Certificate will expire after 2 years. The key must be stored in the x.509 certificate `CN` field. This script is created for testing purposes and is not meant to be used in production. We strongly recommend avoiding self-signed certificates and using a certificate management tool such as [Vault][vault] for the production.

Once you have created CA and server-side cert, you can spin the composition using:

```bash
AUTH=x509 docker-compose -f docker/docker-compose.yml up -d
```

Then, you can create user and provision things and channels. Now, in order to send a message from the specific thing to the channel, you need to connect thing to the channel and generate corresponding client certificate using aforementioned commands. To publish a message to the channel, thing should send following request:

### WSS

```javascript
const WebSocket = require("ws");
// Do not verify self-signed certificates if you are using one.
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
// Replace <channel_id> and <thing_secret> with real values.
const ws = new WebSocket(
  "wss://localhost/ws/c/<channel_id>/m?authorization=<thing_secret>",
  // This is ClientOptions object that contains client cert and client key in the form of string. You can easily load these strings from cert and key files.
  {
    cert: `-----BEGIN CERTIFICATE-----....`,
    key: `-----BEGIN RSA PRIVATE KEY-----.....`,
  }
);
ws.on("open", () => {
  ws.send("something");
});
ws.on("message", (data) => {
  console.log(data);
});
ws.on("error", (e) => {
  console.log(e);
});
```

As you can see, `Authorization` header does not have to be present in the HTTP request, since the secret is present in the certificate. However, if you pass `Authorization` header, it _must be the same as the key in the cert_. In the case of MQTTS, `password` filed in CONNECT message _must match the key from the certificate_. In the case of WSS, `Authorization` header or `authorization` query parameter _must match cert key_.

### HTTPS

```bash
curl -s -S -i --cacert docker/ssl/certs/ca.crt --cert docker/ssl/certs/<thing_cert_name>.crt --key docker/ssl/certs/<thing_cert_key>.key -X POST -H "Content-Type: application/senml+json" https://localhost/http/c/<channel_id>/m -d '[{"bn":"some-base-name:","bt":1.276020076001e+09, "bu":"A","bver":5, "n":"voltage","u":"V","v":120.1}, {"n":"current","t":-5,"v":1.2}, {"n":"current","t":-4,"v":1.3}]'
```

### MQTTS

#### Publish

```bash
mosquitto_pub -u <thing_id> -P <thing_secret> -t c/<channel_id>/m -h localhost -p 8883  --cafile docker/ssl/certs/ca.crt --cert docker/ssl/certs/<thing_cert_name>.crt --key docker/ssl/certs/<thing_cert_key>.key -m '[{"bn":"some-base-name:","bt":1.276020076001e+09, "bu":"A","bver":5, "n":"voltage","u":"V","v":120.1}, {"n":"current","t":-5,"v":1.2}, {"n":"current","t":-4,"v":1.3}]'
```

#### Subscribe

```bash
mosquitto_sub -u <thing_id> -P <thing_secret> --cafile docker/ssl/certs/ca.crt --cert docker/ssl/certs/<thing_cert_name>.crt --key docker/ssl/certs/<thing_cert_key>.key -t c/<channel_id>/m -h localhost -p 8883
```

[jwt]: https://jwt.io/
[messaging]: ./messaging.md
[rf5280]: https://tools.ietf.org/html/rfc5280
[ssl-makefile]: https://github.com/absmach/supermq/blob/main/docker/ssl/Makefile
[provision]: ./provision.md#platform-management
[openssl]: https://www.openssl.org/
[vault]: https://www.vaultproject.io/
[oidc]: https://openid.net/connect/
[google-identity-platform]: https://cloud.google.com/identity-platform/docs/
[google-identity-platform-docs]: https://support.google.com/cloud/answer/6158849?hl=en
