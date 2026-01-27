import ProsjekterendeList from "./ProsjekterendeList";
import { getTextResourceFromResourceBinding } from "../../../functions/helpers";

jest.mock("../../../functions/helpers", () => ({
    getTextResourceFromResourceBinding: jest.fn()
}));

describe("ProsjekterendeList", () => {
    const mockResources = {
        Rammetillatelse: { title: "rammetillatelse_title" },
        Igangsettingstillatelse: { title: "igangsettingstillatelse_title" },
        MidlertidigBrukstillatelse: { title: "midlertidigbrukstillatelse_title" },
        Ferdigattest: { title: "ferdigattest_title" }
    };

    beforeEach(() => {
        jest.clearAllMocks();
        getTextResourceFromResourceBinding.mockImplementation((title) => `text_for_${title}`);
    });

    it("returns all text resources when all approvals are true", () => {
        const prosjekterende = {
            erOkForRammetillatelse: true,
            erOkForIgangsettingstillatelse: true,
            erOkForMidlertidigBrukstillatelse: true,
            erOkForFerdigattest: true
        };

        const list = new ProsjekterendeList(prosjekterende, mockResources);

        expect(list.resourceValues.data).toEqual([
            "text_for_rammetillatelse_title",
            "text_for_igangsettingstillatelse_title",
            "text_for_midlertidigbrukstillatelse_title",
            "text_for_ferdigattest_title"
        ]);
        expect(getTextResourceFromResourceBinding).toHaveBeenCalledTimes(4);
    });

    it("returns only approved text resources", () => {
        const prosjekterende = {
            erOkForRammetillatelse: false,
            erOkForIgangsettingstillatelse: true,
            erOkForMidlertidigBrukstillatelse: false,
            erOkForFerdigattest: true
        };

        const list = new ProsjekterendeList(prosjekterende, mockResources);

        expect(list.resourceValues.data).toEqual(["text_for_igangsettingstillatelse_title", "text_for_ferdigattest_title"]);
        expect(getTextResourceFromResourceBinding).toHaveBeenCalledTimes(2);
    });

    it("returns empty array if no approvals are true", () => {
        const prosjekterende = {
            erOkForRammetillatelse: false,
            erOkForIgangsettingstillatelse: false,
            erOkForMidlertidigBrukstillatelse: false,
            erOkForFerdigattest: false
        };

        const list = new ProsjekterendeList(prosjekterende, mockResources);

        expect(list.resourceValues.data).toEqual([]);
        expect(getTextResourceFromResourceBinding).not.toHaveBeenCalled();
    });

    it("handles missing prosjekterende object gracefully", () => {
        const list = new ProsjekterendeList(undefined, mockResources);
        expect(list.resourceValues.data).toEqual([]);
        expect(getTextResourceFromResourceBinding).not.toHaveBeenCalled();
    });

    it("handles missing resourceBindings gracefully", () => {
        const prosjekterende = {
            erOkForRammetillatelse: true,
            erOkForIgangsettingstillatelse: true,
            erOkForMidlertidigBrukstillatelse: true,
            erOkForFerdigattest: true
        };

        const list = new ProsjekterendeList(prosjekterende, undefined);

        expect(list.resourceValues.data).toEqual(["text_for_undefined", "text_for_undefined", "text_for_undefined", "text_for_undefined"]);
        expect(getTextResourceFromResourceBinding).toHaveBeenCalledTimes(4);
    });

    it("filters out nulls if some resourceBindings are missing", () => {
        const prosjekterende = {
            erOkForRammetillatelse: true,
            erOkForIgangsettingstillatelse: true,
            erOkForMidlertidigBrukstillatelse: false,
            erOkForFerdigattest: true
        };
        const partialResources = {
            Rammetillatelse: { title: "rammetillatelse_title" },
            // Igangsettingstillatelse missing
            Ferdigattest: { title: "ferdigattest_title" }
        };

        const list = new ProsjekterendeList(prosjekterende, partialResources);

        expect(list.resourceValues.data).toEqual(["text_for_rammetillatelse_title", "text_for_undefined", "text_for_ferdigattest_title"]);
        expect(getTextResourceFromResourceBinding).toHaveBeenCalledTimes(3);
    });
});
