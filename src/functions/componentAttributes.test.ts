import { attributesReadWithData, getAttributeOwners, getComponentSpecificAttributes } from "./componentAttributes.ts";
import { componentMap } from "./componentHelpers.ts";

// This repository's TypeScript has no Node types, so the Node modules are required and given the shape used here.
declare const __dirname: string;
interface NodeFs {
    readdirSync(path: string, options: { withFileTypes: true }): { name: string; isDirectory(): boolean }[];
    readFileSync(path: string, encoding: "utf8"): string;
}
const { readdirSync, readFileSync }: NodeFs = require("node:fs");

describe("getComponentSpecificAttributes", () => {
    it("finds the attributes the base class does not copy onto every component", () => {
        expect(getComponentSpecificAttributes()).toEqual([
            "tableColumns",
            "showRowNumbers",
            "itemKey",
            "itemTermKey",
            "itemDescriptionKey",
            "dataItemKey",
            "dataTitleItemKey"
        ]);
    });
});

describe("getAttributeOwners", () => {
    it("finds the components that read each of them", () => {
        expect(getAttributeOwners()).toEqual({
            tableColumns: ["custom-field-grid", "custom-field-row", "custom-matrix-data", "custom-table-data"],
            showRowNumbers: ["custom-table-data"],
            itemKey: ["custom-list-data"],
            itemTermKey: ["custom-description-list-data"],
            itemDescriptionKey: ["custom-description-list-data"],
            dataItemKey: ["custom-field-list-data"],
            dataTitleItemKey: ["custom-field-list-data"]
        });
    });

    it("leaves the console as it found it", () => {
        const { warn, error } = console;
        getAttributeOwners();
        expect(console.warn).toBe(warn);
        expect(console.error).toBe(error);
    });

    it("agrees with the source about who reads each of them", () => {
        // The tag a source file belongs to: a class is found through componentMap, a renderer through the folder it sits in.
        const tagByClassName = Object.fromEntries(Object.entries(componentMap).map(([tagName, ComponentClass]) => [ComponentClass.name, tagName]));
        const sourceFiles = (folder: string): string[] =>
            readdirSync(folder, { withFileTypes: true }).flatMap((entry) =>
                entry.isDirectory()
                    ? sourceFiles(`${folder}/${entry.name}`)
                    : entry.name.endsWith(".ts") && !entry.name.endsWith(".test.ts")
                      ? [`${folder}/${entry.name}`]
                      : []
            );
        const tagForFile = (file: string) => {
            const className = file.split("/").pop()!.replace(".ts", "");
            if (tagByClassName[className]) return tagByClassName[className];
            const folder = /\/components\/[a-z-]+-components\/([a-z-]+)\//.exec(file)?.[1];
            return folder ? (folder.startsWith("custom-") ? folder : `custom-${folder}`) : file;
        };
        const readersInSource = Object.fromEntries(
            getComponentSpecificAttributes().map((name) => {
                const pattern = new RegExp(`(props|component|this)\\??\\.${name}\\b`);
                const readers = [`${__dirname}/../classes`, `${__dirname}/../components`]
                    .flatMap(sourceFiles)
                    .filter((file) => !file.endsWith("/CustomComponent.ts") && pattern.test(readFileSync(file, "utf8")))
                    .map(tagForFile);
                return [name, [...new Set(readers)].sort()];
            })
        );
        const owners = Object.fromEntries(Object.entries(getAttributeOwners()).map(([name, tagNames]) => [name, [...tagNames].sort()]));
        // A difference is a component reading an attribute only while rendering or once it has data: list it in attributesReadWithData.
        expect(readersInSource).toEqual(owners);
    });

    it("lists only components that exist", () => {
        expect(
            Object.values(attributesReadWithData)
                .flat()
                .every((tagName) => tagName in componentMap)
        ).toBe(true);
    });
});
