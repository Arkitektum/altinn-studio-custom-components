import { getPackageVersionClasses, getVersionColorClass } from "./versionStatus.ts";

describe("getVersionColorClass", () => {
    it.each([
        ["16.0.0", "17.11.2", "version-outdated-major"],
        ["17.10.9", "17.11.2", "version-outdated-minor"],
        ["17.11.1", "17.11.2", "version-outdated-patch"],
        ["17.11.2", "17.11.2", null],
        ["18.0.0", "17.11.2", null],
        [undefined, "17.11.2", null],
        ["N/A", "17.11.2", null]
    ])("gives %s against %s the class %s", (version, latest, expected) => {
        expect(getVersionColorClass(version, latest)).toBe(expected);
    });
});

describe("getPackageVersionClasses", () => {
    it("compares the frontend's CSS and JS with the frontend's one release, and the other packages with their own", () => {
        const latest = { altinnStudioCustomComponents: "17.11.2", altinnAppFrontend: "4.37.0", dibkFtpbCommonAltinnApps: "1.7.5" };
        expect(
            getPackageVersionClasses(
                {
                    altinnStudioCustomComponents: "16.0.0",
                    altinnAppFrontendCSS: "4.36.0",
                    altinnAppFrontendJS: "4.36.5",
                    dibkFtpbCommonAltinnApps: "1.7.4"
                },
                latest
            )
        ).toEqual({
            altinnStudioCustomComponents: "version-outdated-major",
            altinnAppFrontendCSS: "version-outdated-minor",
            altinnAppFrontendJS: "version-outdated-minor",
            dibkFtpbCommonAltinnApps: "version-outdated-patch"
        });
    });

    it("gives no class when either version is unknown", () => {
        expect(getPackageVersionClasses(undefined, undefined)).toEqual({
            altinnStudioCustomComponents: null,
            altinnAppFrontendCSS: null,
            altinnAppFrontendJS: null,
            dibkFtpbCommonAltinnApps: null
        });
    });
});
