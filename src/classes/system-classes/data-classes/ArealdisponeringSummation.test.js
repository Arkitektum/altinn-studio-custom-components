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

    it("should set all fields when all values are present and hasValue returns true", () => {
        hasValue.mockReturnValue(true);

        const arealdisponering = {
            tomtearealBeregnet: 1,
            tomtearealByggeomraade: 2,
            tomtearealSomTrekkesFra: 3,
            arealBebyggelseEksisterende: 4,
            arealBebyggelseNytt: 5,
            arealBebyggelseSomSkalRives: 6,
            arealSumByggesak: 7,
            beregnetGradAvUtnytting: 8,
            beregnetMaksByggeareal: 9,
            parkeringsarealTerreng: 10
        };

        const resourceBindings = {
            tomtearealBeregnet: { title: "t1", emptyFieldText: "e1" },
            tomtearealByggeomraade: { title: "t2", emptyFieldText: "e2" },
            tomtearealSomTrekkesFra: { title: "t3", emptyFieldText: "e3" },
            arealBebyggelseEksisterende: { title: "t4", emptyFieldText: "e4" },
            arealBebyggelseNytt: { title: "t5", emptyFieldText: "e5" },
            arealBebyggelseSomSkalRives: { title: "t6", emptyFieldText: "e6" },
            arealSumByggesak: { title: "t7", emptyFieldText: "e7" },
            beregnetGradAvUtnytting: { title: "t8", emptyFieldText: "e8" },
            beregnetMaksByggeareal: { title: "t9", emptyFieldText: "e9" },
            parkeringsarealTerreng: { title: "t10", emptyFieldText: "e10" }
        };

        const instance = new ArealdisponeringSummation(arealdisponering, resourceBindings);

        expect(instance.tomtearealet.tomtearealBeregnet).toEqual({
            resourceValues: { data: 1 },
            resourceBindings: { title: "t1", emptyFieldText: "e1" }
        });
        expect(instance.tomtearealet.tomtearealByggeomraade).toEqual({
            resourceValues: { data: 2 },
            resourceBindings: { title: "t2", emptyFieldText: "e2" }
        });
        expect(instance.tomtearealet.tomtearealSomTrekkesFra).toEqual({
            resourceValues: { data: 3 },
            resourceBindings: { title: "t3", emptyFieldText: "e3" }
        });

        expect(instance.bebyggelsen.arealBebyggelseEksisterende).toEqual({
            resourceValues: { data: 4 },
            resourceBindings: { title: "t4", emptyFieldText: "e4" }
        });
        expect(instance.bebyggelsen.arealBebyggelseNytt).toEqual({
            resourceValues: { data: 5 },
            resourceBindings: { title: "t5", emptyFieldText: "e5" }
        });
        expect(instance.bebyggelsen.arealBebyggelseSomSkalRives).toEqual({
            resourceValues: { data: 6 },
            resourceBindings: { title: "t6", emptyFieldText: "e6" }
        });
        expect(instance.bebyggelsen.arealSumByggesak).toEqual({
            resourceValues: { data: 7 },
            resourceBindings: { title: "t7", emptyFieldText: "e7" }
        });
        expect(instance.bebyggelsen.beregnetGradAvUtnytting).toEqual({
            resourceValues: { data: 8 },
            resourceBindings: { title: "t8", emptyFieldText: "e8" }
        });
        expect(instance.bebyggelsen.beregnetMaksByggeareal).toEqual({
            resourceValues: { data: 9 },
            resourceBindings: { title: "t9", emptyFieldText: "e9" }
        });
        expect(instance.bebyggelsen.parkeringsarealTerreng).toEqual({
            resourceValues: { data: 10 },
            resourceBindings: { title: "t10", emptyFieldText: "e10" }
        });
    });

    it("should set fields to undefined when hasValue returns false", () => {
        hasValue.mockReturnValue(false);

        const arealdisponering = {
            tomtearealBeregnet: null,
            tomtearealByggeomraade: null,
            tomtearealSomTrekkesFra: null,
            arealBebyggelseEksisterende: null,
            arealBebyggelseNytt: null,
            arealBebyggelseSomSkalRives: null,
            arealSumByggesak: null,
            beregnetGradAvUtnytting: null,
            beregnetMaksByggeareal: null,
            parkeringsarealTerreng: null
        };

        const resourceBindings = {};

        const instance = new ArealdisponeringSummation(arealdisponering, resourceBindings);

        expect(instance.tomtearealet.tomtearealBeregnet).toBeUndefined();
        expect(instance.tomtearealet.tomtearealByggeomraade).toBeUndefined();
        expect(instance.tomtearealet.tomtearealSomTrekkesFra).toBeUndefined();

        expect(instance.bebyggelsen.arealBebyggelseEksisterende).toBeUndefined();
        expect(instance.bebyggelsen.arealBebyggelseNytt).toBeUndefined();
        expect(instance.bebyggelsen.arealBebyggelseSomSkalRives).toBeUndefined();
        expect(instance.bebyggelsen.arealSumByggesak).toBeUndefined();
        expect(instance.bebyggelsen.beregnetGradAvUtnytting).toBeUndefined();
        expect(instance.bebyggelsen.beregnetMaksByggeareal).toBeUndefined();
        expect(instance.bebyggelsen.parkeringsarealTerreng).toBeUndefined();
    });

    it("should only set fields for which hasValue returns true", () => {
        // Alternate true/false for each call
        let call = 0;
        hasValue.mockImplementation(() => call++ % 2 === 0);

        const arealdisponering = {
            tomtearealBeregnet: 1,
            tomtearealByggeomraade: 2,
            tomtearealSomTrekkesFra: 3,
            arealBebyggelseEksisterende: 4,
            arealBebyggelseNytt: 5,
            arealBebyggelseSomSkalRives: 6,
            arealSumByggesak: 7,
            beregnetGradAvUtnytting: 8,
            beregnetMaksByggeareal: 9,
            parkeringsarealTerreng: 10
        };

        const resourceBindings = {
            tomtearealBeregnet: { title: "t1", emptyFieldText: "e1" },
            tomtearealByggeomraade: { title: "t2", emptyFieldText: "e2" },
            tomtearealSomTrekkesFra: { title: "t3", emptyFieldText: "e3" },
            arealBebyggelseEksisterende: { title: "t4", emptyFieldText: "e4" },
            arealBebyggelseNytt: { title: "t5", emptyFieldText: "e5" },
            arealBebyggelseSomSkalRives: { title: "t6", emptyFieldText: "e6" },
            arealSumByggesak: { title: "t7", emptyFieldText: "e7" },
            beregnetGradAvUtnytting: { title: "t8", emptyFieldText: "e8" },
            beregnetMaksByggeareal: { title: "t9", emptyFieldText: "e9" },
            parkeringsarealTerreng: { title: "t10", emptyFieldText: "e10" }
        };

        const instance = new ArealdisponeringSummation(arealdisponering, resourceBindings);

        // First call true, second false, etc.
        expect(instance.tomtearealet.tomtearealBeregnet).toEqual({
            resourceValues: { data: 1 },
            resourceBindings: { title: "t1", emptyFieldText: "e1" }
        });
        expect(instance.tomtearealet.tomtearealByggeomraade).toBeUndefined();
        expect(instance.tomtearealet.tomtearealSomTrekkesFra).toEqual({
            resourceValues: { data: 3 },
            resourceBindings: { title: "t3", emptyFieldText: "e3" }
        });

        expect(instance.bebyggelsen.arealBebyggelseEksisterende).toBeUndefined();
        expect(instance.bebyggelsen.arealBebyggelseNytt).toEqual({
            resourceValues: { data: 5 },
            resourceBindings: { title: "t5", emptyFieldText: "e5" }
        });
        expect(instance.bebyggelsen.arealBebyggelseSomSkalRives).toBeUndefined();
        expect(instance.bebyggelsen.arealSumByggesak).toEqual({
            resourceValues: { data: 7 },
            resourceBindings: { title: "t7", emptyFieldText: "e7" }
        });
        expect(instance.bebyggelsen.beregnetGradAvUtnytting).toBeUndefined();
        expect(instance.bebyggelsen.beregnetMaksByggeareal).toEqual({
            resourceValues: { data: 9 },
            resourceBindings: { title: "t9", emptyFieldText: "e9" }
        });
        expect(instance.bebyggelsen.parkeringsarealTerreng).toBeUndefined();
    });

    it("should handle missing resourceBindings gracefully", () => {
        hasValue.mockReturnValue(true);

        const arealdisponering = {
            tomtearealBeregnet: 1
        };

        const instance = new ArealdisponeringSummation(arealdisponering, undefined);

        expect(instance.tomtearealet.tomtearealBeregnet).toEqual({
            resourceValues: { data: 1 },
            resourceBindings: {
                title: undefined,
                emptyFieldText: undefined
            }
        });
    });

    it("should handle missing arealdisponering gracefully", () => {
        hasValue.mockReturnValue(false);

        const instance = new ArealdisponeringSummation(undefined, undefined);

        expect(instance.tomtearealet.tomtearealBeregnet).toBeUndefined();
        expect(instance.bebyggelsen.arealBebyggelseEksisterende).toBeUndefined();
    });
});
