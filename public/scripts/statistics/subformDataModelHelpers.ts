/** One field of a data model, as `/api/subformDataModels` reads it from an app's XSD. */
export interface XsdField {
    /** Dot-separated from below the root element, the way a layout's `dataModelBindings` name a field. */
    path: string;
    node: "element" | "attribute";
    /** The built-in XSD type the value is held as. Null for an element that holds other elements. */
    type: string | null;
    minOccurs: number;
    maxOccurs: number | "unbounded";
    fixed?: string;
}

/** One app's copy of a subform's data model. */
export interface SubformDataModelCopy {
    appOwner: string;
    appName: string;
    /** Why `fields` is empty: the copy could not be read or parsed. */
    error: string | null;
    rootElement: string | null;
    fields: XsdField[];
}

/** Every app's copy of one subform's data model, as `/api/subformDataModels` answers it. */
export interface SubformDataModels {
    dataType: string;
    copies: SubformDataModelCopy[];
}

/** Copies of a subform's model that declare exactly the same fields. */
export interface SubformDataModelVariant {
    apps: { appOwner: string; appName: string }[];
    rootElement: string;
    fieldCount: number;
}

/** A field the variants do not agree on. */
export interface SubformDataModelDifference {
    path: string;
    /** The field as each variant declares it, in the order of `variants`, or null where a variant lacks it. */
    fields: (XsdField | null)[];
    /** Fields below this one that are left out because they differ only by being under it. */
    hiddenBelow: number;
}

/** How the copies of one subform's model have drifted apart. */
export interface SubformDataModelDrift {
    dataType: string;
    /** Most apps first. A single variant means every readable copy agrees. */
    variants: SubformDataModelVariant[];
    /** Sorted by path, so a field comes right after the group holding it. */
    differences: SubformDataModelDifference[];
    /** Copies that could not be read, which belong to no variant. */
    unreadable: { appOwner: string; appName: string; error: string }[];
}

/**
 * @param {XsdField} field
 * @returns {string} What makes two declarations of the field the same, as text.
 */
function fieldSignature(field: XsdField): string {
    return JSON.stringify([field.node, field.type, field.minOccurs, field.maxOccurs, field.fixed ?? null]);
}

/**
 * @param {SubformDataModelCopy} copy
 * @returns {string} What makes two copies the same variant: the root element and every field, regardless of order.
 */
function copySignature(copy: SubformDataModelCopy): string {
    const fields = copy.fields.map((field) => `${field.path} ${fieldSignature(field)}`).sort();
    return JSON.stringify([copy.rootElement, fields]);
}

/**
 * @param {string} path
 * @returns {string|null} The path of the group holding the field, or null for a field directly below the root.
 */
function parentPath(path: string): string | null {
    const lastDot = path.lastIndexOf(".");
    return lastDot === -1 ? null : path.slice(0, lastDot);
}

/**
 * Says whether a field differs only because the group holding it does: it is missing from exactly the variants that
 * lack the group, and declared the same way everywhere else.
 *
 * @param {Array} fields - The field in each variant.
 * @param {Array} parentFields - The group holding it, in each variant.
 * @returns {boolean}
 */
function differsOnlyThroughParent(fields: (XsdField | null)[], parentFields: (XsdField | null)[]): boolean {
    if (fields.some((field, index) => (field === null) !== (parentFields[index] === null))) return false;
    const present = fields.filter((field) => field !== null);
    return present.every((field) => fieldSignature(field) === fieldSignature(present[0]!));
}

/**
 * Compares the variants of one subform's model field by field.
 *
 * @param {Array} variantFields - Each variant's fields by path.
 * @returns {SubformDataModelDifference[]} The fields the variants do not agree on, sorted by path.
 */
function getDifferences(variantFields: Map<string, XsdField>[]): SubformDataModelDifference[] {
    const allPaths = [...new Set(variantFields.flatMap((fields) => [...fields.keys()]))].sort();
    const fieldsByPath: Map<string, (XsdField | null)[]> = new Map();
    for (const path of allPaths) {
        const fields = variantFields.map((byPath) => byPath.get(path) ?? null);
        const signatures = new Set(fields.map((field) => (field ? fieldSignature(field) : null)));
        if (signatures.size > 1) fieldsByPath.set(path, fields);
    }

    // A group missing from one variant would otherwise bring a row for every field inside it. Those rows are folded
    // into the group's, which counts them. Parents sort before their children, so a parent's row exists by then.
    const shownAs: Map<string, SubformDataModelDifference> = new Map();
    const differences: SubformDataModelDifference[] = [];
    for (const [path, fields] of fieldsByPath) {
        const parent = parentPath(path);
        const parentFields = parent === null ? undefined : fieldsByPath.get(parent);
        const parentRow = parent === null ? undefined : shownAs.get(parent);
        if (parentFields && parentRow && differsOnlyThroughParent(fields, parentFields)) {
            parentRow.hiddenBelow++;
            shownAs.set(path, parentRow);
            continue;
        }
        const row = { path, fields, hiddenBelow: 0 };
        differences.push(row);
        shownAs.set(path, row);
    }
    return differences;
}

/**
 * Groups each subform's copies into variants, the copies in a variant declaring exactly the same fields, and lists the
 * fields the variants do not agree on.
 *
 * No copy is the reference. A subform's model is saved in every app that carries it and nowhere else, so the page can
 * show which apps are out of step with each other but not which copy is right.
 *
 * @param {SubformDataModels[]|undefined} entries - As `/api/subformDataModels` answers them.
 * @returns {SubformDataModelDrift[]} One per subform data type, in the order given.
 */
export function getSubformDataModelDrift(entries: SubformDataModels[] | undefined): SubformDataModelDrift[] {
    return (entries || []).map(({ dataType, copies }) => {
        const unreadable = copies
            .filter((copy) => copy.error !== null || !copy.rootElement)
            .map(({ appOwner, appName, error }) => ({ appOwner, appName, error: error ?? "The copy declares no root element." }));

        const variantsBySignature: Map<string, { variant: SubformDataModelVariant; fields: Map<string, XsdField> }> = new Map();
        for (const copy of copies) {
            if (copy.error !== null || !copy.rootElement) continue;
            const signature = copySignature(copy);
            const existing = variantsBySignature.get(signature);
            if (existing) {
                existing.variant.apps.push({ appOwner: copy.appOwner, appName: copy.appName });
                continue;
            }
            variantsBySignature.set(signature, {
                variant: {
                    apps: [{ appOwner: copy.appOwner, appName: copy.appName }],
                    rootElement: copy.rootElement,
                    fieldCount: copy.fields.length
                },
                fields: new Map(copy.fields.map((field) => [field.path, field]))
            });
        }

        // Sorted stably, so variants with as many apps keep the order their first app has in the catalogue.
        const grouped = [...variantsBySignature.values()].sort((a, b) => b.variant.apps.length - a.variant.apps.length);
        return {
            dataType,
            variants: grouped.map(({ variant }) => variant),
            differences: getDifferences(grouped.map(({ fields }) => fields)),
            unreadable
        };
    });
}
