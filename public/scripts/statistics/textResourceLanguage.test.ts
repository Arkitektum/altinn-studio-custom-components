import { applyTextResourcesForLanguage, getLocalTextResourcesForApp } from "./textResourceLanguage.ts";

describe("getLocalTextResourcesForApp", () => {
    const appResourceValues = [{ appName: "app1", appOwner: "owner1", resources: [{ id: "appLogo.url", value: "logo.svg" }] }];

    it("returns the app's resources, or an empty array for an app it does not hold", () => {
        expect(getLocalTextResourcesForApp("app1", "owner1", appResourceValues)).toEqual([{ id: "appLogo.url", value: "logo.svg" }]);
        expect(getLocalTextResourcesForApp("nope", "nope", appResourceValues)).toEqual([]);
    });

    it("tells apps in different organisations apart", () => {
        expect(getLocalTextResourcesForApp("app1", "other", appResourceValues)).toEqual([]);
    });
});

describe("applyTextResourcesForLanguage", () => {
    const multilingualDefaultTextResources = [{ id: "common.yes", values: { nb: "Ja", en: "Yes" } }];
    const multilingualAppResourceValues = [
        { appOwner: "dibk", appName: "a-v1", resourceValues: [{ id: "appName", values: { nb: "Søknad", en: "Application" } }] },
        { appOwner: "dibk", appName: "b-v1", resourceValues: [{ id: "appName", values: { nb: "Varsel", en: "Notice" } }] }
    ];

    it("puts the default, every app's and the selected app's text resources in that language on globalThis", () => {
        applyTextResourcesForLanguage(multilingualDefaultTextResources, multilingualAppResourceValues, "en", "dibk", "b-v1");

        expect(globalThis.defaultTextResources).toEqual({ language: "en", resources: [{ id: "common.yes", value: "Yes" }] });
        expect(globalThis.appResourceValues.map((app: { appName: string }) => app.appName)).toEqual(["a-v1", "b-v1"]);
        expect(globalThis.textResources).toEqual({ language: "en", resources: [{ id: "appName", value: "Notice" }] });
    });

    it("gives no app resources when no app is selected", () => {
        applyTextResourcesForLanguage(multilingualDefaultTextResources, multilingualAppResourceValues, "nb", undefined, undefined);

        expect(globalThis.textResources).toEqual([]);
        expect(globalThis.defaultTextResources).toEqual({ language: "nb", resources: [{ id: "common.yes", value: "Ja" }] });
    });

    it("falls back to the package's nb texts for a language the package has none in, as the app does", () => {
        applyTextResourcesForLanguage(multilingualDefaultTextResources, multilingualAppResourceValues, "nn", "dibk", "a-v1");

        expect(globalThis.defaultTextResources).toEqual({ language: "nb", resources: [{ id: "common.yes", value: "Ja" }] });
    });

    it("falls back to an app's nb texts when the app has none in the language, as the app does", () => {
        applyTextResourcesForLanguage(multilingualDefaultTextResources, multilingualAppResourceValues, "nn", "dibk", "a-v1");

        expect(globalThis.textResources).toEqual({ language: "nb", resources: [{ id: "appName", value: "Søknad" }] });
        expect(globalThis.appResourceValues.map((app: { resources: { language: string } }) => app.resources.language)).toEqual(["nb", "nb"]);
    });

    it("falls back per app, and per file rather than per text", () => {
        const partlyTranslated = [
            {
                appOwner: "dibk",
                appName: "a-v1",
                resourceValues: [
                    { id: "appName", values: { nb: "Søknad", nn: "Søknad på nynorsk" } },
                    { id: "only.nb", values: { nb: "Bare bokmål" } }
                ]
            },
            { appOwner: "dibk", appName: "b-v1", resourceValues: [{ id: "appName", values: { nb: "Varsel" } }] }
        ];
        applyTextResourcesForLanguage(multilingualDefaultTextResources, partlyTranslated, "nn", "dibk", "a-v1");

        expect(globalThis.textResources).toEqual({ language: "nn", resources: [{ id: "appName", value: "Søknad på nynorsk" }] });
        expect(globalThis.appResourceValues.map((app: { resources: { language: string } }) => app.resources.language)).toEqual(["nn", "nb"]);
    });

    it("puts the selected app's and the package's nb texts where a single missing text is looked up, for any other language than nb", () => {
        applyTextResourcesForLanguage(multilingualDefaultTextResources, multilingualAppResourceValues, "en", "dibk", "b-v1");

        expect(globalThis.fallbackTextResources).toEqual({ language: "nb", resources: [{ id: "appName", value: "Varsel" }] });
        expect(globalThis.fallbackDefaultTextResources).toEqual({ language: "nb", resources: [{ id: "common.yes", value: "Ja" }] });
    });

    it("clears those for nb, which has nothing to fall back to", () => {
        applyTextResourcesForLanguage(multilingualDefaultTextResources, multilingualAppResourceValues, "en", "dibk", "b-v1");
        applyTextResourcesForLanguage(multilingualDefaultTextResources, multilingualAppResourceValues, "nb", "dibk", "b-v1");

        expect(globalThis.fallbackTextResources).toBeNull();
        expect(globalThis.fallbackDefaultTextResources).toBeNull();
    });
});
