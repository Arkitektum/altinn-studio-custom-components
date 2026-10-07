import { defaultTextResourceLanguages } from "../constants/defaultTextResourceLanguages.ts";
import nbResources from "./resource.nb.json";
import resources from "./resources.json";

// This repository's TypeScript has no Node types, so the two Node modules are required and given the shape used here.
declare const __dirname: string;
type NodeFs = {
    readdirSync(path: string, options: { withFileTypes: true }): { name: string; isDirectory(): boolean }[];
    readFileSync(path: string, encoding: "utf8"): string;
};
const { readdirSync, readFileSync }: NodeFs = require("node:fs");
const { join }: { join(...paths: string[]): string } = require("node:path");

const sourceRoot = join(__dirname, "..");

/** Every TypeScript file under src that ships, so not the tests or the declarations. */
function sourceFiles(directory: string): string[] {
    return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
        const path = join(directory, entry.name);
        if (entry.isDirectory()) return sourceFiles(path);
        return path.endsWith(".ts") && !path.endsWith(".test.ts") && !path.endsWith(".d.ts") ? [path] : [];
    });
}

describe("resources.json", () => {
    it("holds every resource id the code names as a default", () => {
        // A key built at runtime, such as `resource.arbeidsplasser.${key}.title`, does not match and is not checked here.
        const ids = new Set(resources.map((resource) => resource.id));
        const missing = sourceFiles(sourceRoot).flatMap((file) =>
            [...readFileSync(file, "utf8").matchAll(/["'`](resource\.[\w.]+)["'`]/g)]
                .map((match) => match[1]!)
                .filter((id) => !ids.has(id))
                .map((id) => `${id} (${file.slice(sourceRoot.length + 1)})`)
        );
        expect(missing).toEqual([]);
    });

    it("holds values in exactly the languages the loader asks apps for", () => {
        const languages = new Set(resources.flatMap((resource) => Object.keys(resource.values)));
        expect([...languages].sort()).toEqual([...defaultTextResourceLanguages].sort());
    });

    it("matches resource.nb.json, so the generated file has been regenerated", () => {
        const fromSource = resources.map((resource) => ({ id: resource.id, value: resource.values.nb })).sort((a, b) => a.id.localeCompare(b.id));
        expect(nbResources.resources).toEqual(fromSource);
    });
});
