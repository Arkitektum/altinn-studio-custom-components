import CustomFieldAdresse from "./CustomFieldAdresse";

// Mocks
const mockGetComponentDataValue = jest.fn();
const mockGetComponentResourceValue = jest.fn();
const mockHasValue = jest.fn();
const mockAdresse = function (data) {
    return data;
};

// Mock dependencies
jest.mock("../../data-classes/Adresse.js", () => {
    return jest.fn((data) => data);
});
jest.mock("../../../functions/helpers.js", () => ({
    getComponentDataValue: jest.fn(),
    getComponentResourceValue: jest.fn(),
    hasValue: jest.fn()
}));

describe("CustomFieldAdresse", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("formatAdresselinje", () => {
        it("formats address lines with all lines present", () => {
            const instance = new CustomFieldAdresse({});
            const adresse = {
                adresselinje1: "Line 1",
                adresselinje2: "Line 2",
                adresselinje3: "Line 3"
            };
            expect(instance.formatAdresselinje(adresse)).toBe("Line 1\nLine 2\nLine 3");
        });

        it("formats address lines with some lines missing", () => {
            const instance = new CustomFieldAdresse({});
            const adresse = {
                adresselinje1: "Line 1",
                adresselinje2: "",
                adresselinje3: "Line 3"
            };
            expect(instance.formatAdresselinje(adresse)).toBe("Line 1\nLine 3");
        });

        it("returns empty string if all lines are missing", () => {
            const instance = new CustomFieldAdresse({});
            const adresse = {
                adresselinje1: "",
                adresselinje2: "",
                adresselinje3: ""
            };
            expect(instance.formatAdresselinje(adresse)).toBe("");
        });
    });

    describe("formatZipCity", () => {
        it("formats zip and city when both are present", () => {
            const instance = new CustomFieldAdresse({});
            const adresse = { postnr: "1234", poststed: "Oslo" };
            expect(instance.formatZipCity(adresse)).toBe("1234 Oslo");
        });

        it("formats zip and city when only zip is present", () => {
            const instance = new CustomFieldAdresse({});
            const adresse = { postnr: "1234", poststed: "" };
            expect(instance.formatZipCity(adresse)).toBe("1234");
        });

        it("formats zip and city when only city is present", () => {
            const instance = new CustomFieldAdresse({});
            const adresse = { postnr: "", poststed: "Oslo" };
            expect(instance.formatZipCity(adresse)).toBe("Oslo");
        });

        it("returns empty string if both are missing", () => {
            const instance = new CustomFieldAdresse({});
            const adresse = { postnr: "", poststed: "" };
            expect(instance.formatZipCity(adresse)).toBe("");
        });
    });

    describe("formatAdresse", () => {
        it("formats full address with lines and zip/city", () => {
            const instance = new CustomFieldAdresse({});
            const adresse = {
                adresselinje1: "Line 1",
                adresselinje2: "",
                adresselinje3: "Line 3",
                postnr: "1234",
                poststed: "Oslo"
            };
            expect(instance.formatAdresse(adresse)).toBe("Line 1\nLine 3\n1234 Oslo");
        });

        it("formats address with only zip/city", () => {
            const instance = new CustomFieldAdresse({});
            const adresse = {
                adresselinje1: "",
                adresselinje2: "",
                adresselinje3: "",
                postnr: "1234",
                poststed: "Oslo"
            };
            expect(instance.formatAdresse(adresse)).toBe("1234 Oslo");
        });

        it("formats address with only address lines", () => {
            const instance = new CustomFieldAdresse({});
            const adresse = {
                adresselinje1: "Line 1",
                adresselinje2: "",
                adresselinje3: "",
                postnr: "",
                poststed: ""
            };
            expect(instance.formatAdresse(adresse)).toBe("Line 1");
        });

        it("returns empty string if all fields are missing", () => {
            const instance = new CustomFieldAdresse({});
            const adresse = {
                adresselinje1: "",
                adresselinje2: "",
                adresselinje3: "",
                postnr: "",
                poststed: ""
            };
            expect(instance.formatAdresse(adresse)).toBe("");
        });
    });

    describe("getValueFromFormData", () => {
        it("returns formatted address from form data", () => {
            const props = {};
            const data = {
                adresselinje1: "Line 1",
                adresselinje2: "",
                adresselinje3: "Line 3",
                postnr: "1234",
                poststed: "Oslo"
            };
            require("../../../functions/helpers.js").getComponentDataValue.mockReturnValue(data);
            const instance = new CustomFieldAdresse(props);
            expect(instance.getValueFromFormData(props)).toBe("Line 1\nLine 3\n1234 Oslo");
        });
    });

    describe("hasContent", () => {
        it("returns true if hasValue returns true", () => {
            require("../../../functions/helpers.js").hasValue.mockReturnValue(true);
            const instance = new CustomFieldAdresse({});
            expect(instance.hasContent({})).toBe(true);
        });

        it("returns false if hasValue returns false", () => {
            require("../../../functions/helpers.js").hasValue.mockReturnValue(false);
            const instance = new CustomFieldAdresse({});
            expect(instance.hasContent({})).toBe(false);
        });
    });

    describe("constructor", () => {
        it("sets isEmpty and resourceValues correctly when address is present", () => {
            const props = { some: "prop" };
            const data = {
                adresselinje1: "Line 1",
                adresselinje2: "",
                adresselinje3: "",
                postnr: "1234",
                poststed: "Oslo"
            };
            require("../../../functions/helpers.js").getComponentDataValue.mockReturnValue(data);
            require("../../../functions/helpers.js").hasValue.mockReturnValue(true);
            require("../../../functions/helpers.js").getComponentResourceValue.mockImplementation((p, key) =>
                key === "title" ? "Title" : "Empty"
            );

            const instance = new CustomFieldAdresse(props);
            expect(instance.isEmpty).toBe(false);
            expect(instance.resourceValues.title).toBe("Title");
            expect(instance.resourceValues.data).toBe("Line 1\n1234 Oslo");
        });

        it("sets isEmpty and resourceValues correctly when address is empty", () => {
            const props = { some: "prop" };
            const data = {
                adresselinje1: "",
                adresselinje2: "",
                adresselinje3: "",
                postnr: "",
                poststed: ""
            };
            require("../../../functions/helpers.js").getComponentDataValue.mockReturnValue(data);
            require("../../../functions/helpers.js").hasValue.mockReturnValue(false);
            require("../../../functions/helpers.js").getComponentResourceValue.mockImplementation((p, key) =>
                key === "title" ? "Title" : "Empty"
            );

            const instance = new CustomFieldAdresse(props);
            expect(instance.isEmpty).toBe(true);
            expect(instance.resourceValues.title).toBe("Title");
            expect(instance.resourceValues.data).toBe("Empty");
        });
    });
});
