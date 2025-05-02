// import { defineConfig } from 'vite'
// import compression from 'vite-plugin-compression'
// import fs from 'fs'
// import path from 'path'

// export default defineConfig(({ command }) => ({
//   plugins: [
//     // only gzip on `vite build`
//     command === 'build' && compression({
//       filter: /\.(wasm|data)$/,
//       algorithm: 'gzip',
//       ext: '.gz',
//     })
//   ].filter(Boolean),
//   server: {
//     // serve .wasm correctly
//     mimeTypes: {
//       'application/wasm': ['wasm']
//     },
//     // required for Unity CORP / COOP
//     headers: {
//       'Cross-Origin-Opener-Policy': 'same-origin',
//       'Cross-Origin-Embedder-Policy': 'require-corp'
//     }
//   }
// }))

// vite.config.js
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [
    {
      name: 'serve-raw-wasm-data',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          if (req.url.endsWith('.wasm') || req.url.endsWith('.data')) {
            // turn off compression for these
            res.setHeader('Content-Encoding', 'identity')
          }
          next()
        })
      }
    }
  ]
})

