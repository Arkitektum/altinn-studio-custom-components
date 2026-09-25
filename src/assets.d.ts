/**
 * The non-code imports webpack resolves.
 *
 * A component imports its own stylesheet as a constructable stylesheet, which the browser and webpack both
 * understand but TypeScript has no declaration for.
 */
declare module "*.css" {
    const styleSheet: CSSStyleSheet;
    export default styleSheet;
}

declare module "*.svg" {
    const source: string;
    export default source;
}
