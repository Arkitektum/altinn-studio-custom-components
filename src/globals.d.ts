declare global {
    /**
     * The page orientation the print stylesheet was last set to.
     *
     * Read by the table renderers, which give an address column more room on a landscape page. It lives on
     * globalThis because the components are independent custom elements with nothing to pass it through.
     */
    var pageOrientation: string | undefined;
}

export {};
