/**
 * @jest-environment jsdom
 * @jest-environment-options {"url": "https://dibk.apps.tt02.altinn.no/dibk/varselplanoppstartuttalelse-v3/#/instance/512345/abc-def?query=1"}
 */

import { fetchDefaultTextResources, fetchTextResources } from "./textResourceHelpers.ts";
import { fetchWithTimeoutAndClientLogger, getClientLoggerInstance } from "./clientLoggerHelpers.ts";
import initCustomComponents, { getLanguageFromLocation, getLanguageFromSelector, isAltinnAppOrigin, resolveLanguage } from "./init.ts";
import type { ClientLogger } from "@arkitektum/client-logger";
import { defaultTextResourceLanguages } from "../constants/defaultTextResourceLanguages.ts";
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
// A plain array, so a test can let the package ship a language it does not ship yet.
jest.mock("../constants/defaultTextResourceLanguages.ts", () => ({
    defaultTextResourceLanguages: ["nb"]
}));

describe("initCustomComponents", () => {
    const origin = "https://dibk.apps.tt02.altinn.no";
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
        // Clearing leaves queued responses behind, and one left by a test would answer a request in the next.
        jest.mocked(fetchWithTimeoutAndClientLogger).mockReset();
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
        delete globalThis.fallbackTextResources;
        delete globalThis.fallbackDefaultTextResources;
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

    describe("the nb texts a reader in another language falls back to, text by text", () => {
        const profileLanguage = (language: string) =>
            jest.mocked(fetchWithTimeoutAndClientLogger).mockResolvedValueOnce({
                ok: true,
                status: 200,
                json: async () => ({ profileSettingPreference: { language } })
            } as unknown as Response);

        afterEach(() => {
            (defaultTextResourceLanguages as string[]).splice(1);
        });

        it("loads the app's and the package's nb texts for a reader in a language the package ships", async () => {
            (defaultTextResourceLanguages as string[]).push("en");
            profileLanguage("en");
            jest.mocked(fetchTextResources).mockImplementation(async (_o, _g, _a, language) => ({
                language,
                resources: [{ id: "app", value: language }]
            }));
            jest.mocked(fetchDefaultTextResources).mockImplementation(async (_o, _g, _a, language) => ({
                language,
                resources: [{ id: "pkg", value: language }]
            }));

            await initCustomComponents();

            expect(fetchTextResources).toHaveBeenCalledWith(origin, org, app, "nb", null, clientLogger, expect.any(Array));
            expect(fetchDefaultTextResources).toHaveBeenCalledWith(origin, org, app, "nb", null, clientLogger, expect.any(Array));
            expect(globalThis.textResources).toEqual({ language: "en", resources: [{ id: "app", value: "en" }] });
            expect(globalThis.defaultTextResources).toEqual({ language: "en", resources: [{ id: "pkg", value: "en" }] });
            expect(globalThis.fallbackTextResources).toEqual({ language: "nb", resources: [{ id: "app", value: "nb" }] });
            expect(globalThis.fallbackDefaultTextResources).toEqual({ language: "nb", resources: [{ id: "pkg", value: "nb" }] });
        });

        it("does not ask for the package's nb texts twice when the package ships no file for the reader's language", async () => {
            profileLanguage("en");

            await initCustomComponents();

            expect(fetchTextResources).toHaveBeenCalledWith(origin, org, app, "nb", null, clientLogger, expect.any(Array));
            expect(jest.mocked(fetchDefaultTextResources).mock.calls.map((call) => [call[3], call[4]])).toEqual([["en", "nb"]]);
            expect(globalThis.fallbackDefaultTextResources).toBeNull();
        });

        it("asks for nothing more for an nb reader", async () => {
            profileLanguage("nb");

            await initCustomComponents();

            expect(jest.mocked(fetchTextResources).mock.calls.map((call) => call[3])).toEqual(["nb"]);
            expect(jest.mocked(fetchDefaultTextResources).mock.calls.map((call) => call[3])).toEqual(["nb"]);
            expect(globalThis.fallbackTextResources).toBeNull();
            expect(globalThis.fallbackDefaultTextResources).toBeNull();
        });

        it("keeps the reader's own texts when an nb request fails", async () => {
            profileLanguage("nn");
            const failNb = async (_o: string, _g: string, _a: string, language: string) => {
                if (language === "nb") throw new Error("nb failed");
                return { language, resources: [] };
            };
            jest.mocked(fetchTextResources).mockImplementation(failNb);
            jest.mocked(fetchDefaultTextResources).mockImplementation(failNb);

            await initCustomComponents();

            expect(globalThis.textResources).toEqual({ language: "nn", resources: [] });
            expect(globalThis.defaultTextResources).toEqual({ language: "nn", resources: [] });
            expect(globalThis.fallbackTextResources).toBeNull();
            expect(globalThis.fallbackDefaultTextResources).toBeNull();
        });
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

    describe("on a page generated by app backend v9", () => {
        let readyStateSpy: ReturnType<typeof jest.spyOn>;
        let addEventListenerSpy: jest.SpiedFunction<typeof globalThis.addEventListener>;

        beforeEach(() => {
            globalThis.altinnAppGlobalData = {};
            readyStateSpy = jest.spyOn(document, "readyState", "get").mockReturnValue("loading");
            addEventListenerSpy = jest.spyOn(globalThis, "addEventListener");
            jest.mocked(fetchWithTimeoutAndClientLogger).mockResolvedValueOnce({
                ok: true,
                status: 200,
                json: async () => ({ profileSettingPreference: { language: "nn" } })
            } as unknown as Response);
        });

        afterEach(() => {
            readyStateSpy.mockRestore();
            addEventListenerSpy.mockRestore();
            delete globalThis.altinnAppGlobalData;
        });

        // The hold the init put on the window, so a test can hand it an event of its own.
        const getHold = () =>
            addEventListenerSpy.mock.calls.find(
                ([type, , options]) => type === "DOMContentLoaded" && (options as AddEventListenerOptions)?.capture
            )?.[1] as ((event: Partial<Event>) => void) | undefined;

        it("does not load the app frontend from the CDN", async () => {
            await initCustomComponents();

            expect(appendChildSpy).not.toHaveBeenCalled();
        });

        it("sets the text resources and then lets the frontend boot with a synthetic DOMContentLoaded", async () => {
            const domContentLoadedListener = jest.fn(() => {
                expect(globalThis.selectedLanguage).toBe("nn");
                expect(globalThis.textResources).toEqual({ resources: [] });
            });
            document.addEventListener("DOMContentLoaded", domContentLoadedListener);

            await initCustomComponents();

            document.removeEventListener("DOMContentLoaded", domContentLoadedListener);
            expect(domContentLoadedListener).toHaveBeenCalledTimes(1);
        });

        it("holds back the browser's own DOMContentLoaded from the frontend", async () => {
            await initCustomComponents();

            const stopImmediatePropagation = jest.fn();
            getHold()?.({ isTrusted: true, stopImmediatePropagation });

            expect(getHold()).toBeDefined();
            expect(stopImmediatePropagation).toHaveBeenCalled();
        });

        it("lets untrusted DOMContentLoaded events through", async () => {
            await initCustomComponents();

            const stopImmediatePropagation = jest.fn();
            getHold()?.({ isTrusted: false, stopImmediatePropagation });

            expect(stopImmediatePropagation).not.toHaveBeenCalled();
        });

        it("holds nothing back when the page has already loaded", async () => {
            readyStateSpy.mockReturnValue("complete");

            await initCustomComponents();

            expect(getHold()).toBeUndefined();
        });
    });

    describe("a language in the address", () => {
        const startUrl = globalThis.location.href;
        const profileAsked = () => jest.mocked(fetchWithTimeoutAndClientLogger).mock.calls.some(([url]) => url === userProfileApiUrl);

        afterEach(() => {
            globalThis.history.replaceState(null, "", startUrl);
        });

        it("overrides the profile, which is then not asked, as when Altinn renders a pdf in nn", async () => {
            globalThis.history.replaceState(null, "", `/${org}/${app}/#/instance/512345/abc-def?pdf=1&lang=nn`);

            await initCustomComponents();

            expect(profileAsked()).toBe(false);
            expect(globalThis.selectedLanguage).toBe("nn");
            expect(fetchTextResources).toHaveBeenCalledWith(origin, org, app, "nn", "nb", clientLogger, expect.any(Array));
            expect(fetchDefaultTextResources).toHaveBeenCalledWith(origin, org, app, "nn", "nb", clientLogger, expect.any(Array));
        });

        it("leaves the profile to decide when the value is not a language code", async () => {
            globalThis.history.replaceState(null, "", `/${org}/${app}/#/instance/512345/abc-def?lang=../../x`);
            jest.mocked(fetchWithTimeoutAndClientLogger).mockResolvedValueOnce({
                ok: true,
                status: 200,
                json: async () => ({ profileSettingPreference: { language: "en" } })
            } as unknown as Response);

            await initCustomComponents();

            expect(profileAsked()).toBe(true);
            expect(globalThis.selectedLanguage).toBe("en");
        });
    });

    describe("the languages the app has texts for", () => {
        const startUrl = globalThis.location.href;
        const appLanguagesApiUrl = `${origin}/${org}/${app}/api/v1/applicationlanguages`;
        const userId = 1337;

        // Answers the profile and the app's languages by address, and anything left out with a 404.
        const respond = ({ profile, languages }: { profile?: object; languages?: string[] }) =>
            jest.mocked(fetchWithTimeoutAndClientLogger).mockImplementation(async (url) => {
                const body =
                    url === userProfileApiUrl ? profile : url === appLanguagesApiUrl ? languages?.map((language) => ({ language })) : undefined;
                return (body === undefined
                    ? { ok: false, status: 404, statusText: "Not Found" }
                    : { ok: true, status: 200, json: async () => body }) as unknown as Response;
            });
        const profileIn = (language: string) => ({ userId, profileSettingPreference: { language } });
        const pickInSelector = (language: string, forUserId: number = userId) =>
            globalThis.localStorage.setItem(`${org}/${app}/${forUserId}/selectedLanguage`, JSON.stringify(language));

        afterEach(() => {
            globalThis.localStorage.clear();
            globalThis.history.replaceState(null, "", startUrl);
        });

        it("shows an nn reader an app that has only nb texts in nb, the package's texts included", async () => {
            respond({ profile: profileIn("nn"), languages: ["nb"] });

            await initCustomComponents();

            expect(fetchWithTimeoutAndClientLogger).toHaveBeenCalledWith(appLanguagesApiUrl, {}, 5000, clientLogger, expect.any(Array));
            expect(globalThis.selectedLanguage).toBe("nb");
            expect(jest.mocked(fetchTextResources).mock.calls.map((call) => call[3])).toEqual(["nb"]);
            expect(jest.mocked(fetchDefaultTextResources).mock.calls.map((call) => call[3])).toEqual(["nb"]);
        });

        it("shows an nn reader an app that has nn texts in nn", async () => {
            respond({ profile: profileIn("nn"), languages: ["nb", "nn"] });

            await initCustomComponents();

            expect(globalThis.selectedLanguage).toBe("nn");
        });

        it("takes the language picker's choice over the profile's", async () => {
            respond({ profile: profileIn("en"), languages: ["nb", "nn", "en"] });
            pickInSelector("nn");

            await initCustomComponents();

            expect(globalThis.selectedLanguage).toBe("nn");
        });

        it("passes over a picker choice the app has no texts for", async () => {
            respond({ profile: profileIn("nn"), languages: ["nb", "nn"] });
            pickInSelector("en");

            await initCustomComponents();

            expect(globalThis.selectedLanguage).toBe("nn");
        });

        it("does not read another user's picker choice", async () => {
            respond({ profile: profileIn("nb"), languages: ["nb", "nn"] });
            pickInSelector("nn", 42);

            await initCustomComponents();

            expect(globalThis.selectedLanguage).toBe("nb");
        });

        it("keeps a language in the address to the app's languages, as when Altinn renders a pdf in nn of an nb app", async () => {
            globalThis.history.replaceState(null, "", `/${org}/${app}/#/instance/512345/abc-def?pdf=1&lang=nn`);
            respond({ languages: ["nb"] });

            await initCustomComponents();

            expect(globalThis.selectedLanguage).toBe("nb");
        });

        it("falls back to a language the app has when it has no nb texts", async () => {
            respond({ profile: profileIn("nb"), languages: ["en"] });

            await initCustomComponents();

            expect(globalThis.selectedLanguage).toBe("en");
        });

        it("takes the reader's language as it is when the app's languages cannot be fetched", async () => {
            respond({ profile: profileIn("nn") });

            await initCustomComponents();

            expect(globalThis.selectedLanguage).toBe("nn");
            expect(clientLogger.postLogData).toHaveBeenCalledWith([
                expect.objectContaining({ level: "Error", message: expect.stringContaining(appLanguagesApiUrl) })
            ]);
        });

        it("takes the reader's language as it is when the app names no languages", async () => {
            respond({ profile: profileIn("nn"), languages: [] });

            await initCustomComponents();

            expect(globalThis.selectedLanguage).toBe("nn");
        });
    });

    describe("the instance id carried on every log entry", () => {
        const startUrl = globalThis.location.href;
        const instanceGuid = "0e9f1c3a-2b4d-4c5e-8f6a-7b8c9d0e1f2a";
        const loggedInstanceId = () =>
            (jest.mocked(fetchTextResources).mock.calls[0]?.[6] as { key: string; value?: string }[] | undefined)?.find(
                (field) => field.key === "instanceId"
            )?.value;

        afterEach(() => {
            globalThis.history.replaceState(null, "", startUrl);
        });

        it("reads it from the hash, as app frontend v4 routes", async () => {
            await initCustomComponents();

            expect(loggedInstanceId()).toBe("512345/abc-def");
        });

        it("reads it from the path, as app frontend v9 routes", async () => {
            globalThis.history.replaceState(null, "", `/${org}/${app}/instance/512345/${instanceGuid}/Task_1/Side1`);

            await initCustomComponents();

            expect(loggedInstanceId()).toBe(`512345/${instanceGuid}`);
        });

        it("carries none on a page that shows no instance", async () => {
            globalThis.history.replaceState(null, "", `/${org}/${app}/`);

            await initCustomComponents();

            expect(loggedInstanceId()).toBeUndefined();
        });
    });
});

describe("getLanguageFromLocation", () => {
    const at = (search: string, hash: string) => ({ search, hash }) as Location;
    const cases: [where: string, location: Location, expected: string | null][] = [
        ["the hash query, as app frontend v4 is opened for a pdf", at("", "#/instance/1/a?pdf=1&lang=nn"), "nn"],
        ["the query, as app frontend v9 routes", at("?lang=en", ""), "en"],
        ["language, Altinn's other name for it", at("?language=nn", ""), "nn"],
        ["language before lang, as Altinn reads them", at("?lang=en&language=nn", ""), "nn"],
        ["the query before the hash", at("?lang=en", "#/instance/1/a?lang=nn"), "en"],
        ["a code in upper case, lowered", at("?lang=NB", ""), "nb"],
        ["no language at all", at("", "#/instance/1/a?pdf=1"), null],
        ["an empty value", at("?lang=", ""), null],
        ["something that is not a language code", at("?lang=nb/../x", ""), null],
        ["a hash with no query", at("", "#/instance/1/a"), null]
    ];

    it.each(cases)("reads %s", (_where, location, expected) => {
        expect(getLanguageFromLocation(location)).toBe(expected);
    });
});

describe("resolveLanguage", () => {
    it("takes the first wish the app has texts for", () => {
        expect(resolveLanguage(["nb", "nn", "en"], [null, "en", "nn"])).toBe("en");
    });

    it("falls back to nb, then nn, then en, when the app has none of the wishes", () => {
        expect(resolveLanguage(["en", "nn", "nb"], ["de"])).toBe("nb");
        expect(resolveLanguage(["en", "nn"], ["de"])).toBe("nn");
        expect(resolveLanguage(["de", "en"], [])).toBe("en");
    });

    it("falls back to the app's first language when it has neither nb, nn nor en", () => {
        expect(resolveLanguage(["se", "de"], ["nn"])).toBe("se");
    });

    it("takes the first wish as it is when the app's languages are unknown", () => {
        expect(resolveLanguage(null, [undefined, "", "nn", "en"])).toBe("nn");
        expect(resolveLanguage(null, [null])).toBe("nb");
    });
});

describe("getLanguageFromSelector", () => {
    afterEach(() => {
        globalThis.localStorage.clear();
    });

    it("reads the choice app frontend stored for the app and the user", () => {
        globalThis.localStorage.setItem("dibk/app-v1/1337/selectedLanguage", JSON.stringify("NN"));

        expect(getLanguageFromSelector("dibk", "app-v1", 1337)).toBe("nn");
        expect(getLanguageFromSelector("dibk", "other-app-v1", 1337)).toBeNull();
    });

    it("reads the key without a user id when there is none, as app frontend writes it", () => {
        globalThis.localStorage.setItem("dibk/app-v1/selectedLanguage", JSON.stringify("en"));

        expect(getLanguageFromSelector("dibk", "app-v1", undefined)).toBe("en");
    });

    it("reads nothing from a value that is not a language code or not JSON", () => {
        globalThis.localStorage.setItem("dibk/app-v1/1/selectedLanguage", JSON.stringify("../x"));
        globalThis.localStorage.setItem("dibk/app-v1/2/selectedLanguage", "nn");
        globalThis.localStorage.setItem("dibk/app-v1/3/selectedLanguage", "null");

        expect(getLanguageFromSelector("dibk", "app-v1", 1)).toBeNull();
        expect(getLanguageFromSelector("dibk", "app-v1", 2)).toBeNull();
        expect(getLanguageFromSelector("dibk", "app-v1", 3)).toBeNull();
    });
});

describe("isAltinnAppOrigin", () => {
    const appOrigins = [
        "https://dibk.apps.altinn.no",
        "https://dibk.apps.tt02.altinn.no",
        "https://another-org.apps.altinn.no",
        "http://local.altinn.cloud",
        "http://local.altinn.cloud:8000",
        "https://local.altinn.cloud"
    ];
    // The docs site is the case that started this: two path segments, and nothing to do with an Altinn app.
    const otherOrigins = [
        "https://arkitektum.github.io",
        "http://localhost:8080",
        "http://dibk.apps.altinn.no",
        "https://apps.altinn.no",
        "https://dibk.apps.altinn.no.example.com",
        "https://dibkapps.altinn.no",
        "ftp://local.altinn.cloud",
        "null",
        ""
    ];

    it.each(appOrigins)("accepts %s", (origin) => {
        expect(isAltinnAppOrigin(origin)).toBe(true);
    });

    it.each(otherOrigins)("refuses '%s'", (origin) => {
        expect(isAltinnAppOrigin(origin)).toBe(false);
    });
});
