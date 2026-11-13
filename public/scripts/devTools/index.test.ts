import "./index.ts";

jest.mock("./renderers.ts", () => ({
    renderResults: jest.fn(),
    renderSidebar: jest.fn(),
    renderTextResourceStatusIndicators: jest.fn()
}));
jest.mock("./language.ts", () => ({
    applyLanguage: jest.fn()
}));
jest.mock("../localStorage.ts", () => ({
    getSelectedLanguage: jest.fn(() => "nn")
}));
jest.mock("../validators.ts", () => ({
    validateResources: jest.fn(() => "validationResultsMock")
}));

describe("globalThis.onload", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should apply the chosen language and call renderers", () => {
        globalThis.onload!.call(globalThis as unknown as Window, new Event("load"));
        const { applyLanguage } = require("./language.ts");
        const { renderSidebar, renderResults, renderTextResourceStatusIndicators } = require("./renderers.ts");
        const { validateResources } = require("../validators.ts");
        expect(applyLanguage).toHaveBeenCalledWith("nn");
        expect(renderSidebar).toHaveBeenCalled();
        expect(renderResults).toHaveBeenCalled();
        expect(validateResources).toHaveBeenCalled();
        expect(renderTextResourceStatusIndicators).toHaveBeenCalledWith("validationResultsMock");
    });
});
