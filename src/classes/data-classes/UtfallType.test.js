import UtfallType from "./UtfallType";

describe("UtfallType", () => {
    it("should create an instance with the provided kodeverdi", () => {
        const props = { kodeverdi: "testKodeverdi" };
        const utfallType = new UtfallType(props);

        expect(utfallType).toBeInstanceOf(UtfallType);
        expect(utfallType.kodeverdi).toBe("testKodeverdi");
    });

    it("should create an instance with undefined kodeverdi if no props are provided", () => {
        const utfallType = new UtfallType();

        expect(utfallType).toBeInstanceOf(UtfallType);
        expect(utfallType.kodeverdi).toBeUndefined();
    });

    it("should create an instance with undefined kodeverdi if props is an empty object", () => {
        const utfallType = new UtfallType({});

        expect(utfallType).toBeInstanceOf(UtfallType);
        expect(utfallType.kodeverdi).toBeUndefined();
    });
});
