import Dispensasjon from "./Dispensasjon";
import Kode from "./Kode";

jest.mock("./Kode");

describe("Dispensasjon", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should create an instance of Dispensasjon with all properties as Kode instances", () => {
        const props = {
            dispensasjonReferanse: "REF123",
            dispensasjonKategori: { kodeverdi: "KAT1", kodebeskrivelse: "Kategori 1" },
            dispensasjonTittel: { kodeverdi: "TIT1", kodebeskrivelse: "Tittel 1" },
            bestemmelserType: { kodeverdi: "BES1", kodebeskrivelse: "Bestemmelser 1" }
        };

        const dispensasjon = new Dispensasjon(props);

        expect(dispensasjon.dispensasjonReferanse).toBe("REF123");
        expect(Kode).toHaveBeenCalledTimes(3);
        expect(Kode).toHaveBeenNthCalledWith(1, props.dispensasjonKategori);
        expect(Kode).toHaveBeenNthCalledWith(2, props.dispensasjonTittel);
        expect(Kode).toHaveBeenNthCalledWith(3, props.bestemmelserType);
        expect(dispensasjon.dispensasjonKategori).toBeInstanceOf(Kode);
        expect(dispensasjon.dispensasjonTittel).toBeInstanceOf(Kode);
        expect(dispensasjon.bestemmelserType).toBeInstanceOf(Kode);
    });

    it("should create an instance of Dispensasjon with only dispensasjonReferanse", () => {
        const props = {
            dispensasjonReferanse: "REF456"
        };

        const dispensasjon = new Dispensasjon(props);

        expect(dispensasjon.dispensasjonReferanse).toBe("REF456");
        expect(dispensasjon.dispensasjonKategori).toBeUndefined();
        expect(dispensasjon.dispensasjonTittel).toBeUndefined();
        expect(dispensasjon.bestemmelserType).toBeUndefined();
        expect(Kode).not.toHaveBeenCalled();
    });

    it("should create an instance of Dispensasjon with only dispensasjonKategori", () => {
        const props = {
            dispensasjonKategori: { kodeverdi: "KAT2", kodebeskrivelse: "Kategori 2" }
        };

        const dispensasjon = new Dispensasjon(props);

        expect(dispensasjon.dispensasjonReferanse).toBeUndefined();
        expect(Kode).toHaveBeenCalledTimes(1);
        expect(Kode).toHaveBeenCalledWith(props.dispensasjonKategori);
        expect(dispensasjon.dispensasjonKategori).toBeInstanceOf(Kode);
        expect(dispensasjon.dispensasjonTittel).toBeUndefined();
        expect(dispensasjon.bestemmelserType).toBeUndefined();
    });

    it("should create an instance of Dispensasjon with only dispensasjonTittel", () => {
        const props = {
            dispensasjonTittel: { kodeverdi: "TIT2", kodebeskrivelse: "Tittel 2" }
        };

        const dispensasjon = new Dispensasjon(props);

        expect(dispensasjon.dispensasjonReferanse).toBeUndefined();
        expect(dispensasjon.dispensasjonKategori).toBeUndefined();
        expect(Kode).toHaveBeenCalledTimes(1);
        expect(Kode).toHaveBeenCalledWith(props.dispensasjonTittel);
        expect(dispensasjon.dispensasjonTittel).toBeInstanceOf(Kode);
        expect(dispensasjon.bestemmelserType).toBeUndefined();
    });

    it("should create an instance of Dispensasjon with only bestemmelserType", () => {
        const props = {
            bestemmelserType: { kodeverdi: "BES2", kodebeskrivelse: "Bestemmelser 2" }
        };

        const dispensasjon = new Dispensasjon(props);

        expect(dispensasjon.dispensasjonReferanse).toBeUndefined();
        expect(dispensasjon.dispensasjonKategori).toBeUndefined();
        expect(dispensasjon.dispensasjonTittel).toBeUndefined();
        expect(Kode).toHaveBeenCalledTimes(1);
        expect(Kode).toHaveBeenCalledWith(props.bestemmelserType);
        expect(dispensasjon.bestemmelserType).toBeInstanceOf(Kode);
    });

    it("should create an instance of Dispensasjon with undefined properties if props are not provided", () => {
        const dispensasjon = new Dispensasjon();

        expect(dispensasjon.dispensasjonReferanse).toBeUndefined();
        expect(dispensasjon.dispensasjonKategori).toBeUndefined();
        expect(dispensasjon.dispensasjonTittel).toBeUndefined();
        expect(dispensasjon.bestemmelserType).toBeUndefined();
        expect(Kode).not.toHaveBeenCalled();
    });

    it("should create an instance of Dispensasjon with undefined properties if props is null", () => {
        const dispensasjon = new Dispensasjon(null);

        expect(dispensasjon.dispensasjonReferanse).toBeUndefined();
        expect(dispensasjon.dispensasjonKategori).toBeUndefined();
        expect(dispensasjon.dispensasjonTittel).toBeUndefined();
        expect(dispensasjon.bestemmelserType).toBeUndefined();
        expect(Kode).not.toHaveBeenCalled();
    });

    it("should create an instance of Dispensasjon with undefined properties if props is empty object", () => {
        const dispensasjon = new Dispensasjon({});

        expect(dispensasjon.dispensasjonReferanse).toBeUndefined();
        expect(dispensasjon.dispensasjonKategori).toBeUndefined();
        expect(dispensasjon.dispensasjonTittel).toBeUndefined();
        expect(dispensasjon.bestemmelserType).toBeUndefined();
        expect(Kode).not.toHaveBeenCalled();
    });

    it("should not create Kode instances for null Kode properties", () => {
        const props = {
            dispensasjonReferanse: "REF789",
            dispensasjonKategori: null,
            dispensasjonTittel: null,
            bestemmelserType: null
        };

        const dispensasjon = new Dispensasjon(props);

        expect(dispensasjon.dispensasjonReferanse).toBe("REF789");
        expect(dispensasjon.dispensasjonKategori).toBeNull();
        expect(dispensasjon.dispensasjonTittel).toBeNull();
        expect(dispensasjon.bestemmelserType).toBeNull();
        expect(Kode).not.toHaveBeenCalled();
    });

    it("should not create Kode instances for undefined Kode properties", () => {
        const props = {
            dispensasjonReferanse: "REF000",
            dispensasjonKategori: undefined,
            dispensasjonTittel: undefined,
            bestemmelserType: undefined
        };

        const dispensasjon = new Dispensasjon(props);

        expect(dispensasjon.dispensasjonReferanse).toBe("REF000");
        expect(dispensasjon.dispensasjonKategori).toBeUndefined();
        expect(dispensasjon.dispensasjonTittel).toBeUndefined();
        expect(dispensasjon.bestemmelserType).toBeUndefined();
        expect(Kode).not.toHaveBeenCalled();
    });

    it("should handle mixed properties correctly", () => {
        const props = {
            dispensasjonReferanse: "REF555",
            dispensasjonKategori: { kodeverdi: "KAT3", kodebeskrivelse: "Kategori 3" },
            dispensasjonTittel: null,
            bestemmelserType: { kodeverdi: "BES3", kodebeskrivelse: "Bestemmelser 3" }
        };

        const dispensasjon = new Dispensasjon(props);

        expect(dispensasjon.dispensasjonReferanse).toBe("REF555");
        expect(Kode).toHaveBeenCalledTimes(2);
        expect(Kode).toHaveBeenNthCalledWith(1, props.dispensasjonKategori);
        expect(Kode).toHaveBeenNthCalledWith(2, props.bestemmelserType);
        expect(dispensasjon.dispensasjonKategori).toBeInstanceOf(Kode);
        expect(dispensasjon.dispensasjonTittel).toBeNull();
        expect(dispensasjon.bestemmelserType).toBeInstanceOf(Kode);
    });

    it("should handle falsy values correctly", () => {
        const props = {
            dispensasjonReferanse: "",
            dispensasjonKategori: false,
            dispensasjonTittel: 0,
            bestemmelserType: ""
        };

        const dispensasjon = new Dispensasjon(props);

        expect(dispensasjon.dispensasjonReferanse).toBe("");
        expect(dispensasjon.dispensasjonKategori).toBe(false);
        expect(dispensasjon.dispensasjonTittel).toBe(0);
        expect(dispensasjon.bestemmelserType).toBe("");
        expect(Kode).not.toHaveBeenCalled();
    });
});
