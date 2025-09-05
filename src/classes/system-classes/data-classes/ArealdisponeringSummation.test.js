import ArealdisponeringSummation from "./ArealdisponeringSummation";
import { hasValue } from "../../../functions/helpers.js";

// Mock hasValue to control its behavior in tests
jest.mock("../../../functions/helpers.js", () => ({
    hasValue: jest.fn()
}));

describe("ArealdisponeringSummation", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    const arealdisponering = {
        beregnetMaksByggeareal: 100,
        arealBebyggelseEksisterende: 50,
        arealBebyggelseSomSkalRives: 10,
        arealBebyggelseNytt: 40,
        parkeringsarealTerreng: 20,
        arealSumByggesak: 220,
        tomtearealByggeomraade: 300,
        tomtearealSomTrekkesFra: 30,
        tomtearealBeregnet: 270
    };

    const resourceBindings = {
        tomtearealet: { title: "Tomtearealet" },
        bebyggelsen: { title: "Bebyggelsen" },
        beregnetMaksByggeareal: { label: "Maks byggeareal" },
        arealBebyggelseEksisterende: { label: "Eksisterende bebyggelse" },
        arealBebyggelseSomSkalRives: { label: "Bebyggelse som skal rives" },
        arealBebyggelseNytt: { label: "Ny bebyggelse" },
        parkeringsarealTerreng: { label: "Parkeringsareal terreng" },
        arealSumByggesak: { label: "Sum byggesak" },
        tomtearealByggeomraade: { label: "Byggeområde" },
        tomtearealSomTrekkesFra: { label: "Trekkes fra" },
        tomtearealBeregnet: { label: "Beregnet" }
    };

    it("should construct tomtearealet and bebyggelsen with correct data when all values are present", () => {
        hasValue.mockImplementation((v) => v !== undefined && v !== null);

        const summation = new ArealdisponeringSummation(arealdisponering, resourceBindings);

        expect(summation.tomtearealet.resourceBindings.title).toBe("Tomtearealet");
        expect(summation.tomtearealet.resourceValues.data).toEqual([
            {
                resourceValues: { data: 300 },
                resourceBindings: { label: "Byggeområde" }
            },
            {
                resourceValues: { data: 30 },
                resourceBindings: { label: "Trekkes fra" }
            },
            {
                resourceValues: { data: 270 },
                resourceBindings: { label: "Beregnet" }
            }
        ]);

        expect(summation.bebyggelsen.resourceBindings.title).toBe("Bebyggelsen");
        expect(summation.bebyggelsen.resourceValues.data).toEqual([
            {
                resourceValues: { data: 100 },
                resourceBindings: { label: "Maks byggeareal" }
            },
            {
                resourceValues: { data: 50 },
                resourceBindings: { label: "Eksisterende bebyggelse" }
            },
            {
                resourceValues: { data: 10 },
                resourceBindings: { label: "Bebyggelse som skal rives" }
            },
            {
                resourceValues: { data: 40 },
                resourceBindings: { label: "Ny bebyggelse" }
            },
            {
                resourceValues: { data: 20 },
                resourceBindings: { label: "Parkeringsareal terreng" }
            },
            {
                resourceValues: { data: 220 },
                resourceBindings: { label: "Sum byggesak" }
            }
        ]);
    });

    it("should filter out null values when hasValue returns false", () => {
        // Only tomtearealBeregnet and arealBebyggelseNytt are present
        hasValue.mockImplementation((v) => v === arealdisponering.tomtearealBeregnet || v === arealdisponering.arealBebyggelseNytt);

        const summation = new ArealdisponeringSummation(arealdisponering, resourceBindings);

        expect(summation.tomtearealet.resourceValues.data).toEqual([
            {
                resourceValues: { data: 270 },
                resourceBindings: { label: "Beregnet" }
            }
        ]);
        expect(summation.bebyggelsen.resourceValues.data).toEqual([
            {
                resourceValues: { data: 40 },
                resourceBindings: { label: "Ny bebyggelse" }
            }
        ]);
    });

    it("should handle missing resourceBindings gracefully", () => {
        hasValue.mockImplementation((v) => v !== undefined && v !== null);

        const partialResourceBindings = {
            tomtearealet: {},
            bebyggelsen: {}
        };

        const summation = new ArealdisponeringSummation(arealdisponering, partialResourceBindings);

        expect(summation.tomtearealet.resourceBindings.title).toBeUndefined();
        expect(summation.bebyggelsen.resourceBindings.title).toBeUndefined();

        // resourceBindings for items should be undefined
        expect(summation.tomtearealet.resourceValues.data[0].resourceBindings).toBeUndefined();
        expect(summation.bebyggelsen.resourceValues.data[0].resourceBindings).toBeUndefined();
    });

    it("should return empty arrays if all values are missing", () => {
        hasValue.mockReturnValue(false);

        const summation = new ArealdisponeringSummation({}, resourceBindings);

        expect(summation.tomtearealet.resourceValues.data).toEqual([]);
        expect(summation.bebyggelsen.resourceValues.data).toEqual([]);
    });

    it("should not throw if arealdisponering or resourceBindings are undefined", () => {
        hasValue.mockReturnValue(false);

        expect(() => new ArealdisponeringSummation(undefined, undefined)).not.toThrow();
        expect(() => new ArealdisponeringSummation(null, null)).not.toThrow();
    });
});
