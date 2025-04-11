import NasjonalArealplanId from "./NasjonalArealplanId";

describe("NasjonalArealplanId", () => {
    it("should create an instance with the given planidentifikasjon", () => {
        const props = { planidentifikasjon: "12345" };
        const instance = new NasjonalArealplanId(props);

        expect(instance.planidentifikasjon).toBe("12345");
    });

    it("should create an instance with undefined planidentifikasjon if no props are provided", () => {
        const instance = new NasjonalArealplanId();

        expect(instance.planidentifikasjon).toBeUndefined();
    });

    it("should create an instance with undefined planidentifikasjon if props does not contain planidentifikasjon", () => {
        const props = { otherProperty: "value" };
        const instance = new NasjonalArealplanId(props);

        expect(instance.planidentifikasjon).toBeUndefined();
    });
});
