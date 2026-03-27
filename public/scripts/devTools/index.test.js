import "./index.js";

jest.mock("./renderers.js", () => ({
    renderResults: jest.fn(),
    renderSidebar: jest.fn(),
    renderTextResourceStatusIndicators: jest.fn()
}));
jest.mock("../getters.js", () => ({
    fetchDefaultTextResources: jest.fn(() => Promise.resolve("defaultTextResourcesMock"))
}));
jest.mock("../localStorage.js", () => ({
    getTextResources: jest.fn(() => "textResourcesMock")
}));
jest.mock("../validators.js", () => ({
    validateResources: jest.fn(() => "validationResultsMock")
}));

describe("globalThis.onload", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        globalThis.textResources = undefined;
        globalThis.defaultTextResources = undefined;
    });

    it("should initialize globalThis variables and call renderers", async () => {
        await globalThis.onload();
        expect(globalThis.textResources).toBe("textResourcesMock");
        expect(globalThis.defaultTextResources).toBe("defaultTextResourcesMock");
        const { renderSidebar, renderResults, renderTextResourceStatusIndicators } = require("./renderers.js");
        const { validateResources } = require("../validators.js");
        expect(renderSidebar).toHaveBeenCalled();
        expect(renderResults).toHaveBeenCalled();
        expect(validateResources).toHaveBeenCalled();
        expect(renderTextResourceStatusIndicators).toHaveBeenCalledWith("validationResultsMock");
    });
});
