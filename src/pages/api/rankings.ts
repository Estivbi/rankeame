import type { APIRoute } from "astro";
import { supabase, isSupabaseConfigured } from "../../lib/supabase";
import { randomUUID } from "crypto";

export const POST: APIRoute = async ({ request }) => {
  if (!isSupabaseConfigured) {
    return new Response(
      JSON.stringify({ error: "Base de datos no configurada." }),
      { status: 503, headers: { "Content-Type": "application/json" } }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return new Response(
      JSON.stringify({ error: "Cuerpo de la petición inválido." }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  const { name, description } = body as Record<string, unknown>;

  if (typeof name !== "string" || name.trim().length === 0) {
    return new Response(
      JSON.stringify({ error: "El nombre del ranking es obligatorio." }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  if (name.trim().length > 100) {
    return new Response(
      JSON.stringify({ error: "El nombre no puede superar los 100 caracteres." }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  const trimmedDescription =
    typeof description === "string" && description.trim().length > 0
      ? description.trim()
      : null;

  if (trimmedDescription !== null && trimmedDescription.length > 300) {
    return new Response(
      JSON.stringify({ error: "La descripción no puede superar los 300 caracteres." }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  const hostToken = randomUUID();

  const { data, error } = await supabase
    .from("rankings")
    .insert({
      name: name.trim(),
      description: trimmedDescription,
      host_token: hostToken,
    })
    .select("id")
    .single();

  if (error || !data) {
    return new Response(
      JSON.stringify({ error: "No se pudo crear el ranking. Inténtalo de nuevo." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }

  return new Response(
    JSON.stringify({ id: data.id, hostToken }),
    { status: 201, headers: { "Content-Type": "application/json" } }
  );
};
