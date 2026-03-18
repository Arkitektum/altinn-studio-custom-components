import CustomComponent from "../CustomComponent";
import CustomHeader from "./CustomHeader";
import { hasValue } from "@arkitektum/altinn-studio-custom-components-utils";

jest.mock("@arkitektum/altinn-studio-custom-components-utils", () => ({
    hasValue: jest.fn()
}));

describe("CustomHeader", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    it("should extend CustomComponent", () => {
        const header = new CustomHeader({});
        expect(header instanceof CustomComponent).toBe(true);
    });

    it("should set resourceValues and size from props", () => {
        const props = {
            resourceValues: { title: "Header Title" },
            size: "large"
        };
        const header = new CustomHeader(props);
        expect(header.resourceValues).toBe(props.resourceValues);
        expect(header.size).toBe("large");
    });

    it("should set isEmpty to false when title has value", () => {
        hasValue.mockReturnValue(true);
        const props = { resourceValues: { title: "Header Title" } };
        const header = new CustomHeader(props);
        expect(header.isEmpty).toBe(false);
        expect(hasValue).toHaveBeenCalledWith("Header Title");
    });

    it("should set isEmpty to true when title is missing", () => {
        hasValue.mockReturnValue(false);
        const props = { resourceValues: {} };
        const header = new CustomHeader(props);
        expect(header.isEmpty).toBe(true);
        expect(hasValue).toHaveBeenCalledWith(undefined);
    });

    it("should set isEmpty to true when resourceValues is undefined", () => {
        hasValue.mockReturnValue(false);
        const props = {};
        const header = new CustomHeader(props);
        expect(header.isEmpty).toBe(true);
        expect(hasValue).toHaveBeenCalledWith(undefined);
    });

    describe("hasContent", () => {
        it("returns true if hasValue returns true", () => {
            hasValue.mockReturnValue(true);
            const header = new CustomHeader({});
            expect(header.hasContent({ resourceValues: { title: "Title" } })).toBe(true);
        });

        it("returns false if hasValue returns false", () => {
            hasValue.mockReturnValue(false);
            const header = new CustomHeader({});
            expect(header.hasContent({ resourceValues: { title: "" } })).toBe(false);
        });
    });
});
