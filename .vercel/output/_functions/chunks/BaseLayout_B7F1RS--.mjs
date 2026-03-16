import { e as createComponent, g as addAttribute, n as renderHead, o as renderSlot, r as renderTemplate, h as createAstro } from './astro/server_rqQWen4l.mjs';
import 'piccolore';
import 'clsx';
/* empty css                        */

const $$Astro = createAstro();
const $$BaseLayout = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$BaseLayout;
  const { title, description = "Votaciones en tiempo real sin registro" } = Astro2.props;
  return renderTemplate`<html lang="es"> <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><meta name="description"${addAttribute(description, "content")}><meta name="theme-color" content="#f97316"><link rel="icon" type="image/svg+xml" href="/favicon.svg"><link rel="manifest" href="/manifest.webmanifest"><title>${title} · Rankeame</title>${renderHead()}</head> <body class="min-h-screen"> ${renderSlot($$result, $$slots["default"])} </body></html>`;
}, "/home/runner/work/rankeame/rankeame/src/layouts/BaseLayout.astro", void 0);

export { $$BaseLayout as $ };
