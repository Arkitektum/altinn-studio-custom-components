import { getAttachmentListItems } from "./functions";
import Vedlegg from "../../../classes/data-classes/Vedlegg.js";

jest.mock("../../../classes/data-classes/Vedlegg.js");

describe("getAttachmentListItems", () => {
    beforeEach(() => {
        Vedlegg.mockImplementation((attachment) => attachment);
    });

    it("should return a formatted list of attachment descriptions and filenames", () => {
        const attachments = [
            { vedleggstype: { kodebeskrivelse: "Description 1" }, filnavn: "file1.txt" },
            { vedleggstype: { kodebeskrivelse: "Description 2" }, filnavn: "file2.txt" }
        ];
        const result = getAttachmentListItems(attachments);
        expect(result).toEqual(["Description 1 (file1.txt)", "Description 2 (file2.txt)"]);
    });

    it("should return only descriptions if filenames are missing", () => {
        const attachments = [{ vedleggstype: { kodebeskrivelse: "Description 1" } }, { vedleggstype: { kodebeskrivelse: "Description 2" } }];
        const result = getAttachmentListItems(attachments);
        expect(result).toEqual(["Description 1", "Description 2"]);
    });

    it("should return only filenames if descriptions are missing", () => {
        const attachments = [{ filnavn: "file1.txt" }, { filnavn: "file2.txt" }];
        const result = getAttachmentListItems(attachments);
        expect(result).toEqual(["file1.txt", "file2.txt"]);
    });

    it("should filter out attachments with neither description nor filename", () => {
        const attachments = [{ vedleggstype: { kodebeskrivelse: "Description 1" }, filnavn: "file1.txt" }, {}];
        const result = getAttachmentListItems(attachments);
        expect(result).toEqual(["Description 1 (file1.txt)"]);
    });

    it("should return an empty array if no attachments are provided", () => {
        const result = getAttachmentListItems([]);
        expect(result).toEqual([]);
    });

    it("should return undefined if attachments is not an array", () => {
        const result = getAttachmentListItems(null);
        expect(result).toBeUndefined();
    });
});
