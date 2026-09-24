# Inventory Management System

A React frontend and Express/PostgreSQL backend for managing assets and spare parts.

## Setup

Install Node.js 22 or newer and PostgreSQL. Node.js includes npm. PostgreSQL downloads and platform-specific installation instructions are at [postgresql.org/download](https://www.postgresql.org/download/). Make sure the PostgreSQL server is running. The launcher can create the configured app database when you confirm a reset; if you keep the existing database, it must already exist (the example uses `leets_inventory_management_db`).

Run `./start.sh` on macOS/Linux or double-click `start.bat` on Windows. The launcher checks Node.js and npm, installs the locked dependencies, and asks whether to reset the configured database. Confirming permanently deletes that database, recreates its schema, and seeds the admin plus demo data. Declining keeps existing data, initializes the schema, and runs no seed commands. On first run the launcher creates `backend/.env` from the example and stops so you can set your database credentials and a secure `APP_PASSWORD` before continuing.

If PostgreSQL is missing, install it from the link above and start its server. If the launcher reports that the configured database does not exist, create it with `createdb -U postgres leets_inventory_management_db` or use pgAdmin. If login or connection settings differ, update `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, and `DB_PASSWORD` in `backend/.env`.

Open `http://localhost:5173` and sign in with `APP_USERNAME` and `APP_PASSWORD` from `backend/.env` after choosing the reset option. If you keep the existing database, the launcher leaves its users and other data untouched; sign in with an account already present in that database.

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
- Operational dashboard with asset health, stock alerts, and maintenance schedule
- Asset list, details, create, edit, and delete
- Spare-part list, details, create, edit, and delete
- Maintenance list, details, create, edit, and delete, linked to assets
- Database-backed users with `admin`, `editor`, and `viewer` roles and secure password hashes
- User list, create, edit, activate/deactivate, password reset, and delete

User management is restricted to administrators. Broader role-based permissions for inventory operations are still under development.
