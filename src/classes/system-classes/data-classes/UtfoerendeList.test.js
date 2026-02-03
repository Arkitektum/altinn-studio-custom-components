import UtfoerendeList from "./UtfoerendeList";
import { getTextResourceFromResourceBinding } from "../../../functions/helpers";

jest.mock("../../../functions/helpers", () => ({
    getTextResourceFromResourceBinding: jest.fn()
}));

describe("UtfoerendeList", () => {
    const ferdigattestTitle = "Ferdigattest Title";
    const midlertidigTitle = "Midlertidig Brukstillatelse Title";

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("returns both items when both flags are true", () => {
        getTextResourceFromResourceBinding.mockImplementationOnce(() => midlertidigTitle).mockImplementationOnce(() => ferdigattestTitle);

        const resourceBindings = {
            midlertidigBrukstillatelse: { title: "midlertidig_key" },
            ferdigattest: { title: "ferdigattest_key" }
        };

        const list = new UtfoerendeList(true, true, resourceBindings);

        expect(getTextResourceFromResourceBinding).toHaveBeenCalledWith("midlertidig_key");
        expect(getTextResourceFromResourceBinding).toHaveBeenCalledWith("ferdigattest_key");
        expect(list.resourceValues.data).toEqual([midlertidigTitle, ferdigattestTitle]);
    });

    it("returns only Ferdigattest when only erOkForFerdigattest is true", () => {
        getTextResourceFromResourceBinding.mockImplementationOnce(() => ferdigattestTitle);

        const resourceBindings = {
            midlertidigBrukstillatelse: { title: "midlertidig_key" },
            ferdigattest: { title: "ferdigattest_key" }
        };

        const list = new UtfoerendeList(true, false, resourceBindings);

        expect(getTextResourceFromResourceBinding).toHaveBeenCalledWith("ferdigattest_key");
        expect(list.resourceValues.data).toEqual([ferdigattestTitle]);
    });

    it("returns only Midlertidig Brukstillatelse when only erOkForMidlertidigBrukstillatelse is true", () => {
        getTextResourceFromResourceBinding.mockImplementationOnce(() => midlertidigTitle);

        const resourceBindings = {
            midlertidigBrukstillatelse: { title: "midlertidig_key" },
            ferdigattest: { title: "ferdigattest_key" }
        };

        const list = new UtfoerendeList(false, true, resourceBindings);

        expect(getTextResourceFromResourceBinding).toHaveBeenCalledWith("midlertidig_key");
        expect(list.resourceValues.data).toEqual([midlertidigTitle]);
    });

    it("returns empty array when both flags are false", () => {
        const resourceBindings = {
            midlertidigBrukstillatelse: { title: "midlertidig_key" },
            ferdigattest: { title: "ferdigattest_key" }
        };

        const list = new UtfoerendeList(false, false, resourceBindings);

        expect(getTextResourceFromResourceBinding).not.toHaveBeenCalled();
        expect(list.resourceValues.data).toEqual([]);
    });

    it("handles missing resourceBindings gracefully", () => {
        getTextResourceFromResourceBinding.mockImplementation(() => undefined);

        const list = new UtfoerendeList(true, true, {});

        expect(list.resourceValues.data).toEqual([undefined, undefined]);
    });

    it("filters out null values from the result", () => {
        getTextResourceFromResourceBinding.mockImplementation(() => null);

        const list = new UtfoerendeList(true, true, {
            midlertidigBrukstillatelse: { title: "midlertidig_key" },
            ferdigattest: { title: "ferdigattest_key" }
        });

        expect(list.resourceValues.data).toEqual([]);
    });
});
