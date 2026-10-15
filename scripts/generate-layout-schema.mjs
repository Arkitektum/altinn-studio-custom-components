// Writes dist/layout.schema.json: Altinn's layout schema with the definition of a Custom component replaced by this package's, so an editor knows these components' attributes and checks their dataModelBindings.
// Node 24 strips the types from the TypeScript source it imports, so this runs without a build step of its own.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { buildLayoutSchema } from "../src/functions/layoutSchemaHelpers.ts";
import path from "node:path";

const readAltinnSchema = (name) => JSON.parse(readFileSync(path.resolve(import.meta.dirname, "../src/data/altinn", name), "utf8"));
const outputPath = path.resolve(import.meta.dirname, "../dist/layout.schema.json");
mkdirSync(path.dirname(outputPath), { recursive: true });
const schema = buildLayoutSchema(readAltinnSchema("layout.schema.v1.json"), readAltinnSchema("expression.schema.v1.json"));
writeFileSync(outputPath, `${JSON.stringify(schema, null, 2)}\n`);
console.log(`Wrote ${path.relative(process.cwd(), outputPath)}`);
