# Inventory Management System

A React frontend and Express/PostgreSQL backend for managing assets and spare parts.

## Setup

1. Create a PostgreSQL database named `leets_inventory_management_db`.
2. Copy `backend/.env.example` to `backend/.env` and set the database and login values.
3. Install dependencies and initialize the database:

   ```sh
   cd backend
   npm install
   npm run db:init
   npm run db:seed-admin
   ```

4. Start the backend with `npm run dev`.
5. In another terminal, start the frontend:

   ```sh
   cd frontend
   npm install
   npm run dev
   ```

Open the URL printed by Vite and sign in with a username and password stored in the `users` table. The seed command creates the initial account from `APP_USERNAME` and `APP_PASSWORD` with an `admin` role and a salted scrypt password hash. Running it again does not overwrite an existing account. Successful login returns an expiring signed token; configure its lifetime with `AUTH_TOKEN_TTL_SECONDS`.

## Verification

Run backend API tests with `cd backend && npm test`. These tests use in-memory repositories and do not modify PostgreSQL.

After changing the database schema, run:

```sh
cd backend
npm run db:init
npm run db:smoke
```

The smoke test verifies asset, spare-part, and maintenance persistence inside a transaction that is always rolled back.

Never commit `backend/.env`. If it has previously been committed, rotate `API_TOKEN` and `APP_PASSWORD` and any non-development database credentials.

## Available features

- Authenticated login and logout
- Asset list, details, create, edit, and delete
- Spare-part list, details, create, edit, and delete
- Maintenance list, details, create, edit, and delete, linked to assets
- Database-backed users with `admin`, `editor`, and `viewer` roles and secure password hashes
- User list, create, edit, activate/deactivate, password reset, and delete

User management is restricted to administrators. Broader role-based permissions for inventory operations are still under development.
