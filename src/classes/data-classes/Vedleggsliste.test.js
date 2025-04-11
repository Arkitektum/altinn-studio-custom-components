import Vedleggsliste from "./Vedleggsliste";
import Vedlegg from "./Vedlegg";

// Import the class to test

// Mock the Vedlegg class
jest.mock("./Vedlegg");

describe("Vedleggsliste", () => {
    beforeEach(() => {
        // Reset the mock before each test
        Vedlegg.mockClear();
    });

    it("should create an instance of Vedleggsliste with an empty vedlegg array when no props are provided", () => {
        const vedleggsliste = new Vedleggsliste({});
        expect(vedleggsliste.vedlegg).toBeUndefined();
    });

    it("should create an instance of Vedleggsliste with vedlegg items mapped to Vedlegg instances", () => {
        const vedleggData = [{ id: 1 }, { id: 2 }];
        const vedleggsliste = new Vedleggsliste({ vedlegg: vedleggData });

        expect(Vedlegg).toHaveBeenCalledTimes(2);
        expect(Vedlegg).toHaveBeenCalledWith({ id: 1 });
        expect(Vedlegg).toHaveBeenCalledWith({ id: 2 });
        expect(vedleggsliste.vedlegg).toHaveLength(2);
    });

    it("should handle undefined vedlegg gracefully", () => {
        const vedleggsliste = new Vedleggsliste({ vedlegg: undefined });
        expect(vedleggsliste.vedlegg).toBeUndefined();
    });

    it("should handle null vedlegg gracefully", () => {
        const vedleggsliste = new Vedleggsliste({ vedlegg: null });
        expect(vedleggsliste.vedlegg).toBeUndefined();
    });
});
