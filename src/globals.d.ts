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
}

export {};
