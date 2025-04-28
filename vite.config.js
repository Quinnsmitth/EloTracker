import { defineConfig } from 'vite';
import vitePluginStaticCopy from 'vite-plugin-static-copy';
import compression from 'vite-plugin-compression';

export default defineConfig({
    plugins: [
        vitePluginStaticCopy({
            targets: [
                {
                    src: 'public/UnityGame2/Build/',
                    dest: 'UnityGame2/Build',
                },
            ],
        }),
        compression(), // Good for production builds
    ],
    assetsInclude: ['**/*.gz', '**/*.wasm'],
    server: {
        headers: {
            'Cross-Origin-Opener-Policy': 'same-origin',
            'Cross-Origin-Embedder-Policy': 'require-corp',
        },
    },
});
