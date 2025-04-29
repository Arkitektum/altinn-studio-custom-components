import SoeknadGjelder from "./SoeknadGjelder";
import Kode from "./Kode";
import { hasValue } from "../../functions/helpers";

jest.mock("./Kode");
jest.mock("../../functions/helpers");

describe("SoeknadGjelder", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("constructor", () => {
        it("should initialize type when props are provided", () => {
            const mockProps = { type: { kode: ["code1", "code2"] } };
            hasValue.mockReturnValue(true);
            Kode.mockImplementation((item) => ({ value: item }));

            const instance = new SoeknadGjelder(mockProps);

            expect(instance.type).toEqual({
                kode: [{ value: "code1" }, { value: "code2" }]
            });
        });

        it("should not initialize type when props are not provided", () => {
            const instance = new SoeknadGjelder();

            expect(instance.type).toBeUndefined();
        });
    });

    describe("getTypeFromProps", () => {
        it("should return type object when props.type is valid", () => {
            const mockProps = { type: { kode: ["code1", "code2"] } };
            hasValue.mockReturnValue(true);
            Kode.mockImplementation((item) => ({ value: item }));

            const instance = new SoeknadGjelder();
            const result = instance.getTypeFromProps(mockProps);

            expect(result).toEqual({
                kode: [{ value: "code1" }, { value: "code2" }]
            });
        });

        it("should return null when props.type is invalid", () => {
            const mockProps = { type: null };
            hasValue.mockReturnValue(false);

            const instance = new SoeknadGjelder();
            const result = instance.getTypeFromProps(mockProps);

            expect(result).toBeNull();
        });
    });

    describe("getKodeFromType", () => {
        it("should return an array of Kode instances when type.kode is valid", () => {
            const mockType = { kode: ["code1", "code2"] };
            Kode.mockImplementation((item) => ({ value: item }));

            const instance = new SoeknadGjelder();
            const result = instance.getKodeFromType(mockType);

            expect(result).toEqual([{ value: "code1" }, { value: "code2" }]);
            expect(Kode).toHaveBeenCalledTimes(2);
            expect(Kode).toHaveBeenCalledWith("code1");
            expect(Kode).toHaveBeenCalledWith("code2");
        });

        it("should return null when type.kode is invalid", () => {
            const mockType = { kode: null };

            const instance = new SoeknadGjelder();
            const result = instance.getKodeFromType(mockType);

            expect(result).toBeNull();
        });

        it("should return null when type.kode is an empty array", () => {
            const mockType = { kode: [] };

            const instance = new SoeknadGjelder();
            const result = instance.getKodeFromType(mockType);

            expect(result).toBeNull();
        });
    });
});
