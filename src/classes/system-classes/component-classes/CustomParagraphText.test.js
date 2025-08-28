import CustomParagraphText from "./CustomParagraphText";
import { getComponentResourceValue, hasValue } from "../../../functions/helpers.js";

// Mock dependencies
jest.mock("../../../functions/helpers.js", () => ({
    getComponentResourceValue: jest.fn(),
    hasValue: jest.fn()
}));

// Dummy CustomComponent base class to avoid import errors
class CustomComponent {
    constructor(props) {
        this.props = props;
    }
}

describe("CustomParagraphText", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should set resourceValues.title to the localized title if available", () => {
        getComponentResourceValue.mockReturnValue("Localized Title");
        hasValue.mockReturnValue(true);

        const props = { text: "Fallback Text" };
        const instance = new CustomParagraphText(props);

        expect(getComponentResourceValue).toHaveBeenCalledWith(props, "title");
        expect(hasValue).toHaveBeenCalledWith("Localized Title");
        expect(instance.resourceValues.title).toBe("Localized Title");
    });

    it("should set resourceValues.title to the fallback text if localized title is not available", () => {
        getComponentResourceValue.mockReturnValue(undefined);
        hasValue.mockReturnValue(false);

        const props = { text: "Fallback Text" };
        const instance = new CustomParagraphText(props);

        expect(getComponentResourceValue).toHaveBeenCalledWith(props, "title");
        expect(hasValue).toHaveBeenCalledWith(undefined);
        expect(instance.resourceValues.title).toBe("Fallback Text");
    });

    it("should set resourceValues.title to undefined if neither title nor text is available", () => {
        getComponentResourceValue.mockReturnValue(undefined);
        hasValue.mockReturnValue(false);

        const props = {};
        const instance = new CustomParagraphText(props);

        expect(instance.resourceValues.title).toBeUndefined();
    });

    describe("getTextData", () => {
        it("returns the localized title if hasValue returns true", () => {
            getComponentResourceValue.mockReturnValue("Localized");
            hasValue.mockReturnValue(true);

            const instance = new CustomParagraphText({});
            const result = instance.getTextData({ text: "Fallback" });

            expect(result).toBe("Localized");
        });

        it("returns the fallback text if hasValue returns false", () => {
            getComponentResourceValue.mockReturnValue(undefined);
            hasValue.mockReturnValue(false);

            const instance = new CustomParagraphText({});
            const result = instance.getTextData({ text: "Fallback" });

            expect(result).toBe("Fallback");
        });

        it("returns undefined if neither title nor text is available", () => {
            getComponentResourceValue.mockReturnValue(undefined);
            hasValue.mockReturnValue(false);

            const instance = new CustomParagraphText({});
            const result = instance.getTextData({});

            expect(result).toBeUndefined();
        });
    });
});
