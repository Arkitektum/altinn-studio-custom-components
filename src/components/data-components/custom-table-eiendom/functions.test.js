import { getEiendomList } from "./functions";
import Eiendom from "../../../classes/data-classes/Eiendom";
import { hasValue } from "../../../functions/helpers";

jest.mock("../../../classes/data-classes/Eiendom");
jest.mock("../../../functions/helpers");

describe("getEiendomList", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should return an array of Eiendom objects when formData.data is valid", () => {
        const mockData = [{ id: 1 }, { id: 2 }];
        const component = { formData: { data: mockData } };
        hasValue.mockReturnValue(true);
        Eiendom.mockImplementation((data) => data);

        const result = getEiendomList(component);

        expect(hasValue).toHaveBeenCalledWith(mockData);
        expect(Eiendom).toHaveBeenCalledTimes(mockData.length);
        expect(Eiendom).toHaveBeenCalledWith(mockData[0]);
        expect(Eiendom).toHaveBeenCalledWith(mockData[1]);
        expect(result).toEqual(mockData);
    });

    it("should return undefined when formData.data is not valid", () => {
        const component = { formData: { data: null } };
        hasValue.mockReturnValue(false);

        const result = getEiendomList(component);

        expect(hasValue).toHaveBeenCalledWith(null);
        expect(Eiendom).not.toHaveBeenCalled();
        expect(result).toBeUndefined();
    });

    it("should return undefined when component.formData is undefined", () => {
        const component = {};
        hasValue.mockReturnValue(false);

        const result = getEiendomList(component);

        expect(hasValue).toHaveBeenCalledWith(undefined);
        expect(Eiendom).not.toHaveBeenCalled();
        expect(result).toBeUndefined();
    });

    it("should return undefined when component is undefined", () => {
        hasValue.mockReturnValue(false);

        const result = getEiendomList(undefined);

        expect(hasValue).toHaveBeenCalledWith(undefined);
        expect(Eiendom).not.toHaveBeenCalled();
        expect(result).toBeUndefined();
    });
});
