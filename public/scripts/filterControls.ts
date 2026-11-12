import { getFormFilterOptions, selectStoredOption, setSelectOptions } from "./statistics/displayLayoutHelpers.ts";
import type { ApiValue } from "./types.ts";

/*
 * The filter controls the usage pages share. Each page keeps its choices on globalThis under names of its own, so a
 * control is told which names to read and write, and what to call when a choice changes.
 */

/** A choice kept on globalThis between visits to a page and across a synchronization. */
export interface StoredChoice {
    get(): string | undefined;
    set(value: string): void;
}

/**
 * The choice kept under one name on globalThis.
 *
 * @param {string} name - The name it is kept under.
 * @returns {StoredChoice} Reads and writes that name.
 */
export function storedChoice(name: keyof typeof globalThis): StoredChoice {
    const store = globalThis as unknown as Record<string, string | undefined>;
    return {
        get: () => store[name],
        set: (value: string) => {
            store[name] = value;
        }
    };
}

/**
 * Renders a labelled select with the given options, wrapped in a filter container.
 *
 * @param {string} labelText - The label shown for the select.
 * @param {string} selectId - The id given to the select, which the label points to.
 * @param {Array<{ value: string, text: string }>} options - The options to render, first one selected by default.
 * @param {Function} onChange - Called with the select's value whenever the selection changes.
 * @param {string} [storedValue] - A value chosen before, selected instead of the first option when it is offered.
 * @returns {HTMLFormElement} The container element holding the label and select.
 */
export function renderLabelledSelectFilter(
    labelText: string,
    selectId: string,
    options: { value: string; text: string }[],
    onChange: (value: string) => void,
    storedValue?: string
) {
    const filterContainerElement = document.createElement("form");
    filterContainerElement.classList.add("filter-container");

    const labelElement = document.createElement("label");
    labelElement.htmlFor = selectId;
    labelElement.textContent = labelText;
    filterContainerElement.appendChild(labelElement);

    const selectElement = document.createElement("select");
    selectElement.id = selectId;
    options.forEach((option) => {
        const optionElement = document.createElement("option");
        optionElement.value = option.value;
        optionElement.textContent = option.text;
        selectElement.appendChild(optionElement);
    });

    selectElement.onchange = () => onChange(selectElement.value);
    selectStoredOption(selectElement, storedValue, options[0]?.value ?? "");

    filterContainerElement.appendChild(selectElement);
    return filterContainerElement;
}

/** Where an application filter and the form filter that follows it keep their choices. */
export interface AppFormChoices {
    appOwner: StoredChoice;
    appName: StoredChoice;
    form: StoredChoice;
}

/**
 * Renders a select for filtering by application, starting on the app chosen before when it is still offered.
 *
 * Choosing an app rebuilds the options of the page's form filter, as the forms on offer follow the app.
 *
 * @param {HTMLElement} containerElement - The page, where the form filter is looked up.
 * @param {Object} options
 * @param {string} options.selectId - The id given to this select.
 * @param {string} options.formSelectId - The id of the page's form filter select.
 * @param {Array<{ appOwner: string, appName: string }>} options.applications - The applications to offer.
 * @param {AppFormChoices} options.choices - Where the choices are kept.
 * @param {Function} options.onChange - Called after a new app has been chosen.
 * @returns {HTMLFormElement} The container element holding the label and select.
 */
export function renderApplicationFilter(
    containerElement: HTMLElement,
    {
        selectId,
        formSelectId,
        applications,
        choices,
        onChange
    }: { selectId: string; formSelectId: string; applications: ApiValue; choices: AppFormChoices; onChange: () => void }
) {
    const appOptions = (applications || []).map((app: ApiValue) => {
        const pair = `${app?.appOwner}/${app?.appName}`;
        return { value: pair, text: pair };
    });
    const filterElement = renderLabelledSelectFilter("Application", selectId, [{ value: "", text: "All applications" }, ...appOptions], (value) => {
        const [appOwner, appName] = value.split("/");
        choices.appOwner.set(appOwner || "");
        choices.appName.set(appName || "");
        const formSelectElement = containerElement.querySelector(`#${formSelectId}`) as HTMLSelectElement | null;
        if (formSelectElement) {
            const formOptions = getFormFilterOptions(applications, choices.appOwner.get(), choices.appName.get());
            choices.form.set(setSelectOptions(formSelectElement, formOptions, choices.form.get() || ""));
        }
        onChange();
    });

    // Starts on the app chosen before, when there is one and it is still offered.
    const storedApp = choices.appOwner.get() && choices.appName.get() ? `${choices.appOwner.get()}/${choices.appName.get()}` : "";
    if (!selectStoredOption(filterElement.querySelector("select") as HTMLSelectElement, storedApp, "")) {
        choices.appOwner.set("");
        choices.appName.set("");
    }
    return filterElement;
}

/**
 * Renders a select for filtering by form: every form, the main form, or one of the subforms of the chosen app. Its
 * options follow the application filter, which rebuilds them when the app changes.
 *
 * @param {Object} options
 * @param {string} options.selectId - The id given to this select, which the application filter looks up.
 * @param {Array<Object>} options.applications - The display layout entries, whose subforms are offered.
 * @param {AppFormChoices} options.choices - Where the choices are kept.
 * @param {Function} options.onChange - Called after a new form has been chosen.
 * @returns {HTMLFormElement} The container element holding the label and select.
 */
export function renderFormFilter({
    selectId,
    applications,
    choices,
    onChange
}: {
    selectId: string;
    applications: ApiValue;
    choices: AppFormChoices;
    onChange: () => void;
}) {
    const formOptions = getFormFilterOptions(applications, choices.appOwner.get(), choices.appName.get());
    const filterElement = renderLabelledSelectFilter("Form", selectId, formOptions, (value) => {
        choices.form.set(value);
        onChange();
    });
    // Keep a form chosen before when it is still on offer, and fall back to every form when it is not.
    choices.form.set(setSelectOptions(filterElement.querySelector("select") as HTMLSelectElement, formOptions, choices.form.get() || ""));
    return filterElement;
}

/**
 * Renders a text input for filtering, with a select saying what the text is matched against.
 *
 * @param {Object} options
 * @param {string} options.inputId - The id given to the text input, which the label points to.
 * @param {string} options.matchById - The id given to the match-by select.
 * @param {string} options.placeholder - The input's placeholder.
 * @param {Array<{ value: string, text: string }>} options.matchOptions - What the text can be matched against, the
 *   first being the default.
 * @param {StoredChoice} options.text - Where the text is kept.
 * @param {StoredChoice} options.matchBy - Where the match-by choice is kept.
 * @param {Function} options.onChange - Called after the text or the match-by choice changes.
 * @returns {HTMLDivElement} The container element holding the label, input and select.
 */
export function renderTextFilter({
    inputId,
    matchById,
    placeholder,
    matchOptions,
    text,
    matchBy,
    onChange
}: {
    inputId: string;
    matchById: string;
    placeholder: string;
    matchOptions: { value: string; text: string }[];
    text: StoredChoice;
    matchBy: StoredChoice;
    onChange: () => void;
}) {
    const textInputContainerElement = document.createElement("div");
    textInputContainerElement.classList.add("filter-container");

    const textInputLabelElement = document.createElement("label");
    textInputLabelElement.htmlFor = inputId;
    textInputLabelElement.textContent = "Filter by text";
    textInputContainerElement.appendChild(textInputLabelElement);

    const textFilterInputElement = document.createElement("input");
    textFilterInputElement.id = inputId;
    textFilterInputElement.type = "text";
    textFilterInputElement.placeholder = placeholder;
    textInputContainerElement.appendChild(textFilterInputElement);

    const matchBySelectElement = document.createElement("select");
    matchBySelectElement.id = matchById;
    matchOptions.forEach((option) => {
        const optionElement = document.createElement("option");
        optionElement.value = option.value;
        optionElement.textContent = option.text;
        matchBySelectElement.appendChild(optionElement);
    });
    textInputContainerElement.appendChild(matchBySelectElement);

    textFilterInputElement.value = text.get() || "";
    matchBy.set(selectStoredOption(matchBySelectElement, matchBy.get(), matchOptions[0]?.value ?? ""));

    const update = () => {
        text.set(textFilterInputElement.value);
        matchBy.set(matchBySelectElement.value);
        onChange();
    };
    textFilterInputElement.oninput = update;
    matchBySelectElement.onchange = update;

    return textInputContainerElement;
}
