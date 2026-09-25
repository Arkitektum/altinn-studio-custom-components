import CustomComponent from "../CustomComponent.ts";
import CustomHeader from "./CustomHeader.ts";
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
        (hasValue as unknown as jest.Mock).mockReturnValue(true);
        const props = { resourceValues: { title: "Header Title" } };
        const header = new CustomHeader(props);
        expect(header.isEmpty).toBe(false);
        expect(hasValue).toHaveBeenCalledWith("Header Title");
    });

    it("should set isEmpty to true when title is missing", () => {
        (hasValue as unknown as jest.Mock).mockReturnValue(false);
        const props = { resourceValues: {} };
        const header = new CustomHeader(props);
        expect(header.isEmpty).toBe(true);
        expect(hasValue).toHaveBeenCalledWith(undefined);
    });

    it("should set isEmpty to true when resourceValues is undefined", () => {
        (hasValue as unknown as jest.Mock).mockReturnValue(false);
        const props = {};
        const header = new CustomHeader(props);
        expect(header.isEmpty).toBe(true);
        expect(hasValue).toHaveBeenCalledWith(undefined);
    });

    describe("hasContent", () => {
        it("returns true if hasValue returns true", () => {
            (hasValue as unknown as jest.Mock).mockReturnValue(true);
            const header = new CustomHeader({});
            expect(header.hasContent({ resourceValues: { title: "Title" } })).toBe(true);
        });

        it("returns false if hasValue returns false", () => {
            (hasValue as unknown as jest.Mock).mockReturnValue(false);
            const header = new CustomHeader({});
            expect(header.hasContent({ resourceValues: { title: "" } })).toBe(false);
        });
    });
});
