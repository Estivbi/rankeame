import type { APIRoute } from "astro";
import { supabase, isSupabaseConfigured } from "../../lib/supabase";
import { CONTEST_TYPE_IDS } from "../../lib/contestTypes";
import { randomUUID } from "crypto";

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const name = (body?.name ?? "").trim();

    const rawItems = body?.items;
    if (!Array.isArray(rawItems) || rawItems.length === 0) {
      return new Response(
        JSON.stringify({ error: "Debes añadir al menos un participante" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
    const items: string[] = rawItems.map((i: unknown) => String(i ?? "").trim()).filter(Boolean);
    if (items.length === 0) {
      return new Response(
        JSON.stringify({ error: "Los nombres de los participantes no pueden estar vacíos" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const rawContestType = body?.contest_type;

    if (rawContestType !== undefined && rawContestType !== null && typeof rawContestType !== "string") {
      return new Response(
        JSON.stringify({ error: "El tipo de concurso debe ser una cadena de texto" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const contest_type =
      typeof rawContestType === "string" ? rawContestType.trim().toLowerCase() : "tortillas";

    if (!name) {
      return new Response(JSON.stringify({ error: "El nombre del concurso es obligatorio" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (name.length > 100) {
      return new Response(
        JSON.stringify({ error: "El nombre del concurso debe tener 100 caracteres o menos" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    if (!CONTEST_TYPE_IDS.includes(contest_type as (typeof CONTEST_TYPE_IDS)[number])) {
      return new Response(
        JSON.stringify({ error: "Tipo de concurso no válido" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    if (!isSupabaseConfigured) {
      return new Response(
        JSON.stringify({
          error:
            "La base de datos no está configurada. Añade las variables PUBLIC_SUPABASE_URL y PUBLIC_SUPABASE_ANON_KEY en los ajustes de entorno de Vercel.",
        }),
        { status: 503, headers: { "Content-Type": "application/json" } }
      );
    }

    const hostToken = randomUUID();

    const { data, error } = await supabase
      .from("contests")
      .insert({ name, host_token: hostToken, contest_type, items })
      .select("id, name, contest_type, items, created_at")
      .single();

    if (error) {
      console.error("Supabase error creating contest:", error);
      return new Response(JSON.stringify({ error: "Error al crear el concurso" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ ...data, hostToken }), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch {
    return new Response(JSON.stringify({ error: "Solicitud inválida" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }
};
