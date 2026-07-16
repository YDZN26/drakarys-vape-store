-- Migration: Add catalog-ready columns to existing "producto" table
-- Date: 2026-07-06
-- Purpose: Enable structured flavor/nicotine/type filtering and image gallery
--          on the Drakarys web catalog, without modifying any existing column
--          used by the internal inventory mobile app.
-- Safety: 100% additive. All new columns are nullable or have a safe default.
--         No existing column, table, or constraint is touched.

ALTER TABLE public.producto
  ADD COLUMN flavor character varying NULL,
  ADD COLUMN nicotine_mg numeric NULL,
  ADD COLUMN product_type character varying NULL,
  ADD COLUMN featured boolean NOT NULL DEFAULT false,
  ADD COLUMN images jsonb NULL;
