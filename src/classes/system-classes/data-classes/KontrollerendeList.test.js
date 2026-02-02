import KontrollerendeList from "./KontrollerendeList";
import { getTextResourceFromResourceBinding } from "../../../functions/helpers.js";

// Mock the getTextResourceFromResourceBinding function
jest.mock("../../../functions/helpers.js", () => ({
    getTextResourceFromResourceBinding: jest.fn((title) => `text-for-${title}`)
}));

describe("KontrollerendeList", () => {
    const resourceBindings = {
        harObserverteAvvik: { title: "observerte" },
        harAapneAvvik: { title: "aapne" },
        harIngenAvvik: { title: "ingen" }
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("returns correct text for harObserverteAvvik", () => {
        const kontrollerende = { harObserverteAvvik: true };
        const list = new KontrollerendeList(kontrollerende, resourceBindings);
        expect(list.resourceValues.data).toEqual(["text-for-observerte"]);
        expect(getTextResourceFromResourceBinding).toHaveBeenCalledWith("observerte");
    });

    it("returns correct text for harAapneAvvik", () => {
        const kontrollerende = { harAapneAvvik: true };
        const list = new KontrollerendeList(kontrollerende, resourceBindings);
        expect(list.resourceValues.data).toEqual(["text-for-aapne"]);
        expect(getTextResourceFromResourceBinding).toHaveBeenCalledWith("aapne");
    });

    it("returns correct text for harIngenAvvik", () => {
        const kontrollerende = { harIngenAvvik: true };
        const list = new KontrollerendeList(kontrollerende, resourceBindings);
        expect(list.resourceValues.data).toEqual(["text-for-ingen"]);
        expect(getTextResourceFromResourceBinding).toHaveBeenCalledWith("ingen");
    });

    it("returns all texts when all flags are true", () => {
        const kontrollerende = {
            harObserverteAvvik: true,
            harAapneAvvik: true,
            harIngenAvvik: true
        };
        const list = new KontrollerendeList(kontrollerende, resourceBindings);
        expect(list.resourceValues.data).toEqual(["text-for-observerte", "text-for-aapne", "text-for-ingen"]);
        expect(getTextResourceFromResourceBinding).toHaveBeenCalledWith("observerte");
        expect(getTextResourceFromResourceBinding).toHaveBeenCalledWith("aapne");
        expect(getTextResourceFromResourceBinding).toHaveBeenCalledWith("ingen");
    });

    it("returns empty array when no flags are true", () => {
        const kontrollerende = {
            harObserverteAvvik: false,
            harAapneAvvik: false,
            harIngenAvvik: false
        };
        const list = new KontrollerendeList(kontrollerende, resourceBindings);
        expect(list.resourceValues.data).toEqual([]);
        expect(getTextResourceFromResourceBinding).not.toHaveBeenCalled();
    });

    it("handles missing kontrollerende object", () => {
        const list = new KontrollerendeList(undefined, resourceBindings);
        expect(list.resourceValues.data).toEqual([]);
        expect(getTextResourceFromResourceBinding).not.toHaveBeenCalled();
    });

    it("handles missing resourceBindings", () => {
        const kontrollerende = { harObserverteAvvik: true, harAapneAvvik: true, harIngenAvvik: true };
        const list = new KontrollerendeList(kontrollerende, undefined);
        expect(list.resourceValues.data).toEqual(["text-for-undefined", "text-for-undefined", "text-for-undefined"]);
    });

    it("filters out nulls if some flags are not set", () => {
        const kontrollerende = { harAapneAvvik: true };
        const list = new KontrollerendeList(kontrollerende, resourceBindings);
        expect(list.resourceValues.data).toEqual(["text-for-aapne"]);
    });
});
