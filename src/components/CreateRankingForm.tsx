"use client";

import { useState } from "react";

export default function CreateRankingForm() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmedName = name.trim();
    if (!trimmedName) {
      setError("Por favor, introduce un nombre para el ranking.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/rankings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: trimmedName,
          description: description.trim() ? description.trim() : null,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Algo salió mal.");
        return;
      }

      // Persist host token in localStorage
      localStorage.setItem(`hostToken:ranking:${data.id}`, data.hostToken);

      // Redirect to the ranking dashboard
      window.location.href = `/r/${data.id}`;
    } catch {
      setError("Error de red. Por favor, inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Nombre del ranking */}
      <div className="space-y-1.5">
        <label
          htmlFor="ranking-name"
          className="block text-sm font-medium"
          style={{ color: "var(--color-foreground)" }}
        >
          Nombre del Ranking
        </label>
        <input
          id="ranking-name"
          type="text"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            if (error) setError(null);
          }}
          placeholder="ej. Mejores Pizzas de Madrid"
          maxLength={100}
          required
          disabled={loading}
          className="w-full rounded-lg border px-4 py-2.5 text-sm outline-none transition placeholder:opacity-50 focus:ring-2 disabled:opacity-50"
          style={{
            borderColor: error ? "var(--color-destructive)" : "var(--color-border)",
            backgroundColor: "var(--color-background)",
            color: "var(--color-foreground)",
          }}
          aria-describedby={error ? "ranking-name-error" : undefined}
          aria-invalid={!!error}
        />
        {error && (
          <p
            id="ranking-name-error"
            role="alert"
            className="text-sm"
            style={{ color: "var(--color-destructive)" }}
          >
            {error}
          </p>
        )}
      </div>

      {/* Descripción */}
      <div className="space-y-1.5">
        <label
          htmlFor="ranking-description"
          className="block text-sm font-medium"
          style={{ color: "var(--color-foreground)" }}
        >
          Descripción{" "}
          <span className="font-normal" style={{ color: "var(--color-muted-foreground)" }}>
            (opcional)
          </span>
        </label>
        <textarea
          id="ranking-description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="ej. Las mejores pizzas artesanales de la capital, votadas por el barrio."
          maxLength={300}
          rows={3}
          disabled={loading}
          className="w-full rounded-lg border px-4 py-2.5 text-sm outline-none transition placeholder:opacity-50 resize-none disabled:opacity-50"
          style={{
            borderColor: "var(--color-border)",
            backgroundColor: "var(--color-background)",
            color: "var(--color-foreground)",
          }}
        />
      </div>

      <button
        type="submit"
        disabled={loading || !name.trim()}
        className="w-full rounded-lg py-3 text-sm font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
        style={{
          backgroundColor: "var(--color-primary)",
          color: "var(--color-primary-foreground)",
        }}
      >
        {loading ? "Creando…" : "Crear Ranking →"}
      </button>
    </form>
  );
}
