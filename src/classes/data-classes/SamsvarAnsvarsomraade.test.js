import SamsvarAnsvarsomraade from "./SamsvarAnsvarsomraade.js";
import ProsjekterendeList from "../system-classes/data-classes/ProsjekterendeList.js";
import Kode from "./Kode.js";
import Utfoerende from "./Utfoerende.js";

// Mock dependencies
jest.mock("../system-classes/data-classes/ProsjekterendeList.js", () =>
    jest.fn().mockImplementation((kodeverdi, prosjekterende, resourceBindings) => ({
        kodeverdi,
        prosjekterende,
        resourceBindings,
        __mock: "ProsjekterendeList"
    }))
);
jest.mock("./Kode.js", () =>
    jest.fn().mockImplementation((funksjon) => ({
        ...funksjon,
        __mock: "Kode"
    }))
);
jest.mock("./Utfoerende.js", () =>
    jest.fn().mockImplementation((utfoerende, resourceBindings) => ({
        utfoerende,
        resourceBindings,
        __mock: "Utfoerende"
    }))
);

describe("SamsvarAnsvarsomraade", () => {
    const resourceBindings = { some: "resource" };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should initialize all properties correctly with full props", () => {
        const props = {
            funksjon: { kodeverdi: "A", beskrivelse: "desc" },
            beskrivelseAvAnsvarsomraadet: "Test beskrivelse",
            prosjekterende: [{ id: 1 }],
            utfoerende: { navn: "Test Utfoerende" },
            datoAnsvarsrettErklaert: "2024-01-01",
            erAnsvarsomraadetAvsluttet: true,
            soeknadssystemetsReferanse: "ref123"
        };

        const instance = new SamsvarAnsvarsomraade(props, resourceBindings);

        expect(Kode).toHaveBeenCalledWith(props.funksjon);
        expect(ProsjekterendeList).toHaveBeenCalledWith(props.funksjon.kodeverdi, props.prosjekterende, resourceBindings);
        expect(Utfoerende).toHaveBeenCalledWith(props.utfoerende, resourceBindings);

        expect(instance.funksjon).toEqual(expect.objectContaining({ ...props.funksjon, __mock: "Kode" }));
        expect(instance.beskrivelseAvAnsvarsomraadet).toBe(props.beskrivelseAvAnsvarsomraadet);
        expect(instance.prosjekterendeList).toEqual(
            expect.objectContaining({
                kodeverdi: props.funksjon.kodeverdi,
                prosjekterende: props.prosjekterende,
                resourceBindings,
                __mock: "ProsjekterendeList"
            })
        );
        expect(instance.utfoerende).toEqual(
            expect.objectContaining({
                utfoerende: props.utfoerende,
                resourceBindings,
                __mock: "Utfoerende"
            })
        );
        expect(instance.datoAnsvarsrettErklaert).toBe(props.datoAnsvarsrettErklaert);
        expect(instance.erAnsvarsomraadetAvsluttet).toBe(props.erAnsvarsomraadetAvsluttet);
        expect(instance.soeknadssystemetsReferanse).toBe(props.soeknadssystemetsReferanse);
    });

    it("should handle missing optional properties", () => {
        const props = {
            funksjon: { kodeverdi: "B" },
            prosjekterende: undefined,
            utfoerende: undefined
            // other props missing
        };

        const instance = new SamsvarAnsvarsomraade(props, resourceBindings);

        expect(Kode).toHaveBeenCalledWith(props.funksjon);
        expect(ProsjekterendeList).toHaveBeenCalledWith(props.funksjon.kodeverdi, undefined, resourceBindings);
        expect(Utfoerende).toHaveBeenCalledWith(undefined, resourceBindings);

        expect(instance.beskrivelseAvAnsvarsomraadet).toBeUndefined();
        expect(instance.datoAnsvarsrettErklaert).toBeUndefined();
        expect(instance.erAnsvarsomraadetAvsluttet).toBeUndefined();
        expect(instance.soeknadssystemetsReferanse).toBeUndefined();
    });

    it("should handle undefined props", () => {
        const instance = new SamsvarAnsvarsomraade(undefined, resourceBindings);

        expect(Kode).not.toHaveBeenCalled();
        expect(ProsjekterendeList).toHaveBeenCalledWith(undefined, undefined, resourceBindings);
        expect(Utfoerende).toHaveBeenCalledWith(undefined, resourceBindings);

        expect(instance.funksjon).toBeUndefined();
        expect(instance.beskrivelseAvAnsvarsomraadet).toBeUndefined();
        expect(instance.datoAnsvarsrettErklaert).toBeUndefined();
        expect(instance.erAnsvarsomraadetAvsluttet).toBeUndefined();
        expect(instance.soeknadssystemetsReferanse).toBeUndefined();
    });
});
