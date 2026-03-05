import type { APIRoute } from "astro";
import { supabase } from "../../lib/supabase";
import { randomUUID } from "crypto";

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const name = (body?.name ?? "").trim();

    if (!name) {
      return new Response(JSON.stringify({ error: "Contest name is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (name.length > 100) {
      return new Response(
        JSON.stringify({ error: "Contest name must be 100 characters or less" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const hostToken = randomUUID();

    const { data, error } = await supabase
      .from("contests")
      .insert({ name, host_token: hostToken })
      .select("id, name, created_at")
      .single();

    if (error) {
      console.error("Supabase error creating contest:", error);
      return new Response(JSON.stringify({ error: "Failed to create contest" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ ...data, hostToken }), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch {
    return new Response(JSON.stringify({ error: "Invalid request" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }
};
