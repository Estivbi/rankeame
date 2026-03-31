import type { APIRoute } from "astro";
import { supabase, isSupabaseConfigured } from "../../lib/supabase";
import { createContestSchema } from "../../lib/schemas";
import { randomUUID } from "crypto";

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();

    // Deduplicate items before validation (preserve order, case-sensitive)
    const rawItems = Array.isArray(body?.items) ? body.items : [];
    const seen = new Set<string>();
    const dedupedItems: string[] = [];
    for (const raw of rawItems) {
      const trimmed = String(raw ?? "").trim();
      if (trimmed && !seen.has(trimmed)) {
        seen.add(trimmed);
        dedupedItems.push(trimmed);
      }
    }

    const parsed = createContestSchema.safeParse({
      ...body,
      items: dedupedItems,
    });

    if (!parsed.success) {
      const message = parsed.error.errors[0]?.message ?? "Solicitud inválida";
      return new Response(JSON.stringify({ error: message }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const { name, contest_type, items } = parsed.data;

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

      if (error.code === "42703") {
        return new Response(
          JSON.stringify({
            error:
              "La base de datos está desactualizada. Falta la columna contests.items. Ejecuta supabase/schema.sql en tu proyecto de Supabase.",
          }),
          {
            status: 500,
            headers: { "Content-Type": "application/json" },
          }
        );
      }

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
