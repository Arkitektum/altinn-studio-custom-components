import { formatKommunensSaksnummer } from "./functions";

describe("formatKommunensSaksnummer", () => {
    it("should format kommunensSaksnummer correctly when both saksaar and sakssekvensnummer are provided", () => {
        const input = { saksaar: 2023, sakssekvensnummer: 123 };
        const result = formatKommunensSaksnummer(input);
        expect(result).toBe("2023/123");
    });

    it("should return only saksaar if sakssekvensnummer is missing", () => {
        const input = { saksaar: 2023 };
        const result = formatKommunensSaksnummer(input);
        expect(result).toBe("2023");
    });

    it("should return only sakssekvensnummer if saksaar is missing", () => {
        const input = { sakssekvensnummer: 123 };
        const result = formatKommunensSaksnummer(input);
        expect(result).toBe("123");
    });

    it("should return an empty string if both saksaar and sakssekvensnummer are missing", () => {
        const input = {};
        const result = formatKommunensSaksnummer(input);
        expect(result).toBe("");
    });

    it("should handle null or undefined input gracefully", () => {
        expect(formatKommunensSaksnummer(null)).toBe("");
        expect(formatKommunensSaksnummer(undefined)).toBe("");
    });

    it("should handle non-numeric values gracefully", () => {
        const input = { saksaar: "abcd", sakssekvensnummer: "efgh" };
        const result = formatKommunensSaksnummer(input);
        expect(result).toBe("abcd/efgh");
    });
});
