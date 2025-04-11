import DispensasjonBeskrivelse from "./DispensasjonBeskrivelse";
import Kode from "./Kode";

describe("DispensasjonBeskrivelse", () => {
    it("should initialize with default values when no props are provided", () => {
        const instance = new DispensasjonBeskrivelse({});
        expect(instance.dispensasjonTittel).toBeUndefined();
        expect(instance.inngangsbeskrivelse).toBeUndefined();
        expect(instance.annenInngangsbeskrivelse).toBeUndefined();
        expect(instance.beskrivelse).toBeUndefined();
    });

    it("should initialize dispensasjonTittel and inngangsbeskrivelse as Kode instances when provided", () => {
        const props = {
            dispensasjonTittel: { kodebeskrivelse: "Title description" },
            inngangsbeskrivelse: { kodebeskrivelse: "Entrance description" }
        };
        const instance = new DispensasjonBeskrivelse(props);

        console.log(instance);

        expect(instance.dispensasjonTittel).toBeInstanceOf(Kode);
        expect(instance.dispensasjonTittel.kodebeskrivelse).toBe("Title description");

        expect(instance.inngangsbeskrivelse).toBeInstanceOf(Kode);
        expect(instance.inngangsbeskrivelse.kodebeskrivelse).toBe("Entrance description");
    });

    it("should initialize annenInngangsbeskrivelse and beskrivelse as strings when provided", () => {
        const props = {
            annenInngangsbeskrivelse: "Alternative entrance description",
            beskrivelse: "General description"
        };
        const instance = new DispensasjonBeskrivelse(props);

        expect(instance.annenInngangsbeskrivelse).toBe("Alternative entrance description");
        expect(instance.beskrivelse).toBe("General description");
    });

    it("should handle partial props correctly", () => {
        const props = {
            dispensasjonTittel: { kodebeskrivelse: "Partial title" }
        };
        const instance = new DispensasjonBeskrivelse(props);

        expect(instance.dispensasjonTittel).toBeInstanceOf(Kode);
        expect(instance.dispensasjonTittel.kodebeskrivelse).toBe("Partial title");

        expect(instance.inngangsbeskrivelse).toBeUndefined();
        expect(instance.annenInngangsbeskrivelse).toBeUndefined();
        expect(instance.beskrivelse).toBeUndefined();
    });
});
