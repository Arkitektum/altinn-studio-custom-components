import SamsvarAnsvarsomraade from "./SamsvarAnsvarsomraade";
import ProsjekterendeList from "../system-classes/data-classes/ProsjekterendeList";
import Kode from "./Kode";
import Utfoerende from "./Utfoerende";

jest.mock("../system-classes/data-classes/ProsjekterendeList");
jest.mock("./Kode");
jest.mock("./Utfoerende");

describe("SamsvarAnsvarsomraade", () => {
    const resourceBindings = { some: "resource" };

    beforeEach(() => {
        ProsjekterendeList.mockClear();
        Kode.mockClear();
        Utfoerende.mockClear();
    });

    it("should initialize all properties correctly with full props", () => {
        const props = {
            funksjon: { kode: "A" },
            beskrivelseAvAnsvarsomraadet: "desc",
            prosjekterende: [{ id: 1 }],
            utfoerende: { id: 2 },
            datoAnsvarsrettErklaert: "2024-01-01",
            erAnsvarsomraadetAvsluttet: true,
            soeknadssystemetsReferanse: "ref123"
        };

        const kodeInstance = { kode: "A" };
        const prosjekterendeListInstance = { __mock: "ProsjekterendeList" };
        const utfoerendeInstance = { __mock: "Utfoerende" };

        Kode.mockImplementation(() => kodeInstance);
        ProsjekterendeList.mockImplementation(() => prosjekterendeListInstance);
        Utfoerende.mockImplementation(() => utfoerendeInstance);

        const instance = new SamsvarAnsvarsomraade(props, resourceBindings);

        expect(Kode).toHaveBeenCalledWith(props.funksjon);
        expect(ProsjekterendeList).toHaveBeenCalledWith(props.prosjekterende, resourceBindings);
        expect(Utfoerende).toHaveBeenCalledWith(props.utfoerende, resourceBindings);

        expect(instance).toEqual({
            funksjon: kodeInstance,
            beskrivelseAvAnsvarsomraadet: "desc",
            prosjekterendeList: prosjekterendeListInstance,
            utfoerende: utfoerendeInstance,
            datoAnsvarsrettErklaert: "2024-01-01",
            erAnsvarsomraadetAvsluttet: true,
            soeknadssystemetsReferanse: "ref123"
        });
    });

    it("should handle missing optional properties", () => {
        const props = {
            funksjon: { kode: "B" },
            prosjekterende: undefined,
            utfoerende: undefined
        };

        const kodeInstance = { kode: "B" };
        const prosjekterendeListInstance = { __mock: "ProsjekterendeList" };
        const utfoerendeInstance = { __mock: "Utfoerende" };

        Kode.mockImplementation(() => kodeInstance);
        ProsjekterendeList.mockImplementation(() => prosjekterendeListInstance);
        Utfoerende.mockImplementation(() => utfoerendeInstance);

        const instance = new SamsvarAnsvarsomraade(props, resourceBindings);

        expect(Kode).toHaveBeenCalledWith(props.funksjon);
        expect(ProsjekterendeList).toHaveBeenCalledWith(undefined, resourceBindings);
        expect(Utfoerende).toHaveBeenCalledWith(undefined, resourceBindings);

        expect(instance.funksjon).toBe(kodeInstance);
        expect(instance.beskrivelseAvAnsvarsomraadet).toBeUndefined();
        expect(instance.prosjekterendeList).toBe(prosjekterendeListInstance);
        expect(instance.utfoerende).toBe(utfoerendeInstance);
        expect(instance.datoAnsvarsrettErklaert).toBeUndefined();
        expect(instance.erAnsvarsomraadetAvsluttet).toBeUndefined();
        expect(instance.soeknadssystemetsReferanse).toBeUndefined();
    });

    it("should handle undefined props", () => {
        const kodeInstance = undefined;
        const prosjekterendeListInstance = { __mock: "ProsjekterendeList" };
        const utfoerendeInstance = { __mock: "Utfoerende" };

        Kode.mockImplementation(() => kodeInstance);
        ProsjekterendeList.mockImplementation(() => prosjekterendeListInstance);
        Utfoerende.mockImplementation(() => utfoerendeInstance);

        const instance = new SamsvarAnsvarsomraade(undefined, resourceBindings);

        expect(Kode).not.toHaveBeenCalled();
        expect(ProsjekterendeList).toHaveBeenCalledWith(undefined, resourceBindings);
        expect(Utfoerende).toHaveBeenCalledWith(undefined, resourceBindings);

        expect(instance.funksjon).toBeUndefined();
        expect(instance.beskrivelseAvAnsvarsomraadet).toBeUndefined();
        expect(instance.prosjekterendeList).toBe(prosjekterendeListInstance);
        expect(instance.utfoerende).toBe(utfoerendeInstance);
        expect(instance.datoAnsvarsrettErklaert).toBeUndefined();
        expect(instance.erAnsvarsomraadetAvsluttet).toBeUndefined();
        expect(instance.soeknadssystemetsReferanse).toBeUndefined();
    });
});
