import Vegtype from "./Vegtype.js";
import Kode from "./Kode.js";

jest.mock("./Kode.js"); // Mock the Kode class

describe("Vegtype", () => {
    beforeEach(() => {
        Kode.mockClear();
    });

    it("should initialize kode as an array of Kode instances when props.kode is provided", () => {
        const kodeArray = [{ id: 1 }, { id: 2 }];
        const vegtype = new Vegtype({ kode: kodeArray });

        expect(Array.isArray(vegtype.kode)).toBe(true);
        expect(vegtype.kode).toHaveLength(2);
        expect(Kode).toHaveBeenCalledTimes(2);
        expect(Kode).toHaveBeenNthCalledWith(1, { id: 1 });
        expect(Kode).toHaveBeenNthCalledWith(2, { id: 2 });
    });

    it("should set kode to undefined if props is undefined", () => {
        const vegtype = new Vegtype();
        expect(vegtype.kode).toBeUndefined();
    });

    it("should set kode to undefined if props.kode is undefined", () => {
        const vegtype = new Vegtype({});
        expect(vegtype.kode).toBeUndefined();
    });

    it("should set kode to an empty array if props.kode is an empty array", () => {
        const vegtype = new Vegtype({ kode: [] });
        expect(Array.isArray(vegtype.kode)).toBe(true);
        expect(vegtype.kode).toHaveLength(0);
        expect(Kode).not.toHaveBeenCalled();
    });
});
