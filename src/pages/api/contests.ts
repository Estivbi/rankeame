import type { APIRoute } from "astro";
import { supabase } from "../../lib/supabase";
import { CONTEST_TYPE_IDS } from "../../lib/contestTypes";
import { randomUUID } from "crypto";

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const name = (body?.name ?? "").trim();

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

    const hostToken = randomUUID();

    const { data, error } = await supabase
      .from("contests")
      .insert({ name, host_token: hostToken, contest_type })
      .select("id, name, contest_type, created_at")
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
