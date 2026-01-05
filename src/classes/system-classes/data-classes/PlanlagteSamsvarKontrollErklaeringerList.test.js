import PlanlagteSamsvarKontrollErklaeringerList from "./PlanlagteSamsvarKontrollErklaeringerList";
import { getTextResourceFromResourceBinding, hasValue } from "../../../functions/helpers.js";

// Mock the helper functions
jest.mock("../../../functions/helpers.js", () => ({
    getTextResourceFromResourceBinding: jest.fn((resource) => (resource === undefined ? undefined : resource || "mocked-resource")),
    hasValue: jest.fn((val) => val !== undefined && val !== null && val !== "")
}));

describe("PlanlagteSamsvarKontrollErklaeringerList", () => {
    const resourceBindings = {
        samsvarKontrollPlanlagtVedRammetillatelse: { title: "rammetillatelse-title" },
        samsvarKontrollPlanlagtVedIgangsettingstillatelse: { title: "igangsettingstillatelse-title" },
        samsvarKontrollPlanlagtVedMidlertidigBrukstillatelse: { title: "midlertidig-brukstillatelse-title" },
        samsvarKontrollPlanlagtVedFerdigattest: { title: "ferdigattest-title" },
        planlagteSamsvarKontrollErklaeringer: {
            emptyFieldText: "empty-field",
            emptyFieldTextAvsluttet: "empty-field-avsluttet"
        }
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("returns correct item for Rammetillatelse", () => {
        const props = {
            samsvarKontrollPlanlagtVedRammetillatelse: true,
            samsvarKontrollForeliggerVedRammetillatelse: "2024-06-01",
            ansvarsomraadeStatus: { kodeverdi: "aktiv" }
        };
        const list = new PlanlagteSamsvarKontrollErklaeringerList(props, resourceBindings);
        expect(list.resourceValues.data).toHaveLength(1);
        expect(list.resourceValues.data[0].title.data).toBe("rammetillatelse-title");
        expect(list.resourceValues.data[0].signingDate).toEqual({ data: "2024-06-01", format: "date" });
        expect(getTextResourceFromResourceBinding).toHaveBeenCalledWith("rammetillatelse-title");
        expect(hasValue).toHaveBeenCalledWith("2024-06-01");
    });

    it("returns correct item for Igangsettingstillatelse", () => {
        const props = {
            samsvarKontrollPlanlagtVedIgangsettingstillatelse: true,
            samsvarKontrollForeliggerVedIgangsettingstillatelse: "2024-06-02",
            ansvarsomraadeStatus: { kodeverdi: "aktiv" }
        };
        const list = new PlanlagteSamsvarKontrollErklaeringerList(props, resourceBindings);
        expect(list.resourceValues.data).toHaveLength(1);
        expect(list.resourceValues.data[0].title.data).toBe("igangsettingstillatelse-title");
        expect(list.resourceValues.data[0].signingDate).toEqual({ data: "2024-06-02", format: "date" });
        expect(getTextResourceFromResourceBinding).toHaveBeenCalledWith("igangsettingstillatelse-title");
        expect(hasValue).toHaveBeenCalledWith("2024-06-02");
    });

    it("returns correct item for Midlertidig Brukstillatelse", () => {
        const props = {
            samsvarKontrollPlanlagtVedMidlertidigBrukstillatelse: true,
            samsvarKontrollForeliggerVedMidlertidigBrukstillatelse: "2024-06-03",
            ansvarsomraadeStatus: { kodeverdi: "aktiv" }
        };
        const list = new PlanlagteSamsvarKontrollErklaeringerList(props, resourceBindings);
        expect(list.resourceValues.data).toHaveLength(1);
        expect(list.resourceValues.data[0].title.data).toBe("midlertidig-brukstillatelse-title");
        expect(list.resourceValues.data[0].signingDate).toEqual({ data: "2024-06-03", format: "date" });
        expect(getTextResourceFromResourceBinding).toHaveBeenCalledWith("midlertidig-brukstillatelse-title");
        expect(hasValue).toHaveBeenCalledWith("2024-06-03");
    });

    it("returns correct item for Ferdigattest", () => {
        const props = {
            samsvarKontrollPlanlagtVedFerdigattest: true,
            samsvarKontrollForeliggerVedFerdigattest: "2024-06-04",
            ansvarsomraadeStatus: { kodeverdi: "aktiv" }
        };
        const list = new PlanlagteSamsvarKontrollErklaeringerList(props, resourceBindings);
        expect(list.resourceValues.data).toHaveLength(1);
        expect(list.resourceValues.data[0].title.data).toBe("ferdigattest-title");
        expect(list.resourceValues.data[0].signingDate).toEqual({ data: "2024-06-04", format: "date" });
        expect(getTextResourceFromResourceBinding).toHaveBeenCalledWith("ferdigattest-title");
        expect(hasValue).toHaveBeenCalledWith("2024-06-04");
    });

    it("returns multiple items when multiple props are true", () => {
        const props = {
            samsvarKontrollPlanlagtVedRammetillatelse: true,
            samsvarKontrollForeliggerVedRammetillatelse: "2024-06-01",
            samsvarKontrollPlanlagtVedIgangsettingstillatelse: true,
            samsvarKontrollForeliggerVedIgangsettingstillatelse: "2024-06-02",
            ansvarsomraadeStatus: { kodeverdi: "aktiv" }
        };
        const list = new PlanlagteSamsvarKontrollErklaeringerList(props, resourceBindings);
        expect(list.resourceValues.data).toHaveLength(2);
        expect(list.resourceValues.data[0].title.data).toBe("rammetillatelse-title");
        expect(list.resourceValues.data[1].title.data).toBe("igangsettingstillatelse-title");
    });

    it('handles missing signing date with status "aktiv" (not avsluttet)', () => {
        hasValue.mockReturnValue(false);
        const props = {
            samsvarKontrollPlanlagtVedRammetillatelse: true,
            samsvarKontrollForeliggerVedRammetillatelse: undefined,
            ansvarsomraadeStatus: { kodeverdi: "aktiv" }
        };
        const list = new PlanlagteSamsvarKontrollErklaeringerList(props, resourceBindings);
        expect(list.resourceValues.data[0].signingDate.data).toBe("empty-field");
        expect(getTextResourceFromResourceBinding).toHaveBeenCalledWith("empty-field");
    });

    it('handles missing signing date with status "avsluttet"', () => {
        hasValue.mockReturnValue(false);
        const props = {
            samsvarKontrollPlanlagtVedRammetillatelse: true,
            samsvarKontrollForeliggerVedRammetillatelse: undefined,
            ansvarsomraadeStatus: { kodeverdi: "avsluttet" }
        };
        const list = new PlanlagteSamsvarKontrollErklaeringerList(props, resourceBindings);
        expect(list.resourceValues.data[0].signingDate.data).toBe("empty-field-avsluttet");
        expect(getTextResourceFromResourceBinding).toHaveBeenCalledWith("empty-field-avsluttet");
    });

    it("handles missing resourceBindings gracefully", () => {
        hasValue.mockReturnValue(false);
        const props = {
            samsvarKontrollPlanlagtVedRammetillatelse: true,
            samsvarKontrollForeliggerVedRammetillatelse: undefined,
            ansvarsomraadeStatus: { kodeverdi: "aktiv" }
        };
        const list = new PlanlagteSamsvarKontrollErklaeringerList(props, undefined);
        expect(list.resourceValues.data[0].title.data).toBe(undefined);
        expect(list.resourceValues.data[0].signingDate.data).toBe(undefined);
    });

    it("returns empty array if no props are true", () => {
        const props = {};
        const list = new PlanlagteSamsvarKontrollErklaeringerList(props, resourceBindings);
        expect(list.resourceValues.data).toEqual([]);
    });
});
