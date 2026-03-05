"use client";

import { useState } from "react";

interface VotingFormProps {
  contestId: string;
  contestName: string;
}

// Elementos por defecto del MVP. En futuras versiones, el anfitrión podrá
// definir sus propios elementos al crear el concurso (guardados en la tabla contests).
const DEFAULT_ITEMS = ["Elemento 1", "Elemento 2", "Elemento 3"];

export default function VotingForm({ contestId, contestName }: VotingFormProps) {
  const [guestName, setGuestName] = useState("");
  const [scores, setScores] = useState<Record<string, number>>(
    Object.fromEntries(DEFAULT_ITEMS.map((item) => [item, 5]))
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const handleScoreChange = (item: string, value: number) => {
    setScores((prev) => ({ ...prev, [item]: value }));
  };

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    const name = guestName.trim();
    if (!name) {
      setError("Por favor, introduce tu nombre.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/votes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contest_id: contestId,
          guest_name: name,
          scores_json: scores,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Algo salió mal.");
        return;
      }

      setSubmitted(true);
    } catch {
      setError("Error de red. Por favor, inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center gap-4 py-10 text-center">
        <span className="text-5xl">🎉</span>
        <h2 className="text-xl font-bold">¡Voto enviado!</h2>
        <p className="text-sm" style={{ color: "var(--color-muted-foreground)" }}>
          Gracias por votar en <strong>{contestName}</strong>.
        </p>
        <a
          href={`/c/${contestId}`}
          className="mt-2 rounded-xl px-6 py-3 text-sm font-semibold"
          style={{
            backgroundColor: "var(--color-primary)",
            color: "var(--color-primary-foreground)",
          }}
        >
          Ver la clasificación →
        </a>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Nombre del participante */}
      <div className="space-y-1.5">
        <label
          htmlFor="guest-name"
          className="block text-sm font-medium"
          style={{ color: "var(--color-foreground)" }}
        >
          Tu nombre
        </label>
        <input
          id="guest-name"
          type="text"
          value={guestName}
          onChange={(e) => setGuestName(e.target.value)}
          placeholder="Escribe tu nombre"
          maxLength={50}
          required
          disabled={loading}
          className="w-full rounded-lg border px-4 py-2.5 text-sm outline-none transition"
          style={{
            borderColor: "var(--color-border)",
            backgroundColor: "var(--color-background)",
            color: "var(--color-foreground)",
          }}
        />
      </div>

      {/* Controles deslizantes */}
      <div className="space-y-4">
        <p className="text-sm font-medium" style={{ color: "var(--color-foreground)" }}>
          Puntúa cada elemento (1–10)
        </p>
        {Object.entries(scores).map(([item, value]) => (
          <div key={item} className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium">{item}</label>
              <span
                className="text-lg font-bold tabular-nums w-8 text-right"
                style={{ color: "var(--color-primary)" }}
              >
                {value}
              </span>
            </div>
            <input
              type="range"
              min={1}
              max={10}
              step={1}
              value={value}
              disabled={loading}
              onChange={(e) => handleScoreChange(item, Number(e.target.value))}
              className="w-full h-2 rounded-full appearance-none cursor-pointer disabled:opacity-50"
              style={{
                accentColor: "var(--color-primary)",
                backgroundColor: "var(--color-border)",
              }}
              aria-label={`Puntuación de ${item}`}
            />
            <div
              className="flex justify-between text-xs"
              style={{ color: "var(--color-muted-foreground)" }}
            >
              <span>1 · Malo</span>
              <span>10 · Excelente</span>
            </div>
          </div>
        ))}
      </div>

      {error && (
        <p
          role="alert"
          className="text-sm"
          style={{ color: "var(--color-destructive)" }}
        >
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading || !guestName.trim()}
        className="w-full rounded-xl py-3 text-sm font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
        style={{
          backgroundColor: "var(--color-primary)",
          color: "var(--color-primary-foreground)",
        }}
      >
        {loading ? "Enviando…" : "Enviar Voto 🗳️"}
      </button>
    </form>
  );
}
