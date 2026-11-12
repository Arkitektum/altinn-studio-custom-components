import { instantiateComponent } from "../functions/componentHelpers.ts";

// This repository's TypeScript has no Node types, so the two Node modules are required and given the shape used here.
declare const __dirname: string;
type NodeFs = {
    readdirSync(path: string, options: { withFileTypes: true }): { name: string; isDirectory(): boolean }[];
    readFileSync(path: string, encoding: "utf8"): string;
    existsSync(path: string): boolean;
};
const { existsSync, readdirSync, readFileSync }: NodeFs = require("node:fs");
const { join }: { join(...paths: string[]): string } = require("node:path");

/** Every component folder under the given one, nested ones included, since a grouplist keeps its group inside it. */
function componentFolders(directory: string): string[] {
    return readdirSync(directory, { withFileTypes: true })
        .filter((entry) => entry.isDirectory())
        .flatMap((entry) => [join(directory, entry.name), ...componentFolders(join(directory, entry.name))]);
}

/** The tags a component's own files name outright: what it creates, and what it hands a table or list as a cell's tag. */
function namedTags(source: string): string[] {
    const created = [...source.matchAll(/createCustomElement\(([^,)]*)/g)].flatMap((call) =>
        [...call[1]!.matchAll(/"(custom-[a-z-]+)"/g)].map((tag) => tag[1]!)
    );
    const handedOn = [...source.matchAll(/tagName:\s*"(custom-[a-z-]+)"/g)].map((tag) => tag[1]!);
    return [...created, ...handedOn];
}

/*
 * The statistics page builds its usage tree from getComponentUsage, so a tag a component draws and does not list is a
 * use the page never shows. Base components are the leaves of that tree and list nothing, so only the data and layout
 * components are held to it. A tag built at runtime, from a variable, is not seen here.
 */
describe("getComponentUsage", () => {
    const folders = ["data-components", "layout-components"].flatMap((kind) => componentFolders(join(__dirname, kind)));

    it("lists every tag a data or layout component names in its own files", () => {
        const unlisted = folders.flatMap((folder) => {
            const name = folder.split("/").at(-1)!;
            const tagName = name.startsWith("custom-") ? name : `custom-${name}`;
            const files = ["index.ts", "renderers.ts"].map((file) => join(folder, file)).filter((file) => existsSync(file));
            if (files.length === 0) return [];
            const listed: string[] =
                (instantiateComponent({ tagName }) as { getComponentUsage?: () => string[] } | null)?.getComponentUsage?.() ?? [];
            const named = new Set(files.flatMap((file) => namedTags(readFileSync(file, "utf8"))));
            named.delete(tagName);
            return [...named].filter((tag) => !listed.includes(tag)).map((tag) => `${tagName} draws ${tag}`);
        });
        expect(unlisted).toEqual([]);
    });
});
