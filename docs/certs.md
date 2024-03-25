# Certs

Provisioning is a process of configuration of an IoT platform in which system operator creates and sets-up different entities used in the platform - users, groups, channels and things.

## Certs Service

Issues certificates for things. `Certs` service can create certificates to be used when `Magistrala` is deployed to support mTLS.  
`Certs` service will create certificate for valid thing ID if valid user token is passed and user is owner of the provided thing ID.

Certificate service can create certificates in PKI mode - where certificates issued by PKI, when you deploy `Vault` as PKI certificate management `cert` service will proxy requests to `Vault` previously checking access rights and saving info on successfully created certificate.

### PKI mode

When `MG_CERTS_VAULT_HOST` is set, it is presumed that `Vault` is installed and `certs` service will issue certificates using `Vault` API.

First you'll need to set up `Vault`.

To setup `Vault` follow steps in [Build Your Own Certificate Authority (CA)][vault-pki-engine].

To setup certs service with `Vault` following environment variables must be set:

```bash
MG_CERTS_VAULT_HOST=vault-domain.com
MG_CERTS_VAULT_PKI_PATH=<vault_pki_path>
MG_CERTS_VAULT_ROLE=<vault_role>
MG_CERTS_VAULT_TOKEN=<vault_acces_token>
```

For lab purposes you can use docker-compose and script for setting up PKI in [meodor-vault][meodor-vault].

Make sure you have an already running instance of `Magistrala` , `Vault` and `Certs` service.

To start Magistrala run:

```bash
make run up args="-d"
```

To start vault run:

```bash
make run_addons vault up args="-d"
```

When vault service is up and running some initializations steps must be done to setup things for `Certs` service. For more information about this steps please check [magistrala-vault][magistrala-vault]

```bash
bash docker/addons/vault/vault-init.sh
bash docker/addons/vault/vault-unseal.sh
bash docker/addons/vault/vault-set-pki.sh
```

`vault-init.sh` initializes Vault, generates unseal keys and root tokens, and updates corresponding environment variables in the `.env` file. It's important to securely store these keys as they are required to unseal Vault.

`vault-unseal.sh` is used to unseal Vault after initialization, but it's typically not needed since Vault can unseal itself when starting the container.

`vault-set-pki.sh` generates certificates for Vault, including root and intermediate certificates, and copies them to the `docker/ssl/certs` folder. The CA parameters are sourced from environment variables in the `.env` file.

To start certs service run:

```bash
make run_addons certs up args="-d"
```

Provision a thing:

```bash
magistrala-cli provision test
```

To stop certs service run:

```bash
make run_addons certs down
```

To stop vault service run:

```bash
make run_addons vault down
```

This step can be skipped if you already have a thing ID.

#### 1. Issue a certificate

```bash
magistrala-cli certs issue <thing_id> <user_auth_token> [--ttl=8760h]
```

For example:

```bash
magistrala-cli certs issue f13f0f30-f923-4504-8a7a-6aa45bcb4866 $USER_TOKEN

{
  "cert_serial": "6f:35:d5:9d:47:9d:23:50:08:f7:31:13:82:22:e4:c8:e6:cf:2c:c1",
  "client_cert": "-----BEGIN CERTIFICATE-----\nMIIEATCCAumgAwIBAgIUbzXVnUedI1AI9zETgiLkyObPLMEwDQYJKoZIhvcNAQEL\nBQAwLjEsMCoGA1UEAxMjbWFpbmZsdXguY29tIEludGVybWVkaWF0ZSBBdXRob3Jp\ndHkwHhcNMjMwOTE0MTEwOTI5WhcNMjMxMDE0MTEwOTU4WjAvMS0wKwYDVQQDEyRi\nYTFmMmIxNi01MjA3LTQ2MDgtYTRkZS01ZmFiZmI4NjI3YzIwggEiMA0GCSqGSIb3\nDQEBAQUAA4IBDwAwggEKAoIBAQC9RxcHaTzn18vBdWWZf37K8Grc5dLW/m8vhwOJ\n8oe3iPUiE7xFijIXKw236R1NBh8fLT6/2lia/p4acZtls3yFRphooDwP7S2OiJRI\ngGb/r0SYmSnQKjHbdbixauNECGk1TDNSGvmpNSzvAZvYSJAvd5ZpYf/8Db9IBW0N\nvbI7TfIJHay8vC/0rn1BsmC3x+3nEm0W+Z5udC/UT4+pQn7QWrBsxjVT4r5WY0SQ\nkVhA9Wo+Wpzmy1CMC4X6yLmiIHmfRFlktDxKgPpyy/3zhAE2CkBpT7JEQ723Mv+m\n37oM2EJog+tgIZMExxDbw3Epqgo07B9DWpSZSBHCISeN/TzdAgMBAAGjggEUMIIB\nEDAOBgNVHQ8BAf8EBAMCA6gwHQYDVR0lBBYwFAYIKwYBBQUHAwEGCCsGAQUFBwMC\nMB0GA1UdDgQWBBTAoqWVu8ctNmw5CKUBxsUKVDX+PDAfBgNVHSMEGDAWgBS7dmaT\nr5vJJPtV5dReawbYKhxzYzA7BggrBgEFBQcBAQQvMC0wKwYIKwYBBQUHMAKGH2h0\ndHA6Ly92YXVsdDo4MjAwL3YxL3BraV9pbnQvY2EwLwYDVR0RBCgwJoIkYmExZjJi\nMTYtNTIwNy00NjA4LWE0ZGUtNWZhYmZiODYyN2MyMDEGA1UdHwQqMCgwJqAkoCKG\nIGh0dHA6Ly92YXVsdDo4MjAwL3YxL3BraV9pbnQvY3JsMA0GCSqGSIb3DQEBCwUA\nA4IBAQCKMmDzyWWmuSJPh3O9hppRJ6mkX9gut4jP2rwowNv7haj3iu+hR8+GnTix\nu5oy3bZdmRryhhW0XyJsbCKO/z+wsY/RfVgMxF/c1cbmEzki804+AB4a4yNhQD6g\noEEQBD58b6mFi/vPCRiGZmmo5TqMlA37jBRSVnKO/CoH1CAvjqmfWdSoO4IC4uD4\nJev+QNr9wlOimYcA/usmo7rmqz7IB9R/Laxcdkq9iZelKly/jhftEbKgGf2NR/d7\nEKVONjCEp6fL2iBaQSA/899oJJ7QPqE5X821HhBlXKvNmZnYRyUmAS2h1jnxtovp\nsNGcLFRgIAFdaGl1172C7mBZF4C3\n-----END CERTIFICATE-----",
  "client_key": "-----BEGIN RSA PRIVATE KEY-----\nMIIEowIBAAKCAQEAvUcXB2k859fLwXVlmX9+yvBq3OXS1v5vL4cDifKHt4j1IhO8\nRYoyFysNt+kdTQYfHy0+v9pYmv6eGnGbZbN8hUaYaKA8D+0tjoiUSIBm/69EmJkp\n0Cox23W4sWrjRAhpNUwzUhr5qTUs7wGb2EiQL3eWaWH//A2/SAVtDb2yO03yCR2s\nvLwv9K59QbJgt8ft5xJtFvmebnQv1E+PqUJ+0FqwbMY1U+K+VmNEkJFYQPVqPlqc\n5stQjAuF+si5oiB5n0RZZLQ8SoD6csv984QBNgpAaU+yREO9tzL/pt+6DNhCaIPr\nYCGTBMcQ28NxKaoKNOwfQ1qUmUgRwiEnjf083QIDAQABAoIBADKd7kSnGgiOJwkn\nUfJIrCmtPYaxVz7zb9xv6LxdRXoJgDSKvpCCMn8LnnGOP623c18tBFjeFU/tw24i\n74G1DBnAFUX1g9pmfQZe8/injePWhSuh2hK3FfowcyHPCdPJxAjixd6xJA7iD5Aj\nCABA934aJvkrof9P1dV2zgEct6sv6GPwUgSZxTYVNyU93T/pmvodvpNTYd3uk71A\nLCC5Ojv2gEOkHUWHhMntz7bl6wcH/atk//uYoYxcjZ811tL7/7xwUbyRxFD/b6kP\niptdoXBv27eWWKOtFMgF9iNkhefSKkmHZZWIL1J5CFE8fUdddeLoOa0e7a9vhYS9\n5TMzC2kCgYEA+TJf60QP3rjEgm6bJw1h48ffkPkZTsdp083GoJB77yXUH7m9Wt9g\nlYSALN+67fnkXPEe/C9SInMDRMp9VoswOHeJCFbCNdx5Klv8KKuMZMk0yCZifhx6\nBl7IsVlmlzq3EhK1ZjOVWMxvwS7MlMpPAcsc8DGhwhv9sXW3k2nMevsCgYEAwnHx\nheuaYgE/HrE/GEcPNAwy/uyBb8wxoKavl8OKEyPH+LK8powo9xss8zi+yEYHfSQP\nnJ45Rdz/HGl5QIwD4CjA3Vrm0sTMh094DPp9KhxcOwIhK/IvUJ0deKwHRWek/+c8\nwbD6HfX2Vtu5RU9z2KS7VtazjU5TkIbKP29LoAcCgYAUKAv0JrQ16rISbsnj9cQm\nPYOK4Ws3oQ+hTzKyyB0OMfwfeNGlKQ5R6b7IYmxnVWAwWFyOP3GgUbdA+DP9LRMA\nbkLKRuI8oxG16GzUCVQ4zsGTMu+ijcEdBMus9LNEpj4qmxLLKn75CMg9UwC/REHx\nvjEgCJOx9LungAMSTGt6wwKBgQCXvSGUt6pvhreCNSGeyX1EyaxWIaxU2U11J/7p\neQ/cJdUc8Cal9cTWKV/nokXHtlaLwsNoHlVlfrOasXiM9XbkzAjN9O0iV6+gfFSc\nFDHu1djnt565U7K2vxVLoTu/XsV1ajeQk5JsJRCK8cbgHsOxscP8XWobAJ/XrkhQ\nPoMOqwKBgD8goECBKj+SofUfqKCnGf3E2MWF3kTZMfPaBcuV8TaGMWRRljMmK8YT\npew6IIkAFrsIaXxQsym2JQ+j/L2AoxQkzlf2VF4SaBfUUByT3NijSBpD/d3xRlWA\n7UUO0d72YFnPTqY98Ch/fbKnaCRL/Usv8c9nCt5IdmnihYnuvxYT\n-----END RSA PRIVATE KEY-----",
  "expiration": "2023-10-14T11:09:58Z",
  "thing_id": "f13f0f30-f923-4504-8a7a-6aa45bcb4866"
}
```

#### 2. Retrieve a certificate

```bash
magistrala-cli certs get [<cert_serial> | thing <thing_id>] <user_auth_token>
```

For example:

```bash
magistrala-cli certs get 6f:35:d5:9d:47:9d:23:50:08:f7:31:13:82:22:e4:c8:e6:cf:2c:c1 $USER_TOKEN
{
  "cert_serial": "6f:35:d5:9d:47:9d:23:50:08:f7:31:13:82:22:e4:c8:e6:cf:2c:c1",
  "client_cert": "-----BEGIN CERTIFICATE-----\nMIIEATCCAumgAwIBAgIUbzXVnUedI1AI9zETgiLkyObPLMEwDQYJKoZIhvcNAQEL\nBQAwLjEsMCoGA1UEAxMjbWFpbmZsdXguY29tIEludGVybWVkaWF0ZSBBdXRob3Jp\ndHkwHhcNMjMwOTE0MTEwOTI5WhcNMjMxMDE0MTEwOTU4WjAvMS0wKwYDVQQDEyRi\nYTFmMmIxNi01MjA3LTQ2MDgtYTRkZS01ZmFiZmI4NjI3YzIwggEiMA0GCSqGSIb3\nDQEBAQUAA4IBDwAwggEKAoIBAQC9RxcHaTzn18vBdWWZf37K8Grc5dLW/m8vhwOJ\n8oe3iPUiE7xFijIXKw236R1NBh8fLT6/2lia/p4acZtls3yFRphooDwP7S2OiJRI\ngGb/r0SYmSnQKjHbdbixauNECGk1TDNSGvmpNSzvAZvYSJAvd5ZpYf/8Db9IBW0N\nvbI7TfIJHay8vC/0rn1BsmC3x+3nEm0W+Z5udC/UT4+pQn7QWrBsxjVT4r5WY0SQ\nkVhA9Wo+Wpzmy1CMC4X6yLmiIHmfRFlktDxKgPpyy/3zhAE2CkBpT7JEQ723Mv+m\n37oM2EJog+tgIZMExxDbw3Epqgo07B9DWpSZSBHCISeN/TzdAgMBAAGjggEUMIIB\nEDAOBgNVHQ8BAf8EBAMCA6gwHQYDVR0lBBYwFAYIKwYBBQUHAwEGCCsGAQUFBwMC\nMB0GA1UdDgQWBBTAoqWVu8ctNmw5CKUBxsUKVDX+PDAfBgNVHSMEGDAWgBS7dmaT\nr5vJJPtV5dReawbYKhxzYzA7BggrBgEFBQcBAQQvMC0wKwYIKwYBBQUHMAKGH2h0\ndHA6Ly92YXVsdDo4MjAwL3YxL3BraV9pbnQvY2EwLwYDVR0RBCgwJoIkYmExZjJi\nMTYtNTIwNy00NjA4LWE0ZGUtNWZhYmZiODYyN2MyMDEGA1UdHwQqMCgwJqAkoCKG\nIGh0dHA6Ly92YXVsdDo4MjAwL3YxL3BraV9pbnQvY3JsMA0GCSqGSIb3DQEBCwUA\nA4IBAQCKMmDzyWWmuSJPh3O9hppRJ6mkX9gut4jP2rwowNv7haj3iu+hR8+GnTix\nu5oy3bZdmRryhhW0XyJsbCKO/z+wsY/RfVgMxF/c1cbmEzki804+AB4a4yNhQD6g\noEEQBD58b6mFi/vPCRiGZmmo5TqMlA37jBRSVnKO/CoH1CAvjqmfWdSoO4IC4uD4\nJev+QNr9wlOimYcA/usmo7rmqz7IB9R/Laxcdkq9iZelKly/jhftEbKgGf2NR/d7\nEKVONjCEp6fL2iBaQSA/899oJJ7QPqE5X821HhBlXKvNmZnYRyUmAS2h1jnxtovp\nsNGcLFRgIAFdaGl1172C7mBZF4C3\n-----END CERTIFICATE-----",
  "expiration": "2023-10-14T11:09:58Z",
  "thing_id": "f13f0f30-f923-4504-8a7a-6aa45bcb4866"
}
```

```bash
magistrala-cli certs get thing f13f0f30-f923-4504-8a7a-6aa45bcb4866 $USER_TOKEN
{
  "certs": [
    {
      "cert_serial": "6f:35:d5:9d:47:9d:23:50:08:f7:31:13:82:22:e4:c8:e6:cf:2c:c1",
      "expiration": "0001-01-01T00:00:00Z"
    }
  ],
  "limit": 10,
  "offset": 0,
  "total": 1
}
```

#### 3. Revoke a certificate

```bash
magistrala-cli certs revoke <thing_id> <user_auth_token>
```

For example:

```bash
magistrala-cli certs revoke f13f0f30-f923-4504-8a7a-6aa45bcb4866 $USER_TOKEN

revoked: 2023-09-14 11:21:44 +0000 UTC
```

For more information about the Certification service API, please check out the [API documentation][api-docs].

[vault-pki-engine]: https://learn.hashicorp.com/tutorials/vault/pki-engine
[meodor-vault]: https://github.com/mteodor/vault
[api-docs]: https://github.com/absmach/magistrala/blob/main/api/openapi/certs.yml
[magistrala-vault]: https://github.com/absmach/magistrala/blob/main/docker/addons/vault/README.md#setup
