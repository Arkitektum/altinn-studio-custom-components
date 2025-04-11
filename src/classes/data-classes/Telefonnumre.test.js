import Telefonnumre from "./Telefonnumre";

describe("Telefonnumre", () => {
    it("should create an instance with telefonnummer and mobilnummer", () => {
        const props = { telefonnummer: "12345678", mobilnummer: "87654321" };
        const instance = new Telefonnumre(props);

        expect(instance.telefonnummer).toBe("12345678");
        expect(instance.mobilnummer).toBe("87654321");
    });

    it("should create an instance with undefined properties if no props are provided", () => {
        const instance = new Telefonnumre();

        expect(instance.telefonnummer).toBeUndefined();
        expect(instance.mobilnummer).toBeUndefined();
    });

    it("should handle missing telefonnummer or mobilnummer in props", () => {
        const props = { telefonnummer: "12345678" };
        const instance = new Telefonnumre(props);

        expect(instance.telefonnummer).toBe("12345678");
        expect(instance.mobilnummer).toBeUndefined();
    });
});
