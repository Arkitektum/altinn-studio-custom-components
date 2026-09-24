import GjenboerEiendomByggested from "./GjenboerEiendomByggested.ts";
import NaboGjenboerEiendom from "./NaboGjenboerEiendom.ts";
import Part from "./Part.ts";
import Respons from "./Respons.ts";

jest.mock("./GjenboerEiendomByggested");
jest.mock("./Part");
jest.mock("./Respons");

describe("NaboGjenboerEiendom", () => {
    beforeEach(() => {
        (GjenboerEiendomByggested as unknown as jest.Mock).mockClear();
        (Part as unknown as jest.Mock).mockClear();
        (Respons as unknown as jest.Mock).mockClear();
    });

    it("should initialize eiendommer, eier, and respons when props are provided", () => {
        const eiendommerData = { id: 1 };
        const eierData = { name: "John" };
        const responsData = { status: "ok" };

        const instance = new NaboGjenboerEiendom({
            eiendommer: eiendommerData,
            eier: eierData,
            respons: responsData
        });

        expect(GjenboerEiendomByggested).toHaveBeenCalledWith(eiendommerData);
        expect(Part).toHaveBeenCalledWith(eierData);
        expect(Respons).toHaveBeenCalledWith(responsData);

        expect(instance.eiendommer).toBeInstanceOf(GjenboerEiendomByggested);
        expect(instance.eier).toBeInstanceOf(Part);
        expect(instance.respons).toBeInstanceOf(Respons);
    });

    it("should set properties to undefined if not provided", () => {
        const instance = new NaboGjenboerEiendom({});
        expect(instance.eiendommer).toBeUndefined();
        expect(instance.eier).toBeUndefined();
        expect(instance.respons).toBeUndefined();
    });

    it("should only initialize provided properties", () => {
        const eiendommerData = { id: 2 };
        const instance = new NaboGjenboerEiendom({ eiendommer: eiendommerData });

        expect(GjenboerEiendomByggested).toHaveBeenCalledWith(eiendommerData);
        expect(Part).not.toHaveBeenCalled();
        expect(Respons).not.toHaveBeenCalled();

        expect(instance.eiendommer).toBeInstanceOf(GjenboerEiendomByggested);
        expect(instance.eier).toBeUndefined();
        expect(instance.respons).toBeUndefined();
    });

    it("should handle undefined props gracefully", () => {
        const instance = new NaboGjenboerEiendom();
        expect(instance.eiendommer).toBeUndefined();
        expect(instance.eier).toBeUndefined();
        expect(instance.respons).toBeUndefined();
    });
});
