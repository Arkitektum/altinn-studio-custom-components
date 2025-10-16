import CustomFieldKode from "./CustomFieldKode";
import { getComponentDataValue, getComponentResourceValue, hasValue } from "../../../functions/helpers.js";
import Kode from "../../data-classes/Kode.js";

// Mocks
jest.mock("../../../functions/helpers.js", () => ({
    getComponentDataValue: jest.fn(),
    getComponentResourceValue: jest.fn(),
    hasValue: jest.fn()
}));
jest.mock("../../data-classes/Kode.js", () => {
    return jest.fn().mockImplementation((data) => data);
});

describe("CustomFieldKode", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("hasContent", () => {
        it("returns true when hasValue returns true", () => {
            hasValue.mockReturnValue(true);
            const instance = new CustomFieldKode({});
            expect(instance.hasContent("someData")).toBe(true);
            expect(hasValue).toHaveBeenCalledWith("someData");
        });

        it("returns false when hasValue returns false", () => {
            hasValue.mockReturnValue(false);
            const instance = new CustomFieldKode({});
            expect(instance.hasContent("")).toBe(false);
            expect(hasValue).toHaveBeenCalledWith("");
        });
    });

    describe("formatKode", () => {
        const instance = new CustomFieldKode({});

        it('returns "<kodeverdi>: <kodebeskrivelse>" when both are present', () => {
            hasValue.mockImplementation((val) => !!val);
            const kode = { kodeverdi: "A", kodebeskrivelse: "Alpha" };
            expect(instance.formatKode(kode)).toBe("A: Alpha");
        });

        it("returns kodeverdi when only kodeverdi is present", () => {
            hasValue.mockImplementation((val) => !!val);
            const kode = { kodeverdi: "B", kodebeskrivelse: "" };
            expect(instance.formatKode(kode)).toBe("B");
        });

        it("returns kodebeskrivelse when only kodebeskrivelse is present", () => {
            hasValue.mockImplementation((val) => !!val);
            const kode = { kodeverdi: "", kodebeskrivelse: "Bravo" };
            expect(instance.formatKode(kode)).toBe("Bravo");
        });

        it("returns empty string when neither is present", () => {
            hasValue.mockReturnValue(false);
            const kode = { kodeverdi: "", kodebeskrivelse: "" };
            expect(instance.formatKode(kode)).toBe("");
        });
    });

    describe("getValueFromFormData", () => {
        it("calls getComponentDataValue and formats kode", () => {
            getComponentDataValue.mockReturnValue({ kodeverdi: "C", kodebeskrivelse: "Charlie" });
            hasValue.mockImplementation((val) => !!val);
            const instance = new CustomFieldKode({});
            const result = instance.getValueFromFormData({});
            expect(getComponentDataValue).toHaveBeenCalled();
            expect(Kode).toHaveBeenCalledWith({ kodeverdi: "C", kodebeskrivelse: "Charlie" });
            expect(result).toBe("C: Charlie");
        });
    });

    describe("constructor", () => {
        it("sets isEmpty and resourceValues correctly when data is present", () => {
            getComponentDataValue.mockReturnValue({ kodeverdi: "D", kodebeskrivelse: "Delta" });
            hasValue.mockImplementation((val) => !!val);
            getComponentResourceValue.mockImplementation((props, key) => key + "_resource");
            const props = { some: "prop" };
            const instance = new CustomFieldKode(props);

            expect(instance.isEmpty).toBe(false);
            expect(instance.resourceValues.title).toBe("title_resource");
            expect(instance.resourceValues.data).toBe("D: Delta");
        });

        it("sets isEmpty and resourceValues correctly when data is empty", () => {
            getComponentDataValue.mockReturnValue({ kodeverdi: "", kodebeskrivelse: "" });
            hasValue.mockReturnValue(false);
            getComponentResourceValue.mockImplementation((props, key) => key + "_resource");
            const props = { some: "prop" };
            const instance = new CustomFieldKode(props);

            expect(instance.isEmpty).toBe(true);
            expect(instance.resourceValues.title).toBe("title_resource");
            expect(instance.resourceValues.data).toBe("emptyFieldText_resource");
        });
    });
});
