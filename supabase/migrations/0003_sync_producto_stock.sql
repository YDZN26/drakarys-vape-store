-- Migration: Sync producto.stock with producto_stock (source of truth)
-- Date: 2026-07-13
-- Purpose: Fix root cause of stock desync found during Spec 01 testing.
--          producto.stock was found out of sync with the real per-location
--          stock in producto_stock for some products (e.g. Bateria Waka
--          Creator Plomo: stock=35 vs real=29; Life Pod Green Apple: stock=1
--          vs real=0).
-- Business rule confirmed: units marked 'danado' NEVER count as available
--          stock, in either the internal app or the web catalog.
-- Safety: (1) one-time backfill corrects all existing rows right now;
--          (2) trigger keeps producto.stock correct automatically on every
--          future change to producto_stock, regardless of which app/screen
--          makes the change.

-- Step 1: one-time backfill — fix all existing discrepancies now
UPDATE producto p
SET stock = COALESCE((
  SELECT SUM(ps.cantidad)
  FROM producto_stock ps
  WHERE ps.producto_id = p.producto_id
    AND ps.ubicacion != 'danado'
), 0);

-- Step 2: function that recalculates stock for the affected product
CREATE OR REPLACE FUNCTION sync_producto_stock()
RETURNS TRIGGER AS $$
DECLARE
  affected_producto_id integer;
BEGIN
  affected_producto_id := COALESCE(NEW.producto_id, OLD.producto_id);

  UPDATE producto
  SET stock = (
    SELECT COALESCE(SUM(cantidad), 0)
    FROM producto_stock
    WHERE producto_id = affected_producto_id
      AND ubicacion != 'danado'
  )
  WHERE producto_id = affected_producto_id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Step 3: trigger that runs the function on every change to producto_stock
DROP TRIGGER IF EXISTS trg_sync_producto_stock ON producto_stock;
CREATE TRIGGER trg_sync_producto_stock
AFTER INSERT OR UPDATE OR DELETE ON producto_stock
FOR EACH ROW
EXECUTE FUNCTION sync_producto_stock();
