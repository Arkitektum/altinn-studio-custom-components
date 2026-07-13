import { fetchTextResources } from "./textResourceHelpers";
import { fetchWithTimeoutAndClientLogger } from "./clientLoggerHelpers";
import { hasValue } from "@arkitektum/altinn-studio-custom-components-utils";

jest.mock("./clientLoggerHelpers", () => ({
    fetchWithTimeoutAndClientLogger: jest.fn()
}));
jest.mock("@arkitektum/altinn-studio-custom-components-utils", () => ({
    hasValue: jest.fn()
}));

describe("fetchTextResources", () => {
    const origin = "https://org.example";
    const org = "org";
    const app = "app";

    beforeEach(() => {
        jest.clearAllMocks();
        jest.spyOn(console, "error").mockImplementation(() => {});
        // Realistic hasValue: null/undefined/"" and empty objects are "no value".
        hasValue.mockImplementation((value) => {
            if (value === undefined || value === null || value === "") return false;
            if (typeof value === "object") return Object.keys(value).length > 0;
            return true;
        });
    });

    afterEach(() => {
        console.error.mockRestore();
    });

    it("returns primary-language resources when the fetch succeeds", async () => {
        const data = { key: "value" };
        fetchWithTimeoutAndClientLogger.mockResolvedValueOnce({ ok: true, json: async () => data });

        const result = await fetchTextResources(origin, org, app, "en", "nb");

        expect(result).toBe(data);
        expect(fetchWithTimeoutAndClientLogger).toHaveBeenCalledTimes(1);
        expect(fetchWithTimeoutAndClientLogger.mock.calls[0][0]).toContain("/api/v1/texts/en");
    });

    it("falls back to the fallback language when the primary response is not ok", async () => {
        const fallbackData = { key: "fallback" };
        fetchWithTimeoutAndClientLogger
            .mockResolvedValueOnce({ ok: false, status: 404 })
            .mockResolvedValueOnce({ ok: true, json: async () => fallbackData });

        const result = await fetchTextResources(origin, org, app, "en", "nb");

        expect(result).toBe(fallbackData);
        expect(fetchWithTimeoutAndClientLogger).toHaveBeenCalledTimes(2);
        expect(fetchWithTimeoutAndClientLogger.mock.calls[1][0]).toContain("/api/v1/texts/nb");
    });

    it("falls back when the primary fetch throws", async () => {
        const fallbackData = { key: "fallback" };
        fetchWithTimeoutAndClientLogger
            .mockRejectedValueOnce(new Error("network error"))
            .mockResolvedValueOnce({ ok: true, json: async () => fallbackData });

        const result = await fetchTextResources(origin, org, app, "en", "nb");

        expect(result).toBe(fallbackData);
        expect(fetchWithTimeoutAndClientLogger).toHaveBeenCalledTimes(2);
    });

    it("falls back when the primary response is ok but empty", async () => {
        const fallbackData = { key: "fallback" };
        fetchWithTimeoutAndClientLogger
            .mockResolvedValueOnce({ ok: true, json: async () => ({}) })
            .mockResolvedValueOnce({ ok: true, json: async () => fallbackData });

        const result = await fetchTextResources(origin, org, app, "en", "nb");

        expect(result).toBe(fallbackData);
        expect(fetchWithTimeoutAndClientLogger).toHaveBeenCalledTimes(2);
    });

    it("does not fall back when the fallback language equals the primary language", async () => {
        fetchWithTimeoutAndClientLogger.mockResolvedValueOnce({ ok: false, status: 500 });

        const result = await fetchTextResources(origin, org, app, "nb", "nb");

        expect(result).toBeNull();
        expect(fetchWithTimeoutAndClientLogger).toHaveBeenCalledTimes(1);
    });

    it("returns null without fetching when the language is missing", async () => {
        const result = await fetchTextResources(origin, org, app, "", "nb");

        expect(result).toBeNull();
        expect(fetchWithTimeoutAndClientLogger).not.toHaveBeenCalled();
    });
});
