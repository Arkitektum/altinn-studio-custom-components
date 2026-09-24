import type { ComponentProps } from "../../../types.ts";

import { getComponentDataValue, getComponentResourceValue } from "../../../functions/helpers.ts";
import CustomListVedlegg from "./CustomListVedlegg.ts";
import Vedlegg from "../../data-classes/Vedlegg.ts";
import { hasValue } from "@arkitektum/altinn-studio-custom-components-utils";

// Mocks for global functions
jest.mock("../../../functions/helpers.ts", () => ({
    getComponentDataValue: jest.fn(),
    getComponentResourceValue: jest.fn()
}));

jest.mock("@arkitektum/altinn-studio-custom-components-utils", () => ({
    hasValue: jest.fn()
}));

describe("CustomListVedlegg", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("constructor", () => {
        it("sets isEmpty and resourceValues when data is empty", () => {
            (getComponentDataValue as unknown as jest.Mock).mockReturnValue([]);
            (hasValue as unknown as jest.Mock).mockReturnValue(false);
            (getComponentResourceValue as unknown as jest.Mock).mockImplementation((props, key) => props[key]);

            const props = { title: "Title", emptyFieldText: "No attachments" };
            const instance = new CustomListVedlegg(props as unknown as ComponentProps);

            expect(instance.isEmpty).toBe(true);
            expect(instance.resourceValues).toEqual({
                title: "Title",
                data: "No attachments"
            });
        });

        it("sets isEmpty and resourceValues when data is present", () => {
            (getComponentDataValue as unknown as jest.Mock).mockReturnValue([{ filnavn: "file.pdf" }]);
            (hasValue as unknown as jest.Mock).mockReturnValue(true);
            (getComponentResourceValue as unknown as jest.Mock).mockImplementation((props, key) => props[key]);

            const props = { title: "Title", emptyFieldText: "No attachments" };
            const instance = new CustomListVedlegg(props as unknown as ComponentProps);

            expect(instance.isEmpty).toBe(false);
            expect(instance.resourceValues.title).toBe("Title");
            expect(Array.isArray(instance.resourceValues.data)).toBe(true);
        });
    });

    describe("hasContent", () => {
        it("delegates to hasValue", () => {
            (hasValue as unknown as jest.Mock).mockReturnValue(true);
            const instance = new CustomListVedlegg({});
            expect(instance.hasContent("data")).toBe(true);
            expect(hasValue).toHaveBeenCalledWith("data");
        });
    });

    describe("getAttachmentFileName", () => {
        it("returns filnavn if present", () => {
            const instance = new CustomListVedlegg({});
            expect(instance.getAttachmentFileName({ filnavn: "file.pdf" })).toBe("file.pdf");
        });

        it("returns undefined if filnavn is missing", () => {
            const instance = new CustomListVedlegg({});
            expect(instance.getAttachmentFileName({})).toBeUndefined();
        });
    });

    describe("getAttachmentDescription", () => {
        it("returns kodebeskrivelse if present", () => {
            const instance = new CustomListVedlegg({});
            expect(instance.getAttachmentDescription({ vedleggstype: { kodebeskrivelse: "desc" } })).toBe("desc");
        });

        it("returns undefined if vedleggstype or kodebeskrivelse is missing", () => {
            const instance = new CustomListVedlegg({});
            expect(instance.getAttachmentDescription({})).toBeUndefined();
            expect(instance.getAttachmentDescription({ vedleggstype: {} })).toBeUndefined();
        });
    });

    describe("getAttachmentListItems", () => {
        it("returns empty array if attachments is falsy or not array", () => {
            const instance = new CustomListVedlegg({});
            expect(instance.getAttachmentListItems(null)).toEqual([]);
            expect(instance.getAttachmentListItems(undefined)).toEqual([]);
            expect(instance.getAttachmentListItems({})).toEqual([]);
        });

        it("returns formatted list items for attachments", () => {
            // Patch Vedlegg to just return the input for testing
            jest.spyOn(Vedlegg.prototype as unknown as { constructor: (obj: unknown) => unknown }, "constructor").mockImplementation(
                (obj: unknown) => obj
            );

            const instance = new CustomListVedlegg({});
            const attachments = [
                {
                    filnavn: "file1.pdf",
                    vedleggstype: { kodebeskrivelse: "Type1" }
                },
                {
                    filnavn: "file2.pdf"
                },
                {
                    vedleggstype: { kodebeskrivelse: "Type2" }
                },
                {
                    // Neither filnavn nor vedleggstype
                }
            ];
            const result = instance.getAttachmentListItems(attachments);
            expect(result).toEqual(["Type1 (file1.pdf)", "file2.pdf", "Type2"]);
        });
    });

    describe("getValueFromFormData", () => {
        it("returns attachment list items from form data", () => {
            (getComponentDataValue as unknown as jest.Mock).mockReturnValue([{ filnavn: "file.pdf", vedleggstype: { kodebeskrivelse: "desc" } }]);
            const instance = new CustomListVedlegg({});
            // Patch Vedlegg to just return the input for testing
            jest.spyOn(Vedlegg.prototype as unknown as { constructor: (obj: unknown) => unknown }, "constructor").mockImplementation(
                (obj: unknown) => obj
            );

            const result = instance.getValueFromFormData({}) as unknown[];
            expect(result).toEqual(["desc (file.pdf)"]);
        });
    });
});
