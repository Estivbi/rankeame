import { e as createComponent, k as renderComponent, r as renderTemplate, h as createAstro, m as maybeRenderHead, g as addAttribute } from '../../chunks/astro/server_rqQWen4l.mjs';
import 'piccolore';
import { $ as $$BaseLayout } from '../../chunks/BaseLayout_B7F1RS--.mjs';
import { jsxs, jsx } from 'react/jsx-runtime';
import { useState } from 'react';
import { s as supabase } from '../../chunks/supabase_DotLsHd9.mjs';
import { a as getCriteria } from '../../chunks/contestTypes_DwaRKO1P.mjs';
export { renderers } from '../../renderers.mjs';

function VotingForm({ contestId, contestName, criteria }) {
  const [guestName, setGuestName] = useState("");
  const [scores, setScores] = useState(
    Object.fromEntries(criteria.map((c) => [c, 5]))
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const handleScoreChange = (item, value) => {
    setScores((prev) => ({ ...prev, [item]: value }));
  };
  const handleSubmit = async (e) => {
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
          scores_json: scores
        })
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
    return /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center gap-4 py-10 text-center", children: [
      /* @__PURE__ */ jsx("span", { className: "text-5xl", children: "🎉" }),
      /* @__PURE__ */ jsx("h2", { className: "text-xl font-bold", children: "¡Voto enviado!" }),
      /* @__PURE__ */ jsxs("p", { className: "text-sm", style: { color: "var(--color-muted-foreground)" }, children: [
        "Gracias por votar en ",
        /* @__PURE__ */ jsx("strong", { children: contestName }),
        "."
      ] }),
      /* @__PURE__ */ jsx(
        "a",
        {
          href: `/c/${contestId}`,
          className: "mt-2 rounded-xl px-6 py-3 text-sm font-semibold",
          style: {
            backgroundColor: "var(--color-primary)",
            color: "var(--color-primary-foreground)"
          },
          children: "Ver la clasificación →"
        }
      )
    ] });
  }
  return /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: "space-y-6", children: [
    /* @__PURE__ */ jsxs("div", { className: "space-y-1.5", children: [
      /* @__PURE__ */ jsx(
        "label",
        {
          htmlFor: "guest-name",
          className: "block text-sm font-medium",
          style: { color: "var(--color-foreground)" },
          children: "Tu nombre"
        }
      ),
      /* @__PURE__ */ jsx(
        "input",
        {
          id: "guest-name",
          type: "text",
          value: guestName,
          onChange: (e) => setGuestName(e.target.value),
          placeholder: "Escribe tu nombre",
          maxLength: 50,
          required: true,
          disabled: loading,
          className: "w-full rounded-lg border px-4 py-2.5 text-sm outline-none transition",
          style: {
            borderColor: "var(--color-border)",
            backgroundColor: "var(--color-background)",
            color: "var(--color-foreground)"
          }
        }
      )
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
      /* @__PURE__ */ jsx("p", { className: "text-sm font-medium", style: { color: "var(--color-foreground)" }, children: "Puntúa cada elemento (1–10)" }),
      Object.entries(scores).map(([item, value]) => /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center", children: [
          /* @__PURE__ */ jsx("label", { className: "text-sm font-medium", children: item }),
          /* @__PURE__ */ jsx(
            "span",
            {
              className: "text-lg font-bold tabular-nums w-8 text-right",
              style: { color: "var(--color-primary)" },
              children: value
            }
          )
        ] }),
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "range",
            min: 1,
            max: 10,
            step: 1,
            value,
            disabled: loading,
            onChange: (e) => handleScoreChange(item, Number(e.target.value)),
            className: "w-full h-2 rounded-full appearance-none cursor-pointer disabled:opacity-50",
            style: {
              accentColor: "var(--color-primary)",
              backgroundColor: "var(--color-border)"
            },
            "aria-label": `Puntuación de ${item}`
          }
        ),
        /* @__PURE__ */ jsxs(
          "div",
          {
            className: "flex justify-between text-xs",
            style: { color: "var(--color-muted-foreground)" },
            children: [
              /* @__PURE__ */ jsx("span", { children: "1 · Malo" }),
              /* @__PURE__ */ jsx("span", { children: "10 · Excelente" })
            ]
          }
        )
      ] }, item))
    ] }),
    error && /* @__PURE__ */ jsx(
      "p",
      {
        role: "alert",
        className: "text-sm",
        style: { color: "var(--color-destructive)" },
        children: error
      }
    ),
    /* @__PURE__ */ jsx(
      "button",
      {
        type: "submit",
        disabled: loading || !guestName.trim(),
        className: "w-full rounded-xl py-3 text-sm font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed",
        style: {
          backgroundColor: "var(--color-primary)",
          color: "var(--color-primary-foreground)"
        },
        children: loading ? "Enviando…" : "Enviar Voto 🗳️"
      }
    )
  ] });
}

const $$Astro = createAstro();
const $$id = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$id;
  const { id } = Astro2.params;
  if (!id) {
    return Astro2.redirect("/");
  }
  const { data: contest, error } = await supabase.from("contests").select("id, name, contest_type").eq("id", id).single();
  if (error || !contest) {
    return Astro2.redirect("/");
  }
  const criteria = getCriteria(contest.contest_type ?? "tortillas");
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": `Votar \xB7 ${contest.name}`, "description": `Emite tu voto en ${contest.name}` }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="max-w-md mx-auto px-4 space-y-6 py-6"> <!-- Header --> <header class="space-y-1 text-center"> <p class="text-xs font-semibold uppercase tracking-widest text-[var(--color-muted-foreground)]">
Votando en
</p> <h1 class="text-2xl font-bold leading-tight">${contest.name}</h1> </header> <!-- Voting card --> <section class="rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] p-6"> ${renderComponent($$result2, "VotingForm", VotingForm, { "contestId": contest.id, "contestName": contest.name, "criteria": criteria, "client:load": true, "client:component-hydration": "load", "client:component-path": "/home/runner/work/rankeame/rankeame/src/components/VotingForm", "client:component-export": "default" })} </section> <!-- Back link --> <a${addAttribute(`/c/${id}`, "href")} class="block text-center text-xs text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)] transition">
← Volver a la clasificación
</a> </div> ` })}`;
}, "/home/runner/work/rankeame/rankeame/src/pages/vote/[id].astro", void 0);

const $$file = "/home/runner/work/rankeame/rankeame/src/pages/vote/[id].astro";
const $$url = "/vote/[id]";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$id,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
