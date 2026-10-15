import { getResourceBindingKeys, getResourceBindingKeysByTagName, resourceBindingGroupsFromData } from "./resourceBindingKeys.ts";
import CustomFieldListData from "../classes/system-classes/component-classes/CustomFieldListData.ts";
import CustomTablePart from "../classes/system-classes/component-classes/CustomTablePart.ts";
import { componentMap } from "./componentHelpers.ts";

// This repository's TypeScript has no Node types, so the Node module is required and given the shape used here.
declare const __dirname: string;
interface NodeFs {
    readdirSync(path: string): string[];
    readFileSync(path: string, encoding: "utf8"): string;
}
const { readdirSync, readFileSync }: NodeFs = require("node:fs");

describe("getResourceBindingKeys", () => {
    it("finds a component's text keys and its groups with their keys, as a layout writes them", () => {
        // The component's own title is read as resourceBindings.title, not as the part group its getResourceBindings returns.
        expect(getResourceBindingKeys(CustomTablePart, "custom-table-part")).toEqual({
            emptyFieldText: null,
            epost: ["emptyFieldText", "title"],
            navn: ["emptyFieldText", "title"],
            telefonnummer: ["emptyFieldText", "title"],
            title: null
        });
    });

    it("finds nothing for a component that reads no resourceBindings", () => {
        expect(getResourceBindingKeys(CustomFieldListData, "custom-field-list-data")).toEqual({});
    });

    it("leaves the console as it found it", () => {
        const { warn, error } = console;
        getResourceBindingKeys(CustomTablePart, "custom-table-part");
        expect(console.warn).toBe(warn);
        expect(console.error).toBe(error);
    });

    it("finds keys for every component but the fallback", () => {
        const keysByTagName = getResourceBindingKeysByTagName();
        expect(Object.keys(keysByTagName)).toEqual(Object.keys(componentMap).filter((tagName) => tagName !== "custom-component"));
        expect(Object.values(keysByTagName).filter((keys) => Object.keys(keys).length).length > 60).toBe(true);
    });
});

describe("resourceBindingGroupsFromData", () => {
    const componentClassesFolder = `${__dirname}/../classes/system-classes/component-classes`;
    // Reading a resourceBindings key by computed name is fine when the names come from a fixed list in the code, since constructing the component reads them all. It needs declaring when they come from the data.
    const COMPUTED_FROM_A_FIXED_LIST = ["CustomTableArbeidsplasser.ts"];
    const COMPUTED_FROM_THE_DATA = ["CustomGrouplistUtfallSvarType.ts"];

    it("lists every component class that reads resourceBindings keys by computed name", () => {
        const readingByComputedName = readdirSync(componentClassesFolder)
            .filter((file) => file.endsWith(".ts") && !file.endsWith(".test.ts"))
            .filter((file) => /resourceBindings\?\.\[/.test(readFileSync(`${componentClassesFolder}/${file}`, "utf8")))
            .sort();
        // A new one reads keys a constructed component may not show. Add it to one of the lists above, and to resourceBindingGroupsFromData when the names come from the data.
        expect(readingByComputedName).toEqual([...COMPUTED_FROM_A_FIXED_LIST, ...COMPUTED_FROM_THE_DATA].sort());
    });

    it("declares the groups of every component whose keys come from the data, and of no other", () => {
        expect(Object.keys(resourceBindingGroupsFromData)).toEqual(["custom-grouplist-utfall-svar-type"]);
        expect(Object.keys(resourceBindingGroupsFromData).every((tagName) => tagName in componentMap)).toBe(true);
    });
});
