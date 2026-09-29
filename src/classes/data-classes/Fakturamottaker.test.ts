import Adresse from "./Adresse.ts";
import Fakturamottaker from "./Fakturamottaker.ts";
import { hasValue } from "@arkitektum/altinn-studio-custom-components-utils";

jest.mock("./Adresse");
jest.mock("@arkitektum/altinn-studio-custom-components-utils");

/** Every field holds a different value, so a constructor that reads the wrong one cannot pass. */
const props = {
    navn: "Testbedrift AS",
    adresse: { adresselinje1: "Storgata 1", poststed: "Oslo" },
    organisasjonsnummer: "987654321",
    bestillerreferanse: "Bestilt av Kari",
    fakturareferanse: "Faktura 2024-17",
    prosjektnummer: 4711,
    epost: "faktura@testbedrift.no"
};

describe("Fakturamottaker", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should initialize with valid properties", () => {
        jest.mocked(hasValue).mockReturnValue(true);
        const mockAdresseInstance = { adresselinje1: "Storgata 1", poststed: "Oslo" };
        (Adresse as unknown as jest.Mock).mockImplementation(() => mockAdresseInstance);

        const fakturamottaker = new Fakturamottaker(props);

        expect(fakturamottaker.navn).toBe(props.navn);
        expect(fakturamottaker.organisasjonsnummer).toBe(props.organisasjonsnummer);
        expect(fakturamottaker.bestillerreferanse).toBe(props.bestillerreferanse);
        expect(fakturamottaker.fakturareferanse).toBe(props.fakturareferanse);
        expect(fakturamottaker.prosjektnummer).toBe(props.prosjektnummer);
        expect(fakturamottaker.epost).toBe(props.epost);
        expect(fakturamottaker.adresse).toBe(mockAdresseInstance);

        expect(Adresse).toHaveBeenCalledWith(props.adresse);
        expect(hasValue).toHaveBeenCalledWith(props.adresse);
    });

    it("should not set adresse if props.adresse is invalid", () => {
        jest.mocked(hasValue).mockReturnValue(false);

        const fakturamottaker = new Fakturamottaker({ ...props, adresse: null });

        expect(fakturamottaker.navn).toBe(props.navn);
        expect(fakturamottaker.organisasjonsnummer).toBe(props.organisasjonsnummer);
        expect(fakturamottaker.bestillerreferanse).toBe(props.bestillerreferanse);
        expect(fakturamottaker.fakturareferanse).toBe(props.fakturareferanse);
        expect(fakturamottaker.prosjektnummer).toBe(props.prosjektnummer);
        expect(fakturamottaker.epost).toBe(props.epost);
        expect(fakturamottaker.adresse).toBeUndefined();

        expect(Adresse).not.toHaveBeenCalled();
        expect(hasValue).toHaveBeenCalledWith(null);
    });

    it("leaves adresse off the instance entirely rather than setting it undefined", () => {
        // The declare-only fields mean an absent address is an absent key, which is what hasValue reads downstream.
        jest.mocked(hasValue).mockReturnValue(false);

        expect(Object.keys(new Fakturamottaker(props))).toEqual([
            "navn",
            "organisasjonsnummer",
            "bestillerreferanse",
            "fakturareferanse",
            "prosjektnummer",
            "epost"
        ]);
    });

    it("should handle missing props gracefully", () => {
        const fakturamottaker = new Fakturamottaker();

        expect(fakturamottaker.navn).toBeUndefined();
        expect(fakturamottaker.adresse).toBeUndefined();
        expect(fakturamottaker.organisasjonsnummer).toBeUndefined();
        expect(fakturamottaker.bestillerreferanse).toBeUndefined();
        expect(fakturamottaker.fakturareferanse).toBeUndefined();
        expect(fakturamottaker.prosjektnummer).toBeUndefined();
        expect(fakturamottaker.epost).toBeUndefined();
    });
});
