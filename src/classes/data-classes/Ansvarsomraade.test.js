import Ansvarsomraade from "./Ansvarsomraade";
import Kode from "./Kode";
import Part from "./Part";
import PlanlagteSamsvarKontrollErklaeringerList from "../system-classes/data-classes/PlanlagteSamsvarKontrollErklaeringerList";

jest.mock("./Kode");
jest.mock("./Part");
jest.mock("../system-classes/data-classes/PlanlagteSamsvarKontrollErklaeringerList");

describe("Ansvarsomraade", () => {
    const props = {
        funksjon: "FUNKSJON_KODE",
        tiltaksklasse: "TILTAK_KLASSE_KODE",
        ansvarsomraade: "ANSVARSOMRAADE_VALUE",
        foretak: { name: "Foretak AS" }
    };
    const resourceBindings = { some: "binding" };

    beforeEach(() => {
        Kode.mockClear();
        Part.mockClear();
        PlanlagteSamsvarKontrollErklaeringerList.mockClear();
    });

    it("should initialize all properties correctly", () => {
        const instance = new Ansvarsomraade(props, resourceBindings);

        expect(Kode).toHaveBeenCalledWith(props.funksjon);
        expect(Kode).toHaveBeenCalledWith(props.tiltaksklasse);
        expect(instance.funksjon).toBeInstanceOf(Kode);
        expect(instance.tiltaksklasse).toBeInstanceOf(Kode);

        expect(instance.ansvarsomraade).toBe(props.ansvarsomraade);

        expect(Part).toHaveBeenCalledWith(props.foretak);
        expect(instance.foretak).toBeInstanceOf(Part);

        expect(PlanlagteSamsvarKontrollErklaeringerList).toHaveBeenCalledWith(props, resourceBindings);
        expect(instance.planlagteSamsvarKontrollErklaeringerList).toBeInstanceOf(
            PlanlagteSamsvarKontrollErklaeringerList
        );
    });

    it("should handle missing optional properties", () => {
        const minimalProps = {};
        const instance = new Ansvarsomraade(minimalProps, resourceBindings);

        expect(instance.funksjon).toBeFalsy();
        expect(instance.tiltaksklasse).toBeFalsy();
        expect(instance.ansvarsomraade).toBeUndefined();
        expect(instance.foretak).toBeFalsy();
        expect(PlanlagteSamsvarKontrollErklaeringerList).toHaveBeenCalledWith(minimalProps, resourceBindings);
    });

    it("should not instantiate Kode or Part if their props are missing", () => {
        const partialProps = { ansvarsomraade: "A" };
        new Ansvarsomraade(partialProps, resourceBindings);

        expect(Kode).not.toHaveBeenCalled();
        expect(Part).not.toHaveBeenCalled();
    });
});
