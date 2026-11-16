import { EditorView, basicSetup } from "codemirror";
import { HighlightStyle, syntaxHighlighting } from "@codemirror/language";
import { lintGutter, setDiagnostics } from "@codemirror/lint";
import { json } from "@codemirror/lang-json";
import { tags } from "@lezer/highlight";

/**
 * A JSON editor that is used the way the textarea it replaced was: its text is read and set through `value`, it fires `input` as it is typed in, and `change` when it is left after being edited. A JSON error can be marked in it at the place the parser stopped.
 */
export type CodeEditorElement = HTMLDivElement & {
    value: string;
    /** Marks where invalid JSON stops parsing, with the parser's message, or clears the mark when there is no message. */
    setJsonError: (message?: string) => void;
};

/** VS Code's Dark+ colours for JSON, each at least 5.6:1 on the editor's #1e1e1e. */
const darkJsonHighlighting = HighlightStyle.define([
    { tag: tags.propertyName, color: "#9cdcfe" },
    { tag: tags.string, color: "#ce9178" },
    { tag: tags.number, color: "#b5cea8" },
    { tag: [tags.bool, tags.null], color: "#569cd6" },
    { tag: [tags.separator, tags.brace, tags.squareBracket], color: "#d4d4d4" }
]);

/** The editor's frame, from the stylesheet's editor colours. */
const darkTheme = EditorView.theme(
    {
        "&": {
            height: "100%",
            backgroundColor: "var(--color-editor-background)",
            color: "var(--color-editor-text)",
            fontSize: "12px"
        },
        ".cm-scroller": { fontFamily: "monospace", lineHeight: "1.5" },
        ".cm-content": { caretColor: "var(--color-editor-text)" },
        ".cm-cursor, .cm-dropCursor": { borderLeftColor: "var(--color-editor-text)" },
        ".cm-gutters": { backgroundColor: "var(--color-editor-background)", color: "var(--color-text-faint)", border: "none" },
        ".cm-activeLine, .cm-activeLineGutter": { backgroundColor: "rgba(255, 255, 255, 0.04)" },
        "&.cm-focused .cm-selectionBackground, .cm-selectionBackground, .cm-content ::selection": { backgroundColor: "#264f78" },
        "&.cm-focused": { outline: "none" }
    },
    { dark: true }
);

/**
 * Where in the text the JSON parser stopped, from its message: the position it gives, or the end of the text when it ran out of input.
 *
 * The text is parsed without a leading comma (see removeTrailingOrLeadingComma), so a position in what was parsed is one further on in the text when it starts with one.
 *
 * @param {string} text - The text that was parsed.
 * @param {string} message - The parser's message, e.g. "Expected ',' or ']' after array element in JSON at position 7 (line 2 column 4)".
 * @returns {number} The position in the text.
 */
export function getJsonErrorPosition(text: string, message: string) {
    const match = /at position (\d+)/.exec(message);
    if (!match) return text.length;
    const position = Number(match[1]) + (text.startsWith(",") ? 1 : 0);
    return Math.min(position, text.length);
}

/**
 * Creates the editor, holding the given text.
 *
 * @param {string} text - The text to start with.
 * @returns {CodeEditorElement} The editor.
 */
export function createCodeEditor(text: string) {
    const element = document.createElement("div") as CodeEditorElement;
    element.classList.add("code-editor");

    // Text set through `value` is not typing, so it fires nothing, as with a textarea.
    let settingValue = false;
    // Whether the text was typed in since the editor was last left, which is when a textarea fires `change`.
    let edited = false;

    const view = new EditorView({
        doc: text,
        parent: element,
        extensions: [
            basicSetup,
            json(),
            syntaxHighlighting(darkJsonHighlighting),
            darkTheme,
            lintGutter(),
            EditorView.contentAttributes.of({ "aria-label": "JSON" }),
            EditorView.updateListener.of((update) => {
                if (!update.docChanged || settingValue) return;
                edited = true;
                element.dispatchEvent(new Event("input", { bubbles: true }));
            }),
            EditorView.domEventHandlers({
                blur: () => {
                    if (!edited) return;
                    edited = false;
                    element.dispatchEvent(new Event("change", { bubbles: true }));
                }
            })
        ]
    });

    Object.defineProperty(element, "value", {
        get: () => view.state.doc.toString(),
        set: (value: string) => {
            settingValue = true;
            try {
                view.dispatch({ changes: { from: 0, to: view.state.doc.length, insert: value } });
            } finally {
                settingValue = false;
            }
        }
    });

    element.setJsonError = (message?: string) => {
        if (!message) {
            view.dispatch(setDiagnostics(view.state, []));
            return;
        }
        const position = getJsonErrorPosition(view.state.doc.toString(), message);
        view.dispatch(setDiagnostics(view.state, [{ from: position, to: position, severity: "error", message }]));
    };

    return element;
}
