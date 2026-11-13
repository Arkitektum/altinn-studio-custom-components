import type { ApiValue } from "../types.ts";
// Local functions
import {
    addValueToLocalStorage,
    getDataModels,
    getLayoutCode,
    getTextResources,
    getTextResourcesStorageKey,
    getValueFromLocalStorage
} from "../localStorage.ts";
import { languages } from "../languages.ts";

export const WORKSPACE_FORMAT = "altinn-studio-custom-components-devtools-workspace";
export const WORKSPACE_VERSION = 1;

export interface Workspace {
    format: typeof WORKSPACE_FORMAT;
    version: typeof WORKSPACE_VERSION;
    layoutCode: ApiValue;
    dataModels: ApiValue[];
    textResources: Record<string, ApiValue>;
}

/**
 * Everything devTools keeps in localStorage that makes up what is drawn: the layout code, the data models, and the app's text resources for each language that has any stored.
 *
 * @returns {Workspace} The workspace.
 */
export function getWorkspace(): Workspace {
    const textResources = Object.fromEntries(
        languages
            .filter(({ code }) => getValueFromLocalStorage(getTextResourcesStorageKey(code)) !== null)
            .map(({ code }) => [code, getTextResources(code)])
    );
    return { format: WORKSPACE_FORMAT, version: WORKSPACE_VERSION, layoutCode: getLayoutCode(), dataModels: getDataModels(), textResources };
}

/**
 * The name an exported workspace is saved under, with the local date it was exported.
 *
 * @param {Date} [date] - When it is exported.
 * @returns {string} The file name.
 */
export function getWorkspaceFileName(date = new Date()) {
    const pad = (value: number) => String(value).padStart(2, "0");
    return `devtools-workspace-${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}.json`;
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
    return typeof value === "object" && value !== null && !Array.isArray(value);
}

/**
 * Reads an exported workspace file. Text resources for a language devTools does not offer are left out.
 *
 * @param {string} text - The file's content.
 * @returns {{ workspace?: Workspace, error?: string }} The workspace, or why the file cannot be imported.
 */
export function parseWorkspace(text: string): { workspace?: Workspace; error?: string } {
    let value: unknown;
    try {
        value = JSON.parse(text);
    } catch (error) {
        return { error: `The file is not valid JSON: ${(error as Error).message}` };
    }
    if (!isPlainObject(value) || value.format !== WORKSPACE_FORMAT) {
        return { error: "The file is not a devTools workspace." };
    }
    if (value.version !== WORKSPACE_VERSION) {
        return { error: `Workspace version ${String(value.version)} cannot be imported, only version ${WORKSPACE_VERSION}.` };
    }
    const dataModels = value.dataModels ?? [];
    if (!Array.isArray(dataModels) || !dataModels.every(isPlainObject)) {
        return { error: "dataModels in the file is not a list of data models." };
    }
    const textResources = value.textResources ?? {};
    if (!isPlainObject(textResources) || !Object.values(textResources).every(isPlainObject)) {
        return { error: "textResources in the file is not text resources by language." };
    }
    return {
        workspace: {
            format: WORKSPACE_FORMAT,
            version: WORKSPACE_VERSION,
            layoutCode: value.layoutCode ?? [],
            dataModels,
            textResources: Object.fromEntries(
                languages.filter(({ code }) => Object.hasOwn(textResources, code)).map(({ code }) => [code, textResources[code]])
            )
        }
    };
}

/**
 * Replaces what devTools keeps in localStorage with a workspace. A language without text resources in the workspace has its stored ones removed.
 *
 * @param {Workspace} workspace - The workspace.
 */
export function storeWorkspace(workspace: Workspace) {
    addValueToLocalStorage("code", JSON.stringify(workspace.layoutCode, null, 2));
    addValueToLocalStorage("dataModels", JSON.stringify(workspace.dataModels));
    for (const { code } of languages) {
        const storageKey = getTextResourcesStorageKey(code);
        if (Object.hasOwn(workspace.textResources, code)) {
            addValueToLocalStorage(storageKey, JSON.stringify(workspace.textResources[code], null, 2));
        } else {
            localStorage.removeItem(storageKey);
        }
    }
}
