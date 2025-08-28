import CustomParagraphText from "./CustomParagraphText";
import { getComponentResourceValue, hasValue } from "../../../functions/helpers.js";

// Mock dependencies
jest.mock("../../../functions/helpers.js", () => ({
    getComponentResourceValue: jest.fn(),
    hasValue: jest.fn()
}));

// Mock CustomComponent base class
class CustomComponent {
    constructor(props) {
        this.props = props;
    }
}

describe("CustomParagraphText", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should extend CustomComponent", () => {
        const instance = new CustomParagraphText({});
        expect(instance).toBeInstanceOf(CustomParagraphText);
        expect(instance).toBeInstanceOf(CustomComponent);
    });

    it("should set resourceValues.title to the value from getTextData", () => {
        getComponentResourceValue.mockReturnValue("localized title");
        hasValue.mockReturnValue(true);

        const props = { text: "fallback text" };
        const instance = new CustomParagraphText(props);

        expect(instance.resourceValues.title).toBe("localized title");
    });

    it("getTextData should return localized title if hasValue returns true", () => {
        getComponentResourceValue.mockReturnValue("localized title");
        hasValue.mockReturnValue(true);

        const props = { text: "fallback text" };
        const instance = new CustomParagraphText(props);

        expect(instance.getTextData(props)).toBe("localized title");
        expect(getComponentResourceValue).toHaveBeenCalledWith(props, "title");
        expect(hasValue).toHaveBeenCalledWith("localized title");
    });

    it("getTextData should return text if hasValue returns false", () => {
        getComponentResourceValue.mockReturnValue(undefined);
        hasValue.mockReturnValue(false);

        const props = { text: "fallback text" };
        const instance = new CustomParagraphText(props);

        expect(instance.getTextData(props)).toBe("fallback text");
    });

    it("getTextData should return undefined if neither title nor text is present", () => {
        getComponentResourceValue.mockReturnValue(undefined);
        hasValue.mockReturnValue(false);

        const props = {};
        const instance = new CustomParagraphText(props);

        expect(instance.getTextData(props)).toBeUndefined();
    });
});
