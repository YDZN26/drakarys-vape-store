-- Migration: Restrict producto.stock calculation to exhibicion + almacen_tienda only
-- Date: 2026-08-14
-- Business rule change: stock in 'almacen_casa' should NOT count as available
--          for customer orders, since fulfilling from home requires an extra
--          trip before the order can be delivered. Only 'exhibicion' and
--          'almacen_tienda' represent immediately fulfillable stock.
--          'danado' continues to be excluded, as before.
-- Safety: replaces the function created in 0003_sync_producto_stock.sql
--          (CREATE OR REPLACE, same trigger, no schema change to producto_stock
--          itself). Includes a one-time backfill to correct all existing
--          producto.stock values immediately under the new rule.

-- Step 1: one-time backfill under the new rule
UPDATE producto p
SET stock = COALESCE((
  SELECT SUM(ps.cantidad)
  FROM producto_stock ps
  WHERE ps.producto_id = p.producto_id
    AND ps.ubicacion IN ('exhibicion', 'almacen_tienda')
), 0);

-- Step 2: update the trigger function to use the new rule going forward
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
      AND ubicacion IN ('exhibicion', 'almacen_tienda')
  )
  WHERE producto_id = affected_producto_id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Step 3: the trigger itself doesn't need to be recreated — it already calls
-- sync_producto_stock(), and CREATE OR REPLACE FUNCTION updates its behavior
-- automatically for all future calls.
