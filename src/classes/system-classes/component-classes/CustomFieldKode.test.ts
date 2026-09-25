import type { ComponentProps } from "../../../types.ts";

import { getComponentDataValue, getComponentResourceValue } from "../../../functions/helpers.ts";
import CustomFieldKode from "./CustomFieldKode.ts";
import Kode from "../../data-classes/Kode.ts";
import { hasValue } from "@arkitektum/altinn-studio-custom-components-utils";

// Mocks
jest.mock("../../../functions/helpers.ts", () => ({
    getComponentDataValue: jest.fn(),
    getComponentResourceValue: jest.fn()
}));
jest.mock("../../data-classes/Kode.ts", () => {
    return jest.fn().mockImplementation((data) => data);
});
jest.mock("@arkitektum/altinn-studio-custom-components-utils", () => ({
    hasValue: jest.fn()
}));

describe("CustomFieldKode", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("hasContent", () => {
        it("returns true when hasValue returns true", () => {
            (hasValue as unknown as jest.Mock).mockReturnValue(true);
            const instance = new CustomFieldKode({});
            expect(instance.hasContent("someData")).toBe(true);
            expect(hasValue).toHaveBeenCalledWith("someData");
        });

        it("returns false when hasValue returns false", () => {
            (hasValue as unknown as jest.Mock).mockReturnValue(false);
            const instance = new CustomFieldKode({});
            expect(instance.hasContent("")).toBe(false);
            expect(hasValue).toHaveBeenCalledWith("");
        });
    });

    describe("formatKode", () => {
        const instance = new CustomFieldKode({});

        it('returns "<kodeverdi>: <kodebeskrivelse>" when both are present', () => {
            (hasValue as unknown as jest.Mock).mockImplementation((val) => !!val);
            const kode = { kodeverdi: "A", kodebeskrivelse: "Alpha" };
            expect(instance.formatKode(kode)).toBe("A: Alpha");
        });

        it("returns kodeverdi when only kodeverdi is present", () => {
            (hasValue as unknown as jest.Mock).mockImplementation((val) => !!val);
            const kode = { kodeverdi: "B", kodebeskrivelse: "" };
            expect(instance.formatKode(kode)).toBe("B");
        });

        it("returns kodebeskrivelse when only kodebeskrivelse is present", () => {
            (hasValue as unknown as jest.Mock).mockImplementation((val) => !!val);
            const kode = { kodeverdi: "", kodebeskrivelse: "Bravo" };
            expect(instance.formatKode(kode)).toBe("Bravo");
        });

        it("returns empty string when neither is present", () => {
            (hasValue as unknown as jest.Mock).mockReturnValue(false);
            const kode = { kodeverdi: "", kodebeskrivelse: "" };
            expect(instance.formatKode(kode)).toBe("");
        });
    });

    describe("getValueFromFormData", () => {
        it("calls getComponentDataValue and formats kode", () => {
            (getComponentDataValue as unknown as jest.Mock).mockReturnValue({ kodeverdi: "C", kodebeskrivelse: "Charlie" });
            (hasValue as unknown as jest.Mock).mockImplementation((val) => !!val);
            const instance = new CustomFieldKode({});
            const result = instance.getValueFromFormData({});
            expect(getComponentDataValue).toHaveBeenCalled();
            expect(Kode).toHaveBeenCalledWith({ kodeverdi: "C", kodebeskrivelse: "Charlie" });
            expect(result).toBe("C: Charlie");
        });
    });

    describe("constructor", () => {
        it("sets isEmpty and resourceValues correctly when data is present", () => {
            (getComponentDataValue as unknown as jest.Mock).mockReturnValue({ kodeverdi: "D", kodebeskrivelse: "Delta" });
            (hasValue as unknown as jest.Mock).mockImplementation((val) => !!val);
            (getComponentResourceValue as unknown as jest.Mock).mockImplementation((props, key) => key + "_resource");
            const props = { some: "prop" } as unknown as ComponentProps;
            const instance = new CustomFieldKode(props);

            expect(instance.isEmpty).toBe(false);
            expect(instance.resourceValues.title).toBe("title_resource");
            expect(instance.resourceValues.data).toBe("D: Delta");
        });

        it("sets isEmpty and resourceValues correctly when data is empty", () => {
            (getComponentDataValue as unknown as jest.Mock).mockReturnValue({ kodeverdi: "", kodebeskrivelse: "" });
            (hasValue as unknown as jest.Mock).mockReturnValue(false);
            (getComponentResourceValue as unknown as jest.Mock).mockImplementation((props, key) => key + "_resource");
            const props = { some: "prop" } as unknown as ComponentProps;
            const instance = new CustomFieldKode(props);

            expect(instance.isEmpty).toBe(true);
            expect(instance.resourceValues.title).toBe("title_resource");
            expect(instance.resourceValues.data).toBe("emptyFieldText_resource");
        });
    });
});
