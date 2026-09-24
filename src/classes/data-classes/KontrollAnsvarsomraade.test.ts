import Kode from "./Kode.ts";
import KontrollAnsvarsomraade from "./KontrollAnsvarsomraade.ts";
import KontrollerendeList from "../system-classes/data-classes/KontrollerendeList.ts";

jest.mock("../system-classes/data-classes/KontrollerendeList");
jest.mock("./Kode");

describe("KontrollAnsvarsomraade", () => {
    const resourceBindings = { some: "resource" };

    beforeEach(() => {
        (KontrollerendeList as unknown as jest.Mock).mockClear();
        (Kode as unknown as jest.Mock).mockClear();
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
        (Kode as unknown as jest.Mock).mockImplementation(() => kodeInstance);

        const kontrollerendeListInstance = { list: [1] };
        (KontrollerendeList as unknown as jest.Mock).mockImplementation(() => kontrollerendeListInstance);

        const instance = new KontrollAnsvarsomraade(props as never, resourceBindings);

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
        (KontrollerendeList as unknown as jest.Mock).mockImplementation(() => kontrollerendeListInstance);

        const instance = new KontrollAnsvarsomraade(props as never, resourceBindings);

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
        (KontrollerendeList as unknown as jest.Mock).mockImplementation(() => kontrollerendeListInstance);

        const instance = new KontrollAnsvarsomraade(props as never, resourceBindings);

        expect(Kode).not.toHaveBeenCalled();
        expect(instance.funksjon).toBeUndefined();
    });

    it("should pass kontrollerende and resourceBindings to KontrollerendeList", () => {
        const props = { kontrollerende: [1, 2, 3] };

        const kontrollerendeListInstance = {};
        (KontrollerendeList as unknown as jest.Mock).mockImplementation(() => kontrollerendeListInstance);

        const instance = new KontrollAnsvarsomraade(props as never, resourceBindings);

        expect(KontrollerendeList).toHaveBeenCalledWith(props.kontrollerende, resourceBindings);
        expect(instance.kontrollerendeList).toBe(kontrollerendeListInstance);
    });
});
