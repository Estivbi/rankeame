-- =============================================================================
-- Políticas de Seguridad RLS (Row Level Security) para Rankeame
-- =============================================================================
-- Cómo aplicar:
--   1. Abre el Dashboard de Supabase → entra en tu proyecto.
--   2. Ve a "SQL Editor" en el menú lateral izquierdo.
--   3. Pega todo el contenido de este archivo y pulsa "Run".
--   4. Comprueba en "Authentication → Policies" que las políticas aparecen activas.
--
-- Estas políticas permiten:
--   - Visitantes (anon): SELECT en contests, INSERT en contests y votes.
--   - Nadie (anon): UPDATE ni DELETE en contests ni votes.
--
-- NOTA: el schema.sql base ya habilita RLS y añade políticas permisivas para
-- el flujo Zero-Auth del MVP. Este archivo refuerza y documenta las políticas
-- explícitas para producción, eliminando cualquier laguna de actualización o borrado.
-- =============================================================================


-- ---------------------------------------------------------------------------
-- TABLA: contests
-- ---------------------------------------------------------------------------

-- Aseguramos que RLS esté habilitado (por si se ejecuta de forma independiente)
alter table contests enable row level security;

-- Política: cualquier usuario (incluso anónimo) puede leer concursos.
-- Justificación: el acceso está implícitamente restringido por UUID, que solo
-- conocen quienes tengan el enlace o el PIN.
drop policy if exists "Invitados pueden leer concursos" on contests;
create policy "Invitados pueden leer concursos"
  on contests
  for select
  using (true);

-- Política: cualquier usuario (incluso anónimo) puede crear concursos.
-- El host_token generado en cliente actúa como credencial ligera del anfitrión.
drop policy if exists "Invitados pueden crear concursos" on contests;
create policy "Invitados pueden crear concursos"
  on contests
  for insert
  with check (true);

-- Política de bloqueo: nadie puede actualizar concursos existentes.
-- (Sin política UPDATE activa, el motor rechaza la operación por defecto
--  cuando RLS está habilitado. Esta política es explícita y autodocumentada.)
drop policy if exists "Nadie puede actualizar concursos" on contests;
create policy "Nadie puede actualizar concursos"
  on contests
  for update
  using (false);

-- Política de bloqueo: nadie puede borrar concursos.
drop policy if exists "Nadie puede borrar concursos" on contests;
create policy "Nadie puede borrar concursos"
  on contests
  for delete
  using (false);


-- ---------------------------------------------------------------------------
-- TABLA: votes
-- ---------------------------------------------------------------------------

-- Aseguramos que RLS esté habilitado
alter table votes enable row level security;

-- Política: cualquier usuario puede leer los votos de un concurso conocido.
-- La condición verifica que el contest_id exista, evitando lecturas huérfanas.
drop policy if exists "Invitados pueden leer votos" on votes;
create policy "Invitados pueden leer votos"
  on votes
  for select
  using (
    exists (select 1 from contests where id = votes.contest_id)
  );

-- Política: cualquier usuario puede votar en un concurso existente.
-- La restricción unique(contest_id, guest_name) en el schema ya evita votos dobles.
drop policy if exists "Invitados pueden votar" on votes;
create policy "Invitados pueden votar"
  on votes
  for insert
  with check (
    exists (select 1 from contests where id = votes.contest_id)
  );

-- Política de bloqueo: nadie puede modificar votos ya emitidos.
drop policy if exists "Nadie puede actualizar votos" on votes;
create policy "Nadie puede actualizar votos"
  on votes
  for update
  using (false);

-- Política de bloqueo: nadie puede borrar votos.
drop policy if exists "Nadie puede borrar votos" on votes;
create policy "Nadie puede borrar votos"
  on votes
  for delete
  using (false);
