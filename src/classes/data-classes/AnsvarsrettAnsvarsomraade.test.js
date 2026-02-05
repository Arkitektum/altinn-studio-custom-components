import AnsvarsrettAnsvarsomraade from "./AnsvarsrettAnsvarsomraade";
import Kode from "./Kode";
import FaseSamsvarKontrollList from "../system-classes/data-classes/FaseSamsvarKontrollList";

jest.mock("./Kode");
jest.mock("../system-classes/data-classes/FaseSamsvarKontrollList");

describe("AnsvarsrettAnsvarsomraade", () => {
    const resourceBindings = { some: "resource" };

    beforeEach(() => {
        Kode.mockClear();
        FaseSamsvarKontrollList.mockClear();
    });

    it("should initialize all properties correctly when all props are provided", () => {
        const props = {
            funksjon: "funksjonKode",
            beskrivelseAvAnsvarsomraadet: "Beskrivelse",
            tiltaksklasse: "tiltaksklasseKode",
            dekkesOmraadeAvSentralGodkjenning: true,
            faseSamsvarKontroll: ["fase1", "fase2"],
            soeknadssystemetsReferanse: "ref123"
        };

        const instance = new AnsvarsrettAnsvarsomraade(props, resourceBindings);

        expect(Kode).toHaveBeenCalledWith("funksjonKode");
        expect(instance.funksjon).toBeInstanceOf(Kode);

        expect(instance.beskrivelseAvAnsvarsomraadet).toBe("Beskrivelse");

        expect(Kode).toHaveBeenCalledWith("tiltaksklasseKode");
        expect(instance.tiltaksklasse).toBeInstanceOf(Kode);

        expect(instance.dekkesOmraadeAvSentralGodkjenning).toBe(true);

        expect(FaseSamsvarKontrollList).toHaveBeenCalledWith(["fase1", "fase2"], resourceBindings);
        expect(instance.faseSamsvarKontrollList).toBeInstanceOf(FaseSamsvarKontrollList);

        expect(instance.soeknadssystemetsReferanse).toBe("ref123");
    });

    it("should handle missing optional properties", () => {
        const props = {};

        const instance = new AnsvarsrettAnsvarsomraade(props, resourceBindings);

        expect(instance.funksjon).toBeUndefined();
        expect(instance.beskrivelseAvAnsvarsomraadet).toBeUndefined();
        expect(instance.tiltaksklasse).toBeUndefined();
        expect(instance.dekkesOmraadeAvSentralGodkjenning).toBeUndefined();
        expect(FaseSamsvarKontrollList).toHaveBeenCalledWith(undefined, resourceBindings);
        expect(instance.faseSamsvarKontrollList).toBeInstanceOf(FaseSamsvarKontrollList);
        expect(instance.soeknadssystemetsReferanse).toBeUndefined();
    });

    it("should not instantiate Kode if funksjon or tiltaksklasse is missing", () => {
        const props = {
            beskrivelseAvAnsvarsomraadet: "Beskrivelse",
            faseSamsvarKontroll: [],
            soeknadssystemetsReferanse: "ref123"
        };

        const instance = new AnsvarsrettAnsvarsomraade(props, resourceBindings);

        expect(instance.funksjon).toBeUndefined();
        expect(instance.tiltaksklasse).toBeUndefined();
        expect(Kode).not.toHaveBeenCalled();
    });
});
