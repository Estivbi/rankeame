"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

interface Vote {
  id: string;
  guest_name: string;
  scores_json: Record<string, number>;
  created_at: string;
}

interface LeaderboardEntry {
  name: string;
  avgScore: number;
  voteCount: number;
}

interface LeaderboardProps {
  contestId: string;
  supabaseUrl: string;
  supabaseAnonKey: string;
}

function computeLeaderboard(votes: Vote[]): LeaderboardEntry[] {
  if (votes.length === 0) return [];

  // Collect all item names across all votes
  const items = new Set<string>();
  for (const v of votes) {
    for (const key of Object.keys(v.scores_json)) {
      items.add(key);
    }
  }

  const entries: LeaderboardEntry[] = [];
  for (const item of items) {
    const scores = votes
      .map((v) => v.scores_json[item])
      .filter((s): s is number => typeof s === "number");
    if (scores.length > 0) {
      const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
      entries.push({ name: item, avgScore: avg, voteCount: scores.length });
    }
  }

  return entries.sort((a, b) => b.avgScore - a.avgScore);
}

export default function Leaderboard({
  contestId,
  supabaseUrl,
  supabaseAnonKey,
}: LeaderboardProps) {
  const [votes, setVotes] = useState<Vote[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(false);

  useEffect(() => {
    const client = createClient(supabaseUrl, supabaseAnonKey);

    // Initial fetch
    client
      .from("votes")
      .select("id, guest_name, scores_json, created_at")
      .eq("contest_id", contestId)
      .order("created_at", { ascending: true })
      .then(({ data, error }) => {
        if (error) {
          setFetchError(true);
        } else if (data) {
          setVotes(data as Vote[]);
        }
        setLoading(false);
      });

    // Realtime subscription — deduplicate by vote id to avoid race condition
    // where a vote inserted between subscription setup and initial fetch resolve
    // could appear twice.
    const channel = client
      .channel(`votes:${contestId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "votes",
          filter: `contest_id=eq.${contestId}`,
        },
        (payload) => {
          const newVote = payload.new as Vote;
          setVotes((prev) =>
            prev.some((v) => v.id === newVote.id) ? prev : [...prev, newVote]
          );
        }
      )
      .subscribe();

    return () => {
      client.removeChannel(channel);
    };
  }, [contestId, supabaseUrl, supabaseAnonKey]);

  const leaderboard = computeLeaderboard(votes);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8 text-sm" style={{ color: "var(--color-muted-foreground)" }}>
        <span className="animate-pulse">Cargando votos…</span>
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="rounded-xl border py-10 text-center" style={{ borderColor: "var(--color-border)" }}>
        <p className="text-3xl mb-2">⚠️</p>
        <p className="text-sm font-medium" style={{ color: "var(--color-muted-foreground)" }}>
          Error al cargar los votos. Por favor, recarga la página.
        </p>
      </div>
    );
  }

  if (leaderboard.length === 0) {
    return (
      <div className="rounded-xl border py-10 text-center" style={{ borderColor: "var(--color-border)" }}>
        <p className="text-3xl mb-2">🗳️</p>
        <p className="text-sm font-medium" style={{ color: "var(--color-muted-foreground)" }}>
          Aún no hay votos — ¡comparte el enlace para empezar!
        </p>
      </div>
    );
  }

  const medals = ["🥇", "🥈", "🥉"];

  return (
    <div className="space-y-2">
      <p className="text-xs" style={{ color: "var(--color-muted-foreground)" }}>
        {votes.length} {votes.length !== 1 ? "votos" : "voto"} • Actualización en tiempo real
      </p>
      <ol className="space-y-2">
        {leaderboard.map((entry, idx) => (
          <li
            key={entry.name}
            className="flex items-center gap-3 rounded-xl border p-3"
            style={{
              borderColor: "var(--color-border)",
              backgroundColor: idx === 0 ? "var(--color-accent)" : "var(--color-card)",
            }}
          >
            <span className="text-xl w-7 text-center shrink-0">
              {medals[idx] ?? `${idx + 1}`}
            </span>
            <div className="flex-1 min-w-0">
              <p className="font-semibold truncate text-sm">{entry.name}</p>
              <div
                className="mt-1 h-1.5 rounded-full overflow-hidden"
                style={{ backgroundColor: "var(--color-border)" }}
              >
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${(entry.avgScore / 10) * 100}%`,
                    backgroundColor:
                      idx === 0
                        ? "var(--color-primary)"
                        : "var(--color-muted-foreground)",
                  }}
                />
              </div>
            </div>
            <div className="text-right shrink-0">
              <span className="text-lg font-bold">{entry.avgScore.toFixed(1)}</span>
              <p className="text-xs" style={{ color: "var(--color-muted-foreground)" }}>
                {entry.voteCount} {entry.voteCount !== 1 ? "votos" : "voto"}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
