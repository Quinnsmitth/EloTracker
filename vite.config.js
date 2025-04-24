import { defineConfig } from 'vite';
import vitePluginStaticCopy from 'vite-plugin-static-copy'; // Correct import

export default defineConfig({
    plugins: [
        vitePluginStaticCopy({
            targets: [
                {
                    src: 'path/to/UnityGame/Build/*.gz', // Replace with actual path to the .gz files
                    dest: 'UnityGame/Build', // Destination where the files will be copied
                },
            ],
        }),
    ],
    assetsInclude: ['**/*.gz'], // Ensure .gz files are treated as assets
});
