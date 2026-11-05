import Rolleendring from "./Rolleendring.ts";
import Rolleendringer from "./Rolleendringer.ts";

// Mock the Rolleendring class
jest.mock("./Rolleendring");

describe("Rolleendringer", () => {
    beforeEach(() => {
        (Rolleendring as unknown as jest.Mock).mockClear();
    });

    it("should map the provided rolleendring array to Rolleendring instances", () => {
        const mockRolleendringData = [{ id: 1 }, { id: 2 }];
        new Rolleendringer({ rolleendring: mockRolleendringData });

        expect(Rolleendring).toHaveBeenCalledTimes(mockRolleendringData.length);
        mockRolleendringData.forEach((data, index) => {
            expect(Rolleendring).toHaveBeenNthCalledWith(index + 1, data);
        });
    });

    it("should handle undefined props gracefully", () => {
        expect(new Rolleendringer().rolleendring).toBeUndefined();
        expect(new Rolleendringer({}).rolleendring).toBeUndefined();
    });

    it("should handle an empty rolleendring array", () => {
        expect(new Rolleendringer({ rolleendring: [] }).rolleendring).toEqual([]);
        expect(Rolleendring).not.toHaveBeenCalled();
    });
});
