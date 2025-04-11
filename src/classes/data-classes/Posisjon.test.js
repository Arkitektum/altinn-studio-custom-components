import Posisjon from "./Posisjon";
import Kode from "./Kode";

jest.mock("./Kode");

describe("Posisjon", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should create an instance of Posisjon with default values when no props are provided", () => {
        const posisjon = new Posisjon({});
        expect(posisjon.koordinatsystem).toBeUndefined();
        expect(posisjon.koordinater).toBeUndefined();
    });

    it("should create an instance of Posisjon with a Kode instance when koordinatsystem is provided", () => {
        const mockKoordinatsystem = { kode: "EPSG:4326" };
        const posisjon = new Posisjon({ koordinatsystem: mockKoordinatsystem });

        expect(Kode).toHaveBeenCalledWith(mockKoordinatsystem);
        expect(posisjon.koordinatsystem).toBeInstanceOf(Kode);
    });

    it("should create an instance of Posisjon with koordinater when provided", () => {
        const mockKoordinater = "59.911491,10.757933";
        const posisjon = new Posisjon({ koordinater: mockKoordinater });

        expect(posisjon.koordinater).toBe(mockKoordinater);
    });

    it("should handle both koordinatsystem and koordinater being provided", () => {
        const mockKoordinatsystem = { kode: "EPSG:4326" };
        const mockKoordinater = "59.911491,10.757933";
        const posisjon = new Posisjon({
            koordinatsystem: mockKoordinatsystem,
            koordinater: mockKoordinater
        });

        expect(Kode).toHaveBeenCalledWith(mockKoordinatsystem);
        expect(posisjon.koordinatsystem).toBeInstanceOf(Kode);
        expect(posisjon.koordinater).toBe(mockKoordinater);
    });
});
