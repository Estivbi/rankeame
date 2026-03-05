import type { APIRoute } from "astro";
import { supabase } from "../../lib/supabase";

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { contest_id, guest_name, scores_json } = body ?? {};

    if (!contest_id || typeof contest_id !== "string") {
      return new Response(JSON.stringify({ error: "contest_id is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const name = (guest_name ?? "").trim();
    if (!name) {
      return new Response(JSON.stringify({ error: "guest_name is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (name.length > 50) {
      return new Response(
        JSON.stringify({ error: "Name must be 50 characters or less" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    if (
      !scores_json ||
      typeof scores_json !== "object" ||
      Array.isArray(scores_json) ||
      Object.keys(scores_json).length === 0
    ) {
      return new Response(
        JSON.stringify({ error: "scores_json must be a non-empty object" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Validate that all score values are integers between 1 and 10
    for (const [key, value] of Object.entries(scores_json)) {
      if (typeof value !== "number" || !Number.isInteger(value) || value < 1 || value > 10) {
        return new Response(
          JSON.stringify({
            error: `Score for "${key}" must be an integer between 1 and 10`,
          }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
      }
    }

    // Verify contest exists
    const { data: contest, error: contestError } = await supabase
      .from("contests")
      .select("id")
      .eq("id", contest_id)
      .single();

    if (contestError || !contest) {
      return new Response(JSON.stringify({ error: "Contest not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    const { data, error } = await supabase
      .from("votes")
      .insert({ contest_id, guest_name: name, scores_json })
      .select("id, created_at")
      .single();

    if (error) {
      console.error("Supabase error submitting vote:", error);
      return new Response(JSON.stringify({ error: "Failed to submit vote" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify(data), {
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
