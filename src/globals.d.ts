declare global {
    /**
     * The page orientation the print stylesheet was last set to.
     *
     * Read by the table renderers, which give an address column more room on a landscape page. It lives on
     * globalThis because the components are independent custom elements with nothing to pass it through.
     */
    var pageOrientation: string | undefined;

    /**
     * What the page hands the components at startup, the same way an Altinn app does.
     *
     * The components read their labels off these rather than being passed them, because each is an independent
     * custom element with nothing to pass them through.
     */
    var selectedLanguage: string | undefined;
    var textResources: unknown;
    var defaultTextResources: unknown;

    /**
     * What the development pages keep on globalThis.
     *
     * The statistics and dev-tools pages are plain scripts with no module boundary between their parts, so the data
     * they fetch and the setting each filter control is on live here rather than being threaded through every
     * renderer. What the API answers with is left open, the same way ApiValue is.
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    var displayLayouts: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    var applicationMetadata: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    var appResourceValues: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    var multilingualAppResourceValues: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    var multilingualDefaultTextResources: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    var exampleData: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    var allTextResourceUsage: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    var componentUsage: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    var packageVersions: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    var latestPackageVersions: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    var altinnStudioForms: any;
    /** When the page last refreshed its data: a timestamp while the page is open, a string once stored. */
    var lastUpdated: string | number | undefined;

    // What each filter control on those pages is currently set to.
    var textFilter: string | undefined;
    var matchBy: string | undefined;
    var selectedFilter: string | undefined;
    var selectedAppOwner: string | undefined;
    var selectedAppName: string | undefined;
    var componentTextFilter: string | undefined;
    var componentMatchBy: string | undefined;
    var componentTypeFilter: string | undefined;
    var componentUsageFilter: string | undefined;
    var componentSelectedAppOwner: string | undefined;
    var componentSelectedAppName: string | undefined;
}

export {};
