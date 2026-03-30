"use client";

import { useState } from "react";
import { CONTEST_TEMPLATES, type ContestType } from "../lib/contestTypes";

export default function CreateContestForm() {
  const [name, setName] = useState("");
  const [contestType, setContestType] = useState<ContestType>("tortillas");
  const [items, setItems] = useState<string[]>([]);
  const [newItem, setNewItem] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addItem = () => {
    const trimmed = newItem.trim();
    if (!trimmed) return;
    if (items.includes(trimmed)) {
      setError(`"${trimmed}" ya está en la lista de participantes.`);
      return;
    }
    setItems((prev) => [...prev, trimmed]);
    setNewItem("");
    setError(null);
  };

  const removeItem = (index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleItemKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addItem();
    }
  };

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) {
      setError("Por favor, introduce un nombre para el concurso.");
      return;
    }
    if (items.length === 0) {
      setError("Añade al menos un participante antes de crear el concurso.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/contests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: trimmed, contest_type: contestType, items }),
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
          id="contest-type-label"
          className="block text-sm font-medium"
          style={{ color: "var(--color-foreground)" }}
        >
          Tipo de concurso
        </p>
        <div
          className="grid grid-cols-2 gap-2"
          role="radiogroup"
          aria-labelledby="contest-type-label"
        >
          {CONTEST_TEMPLATES.map((template) => (
            <button
              key={template.id}
              type="button"
              role="radio"
              aria-checked={contestType === template.id}
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

      {/* Participantes */}
      <div className="space-y-2">
        <label
          className="block text-sm font-medium"
          style={{ color: "var(--color-foreground)" }}
        >
          Participantes{" "}
          <span className="font-normal" style={{ color: "var(--color-muted-foreground)" }}>
            (mínimo 1)
          </span>
        </label>

        {/* List of added items */}
        {items.length > 0 && (
          <ul className="space-y-1.5">
            {items.map((item, i) => (
              <li
                key={i}
                className="flex items-center gap-2 rounded-lg border px-3 py-2 text-sm"
                style={{
                  borderColor: "var(--color-border)",
                  backgroundColor: "var(--color-background)",
                  color: "var(--color-foreground)",
                }}
              >
                <span className="flex-1 truncate">{item}</span>
                <button
                  type="button"
                  onClick={() => removeItem(i)}
                  disabled={loading}
                  aria-label={`Eliminar ${item}`}
                  className="shrink-0 rounded px-1.5 py-0.5 text-xs font-semibold transition hover:opacity-75 disabled:opacity-40"
                  style={{
                    backgroundColor: "var(--color-destructive)",
                    color: "#ffffff",
                  }}
                >
                  ✕
                </button>
              </li>
            ))}
          </ul>
        )}

        {/* Add new item */}
        <div className="flex gap-2">
          <input
            type="text"
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            onKeyDown={handleItemKeyDown}
            placeholder="Nombre del participante"
            maxLength={80}
            disabled={loading}
            className="flex-1 rounded-lg border px-4 py-2.5 text-sm outline-none transition placeholder:opacity-50 disabled:opacity-50"
            style={{
              borderColor: "var(--color-border)",
              backgroundColor: "var(--color-background)",
              color: "var(--color-foreground)",
            }}
          />
          <button
            type="button"
            onClick={addItem}
            disabled={loading || !newItem.trim()}
            className="shrink-0 rounded-lg px-4 py-2.5 text-sm font-semibold transition disabled:opacity-40"
            style={{
              backgroundColor: "var(--color-primary)",
              color: "var(--color-primary-foreground)",
            }}
          >
            + Añadir
          </button>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading || !name.trim() || items.length === 0}
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
