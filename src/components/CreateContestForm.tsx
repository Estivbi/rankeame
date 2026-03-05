"use client";

import { useState } from "react";
import { CONTEST_TEMPLATES, type ContestType } from "../lib/contestTypes";

export default function CreateContestForm() {
  const [name, setName] = useState("");
  const [contestType, setContestType] = useState<ContestType>("tortillas");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) {
      setError("Por favor, introduce un nombre para el concurso.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/contests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: trimmed, contest_type: contestType }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Algo salió mal.");
        return;
      }

      // Persist host token in localStorage
      localStorage.setItem(`hostToken:${data.id}`, data.hostToken);

      // Redirect to the contest dashboard
      window.location.href = `/c/${data.id}`;
    } catch {
      setError("Error de red. Por favor, inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  const selectedTemplate = CONTEST_TEMPLATES.find((t) => t.id === contestType)!;

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Tipo de concurso */}
      <div className="space-y-2">
        <p
          className="block text-sm font-medium"
          style={{ color: "var(--color-foreground)" }}
        >
          Tipo de concurso
        </p>
        <div className="grid grid-cols-2 gap-2">
          {CONTEST_TEMPLATES.map((template) => (
            <button
              key={template.id}
              type="button"
              onClick={() => setContestType(template.id)}
              disabled={loading}
              className="flex flex-col items-center gap-1 rounded-xl border px-3 py-3 text-sm font-medium transition disabled:opacity-50"
              style={{
                borderColor:
                  contestType === template.id
                    ? "var(--color-primary)"
                    : "var(--color-border)",
                backgroundColor:
                  contestType === template.id
                    ? "var(--color-accent)"
                    : "var(--color-background)",
                color: "var(--color-foreground)",
                boxShadow:
                  contestType === template.id
                    ? "0 0 0 2px var(--color-primary)"
                    : "none",
              }}
            >
              <span className="text-2xl">{template.emoji}</span>
              <span>{template.label}</span>
            </button>
          ))}
        </div>
        <p className="text-xs" style={{ color: "var(--color-muted-foreground)" }}>
          Criterios:{" "}
          <span className="font-medium" style={{ color: "var(--color-foreground)" }}>
            {selectedTemplate.criteria.join(", ")}
          </span>
        </p>
      </div>

      {/* Nombre del concurso */}
      <div className="space-y-1.5">
        <label
          htmlFor="contest-name"
          className="block text-sm font-medium"
          style={{ color: "var(--color-foreground)" }}
        >
          Nombre del concurso
        </label>
        <input
          id="contest-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="ej. Tortillas del barrio"
          maxLength={100}
          required
          disabled={loading}
          className="w-full rounded-lg border px-4 py-2.5 text-sm outline-none transition placeholder:opacity-50
            focus:ring-2 disabled:opacity-50"
          style={{
            borderColor: error ? "var(--color-destructive)" : "var(--color-border)",
            backgroundColor: "var(--color-background)",
            color: "var(--color-foreground)",
          }}
          aria-describedby={error ? "contest-name-error" : undefined}
          aria-invalid={!!error}
        />
        {error && (
          <p
            id="contest-name-error"
            role="alert"
            className="text-sm"
            style={{ color: "var(--color-destructive)" }}
          >
            {error}
          </p>
        )}
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
        {loading ? "Creando…" : "Crear Concurso →"}
      </button>
    </form>
  );
}
