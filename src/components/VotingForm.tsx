"use client";

import { useState } from "react";

interface VotingFormProps {
  contestId: string;
  contestName: string;
  criteria: string[];
  items: string[];
}

function buildDefaultScores(criteria: string[]): Record<string, number> {
  return Object.fromEntries(criteria.map((c) => [c, 5]));
}

export default function VotingForm({ contestId, contestName, criteria, items }: VotingFormProps) {
  const [guestName, setGuestName] = useState("");
  const [nameConfirmed, setNameConfirmed] = useState(false);
  const [selectedItem, setSelectedItem] = useState("");
  const [scores, setScores] = useState<Record<string, number>>(buildDefaultScores(criteria));
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [votedItems, setVotedItems] = useState<string[]>([]);
  const [lastVotedItem, setLastVotedItem] = useState<string | null>(null);

  const availableItems = items.filter((i) => !votedItems.includes(i));

  const handleScoreChange = (item: string, value: number) => {
    setScores((prev) => ({ ...prev, [item]: value }));
  };

  const handleConfirmName = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmed = guestName.trim();
    if (!trimmed) {
      setError("Por favor, introduce tu nombre.");
      return;
    }
    setError(null);
    setNameConfirmed(true);
  };

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedItem) {
      setError("Por favor, selecciona un participante.");
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
          guest_name: guestName.trim(),
          scores_json: scores,
          item_name: selectedItem,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Algo salió mal.");
        return;
      }

      setLastVotedItem(selectedItem);
      setVotedItems((prev) => [...prev, selectedItem]);
      setSelectedItem("");
      setScores(buildDefaultScores(criteria));

      // 3-second cooldown to prevent accidental double-submission
      setCooldown(true);
      setTimeout(() => setCooldown(false), 3000);
    } catch {
      setError("Error de red. Por favor, inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  // All items voted — show final success screen
  if (nameConfirmed && availableItems.length === 0 && votedItems.length > 0) {
    return (
      <div className="flex flex-col items-center gap-4 py-10 text-center">
        <span className="text-5xl">🎉</span>
        <h2 className="text-xl font-bold">¡Todos los votos enviados!</h2>
        <p className="text-sm" style={{ color: "var(--color-muted-foreground)" }}>
          Has votado por todos los participantes en{" "}
          <strong>{contestName}</strong>.
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

  // Step 1: Enter name
  if (!nameConfirmed) {
    return (
      <form onSubmit={handleConfirmName} className="space-y-5">
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
            className="w-full rounded-lg border px-4 py-2.5 text-sm outline-none transition"
            style={{
              borderColor: error ? "var(--color-destructive)" : "var(--color-border)",
              backgroundColor: "var(--color-background)",
              color: "var(--color-foreground)",
            }}
          />
          {error && (
            <p role="alert" className="text-sm" style={{ color: "var(--color-destructive)" }}>
              {error}
            </p>
          )}
        </div>
        <button
          type="submit"
          disabled={!guestName.trim()}
          className="w-full rounded-xl py-3 text-sm font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            backgroundColor: "var(--color-primary)",
            color: "var(--color-primary-foreground)",
          }}
        >
          Continuar →
        </button>
      </form>
    );
  }

  // Step 2 (with optional "just voted" banner): Select item + score
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* "Just voted" success banner */}
      {lastVotedItem && (
        <div
          className="rounded-xl border px-4 py-3 text-sm text-center"
          style={{
            borderColor: "var(--color-border)",
            backgroundColor: "var(--color-accent)",
            color: "var(--color-foreground)",
          }}
        >
          ✅ ¡Voto para <strong>{lastVotedItem}</strong> enviado! Puedes votar por otro participante.
        </div>
      )}

      {/* Voter identity (read-only) */}
      <div
        className="flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm"
        style={{ borderColor: "var(--color-border)", backgroundColor: "var(--color-background)" }}
      >
        <span className="text-base">👤</span>
        <span className="flex-1 font-medium">{guestName.trim()}</span>
        <button
          type="button"
          onClick={() => {
            if (
              votedItems.length === 0 ||
              window.confirm("¿Seguro que quieres cambiar de nombre? Perderás tu progreso de votos.")
            ) {
              setNameConfirmed(false);
              setVotedItems([]);
              setLastVotedItem(null);
              setSelectedItem("");
              setScores(buildDefaultScores(criteria));
              setError(null);
            }
          }}
          className="text-xs underline"
          style={{ color: "var(--color-muted-foreground)" }}
        >
          Cambiar
        </button>
      </div>

      {/* Participant selector */}
      <div className="space-y-1.5">
        <label
          htmlFor="item-select"
          className="block text-sm font-medium"
          style={{ color: "var(--color-foreground)" }}
        >
          Participante a valorar
        </label>
        <select
          id="item-select"
          value={selectedItem}
          onChange={(e) => {
            setSelectedItem(e.target.value);
            setScores(buildDefaultScores(criteria));
            setError(null);
          }}
          disabled={loading}
          required
          className="w-full rounded-lg border px-4 py-2.5 text-sm outline-none transition disabled:opacity-50"
          style={{
            borderColor: error && !selectedItem ? "var(--color-destructive)" : "var(--color-border)",
            backgroundColor: "var(--color-background)",
            color: "var(--color-foreground)",
          }}
        >
          <option value="">— Elige un participante —</option>
          {availableItems.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </div>

      {/* Criteria sliders — only shown when an item is selected */}
      {selectedItem && (
        <div className="space-y-4">
          <p className="text-sm font-medium" style={{ color: "var(--color-foreground)" }}>
            Puntúa <strong>{selectedItem}</strong> (1–10)
          </p>
          {Object.entries(scores).map(([criterion, value]) => (
            <div key={criterion} className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium">{criterion}</label>
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
                onChange={(e) => handleScoreChange(criterion, Number(e.target.value))}
                className="w-full h-2 rounded-full appearance-none cursor-pointer disabled:opacity-50"
                style={{
                  accentColor: "var(--color-primary)",
                  backgroundColor: "var(--color-border)",
                }}
                aria-label={`Puntuación de ${criterion}`}
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
      )}

      {error && (
        <p role="alert" className="text-sm" style={{ color: "var(--color-destructive)" }}>
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading || cooldown || !selectedItem}
        className="w-full rounded-xl py-3 text-sm font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
        style={{
          backgroundColor: "var(--color-primary)",
          color: "var(--color-primary-foreground)",
        }}
      >
        {loading ? "Enviando…" : cooldown ? "Voto enviado ✓" : "Enviar Voto 🗳️"}
      </button>

      {votedItems.length > 0 && (
        <a
          href={`/c/${contestId}`}
          className="block text-center text-xs underline"
          style={{ color: "var(--color-muted-foreground)" }}
        >
          Ver la clasificación →
        </a>
      )}
    </form>
  );
}
