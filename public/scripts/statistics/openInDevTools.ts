import type { ApiValue, LayoutComponent } from "../types.ts";
import type { Workspace } from "../devTools/workspace.ts";
// Local functions
import { WORKSPACE_FORMAT, WORKSPACE_VERSION } from "../devTools/workspace.ts";
import { getAppResourceValuesForLanguage } from "../getters.ts";
import { getLocalTextResourcesForApp } from "./textResourceLanguage.ts";
import { languages } from "../languages.ts";

export interface DisplayLayoutForDevTools {
    appOwner: string;
    appName: string;
    /** The components of the form drawn on the page. */
    components: LayoutComponent[];
    /** The app's example data as the page reads it: for each data type, its example files by name. */
    dataModels: { dataType: string; data: Record<string, ApiValue> }[];
    /** The data type the page reads text bindings from, which devTools reads from its first data model. */
    mainDataType: string | undefined;
    /** The example file chosen for each data type. */
    fileNames: Record<string, string>;
    /** Every app's text resources in every language. */
    multilingualAppResourceValues: ApiValue[];
}

/**
 * The devTools workspace that draws what the display layouts page draws: the form's components, one data model per data type holding the chosen example file (the first file when none is chosen), with the main data type first, and the app's own text resources in each language it has any in.
 *
 * @param {DisplayLayoutForDevTools} displayLayout - What the page draws.
 * @returns {Workspace} The workspace.
 */
export function getDevToolsWorkspaceForDisplayLayout(displayLayout: DisplayLayoutForDevTools): Workspace {
    const { appOwner, appName, components, mainDataType, fileNames } = displayLayout;
    const dataModels = displayLayout.dataModels.map(({ dataType, data }) => {
        const chosenFileName = fileNames[dataType];
        const fileName = chosenFileName !== undefined && Object.hasOwn(data, chosenFileName) ? chosenFileName : Object.keys(data)[0];
        return { dataType, data: fileName === undefined ? {} : data[fileName] };
    });
    const mainIndex = dataModels.findIndex(({ dataType }) => dataType === mainDataType);
    if (mainIndex > 0) {
        dataModels.unshift(...dataModels.splice(mainIndex, 1));
    }
    const textResources: Record<string, ApiValue> = {};
    for (const { code } of languages) {
        const appTextResources = getLocalTextResourcesForApp(
            appName,
            appOwner,
            getAppResourceValuesForLanguage(displayLayout.multilingualAppResourceValues, code)
        );
        if (appTextResources?.resources?.length) {
            textResources[code] = appTextResources;
        }
    }
    return { format: WORKSPACE_FORMAT, version: WORKSPACE_VERSION, layoutCode: components, dataModels, textResources };
}
