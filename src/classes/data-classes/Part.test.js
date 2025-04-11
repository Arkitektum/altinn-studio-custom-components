import Part from "./Part";
import Adresse from "./Adresse";
import { hasValue } from "../../functions/helpers";

jest.mock("./Adresse");
jest.mock("../../functions/helpers");

describe("Part", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should initialize with valid properties", () => {
        const props = {
            navn: "Test Name",
            organisasjonsnummer: "123456789",
            epost: "test@example.com",
            adresse: { adresselinje1: "Test Street", poststed: "Test City" },
            telefonnummer: "12345678",
            mobilnummer: "87654321"
        };

        hasValue.mockReturnValue(true);
        const mockAdresseInstance = { adresselinje1: "Test Street", poststed: "Test City" };
        Adresse.mockImplementation(() => mockAdresseInstance);

        const part = new Part(props);

        expect(part.navn).toBe(props.navn);
        expect(part.organisasjonsnummer).toBe(props.organisasjonsnummer);
        expect(part.epost).toBe(props.epost);
        expect(part.telefonnummer).toBe(props.telefonnummer);
        expect(part.mobilnummer).toBe(props.mobilnummer);
        expect(part.adresse).toBe(mockAdresseInstance);

        expect(Adresse).toHaveBeenCalledWith(props.adresse);
        expect(hasValue).toHaveBeenCalledWith(props.adresse);
    });

    it("should not set adresse if props.adresse is invalid", () => {
        const props = {
            navn: "Test Name",
            organisasjonsnummer: "123456789",
            epost: "test@example.com",
            adresse: null,
            telefonnummer: "12345678",
            mobilnummer: "87654321"
        };

        hasValue.mockReturnValue(false);

        const part = new Part(props);

        expect(part.navn).toBe(props.navn);
        expect(part.organisasjonsnummer).toBe(props.organisasjonsnummer);
        expect(part.epost).toBe(props.epost);
        expect(part.telefonnummer).toBe(props.telefonnummer);
        expect(part.mobilnummer).toBe(props.mobilnummer);
        expect(part.adresse).toBeUndefined();

        expect(Adresse).not.toHaveBeenCalled();
        expect(hasValue).toHaveBeenCalledWith(props.adresse);
    });

    it("should handle missing props gracefully", () => {
        const part = new Part();

        expect(part.navn).toBeUndefined();
        expect(part.organisasjonsnummer).toBeUndefined();
        expect(part.epost).toBeUndefined();
        expect(part.telefonnummer).toBeUndefined();
        expect(part.mobilnummer).toBeUndefined();
        expect(part.adresse).toBeUndefined();
    });
});
