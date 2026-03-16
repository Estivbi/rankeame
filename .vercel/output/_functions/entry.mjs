import { renderers } from './renderers.mjs';
import { c as createExports, s as serverEntrypointModule } from './chunks/_@astrojs-ssr-adapter_C78Txwu8.mjs';
import { manifest } from './manifest_CyWh0r0e.mjs';

const serverIslandMap = new Map();;

const _page0 = () => import('./pages/_image.astro.mjs');
const _page1 = () => import('./pages/api/contests.astro.mjs');
const _page2 = () => import('./pages/api/votes.astro.mjs');
const _page3 = () => import('./pages/c/_id_.astro.mjs');
const _page4 = () => import('./pages/vote/_id_.astro.mjs');
const _page5 = () => import('./pages/index.astro.mjs');
const pageMap = new Map([
    ["node_modules/astro/dist/assets/endpoint/generic.js", _page0],
    ["src/pages/api/contests.ts", _page1],
    ["src/pages/api/votes.ts", _page2],
    ["src/pages/c/[id].astro", _page3],
    ["src/pages/vote/[id].astro", _page4],
    ["src/pages/index.astro", _page5]
]);

const _manifest = Object.assign(manifest, {
    pageMap,
    serverIslandMap,
    renderers,
    actions: () => import('./noop-entrypoint.mjs'),
    middleware: () => import('./_noop-middleware.mjs')
});
const _args = {
    "middlewareSecret": "fc0aca71-cbbd-4bc6-9cf9-8016ec97321f",
    "skewProtection": false
};
const _exports = createExports(_manifest, _args);
const __astrojsSsrVirtualEntry = _exports.default;
const _start = 'start';
if (Object.prototype.hasOwnProperty.call(serverEntrypointModule, _start)) ;

export { __astrojsSsrVirtualEntry as default, pageMap };
