import SamsvarAnsvarsomraade from "./SamsvarAnsvarsomraade.js";
import Kode from "./Kode.js";
import ProsjekterendeList from "../system-classes/data-classes/ProsjekterendeList.js";
import Utfoerende from "./Utfoerende.js";

jest.mock("./Kode.js");
jest.mock("../system-classes/data-classes/ProsjekterendeList.js");
jest.mock("./Utfoerende.js");

describe("SamsvarAnsvarsomraade", () => {
    const resourceBindings = { some: "resource" };

    beforeEach(() => {
        Kode.mockClear();
        ProsjekterendeList.mockClear();
        Utfoerende.mockClear();
    });

    it("should initialize all properties correctly with full props", () => {
        const props = {
            funksjon: { kode: "F1" },
            beskrivelseAvAnsvarsomraadet: "Test beskrivelse",
            prosjekterende: [{ id: 1 }],
            utfoerende: { navn: "Test Utfoerende" },
            datoAnsvarsrettErklaert: "2024-06-01",
            erAnsvarsomraadetAvsluttet: true,
            soeknadssystemetsReferanse: "REF123"
        };

        const instance = new SamsvarAnsvarsomraade(props, resourceBindings);

        expect(Kode).toHaveBeenCalledWith(props.funksjon);
        expect(instance.funksjon).toBeInstanceOf(Kode);

        expect(instance.beskrivelseAvAnsvarsomraadet).toBe(props.beskrivelseAvAnsvarsomraadet);

        expect(ProsjekterendeList).toHaveBeenCalledWith(props.prosjekterende, resourceBindings);
        expect(instance.prosjekterende).toBeInstanceOf(ProsjekterendeList);

        expect(Utfoerende).toHaveBeenCalledWith(props.utfoerende, resourceBindings);
        expect(instance.utfoerende).toBeInstanceOf(Utfoerende);

        expect(instance.datoAnsvarsrettErklaert).toBe(props.datoAnsvarsrettErklaert);
        expect(instance.erAnsvarsomraadetAvsluttet).toBe(props.erAnsvarsomraadetAvsluttet);
        expect(instance.soeknadssystemetsReferanse).toBe(props.soeknadssystemetsReferanse);
    });

    it("should handle missing optional properties", () => {
        const props = {};
        const instance = new SamsvarAnsvarsomraade(props, resourceBindings);

        expect(instance.funksjon).toBeFalsy();
        expect(instance.beskrivelseAvAnsvarsomraadet).toBeUndefined();
        expect(ProsjekterendeList).toHaveBeenCalledWith(undefined, resourceBindings);
        expect(instance.prosjekterende).toBeInstanceOf(ProsjekterendeList);
        expect(Utfoerende).toHaveBeenCalledWith(undefined, resourceBindings);
        expect(instance.utfoerende).toBeInstanceOf(Utfoerende);
        expect(instance.datoAnsvarsrettErklaert).toBeUndefined();
        expect(instance.erAnsvarsomraadetAvsluttet).toBeUndefined();
        expect(instance.soeknadssystemetsReferanse).toBeUndefined();
    });

    it("should handle undefined props", () => {
        const instance = new SamsvarAnsvarsomraade(undefined, resourceBindings);

        expect(instance.funksjon).toBeFalsy();
        expect(instance.beskrivelseAvAnsvarsomraadet).toBeUndefined();
        expect(ProsjekterendeList).toHaveBeenCalledWith(undefined, resourceBindings);
        expect(instance.prosjekterende).toBeInstanceOf(ProsjekterendeList);
        expect(Utfoerende).toHaveBeenCalledWith(undefined, resourceBindings);
        expect(instance.utfoerende).toBeInstanceOf(Utfoerende);
        expect(instance.datoAnsvarsrettErklaert).toBeUndefined();
        expect(instance.erAnsvarsomraadetAvsluttet).toBeUndefined();
        expect(instance.soeknadssystemetsReferanse).toBeUndefined();
    });

    it("should not instantiate Kode if funksjon is not provided", () => {
        const props = { funksjon: undefined };
        new SamsvarAnsvarsomraade(props, resourceBindings);
        expect(Kode).not.toHaveBeenCalled();
    });
});
