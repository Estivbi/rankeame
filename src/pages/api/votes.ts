import type { APIRoute } from "astro";
import { supabase, isSupabaseConfigured } from "../../lib/supabase";
import { submitVoteSchema } from "../../lib/schemas";

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();

    const parsed = submitVoteSchema.safeParse(body);
    if (!parsed.success) {
      const message = parsed.error.errors[0]?.message ?? "Solicitud inválida";
      return new Response(JSON.stringify({ error: message }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const { contest_id, guest_name: name, item_name: itemName, scores_json } = parsed.data;

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
