import Sjekklistekrav from "./Sjekklistekrav";
import Kode from "./Kode";

jest.mock("./Kode");

describe("Sjekklistekrav", () => {
    beforeEach(() => {
        Kode.mockClear();
    });

    it("should initialize properties from props", () => {
        const props = {
            sjekklistepunktsvar: true,
            sjekklistepunkt: { kode: "A1", beskrivelse: "Test" },
            dokumentasjon: "Some documentation"
        };
        const krav = new Sjekklistekrav(props);

        expect(krav.sjekklistepunktsvar).toBe(true);
        expect(Kode).toHaveBeenCalledWith(props.sjekklistepunkt);
        expect(krav.sjekklistepunkt).toBeInstanceOf(Kode);
        expect(krav.dokumentasjon).toBe("Some documentation");
    });

    it("should handle missing props gracefully", () => {
        const krav = new Sjekklistekrav({});
        expect(krav.sjekklistepunktsvar).toBeUndefined();
        expect(krav.sjekklistepunkt).toBeFalsy();
        expect(krav.dokumentasjon).toBeUndefined();
    });

    it("should handle undefined props", () => {
        const krav = new Sjekklistekrav();
        expect(krav.sjekklistepunktsvar).toBeUndefined();
        expect(krav.sjekklistepunkt).toBeUndefined();
        expect(krav.dokumentasjon).toBeUndefined();
    });

    it("should not create Kode instance if sjekklistepunkt is missing", () => {
        const props = {
            sjekklistepunktsvar: false,
            dokumentasjon: "Doc"
        };
        const krav = new Sjekklistekrav(props);
        expect(Kode).not.toHaveBeenCalled();
        expect(krav.sjekklistepunkt).toBeUndefined();
    });
});
