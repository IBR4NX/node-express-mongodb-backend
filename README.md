# Node.js Express MongoDB Backend

A Node.js and Express backend for user authentication, JWT-based authorization, MongoDB persistence, and product management. The project uses ECMAScript modules and connects to MongoDB through Mongoose.

> **Project status:** This README documents the repository as it currently exists. The source code contains a few missing imports and integration gaps that should be resolved before the server is used in production. See [Current implementation notes](#current-implementation-notes).

## Features

The current codebase provides the following capabilities:

- User registration with email validation and bcrypt password hashing.
- User login with short-lived access tokens and refresh tokens.
- JWT middleware for protected routes.
- A protected `GET /me` endpoint for retrieving the authenticated user.
- Protected product creation and product listing endpoints.
- An admin endpoint for listing active users.
- MongoDB persistence through Mongoose.
- EJS views and a `/test` page served by Express.
- CORS and environment-based configuration through `dotenv`.

## Technology Stack

| Area | Technology |
| --- | --- |
| Runtime | Node.js |
| Language style | ECMAScript modules (`"type": "module"`) |
| HTTP server | Express 5 |
| Database | MongoDB with Mongoose |
| Authentication | JSON Web Tokens (`jsonwebtoken`) |
| Password hashing | `bcrypt` |
| Templates | EJS |
| Configuration | `dotenv` |
| Development workflow | Nodemon |

## Requirements

Install the following before starting the project:

| Requirement | Recommended version or option |
| --- | --- |
| Node.js | 18 or newer |
| npm | Bundled with Node.js |
| MongoDB | Local MongoDB instance, MongoDB Atlas, or another reachable MongoDB server |

## Installation

Clone the repository and install its dependencies:

```bash
git clone https://github.com/IBR4NX/node-express-mongodb-backend.git
cd backend-server
npm install
```

Create a local environment file from the included template:

```bash
cp .env.example .env
```

On Windows PowerShell, use the following equivalent command:

```powershell
Copy-Item .env.example .env
```

Update `.env` with a reachable MongoDB connection string and strong, unique secrets before starting the application.

## Configuration

The application reads configuration from `.env` through `config.js`. The main variables are:

| Variable | Purpose | Example |
| --- | --- | --- |
| `NODE_ENV` | Runtime environment name | `development` |
| `TZ` | Process timezone | `UTC` |
| `PORT` | HTTP port used by the server | `3000` |
| `DATABASE_URL` | MongoDB connection string | `mongodb://127.0.0.1:27017/backend` |
| `CORS_URL` | Allowed CORS origin | `http://localhost:5173` |
| `SECRET` | General application secret | Replace the template value |
| `JWT_ACCESS_SECRET` | Secret used to sign access tokens | Replace the template value |
| `JWT_REFRESH_SECRET` | Secret used to sign refresh tokens | Replace the template value |
| `ACCESS_TOKEN_VALIDITY_SEC` | Configured access-token validity metadata | `172800` |
| `REFRESH_TOKEN_VALIDITY_SEC` | Configured refresh-token validity metadata | `604800` |
| `TOKEN_ISSUER` | JWT issuer metadata | `api.example.com` |
| `TOKEN_AUDIENCE` | JWT audience metadata | `example.com` |

A minimal local configuration can look like this:

```dotenv
NODE_ENV=development
TZ=UTC
PORT=3000
DATABASE_URL=mongodb://127.0.0.1:27017/backend
CORS_URL=http://localhost:5173
SECRET=replace-with-a-long-random-secret
JWT_ACCESS_SECRET=replace-with-a-long-random-access-secret
JWT_REFRESH_SECRET=replace-with-a-long-random-refresh-secret
ACCESS_TOKEN_VALIDITY_SEC=172800
REFRESH_TOKEN_VALIDITY_SEC=604800
TOKEN_ISSUER=api.example.com
TOKEN_AUDIENCE=example.com
```

Do not commit `.env` or real credentials. The values in `.env.example` are development placeholders and must not be reused in a deployed environment.

## Running the Server

Start the server in development mode with automatic restarts:

```bash
npm run dev
```

Start the server normally:

```bash
npm start
```

The Windows helper script `start.bat` launches the development command:

```bat
start.bat
```

The application is intended to listen at `http://localhost:<PORT>/`. The `/test` route renders the EJS test page when the server is running.

## Available Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Starts `app.js` with Nodemon for development. |
| `npm start` | Starts `app.js` with Node.js. |
| `npm test` | Runs `auth/test.js` through Nodemon; this is a development script rather than a conventional test runner. |
| `npm run tst` | Placeholder script that exits with an error because no automated test suite is configured. |

## API Overview

All API routes below are mounted beneath the `/api` prefix.

| Method | Endpoint | Authentication | Description |
| --- | --- | --- | --- |
| `POST` | `/api/signup` | Public | Creates a new user account. |
| `POST` | `/api/login` | Public | Validates credentials and returns access and refresh tokens. |
| `POST` | `/api/refresh-token` | Public | Exchanges a valid refresh token for a new access token. |
| `GET` | `/api/me` | Bearer token | Returns the authenticated user document. |
| `POST` | `/api/addProduct` | Bearer token | Creates a product owned by the authenticated user. |
| `GET` | `/api/displayProducts` | Bearer token | Returns products and populates their referenced user. |
| `POST` | `/api/admin/users` | Bearer token and admin role | Returns active users for an administrator. |

### Authentication Header

Protected endpoints expect the access token in the `Authorization` header. The middleware accepts the standard Bearer format:

```http
Authorization: Bearer <access-token>
```

The login handler returns the access token under the `token` property, while the refresh endpoint returns it under `accessToken`.

### Sign Up

`POST /api/signup`

Request body:

```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "strong-password",
  "confirmPassword": "strong-password"
}
```

Passwords must be present and contain at least six characters. The email must match the validator used by the application, and the two password fields must match. Passwords are hashed with bcrypt before being stored.

Successful response:

```json
{
  "message": "Signup Successful",
  "name": "Jane Doe",
  "email": "jane@example.com"
}
```

Signup does not issue tokens. The client must log in after registration.

### Login

`POST /api/login`

Request body:

```json
{
  "email": "jane@example.com",
  "password": "strong-password"
}
```

Successful response:

```json
{
  "message": "Login Success",
  "name": "Jane Doe",
  "email": "jane@example.com",
  "token": "<access-token>",
  "refreshToken": "<refresh-token>"
}
```

The access token is generated with a three-minute expiration in the current token utility. The refresh token is generated with a seven-day expiration. Clients should store and transmit tokens using a secure strategy appropriate for their application.

### Refresh an Access Token

`POST /api/refresh-token`

Request body:

```json
{
  "refreshToken": "<refresh-token>"
}
```

Successful response:

```json
{
  "accessToken": "<new-access-token>"
}
```

The handler also attempts to set an HTTP-only, secure `accessToken` cookie. In local HTTP development, cookie behavior may require additional configuration because the current cookie is marked `secure`.

### Get the Current User

`GET /api/me`

Send the access token as a Bearer token. The endpoint looks up the user identified by the JWT payload and returns the resulting user document.

### Create a Product

`POST /api/addProduct`

Request body:

```json
{
  "name": "Example Product",
  "description": "Product description",
  "price": "49.99",
  "purchasePrice": "25.00",
  "quantity": "10",
  "code": "SKU-001",
  "type": "physical",
  "image": "https://example.com/product.jpg"
}
```

The required fields are `name`, `description`, `price`, `purchasePrice`, `quantity`, `code`, and `type`. The product is associated with the authenticated user. Although `price`, `purchasePrice`, and `quantity` are product concepts that are often numeric, the current Mongoose schema stores them as strings.

### List Products

`GET /api/displayProducts`

This protected endpoint returns the available product documents and populates each product’s referenced `user` field.

### List Active Users as an Administrator

`POST /api/admin/users`

This endpoint requires a valid access token whose decoded role is `admin`. It returns active users and explicitly selects fields that are normally hidden by the user schema. Because this response may include sensitive account fields, the endpoint should be reviewed and restricted before production use.

## Data Models

The repository currently includes user, product, and authorization-related Mongoose models.

### User

The user schema includes a name, unique lowercased email, bcrypt password hash, role, status, verification flag, and timestamps. Supported roles are `user`, `admin`, `superadmin`, and `guest`. The password and several account fields are hidden by default in the schema.

### Product

A product belongs to a user and contains a name, description, price, purchase price, quantity, code, type, optional image, and timestamps.

### Authorization

The authorization model contains user, client-agent, IP address, status, expiration, access-token, and refresh-token fields. The current main router does not visibly mount the repository’s logout handler, so logout should be verified before being treated as an active public API route.

## Project Structure

```text
backend-server/
├── app.js                         # Express application and HTTP listener
├── config.js                      # Environment variable loading
├── auth/
│   ├── jwt.js                     # JWT authorization middleware
│   └── test.js                    # Script used by npm test
├── core/
│   ├── convert.js                 # Model and collection naming helper
│   ├── dirname.js                 # Directory-name helper
│   ├── ui.js                      # UI-related helper
│   └── validate.js                # Email and password validation
├── database/
│   ├── mongooseDB.js              # MongoDB connection bootstrap
│   └── models/                    # User, product, and authorization models
├── routes/
│   ├── router.js                  # Main /api router
│   ├── access/                    # Signup, login, profile, and token handlers
│   ├── admin/                     # Administrator routes
│   └── products/                  # Product handlers
├── views/                         # EJS templates and static test assets
├── .env.example                   # Environment configuration template
├── package.json                   # Scripts and dependencies
└── start.bat                     # Windows development launcher
```

## Security Considerations

This repository is suitable as a development starting point, but it should not be deployed without a security review. Replace every placeholder secret, restrict `CORS_URL` to trusted origins, and use HTTPS for authentication traffic. Avoid exposing stack traces or sensitive request data in production error responses.

The current JWT middleware calls `jwt.verify` with expiration checks disabled. Consequently, an expired access token may still be decoded by the middleware if its signature is valid. Expiration validation should be enabled before production use, and the access-token lifetime should be managed consistently with the environment configuration.

The admin response currently selects password and other normally hidden account fields. Those fields should not be returned to clients unless there is a clear, reviewed requirement and an appropriate redaction strategy.

## Current Implementation Notes

The repository snapshot currently has integration issues that may prevent a clean startup until they are corrected:

- `app.js` uses `PORT`, `corsUrl`, and `environment` without importing them from `config.js`.
- `routes/router.js` creates an Express router without showing an `express` import.
- Several route modules reference imported symbols that are not present in the current files, including `asyncHandler`, `jwt`, and `JWT_REFRESH_SECRET`.
- The application uses `res.cookie(...)`, but the main application does not currently configure cookie parsing middleware.
- The configured token validity variables and the actual token-expiration values in `routes/access/token.js` are not currently driven by the same settings.

These notes are included so that the documentation does not imply that the current repository is production-ready. They can be removed or revised after the implementation is repaired and verified.

## License

The package metadata declares the project license as **ISC**.

## References

[1]: https://github.com/IBR4NX/node-express-mongodb-backend "backend-server repository"
[2]: https://github.com/IBR4NX/node-express-mongodb-backend/blob/main/package.json "Project package manifest"
[3]: https://github.com/IBR4NX/node-express-mongodb-backend/blob/main/.env.example "Environment configuration template"
[4]: https://github.com/IBR4NX/node-express-mongodb-backend/blob/main/routes/router.js "Main API router"
[5]: https://github.com/IBR4NX/node-express-mongodb-backend/blob/main/routes/access/token.js "Token generation and refresh handlers"
[6]: https://github.com/IBR4NX/node-express-mongodb-backend/blob/main/auth/jwt.js "JWT authorization middleware"
