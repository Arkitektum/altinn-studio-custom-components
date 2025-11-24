import GjenboerEiendom from "./GjenboerEiendom";
import Eiendom from "./Eiendom";

jest.mock("./Eiendom");

describe("GjenboerEiendom", () => {
    beforeEach(() => {
        Eiendom.mockClear();
    });

    it("should create an instance with matrikkelinformasjon and sluttbrukersystemReferanse", () => {
        const matrikkelinformasjon = { id: 123, name: "Test" };
        const sluttbrukersystemReferanse = "ref-456";

        const instance = new GjenboerEiendom({
            matrikkelinformasjon,
            sluttbrukersystemReferanse
        });

        expect(Eiendom).toHaveBeenCalledWith(matrikkelinformasjon);
        expect(instance.matrikkelinformasjon).toBeInstanceOf(Eiendom);
        expect(instance.sluttbrukersystemReferanse).toBe(sluttbrukersystemReferanse);
    });

    it("should set matrikkelinformasjon to undefined if not provided", () => {
        const instance = new GjenboerEiendom({});
        expect(instance.matrikkelinformasjon).toBeUndefined();
        expect(instance.sluttbrukersystemReferanse).toBeUndefined();
        expect(Eiendom).not.toHaveBeenCalled();
    });

    it("should handle missing props gracefully", () => {
        const instance = new GjenboerEiendom();
        expect(instance.matrikkelinformasjon).toBeUndefined();
        expect(instance.sluttbrukersystemReferanse).toBeUndefined();
        expect(Eiendom).not.toHaveBeenCalled();
    });

    it("should set only sluttbrukersystemReferanse if matrikkelinformasjon is not provided", () => {
        const sluttbrukersystemReferanse = "ref-789";
        const instance = new GjenboerEiendom({ sluttbrukersystemReferanse });
        expect(instance.matrikkelinformasjon).toBeUndefined();
        expect(instance.sluttbrukersystemReferanse).toBe(sluttbrukersystemReferanse);
        expect(Eiendom).not.toHaveBeenCalled();
    });
});
