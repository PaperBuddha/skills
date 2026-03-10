-- =========================================================================================
-- Schema for Web Scraper Output
-- =========================================================================================
--
-- This schema handles storage for web scraper executions, raw page data, and extracted items.
-- Designed for PostgreSQL 14+.
--
-- Tables:
-- 1. scrape_runs: Metadata for each scraping job/session.
-- 2. pages: Raw HTTP response metadata and content hashes for every URL fetched.
-- 3. items: Structured data extracted from pages (flexible JSONB support).
--
-- Features:
-- - Idempotency via UNIQUE constraints.
-- - Tstzrange for valid time ranges (optional, but standard timestamps used here).
-- - GIN indexing for JSONB query performance.
-- - Foreign keys with cascade delete for cleanup.

BEGIN;

-- -----------------------------------------------------------------------------------------
-- 1. Table: scrape_runs
-- Tracks the execution context of a scraper instance.
-- -----------------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS scrape_runs (
    id BIGSERIAL PRIMARY KEY,
    target_url TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('pending', 'running', 'completed', 'failed', 'interrupted')),
    started_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ,
    item_count INTEGER DEFAULT 0,
    page_count INTEGER DEFAULT 0,
    error_log TEXT,
    config_json JSONB DEFAULT '{}'::jsonb -- Stores runtime config/CLI args
);

-- Index for finding recent runs or runs by status
CREATE INDEX IF NOT EXISTS idx_scrape_runs_status_started ON scrape_runs(status, started_at DESC);
CREATE INDEX IF NOT EXISTS idx_scrape_runs_target ON scrape_runs(target_url);


-- -----------------------------------------------------------------------------------------
-- 2. Table: pages
-- Records every distinct URL fetched during a run.
-- -----------------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS pages (
    id BIGSERIAL PRIMARY KEY,
    run_id BIGINT NOT NULL REFERENCES scrape_runs(id) ON DELETE CASCADE,
    url TEXT NOT NULL,
    method TEXT DEFAULT 'GET',
    status_code INTEGER CHECK (status_code >= 100 AND status_code < 600),
    headers JSONB DEFAULT '{}'::jsonb,
    content_type TEXT,
    content_length BIGINT,
    content_hash TEXT, -- SHA256 of body for change detection
    created_at TIMESTAMPTZ DEFAULT NOW(),

    -- Enforce idempotency: A URL is unique per run.
    CONSTRAINT uq_pages_run_url UNIQUE (run_id, url)
);

-- Indexes for lookup
CREATE INDEX IF NOT EXISTS idx_pages_run_id ON pages(run_id);
CREATE INDEX IF NOT EXISTS idx_pages_url ON pages(url);
CREATE INDEX IF NOT EXISTS idx_pages_hash ON pages(content_hash);


-- -----------------------------------------------------------------------------------------
-- 3. Table: items
-- Stores the actual extracted entities.
-- -----------------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS items (
    id BIGSERIAL PRIMARY KEY,
    run_id BIGINT NOT NULL REFERENCES scrape_runs(id) ON DELETE CASCADE,
    page_id BIGINT REFERENCES pages(id) ON DELETE SET NULL, -- Link to source page, optional

    -- Core schema fields (commonly queried)
    source_url TEXT NOT NULL,
    title TEXT,
    body TEXT,
    price NUMERIC(19, 4), -- High precision for currency
    currency CHAR(3),     -- ISO 4217 code (e.g., 'USD')
    published_at TIMESTAMPTZ,
    
    -- Flexible fields
    data_json JSONB DEFAULT '{}'::jsonb,

    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),

    -- Idempotency: Unique constraint on the canonical source URL.
    -- NOTE: Adjust this constraint if multiple items can exist per URL 
    -- (e.g., add a unique extractor_id or item_hash).
    CONSTRAINT uq_items_source_url UNIQUE (source_url)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_items_run_id ON items(run_id);
CREATE INDEX IF NOT EXISTS idx_items_source_url ON items(source_url);
CREATE INDEX IF NOT EXISTS idx_items_published_at ON items(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_items_price ON items(price);

-- GIN Index for arbitrary JSON queries
CREATE INDEX IF NOT EXISTS idx_items_data_json ON items USING GIN (data_json);

-- -----------------------------------------------------------------------------------------
-- Utility: Auto-update updated_at timestamp
-- -----------------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION update_timestamp_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_items_changetimestamp 
BEFORE UPDATE ON items 
FOR EACH ROW EXECUTE PROCEDURE update_timestamp_column();

COMMIT;
