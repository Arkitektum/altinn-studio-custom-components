import Ulemper from "./Ulemper";

describe("Ulemper", () => {
    it("should create an instance with the provided effekt property", () => {
        const props = { effekt: "some effect" };
        const instance = new Ulemper(props);
        expect(instance.effekt).toBe("some effect");
    });

    it("should create an instance with undefined effekt if no props are provided", () => {
        const instance = new Ulemper();
        expect(instance.effekt).toBeUndefined();
    });

    it("should create an instance with undefined effekt if props do not contain effekt", () => {
        const props = { otherProp: "value" };
        const instance = new Ulemper(props);
        expect(instance.effekt).toBeUndefined();
    });
});
