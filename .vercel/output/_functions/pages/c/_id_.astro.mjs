import { e as createComponent, k as renderComponent, l as renderScript, r as renderTemplate, h as createAstro, m as maybeRenderHead, g as addAttribute } from '../../chunks/astro/server_rqQWen4l.mjs';
import 'piccolore';
import { $ as $$BaseLayout } from '../../chunks/BaseLayout_B7F1RS--.mjs';
import { jsx, jsxs } from 'react/jsx-runtime';
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { s as supabase } from '../../chunks/supabase_DotLsHd9.mjs';
import { g as getTemplate } from '../../chunks/contestTypes_DwaRKO1P.mjs';
export { renderers } from '../../renderers.mjs';

function computeLeaderboard(votes) {
  if (votes.length === 0) return [];
  const items = /* @__PURE__ */ new Set();
  for (const v of votes) {
    for (const key of Object.keys(v.scores_json)) {
      items.add(key);
    }
  }
  const entries = [];
  for (const item of items) {
    const scores = votes.map((v) => v.scores_json[item]).filter((s) => typeof s === "number");
    if (scores.length > 0) {
      const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
      entries.push({ name: item, avgScore: avg, voteCount: scores.length });
    }
  }
  return entries.sort((a, b) => b.avgScore - a.avgScore);
}
function Leaderboard({
  contestId,
  supabaseUrl,
  supabaseAnonKey
}) {
  const [votes, setVotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(false);
  useEffect(() => {
    const client = createClient(supabaseUrl, supabaseAnonKey);
    client.from("votes").select("id, guest_name, scores_json, created_at").eq("contest_id", contestId).order("created_at", { ascending: true }).then(({ data, error }) => {
      if (error) {
        setFetchError(true);
      } else if (data) {
        setVotes(data);
      }
      setLoading(false);
    });
    const channel = client.channel(`votes:${contestId}`).on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "votes",
        filter: `contest_id=eq.${contestId}`
      },
      (payload) => {
        const newVote = payload.new;
        setVotes(
          (prev) => prev.some((v) => v.id === newVote.id) ? prev : [...prev, newVote]
        );
      }
    ).subscribe();
    return () => {
      client.removeChannel(channel);
    };
  }, [contestId, supabaseUrl, supabaseAnonKey]);
  const leaderboard = computeLeaderboard(votes);
  if (loading) {
    return /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center py-8 text-sm", style: { color: "var(--color-muted-foreground)" }, children: /* @__PURE__ */ jsx("span", { className: "animate-pulse", children: "Cargando votos…" }) });
  }
  if (fetchError) {
    return /* @__PURE__ */ jsxs("div", { className: "rounded-xl border py-10 text-center", style: { borderColor: "var(--color-border)" }, children: [
      /* @__PURE__ */ jsx("p", { className: "text-3xl mb-2", children: "⚠️" }),
      /* @__PURE__ */ jsx("p", { className: "text-sm font-medium", style: { color: "var(--color-muted-foreground)" }, children: "Error al cargar los votos. Por favor, recarga la página." })
    ] });
  }
  if (leaderboard.length === 0) {
    return /* @__PURE__ */ jsxs("div", { className: "rounded-xl border py-10 text-center", style: { borderColor: "var(--color-border)" }, children: [
      /* @__PURE__ */ jsx("p", { className: "text-3xl mb-2", children: "🗳️" }),
      /* @__PURE__ */ jsx("p", { className: "text-sm font-medium", style: { color: "var(--color-muted-foreground)" }, children: "Aún no hay votos — ¡comparte el enlace para empezar!" })
    ] });
  }
  const medals = ["🥇", "🥈", "🥉"];
  return /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
    /* @__PURE__ */ jsxs("p", { className: "text-xs", style: { color: "var(--color-muted-foreground)" }, children: [
      votes.length,
      " ",
      votes.length !== 1 ? "votos" : "voto",
      " • Actualización en tiempo real"
    ] }),
    /* @__PURE__ */ jsx("ol", { className: "space-y-2", children: leaderboard.map((entry, idx) => /* @__PURE__ */ jsxs(
      "li",
      {
        className: "flex items-center gap-3 rounded-xl border p-3",
        style: {
          borderColor: "var(--color-border)",
          backgroundColor: idx === 0 ? "var(--color-accent)" : "var(--color-card)"
        },
        children: [
          /* @__PURE__ */ jsx("span", { className: "text-xl w-7 text-center shrink-0", children: medals[idx] ?? `${idx + 1}` }),
          /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
            /* @__PURE__ */ jsx("p", { className: "font-semibold truncate text-sm", children: entry.name }),
            /* @__PURE__ */ jsx(
              "div",
              {
                className: "mt-1 h-1.5 rounded-full overflow-hidden",
                style: { backgroundColor: "var(--color-border)" },
                children: /* @__PURE__ */ jsx(
                  "div",
                  {
                    className: "h-full rounded-full transition-all duration-500",
                    style: {
                      width: `${entry.avgScore / 10 * 100}%`,
                      backgroundColor: idx === 0 ? "var(--color-primary)" : "var(--color-muted-foreground)"
                    }
                  }
                )
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "text-right shrink-0", children: [
            /* @__PURE__ */ jsx("span", { className: "text-lg font-bold", children: entry.avgScore.toFixed(1) }),
            /* @__PURE__ */ jsxs("p", { className: "text-xs", style: { color: "var(--color-muted-foreground)" }, children: [
              entry.voteCount,
              " ",
              entry.voteCount !== 1 ? "votos" : "voto"
            ] })
          ] })
        ]
      },
      entry.name
    )) })
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
  const { data: contest, error } = await supabase.from("contests").select("id, name, contest_type, created_at").eq("id", id).single();
  if (error || !contest) {
    return Astro2.redirect("/");
  }
  const voteUrl = `${Astro2.url.origin}/vote/${id}`;
  const supabaseUrl = undefined                                   ;
  const supabaseAnonKey = undefined                                        ;
  const template = getTemplate(contest.contest_type ?? "tortillas");
  const whatsappText = encodeURIComponent(`¡Únete a mi concurso en Rankeame! Vota aquí: ${voteUrl}`);
  const whatsappUrl = `https://wa.me/?text=${whatsappText}`;
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": contest.name }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="max-w-md mx-auto px-4 space-y-6 py-6"> <!-- Header --> <header class="space-y-1"> <p class="text-xs font-semibold uppercase tracking-widest text-[var(--color-muted-foreground)]">
Concurso · ${template.emoji} ${template.label} </p> <h1 class="text-2xl font-bold leading-tight">${contest.name}</h1> <p class="text-xs text-[var(--color-muted-foreground)]">
Criterios: ${template.criteria.join(", ")} </p> </header> <!-- Share section --> <section class="rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] p-5 space-y-4"> <h2 class="text-sm font-semibold">Invita a tus amigos a votar</h2> <!-- Vote URL copy --> <div class="space-y-1.5"> <label for="vote-url" class="text-xs text-[var(--color-muted-foreground)]">
Enlace para votar
</label> <div class="flex gap-2"> <input id="vote-url" type="text" readonly${addAttribute(voteUrl, "value")} class="flex-1 rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] px-3 py-2 text-xs font-mono outline-none select-all"> <button id="copy-btn" class="shrink-0 rounded-lg px-3 py-2 text-xs font-semibold transition" style="background-color: var(--color-primary); color: var(--color-primary-foreground);">
Copiar
</button> </div> </div> <!-- WhatsApp share button --> <a${addAttribute(whatsappUrl, "href")} target="_blank" rel="noopener noreferrer" class="flex items-center justify-center gap-2 w-full rounded-lg py-2.5 text-sm font-semibold transition" style="background-color: #25d366; color: #ffffff;" aria-label="Compartir enlace de votación por WhatsApp"> <!-- WhatsApp icon (inline SVG) --> <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5 shrink-0" aria-hidden="true"> <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"></path> </svg>
Compartir por WhatsApp
</a> <!-- PIN display --> <div class="space-y-1.5"> <p class="text-xs text-[var(--color-muted-foreground)]">PIN (últimos 6 caracteres)</p> <div class="rounded-lg border border-[var(--color-border)] px-4 py-3 text-center font-mono text-2xl font-bold tracking-[0.3em]"> ${id.slice(-6).toUpperCase()} </div> </div> </section> <!-- Leaderboard --> <section class="space-y-3"> <h2 class="text-sm font-semibold">Clasificación en tiempo real</h2> ${renderComponent($$result2, "Leaderboard", Leaderboard, { "contestId": id, "supabaseUrl": supabaseUrl, "supabaseAnonKey": supabaseAnonKey, "client:load": true, "client:component-hydration": "load", "client:component-path": "/home/runner/work/rankeame/rankeame/src/components/Leaderboard", "client:component-export": "default" })} </section> <!-- Vote yourself link --> <a${addAttribute(`/vote/${id}`, "href")} class="block w-full rounded-xl border border-[var(--color-border)] py-3 text-center text-sm font-semibold transition hover:bg-[var(--color-accent)]">
Emite tu voto →
</a> </div> ` })} ${renderScript($$result, "/home/runner/work/rankeame/rankeame/src/pages/c/[id].astro?astro&type=script&index=0&lang.ts")}`;
}, "/home/runner/work/rankeame/rankeame/src/pages/c/[id].astro", void 0);
const $$file = "/home/runner/work/rankeame/rankeame/src/pages/c/[id].astro";
const $$url = "/c/[id]";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$id,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
