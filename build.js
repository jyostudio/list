import * as esbuild from 'esbuild';
import fs from 'fs';

async function build() {
    // Build list-with-json-schema.js
    console.log('Building list-with-json-schema.js...');
    await esbuild.build({
        entryPoints: ['src/index.ts'],
        bundle: true,
        minify: true,
        sourcemap: true,
        format: 'esm',
        outfile: 'dist/list-with-json-schema.js',
    });

    // Prepare source for list.js
    console.log('Preparing source for list.js...');
    const indexContent = fs.readFileSync('src/index.ts', 'utf8');
    const noSchemaContent = indexContent
        .replace('import JSONSchema from "@jyostudio/overload/dist/jsonSchema.js";', '')
        .replace(/\[Function, JSONSchema\]/g, 'Function');

    const tempFile = 'src/index.no-schema.ts';
    fs.writeFileSync(tempFile, noSchemaContent);

    try {
        // Build list.js
        console.log('Building list.js...');
        await esbuild.build({
            entryPoints: [tempFile],
            bundle: true,
            minify: true,
            sourcemap: true,
            format: 'esm',
            outfile: 'dist/list.js',
        });
    } finally {
        if (fs.existsSync(tempFile)) {
            fs.unlinkSync(tempFile);
        }
    }
}

build().catch(err => {
    console.error(err);
    process.exit(1);
});
