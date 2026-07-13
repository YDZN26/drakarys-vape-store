-- Migration: Public read-only policies for web catalog
-- Date: 2026-07-13
-- Purpose: Allow the anon key (used by the public web catalog) to read
--          active products and all categories. Does not grant any
--          INSERT/UPDATE/DELETE access. Coexists with the new
--          authenticated-role policies (producto_dueño_all, producto_empleado_select,
--          categoria_dueño_all, categoria_empleado_select) used by the internal
--          staff app — different roles (anon vs authenticated), no conflict.
-- Safety: idempotent (safe to re-run); does not touch any policy on other tables.

DROP POLICY IF EXISTS "public_read_active_products" ON public.producto;
CREATE POLICY "public_read_active_products"
  ON public.producto
  FOR SELECT
  TO anon
  USING (estado = true);

DROP POLICY IF EXISTS "public_read_categories" ON public.categoria;
CREATE POLICY "public_read_categories"
  ON public.categoria
  FOR SELECT
  TO anon
  USING (true);
