import ArealdisponeringSummation from "./ArealdisponeringSummation";

// Mock the hasValue function
jest.mock("../../../functions/helpers.js", () => ({
    hasValue: (val) => val !== undefined && val !== null && val !== ""
}));

describe("ArealdisponeringSummation", () => {
    const arealdisponering = {
        beregnetMaksByggeareal: 100,
        arealBebyggelseEksisterende: 50,
        arealBebyggelseSomSkalRives: 10,
        arealBebyggelseNytt: 40,
        parkeringsarealTerreng: 20,
        arealSumByggesak: 220,
        tomtearealByggeomraade: 300,
        tomtearealSomLeggesTil: 15,
        tomtearealSomTrekkesFra: 30,
        tomtearealBeregnet: 270
    };

    const resourceBindings = {
        tomtearealet: { title: "Tomtearealet" },
        bebyggelsen: { title: "Bebyggelsen" },
        beregnetMaksByggeareal: { label: "Maks byggeareal" },
        arealBebyggelseEksisterende: { label: "Eksisterende bebyggelse" },
        arealBebyggelseSomSkalRives: { label: "Skal rives" },
        arealBebyggelseNytt: { label: "Nytt" },
        parkeringsarealTerreng: { label: "Parkeringsareal" },
        arealSumByggesak: { label: "Sum byggesak" },
        tomtearealByggeomraade: { label: "Byggeområde" },
        tomtearealSomLeggesTil: { label: "Legges til" },
        tomtearealSomTrekkesFra: { label: "Trekkes fra" },
        tomtearealBeregnet: { label: "Beregnet" }
    };

    it("should construct tomtearealet and bebyggelsen with correct structure and values", () => {
        const summation = new ArealdisponeringSummation(arealdisponering, resourceBindings);

        expect(summation.tomtearealet.resourceBindings.title).toBe("Tomtearealet");
        expect(summation.bebyggelsen.resourceBindings.title).toBe("Bebyggelsen");

        // Tomtearealet items
        expect(summation.tomtearealet.resourceValues.data).toEqual([
            {
                resourceValues: { data: 300, isTotal: false },
                resourceBindings: { label: "Byggeområde" }
            },
            {
                resourceValues: { data: 15, isTotal: false },
                resourceBindings: { label: "Legges til" }
            },
            {
                resourceValues: { data: 30, isTotal: false },
                resourceBindings: { label: "Trekkes fra" }
            },
            {
                resourceValues: { data: 270, isTotal: true },
                resourceBindings: { label: "Beregnet" }
            }
        ]);

        // Bebyggelsen items
        expect(summation.bebyggelsen.resourceValues.data).toEqual([
            {
                resourceValues: { data: 100, isTotal: false },
                resourceBindings: { label: "Maks byggeareal" }
            },
            {
                resourceValues: { data: 50, isTotal: false },
                resourceBindings: { label: "Eksisterende bebyggelse" }
            },
            {
                resourceValues: { data: 10, isTotal: false },
                resourceBindings: { label: "Skal rives" }
            },
            {
                resourceValues: { data: 40, isTotal: false },
                resourceBindings: { label: "Nytt" }
            },
            {
                resourceValues: { data: 20, isTotal: false },
                resourceBindings: { label: "Parkeringsareal" }
            },
            {
                resourceValues: { data: 220, isTotal: true },
                resourceBindings: { label: "Sum byggesak" }
            }
        ]);
    });

    it("should filter out null/undefined/empty values", () => {
        const partialArealdisponering = {
            beregnetMaksByggeareal: undefined,
            arealBebyggelseEksisterende: null,
            arealBebyggelseSomSkalRives: "",
            arealBebyggelseNytt: 40,
            arealSumByggesak: 220
        };
        const summation = new ArealdisponeringSummation(partialArealdisponering, resourceBindings);

        expect(summation.bebyggelsen.resourceValues.data).toEqual([
            {
                resourceValues: { data: 40, isTotal: false },
                resourceBindings: { label: "Nytt" }
            },
            {
                resourceValues: { data: 220, isTotal: true },
                resourceBindings: { label: "Sum byggesak" }
            }
        ]);
    });

    it("should handle missing resourceBindings gracefully", () => {
        const summation = new ArealdisponeringSummation(arealdisponering, {});
        expect(summation.tomtearealet.resourceBindings.title).toBeUndefined();
        expect(summation.bebyggelsen.resourceBindings.title).toBeUndefined();
        // ResourceBindings for items should be undefined
        summation.tomtearealet.resourceValues.data.forEach((item) => {
            expect(item.resourceBindings).toBeUndefined();
        });
        summation.bebyggelsen.resourceValues.data.forEach((item) => {
            expect(item.resourceBindings).toBeUndefined();
        });
    });

    it("should return empty arrays if no values are present", () => {
        const emptyArealdisponering = {};
        const summation = new ArealdisponeringSummation(emptyArealdisponering, resourceBindings);
        expect(summation.tomtearealet.resourceValues.data).toEqual([]);
        expect(summation.bebyggelsen.resourceValues.data).toEqual([]);
    });
});
