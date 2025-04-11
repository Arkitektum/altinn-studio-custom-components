import GenerelleVilkaar from "./GenerelleVilkaar";

describe("GenerelleVilkaar", () => {
    it("should create an instance with the provided norskSvenskDansk value", () => {
        const props = { norskSvenskDansk: "TestValue" };
        const instance = new GenerelleVilkaar(props);
        expect(instance.norskSvenskDansk).toBe("TestValue");
    });

    it("should create an instance with undefined norskSvenskDansk if no props are provided", () => {
        const instance = new GenerelleVilkaar();
        expect(instance.norskSvenskDansk).toBeUndefined();
    });

    it("should create an instance with undefined norskSvenskDansk if props do not include norskSvenskDansk", () => {
        const props = { someOtherProp: "OtherValue" };
        const instance = new GenerelleVilkaar(props);
        expect(instance.norskSvenskDansk).toBeUndefined();
    });
});
