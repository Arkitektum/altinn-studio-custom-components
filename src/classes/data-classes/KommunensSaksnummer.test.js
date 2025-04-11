import KommunensSaksnummer from "./KommunensSaksnummer";

describe("KommunensSaksnummer", () => {
    it("should create an instance with the correct properties when valid props are provided", () => {
        const props = { saksaar: 2023, sakssekvensnummer: 12345 };
        const instance = new KommunensSaksnummer(props);

        expect(instance.saksaar).toBe(2023);
        expect(instance.sakssekvensnummer).toBe(12345);
    });

    it("should create an instance with undefined properties when no props are provided", () => {
        const instance = new KommunensSaksnummer();

        expect(instance.saksaar).toBeUndefined();
        expect(instance.sakssekvensnummer).toBeUndefined();
    });

    it("should create an instance with undefined properties when props are missing required fields", () => {
        const props = { saksaar: 2023 };
        const instance = new KommunensSaksnummer(props);

        expect(instance.saksaar).toBe(2023);
        expect(instance.sakssekvensnummer).toBeUndefined();
    });
});
