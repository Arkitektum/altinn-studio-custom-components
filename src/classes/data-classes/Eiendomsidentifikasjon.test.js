import Eiendomsidentifikasjon from "./Eiendomsidentifikasjon";

describe("Eiendomsidentifikasjon", () => {
    it("should create an instance with all properties set", () => {
        const props = {
            gaardsnummer: 123,
            bruksnummer: 456,
            seksjonsnummer: 789,
            festenummer: 101
        };
        const instance = new Eiendomsidentifikasjon(props);

        expect(instance.gaardsnummer).toBe(123);
        expect(instance.bruksnummer).toBe(456);
        expect(instance.seksjonsnummer).toBe(789);
        expect(instance.festenummer).toBe(101);
    });

    it("should create an instance with undefined properties if no props are provided", () => {
        const instance = new Eiendomsidentifikasjon();

        expect(instance.gaardsnummer).toBeUndefined();
        expect(instance.bruksnummer).toBeUndefined();
        expect(instance.seksjonsnummer).toBeUndefined();
        expect(instance.festenummer).toBeUndefined();
    });

    it("should create an instance with some properties set and others undefined", () => {
        const props = {
            gaardsnummer: 123,
            bruksnummer: 456
        };
        const instance = new Eiendomsidentifikasjon(props);

        expect(instance.gaardsnummer).toBe(123);
        expect(instance.bruksnummer).toBe(456);
        expect(instance.seksjonsnummer).toBeUndefined();
        expect(instance.festenummer).toBeUndefined();
    });
});
