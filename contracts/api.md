# API Contract

**Architecture Freeze**: once an endpoint ships and other team members
depend on it, don't change its shape without team sign-off.

Every response uses this envelope:

```json
{
  "success": true,
  "data": {},
  "error": null,
  "message": null
}
```

All routes are mounted under `/api`. Protected routes require
`Authorization: Bearer <accessToken>`.

## Auth

### `POST /api/auth/register`
**Request**
```json
{ "email": "string (required)", "password": "string (required, min 8 chars)" }
```
**Response `data`**
```json
{ "user": { "id": "uuid", "email": "string", "createdAt": "timestamp" }, "accessToken": "string", "refreshToken": "string" }
```

### `POST /api/auth/login`
**Request**
```json
{ "email": "string (required)", "password": "string (required)" }
```
**Response `data`**: same shape as `register`.

### `POST /api/auth/refresh`
**Request**
```json
{ "refreshToken": "string (required)" }
```
**Response `data`**
```json
{ "accessToken": "string" }
```

## Examples (protected — requires `Authorization` header)

### `GET /api/examples`
**Response `data`**: array of `{ id, name, status, ownerId, createdAt, updatedAt }`

### `POST /api/examples`
**Request**
```json
{ "name": "string (required)", "status": "active | inactive (optional, default active)" }
```
**Response `data`**: the created example row.

## AI (protected — requires `Authorization` header)

### `POST /api/ai/complete`
**Request**
```json
{
  "prompt": "string (required)",
  "provider": "custom | opensource (optional, default 'custom')",
  "options": { "temperature": 0.7, "maxTokens": 512 }
}
```
**Response `data`**
```json
{ "text": "...", "provider": "custom", "raw": {} }
```

See `contracts/ai-contract.md` for the full AI request/response contract
and how to add a new provider.

## When to add a new route

Add one under `backend/src/routes/` (+ a controller in `src/controllers`
and business logic in `src/services`) whenever a feature needs to read or
write data, call the AI router, or run trusted server-side logic. Every
new route needs a matching entry here **and** in `contracts/db-schema.md`
if it touches new tables.

---

Add new endpoints below as they're built.
