/**
 * Parses a version string into an object containing major, minor, and patch numbers. The version string is expected to be in the format "major.minor.patch", where minor and patch are optional. If the version string is not in a valid format, the function returns null.
 *
 * @param {string} version - The version string to parse.
 * @returns {{major: number, minor: number, patch: number} | null} An object containing the major, minor, and patch numbers, or null if the version string is invalid.
 */
export function parseVersion(version: string | undefined) {
    if (!version) return null;
    const match = new RegExp(/^(\d+)(?:\.(\d+))?(?:\.(\d+))?/).exec(String(version));
    if (!match) return null;
    return {
        major: Number.parseInt(match[1]!, 10),
        minor: Number.parseInt(match[2] ?? "0", 10),
        patch: Number.parseInt(match[3] ?? "0", 10)
    };
}

/**
 * Determines the CSS class for a version based on its comparison with the latest version.
 *
 * @param {string} version - The version string to compare.
 * @param {string} latestVersion - The latest version string to compare against.
 * @returns {string | null} The CSS class representing the version status, or null if the version strings are invalid.
 */
export function getVersionColorClass(version: string | undefined, latestVersion: string | undefined) {
    const v = parseVersion(version);
    const latest = parseVersion(latestVersion);
    if (!v || !latest) return null;
    if (v.major < latest.major) return "version-outdated-major";
    if (v.major === latest.major && v.minor < latest.minor) return "version-outdated-minor";
    if (v.major === latest.major && v.minor === latest.minor && v.patch < latest.patch) return "version-outdated-patch";
    return null;
}

/** The packages on the package versions page, each with the key its latest version is kept under. The app frontend's CSS and JS share one release. */
const PACKAGES = {
    altinnStudioCustomComponents: "altinnStudioCustomComponents",
    altinnAppFrontendCSS: "altinnAppFrontend",
    altinnAppFrontendJS: "altinnAppFrontend",
    dibkFtpbCommonAltinnApps: "dibkFtpbCommonAltinnApps"
} as const;

export type PackageName = keyof typeof PACKAGES;

/**
 * How far behind the latest release each of an app's packages is.
 *
 * @param {Object} versions - The versions the app has installed, by package.
 * @param {Object} latestVersions - The latest release of each package.
 * @returns {Object} For each package, the CSS class for how far behind it is, or null when it is not behind or either version is unknown.
 */
export function getPackageVersionClasses(
    versions: Partial<Record<PackageName, string>> | undefined,
    latestVersions: Partial<Record<string, string>> | undefined
): Record<PackageName, string | null> {
    const classes = {} as Record<PackageName, string | null>;
    for (const [name, latestKey] of Object.entries(PACKAGES) as [PackageName, string][]) {
        classes[name] = getVersionColorClass(versions?.[name], latestVersions?.[latestKey]);
    }
    return classes;
}
