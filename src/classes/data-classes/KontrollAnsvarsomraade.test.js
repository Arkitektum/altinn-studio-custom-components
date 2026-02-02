import KontrollAnsvarsomraade from "./KontrollAnsvarsomraade";
import KontrollerendeList from "../system-classes/data-classes/KontrollerendeList";
import Kode from "./Kode";

jest.mock("../system-classes/data-classes/KontrollerendeList");
jest.mock("./Kode");

describe("KontrollAnsvarsomraade", () => {
    const resourceBindings = { some: "resource" };

    beforeEach(() => {
        KontrollerendeList.mockClear();
        Kode.mockClear();
    });

    it("should initialize all properties correctly when all props are provided", () => {
        const props = {
            funksjon: { code: "A1" },
            beskrivelseAvAnsvarsomraadet: "Test description",
            kontrollerende: [{ id: 1 }],
            datoAnsvarsrettErklaert: "2024-01-01",
            erAnsvarsomraadetAvsluttet: true,
            soeknadssystemetsReferanse: "ref123"
        };

        const kodeInstance = { kode: "A1" };
        Kode.mockImplementation(() => kodeInstance);

        const kontrollerendeListInstance = { list: [1] };
        KontrollerendeList.mockImplementation(() => kontrollerendeListInstance);

        const instance = new KontrollAnsvarsomraade(props, resourceBindings);

        expect(Kode).toHaveBeenCalledWith(props.funksjon);
        expect(instance.funksjon).toBe(kodeInstance);

        expect(instance.beskrivelseAvAnsvarsomraadet).toBe(props.beskrivelseAvAnsvarsomraadet);

        expect(KontrollerendeList).toHaveBeenCalledWith(props.kontrollerende, resourceBindings);
        expect(instance.kontrollerendeList).toBe(kontrollerendeListInstance);

        expect(instance.datoAnsvarsrettErklaert).toBe(props.datoAnsvarsrettErklaert);
        expect(instance.erAnsvarsomraadetAvsluttet).toBe(props.erAnsvarsomraadetAvsluttet);
        expect(instance.soeknadssystemetsReferanse).toBe(props.soeknadssystemetsReferanse);
    });

    it("should handle missing optional properties", () => {
        const props = {};

        const kontrollerendeListInstance = {};
        KontrollerendeList.mockImplementation(() => kontrollerendeListInstance);

        const instance = new KontrollAnsvarsomraade(props, resourceBindings);

        expect(instance.funksjon).toBeUndefined();
        expect(instance.beskrivelseAvAnsvarsomraadet).toBeUndefined();
        expect(instance.kontrollerendeList).toBe(kontrollerendeListInstance);
        expect(instance.datoAnsvarsrettErklaert).toBeUndefined();
        expect(instance.erAnsvarsomraadetAvsluttet).toBeUndefined();
        expect(instance.soeknadssystemetsReferanse).toBeUndefined();
    });

    it("should not create Kode instance if funksjon is undefined", () => {
        const props = { funksjon: undefined };

        const kontrollerendeListInstance = {};
        KontrollerendeList.mockImplementation(() => kontrollerendeListInstance);

        const instance = new KontrollAnsvarsomraade(props, resourceBindings);

        expect(Kode).not.toHaveBeenCalled();
        expect(instance.funksjon).toBeUndefined();
    });

    it("should pass kontrollerende and resourceBindings to KontrollerendeList", () => {
        const props = { kontrollerende: [1, 2, 3] };

        const kontrollerendeListInstance = {};
        KontrollerendeList.mockImplementation(() => kontrollerendeListInstance);

        const instance = new KontrollAnsvarsomraade(props, resourceBindings);

        expect(KontrollerendeList).toHaveBeenCalledWith(props.kontrollerende, resourceBindings);
        expect(instance.kontrollerendeList).toBe(kontrollerendeListInstance);
    });
});
