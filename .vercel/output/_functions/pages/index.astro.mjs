import { e as createComponent, k as renderComponent, r as renderTemplate, m as maybeRenderHead, g as addAttribute } from '../chunks/astro/server_rqQWen4l.mjs';
import 'piccolore';
import { $ as $$BaseLayout } from '../chunks/BaseLayout_B7F1RS--.mjs';
import { jsxs, jsx } from 'react/jsx-runtime';
import { useState } from 'react';
import { b as CONTEST_TEMPLATES } from '../chunks/contestTypes_DwaRKO1P.mjs';
export { renderers } from '../renderers.mjs';

function CreateContestForm() {
  const [name, setName] = useState("");
  const [contestType, setContestType] = useState("tortillas");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const handleSubmit = async (e) => {
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
        body: JSON.stringify({ name: trimmed, contest_type: contestType })
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Algo salió mal.");
        return;
      }
      localStorage.setItem(`hostToken:${data.id}`, data.hostToken);
      window.location.href = `/c/${data.id}`;
    } catch {
      setError("Error de red. Por favor, inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  };
  const selectedTemplate = CONTEST_TEMPLATES.find((t) => t.id === contestType);
  return /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: "space-y-5", children: [
    /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
      /* @__PURE__ */ jsx(
        "p",
        {
          id: "contest-type-label",
          className: "block text-sm font-medium",
          style: { color: "var(--color-foreground)" },
          children: "Tipo de concurso"
        }
      ),
      /* @__PURE__ */ jsx(
        "div",
        {
          className: "grid grid-cols-2 gap-2",
          role: "radiogroup",
          "aria-labelledby": "contest-type-label",
          children: CONTEST_TEMPLATES.map((template) => /* @__PURE__ */ jsxs(
            "button",
            {
              type: "button",
              role: "radio",
              "aria-checked": contestType === template.id,
              onClick: () => setContestType(template.id),
              disabled: loading,
              className: "flex flex-col items-center gap-1 rounded-xl border px-3 py-3 text-sm font-medium transition disabled:opacity-50",
              style: {
                borderColor: contestType === template.id ? "var(--color-primary)" : "var(--color-border)",
                backgroundColor: contestType === template.id ? "var(--color-accent)" : "var(--color-background)",
                color: "var(--color-foreground)",
                boxShadow: contestType === template.id ? "0 0 0 2px var(--color-primary)" : "none"
              },
              children: [
                /* @__PURE__ */ jsx("span", { className: "text-2xl", children: template.emoji }),
                /* @__PURE__ */ jsx("span", { children: template.label })
              ]
            },
            template.id
          ))
        }
      ),
      /* @__PURE__ */ jsxs("p", { className: "text-xs", style: { color: "var(--color-muted-foreground)" }, children: [
        "Criterios:",
        " ",
        /* @__PURE__ */ jsx("span", { className: "font-medium", style: { color: "var(--color-foreground)" }, children: selectedTemplate.criteria.join(", ") })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "space-y-1.5", children: [
      /* @__PURE__ */ jsx(
        "label",
        {
          htmlFor: "contest-name",
          className: "block text-sm font-medium",
          style: { color: "var(--color-foreground)" },
          children: "Nombre del concurso"
        }
      ),
      /* @__PURE__ */ jsx(
        "input",
        {
          id: "contest-name",
          type: "text",
          value: name,
          onChange: (e) => setName(e.target.value),
          placeholder: "ej. Tortillas del barrio",
          maxLength: 100,
          required: true,
          disabled: loading,
          className: "w-full rounded-lg border px-4 py-2.5 text-sm outline-none transition placeholder:opacity-50\n            focus:ring-2 disabled:opacity-50",
          style: {
            borderColor: error ? "var(--color-destructive)" : "var(--color-border)",
            backgroundColor: "var(--color-background)",
            color: "var(--color-foreground)"
          },
          "aria-describedby": error ? "contest-name-error" : void 0,
          "aria-invalid": !!error
        }
      ),
      error && /* @__PURE__ */ jsx(
        "p",
        {
          id: "contest-name-error",
          role: "alert",
          className: "text-sm",
          style: { color: "var(--color-destructive)" },
          children: error
        }
      )
    ] }),
    /* @__PURE__ */ jsx(
      "button",
      {
        type: "submit",
        disabled: loading || !name.trim(),
        className: "w-full rounded-lg py-3 text-sm font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed",
        style: {
          backgroundColor: "var(--color-primary)",
          color: "var(--color-primary-foreground)"
        },
        children: loading ? "Creando…" : "Crear Concurso →"
      }
    )
  ] });
}

const $$Index = createComponent(($$result, $$props, $$slots) => {
  const typeBgs = {
    tortillas: { bg: "bg-orange-50", border: "border-orange-100" },
    croquetas: { bg: "bg-yellow-50", border: "border-yellow-100" },
    color: { bg: "bg-green-50", border: "border-green-100" },
    inicial: { bg: "bg-blue-50", border: "border-blue-100" }
  };
  const exampleRankings = [
    {
      emoji: "\u{1F355}",
      title: "Mejores Pizzer\xEDas",
      color: "border-red-100",
      headerBg: "bg-red-50",
      badge: "bg-red-100 text-red-600",
      entries: [
        { pos: 1, name: "La Bicicleta", score: 9.4 },
        { pos: 2, name: "Fratelli", score: 8.8 },
        { pos: 3, name: "Grosso Napoletano", score: 8.5 }
      ]
    },
    {
      emoji: "\u{1F354}",
      title: "Mejores Hamburguesas",
      color: "border-amber-100",
      headerBg: "bg-amber-50",
      badge: "bg-amber-100 text-amber-600",
      entries: [
        { pos: 1, name: "Goiko", score: 9.1 },
        { pos: 2, name: "TGB", score: 8.6 },
        { pos: 3, name: "Honest Greens", score: 8.2 }
      ]
    },
    {
      emoji: "\u{1F35C}",
      title: "Mejores Ramens",
      color: "border-indigo-100",
      headerBg: "bg-indigo-50",
      badge: "bg-indigo-100 text-indigo-600",
      entries: [
        { pos: 1, name: "Mensho Tokyo", score: 9.6 },
        { pos: 2, name: "Kappabashi", score: 9 },
        { pos: 3, name: "Ichiran", score: 8.7 }
      ]
    }
  ];
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": "Rankeame \u{1F3C6}", "description": "Crea un concurso de comida, comparte el enlace y vota en tiempo real. Sin registro." }, { "default": ($$result2) => renderTemplate`  ${maybeRenderHead()}<section class="bg-gradient-to-b from-orange-50 to-white"> <div class="max-w-md mx-auto px-4 pt-10 pb-8 text-center"> <div class="text-5xl mb-4">🏆</div> <h1 class="text-3xl font-extrabold text-slate-900 leading-tight mb-3">
¿Cuál triunfa en<br> <span class="text-orange-500">vuestra mesa?</span> </h1> <p class="text-slate-500 text-sm mb-6 leading-relaxed">
Crea un concurso de comida, comparte el enlace<br>
y vota en tiempo real — sin registro.
</p> <a href="#crear" class="inline-block bg-orange-500 hover:bg-orange-600 text-white font-bold px-8 py-3 rounded-2xl text-sm transition shadow-sm">
Crear concurso →
</a> </div> </section>  <section class="max-w-md mx-auto px-4 py-8"> <h2 class="text-xs font-bold text-slate-400 uppercase tracking-widest mb-5 text-center">
Cómo funciona
</h2> <div class="grid grid-cols-3 gap-3"> ${[
    { icon: "\u{1F517}", text: "Crea y comparte el enlace" },
    { icon: "\u{1F5F3}\uFE0F", text: "Todos votan sin registro" },
    { icon: "\u{1F4CA}", text: "Resultados en vivo" }
  ].map(({ icon, text }) => renderTemplate`<div class="bg-white rounded-2xl p-4 text-center shadow-sm border border-slate-100"> <div class="text-2xl mb-2">${icon}</div> <p class="text-xs font-semibold text-slate-700 leading-tight">${text}</p> </div>`)} </div> </section>  <section class="max-w-md mx-auto px-4 pb-6"> <h2 class="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 text-center">
Tipos de concurso
</h2> <div class="grid grid-cols-2 gap-3"> ${CONTEST_TEMPLATES.map((t) => {
    const style = typeBgs[t.id] ?? { bg: "bg-slate-50", border: "border-slate-100" };
    return renderTemplate`<div${addAttribute(`${style.bg} border ${style.border} rounded-2xl p-4`, "class")}> <div class="text-2xl mb-1">${t.emoji}</div> <p class="font-bold text-slate-800 text-sm">${t.label}</p> <p class="text-xs text-slate-500 mt-0.5">${t.criteria.join(" \xB7 ")}</p> </div>`;
  })} </div> </section>  <section class="py-8 bg-slate-50"> <div class="max-w-md mx-auto px-4"> <h2 class="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1 text-center">
Rankings populares
</h2> <p class="text-center text-sm text-slate-500 mb-5">
Así quedan los resultados en tu grupo
</p> <div class="flex flex-col gap-4"> ${exampleRankings.map((r) => renderTemplate`<div${addAttribute(`bg-white rounded-2xl border ${r.color} shadow-sm overflow-hidden`, "class")}> <div${addAttribute(`${r.headerBg} px-4 py-3 flex items-center gap-2 border-b ${r.color}`, "class")}> <span class="text-xl">${r.emoji}</span> <span class="font-bold text-slate-800 text-sm">${r.title}</span> <span${addAttribute(`ml-auto text-xs font-semibold px-2 py-0.5 rounded-full ${r.badge}`, "class")}>
ejemplo
</span> </div> <div class="divide-y divide-slate-50"> ${r.entries.map((e) => renderTemplate`<div class="flex items-center gap-3 px-4 py-2.5"> <span${addAttribute(
    e.pos === 1 ? "w-6 h-6 rounded-full bg-amber-400 text-white text-xs font-bold flex items-center justify-center" : "w-6 h-6 rounded-full bg-slate-100 text-slate-500 text-xs font-semibold flex items-center justify-center",
    "class"
  )}> ${e.pos === 1 ? "\u{1F947}" : e.pos} </span> <span class="flex-1 text-sm font-medium text-slate-700">${e.name}</span> <span class="text-sm font-bold text-slate-900">${e.score.toFixed(1)}</span> <div class="w-20 bg-slate-100 rounded-full h-1.5 overflow-hidden"> <div class="h-full bg-orange-400 rounded-full"${addAttribute(`width: ${e.score / 10 * 100}%`, "style")}></div> </div> </div>`)} </div> </div>`)} </div> <p class="text-center text-xs text-slate-400 mt-4">
¿Tu grupo tiene los mejores? Crea tu propio ranking 👇
</p> </div> </section>  <section id="crear" class="max-w-md mx-auto px-4 pb-10"> <div class="bg-white rounded-3xl border border-slate-100 shadow-sm p-6"> <h2 class="text-lg font-bold text-slate-900 mb-1">Crear concurso</h2> <p class="text-xs text-slate-400 mb-5">Listo en menos de un minuto 🚀</p> ${renderComponent($$result2, "CreateContestForm", CreateContestForm, { "client:load": true, "client:component-hydration": "load", "client:component-path": "/home/runner/work/rankeame/rankeame/src/components/CreateContestForm", "client:component-export": "default" })} </div> </section>  <footer class="text-center text-xs text-slate-300 pb-8 pt-2">
Rankeame · Para comidas épicas con amigos 🏆
</footer> ` })}`;
}, "/home/runner/work/rankeame/rankeame/src/pages/index.astro", void 0);

const $$file = "/home/runner/work/rankeame/rankeame/src/pages/index.astro";
const $$url = "";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
