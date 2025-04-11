import DispensasjonFra from "./DispensasjonFra";
import DispensasjonPlanBestemmelse from "./DispensasjonPlanBestemmelse";
import Kode from "./Kode";

jest.mock("./DispensasjonPlanBestemmelse");
jest.mock("./Kode");

describe("DispensasjonFra", () => {
    it("should initialize with default values when no props are provided", () => {
        const instance = new DispensasjonFra({});
        expect(instance.bestemmelserType).toBeUndefined();
        expect(instance.dispensasjonPlanBestemmelse).toBeUndefined();
        expect(instance.lovbestemmelse).toBeUndefined();
    });

    it("should initialize bestemmelserType as a Kode instance when provided", () => {
        const props = { bestemmelserType: { code: "testCode" } };
        const instance = new DispensasjonFra(props);
        expect(Kode).toHaveBeenCalledWith(props.bestemmelserType);
        expect(instance.bestemmelserType).toBeInstanceOf(Kode);
    });

    it("should initialize dispensasjonPlanBestemmelse as a DispensasjonPlanBestemmelse instance when provided", () => {
        const props = { dispensasjonPlanBestemmelse: { id: "testId" } };
        const instance = new DispensasjonFra(props);
        expect(DispensasjonPlanBestemmelse).toHaveBeenCalledWith(props.dispensasjonPlanBestemmelse);
        expect(instance.dispensasjonPlanBestemmelse).toBeInstanceOf(DispensasjonPlanBestemmelse);
    });

    it("should initialize lovbestemmelse with the provided value", () => {
        const props = { lovbestemmelse: "testLovbestemmelse" };
        const instance = new DispensasjonFra(props);
        expect(instance.lovbestemmelse).toBe(props.lovbestemmelse);
    });

    it("should handle partial props correctly", () => {
        const props = { lovbestemmelse: "partialTest" };
        const instance = new DispensasjonFra(props);
        expect(instance.bestemmelserType).toBeUndefined();
        expect(instance.dispensasjonPlanBestemmelse).toBeUndefined();
        expect(instance.lovbestemmelse).toBe("partialTest");
    });
});
