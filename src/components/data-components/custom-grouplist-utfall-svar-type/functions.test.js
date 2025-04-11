import { groupArrayItemsByUtfallType } from "./functions";
import UtfallSvar from "../../../classes/data-classes/UtfallSvar";
import { hasValue } from "../../../functions/helpers";

jest.mock("../../../classes/data-classes/UtfallSvar");
jest.mock("../../../functions/helpers");

describe("groupArrayItemsByUtfallType", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should return an empty object if the input array is null or undefined", () => {
        hasValue.mockReturnValue(false);

        expect(groupArrayItemsByUtfallType(null)).toEqual({});
        expect(groupArrayItemsByUtfallType(undefined)).toEqual({});
        expect(hasValue).toHaveBeenCalledTimes(2);
    });

    it("should group items by `utfallType.kodeverdi`", () => {
        hasValue.mockReturnValue(true);

        const input = [
            { utfallType: { kodeverdi: "A" }, data: "item1" },
            { utfallType: { kodeverdi: "B" }, data: "item2" },
            { utfallType: { kodeverdi: "A" }, data: "item3" }
        ];

        const mockUtfallSvarInstances = [{ mockInstance: "item1" }, { mockInstance: "item2" }, { mockInstance: "item3" }];

        UtfallSvar.mockImplementation((obj) => {
            return mockUtfallSvarInstances.find((instance) => instance.mockInstance === obj.data);
        });

        const result = groupArrayItemsByUtfallType(input);

        expect(result).toEqual({
            A: [mockUtfallSvarInstances[0], mockUtfallSvarInstances[2]],
            B: [mockUtfallSvarInstances[1]]
        });

        expect(UtfallSvar).toHaveBeenCalledTimes(3);
        expect(UtfallSvar).toHaveBeenCalledWith(input[0]);
        expect(UtfallSvar).toHaveBeenCalledWith(input[1]);
        expect(UtfallSvar).toHaveBeenCalledWith(input[2]);
    });

    it("should skip items without a valid `utfallType.kodeverdi`", () => {
        hasValue.mockReturnValue(true);

        const input = [
            { utfallType: { kodeverdi: "A" }, data: "item1" },
            { data: "item2" }, // Missing `utfallType.kodeverdi`
            { utfallType: { kodeverdi: "" }, data: "item3" } // Empty `kodeverdi`
        ];

        const mockUtfallSvarInstances = [{ mockInstance: "item1" }];

        UtfallSvar.mockImplementation((obj) => {
            return mockUtfallSvarInstances.find((instance) => instance.mockInstance === obj.data);
        });

        const result = groupArrayItemsByUtfallType(input);

        expect(result).toEqual({
            A: [mockUtfallSvarInstances[0]]
        });

        expect(UtfallSvar).toHaveBeenCalledTimes(1);
        expect(UtfallSvar).toHaveBeenCalledWith(input[0]);
    });

    it("should return an empty object if the input array is empty", () => {
        hasValue.mockReturnValue(true);

        const result = groupArrayItemsByUtfallType([]);

        expect(result).toEqual({});
        expect(UtfallSvar).not.toHaveBeenCalled();
    });
});
