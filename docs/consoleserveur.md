
The default interactive shell is now zsh.
To update your account to use zsh, please run `chsh -s /bin/zsh`.
For more details, please visit https://support.apple.com/kb/HT208050.
air-de-macbook:mediavaldispatch macbook$ npm run dev

> mediavaldispatch@0.1.0 dev
> next dev

  ▲ Next.js 14.2.33
  - Local:        http://localhost:3000
  - Environments: .env.local, .env

 ✓ Starting...
 ✓ Ready in 6.4s
 ○ Compiling / ...
 ✓ Compiled / in 5.9s (502 modules)
 GET / 200 in 6602ms
 ○ Compiling /api/missions/day/[day] ...
 ✓ Compiled /api/missions/day/[day] in 1827ms (282 modules)
 ✓ Compiled (288 modules)
 ⨯ TypeError: Cannot read properties of undefined (reading '__internal')
    at new t (/Applications/Romain/mediavaldispatch/node_modules/@prisma/client/runtime/client.js:70:952)
    at eval (webpack-internal:///(rsc)/./app/api/buildings/route.ts:11:16)
    at (rsc)/./app/api/buildings/route.ts (/Applications/Romain/mediavaldispatch/.next/server/app/api/buildings/route.js:62:1)
    at __webpack_require__ (/Applications/Romain/mediavaldispatch/.next/server/webpack-runtime.js:33:42)
    at eval (webpack-internal:///(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fbuildings%2Froute&page=%2Fapi%2Fbuildings%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fbuildings%2Froute.ts&appDir=%2FApplications%2FRomain%2Fmediavaldispatch%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FApplications%2FRomain%2Fmediavaldispatch&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!:15:122)
    at (rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fbuildings%2Froute&page=%2Fapi%2Fbuildings%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fbuildings%2Froute.ts&appDir=%2FApplications%2FRomain%2Fmediavaldispatch%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FApplications%2FRomain%2Fmediavaldispatch&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D! (/Applications/Romain/mediavaldispatch/.next/server/app/api/buildings/route.js:52:1)
    at __webpack_require__ (/Applications/Romain/mediavaldispatch/.next/server/webpack-runtime.js:33:42)
    at __webpack_exec__ (/Applications/Romain/mediavaldispatch/.next/server/app/api/buildings/route.js:72:39)
    at /Applications/Romain/mediavaldispatch/.next/server/app/api/buildings/route.js:73:83
    at __webpack_require__.X (/Applications/Romain/mediavaldispatch/.next/server/webpack-runtime.js:168:21)
    at /Applications/Romain/mediavaldispatch/.next/server/app/api/buildings/route.js:73:47
    at Object.<anonymous> (/Applications/Romain/mediavaldispatch/.next/server/app/api/buildings/route.js:76:3)
    at Module._compile (node:internal/modules/cjs/loader:1760:14)
    at Object..js (node:internal/modules/cjs/loader:1893:10)
    at Module.load (node:internal/modules/cjs/loader:1480:32)
    at Module._load (node:internal/modules/cjs/loader:1299:12)
    at TracingChannel.traceSync (node:diagnostics_channel:328:14)
    at wrapModuleLoad (node:internal/modules/cjs/loader:244:24)
    at Module.<anonymous> (node:internal/modules/cjs/loader:1503:12)
    at mod.require (/Applications/Romain/mediavaldispatch/node_modules/next/dist/server/require-hook.js:65:28)
    at require (node:internal/modules/helpers:152:16)
    at requirePage (/Applications/Romain/mediavaldispatch/node_modules/next/dist/server/require.js:109:84)
    at /Applications/Romain/mediavaldispatch/node_modules/next/dist/server/load-components.js:103:84
    at async loadComponentsImpl (/Applications/Romain/mediavaldispatch/node_modules/next/dist/server/load-components.js:103:26)
    at async DevServer.findPageComponentsImpl (/Applications/Romain/mediavaldispatch/node_modules/next/dist/server/next-server.js:714:36)
    at async DevServer.findPageComponents (/Applications/Romain/mediavaldispatch/node_modules/next/dist/server/dev/next-dev-server.js:577:20)
    at async DevServer.renderPageComponent (/Applications/Romain/mediavaldispatch/node_modules/next/dist/server/base-server.js:1910:24)
    at async DevServer.renderToResponseImpl (/Applications/Romain/mediavaldispatch/node_modules/next/dist/server/base-server.js:1962:32)
    at async DevServer.pipeImpl (/Applications/Romain/mediavaldispatch/node_modules/next/dist/server/base-server.js:922:25)
    at async NextNodeServer.handleCatchallRenderRequest (/Applications/Romain/mediavaldispatch/node_modules/next/dist/server/next-server.js:272:17)
    at async DevServer.handleRequestImpl (/Applications/Romain/mediavaldispatch/node_modules/next/dist/server/base-server.js:818:17)
    at async /Applications/Romain/mediavaldispatch/node_modules/next/dist/server/dev/next-dev-server.js:339:20
    at async Span.traceAsyncFn (/Applications/Romain/mediavaldispatch/node_modules/next/dist/trace/trace.js:154:20)
    at async DevServer.handleRequest (/Applications/Romain/mediavaldispatch/node_modules/next/dist/server/dev/next-dev-server.js:336:24)
    at async invokeRender (/Applications/Romain/mediavaldispatch/node_modules/next/dist/server/lib/router-server.js:179:21)
    at async handleRequest (/Applications/Romain/mediavaldispatch/node_modules/next/dist/server/lib/router-server.js:359:24)
    at async requestHandlerImpl (/Applications/Romain/mediavaldispatch/node_modules/next/dist/server/lib/router-server.js:383:13)
    at async Server.requestListener (/Applications/Romain/mediavaldispatch/node_modules/next/dist/server/lib/start-server.js:141:13) {
  page: '/api/buildings'
}
 ⨯ TypeError: Cannot read properties of undefined (reading '__internal')
    at new t (/Applications/Romain/mediavaldispatch/node_modules/@prisma/client/runtime/client.js:70:952)
    at eval (webpack-internal:///(rsc)/./app/api/missions/day/[day]/route.ts:11:16)
    at (rsc)/./app/api/missions/day/[day]/route.ts (/Applications/Romain/mediavaldispatch/.next/server/app/api/missions/day/[day]/route.js:62:1)
    at __webpack_require__ (/Applications/Romain/mediavaldispatch/.next/server/webpack-runtime.js:33:42)
    at eval (webpack-internal:///(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fmissions%2Fday%2F%5Bday%5D%2Froute&page=%2Fapi%2Fmissions%2Fday%2F%5Bday%5D%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fmissions%2Fday%2F%5Bday%5D%2Froute.ts&appDir=%2FApplications%2FRomain%2Fmediavaldispatch%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FApplications%2FRomain%2Fmediavaldispatch&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!:15:129)
    at (rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fmissions%2Fday%2F%5Bday%5D%2Froute&page=%2Fapi%2Fmissions%2Fday%2F%5Bday%5D%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fmissions%2Fday%2F%5Bday%5D%2Froute.ts&appDir=%2FApplications%2FRomain%2Fmediavaldispatch%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FApplications%2FRomain%2Fmediavaldispatch&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D! (/Applications/Romain/mediavaldispatch/.next/server/app/api/missions/day/[day]/route.js:52:1)
    at __webpack_require__ (/Applications/Romain/mediavaldispatch/.next/server/webpack-runtime.js:33:42)
    at __webpack_exec__ (/Applications/Romain/mediavaldispatch/.next/server/app/api/missions/day/[day]/route.js:72:39)
    at /Applications/Romain/mediavaldispatch/.next/server/app/api/missions/day/[day]/route.js:73:83
    at __webpack_require__.X (/Applications/Romain/mediavaldispatch/.next/server/webpack-runtime.js:168:21)
    at /Applications/Romain/mediavaldispatch/.next/server/app/api/missions/day/[day]/route.js:73:47
    at Object.<anonymous> (/Applications/Romain/mediavaldispatch/.next/server/app/api/missions/day/[day]/route.js:76:3)
    at Module._compile (node:internal/modules/cjs/loader:1760:14)
    at Object..js (node:internal/modules/cjs/loader:1893:10)
    at Module.load (node:internal/modules/cjs/loader:1480:32)
    at Module._load (node:internal/modules/cjs/loader:1299:12)
    at TracingChannel.traceSync (node:diagnostics_channel:328:14)
    at wrapModuleLoad (node:internal/modules/cjs/loader:244:24)
    at Module.<anonymous> (node:internal/modules/cjs/loader:1503:12)
    at mod.require (/Applications/Romain/mediavaldispatch/node_modules/next/dist/server/require-hook.js:65:28)
    at require (node:internal/modules/helpers:152:16)
    at requirePage (/Applications/Romain/mediavaldispatch/node_modules/next/dist/server/require.js:109:84)
    at /Applications/Romain/mediavaldispatch/node_modules/next/dist/server/load-components.js:103:84
    at async loadComponentsImpl (/Applications/Romain/mediavaldispatch/node_modules/next/dist/server/load-components.js:103:26)
    at async DevServer.findPageComponentsImpl (/Applications/Romain/mediavaldispatch/node_modules/next/dist/server/next-server.js:714:36)
    at async DevServer.findPageComponents (/Applications/Romain/mediavaldispatch/node_modules/next/dist/server/dev/next-dev-server.js:577:20)
    at async DevServer.renderPageComponent (/Applications/Romain/mediavaldispatch/node_modules/next/dist/server/base-server.js:1910:24)
    at async DevServer.renderToResponseImpl (/Applications/Romain/mediavaldispatch/node_modules/next/dist/server/base-server.js:1962:32)
    at async DevServer.pipeImpl (/Applications/Romain/mediavaldispatch/node_modules/next/dist/server/base-server.js:922:25)
    at async NextNodeServer.handleCatchallRenderRequest (/Applications/Romain/mediavaldispatch/node_modules/next/dist/server/next-server.js:272:17)
    at async DevServer.handleRequestImpl (/Applications/Romain/mediavaldispatch/node_modules/next/dist/server/base-server.js:818:17)
    at async /Applications/Romain/mediavaldispatch/node_modules/next/dist/server/dev/next-dev-server.js:339:20
    at async Span.traceAsyncFn (/Applications/Romain/mediavaldispatch/node_modules/next/dist/trace/trace.js:154:20)
    at async DevServer.handleRequest (/Applications/Romain/mediavaldispatch/node_modules/next/dist/server/dev/next-dev-server.js:336:24)
    at async invokeRender (/Applications/Romain/mediavaldispatch/node_modules/next/dist/server/lib/router-server.js:179:21)
    at async handleRequest (/Applications/Romain/mediavaldispatch/node_modules/next/dist/server/lib/router-server.js:359:24)
    at async requestHandlerImpl (/Applications/Romain/mediavaldispatch/node_modules/next/dist/server/lib/router-server.js:383:13)
    at async Server.requestListener (/Applications/Romain/mediavaldispatch/node_modules/next/dist/server/lib/start-server.js:141:13) {
  page: '/api/missions/day/1'
}
 ⨯ TypeError: Cannot read properties of undefined (reading '__internal')
    at new t (/Applications/Romain/mediavaldispatch/node_modules/@prisma/client/runtime/client.js:70:952)
    at eval (webpack-internal:///(rsc)/./app/api/dialogues/day/[day]/route.ts:11:16)
    at (rsc)/./app/api/dialogues/day/[day]/route.ts (/Applications/Romain/mediavaldispatch/.next/server/app/api/dialogues/day/[day]/route.js:62:1)
    at __webpack_require__ (/Applications/Romain/mediavaldispatch/.next/server/webpack-runtime.js:33:42)
    at eval (webpack-internal:///(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fdialogues%2Fday%2F%5Bday%5D%2Froute&page=%2Fapi%2Fdialogues%2Fday%2F%5Bday%5D%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fdialogues%2Fday%2F%5Bday%5D%2Froute.ts&appDir=%2FApplications%2FRomain%2Fmediavaldispatch%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FApplications%2FRomain%2Fmediavaldispatch&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!:15:130)
    at (rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fdialogues%2Fday%2F%5Bday%5D%2Froute&page=%2Fapi%2Fdialogues%2Fday%2F%5Bday%5D%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fdialogues%2Fday%2F%5Bday%5D%2Froute.ts&appDir=%2FApplications%2FRomain%2Fmediavaldispatch%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FApplications%2FRomain%2Fmediavaldispatch&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D! (/Applications/Romain/mediavaldispatch/.next/server/app/api/dialogues/day/[day]/route.js:52:1)
    at __webpack_require__ (/Applications/Romain/mediavaldispatch/.next/server/webpack-runtime.js:33:42)
    at __webpack_exec__ (/Applications/Romain/mediavaldispatch/.next/server/app/api/dialogues/day/[day]/route.js:72:39)
    at /Applications/Romain/mediavaldispatch/.next/server/app/api/dialogues/day/[day]/route.js:73:83
    at __webpack_require__.X (/Applications/Romain/mediavaldispatch/.next/server/webpack-runtime.js:168:21)
    at /Applications/Romain/mediavaldispatch/.next/server/app/api/dialogues/day/[day]/route.js:73:47
    at Object.<anonymous> (/Applications/Romain/mediavaldispatch/.next/server/app/api/dialogues/day/[day]/route.js:76:3)
    at Module._compile (node:internal/modules/cjs/loader:1760:14)
    at Object..js (node:internal/modules/cjs/loader:1893:10)
    at Module.load (node:internal/modules/cjs/loader:1480:32)
    at Module._load (node:internal/modules/cjs/loader:1299:12)
    at TracingChannel.traceSync (node:diagnostics_channel:328:14)
    at wrapModuleLoad (node:internal/modules/cjs/loader:244:24)
    at Module.<anonymous> (node:internal/modules/cjs/loader:1503:12)
    at mod.require (/Applications/Romain/mediavaldispatch/node_modules/next/dist/server/require-hook.js:65:28)
    at require (node:internal/modules/helpers:152:16)
    at requirePage (/Applications/Romain/mediavaldispatch/node_modules/next/dist/server/require.js:109:84)
    at /Applications/Romain/mediavaldispatch/node_modules/next/dist/server/load-components.js:103:84
    at async loadComponentsImpl (/Applications/Romain/mediavaldispatch/node_modules/next/dist/server/load-components.js:103:26)
    at async DevServer.findPageComponentsImpl (/Applications/Romain/mediavaldispatch/node_modules/next/dist/server/next-server.js:714:36)
    at async DevServer.findPageComponents (/Applications/Romain/mediavaldispatch/node_modules/next/dist/server/dev/next-dev-server.js:577:20)
    at async DevServer.renderPageComponent (/Applications/Romain/mediavaldispatch/node_modules/next/dist/server/base-server.js:1910:24)
    at async DevServer.renderToResponseImpl (/Applications/Romain/mediavaldispatch/node_modules/next/dist/server/base-server.js:1962:32)
    at async DevServer.pipeImpl (/Applications/Romain/mediavaldispatch/node_modules/next/dist/server/base-server.js:922:25)
    at async NextNodeServer.handleCatchallRenderRequest (/Applications/Romain/mediavaldispatch/node_modules/next/dist/server/next-server.js:272:17)
    at async DevServer.handleRequestImpl (/Applications/Romain/mediavaldispatch/node_modules/next/dist/server/base-server.js:818:17)
    at async /Applications/Romain/mediavaldispatch/node_modules/next/dist/server/dev/next-dev-server.js:339:20
    at async Span.traceAsyncFn (/Applications/Romain/mediavaldispatch/node_modules/next/dist/trace/trace.js:154:20)
    at async DevServer.handleRequest (/Applications/Romain/mediavaldispatch/node_modules/next/dist/server/dev/next-dev-server.js:336:24)
    at async invokeRender (/Applications/Romain/mediavaldispatch/node_modules/next/dist/server/lib/router-server.js:179:21)
    at async handleRequest (/Applications/Romain/mediavaldispatch/node_modules/next/dist/server/lib/router-server.js:359:24)
    at async requestHandlerImpl (/Applications/Romain/mediavaldispatch/node_modules/next/dist/server/lib/router-server.js:383:13)
    at async Server.requestListener (/Applications/Romain/mediavaldispatch/node_modules/next/dist/server/lib/start-server.js:141:13) {
  page: '/api/dialogues/day/1'
}
 ⨯ TypeError: Cannot read properties of undefined (reading '__internal')
    at new t (/Applications/Romain/mediavaldispatch/node_modules/@prisma/client/runtime/client.js:70:952)
    at eval (webpack-internal:///(rsc)/./app/api/heroes/route.ts:11:16)
    at (rsc)/./app/api/heroes/route.ts (/Applications/Romain/mediavaldispatch/.next/server/app/api/heroes/route.js:62:1)
    at __webpack_require__ (/Applications/Romain/mediavaldispatch/.next/server/webpack-runtime.js:33:42)
    at eval (webpack-internal:///(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fheroes%2Froute&page=%2Fapi%2Fheroes%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fheroes%2Froute.ts&appDir=%2FApplications%2FRomain%2Fmediavaldispatch%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FApplications%2FRomain%2Fmediavaldispatch&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!:15:119)
    at (rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fheroes%2Froute&page=%2Fapi%2Fheroes%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fheroes%2Froute.ts&appDir=%2FApplications%2FRomain%2Fmediavaldispatch%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FApplications%2FRomain%2Fmediavaldispatch&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D! (/Applications/Romain/mediavaldispatch/.next/server/app/api/heroes/route.js:52:1)
    at __webpack_require__ (/Applications/Romain/mediavaldispatch/.next/server/webpack-runtime.js:33:42)
    at __webpack_exec__ (/Applications/Romain/mediavaldispatch/.next/server/app/api/heroes/route.js:72:39)
    at /Applications/Romain/mediavaldispatch/.next/server/app/api/heroes/route.js:73:83
    at __webpack_require__.X (/Applications/Romain/mediavaldispatch/.next/server/webpack-runtime.js:168:21)
    at /Applications/Romain/mediavaldispatch/.next/server/app/api/heroes/route.js:73:47
    at Object.<anonymous> (/Applications/Romain/mediavaldispatch/.next/server/app/api/heroes/route.js:76:3)
    at Module._compile (node:internal/modules/cjs/loader:1760:14)
    at Object..js (node:internal/modules/cjs/loader:1893:10)
    at Module.load (node:internal/modules/cjs/loader:1480:32)
    at Module._load (node:internal/modules/cjs/loader:1299:12)
    at TracingChannel.traceSync (node:diagnostics_channel:328:14)
    at wrapModuleLoad (node:internal/modules/cjs/loader:244:24)
    at Module.<anonymous> (node:internal/modules/cjs/loader:1503:12)
    at mod.require (/Applications/Romain/mediavaldispatch/node_modules/next/dist/server/require-hook.js:65:28)
    at require (node:internal/modules/helpers:152:16)
    at requirePage (/Applications/Romain/mediavaldispatch/node_modules/next/dist/server/require.js:109:84)
    at /Applications/Romain/mediavaldispatch/node_modules/next/dist/server/load-components.js:103:84
    at async loadComponentsImpl (/Applications/Romain/mediavaldispatch/node_modules/next/dist/server/load-components.js:103:26)
    at async DevServer.findPageComponentsImpl (/Applications/Romain/mediavaldispatch/node_modules/next/dist/server/next-server.js:714:36)
    at async DevServer.findPageComponents (/Applications/Romain/mediavaldispatch/node_modules/next/dist/server/dev/next-dev-server.js:577:20)
    at async DevServer.renderPageComponent (/Applications/Romain/mediavaldispatch/node_modules/next/dist/server/base-server.js:1910:24)
    at async DevServer.renderToResponseImpl (/Applications/Romain/mediavaldispatch/node_modules/next/dist/server/base-server.js:1962:32)
    at async DevServer.pipeImpl (/Applications/Romain/mediavaldispatch/node_modules/next/dist/server/base-server.js:922:25)
    at async NextNodeServer.handleCatchallRenderRequest (/Applications/Romain/mediavaldispatch/node_modules/next/dist/server/next-server.js:272:17)
    at async DevServer.handleRequestImpl (/Applications/Romain/mediavaldispatch/node_modules/next/dist/server/base-server.js:818:17)
    at async /Applications/Romain/mediavaldispatch/node_modules/next/dist/server/dev/next-dev-server.js:339:20
    at async Span.traceAsyncFn (/Applications/Romain/mediavaldispatch/node_modules/next/dist/trace/trace.js:154:20)
    at async DevServer.handleRequest (/Applications/Romain/mediavaldispatch/node_modules/next/dist/server/dev/next-dev-server.js:336:24)
    at async invokeRender (/Applications/Romain/mediavaldispatch/node_modules/next/dist/server/lib/router-server.js:179:21)
    at async handleRequest (/Applications/Romain/mediavaldispatch/node_modules/next/dist/server/lib/router-server.js:359:24)
    at async requestHandlerImpl (/Applications/Romain/mediavaldispatch/node_modules/next/dist/server/lib/router-server.js:383:13)
    at async Server.requestListener (/Applications/Romain/mediavaldispatch/node_modules/next/dist/server/lib/start-server.js:141:13) {
  page: '/api/heroes'
}
 ○ Compiling /_error ...
 ✓ Compiled /_error in 2.1s (766 modules)
 GET /api/buildings 500 in 5854ms
 GET /api/missions/day/1 500 in 5799ms
 GET /api/dialogues/day/1 500 in 5800ms
 GET /api/heroes 500 in 5866ms
 ⨯ TypeError: Cannot read properties of undefined (reading '__internal')
    at new t (/Applications/Romain/mediavaldispatch/node_modules/@prisma/client/runtime/client.js:70:952)
    at eval (webpack-internal:///(rsc)/./app/api/buildings/route.ts:11:16)
    at (rsc)/./app/api/buildings/route.ts (/Applications/Romain/mediavaldispatch/.next/server/app/api/buildings/route.js:62:1)
    at __webpack_require__ (/Applications/Romain/mediavaldispatch/.next/server/webpack-runtime.js:33:42)
    at eval (webpack-internal:///(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fbuildings%2Froute&page=%2Fapi%2Fbuildings%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fbuildings%2Froute.ts&appDir=%2FApplications%2FRomain%2Fmediavaldispatch%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FApplications%2FRomain%2Fmediavaldispatch&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!:15:122)
    at (rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fbuildings%2Froute&page=%2Fapi%2Fbuildings%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fbuildings%2Froute.ts&appDir=%2FApplications%2FRomain%2Fmediavaldispatch%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FApplications%2FRomain%2Fmediavaldispatch&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D! (/Applications/Romain/mediavaldispatch/.next/server/app/api/buildings/route.js:52:1)
    at __webpack_require__ (/Applications/Romain/mediavaldispatch/.next/server/webpack-runtime.js:33:42)
    at __webpack_exec__ (/Applications/Romain/mediavaldispatch/.next/server/app/api/buildings/route.js:72:39)
    at /Applications/Romain/mediavaldispatch/.next/server/app/api/buildings/route.js:73:83
    at __webpack_require__.X (/Applications/Romain/mediavaldispatch/.next/server/webpack-runtime.js:168:21)
    at /Applications/Romain/mediavaldispatch/.next/server/app/api/buildings/route.js:73:47
    at Object.<anonymous> (/Applications/Romain/mediavaldispatch/.next/server/app/api/buildings/route.js:76:3)
    at Module._compile (node:internal/modules/cjs/loader:1760:14)
    at Object..js (node:internal/modules/cjs/loader:1893:10)
    at Module.load (node:internal/modules/cjs/loader:1480:32)
    at Module._load (node:internal/modules/cjs/loader:1299:12)
    at TracingChannel.traceSync (node:diagnostics_channel:328:14)
    at wrapModuleLoad (node:internal/modules/cjs/loader:244:24)
    at Module.<anonymous> (node:internal/modules/cjs/loader:1503:12)
    at mod.require (/Applications/Romain/mediavaldispatch/node_modules/next/dist/server/require-hook.js:65:28)
    at require (node:internal/modules/helpers:152:16)
    at requirePage (/Applications/Romain/mediavaldispatch/node_modules/next/dist/server/require.js:109:84)
    at /Applications/Romain/mediavaldispatch/node_modules/next/dist/server/load-components.js:103:84
    at async loadComponentsImpl (/Applications/Romain/mediavaldispatch/node_modules/next/dist/server/load-components.js:103:26)
    at async DevServer.findPageComponentsImpl (/Applications/Romain/mediavaldispatch/node_modules/next/dist/server/next-server.js:714:36)
    at async DevServer.findPageComponents (/Applications/Romain/mediavaldispatch/node_modules/next/dist/server/dev/next-dev-server.js:577:20)
    at async DevServer.renderPageComponent (/Applications/Romain/mediavaldispatch/node_modules/next/dist/server/base-server.js:1910:24)
    at async DevServer.renderToResponseImpl (/Applications/Romain/mediavaldispatch/node_modules/next/dist/server/base-server.js:1962:32)
    at async DevServer.pipeImpl (/Applications/Romain/mediavaldispatch/node_modules/next/dist/server/base-server.js:922:25)
    at async NextNodeServer.handleCatchallRenderRequest (/Applications/Romain/mediavaldispatch/node_modules/next/dist/server/next-server.js:272:17)
    at async DevServer.handleRequestImpl (/Applications/Romain/mediavaldispatch/node_modules/next/dist/server/base-server.js:818:17)
    at async /Applications/Romain/mediavaldispatch/node_modules/next/dist/server/dev/next-dev-server.js:339:20
    at async Span.traceAsyncFn (/Applications/Romain/mediavaldispatch/node_modules/next/dist/trace/trace.js:154:20)
    at async DevServer.handleRequest (/Applications/Romain/mediavaldispatch/node_modules/next/dist/server/dev/next-dev-server.js:336:24)
    at async invokeRender (/Applications/Romain/mediavaldispatch/node_modules/next/dist/server/lib/router-server.js:179:21)
    at async handleRequest (/Applications/Romain/mediavaldispatch/node_modules/next/dist/server/lib/router-server.js:359:24)
    at async requestHandlerImpl (/Applications/Romain/mediavaldispatch/node_modules/next/dist/server/lib/router-server.js:383:13)
    at async Server.requestListener (/Applications/Romain/mediavaldispatch/node_modules/next/dist/server/lib/start-server.js:141:13) {
  page: '/api/buildings'
}
 ⨯ TypeError: Cannot read properties of undefined (reading '__internal')
    at new t (/Applications/Romain/mediavaldispatch/node_modules/@prisma/client/runtime/client.js:70:952)
    at eval (webpack-internal:///(rsc)/./app/api/heroes/route.ts:11:16)
    at (rsc)/./app/api/heroes/route.ts (/Applications/Romain/mediavaldispatch/.next/server/app/api/heroes/route.js:62:1)
    at __webpack_require__ (/Applications/Romain/mediavaldispatch/.next/server/webpack-runtime.js:33:42)
    at eval (webpack-internal:///(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fheroes%2Froute&page=%2Fapi%2Fheroes%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fheroes%2Froute.ts&appDir=%2FApplications%2FRomain%2Fmediavaldispatch%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FApplications%2FRomain%2Fmediavaldispatch&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!:15:119)
    at (rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fheroes%2Froute&page=%2Fapi%2Fheroes%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fheroes%2Froute.ts&appDir=%2FApplications%2FRomain%2Fmediavaldispatch%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FApplications%2FRomain%2Fmediavaldispatch&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D! (/Applications/Romain/mediavaldispatch/.next/server/app/api/heroes/route.js:52:1)
    at __webpack_require__ (/Applications/Romain/mediavaldispatch/.next/server/webpack-runtime.js:33:42)
    at __webpack_exec__ (/Applications/Romain/mediavaldispatch/.next/server/app/api/heroes/route.js:72:39)
    at /Applications/Romain/mediavaldispatch/.next/server/app/api/heroes/route.js:73:83
    at __webpack_require__.X (/Applications/Romain/mediavaldispatch/.next/server/webpack-runtime.js:168:21)
    at /Applications/Romain/mediavaldispatch/.next/server/app/api/heroes/route.js:73:47
    at Object.<anonymous> (/Applications/Romain/mediavaldispatch/.next/server/app/api/heroes/route.js:76:3)
    at Module._compile (node:internal/modules/cjs/loader:1760:14)
    at Object..js (node:internal/modules/cjs/loader:1893:10)
    at Module.load (node:internal/modules/cjs/loader:1480:32)
    at Module._load (node:internal/modules/cjs/loader:1299:12)
    at TracingChannel.traceSync (node:diagnostics_channel:328:14)
    at wrapModuleLoad (node:internal/modules/cjs/loader:244:24)
    at Module.<anonymous> (node:internal/modules/cjs/loader:1503:12)
    at mod.require (/Applications/Romain/mediavaldispatch/node_modules/next/dist/server/require-hook.js:65:28)
    at require (node:internal/modules/helpers:152:16)
    at requirePage (/Applications/Romain/mediavaldispatch/node_modules/next/dist/server/require.js:109:84)
    at /Applications/Romain/mediavaldispatch/node_modules/next/dist/server/load-components.js:103:84
    at async loadComponentsImpl (/Applications/Romain/mediavaldispatch/node_modules/next/dist/server/load-components.js:103:26)
    at async DevServer.findPageComponentsImpl (/Applications/Romain/mediavaldispatch/node_modules/next/dist/server/next-server.js:714:36)
    at async DevServer.findPageComponents (/Applications/Romain/mediavaldispatch/node_modules/next/dist/server/dev/next-dev-server.js:577:20)
    at async DevServer.renderPageComponent (/Applications/Romain/mediavaldispatch/node_modules/next/dist/server/base-server.js:1910:24)
    at async DevServer.renderToResponseImpl (/Applications/Romain/mediavaldispatch/node_modules/next/dist/server/base-server.js:1962:32)
    at async DevServer.pipeImpl (/Applications/Romain/mediavaldispatch/node_modules/next/dist/server/base-server.js:922:25)
    at async NextNodeServer.handleCatchallRenderRequest (/Applications/Romain/mediavaldispatch/node_modules/next/dist/server/next-server.js:272:17)
    at async DevServer.handleRequestImpl (/Applications/Romain/mediavaldispatch/node_modules/next/dist/server/base-server.js:818:17)
    at async /Applications/Romain/mediavaldispatch/node_modules/next/dist/server/dev/next-dev-server.js:339:20
    at async Span.traceAsyncFn (/Applications/Romain/mediavaldispatch/node_modules/next/dist/trace/trace.js:154:20)
    at async DevServer.handleRequest (/Applications/Romain/mediavaldispatch/node_modules/next/dist/server/dev/next-dev-server.js:336:24)
    at async invokeRender (/Applications/Romain/mediavaldispatch/node_modules/next/dist/server/lib/router-server.js:179:21)
    at async handleRequest (/Applications/Romain/mediavaldispatch/node_modules/next/dist/server/lib/router-server.js:359:24)
    at async requestHandlerImpl (/Applications/Romain/mediavaldispatch/node_modules/next/dist/server/lib/router-server.js:383:13)
    at async Server.requestListener (/Applications/Romain/mediavaldispatch/node_modules/next/dist/server/lib/start-server.js:141:13) {
  page: '/api/heroes'
}
 GET /api/buildings 500 in 424ms
 GET /api/heroes 500 in 418ms
 ⨯ TypeError: Cannot read properties of undefined (reading '__internal')
    at new t (/Applications/Romain/mediavaldispatch/node_modules/@prisma/client/runtime/client.js:70:952)
    at eval (webpack-internal:///(rsc)/./app/api/missions/day/[day]/route.ts:11:16)
    at (rsc)/./app/api/missions/day/[day]/route.ts (/Applications/Romain/mediavaldispatch/.next/server/app/api/missions/day/[day]/route.js:62:1)
    at __webpack_require__ (/Applications/Romain/mediavaldispatch/.next/server/webpack-runtime.js:33:42)
    at eval (webpack-internal:///(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fmissions%2Fday%2F%5Bday%5D%2Froute&page=%2Fapi%2Fmissions%2Fday%2F%5Bday%5D%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fmissions%2Fday%2F%5Bday%5D%2Froute.ts&appDir=%2FApplications%2FRomain%2Fmediavaldispatch%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FApplications%2FRomain%2Fmediavaldispatch&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!:15:129)
    at (rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fmissions%2Fday%2F%5Bday%5D%2Froute&page=%2Fapi%2Fmissions%2Fday%2F%5Bday%5D%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fmissions%2Fday%2F%5Bday%5D%2Froute.ts&appDir=%2FApplications%2FRomain%2Fmediavaldispatch%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FApplications%2FRomain%2Fmediavaldispatch&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D! (/Applications/Romain/mediavaldispatch/.next/server/app/api/missions/day/[day]/route.js:52:1)
    at __webpack_require__ (/Applications/Romain/mediavaldispatch/.next/server/webpack-runtime.js:33:42)
    at __webpack_exec__ (/Applications/Romain/mediavaldispatch/.next/server/app/api/missions/day/[day]/route.js:72:39)
    at /Applications/Romain/mediavaldispatch/.next/server/app/api/missions/day/[day]/route.js:73:83
    at __webpack_require__.X (/Applications/Romain/mediavaldispatch/.next/server/webpack-runtime.js:168:21)
    at /Applications/Romain/mediavaldispatch/.next/server/app/api/missions/day/[day]/route.js:73:47
    at Object.<anonymous> (/Applications/Romain/mediavaldispatch/.next/server/app/api/missions/day/[day]/route.js:76:3)
    at Module._compile (node:internal/modules/cjs/loader:1760:14)
    at Object..js (node:internal/modules/cjs/loader:1893:10)
    at Module.load (node:internal/modules/cjs/loader:1480:32)
    at Module._load (node:internal/modules/cjs/loader:1299:12)
    at TracingChannel.traceSync (node:diagnostics_channel:328:14)
    at wrapModuleLoad (node:internal/modules/cjs/loader:244:24)
    at Module.<anonymous> (node:internal/modules/cjs/loader:1503:12)
    at mod.require (/Applications/Romain/mediavaldispatch/node_modules/next/dist/server/require-hook.js:65:28)
    at require (node:internal/modules/helpers:152:16)
    at requirePage (/Applications/Romain/mediavaldispatch/node_modules/next/dist/server/require.js:109:84)
    at /Applications/Romain/mediavaldispatch/node_modules/next/dist/server/load-components.js:103:84
    at async loadComponentsImpl (/Applications/Romain/mediavaldispatch/node_modules/next/dist/server/load-components.js:103:26)
    at async DevServer.findPageComponentsImpl (/Applications/Romain/mediavaldispatch/node_modules/next/dist/server/next-server.js:714:36)
    at async DevServer.findPageComponents (/Applications/Romain/mediavaldispatch/node_modules/next/dist/server/dev/next-dev-server.js:577:20)
    at async DevServer.renderPageComponent (/Applications/Romain/mediavaldispatch/node_modules/next/dist/server/base-server.js:1910:24)
    at async DevServer.renderToResponseImpl (/Applications/Romain/mediavaldispatch/node_modules/next/dist/server/base-server.js:1962:32)
    at async DevServer.pipeImpl (/Applications/Romain/mediavaldispatch/node_modules/next/dist/server/base-server.js:922:25)
    at async NextNodeServer.handleCatchallRenderRequest (/Applications/Romain/mediavaldispatch/node_modules/next/dist/server/next-server.js:272:17)
    at async DevServer.handleRequestImpl (/Applications/Romain/mediavaldispatch/node_modules/next/dist/server/base-server.js:818:17)
    at async /Applications/Romain/mediavaldispatch/node_modules/next/dist/server/dev/next-dev-server.js:339:20
    at async Span.traceAsyncFn (/Applications/Romain/mediavaldispatch/node_modules/next/dist/trace/trace.js:154:20)
    at async DevServer.handleRequest (/Applications/Romain/mediavaldispatch/node_modules/next/dist/server/dev/next-dev-server.js:336:24)
    at async invokeRender (/Applications/Romain/mediavaldispatch/node_modules/next/dist/server/lib/router-server.js:179:21)
    at async handleRequest (/Applications/Romain/mediavaldispatch/node_modules/next/dist/server/lib/router-server.js:359:24)
    at async requestHandlerImpl (/Applications/Romain/mediavaldispatch/node_modules/next/dist/server/lib/router-server.js:383:13)
    at async Server.requestListener (/Applications/Romain/mediavaldispatch/node_modules/next/dist/server/lib/start-server.js:141:13) {
  page: '/api/missions/day/1'
}
 ⨯ TypeError: Cannot read properties of undefined (reading '__internal')
    at new t (/Applications/Romain/mediavaldispatch/node_modules/@prisma/client/runtime/client.js:70:952)
    at eval (webpack-internal:///(rsc)/./app/api/dialogues/day/[day]/route.ts:11:16)
    at (rsc)/./app/api/dialogues/day/[day]/route.ts (/Applications/Romain/mediavaldispatch/.next/server/app/api/dialogues/day/[day]/route.js:62:1)
    at __webpack_require__ (/Applications/Romain/mediavaldispatch/.next/server/webpack-runtime.js:33:42)
    at eval (webpack-internal:///(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fdialogues%2Fday%2F%5Bday%5D%2Froute&page=%2Fapi%2Fdialogues%2Fday%2F%5Bday%5D%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fdialogues%2Fday%2F%5Bday%5D%2Froute.ts&appDir=%2FApplications%2FRomain%2Fmediavaldispatch%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FApplications%2FRomain%2Fmediavaldispatch&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!:15:130)
    at (rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fdialogues%2Fday%2F%5Bday%5D%2Froute&page=%2Fapi%2Fdialogues%2Fday%2F%5Bday%5D%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fdialogues%2Fday%2F%5Bday%5D%2Froute.ts&appDir=%2FApplications%2FRomain%2Fmediavaldispatch%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FApplications%2FRomain%2Fmediavaldispatch&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D! (/Applications/Romain/mediavaldispatch/.next/server/app/api/dialogues/day/[day]/route.js:52:1)
    at __webpack_require__ (/Applications/Romain/mediavaldispatch/.next/server/webpack-runtime.js:33:42)
    at __webpack_exec__ (/Applications/Romain/mediavaldispatch/.next/server/app/api/dialogues/day/[day]/route.js:72:39)
    at /Applications/Romain/mediavaldispatch/.next/server/app/api/dialogues/day/[day]/route.js:73:83
    at __webpack_require__.X (/Applications/Romain/mediavaldispatch/.next/server/webpack-runtime.js:168:21)
    at /Applications/Romain/mediavaldispatch/.next/server/app/api/dialogues/day/[day]/route.js:73:47
    at Object.<anonymous> (/Applications/Romain/mediavaldispatch/.next/server/app/api/dialogues/day/[day]/route.js:76:3)
    at Module._compile (node:internal/modules/cjs/loader:1760:14)
    at Object..js (node:internal/modules/cjs/loader:1893:10)
    at Module.load (node:internal/modules/cjs/loader:1480:32)
    at Module._load (node:internal/modules/cjs/loader:1299:12)
    at TracingChannel.traceSync (node:diagnostics_channel:328:14)
    at wrapModuleLoad (node:internal/modules/cjs/loader:244:24)
    at Module.<anonymous> (node:internal/modules/cjs/loader:1503:12)
    at mod.require (/Applications/Romain/mediavaldispatch/node_modules/next/dist/server/require-hook.js:65:28)
    at require (node:internal/modules/helpers:152:16)
    at requirePage (/Applications/Romain/mediavaldispatch/node_modules/next/dist/server/require.js:109:84)
    at /Applications/Romain/mediavaldispatch/node_modules/next/dist/server/load-components.js:103:84
    at async loadComponentsImpl (/Applications/Romain/mediavaldispatch/node_modules/next/dist/server/load-components.js:103:26)
    at async DevServer.findPageComponentsImpl (/Applications/Romain/mediavaldispatch/node_modules/next/dist/server/next-server.js:714:36)
    at async DevServer.findPageComponents (/Applications/Romain/mediavaldispatch/node_modules/next/dist/server/dev/next-dev-server.js:577:20)
    at async DevServer.renderPageComponent (/Applications/Romain/mediavaldispatch/node_modules/next/dist/server/base-server.js:1910:24)
    at async DevServer.renderToResponseImpl (/Applications/Romain/mediavaldispatch/node_modules/next/dist/server/base-server.js:1962:32)
    at async DevServer.pipeImpl (/Applications/Romain/mediavaldispatch/node_modules/next/dist/server/base-server.js:922:25)
    at async NextNodeServer.handleCatchallRenderRequest (/Applications/Romain/mediavaldispatch/node_modules/next/dist/server/next-server.js:272:17)
    at async DevServer.handleRequestImpl (/Applications/Romain/mediavaldispatch/node_modules/next/dist/server/base-server.js:818:17)
    at async /Applications/Romain/mediavaldispatch/node_modules/next/dist/server/dev/next-dev-server.js:339:20
    at async Span.traceAsyncFn (/Applications/Romain/mediavaldispatch/node_modules/next/dist/trace/trace.js:154:20)
    at async DevServer.handleRequest (/Applications/Romain/mediavaldispatch/node_modules/next/dist/server/dev/next-dev-server.js:336:24)
    at async invokeRender (/Applications/Romain/mediavaldispatch/node_modules/next/dist/server/lib/router-server.js:179:21)
    at async handleRequest (/Applications/Romain/mediavaldispatch/node_modules/next/dist/server/lib/router-server.js:359:24)
    at async requestHandlerImpl (/Applications/Romain/mediavaldispatch/node_modules/next/dist/server/lib/router-server.js:383:13)
    at async Server.requestListener (/Applications/Romain/mediavaldispatch/node_modules/next/dist/server/lib/start-server.js:141:13) {
  page: '/api/dialogues/day/1'
}
 GET /api/missions/day/1 500 in 564ms
 GET /api/dialogues/day/1 500 in 558ms
c