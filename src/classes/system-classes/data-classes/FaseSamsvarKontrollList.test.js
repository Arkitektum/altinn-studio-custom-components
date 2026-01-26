import FaseSamsvarKontrollList from "./FaseSamsvarKontrollList";
const { getTextResourceFromResourceBinding } = require("../../../functions/helpers.js");

// Mock the getTextResourceFromResourceBinding function
jest.mock("../../../functions/helpers.js", () => ({
    getTextResourceFromResourceBinding: jest.fn((title) => `text-for-${title}`)
}));

describe("FaseSamsvarKontrollList", () => {
    const resourceBindings = {
        harSamsvarKontrollVedRammetillatelse: { title: "rammetillatelse" },
        harSamsvarKontrollVedIgangsettingstillatelse: { title: "igangsettingstillatelse" },
        harSamsvarKontrollVedMidlertidigBrukstillatelse: { title: "midlertidigBrukstillatelse" },
        harSamsvarKontrollVedFerdigattest: { title: "ferdigattest" }
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("returns all text resources when all flags are true", () => {
        const faseSamsvarKontroll = {
            harSamsvarKontrollVedRammetillatelse: true,
            harSamsvarKontrollVedIgangsettingstillatelse: true,
            harSamsvarKontrollVedMidlertidigBrukstillatelse: true,
            harSamsvarKontrollVedFerdigattest: true
        };

        const list = new FaseSamsvarKontrollList(faseSamsvarKontroll, resourceBindings);
        expect(list.resourceValues.data).toEqual([
            "text-for-rammetillatelse",
            "text-for-igangsettingstillatelse",
            "text-for-midlertidigBrukstillatelse",
            "text-for-ferdigattest"
        ]);
        expect(getTextResourceFromResourceBinding).toHaveBeenCalledTimes(4);
    });

    it("returns only selected text resources when some flags are true", () => {
        const faseSamsvarKontroll = {
            harSamsvarKontrollVedRammetillatelse: false,
            harSamsvarKontrollVedIgangsettingstillatelse: true,
            harSamsvarKontrollVedMidlertidigBrukstillatelse: false,
            harSamsvarKontrollVedFerdigattest: true
        };

        const list = new FaseSamsvarKontrollList(faseSamsvarKontroll, resourceBindings);
        expect(list.resourceValues.data).toEqual(["text-for-igangsettingstillatelse", "text-for-ferdigattest"]);
        expect(getTextResourceFromResourceBinding).toHaveBeenCalledTimes(2);
    });

    it("returns an empty array when all flags are false", () => {
        const faseSamsvarKontroll = {
            harSamsvarKontrollVedRammetillatelse: false,
            harSamsvarKontrollVedIgangsettingstillatelse: false,
            harSamsvarKontrollVedMidlertidigBrukstillatelse: false,
            harSamsvarKontrollVedFerdigattest: false
        };

        const list = new FaseSamsvarKontrollList(faseSamsvarKontroll, resourceBindings);
        expect(list.resourceValues.data).toEqual([]);
        expect(getTextResourceFromResourceBinding).not.toHaveBeenCalled();
    });

    it("handles missing faseSamsvarKontroll properties gracefully", () => {
        const faseSamsvarKontroll = {};
        const list = new FaseSamsvarKontrollList(faseSamsvarKontroll, resourceBindings);
        expect(list.resourceValues.data).toEqual([]);
        expect(getTextResourceFromResourceBinding).not.toHaveBeenCalled();
    });

    it("handles missing resourceBindings properties gracefully", () => {
        const faseSamsvarKontroll = {
            harSamsvarKontrollVedRammetillatelse: true,
            harSamsvarKontrollVedIgangsettingstillatelse: false,
            harSamsvarKontrollVedMidlertidigBrukstillatelse: true,
            harSamsvarKontrollVedFerdigattest: false
        };
        const partialResourceBindings = {
            harSamsvarKontrollVedRammetillatelse: { title: "rammetillatelse" }
            // missing others
        };
        const list = new FaseSamsvarKontrollList(faseSamsvarKontroll, partialResourceBindings);
        expect(list.resourceValues.data).toEqual(["text-for-rammetillatelse", "text-for-undefined"]);
        expect(getTextResourceFromResourceBinding).toHaveBeenCalledTimes(2);
    });
});
