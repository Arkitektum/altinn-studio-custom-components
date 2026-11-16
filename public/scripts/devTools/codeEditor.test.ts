import { createCodeEditor, getJsonErrorPosition } from "./codeEditor.ts";
import { diagnosticCount, forEachDiagnostic } from "@codemirror/lint";
import { EditorView } from "codemirror";

/** The editor's view, as typing reaches it. */
function viewOf(editor: HTMLElement) {
    return EditorView.findFromDOM(editor.querySelector(".cm-editor") as HTMLElement)!;
}

/** Types into the editor as a person would: an edit the editor marks as typing. */
function type(editor: HTMLElement, text: string) {
    const view = viewOf(editor);
    view.dispatch({ changes: { from: view.state.doc.length, insert: text }, userEvent: "input.type" });
}

function leave(editor: HTMLElement) {
    viewOf(editor).contentDOM.dispatchEvent(new FocusEvent("blur"));
}

function diagnostics(editor: HTMLElement) {
    const found: { from: number; message: string }[] = [];
    forEachDiagnostic(viewOf(editor).state, (diagnostic) => found.push({ from: diagnostic.from, message: diagnostic.message }));
    return found;
}

describe("getJsonErrorPosition", () => {
    it("reads the position from the parser's message", () => {
        expect(getJsonErrorPosition("[1,\n 2 x]", "Expected ',' or ']' after array element in JSON at position 7 (line 2 column 4)")).toBe(7);
    });
    it("counts the leading comma left out before parsing", () => {
        expect(getJsonErrorPosition(',{"a":1,}', "Expected double-quoted property name in JSON at position 7 (line 1 column 8)")).toBe(8);
    });
    it("is the end of the text when the parser ran out of it", () => {
        expect(getJsonErrorPosition('{"a":', "Unexpected end of JSON input")).toBe(5);
    });
    it("never points past the end of the text", () => {
        expect(getJsonErrorPosition("{}", "Unexpected token in JSON at position 40")).toBe(2);
    });
});

describe("createCodeEditor", () => {
    beforeEach(() => {
        document.body.innerHTML = "";
    });

    it("holds the text it is given, read through value, as a textarea's is", () => {
        const editor = createCodeEditor('{"a":1}');
        expect(editor.classList.contains("code-editor")).toBe(true);
        expect(editor.value).toBe('{"a":1}');
    });

    it("takes text set through value without firing input or change", () => {
        const editor = createCodeEditor("");
        document.body.appendChild(editor);
        const events: string[] = [];
        editor.addEventListener("input", () => events.push("input"));
        editor.addEventListener("change", () => events.push("change"));
        editor.value = "[1, 2]";
        leave(editor);
        expect(editor.value).toBe("[1, 2]");
        expect(events).toEqual([]);
    });

    it("fires input, bubbling, as it is typed in", () => {
        const editor = createCodeEditor("[");
        document.body.appendChild(editor);
        let bubbled = 0;
        document.body.addEventListener("input", () => bubbled++);
        type(editor, "1");
        type(editor, "]");
        expect(editor.value).toBe("[1]");
        expect(bubbled).toBe(2);
    });

    it("fires change once when it is left after typing, and not when left without typing", () => {
        const editor = createCodeEditor("[");
        document.body.appendChild(editor);
        let changes = 0;
        editor.onchange = () => changes++;
        leave(editor);
        expect(changes).toBe(0);
        type(editor, "]");
        leave(editor);
        leave(editor);
        expect(changes).toBe(1);
    });

    it("numbers the lines and names the text area for assistive technology", () => {
        const editor = createCodeEditor("{\n}");
        document.body.appendChild(editor);
        expect(editor.querySelector(".cm-lineNumbers")).not.toBeNull();
        expect(viewOf(editor).contentDOM.getAttribute("aria-label")).toBe("JSON");
    });

    it("marks where the JSON stopped parsing, and clears the mark", () => {
        const editor = createCodeEditor("[1,\n 2 x]");
        document.body.appendChild(editor);
        editor.setJsonError("Expected ',' or ']' after array element in JSON at position 7 (line 2 column 4)");
        expect(diagnostics(editor)).toEqual([
            { from: 7, message: "Expected ',' or ']' after array element in JSON at position 7 (line 2 column 4)" }
        ]);
        expect(editor.querySelector(".cm-gutter-lint .cm-lint-marker-error")).not.toBeNull();
        editor.setJsonError();
        expect(diagnosticCount(viewOf(editor).state)).toBe(0);
    });
});
