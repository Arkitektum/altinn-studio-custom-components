import Planbestemmelse from "./Planbestemmelse";

describe("Planbestemmelse", () => {
    it("should create an instance with the provided nummerering", () => {
        const props = { nummerering: "123" };
        const instance = new Planbestemmelse(props);
        expect(instance.nummerering).toBe("123");
    });

    it("should create an instance with undefined nummerering if no props are provided", () => {
        const instance = new Planbestemmelse();
        expect(instance.nummerering).toBeUndefined();
    });

    it("should create an instance with undefined nummerering if props do not include nummerering", () => {
        const props = { otherProp: "value" };
        const instance = new Planbestemmelse(props);
        expect(instance.nummerering).toBeUndefined();
    });
});
