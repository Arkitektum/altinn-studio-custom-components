import ProsjekterendeList from "./ProsjekterendeList";
import { getTextResourceFromResourceBinding } from "../../../functions/helpers.js";

// Mock the getTextResourceFromResourceBinding function
jest.mock("../../../functions/helpers.js", () => ({
    getTextResourceFromResourceBinding: jest.fn((title) => `text:${title}`)
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

    it("should return correct data for PRO with all approvals true", () => {
        const prosjekterende = {
            erOkForRammetillatelse: true,
            erOkForIgangsettingstillatelse: true,
            erOkForMidlertidigBrukstillatelse: true,
            erOkForFerdigattest: true
        };
        const list = new ProsjekterendeList("PRO", prosjekterende, resourceBindings);
        expect(list.resourceValues.data).toEqual(["text:ramme", "text:igang", "text:midlertidig", "text:ferdig"]);
        expect(getTextResourceFromResourceBinding).toHaveBeenCalledTimes(4);
    });

    it("should return correct data for PRO with some approvals false", () => {
        const prosjekterende = {
            erOkForRammetillatelse: false,
            erOkForIgangsettingstillatelse: true,
            erOkForMidlertidigBrukstillatelse: false,
            erOkForFerdigattest: true
        };
        const list = new ProsjekterendeList("PRO", prosjekterende, resourceBindings);
        expect(list.resourceValues.data).toEqual(["text:igang", "text:ferdig"]);
        expect(getTextResourceFromResourceBinding).toHaveBeenCalledTimes(2);
    });

    it("should return correct data for UTF with both approvals true", () => {
        const prosjekterende = {
            erOkForMidlertidigBrukstillatelse: true,
            erOkForFerdigattest: true
        };
        const list = new ProsjekterendeList("UTF", prosjekterende, resourceBindings);
        expect(list.resourceValues.data).toEqual(["text:midlertidig", "text:ferdig"]);
        expect(getTextResourceFromResourceBinding).toHaveBeenCalledTimes(2);
    });

    it("should return correct data for UTF with only ferdigattest true", () => {
        const prosjekterende = {
            erOkForMidlertidigBrukstillatelse: false,
            erOkForFerdigattest: true
        };
        const list = new ProsjekterendeList("UTF", prosjekterende, resourceBindings);
        expect(list.resourceValues.data).toEqual(["text:ferdig"]);
        expect(getTextResourceFromResourceBinding).toHaveBeenCalledTimes(1);
    });

    it("should return empty data for unknown funksjonKodeverdi", () => {
        const prosjekterende = {
            erOkForRammetillatelse: true,
            erOkForIgangsettingstillatelse: true,
            erOkForMidlertidigBrukstillatelse: true,
            erOkForFerdigattest: true
        };
        const list = new ProsjekterendeList("UNKNOWN", prosjekterende, resourceBindings);
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
        const list = new ProsjekterendeList("PRO", prosjekterende, {});
        expect(list.resourceValues.data).toEqual(["text:undefined", "text:undefined", "text:undefined", "text:undefined"]);
        expect(getTextResourceFromResourceBinding).toHaveBeenCalledTimes(4);
    });

    it("should handle missing prosjekterende gracefully", () => {
        const list = new ProsjekterendeList("PRO", undefined, resourceBindings);
        expect(list.resourceValues.data).toEqual([]);
        expect(getTextResourceFromResourceBinding).not.toHaveBeenCalled();
    });

    it("should be case-insensitive for funksjonKodeverdi", () => {
        const prosjekterende = {
            erOkForMidlertidigBrukstillatelse: true,
            erOkForFerdigattest: false
        };
        const list = new ProsjekterendeList("utf", prosjekterende, resourceBindings);
        expect(list.resourceValues.data).toEqual(["text:midlertidig"]);
        expect(getTextResourceFromResourceBinding).toHaveBeenCalledTimes(1);
    });
});
