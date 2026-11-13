import { checkLayoutComponents, getBindingPathMessages, getComponentLabel, getResourceBindingMessages } from "./layoutChecks.ts";

describe("getComponentLabel", () => {
    it("names a component by its id", () => {
        expect(getComponentLabel({ id: "tiltakshaver", tagName: "custom-field-data" }, 2)).toBe("tiltakshaver");
    });
    it("names a component without an id by its tag name and position", () => {
        expect(getComponentLabel({ tagName: "custom-field-data" }, 2)).toBe("custom-field-data #3");
        expect(getComponentLabel({ id: "", tagName: "custom-field-data" }, 0)).toBe("custom-field-data #1");
    });
});

describe("getResourceBindingMessages", () => {
    const keys = { title: null, navn: ["emptyFieldText", "title"] };
    it("reports nothing for keys and group keys the component reads", () => {
        expect(getResourceBindingMessages({ title: "a", navn: { title: "b", emptyFieldText: "c" } }, keys, false)).toEqual([]);
    });
    it("reports a key the component never reads", () => {
        expect(getResourceBindingMessages({ title: "a", tittel: "b" }, keys, false)).toEqual(["resourceBindings.tittel is never read"]);
    });
    it("reports a key in a group that the component never reads", () => {
        expect(getResourceBindingMessages({ navn: { title: "a", tittel: "b" } }, keys, false)).toEqual([
            "resourceBindings.navn.tittel is never read"
        ]);
    });
    it("reports a group written as text", () => {
        expect(getResourceBindingMessages({ navn: "a" }, keys, false)).toEqual([
            "resourceBindings.navn should be an object with emptyFieldText, title"
        ]);
    });
    it("accepts unknown keys from a component that reads groups named after its data", () => {
        expect(getResourceBindingMessages({ mangel: { title: "a" } }, keys, true)).toEqual([]);
    });
    it("reports nothing when there are no resourceBindings", () => {
        expect(getResourceBindingMessages(undefined, keys, false)).toEqual([]);
        expect(getResourceBindingMessages("title", keys, false)).toEqual([]);
    });
});

describe("getBindingPathMessages", () => {
    const dataModels = [
        { dataType: "main", data: { soeknad: { tittel: "Søknad", tom: null } } },
        { dataType: "vedlegg", data: { navn: "Tegning" } }
    ];
    it("reports nothing for bindings with a value, null included", () => {
        expect(
            getBindingPathMessages({ simpleBinding: "soeknad.tittel", tom: "soeknad.tom", data: { dataType: "vedlegg", field: "navn" } }, dataModels)
        ).toEqual([]);
    });
    it("reports a text binding without a value in the main data model", () => {
        expect(getBindingPathMessages({ simpleBinding: "soeknad.navn" }, dataModels)).toEqual([
            'dataModelBindings.simpleBinding: no value at "soeknad.navn" in the main data model'
        ]);
    });
    it("reports an object binding without a value in its data model", () => {
        expect(getBindingPathMessages({ data: { dataType: "vedlegg", field: "tittel" } }, dataModels)).toEqual([
            'dataModelBindings.data: no value at "tittel" in the "vedlegg" data model'
        ]);
    });
    it("reports an object binding to a data type that is not loaded", () => {
        expect(getBindingPathMessages({ data: { dataType: "kart", field: "navn" } }, dataModels)).toEqual([
            'dataModelBindings.data: no data model has the data type "kart"'
        ]);
    });
    it("skips the keys it is told the component does not read", () => {
        expect(getBindingPathMessages({ simpleBinding: "soeknad.tittel", feil: "x" }, dataModels, ["feil"])).toEqual([]);
    });
    it("reports nothing when no data model is loaded", () => {
        expect(getBindingPathMessages({ simpleBinding: "soeknad.navn" }, [])).toEqual([]);
    });
});

describe("checkLayoutComponents", () => {
    const dataModels = [{ dataType: "main", data: { soeknad: { tittel: "Søknad" } } }];
    it("reports nothing for a component that matches what it reads and the data", () => {
        const components = [
            { id: "tittel", tagName: "custom-field-data", dataModelBindings: { simpleBinding: "soeknad.tittel" }, resourceBindings: { title: "a" } }
        ];
        expect(checkLayoutComponents(components, dataModels)).toEqual([]);
    });
    it("reports a tag name that is not a custom component, and nothing more about it", () => {
        expect(checkLayoutComponents([{ id: "x", tagName: "custom-feild-data", dataModelBindings: { foo: "bar" } }], dataModels)).toEqual([
            { component: "x", severity: "warning", message: "custom-feild-data is not a custom component" }
        ]);
    });
    it("reports the data model binding findings the statistics page reports", () => {
        expect(checkLayoutComponents([{ id: "a", tagName: "custom-field-data" }], [])).toEqual([
            { component: "a", severity: "warning", message: "dataModelBindings.simpleBinding or data is missing" }
        ]);
        expect(
            checkLayoutComponents([{ id: "b", tagName: "Custom-Field-Data", dataModelBindings: { simpleBinding: "x", data: "y", feil: "z" } }], [])
        ).toEqual([
            { component: "b", severity: "warning", message: "dataModelBindings.data is ignored, simpleBinding is used instead" },
            { component: "b", severity: "warning", message: "dataModelBindings.feil is never read" }
        ]);
    });
    it("reports resourceBindings the component never reads", () => {
        const components = [
            { id: "a", tagName: "custom-table-part", dataModelBindings: { data: "soeknad" }, resourceBindings: { navn: { title: "t", tittel: "u" } } }
        ];
        expect(checkLayoutComponents(components, [])).toEqual([
            { component: "a", severity: "warning", message: "resourceBindings.navn.tittel is never read" }
        ]);
    });
    it("accepts groups named after the data on the component that reads them", () => {
        const components = [
            { id: "a", tagName: "custom-grouplist-utfall-svar-type", dataModelBindings: { data: "x" }, resourceBindings: { mangel: { title: "t" } } }
        ];
        expect(checkLayoutComponents(components, [])).toEqual([]);
    });
    it("reports bindings without a value in the data models as information", () => {
        expect(checkLayoutComponents([{ tagName: "custom-field-data", dataModelBindings: { simpleBinding: "soeknad.navn" } }], dataModels)).toEqual([
            {
                component: "custom-field-data #1",
                severity: "info",
                message: 'dataModelBindings.simpleBinding: no value at "soeknad.navn" in the main data model'
            }
        ]);
    });
    it("does not look up the data of bindings the component never reads or ignores", () => {
        const components = [{ id: "a", tagName: "custom-field-data", dataModelBindings: { simpleBinding: "soeknad.tittel", data: "x", feil: "y" } }];
        expect(checkLayoutComponents(components, dataModels).map(({ message }) => message)).toEqual([
            "dataModelBindings.data is ignored, simpleBinding is used instead",
            "dataModelBindings.feil is never read"
        ]);
    });
    it("skips entries without a tag name", () => {
        expect(checkLayoutComponents([{ id: "a" }, undefined as never], dataModels)).toEqual([]);
    });
});
