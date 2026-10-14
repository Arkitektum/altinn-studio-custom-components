// Writes the dataModelBindings keys each component declares to dist/dataModelBindingKeys.json, for packages that only install the bundle.
// Node 24 strips the types from the TypeScript source it imports, so this runs without a build step of its own.
import { mkdirSync, writeFileSync } from "node:fs";
import { getDataModelBindingKeysByTagName } from "../src/functions/componentHelpers.ts";
import path from "node:path";

const outputPath = path.resolve(import.meta.dirname, "../dist/dataModelBindingKeys.json");
mkdirSync(path.dirname(outputPath), { recursive: true });
writeFileSync(outputPath, `${JSON.stringify(getDataModelBindingKeysByTagName(), null, 4)}\n`);
console.log(`Wrote ${path.relative(process.cwd(), outputPath)}`);
