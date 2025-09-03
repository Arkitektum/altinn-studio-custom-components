import EiendomByggested from "./EiendomByggested";
import Eiendom from "./Eiendom";

// Import the class to test

// Mock the Eiendom class
jest.mock("./Eiendom");

describe("EiendomByggested", () => {
    beforeEach(() => {
        // Clear all instances and calls to constructor and methods
        Eiendom.mockClear();
    });

    it("should initialize with an empty eiendom array when no props are provided", () => {
        const instance = new EiendomByggested({});
        expect(instance.eiendom).toBeUndefined();
    });

    it("should map the provided eiendom array to Eiendom instances", () => {
        const mockEiendomData = [{ id: 1 }, { id: 2 }];
        new EiendomByggested({ eiendom: mockEiendomData });

        expect(Eiendom).toHaveBeenCalledTimes(mockEiendomData.length);
        mockEiendomData.forEach((data, index) => {
            expect(Eiendom).toHaveBeenNthCalledWith(index + 1, data);
        });
    });

    it("should handle undefined props gracefully", () => {
        const instance = new EiendomByggested();
        expect(instance.eiendom).toBeUndefined();
    });

    it("should handle an empty eiendom array", () => {
        const instance = new EiendomByggested({ eiendom: [] });
        expect(instance.eiendom).toEqual([]);
        expect(Eiendom).not.toHaveBeenCalled();
    });
});
