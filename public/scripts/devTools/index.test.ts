import "./index.ts";

import type { ApiValue } from "../types.ts";

jest.mock("./renderers.ts", () => ({
    renderResults: jest.fn(),
    renderSidebar: jest.fn(),
    renderTextResourceStatusIndicators: jest.fn()
}));
jest.mock("../getters.ts", () => ({
    fetchDefaultTextResources: jest.fn(() => Promise.resolve("defaultTextResourcesMock"))
}));
jest.mock("../localStorage.ts", () => ({
    getTextResources: jest.fn(() => "textResourcesMock")
}));
jest.mock("../validators.ts", () => ({
    validateResources: jest.fn(() => "validationResultsMock")
}));

describe("globalThis.onload", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        globalThis.textResources = undefined;
        globalThis.defaultTextResources = undefined;
    });

    it("should initialize globalThis variables and call renderers", async () => {
        await globalThis.onload!.call(globalThis as unknown as Window, new Event("load"));
        expect((globalThis.textResources as ApiValue)).toBe("textResourcesMock");
        expect((globalThis.defaultTextResources as ApiValue)).toBe("defaultTextResourcesMock");
        const { renderSidebar, renderResults, renderTextResourceStatusIndicators } = require("./renderers.ts");
        const { validateResources } = require("../validators.ts");
        expect(renderSidebar).toHaveBeenCalled();
        expect(renderResults).toHaveBeenCalled();
        expect(validateResources).toHaveBeenCalled();
        expect(renderTextResourceStatusIndicators).toHaveBeenCalledWith("validationResultsMock");
    });
});
