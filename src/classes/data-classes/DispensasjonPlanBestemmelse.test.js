import DispensasjonPlanBestemmelse from "./DispensasjonPlanBestemmelse";
import NasjonalArealplanId from "./NasjonalArealplanId";
import Planbestemmelse from "./Planbestemmelse";

jest.mock("./NasjonalArealplanId");
jest.mock("./Planbestemmelse");

describe("DispensasjonPlanBestemmelse", () => {
    it("should initialize with default values when no props are provided", () => {
        const instance = new DispensasjonPlanBestemmelse();
        expect(instance.navn).toBeUndefined();
        expect(instance.nasjonalArealplanId).toBeUndefined();
        expect(instance.planbestemmelse).toBeUndefined();
    });

    it("should initialize with provided navn", () => {
        const props = { navn: "Test Navn" };
        const instance = new DispensasjonPlanBestemmelse(props);
        expect(instance.navn).toBe("Test Navn");
    });

    it("should initialize nasjonalArealplanId as an instance of NasjonalArealplanId when provided", () => {
        const nasjonalArealplanIdProps = { id: "123" };
        NasjonalArealplanId.mockImplementation(() => nasjonalArealplanIdProps);

        const props = { nasjonalArealplanId: nasjonalArealplanIdProps };
        const instance = new DispensasjonPlanBestemmelse(props);

        expect(NasjonalArealplanId).toHaveBeenCalledWith(nasjonalArealplanIdProps);
        expect(instance.nasjonalArealplanId).toEqual(nasjonalArealplanIdProps);
    });

    it("should initialize planbestemmelse as an instance of Planbestemmelse when provided", () => {
        const planbestemmelseProps = { type: "Test Type" };
        Planbestemmelse.mockImplementation(() => planbestemmelseProps);

        const props = { planbestemmelse: planbestemmelseProps };
        const instance = new DispensasjonPlanBestemmelse(props);

        expect(Planbestemmelse).toHaveBeenCalledWith(planbestemmelseProps);
        expect(instance.planbestemmelse).toEqual(planbestemmelseProps);
    });

    it("should handle partial props correctly", () => {
        const props = { navn: "Partial Test" };
        const instance = new DispensasjonPlanBestemmelse(props);

        expect(instance.navn).toBe("Partial Test");
        expect(instance.nasjonalArealplanId).toBeUndefined();
        expect(instance.planbestemmelse).toBeUndefined();
    });
});