import CustomHeader from "./CustomHeader";
import CustomComponent from "../CustomComponent";
import * as helpers from "../../../functions/helpers";

describe("CustomHeader", () => {
    beforeEach(() => {
        jest.spyOn(helpers, "hasValue");
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
        helpers.hasValue.mockReturnValue(true);
        const props = { resourceValues: { title: "Header Title" } };
        const header = new CustomHeader(props);
        expect(header.isEmpty).toBe(false);
        expect(helpers.hasValue).toHaveBeenCalledWith("Header Title");
    });

    it("should set isEmpty to true when title is missing", () => {
        helpers.hasValue.mockReturnValue(false);
        const props = { resourceValues: {} };
        const header = new CustomHeader(props);
        expect(header.isEmpty).toBe(true);
        expect(helpers.hasValue).toHaveBeenCalledWith(undefined);
    });

    it("should set isEmpty to true when resourceValues is undefined", () => {
        helpers.hasValue.mockReturnValue(false);
        const props = {};
        const header = new CustomHeader(props);
        expect(header.isEmpty).toBe(true);
        expect(helpers.hasValue).toHaveBeenCalledWith(undefined);
    });

    describe("hasContent", () => {
        it("returns true if hasValue returns true", () => {
            helpers.hasValue.mockReturnValue(true);
            const header = new CustomHeader({});
            expect(header.hasContent({ resourceValues: { title: "Title" } })).toBe(true);
        });

        it("returns false if hasValue returns false", () => {
            helpers.hasValue.mockReturnValue(false);
            const header = new CustomHeader({});
            expect(header.hasContent({ resourceValues: { title: "" } })).toBe(false);
        });
    });
});
