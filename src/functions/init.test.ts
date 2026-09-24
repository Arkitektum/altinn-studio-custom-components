/**
 * @jest-environment jsdom
 * @jest-environment-options {"url": "https://org.example/dibk/varselplanoppstartuttalelse-v3/#/instance/512345/abc-def?query=1"}
 */

import { fetchDefaultTextResources, fetchTextResources } from "./textResourceHelpers.ts";
import { fetchWithTimeoutAndClientLogger, getClientLoggerInstance } from "./clientLoggerHelpers.ts";
import type { ClientLogger } from "@arkitektum/client-logger";
import initCustomComponents from "./init.ts";
import { updateBodyClassNamesForApplication } from "./htmlElementHelpers.ts";

jest.mock("./textResourceHelpers.ts", () => ({
    fetchTextResources: jest.fn(),
    fetchDefaultTextResources: jest.fn()
}));
jest.mock("./clientLoggerHelpers.ts", () => ({
    fetchWithTimeoutAndClientLogger: jest.fn(),
    getClientLoggerInstance: jest.fn()
}));
jest.mock("./htmlElementHelpers.ts", () => ({
    updateBodyClassNamesForApplication: jest.fn()
}));

describe("initCustomComponents", () => {
    const origin = "https://org.example";
    const org = "dibk";
    const app = "varselplanoppstartuttalelse-v3";
    const userProfileApiUrl = `${origin}/${org}/${app}/api/v1/profile/user`;

    // The logger stands in for the real one: the tests only ever read what it was asked to log.
    let clientLogger: ClientLogger & { postLogData: jest.Mock };
    let appendChildSpy: jest.SpiedFunction<typeof document.body.appendChild>;
    let errorSpy: ReturnType<typeof jest.spyOn>;
    let logSpy: ReturnType<typeof jest.spyOn>;

    beforeEach(() => {
        jest.clearAllMocks();
        errorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
        logSpy = jest.spyOn(console, "log").mockImplementation(() => {});

        clientLogger = { postLogData: jest.fn() } as unknown as ClientLogger & { postLogData: jest.Mock };
        jest.mocked(getClientLoggerInstance).mockReturnValue(clientLogger);

        jest.mocked(fetchTextResources).mockResolvedValue({ resources: [] });
        jest.mocked(fetchDefaultTextResources).mockResolvedValue({ resources: [] });

        // jsdom never loads the script, so resolve loadScriptAsync by firing onload on append.
        appendChildSpy = jest.spyOn(document.body, "appendChild").mockImplementation((element) => {
            (element as HTMLScriptElement).onload?.(new Event("load"));
            return element;
        });

        delete globalThis.selectedLanguage;
        delete globalThis.textResources;
        delete globalThis.defaultTextResources;
    });

    afterEach(() => {
        appendChildSpy.mockRestore();
        errorSpy.mockRestore();
        logSpy.mockRestore();
    });

    const getLoadedScriptSrc = () => (appendChildSpy.mock.calls[0]?.[0] as HTMLScriptElement | undefined)?.src;

    it("uses the language from the user profile when the profile request succeeds", async () => {
        jest.mocked(fetchWithTimeoutAndClientLogger).mockResolvedValueOnce({
            ok: true,
            status: 200,
            json: async () => ({ profileSettingPreference: { language: "en" } })
        } as unknown as Response);

        await initCustomComponents();

        expect(fetchWithTimeoutAndClientLogger).toHaveBeenCalledWith(userProfileApiUrl, {}, 5000, clientLogger, expect.any(Array));
        expect(globalThis.selectedLanguage).toBe("en");
        expect(fetchTextResources).toHaveBeenCalledWith(origin, org, app, "en", "nb", clientLogger, expect.any(Array));
        expect(fetchDefaultTextResources).toHaveBeenCalledWith(origin, org, app, "en", "nb", clientLogger, expect.any(Array));
    });

    it("falls back to nb and still loads the app frontend when the profile request returns 500", async () => {
        jest.mocked(fetchWithTimeoutAndClientLogger).mockResolvedValueOnce({
            ok: false,
            status: 500,
            statusText: "Internal Server Error",
            json: async () => {
                throw new SyntaxError("Unexpected end of JSON input");
            }
        } as unknown as Response);

        const domContentLoadedListener = jest.fn();
        document.addEventListener("DOMContentLoaded", domContentLoadedListener);

        await initCustomComponents();

        document.removeEventListener("DOMContentLoaded", domContentLoadedListener);

        expect(globalThis.selectedLanguage).toBe("nb");
        expect(fetchTextResources).toHaveBeenCalledWith(origin, org, app, "nb", "nb", clientLogger, expect.any(Array));
        expect(getLoadedScriptSrc()).toContain("altinn-app-frontend.js");
        expect(domContentLoadedListener).toHaveBeenCalled();
    });

    it("falls back to nb when the profile response body cannot be parsed as JSON", async () => {
        jest.mocked(fetchWithTimeoutAndClientLogger).mockResolvedValueOnce({
            ok: true,
            status: 200,
            json: async () => {
                throw new SyntaxError("Unexpected end of JSON input");
            }
        } as unknown as Response);

        await initCustomComponents();

        expect(globalThis.selectedLanguage).toBe("nb");
        expect(getLoadedScriptSrc()).toContain("altinn-app-frontend.js");
    });

    it("falls back to nb when the profile request rejects", async () => {
        jest.mocked(fetchWithTimeoutAndClientLogger).mockRejectedValueOnce(new Error("network error"));

        await initCustomComponents();

        expect(globalThis.selectedLanguage).toBe("nb");
        expect(getLoadedScriptSrc()).toContain("altinn-app-frontend.js");
    });

    it("falls back to nb when the profile request times out and no response is returned", async () => {
        jest.mocked(fetchWithTimeoutAndClientLogger).mockResolvedValueOnce(undefined);

        await initCustomComponents();

        expect(globalThis.selectedLanguage).toBe("nb");
        expect(getLoadedScriptSrc()).toContain("altinn-app-frontend.js");
    });

    it("falls back to nb when the profile has no language preference", async () => {
        jest.mocked(fetchWithTimeoutAndClientLogger).mockResolvedValueOnce({
            ok: true,
            status: 200,
            json: async () => ({ profileSettingPreference: {} })
        } as unknown as Response);

        await initCustomComponents();

        expect(globalThis.selectedLanguage).toBe("nb");
        expect(clientLogger.postLogData).toHaveBeenCalledWith([
            expect.objectContaining({ level: "Error", message: "Could not determine the user's language preference." })
        ]);
    });

    it("still loads the app frontend when text resource loading rejects", async () => {
        jest.mocked(fetchWithTimeoutAndClientLogger).mockResolvedValueOnce({
            ok: true,
            status: 200,
            json: async () => ({ profileSettingPreference: { language: "nn" } })
        } as unknown as Response);
        jest.mocked(fetchTextResources).mockRejectedValueOnce(new Error("boom"));

        await initCustomComponents();

        expect(globalThis.selectedLanguage).toBe("nn");
        expect(globalThis.textResources).toBeNull();
        expect(globalThis.defaultTextResources).toBeNull();
        expect(getLoadedScriptSrc()).toContain("altinn-app-frontend.js");
    });

    it("still loads the app frontend when the client logger cannot be created", async () => {
        jest.mocked(getClientLoggerInstance).mockImplementation(() => {
            throw new Error("logger unavailable");
        });
        jest.mocked(fetchWithTimeoutAndClientLogger).mockResolvedValueOnce({
            ok: false,
            status: 500,
            statusText: "Internal Server Error",
            json: async () => {
                throw new SyntaxError("Unexpected end of JSON input");
            }
        } as unknown as Response);

        await initCustomComponents();

        expect(globalThis.selectedLanguage).toBe("nb");
        expect(getLoadedScriptSrc()).toContain("altinn-app-frontend.js");
    });

    it("updates the body class names for the application", async () => {
        jest.mocked(fetchWithTimeoutAndClientLogger).mockResolvedValueOnce({
            ok: true,
            status: 200,
            json: async () => ({ profileSettingPreference: { language: "nb" } })
        } as unknown as Response);

        await initCustomComponents();

        expect(updateBodyClassNamesForApplication).toHaveBeenCalledWith(org, app);
    });
});
