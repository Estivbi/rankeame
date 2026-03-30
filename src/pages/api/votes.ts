import type { APIRoute } from "astro";
import { supabase, isSupabaseConfigured } from "../../lib/supabase";

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { contest_id, guest_name, scores_json, item_name } = body ?? {};

    if (!contest_id || typeof contest_id !== "string") {
      return new Response(JSON.stringify({ error: "El campo contest_id es obligatorio" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const name = (guest_name ?? "").trim();
    if (!name) {
      return new Response(JSON.stringify({ error: "El campo guest_name es obligatorio" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (name.length > 50) {
      return new Response(
        JSON.stringify({ error: "El nombre debe tener 50 caracteres o menos" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const itemName = (item_name ?? "").trim();
    if (!itemName) {
      return new Response(JSON.stringify({ error: "El campo item_name es obligatorio" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (
      !scores_json ||
      typeof scores_json !== "object" ||
      Array.isArray(scores_json) ||
      Object.keys(scores_json).length === 0
    ) {
      return new Response(
        JSON.stringify({ error: "scores_json debe ser un objeto no vacío" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Validate that all score values are integers between 1 and 10
    for (const [key, value] of Object.entries(scores_json)) {
      if (typeof value !== "number" || !Number.isInteger(value) || value < 1 || value > 10) {
        return new Response(
          JSON.stringify({
            error: `La puntuación de "${key}" debe ser un entero entre 1 y 10`,
          }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
      }
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

    // Verify contest exists and fetch items for item_name validation
    const { data: contest, error: contestError } = await supabase
      .from("contests")
      .select("id, items")
      .eq("id", contest_id)
      .single();

    if (contestError || !contest) {
      return new Response(JSON.stringify({ error: "Concurso no encontrado" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Validate item_name belongs to this contest's participant list
    const validItems: string[] = Array.isArray((contest as { items?: unknown }).items)
      ? ((contest as { items: unknown[] }).items as unknown[])
          .map((i) => String(i ?? "").trim())
          .filter(Boolean)
      : [];

    if (validItems.length > 0 && !validItems.includes(itemName)) {
      return new Response(
        JSON.stringify({ error: "El participante elegido no pertenece a este concurso" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const { data, error } = await supabase
      .from("votes")
      .insert({ contest_id, guest_name: name, scores_json, item_name: itemName })
      .select("id, created_at")
      .single();

    if (error) {
      // Unique constraint violation: this guest already voted for this item
      if (error.code === "23505") {
        return new Response(
          JSON.stringify({ error: "Ya has votado por este participante en este concurso" }),
          { status: 409, headers: { "Content-Type": "application/json" } }
        );
      }
      console.error("Supabase error submitting vote:", error);
      return new Response(JSON.stringify({ error: "Error al enviar el voto" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify(data), {
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
