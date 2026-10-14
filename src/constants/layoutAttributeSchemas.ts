/**
 * The attributes a layout can give any custom component, as JSON Schema, for the layout schema this package publishes.
 *
 * One list for every component: a component that ignores an attribute still accepts it. The names are the ones `getPropsFromElementAttributes` reads from an element, less the ones a parent component sets on its children, and layoutSchemaHelpers.test.ts fails when the two drift apart.
 */
export const layoutAttributeSchemas: Record<string, object> = {
    resourceBindings: {
        type: "object",
        description:
            'Overrides for the text resources the component shows, grouped the way the component groups them, for example { "title": "my-app.heading" }, naming text resource ids.'
    },
    hideIfEmpty: { type: "boolean", description: "Hides the component when it has no data to show." },
    hideTitle: { type: "boolean", description: "Leaves out the component's title." },
    inline: { type: "boolean", description: "Shows the title and the value on one line, with a colon after the title." },
    size: { enum: ["h1", "h2", "h3", "h4", "h5", "h6"], description: "The heading level of the component's title." },
    styleOverride: {
        type: "object",
        additionalProperties: { type: ["string", "number"] },
        description: 'CSS properties applied to the component, written in camelCase, for example { "marginTop": "12px" }.'
    },
    format: {
        enum: ["dateTime", "date", "time", "AR", "meterSquared"],
        description:
            "How the value is formatted: as a date and time, a date or a time, as the part after the last hyphen (AR), or as a number of square metres (meterSquared)."
    },
    enableLinks: { type: "boolean", description: "Turns web addresses in the value into links." },
    hideOrgNr: { type: "boolean", description: "Leaves out the organisation number of a party." },
    tableColumns: {
        type: "array",
        items: { type: "object" },
        description: "The columns of a table, each naming the data it shows and the component that shows it."
    },
    showRowNumbers: { type: "boolean", description: "Numbers the rows of a table." },
    order: {
        type: "object",
        properties: {
            key: { type: "string", description: "The key in each row to sort by." },
            direction: { enum: ["asc", "desc"], description: "Ascending or descending. Ascending when left out." }
        },
        additionalProperties: false,
        description: "How the rows of a table are sorted."
    },
    feedbackType: { enum: ["error", "warning", "info", "success", "default"], description: "The kind of feedback shown, which decides its colour." },
    itemKey: { type: "string", description: "The key in each item whose value is shown, as a dot-separated path." },
    itemTermKey: { type: "string", description: "The key in each item whose value is the term in a description list, as a dot-separated path." },
    itemDescriptionKey: {
        type: "string",
        description: "The key in each item whose value is the description in a description list, as a dot-separated path."
    },
    dataItemKey: { type: "string", description: "The key in each item of the bound data whose value is shown, as a dot-separated path." },
    dataTitleItemKey: { type: "string", description: "The key in each item of the bound data whose value is its title, as a dot-separated path." }
};

/** Attributes the components no longer read, each with what to do instead, so a layout still giving one is told rather than silently ignored. */
export const deprecatedLayoutAttributes: Record<string, string> = {
    partType: "No component has read partType since 2026-04-30, so it can be removed"
};
