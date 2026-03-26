import Dispensasjon from "./Dispensasjon";
import DispensasjonOversikt from "./DispensasjonOversikt";

jest.mock("./Dispensasjon");

describe("DispensasjonOversikt", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should create an instance of DispensasjonOversikt with dispensasjon array mapped to Dispensasjon instances", () => {
        const dispensasjonData = [
            {
                dispensasjonReferanse: "REF001",
                dispensasjonKategori: { kodeverdi: "KAT1", kodebeskrivelse: "Kategori 1" },
                dispensasjonTittel: { kodeverdi: "TIT1", kodebeskrivelse: "Tittel 1" }
            },
            {
                dispensasjonReferanse: "REF002",
                dispensasjonKategori: { kodeverdi: "KAT2", kodebeskrivelse: "Kategori 2" },
                dispensasjonTittel: { kodeverdi: "TIT2", kodebeskrivelse: "Tittel 2" }
            }
        ];

        const props = { dispensasjon: dispensasjonData };
        const dispensasjonOversikt = new DispensasjonOversikt(props);

        expect(Dispensasjon).toHaveBeenCalledTimes(2);
        expect(Dispensasjon).toHaveBeenNthCalledWith(1, dispensasjonData[0]);
        expect(Dispensasjon).toHaveBeenNthCalledWith(2, dispensasjonData[1]);
        expect(dispensasjonOversikt.dispensasjon).toHaveLength(2);
    });

    it("should create an instance of DispensasjonOversikt with empty dispensasjon array", () => {
        const props = { dispensasjon: [] };
        const dispensasjonOversikt = new DispensasjonOversikt(props);

        expect(Dispensasjon).not.toHaveBeenCalled();
        expect(dispensasjonOversikt.dispensasjon).toEqual([]);
    });

    it("should create an instance of DispensasjonOversikt with undefined dispensasjon if props are not provided", () => {
        const dispensasjonOversikt = new DispensasjonOversikt();

        expect(dispensasjonOversikt.dispensasjon).toBeUndefined();
        expect(Dispensasjon).not.toHaveBeenCalled();
    });

    it("should create an instance of DispensasjonOversikt with undefined dispensasjon if props is null", () => {
        const dispensasjonOversikt = new DispensasjonOversikt(null);

        expect(dispensasjonOversikt.dispensasjon).toBeUndefined();
        expect(Dispensasjon).not.toHaveBeenCalled();
    });

    it("should create an instance of DispensasjonOversikt with undefined dispensasjon if dispensasjon property is not provided", () => {
        const props = { otherProperty: "someValue" };
        const dispensasjonOversikt = new DispensasjonOversikt(props);

        expect(dispensasjonOversikt.dispensasjon).toBeUndefined();
        expect(Dispensasjon).not.toHaveBeenCalled();
    });

    it("should create an instance of DispensasjonOversikt with null dispensasjon if dispensasjon is null", () => {
        const props = { dispensasjon: null };
        const dispensasjonOversikt = new DispensasjonOversikt(props);

        expect(dispensasjonOversikt.dispensasjon).toBeNull();
        expect(Dispensasjon).not.toHaveBeenCalled();
    });

    it("should handle single dispensasjon item in array", () => {
        const dispensasjonData = [
            {
                dispensasjonReferanse: "REF001",
                dispensasjonKategori: { kodeverdi: "KAT1", kodebeskrivelse: "Kategori 1" }
            }
        ];

        const props = { dispensasjon: dispensasjonData };
        const dispensasjonOversikt = new DispensasjonOversikt(props);

        expect(Dispensasjon).toHaveBeenCalledTimes(1);
        expect(Dispensasjon).toHaveBeenCalledWith(dispensasjonData[0]);
        expect(dispensasjonOversikt.dispensasjon).toHaveLength(1);
    });

    it("should map each dispensasjon item correctly preserving order", () => {
        const dispensasjonData = [{ dispensasjonReferanse: "FIRST" }, { dispensasjonReferanse: "SECOND" }, { dispensasjonReferanse: "THIRD" }];

        const props = { dispensasjon: dispensasjonData };
        const dispensasjonOversikt = new DispensasjonOversikt(props);

        expect(Dispensasjon).toHaveBeenCalledTimes(3);
        expect(Dispensasjon).toHaveBeenNthCalledWith(1, { dispensasjonReferanse: "FIRST" });
        expect(Dispensasjon).toHaveBeenNthCalledWith(2, { dispensasjonReferanse: "SECOND" });
        expect(Dispensasjon).toHaveBeenNthCalledWith(3, { dispensasjonReferanse: "THIRD" });
        expect(dispensasjonOversikt.dispensasjon).toHaveLength(3);
    });
});
