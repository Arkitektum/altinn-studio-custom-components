// Replaces Altinn's layout and expression schemas in src/data/altinn/ with the current copies from Altinn, which src/functions/layoutSchemaHelpers.ts builds this package's layout schema from.
// Kept in the repository rather than fetched at build, so builds work offline and a change on Altinn's side shows up as a diff to review.
// Run with: yarn update-altinn-layout-schema
import path from "node:path";
import { writeFileSync } from "node:fs";

const baseUrl = "https://altinncdn.no/toolkits/altinn-app-frontend/4/schemas/json/layout/";

for (const name of ["layout.schema.v1.json", "expression.schema.v1.json"]) {
    const sourceUrl = `${baseUrl}${name}`;
    const response = await fetch(sourceUrl);
    if (!response.ok) {
        throw new Error(`Could not fetch ${sourceUrl}: ${response.status} ${response.statusText}`);
    }
    const schemaText = await response.text();
    // Parsed only to make sure it is JSON. The text is written as it came, so the diff shows Altinn's changes and nothing else.
    JSON.parse(schemaText);
    const outputPath = path.resolve(import.meta.dirname, "../src/data/altinn", name);
    writeFileSync(outputPath, schemaText);
    console.log(`Wrote ${path.relative(process.cwd(), outputPath)} from ${sourceUrl}`);
}
