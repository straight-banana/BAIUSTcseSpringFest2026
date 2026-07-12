# Shared Types

Since this is a JS (not TS) starter, these are documented shapes rather than
compiled types — keep frontend and backend in sync with what's written here.

## `ApiResponse<T>`
```ts
{
  success: boolean;
  data: T | null;
  error: string | null;
  message: string | null;
}
```

## `ExampleItem`
```ts
{
  id: string;       // uuid
  name: string;
  status: "active" | "inactive";
  ownerId: string;   // uuid, references User.id
  createdAt: string; // ISO timestamp
  updatedAt: string; // ISO timestamp
}
```

## `User`
```ts
{
  id: string;    // uuid
  email: string;
  createdAt: string; // ISO timestamp
}
```
Note: `passwordHash` never leaves the backend — it's excluded from every
API response.

## `AuthTokens`
```ts
{
  accessToken: string;  // short-lived, sent as Authorization: Bearer <token>
  refreshToken: string; // longer-lived, used only against POST /api/auth/refresh
}
```

---

If the team switches to TypeScript mid-hackathon, promote these to real
`.d.ts` files in a shared package — but don't do that unless there's time.
