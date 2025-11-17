import PlanlagteSamsvarKontrollErklaeringerList from "./PlanlagteSamsvarKontrollErklaeringerList";
const { getTextResourceFromResourceBinding } = require("../../../functions/helpers.js");

// Mock the helper function
jest.mock("../../../functions/helpers.js", () => ({
    getTextResourceFromResourceBinding: jest.fn((resource) => resource || "mocked title")
}));

describe("PlanlagteSamsvarKontrollErklaeringerList", () => {
    const resourceBindings = {
        samsvarKontrollPlanlagtVedRammetillatelse: { title: "Rammetillatelse Title" },
        samsvarKontrollPlanlagtVedIgangsettingstillatelse: { title: "Igangsettingstillatelse Title" },
        samsvarKontrollPlanlagtVedMidlertidigBrukstillatelse: { title: "Midlertidig Brukstillatelse Title" },
        samsvarKontrollPlanlagtVedFerdigattest: { title: "Ferdigattest Title" }
    };

    it("returns empty array if no props are true", () => {
        const props = {};
        const instance = new PlanlagteSamsvarKontrollErklaeringerList(props, resourceBindings);
        expect(instance.getPlanlagteSamsvarKontrollErklaeringerList(props, resourceBindings)).toEqual([]);
    });

    it("returns correct item for Rammetillatelse", () => {
        const props = {
            samsvarKontrollPlanlagtVedRammetillatelse: true,
            samsvarKontrollForeliggerVedRammetillatelse: "2024-01-01"
        };
        const instance = new PlanlagteSamsvarKontrollErklaeringerList(props, resourceBindings);
        expect(instance.getPlanlagteSamsvarKontrollErklaeringerList(props, resourceBindings)).toEqual([
            {
                title: { data: "Rammetillatelse Title" },
                signingDate: { data: "2024-01-01", format: "date" }
            }
        ]);
    });

    it("returns correct item for Igangsettingstillatelse", () => {
        const props = {
            samsvarKontrollPlanlagtVedIgangsettingstillatelse: true,
            samsvarKontrollForeliggerVedIgangsettingstillatelse: "2024-02-02"
        };
        const instance = new PlanlagteSamsvarKontrollErklaeringerList(props, resourceBindings);
        expect(instance.getPlanlagteSamsvarKontrollErklaeringerList(props, resourceBindings)).toEqual([
            {
                title: { data: "Igangsettingstillatelse Title" },
                signingDate: { data: "2024-02-02", format: "date" }
            }
        ]);
    });

    it("returns correct item for Midlertidig Brukstillatelse", () => {
        const props = {
            samsvarKontrollPlanlagtVedMidlertidigBrukstillatelse: true,
            samsvarKontrollForeliggerVedMidlertidigBrukstillatelse: "2024-03-03"
        };
        const instance = new PlanlagteSamsvarKontrollErklaeringerList(props, resourceBindings);
        expect(instance.getPlanlagteSamsvarKontrollErklaeringerList(props, resourceBindings)).toEqual([
            {
                title: { data: "Midlertidig Brukstillatelse Title" },
                signingDate: { data: "2024-03-03", format: "date" }
            }
        ]);
    });

    it("returns correct item for Ferdigattest", () => {
        const props = {
            samsvarKontrollPlanlagtVedFerdigattest: true,
            samsvarKontrollForeliggerVedFerdigattest: "2024-04-04"
        };
        const instance = new PlanlagteSamsvarKontrollErklaeringerList(props, resourceBindings);
        expect(instance.getPlanlagteSamsvarKontrollErklaeringerList(props, resourceBindings)).toEqual([
            {
                title: { data: "Ferdigattest Title" },
                signingDate: { data: "2024-04-04", format: "date" }
            }
        ]);
    });

    it("returns multiple items when multiple props are true", () => {
        const props = {
            samsvarKontrollPlanlagtVedRammetillatelse: true,
            samsvarKontrollForeliggerVedRammetillatelse: "2024-01-01",
            samsvarKontrollPlanlagtVedFerdigattest: true,
            samsvarKontrollForeliggerVedFerdigattest: "2024-04-04"
        };
        const instance = new PlanlagteSamsvarKontrollErklaeringerList(props, resourceBindings);
        expect(instance.getPlanlagteSamsvarKontrollErklaeringerList(props, resourceBindings)).toEqual([
            {
                title: { data: "Rammetillatelse Title" },
                signingDate: { data: "2024-01-01", format: "date" }
            },
            {
                title: { data: "Ferdigattest Title" },
                signingDate: { data: "2024-04-04", format: "date" }
            }
        ]);
    });

    it("handles missing resourceBindings gracefully", () => {
        const props = {
            samsvarKontrollPlanlagtVedRammetillatelse: true,
            samsvarKontrollForeliggerVedRammetillatelse: "2024-01-01"
        };
        const instance = new PlanlagteSamsvarKontrollErklaeringerList(props, {});
        expect(instance.getPlanlagteSamsvarKontrollErklaeringerList(props, {})).toEqual([
            {
                title: { data: "mocked title" },
                signingDate: { data: "2024-01-01", format: "date" }
            }
        ]);
    });
});
