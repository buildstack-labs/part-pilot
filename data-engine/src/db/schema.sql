-- PartPilot Data Engine schema
-- Run via: npm run migrate (from data-engine/)

CREATE TABLE IF NOT EXISTS suppliers (
  id                   TEXT        PRIMARY KEY,
  name_en              TEXT        NOT NULL,
  name_he              TEXT        NOT NULL,
  base_url             TEXT        NOT NULL,
  country_code         TEXT        NOT NULL,
  type                 TEXT        NOT NULL CHECK (type IN ('local', 'international')),
  is_affiliate         BOOLEAN     NOT NULL DEFAULT FALSE,
  supports_plate_lookup BOOLEAN    NOT NULL DEFAULT FALSE,
  priority             INTEGER     NOT NULL DEFAULT 99,
  rating               NUMERIC(3,1),
  delivery_days        TEXT,
  is_active            BOOLEAN     NOT NULL DEFAULT TRUE,
  created_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at           TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS parts (
  id          TEXT        PRIMARY KEY,
  oem_number  TEXT        NOT NULL UNIQUE,
  name_en     TEXT        NOT NULL,
  name_he     TEXT        NOT NULL,
  category_id TEXT        NOT NULL,
  difficulty  TEXT        NOT NULL,
  is_active   BOOLEAN     NOT NULL DEFAULT TRUE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS part_aliases (
  id        SERIAL      PRIMARY KEY,
  part_id   TEXT        NOT NULL REFERENCES parts(id) ON DELETE CASCADE,
  alias     TEXT        NOT NULL UNIQUE,   -- normalized: no dashes, uppercase
  alias_raw TEXT        NOT NULL,          -- original as entered
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS supplier_offers (
  id            TEXT        PRIMARY KEY,   -- '{supplier_id}:{part_id}'
  supplier_id   TEXT        NOT NULL REFERENCES suppliers(id),
  part_id       TEXT        NOT NULL REFERENCES parts(id),
  mpn           TEXT        NOT NULL,      -- normalized OEM (no dashes, uppercase)
  url           TEXT        NOT NULL,
  price         NUMERIC(10,2) NOT NULL,
  currency      TEXT        NOT NULL DEFAULT 'USD',
  shipping      NUMERIC(10,2) NOT NULL DEFAULT 0,
  in_stock      BOOLEAN     NOT NULL DEFAULT TRUE,
  product_title TEXT,
  source_type   TEXT        NOT NULL DEFAULT 'scraped',
  last_verified TIMESTAMPTZ,
  url_verified  BOOLEAN     NOT NULL DEFAULT FALSE,
  is_active     BOOLEAN     NOT NULL DEFAULT TRUE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (supplier_id, part_id)
);

CREATE TABLE IF NOT EXISTS sync_logs (
  id                 SERIAL      PRIMARY KEY,
  run_id             TEXT        NOT NULL UNIQUE,
  started_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  finished_at        TIMESTAMPTZ,
  status             TEXT        NOT NULL DEFAULT 'running'
                                 CHECK (status IN ('running', 'completed', 'failed')),
  total_parts        INTEGER,
  total_suppliers    INTEGER,
  offers_upserted    INTEGER     NOT NULL DEFAULT 0,
  offers_failed      INTEGER     NOT NULL DEFAULT 0,
  offers_url_rejected INTEGER    NOT NULL DEFAULT 0,
  error_message      TEXT,
  details            JSONB
);

CREATE INDEX IF NOT EXISTS idx_supplier_offers_part_id    ON supplier_offers(part_id);
CREATE INDEX IF NOT EXISTS idx_supplier_offers_active     ON supplier_offers(part_id, is_active);
CREATE INDEX IF NOT EXISTS idx_part_aliases_alias         ON part_aliases(alias);
CREATE INDEX IF NOT EXISTS idx_sync_logs_started_at       ON sync_logs(started_at DESC);

-- ── Seed suppliers ────────────────────────────────────────────────────────────
INSERT INTO suppliers (id, name_en, name_he, base_url, country_code, type, is_affiliate, supports_plate_lookup, priority, rating, delivery_days)
VALUES
  ('partsouq',   'PartSouq',     'PartSouq',           'https://partsouq.com/',        'AE', 'international', TRUE,  FALSE, 1,  4.7, '7-14'),
  ('amayama',    'Amayama',      'Amayama',             'https://www.amayama.com/en',   'JP', 'international', TRUE,  FALSE, 2,  4.8, '14-21'),
  ('impex-jp',   'IMPEX Japan',  'IMPEX Japan',         'https://en.impex-jp.com/',     'JP', 'international', TRUE,  FALSE, 3,  4.6, '14-21'),
  ('megazip',    'MegaZip',      'MegaZip',             'https://www.megazip.net/',     'JP', 'international', TRUE,  FALSE, 4,  4.7, '10-18'),
  ('sparekorea', 'Spare Korea',  'Spare Korea',         'https://www.sparekorea.com/',  'KR', 'international', TRUE,  FALSE, 5,  4.5, '14-21'),
  ('rockauto',   'RockAuto',     'RockAuto',            'https://www.rockauto.com/',    'US', 'international', TRUE,  FALSE, 6,  4.6, '10-15'),
  ('il-motory',  'Motory',       'מוטורי',              'https://starter.co.il/',       'IL', 'local',         FALSE, TRUE,  10, 4.5, '2-4'),
  ('il-yaam',    'Yam Parts',    'ים חלקי חילוף',       'https://yaam.co.il/',          'IL', 'local',         FALSE, TRUE,  11, 4.4, '2-3'),
  ('il-abparts', 'AB Parts',     'א.ב חלפים',           'https://abparts.shop/',        'IL', 'local',         FALSE, TRUE,  12, 4.3, '2-4'),
  ('il-nivos',   'Nivos',        'ניבוס חלפים',         'https://nivos.co.il/shop/',    'IL', 'local',         FALSE, TRUE,  13, 4.2, '2-3')
ON CONFLICT (id) DO UPDATE SET
  name_en       = EXCLUDED.name_en,
  base_url      = EXCLUDED.base_url,
  priority      = EXCLUDED.priority,
  rating        = EXCLUDED.rating,
  updated_at    = NOW();

-- ── Seed parts ────────────────────────────────────────────────────────────────
INSERT INTO parts (id, oem_number, name_en, name_he, category_id, difficulty)
VALUES
  ('c3000001-0000-4000-8000-000000000001', '26300-35505', 'Oil Filter',          'מסנן שמן',               'filters',    'beginner'),
  ('c3000001-0000-4000-8000-000000000002', '28113-2H000', 'Air Filter',          'מסנן אוויר',             'filters',    'beginner'),
  ('c3000001-0000-4000-8000-000000000003', '58101-2HA10', 'Front Brake Pads',    'רפידות בלם קדמיות',      'brakes',     'intermediate'),
  ('c3000001-0000-4000-8000-000000000004', '58302-2HA10', 'Rear Brake Pads',     'רפידות בלם אחוריות',     'brakes',     'intermediate'),
  ('c3000001-0000-4000-8000-000000000005', '97133-2H000', 'Cabin Filter',        'מסנן מזגן',              'filters',    'beginner'),
  ('c3000001-0000-4000-8000-000000000006', '18841-11051', 'Spark Plugs (x4)',    'מצתים',                  'engine',     'intermediate'),
  ('c3000001-0000-4000-8000-000000000007', '98350-2H100', 'Wiper Blades',        'מגבי שמשה קדמיים',       'body',       'beginner'),
  ('c3000001-0000-4000-8000-000000000008', '25100-2B000', 'Coolant Temp Sensor', 'חיישן טמפרטורת קירור',   'cooling',    'professional'),
  ('c3000001-0000-4000-8000-000000000009', '54617-2H000', 'Front Strut Mount',   'תושבת מתלה קדמית',       'suspension', 'professional'),
  ('c3000001-0000-4000-8000-000000000010', '56820-2H000', 'Tie Rod End',         'קצה מוט כיוון',          'steering',   'professional'),
  ('c3000001-0000-4000-8000-000000000011', '97701-2H000', 'A/C Compressor',      'מדחס מיזוג',             'aircon',     'professional'),
  ('c3000001-0000-4000-8000-000000000012', '39210-2B000', 'Oxygen Sensor',       'חיישן חמצן',             'exhaust',    'intermediate'),
  ('c3000001-0000-4000-8000-000000000013', '37300-2H000', 'Alternator',          'אלטרנטור',               'electrical', 'professional')
ON CONFLICT (id) DO UPDATE SET
  oem_number = EXCLUDED.oem_number,
  name_en    = EXCLUDED.name_en;

-- ── Seed part aliases (normalized OEM: no dashes, uppercase) ─────────────────
INSERT INTO part_aliases (part_id, alias, alias_raw)
VALUES
  ('c3000001-0000-4000-8000-000000000001', '2630035505',  '26300-35505'),
  ('c3000001-0000-4000-8000-000000000002', '281132H000',  '28113-2H000'),
  ('c3000001-0000-4000-8000-000000000003', '581012HA10',  '58101-2HA10'),
  ('c3000001-0000-4000-8000-000000000004', '583022HA10',  '58302-2HA10'),
  ('c3000001-0000-4000-8000-000000000005', '971332H000',  '97133-2H000'),
  ('c3000001-0000-4000-8000-000000000006', '1884111051',  '18841-11051'),
  ('c3000001-0000-4000-8000-000000000007', '983502H100',  '98350-2H100'),
  ('c3000001-0000-4000-8000-000000000008', '251002B000',  '25100-2B000'),
  ('c3000001-0000-4000-8000-000000000009', '546172H000',  '54617-2H000'),
  ('c3000001-0000-4000-8000-000000000010', '568202H000',  '56820-2H000'),
  ('c3000001-0000-4000-8000-000000000011', '977012H000',  '97701-2H000'),
  ('c3000001-0000-4000-8000-000000000012', '392102B000',  '39210-2B000'),
  ('c3000001-0000-4000-8000-000000000013', '373002H000',  '37300-2H000')
ON CONFLICT (alias) DO NOTHING;
