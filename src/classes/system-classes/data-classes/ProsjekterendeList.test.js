import ProsjekterendeList from "./ProsjekterendeList";
import { getTextResourceFromResourceBinding } from "../../../functions/helpers.js";

// Mock the getTextResourceFromResourceBinding function
jest.mock("../../../functions/helpers.js", () => ({
    getTextResourceFromResourceBinding: jest.fn((title) => `text-for-${title}`)
}));

describe("ProsjekterendeList", () => {
    const resourceBindings = {
        Rammetillatelse: { title: "ramme" },
        Igangsettingstillatelse: { title: "igang" },
        MidlertidigBrukstillatelse: { title: "midlertidig" },
        Ferdigattest: { title: "ferdig" }
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should return all text resources when all permissions are true", () => {
        const prosjekterende = {
            erOkForRammetillatelse: true,
            erOkForIgangsettingstillatelse: true,
            erOkForMidlertidigBrukstillatelse: true,
            erOkForFerdigattest: true
        };

        const list = new ProsjekterendeList(prosjekterende, resourceBindings);
        expect(list.resourceValues.data).toEqual(["text-for-ramme", "text-for-igang", "text-for-midlertidig", "text-for-ferdig"]);
        expect(getTextResourceFromResourceBinding).toHaveBeenCalledTimes(4);
    });

    it("should return only the text resources for true permissions", () => {
        const prosjekterende = {
            erOkForRammetillatelse: false,
            erOkForIgangsettingstillatelse: true,
            erOkForMidlertidigBrukstillatelse: false,
            erOkForFerdigattest: true
        };

        const list = new ProsjekterendeList(prosjekterende, resourceBindings);
        expect(list.resourceValues.data).toEqual(["text-for-igang", "text-for-ferdig"]);
        expect(getTextResourceFromResourceBinding).toHaveBeenCalledTimes(2);
        expect(getTextResourceFromResourceBinding).toHaveBeenCalledWith("igang");
        expect(getTextResourceFromResourceBinding).toHaveBeenCalledWith("ferdig");
    });

    it("should return an empty array if all permissions are false", () => {
        const prosjekterende = {
            erOkForRammetillatelse: false,
            erOkForIgangsettingstillatelse: false,
            erOkForMidlertidigBrukstillatelse: false,
            erOkForFerdigattest: false
        };

        const list = new ProsjekterendeList(prosjekterende, resourceBindings);
        expect(list.resourceValues.data).toEqual([]);
        expect(getTextResourceFromResourceBinding).not.toHaveBeenCalled();
    });

    it("should handle missing resourceBindings gracefully", () => {
        const prosjekterende = {
            erOkForRammetillatelse: true,
            erOkForIgangsettingstillatelse: true,
            erOkForMidlertidigBrukstillatelse: true,
            erOkForFerdigattest: true
        };

        const partialBindings = {
            Rammetillatelse: { title: "ramme" }
            // others missing
        };

        const list = new ProsjekterendeList(prosjekterende, partialBindings);
        expect(list.resourceValues.data).toEqual(["text-for-ramme", "text-for-undefined", "text-for-undefined", "text-for-undefined"]);
        expect(getTextResourceFromResourceBinding).toHaveBeenCalledTimes(4);
    });

    it("should handle undefined prosjekterende", () => {
        const list = new ProsjekterendeList(undefined, resourceBindings);
        expect(list.resourceValues.data).toEqual([]);
        expect(getTextResourceFromResourceBinding).not.toHaveBeenCalled();
    });

    it("should handle null prosjekterende", () => {
        const list = new ProsjekterendeList(null, resourceBindings);
        expect(list.resourceValues.data).toEqual([]);
        expect(getTextResourceFromResourceBinding).not.toHaveBeenCalled();
    });

    it("should handle missing resourceBindings", () => {
        const prosjekterende = {
            erOkForRammetillatelse: true
        };
        const list = new ProsjekterendeList(prosjekterende, undefined);
        expect(list.resourceValues.data).toEqual(["text-for-undefined"]);
        expect(getTextResourceFromResourceBinding).toHaveBeenCalledWith(undefined);
    });
});
