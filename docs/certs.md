---
title: Certs
---


Provisioning is a process of configuration of an IoT platform in which system operator creates and sets-up different entities used in the platform - users, groups, channels and clients.

## Certs Service

Issues certificates for clients. `Certs` service can create certificates to be used when `SuperMQ` is deployed to support mTLS.  
`Certs` service will create certificate for valid client ID if valid user token is passed and user is owner of the provided client ID.

Certificate service can create certificates in PKI mode - where certificates issued by PKI, when you deploy `OpenBao` as PKI certificate management `cert` service will proxy requests to `OpenBao` previously checking access rights and saving info on successfully created certificate.

### PKI mode

When `AM_CERTS_OPENBAO_HOST` is set, the `certs` service will issue certificates using `OpenBao` API.

First you'll need to set up `OpenBao`.

OpenBao is an open-source fork of HashiCorp Vault, providing the same PKI functionality. To learn more about PKI engines, see the [HashiCorp Vault PKI documentation][vault-pki-engine] which applies to OpenBao as well.

To setup certs service with `OpenBao` following environment variables must be set:

```bash
AM_CERTS_OPENBAO_HOST=http://certs-openbao:8200
AM_CERTS_OPENBAO_PKI_PATH=<openbao_pki_path>
AM_CERTS_OPENBAO_ROLE=<openbao_role>
AM_CERTS_OPENBAO_APP_ROLE=<app_role_id>
AM_CERTS_OPENBAO_APP_SECRET=<app_secret_id>
```

Make sure you have an already running instance of `SuperMQ`, `OpenBao` and `Certs` service.

To start SuperMQ run:

```bash
make run_stable args="-d"
```

To start the certs service with OpenBao run:

```bash
make run_addons certs up args="-d"
```

The OpenBao container will automatically initialize and configure itself on first run:

1. **Initialization**: If this is the first time running, OpenBao will be initialized with 5 key shares and a threshold of 3 keys required to unseal. The initialization data (unseal keys and root token) will be saved in `/opt/openbao/data/init.json` within the container.

2. **Unsealing**: OpenBao will automatically unseal itself using the stored keys or the keys provided via environment variables (`AM_CERTS_OPENBAO_UNSEAL_KEY_1`, `AM_CERTS_OPENBAO_UNSEAL_KEY_2`, `AM_CERTS_OPENBAO_UNSEAL_KEY_3`).

3. **PKI Configuration**: The entrypoint script will:
   - Enable the AppRole authentication method
   - Enable PKI secrets engines (root CA at `pki` and intermediate CA at `pki_int`)
   - Generate a root CA certificate based on environment variables
   - Create an intermediate CA and sign it with the root CA
   - Configure a PKI role for certificate issuance
   - Set up AppRole authentication with the specified role ID and secret ID

**Important Notes:**
- On first run, the unseal keys and root token are generated and stored in the container volume.
- For production deployments, you should pre-configure `AM_CERTS_OPENBAO_UNSEAL_KEY_1`, `AM_CERTS_OPENBAO_UNSEAL_KEY_2`, `AM_CERTS_OPENBAO_UNSEAL_KEY_3`, and `AM_CERTS_OPENBAO_ROOT_TOKEN` in your `.env` file.
- The AppRole credentials (`AM_CERTS_OPENBAO_APP_ROLE` and `AM_CERTS_OPENBAO_APP_SECRET`) should be set and kept secure.
- Secret IDs have a configurable TTL (default: 87600h / ~10 years). Monitor and rotate them before expiration.


Provision a client:

```bash
supermq-cli provision test
```

To stop certs service run:

```bash
make run_addons certs down
```

**Note:** Stopping the certs service will also stop the OpenBao container. All data (certificates, keys, configuration) is persisted in Docker volumes and will be available when you restart the service.

This step can be skipped if you already have a client ID.

### API Structure

The Certs service exposes both authenticated and public endpoints:

#### Authenticated Endpoints (require user authentication)

All authenticated endpoints are prefixed with `/{domainID}/certs/`:

- **POST** `/{domainID}/certs/issue/{entityID}` - Issue a new certificate for an entity
- **PATCH** `/{domainID}/certs/{id}/renew` - Renew an existing certificate by serial number
- **PATCH** `/{domainID}/certs/{id}/revoke` - Revoke a certificate by serial number
- **DELETE** `/{domainID}/certs/{entityID}/delete` - Revoke all certificates for an entity
- **GET** `/{domainID}/certs/` - List certificates (supports filtering by entity ID, pagination)
- **GET** `/{domainID}/certs/{id}` - View certificate details by serial number
- **POST** `/{domainID}/certs/csrs/{entityID}` - Issue certificate from a Certificate Signing Request (CSR)

#### Public Endpoints

- **POST** `/certs/ocsp` - OCSP (Online Certificate Status Protocol) responder for certificate validation
- **GET** `/certs/crl` - Generate and retrieve Certificate Revocation List (CRL)
- **GET** `/certs/view-ca` - View CA certificate chain details
- **GET** `/certs/download-ca` - Download CA certificate chain as a ZIP file

#### Internal Endpoints (require secret authentication)

- **POST** `/certs/csrs/{entityID}` - Internal endpoint for issuing certificates from CSR (authenticated via bearer token with service secret)

#### Health and Metrics

- **GET** `/health` - Service health check endpoint
- **GET** `/metrics` - Prometheus metrics endpoint

### Usage Examples

#### Request Parameters

**Query Parameters for List Endpoints:**
- `offset` - Pagination offset (default: 0)
- `limit` - Number of items per page (default: 10)
- `entity_id` - Filter certificates by entity ID
- `ttl` - Time to live for certificates (e.g., "8760h" for 1 year)

**Issue Certificate Request Body:**
```json
{
  "ttl": "8760h",
  "ip_addrs": ["192.168.1.1"],
  "options": {
    "common_name": "example.com",
    "organization": "Example Org",
    "organizational_unit": "IT",
    "country": "US",
    "province": "California",
    "locality": "San Francisco",
    "street_address": "123 Main St",
    "postal_code": "94102",
    "dns_names": ["example.com", "www.example.com"],
    "email_addresses": ["admin@example.com"]
  }
}
```

**Issue from CSR Request Body:**
```json
{
  "csr": "-----BEGIN CERTIFICATE REQUEST-----\n...\n-----END CERTIFICATE REQUEST-----"
}
```

#### 1. Issue a certificate

```bash
supermq-cli certs issue <client_id> <user_auth_token> [--ttl=8760h]
```

**API Endpoint:** `POST /{domainID}/certs/issue/{entityID}`

**Response:**
```json
{
  "serial_number": "6f:35:d5:9d:47:9d:23:50:08:f7:31:13:82:22:e4:c8:e6:cf:2c:c1",
  "certificate": "-----BEGIN CERTIFICATE-----\n...\n-----END CERTIFICATE-----",
  "key": "-----BEGIN RSA PRIVATE KEY-----\n...\n-----END RSA PRIVATE KEY-----",
  "expiry_time": "2024-10-14T11:09:58Z",
  "entity_id": "f13f0f30-f923-4504-8a7a-6aa45bcb4866",
  "revoked": false,
  "issued": true
}
```

For example:

```bash
supermq-cli certs issue f13f0f30-f923-4504-8a7a-6aa45bcb4866 $USER_TOKEN

{
  "serial_number": "6f:35:d5:9d:47:9d:23:50:08:f7:31:13:82:22:e4:c8:e6:cf:2c:c1",
  "certificate": "-----BEGIN CERTIFICATE-----\nMIIEATCCAumgAwIBAgIUbzXVnUedI1AI9zETgiLkyObPLMEwDQYJKoZIhvcNAQEL\nBQAwLjEsMCoGA1UEAxMjbWFpbmZsdXguY29tIEludGVybWVkaWF0ZSBBdXRob3Jp\ndHkwHhcNMjMwOTE0MTEwOTI5WhcNMjMxMDE0MTEwOTU4WjAvMS0wKwYDVQQDEyRi\nYTFmMmIxNi01MjA3LTQ2MDgtYTRkZS01ZmFiZmI4NjI3YzIwggEiMA0GCSqGSIb3\nDQEBAQUAA4IBDwAwggEKAoIBAQC9RxcHaTzn18vBdWWZf37K8Grc5dLW/m8vhwOJ\n8oe3iPUiE7xFijIXKw236R1NBh8fLT6/2lia/p4acZtls3yFRphooDwP7S2OiJRI\ngGb/r0SYmSnQKjHbdbixauNECGk1TDNSGvmpNSzvAZvYSJAvd5ZpYf/8Db9IBW0N\nvbI7TfIJHay8vC/0rn1BsmC3x+3nEm0W+Z5udC/UT4+pQn7QWrBsxjVT4r5WY0SQ\nkVhA9Wo+Wpzmy1CMC4X6yLmiIHmfRFlktDxKgPpyy/3zhAE2CkBpT7JEQ723Mv+m\n37oM2EJog+tgIZMExxDbw3Epqgo07B9DWpSZSBHCISeN/TzdAgMBAAGjggEUMIIB\nEDAOBgNVHQ8BAf8EBAMCA6gwHQYDVR0lBBYwFAYIKwYBBQUHAwEGCCsGAQUFBwMC\nMB0GA1UdDgQWBBTAoqWVu8ctNmw5CKUBxsUKVDX+PDAfBgNVHSMEGDAWgBS7dmaT\nr5vJJPtV5dReawbYKhxzYzA7BggrBgEFBQcBAQQvMC0wKwYIKwYBBQUHMAKGH2h0\ndHA6Ly92YXVsdDo4MjAwL3YxL3BraV9pbnQvY2EwLwYDVR0RBCgwJoIkYmExZjJi\nMTYtNTIwNy00NjA4LWE0ZGUtNWZhYmZiODYyN2MyMDEGA1UdHwQqMCgwJqAkoCKG\nIGh0dHA6Ly92YXVsdDo4MjAwL3YxL3BraV9pbnQvY3JsMA0GCSqGSIb3DQEBCwUA\nA4IBAQCKMmDzyWWmuSJPh3O9hppRJ6mkX9gut4jP2rwowNv7haj3iu+hR8+GnTix\nu5oy3bZdmRryhhW0XyJsbCKO/z+wsY/RfVgMxF/c1cbmEzki804+AB4a4yNhQD6g\noEEQBD58b6mFi/vPCRiGZmmo5TqMlA37jBRSVnKO/CoH1CAvjqmfWdSoO4IC4uD4\nJev+QNr9wlOimYcA/usmo7rmqz7IB9R/Laxcdkq9iZelKly/jhftEbKgGf2NR/d7\nEKVONjCEp6fL2iBaQSA/899oJJ7QPqE5X821HhBlXKvNmZnYRyUmAS2h1jnxtovp\nsNGcLFRgIAFdaGl1172C7mBZF4C3\n-----END CERTIFICATE-----",
  "key": "-----BEGIN RSA PRIVATE KEY-----\nMIIEowIBAAKCAQEAvUcXB2k859fLwXVlmX9+yvBq3OXS1v5vL4cDifKHt4j1IhO8\nRYoyFysNt+kdTQYfHy0+v9pYmv6eGnGbZbN8hUaYaKA8D+0tjoiUSIBm/69EmJkp\n0Cox23W4sWrjRAhpNUwzUhr5qTUs7wGb2EiQL3eWaWH//A2/SAVtDb2yO03yCR2s\nvLwv9K59QbJgt8ft5xJtFvmebnQv1E+PqUJ+0FqwbMY1U+K+VmNEkJFYQPVqPlqc\n5stQjAuF+si5oiB5n0RZZLQ8SoD6csv984QBNgpAaU+yREO9tzL/pt+6DNhCaIPr\nYCGTBMcQ28NxKaoKNOwfQ1qUmUgRwiEnjf083QIDAQABAoIBADKd7kSnGgiOJwkn\nUfJIrCmtPYaxVz7zb9xv6LxdRXoJgDSKvpCCMn8LnnGOP623c18tBFjeFU/tw24i\n74G1DBnAFUX1g9pmfQZe8/injePWhSuh2hK3FfowcyHPCdPJxAjixd6xJA7iD5Aj\nCABA934aJvkrof9P1dV2zgEct6sv6GPwUgSZxTYVNyU93T/pmvodvpNTYd3uk71A\nLCC5Ojv2gEOkHUWHhMntz7bl6wcH/atk//uYoYxcjZ811tL7/7xwUbyRxFD/b6kP\niptdoXBv27eWWKOtFMgF9iNkhefSKkmHZZWIL1J5CFE8fUdddeLoOa0e7a9vhYS9\n5TMzC2kCgYEA+TJf60QP3rjEgm6bJw1h48ffkPkZTsdp083GoJB77yXUH7m9Wt9g\nlYSALN+67fnkXPEe/C9SInMDRMp9VoswOHeJCFbCNdx5Klv8KKuMZMk0yCZifhx6\nBl7IsVlmlzq3EhK1ZjOVWMxvwS7MlMpPAcsc8DGhwhv9sXW3k2nMevsCgYEAwnHx\nheuaYgE/HrE/GEcPNAwy/uyBb8wxoKavl8OKEyPH+LK8powo9xss8zi+yEYHfSQP\nnJ45Rdz/HGl5QIwD4CjA3Vrm0sTMh094DPp9KhxcOwIhK/IvUJ0deKwHRWek/+c8\nwbD6HfX2Vtu5RU9z2KS7VtazjU5TkIbKP29LoAcCgYAUKAv0JrQ16rISbsnj9cQm\nPYOK4Ws3oQ+hTzKyyB0OMfwfeNGlKQ5R6b7IYmxnVWAwWFyOP3GgUbdA+DP9LRMA\nbkLKRuI8oxG16GzUCVQ4zsGTMu+ijcEdBMus9LNEpj4qmxLLKn75CMg9UwC/REHx\nvjEgCJOx9LungAMSTGt6wwKBgQCXvSGUt6pvhreCNSGeyX1EyaxWIaxU2U11J/7p\neQ/cJdUc8Cal9cTWKV/nokXHtlaLwsNoHlVlfrOasXiM9XbkzAjN9O0iV6+gfFSc\nFDHu1djnt565U7K2vxVLoTu/XsV1ajeQk5JsJRCK8cbgHsOxscP8XWobAJ/XrkhQ\nPoMOqwKBgD8goECBKj+SofUfqKCnGf3E2MWF3kTZMfPaBcuV8TaGMWRRljMmK8YT\npew6IIkAFrsIaXxQsym2JQ+j/L2AoxQkzlf2VF4SaBfUUByT3NijSBpD/d3xRlWA\n7UUO0d72YFnPTqY98Ch/fbKnaCRL/Usv8c9nCt5IdmnihYnuvxYT\n-----END RSA PRIVATE KEY-----",
  "expiry_time": "2023-10-14T11:09:58Z",
  "entity_id": "f13f0f30-f923-4504-8a7a-6aa45bcb4866"
  "revoked": false
}
```

#### 2. Retrieve a certificate

```bash
supermq-cli certs get [<cert_serial> | client <client_id>] <user_auth_token>
```

**API Endpoint:** `GET /{domainID}/certs/{serial_number}`

For example:

```bash
supermq-cli certs get 6f:35:d5:9d:47:9d:23:50:08:f7:31:13:82:22:e4:c8:e6:cf:2c:c1 $USER_TOKEN
```

**Response:**
```json
{
  "serial_number": "6f:35:d5:9d:47:9d:23:50:08:f7:31:13:82:22:e4:c8:e6:cf:2c:c1",
  "certificate": "-----BEGIN CERTIFICATE-----\nMIIEATCCAumgAwIBAgIUbzXVnUedI1AI9zETgiLkyObPLMEwDQYJKoZIhvcNAQEL\nBQAwLjEsMCoGA1UEAxMjbWFpbmZsdXguY29tIEludGVybWVkaWF0ZSBBdXRob3Jp\ndHkwHhcNMjMwOTE0MTEwOTI5WhcNMjMxMDE0MTEwOTU4WjAvMS0wKwYDVQQDEyRi\nYTFmMmIxNi01MjA3LTQ2MDgtYTRkZS01ZmFiZmI4NjI3YzIwggEiMA0GCSqGSIb3\nDQEBAQUAA4IBDwAwggEKAoIBAQC9RxcHaTzn18vBdWWZf37K8Grc5dLW/m8vhwOJ\n8oe3iPUiE7xFijIXKw236R1NBh8fLT6/2lia/p4acZtls3yFRphooDwP7S2OiJRI\ngGb/r0SYmSnQKjHbdbixauNECGk1TDNSGvmpNSzvAZvYSJAvd5ZpYf/8Db9IBW0N\nvbI7TfIJHay8vC/0rn1BsmC3x+3nEm0W+Z5udC/UT4+pQn7QWrBsxjVT4r5WY0SQ\nkVhA9Wo+Wpzmy1CMC4X6yLmiIHmfRFlktDxKgPpyy/3zhAE2CkBpT7JEQ723Mv+m\n37oM2EJog+tgIZMExxDbw3Epqgo07B9DWpSZSBHCISeN/TzdAgMBAAGjggEUMIIB\nEDAOBgNVHQ8BAf8EBAMCA6gwHQYDVR0lBBYwFAYIKwYBBQUHAwEGCCsGAQUFBwMC\nMB0GA1UdDgQWBBTAoqWVu8ctNmw5CKUBxsUKVDX+PDAfBgNVHSMEGDAWgBS7dmaT\nr5vJJPtV5dReawbYKhxzYzA7BggrBgEFBQcBAQQvMC0wKwYIKwYBBQUHMAKGH2h0\ndHA6Ly92YXVsdDo4MjAwL3YxL3BraV9pbnQvY2EwLwYDVR0RBCgwJoIkYmExZjJi\nMTYtNTIwNy00NjA4LWE0ZGUtNWZhYmZiODYyN2MyMDEGA1UdHwQqMCgwJqAkoCKG\nIGh0dHA6Ly92YXVsdDo4MjAwL3YxL3BraV9pbnQvY3JsMA0GCSqGSIb3DQEBCwUA\nA4IBAQCKMmDzyWWmuSJPh3O9hppRJ6mkX9gut4jP2rwowNv7haj3iu+hR8+GnTix\nu5oy3bZdmRryhhW0XyJsbCKO/z+wsY/RfVgMxF/c1cbmEzki804+AB4a4yNhQD6g\noEEQBD58b6mFi/vPCRiGZmmo5TqMlA37jBRSVnKO/CoH1CAvjqmfWdSoO4IC4uD4\nJev+QNr9wlOimYcA/usmo7rmqz7IB9R/Laxcdkq9iZelKly/jhftEbKgGf2NR/d7\nEKVONjCEp6fL2iBaQSA/899oJJ7QPqE5X821HhBlXKvNmZnYRyUmAS2h1jnxtovp\nsNGcLFRgIAFdaGl1172C7mBZF4C3\n-----END CERTIFICATE-----",
  "key": "-----BEGIN RSA PRIVATE KEY-----\n...\n-----END RSA PRIVATE KEY-----",
  "expiry_time": "2023-10-14T11:09:58Z",
  "entity_id": "f13f0f30-f923-4504-8a7a-6aa45bcb4866",
  "revoked": false
}
```

**List certificates by entity:**

```bash
supermq-cli certs get client f13f0f30-f923-4504-8a7a-6aa45bcb4866 $USER_TOKEN
```

**API Endpoint:** `GET /{domainID}/certs?entity_id={client_id}&offset=0&limit=10`

```json
{
  "certificates": [
    {
      "serial_number": "6f:35:d5:9d:47:9d:23:50:08:f7:31:13:82:22:e4:c8:e6:cf:2c:c1",
      "expiry_time": "2023-10-14T11:09:58Z",
      "entity_id": "f13f0f30-f923-4504-8a7a-6aa45bcb4866",
      "revoked": false
    }
  ],
  "total": 1,
  "offset": 0,
  "limit": 10
}
```

#### 3. Revoke a certificate

```bash
supermq-cli certs revoke <client_id> <user_auth_token>
```

**API Endpoint:** `PATCH /{domainID}/certs/{serial_number}/revoke`

For example:

```bash
supermq-cli certs revoke f13f0f30-f923-4504-8a7a-6aa45bcb4866 $USER_TOKEN
```

**Response:**
```json
{
  "revoked": true
}
```

Or via curl:

```bash
curl -X PATCH \
  http://localhost:9010/{domainID}/certs/6f:35:d5:9d:47:9d:23:50:08:f7:31:13:82:22:e4:c8:e6:cf:2c:c1/revoke \
  -H "Authorization: Bearer $USER_TOKEN"
```

**Note:** The service will revoke the certificate in OpenBao, making it invalid for future use.

#### 4. Renew a certificate

**API Endpoint:** `PATCH /{domainID}/certs/{serial_number}/renew`

Renew an existing certificate before it expires. The renewed certificate will have:
- A new serial number
- Extended validity period (default: 30 days from renewal time)
- Same subject and key parameters as the original

**Important:** 
- Cannot renew revoked certificates
- The original certificate remains valid until its expiration

```bash
curl -X PATCH \
  http://localhost:9010/{domainID}/certs/{serial_number}/renew \
  -H "Authorization: Bearer $USER_TOKEN"
```

**Response:**
```json
{
  "renewed": true,
  "certificate": {
    "serial_number": "7a:45:e6:ae:58:ae:34:61:19:f8:42:24:93:33:f5:d9:f7:d0:3d:d2",
    "certificate": "-----BEGIN CERTIFICATE-----\n...\n-----END CERTIFICATE-----",
    "key": "-----BEGIN RSA PRIVATE KEY-----\n...\n-----END RSA PRIVATE KEY-----",
    "expiry_time": "2024-11-14T11:09:58Z",
    "entity_id": "f13f0f30-f923-4504-8a7a-6aa45bcb4866",
    "revoked": false
  }
}
```

#### 5. Delete all certificates for an entity

**API Endpoint:** `DELETE /{domainID}/certs/{entityID}/delete`

Revoke all certificates associated with a specific entity. This operation:
- Revokes all certificates in OpenBao
- Removes the entity-to-certificate mappings from the database
- Is irreversible

```bash
curl -X DELETE \
  http://localhost:9010/{domainID}/certs/{entityID}/delete \
  -H "Authorization: Bearer $USER_TOKEN"
```

**Response:**
```json
{
  "deleted": true
}
```

**Error Response (no certificates found):**
```json
{
  "deleted": false,
  "error": "no certificates found for entity ID: f13f0f30-f923-4504-8a7a-6aa45bcb4866"
}
```

#### 6. View CA Certificate Chain

**API Endpoint:** `GET /certs/view-ca`

Retrieve the CA certificate chain details (intermediate CA certificate).

```bash
curl -X GET http://localhost:9010/certs/view-ca
```

**Response:**
```json
{
  "serial_number": "1a:2b:3c:4d:5e:6f:7a:8b:9c:0d:1e:2f:3a:4b:5c:6d",
  "certificate": "-----BEGIN CERTIFICATE-----\n...\n-----END CERTIFICATE-----",
  "expiry_time": "2025-07-14T11:09:58Z",
  "entity_id": "Abstract Machines Certificate Authority Intermediate",
  "revoked": false
}
```

#### 7. Download CA Certificate Chain

**API Endpoint:** `GET /certs/download-ca`

Download the complete CA certificate chain (root + intermediate) as a ZIP file containing `ca.crt`.

```bash
curl -X GET http://localhost:9010/certs/download-ca -o ca.zip
```

**Response Headers:**
```
Content-Type: application/zip
Content-Disposition: attachment; filename=ca.zip
```

The downloaded ZIP file contains the CA certificate chain that can be used to verify certificates issued by this service.

#### 8. OCSP Request

**API Endpoint:** `POST /certs/ocsp`

Check certificate status using OCSP protocol.

**Using OCSP DER format:**
```bash
openssl ocsp -issuer ca.crt -serial {serial_number} -reqout ocsp_request.der
curl -X POST \
  http://localhost:9010/certs/ocsp \
  -H "Content-Type: application/ocsp-request" \
  --data-binary @ocsp_request.der
```

**Using JSON format:**
```bash
curl -X POST \
  http://localhost:9010/certs/ocsp \
  -H "Content-Type: application/json" \
  -d '{
    "serial_number": "6f:35:d5:9d:47:9d:23:50:08:f7:31:13:82:22:e4:c8:e6:cf:2c:c1"
  }'
```

#### 9. Generate CRL (Certificate Revocation List)

**API Endpoint:** `GET /certs/crl`

Retrieve the current certificate revocation list in PEM format. The CRL contains all certificates that have been revoked and is signed by the CA.

```bash
curl -X GET http://localhost:9010/certs/crl -o crl.pem
```

**Response:**
```json
{
  "crl_bytes": "-----BEGIN X509 CRL-----\n...\n-----END X509 CRL-----"
}
```

The CRL can be used by clients to check if a certificate has been revoked.

#### 10. Issue Certificate from CSR

**API Endpoint:** `POST /{domainID}/certs/csrs/{entityID}?ttl=8760h`

Issue a certificate from a Certificate Signing Request (CSR). This allows you to:
- Use your own private key (not generated by the service)
- Control the certificate request parameters
- Maintain key ownership on your side

```bash
curl -X POST \
  http://localhost:9010/{domainID}/certs/csrs/{entityID}?ttl=8760h \
  -H "Authorization: Bearer $USER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "csr": "-----BEGIN CERTIFICATE REQUEST-----\n...\n-----END CERTIFICATE REQUEST-----"
  }'
```

**Response:**
```json
{
  "serial_number": "8b:56:f7:bf:69:bf:45:72:2a:g9:53:35:a4:44:g6:ea:g8:e1:4e:e3",
  "certificate": "-----BEGIN CERTIFICATE-----\n...\n-----END CERTIFICATE-----",
  "expiry_time": "2024-10-14T11:09:58Z",
  "entity_id": "f13f0f30-f923-4504-8a7a-6aa45bcb4866",
  "revoked": false
}
```

**Note:** The `key` field is not returned since you generated and retained the private key when creating the CSR.

**Generating a CSR:**
```bash
# Generate private key
openssl genrsa -out private.key 2048

# Generate CSR
openssl req -new -key private.key -out request.csr \
  -subj "/CN=example.com/O=Example Org/C=US"

# Read CSR content
cat request.csr
```

### Certificate Validity Periods

The Certs service uses the following default validity periods:

- **Root CA Certificate**: 365 days (8760 hours)
- **Intermediate CA Certificate**: 90 days (2160 hours)
- **Client Certificates**: 30 days (720 hours) by default, configurable via TTL parameter
- **Certificate Renewal**: 30 days (720 hours) from renewal time

You can override the default TTL when issuing certificates by providing the `ttl` parameter (e.g., `"8760h"` for 1 year).

### Error Handling

The service returns standard HTTP status codes and JSON error responses:

**Common Error Responses:**

```json
{
  "error": "failed to create certificate: certificate request failed"
}
```

**Status Codes:**
- `200 OK` - Request successful
- `400 Bad Request` - Invalid request parameters or malformed entity
- `401 Unauthorized` - Missing or invalid authentication token
- `404 Not Found` - Certificate or entity not found
- `409 Conflict` - Entity already exists
- `500 Internal Server Error` - Server-side error

**Service-Specific Errors:**
- `ErrCertRevoked` - Attempt to renew a revoked certificate
- `ErrCertExpired` - Certificate expired before renewal
- `ErrNotFound` - Entity or certificate not found
- `ErrMalformedEntity` - Invalid request format
- `ErrFailedCertCreation` - OpenBao certificate generation failed
- `ErrInvalidIP` - Invalid IP address in request

### Environment Variables Reference

The following environment variables configure the OpenBao integration:

```bash
# Certs Service Configuration
AM_CERTS_LOG_LEVEL=debug
AM_CERTS_HTTP_HOST=certs
AM_CERTS_HTTP_PORT=9010
AM_CERTS_GRPC_HOST=certs
AM_CERTS_GRPC_PORT=7012
AM_CERTS_SECRET=12345678                  # Secret for internal endpoint authentication

# Database Configuration
AM_CERTS_DB_HOST=certs-db
AM_CERTS_DB_PORT=5432
AM_CERTS_DB_USER=absmach
AM_CERTS_DB_PASS=absmach
AM_CERTS_DB=certs
AM_CERTS_DB_SSL_MODE=disable

# OpenBao server configuration
AM_CERTS_OPENBAO_HOST=http://certs-openbao:8200
AM_CERTS_OPENBAO_NAMESPACE=               # Optional namespace
AM_CERTS_OPENBAO_PKI_PATH=pki_int         # PKI mount path

# AppRole authentication
AM_CERTS_OPENBAO_ROLE=absmach             # PKI role name
AM_CERTS_OPENBAO_APP_ROLE=absmach         # AppRole role ID
AM_CERTS_OPENBAO_APP_SECRET=absmach       # AppRole secret ID
AM_CERTS_OPENBAO_SECRET_ID_TTL=87600h     # Secret ID TTL

# CA certificate parameters
AM_CERTS_OPENBAO_PKI_CA_CN=Abstract Machines Certificate Authority
AM_CERTS_OPENBAO_PKI_CA_OU=Abstract Machines
AM_CERTS_OPENBAO_PKI_CA_O=AbstractMachines
AM_CERTS_OPENBAO_PKI_CA_C=FRANCE
AM_CERTS_OPENBAO_PKI_CA_L=PARIS
AM_CERTS_OPENBAO_PKI_CA_ST=PARIS
AM_CERTS_OPENBAO_PKI_CA_ADDR=5 Av. Anatole
AM_CERTS_OPENBAO_PKI_CA_PO=75007
AM_CERTS_OPENBAO_PKI_CA_DNS_NAMES=localhost
AM_CERTS_OPENBAO_PKI_CA_IP_ADDRESSES=127.0.0.1,::1
AM_CERTS_OPENBAO_PKI_CA_URI_SANS=
AM_CERTS_OPENBAO_PKI_CA_EMAIL_ADDRESSES=info@abstractmachines.rs

# Unseal keys (for production)
AM_CERTS_OPENBAO_UNSEAL_KEY_1=
AM_CERTS_OPENBAO_UNSEAL_KEY_2=
AM_CERTS_OPENBAO_UNSEAL_KEY_3=
AM_CERTS_OPENBAO_ROOT_TOKEN=
```

### Internal Service Integration

The Certs service provides an internal endpoint for service-to-service certificate issuance. This endpoint bypasses user authentication and uses a shared secret instead.

**Internal CSR Endpoint:**

**API Endpoint:** `POST /certs/csrs/{entityID}?ttl=8760h`

**Authentication:** Bearer token with `AM_CERTS_SECRET` value

```bash
curl -X POST \
  http://localhost:9010/certs/csrs/{entityID}?ttl=8760h \
  -H "Authorization: Bearer 12345678" \
  -H "Content-Type: application/json" \
  -d '{
    "csr": "-----BEGIN CERTIFICATE REQUEST-----\n...\n-----END CERTIFICATE REQUEST-----"
  }'
```

**Response:**
```json
{
  "serial_number": "9c:67:h8:cg:7a:cg:56:83:3b:ha:64:46:b5:55:h7:fb:ha:f2:5f:f4",
  "certificate": "-----BEGIN CERTIFICATE-----\n...\n-----END CERTIFICATE-----",
  "expiry_time": "2024-10-14T11:09:58Z",
  "entity_id": "service-client-id",
  "revoked": false
}
```

**Use Cases:**
- Automated certificate provisioning for microservices
- IoT device onboarding without user interaction
- System-level certificate management
- Integration with external provisioning systems

**Security Considerations:**
- The `AM_CERTS_SECRET` should be kept secure and rotated regularly
- Internal endpoints should only be accessible within the private network
- Use network policies to restrict access to trusted services only

For more information about the Certification service API, please check out the [API documentation][api-docs].

[vault-pki-engine]: https://developer.hashicorp.com/vault/docs/secrets/pki
[api-docs]: https://github.com/absmach/supermq/blob/main/api/openapi/certs.yml
