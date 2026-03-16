import 'piccolore';
import { p as decodeKey } from './chunks/astro/server_rqQWen4l.mjs';
import 'clsx';
import { N as NOOP_MIDDLEWARE_FN } from './chunks/astro-designed-error-pages_i_J2eGNq.mjs';
import 'es-module-lexer';

function sanitizeParams(params) {
  return Object.fromEntries(
    Object.entries(params).map(([key, value]) => {
      if (typeof value === "string") {
        return [key, value.normalize().replace(/#/g, "%23").replace(/\?/g, "%3F")];
      }
      return [key, value];
    })
  );
}
function getParameter(part, params) {
  if (part.spread) {
    return params[part.content.slice(3)] || "";
  }
  if (part.dynamic) {
    if (!params[part.content]) {
      throw new TypeError(`Missing parameter: ${part.content}`);
    }
    return params[part.content];
  }
  return part.content.normalize().replace(/\?/g, "%3F").replace(/#/g, "%23").replace(/%5B/g, "[").replace(/%5D/g, "]");
}
function getSegment(segment, params) {
  const segmentPath = segment.map((part) => getParameter(part, params)).join("");
  return segmentPath ? "/" + segmentPath : "";
}
function getRouteGenerator(segments, addTrailingSlash) {
  return (params) => {
    const sanitizedParams = sanitizeParams(params);
    let trailing = "";
    if (addTrailingSlash === "always" && segments.length) {
      trailing = "/";
    }
    const path = segments.map((segment) => getSegment(segment, sanitizedParams)).join("") + trailing;
    return path || "/";
  };
}

function deserializeRouteData(rawRouteData) {
  return {
    route: rawRouteData.route,
    type: rawRouteData.type,
    pattern: new RegExp(rawRouteData.pattern),
    params: rawRouteData.params,
    component: rawRouteData.component,
    generate: getRouteGenerator(rawRouteData.segments, rawRouteData._meta.trailingSlash),
    pathname: rawRouteData.pathname || void 0,
    segments: rawRouteData.segments,
    prerender: rawRouteData.prerender,
    redirect: rawRouteData.redirect,
    redirectRoute: rawRouteData.redirectRoute ? deserializeRouteData(rawRouteData.redirectRoute) : void 0,
    fallbackRoutes: rawRouteData.fallbackRoutes.map((fallback) => {
      return deserializeRouteData(fallback);
    }),
    isIndex: rawRouteData.isIndex,
    origin: rawRouteData.origin
  };
}

function deserializeManifest(serializedManifest) {
  const routes = [];
  for (const serializedRoute of serializedManifest.routes) {
    routes.push({
      ...serializedRoute,
      routeData: deserializeRouteData(serializedRoute.routeData)
    });
    const route = serializedRoute;
    route.routeData = deserializeRouteData(serializedRoute.routeData);
  }
  const assets = new Set(serializedManifest.assets);
  const componentMetadata = new Map(serializedManifest.componentMetadata);
  const inlinedScripts = new Map(serializedManifest.inlinedScripts);
  const clientDirectives = new Map(serializedManifest.clientDirectives);
  const serverIslandNameMap = new Map(serializedManifest.serverIslandNameMap);
  const key = decodeKey(serializedManifest.key);
  return {
    // in case user middleware exists, this no-op middleware will be reassigned (see plugin-ssr.ts)
    middleware() {
      return { onRequest: NOOP_MIDDLEWARE_FN };
    },
    ...serializedManifest,
    assets,
    componentMetadata,
    inlinedScripts,
    clientDirectives,
    routes,
    serverIslandNameMap,
    key
  };
}

const manifest = deserializeManifest({"hrefRoot":"file:///home/runner/work/rankeame/rankeame/","cacheDir":"file:///home/runner/work/rankeame/rankeame/node_modules/.astro/","outDir":"file:///home/runner/work/rankeame/rankeame/dist/","srcDir":"file:///home/runner/work/rankeame/rankeame/src/","publicDir":"file:///home/runner/work/rankeame/rankeame/public/","buildClientDir":"file:///home/runner/work/rankeame/rankeame/dist/client/","buildServerDir":"file:///home/runner/work/rankeame/rankeame/dist/server/","adapterName":"@astrojs/vercel","routes":[{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"page","component":"_server-islands.astro","params":["name"],"segments":[[{"content":"_server-islands","dynamic":false,"spread":false}],[{"content":"name","dynamic":true,"spread":false}]],"pattern":"^\\/_server-islands\\/([^/]+?)\\/?$","prerender":false,"isIndex":false,"fallbackRoutes":[],"route":"/_server-islands/[name]","origin":"internal","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_image","pattern":"^\\/_image\\/?$","segments":[[{"content":"_image","dynamic":false,"spread":false}]],"params":[],"component":"node_modules/astro/dist/assets/endpoint/generic.js","pathname":"/_image","prerender":false,"fallbackRoutes":[],"origin":"internal","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/api/contests","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/contests\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"contests","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/contests.ts","pathname":"/api/contests","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/api/votes","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/votes\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"votes","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/votes.ts","pathname":"/api/votes","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[{"type":"external","src":"/_astro/_id_.B1e5NO-g.css"}],"routeData":{"route":"/c/[id]","isIndex":false,"type":"page","pattern":"^\\/c\\/([^/]+?)\\/?$","segments":[[{"content":"c","dynamic":false,"spread":false}],[{"content":"id","dynamic":true,"spread":false}]],"params":["id"],"component":"src/pages/c/[id].astro","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[{"type":"external","src":"/_astro/_id_.B1e5NO-g.css"}],"routeData":{"route":"/vote/[id]","isIndex":false,"type":"page","pattern":"^\\/vote\\/([^/]+?)\\/?$","segments":[[{"content":"vote","dynamic":false,"spread":false}],[{"content":"id","dynamic":true,"spread":false}]],"params":["id"],"component":"src/pages/vote/[id].astro","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[{"type":"external","src":"/_astro/_id_.B1e5NO-g.css"}],"routeData":{"route":"/","isIndex":true,"type":"page","pattern":"^\\/$","segments":[],"params":[],"component":"src/pages/index.astro","pathname":"/","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}}],"base":"/","trailingSlash":"ignore","compressHTML":true,"componentMetadata":[["/home/runner/work/rankeame/rankeame/src/pages/c/[id].astro",{"propagation":"none","containsHead":true}],["/home/runner/work/rankeame/rankeame/src/pages/index.astro",{"propagation":"none","containsHead":true}],["/home/runner/work/rankeame/rankeame/src/pages/vote/[id].astro",{"propagation":"none","containsHead":true}]],"renderers":[],"clientDirectives":[["idle","(()=>{var l=(n,t)=>{let i=async()=>{await(await n())()},e=typeof t.value==\"object\"?t.value:void 0,s={timeout:e==null?void 0:e.timeout};\"requestIdleCallback\"in window?window.requestIdleCallback(i,s):setTimeout(i,s.timeout||200)};(self.Astro||(self.Astro={})).idle=l;window.dispatchEvent(new Event(\"astro:idle\"));})();"],["load","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).load=e;window.dispatchEvent(new Event(\"astro:load\"));})();"],["media","(()=>{var n=(a,t)=>{let i=async()=>{await(await a())()};if(t.value){let e=matchMedia(t.value);e.matches?i():e.addEventListener(\"change\",i,{once:!0})}};(self.Astro||(self.Astro={})).media=n;window.dispatchEvent(new Event(\"astro:media\"));})();"],["only","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).only=e;window.dispatchEvent(new Event(\"astro:only\"));})();"],["visible","(()=>{var a=(s,i,o)=>{let r=async()=>{await(await s())()},t=typeof i.value==\"object\"?i.value:void 0,c={rootMargin:t==null?void 0:t.rootMargin},n=new IntersectionObserver(e=>{for(let l of e)if(l.isIntersecting){n.disconnect(),r();break}},c);for(let e of o.children)n.observe(e)};(self.Astro||(self.Astro={})).visible=a;window.dispatchEvent(new Event(\"astro:visible\"));})();"]],"entryModules":{"\u0000noop-middleware":"_noop-middleware.mjs","\u0000virtual:astro:actions/noop-entrypoint":"noop-entrypoint.mjs","\u0000@astro-page:src/pages/api/contests@_@ts":"pages/api/contests.astro.mjs","\u0000@astro-page:src/pages/api/votes@_@ts":"pages/api/votes.astro.mjs","\u0000@astro-page:src/pages/c/[id]@_@astro":"pages/c/_id_.astro.mjs","\u0000@astro-page:src/pages/vote/[id]@_@astro":"pages/vote/_id_.astro.mjs","\u0000@astro-page:src/pages/index@_@astro":"pages/index.astro.mjs","\u0000@astrojs-ssr-virtual-entry":"entry.mjs","\u0000@astro-renderers":"renderers.mjs","\u0000@astro-page:node_modules/astro/dist/assets/endpoint/generic@_@js":"pages/_image.astro.mjs","\u0000@astrojs-ssr-adapter":"_@astrojs-ssr-adapter.mjs","\u0000@astrojs-manifest":"manifest_CyWh0r0e.mjs","/home/runner/work/rankeame/rankeame/node_modules/astro/dist/assets/services/sharp.js":"chunks/sharp_CraI157_.mjs","/home/runner/work/rankeame/rankeame/src/components/Leaderboard":"_astro/Leaderboard.CSNjQBVs.js","/home/runner/work/rankeame/rankeame/src/components/CreateContestForm":"_astro/CreateContestForm.jBqsXczF.js","/home/runner/work/rankeame/rankeame/src/components/VotingForm":"_astro/VotingForm.Dacst80M.js","@astrojs/react/client.js":"_astro/client.Dc9Vh3na.js","/home/runner/work/rankeame/rankeame/src/pages/c/[id].astro?astro&type=script&index=0&lang.ts":"_astro/_id_.astro_astro_type_script_index_0_lang.CFyNsUmm.js","astro:scripts/before-hydration.js":""},"inlinedScripts":[["/home/runner/work/rankeame/rankeame/src/pages/c/[id].astro?astro&type=script&index=0&lang.ts","const t=document.getElementById(\"copy-btn\"),e=document.getElementById(\"vote-url\");t?.addEventListener(\"click\",async()=>{if(e)try{await navigator.clipboard.writeText(e.value),t.textContent=\"¡Copiado!\",setTimeout(()=>{t.textContent=\"Copiar\"},2e3)}catch{e.select()}});"]],"assets":["/_astro/_id_.B1e5NO-g.css","/favicon.svg","/icon-192.png","/icon-512.png","/manifest.webmanifest","/registerSW.js","/sw.js","/workbox-8c29f6e4.js","/_astro/CreateContestForm.jBqsXczF.js","/_astro/Leaderboard.CSNjQBVs.js","/_astro/VotingForm.Dacst80M.js","/_astro/client.Dc9Vh3na.js","/_astro/index.DiEladB3.js","/_astro/jsx-runtime.D_zvdyIk.js"],"buildFormat":"directory","checkOrigin":true,"allowedDomains":[],"actionBodySizeLimit":1048576,"serverIslandNameMap":[],"key":"ZEovNQrcfuMCvynGVavnNtx90nAWhYP76nTB1w1C0yg="});
if (manifest.sessionConfig) manifest.sessionConfig.driverModule = null;

export { manifest };
