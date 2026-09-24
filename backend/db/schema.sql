CREATE TABLE IF NOT EXISTS assets (
    id BIGSERIAL PRIMARY KEY,
    asset_code VARCHAR(100) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(255) NOT NULL,
    machine_type VARCHAR(255),
    serial_number VARCHAR(255),
    location VARCHAR(255),
    status VARCHAR(50) NOT NULL DEFAULT 'active',
    supplier VARCHAR(255),
    purchase_date DATE,
    next_maintenance_date DATE,
    iot_state VARCHAR(50) NOT NULL DEFAULT 'unknown',
    notes TEXT NOT NULL DEFAULT '',
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE assets
    ADD COLUMN IF NOT EXISTS machine_type VARCHAR(255);

CREATE INDEX IF NOT EXISTS assets_created_at_idx ON assets (created_at DESC);

CREATE TABLE IF NOT EXISTS spare_parts (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    manufacturer_number VARCHAR(255),
    compatible_machine_type VARCHAR(255),
    quantity_in_stock INTEGER NOT NULL DEFAULT 0 CHECK (quantity_in_stock >= 0),
    description TEXT NOT NULL DEFAULT '',
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS spare_parts_name_idx ON spare_parts (name);

CREATE TABLE IF NOT EXISTS users (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    display_name VARCHAR(255) NOT NULL,
    password_hash TEXT NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'viewer'
        CHECK (role IN ('admin', 'editor', 'viewer', 'customer')),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CHECK (username = LOWER(username)),
    CHECK (username ~ '^[a-z0-9._-]{3,100}$')
);

CREATE INDEX IF NOT EXISTS users_role_idx ON users (role);

CREATE TABLE IF NOT EXISTS products (
    id BIGSERIAL PRIMARY KEY,
    sku VARCHAR(100) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL DEFAULT '',
    price NUMERIC(12, 2) CHECK (price >= 0),
    quantity_in_stock INTEGER NOT NULL DEFAULT 0 CHECK (quantity_in_stock >= 0),
    image_url TEXT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS products_name_idx ON products (name);
CREATE INDEX IF NOT EXISTS products_active_idx ON products (is_active);


CREATE TABLE IF NOT EXISTS maintenance_records (
    id BIGSERIAL PRIMARY KEY,
    asset_id BIGINT NOT NULL REFERENCES assets(id) ON DELETE RESTRICT,
    maintenance_type VARCHAR(255) NOT NULL,
    scheduled_date DATE NOT NULL,
    completed_date DATE,
    status VARCHAR(50) NOT NULL DEFAULT 'planned'
        CHECK (status IN ('planned', 'in_progress', 'completed', 'cancelled')),
    technician VARCHAR(255),
    technician_id BIGINT REFERENCES users(id) ON DELETE SET NULL,
    cost NUMERIC(12, 2) CHECK (cost >= 0),
    notes TEXT NOT NULL DEFAULT '',
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CHECK (completed_date IS NULL OR completed_date >= scheduled_date)
);

ALTER TABLE maintenance_records
    ADD COLUMN IF NOT EXISTS technician_id BIGINT REFERENCES users(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS maintenance_records_asset_id_idx
    ON maintenance_records (asset_id);
CREATE INDEX IF NOT EXISTS maintenance_records_scheduled_date_idx
    ON maintenance_records (scheduled_date);
CREATE INDEX IF NOT EXISTS maintenance_records_technician_id_idx
    ON maintenance_records (technician_id);
