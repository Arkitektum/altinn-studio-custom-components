import type { ComponentProps } from "../../../types.ts";

import { getComponentDataTitle, getComponentResourceValue } from "../../../functions/helpers.ts";
import CustomHeaderTextData from "./CustomHeaderTextData.ts";

// Mock dependencies
jest.mock("../../../functions/helpers.ts", () => ({
    getComponentDataTitle: jest.fn(),
    getComponentResourceValue: jest.fn()
}));

describe("CustomHeaderTextData", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should set size from props", () => {
        (getComponentResourceValue as unknown as jest.Mock).mockReturnValue("ResourceTitle");
        (getComponentDataTitle as unknown as jest.Mock).mockReturnValue("DataTitle");
        const instance = new CustomHeaderTextData({ size: "large", title: "Header" } as unknown as ComponentProps);
        expect(instance.size).toBe("large");
    });

    it("should set resourceValues.title with both resource and data title", () => {
        (getComponentResourceValue as unknown as jest.Mock).mockReturnValue("ResourceTitle");
        (getComponentDataTitle as unknown as jest.Mock).mockReturnValue("DataTitle");
        const instance = new CustomHeaderTextData({ title: "Header" } as unknown as ComponentProps);
        expect(instance.resourceValues.title).toBe("ResourceTitle DataTitle");
    });

    it("should set resourceValues.title with only resource title if data title is missing", () => {
        (getComponentResourceValue as unknown as jest.Mock).mockReturnValue("ResourceTitle");
        (getComponentDataTitle as unknown as jest.Mock).mockReturnValue("");
        const instance = new CustomHeaderTextData({ title: "Header" } as unknown as ComponentProps);
        expect(instance.resourceValues.title).toBe("ResourceTitle");
    });

    it("should set resourceValues.title with only data title if resource title is missing", () => {
        (getComponentResourceValue as unknown as jest.Mock).mockReturnValue("");
        (getComponentDataTitle as unknown as jest.Mock).mockReturnValue("DataTitle");
        const instance = new CustomHeaderTextData({ title: "Header" } as unknown as ComponentProps);
        expect(instance.resourceValues.title).toBe("DataTitle");
    });

    it("should set resourceValues.title as empty string if both resource and data title are missing", () => {
        (getComponentResourceValue as unknown as jest.Mock).mockReturnValue("");
        (getComponentDataTitle as unknown as jest.Mock).mockReturnValue("");
        const instance = new CustomHeaderTextData({ title: "Header" } as unknown as ComponentProps);
        expect(instance.resourceValues.title).toBe("");
    });

    it("should handle missing props gracefully", () => {
        (getComponentResourceValue as unknown as jest.Mock).mockReturnValue("");
        (getComponentDataTitle as unknown as jest.Mock).mockReturnValue("");
        const instance = new CustomHeaderTextData(undefined as unknown as ComponentProps);
        expect(instance.size).toBeUndefined();
        expect(instance.resourceValues.title).toBe("");
    });
});
