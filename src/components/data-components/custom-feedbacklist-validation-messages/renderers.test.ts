import { renderValidationMessagesElement } from "./renderers.ts";

/** The messages gathered for a component, grouped by how serious each group is. */
const validationMessages = {
    error: ["Mangler adresse", "Mangler gårdsnummer"],
    warning: ["Tiltaksklasse er ikke oppgitt"],
    info: [],
    hint: ["Husk vedlegg"]
};

/** The rendered markup parsed back into elements, since this renderer answers with markup rather than a node. */
function parse(markup: string): HTMLElement {
    const holder = document.createElement("div");
    holder.innerHTML = markup;
    return holder.firstChild as HTMLElement;
}

/** The feedback lists drawn, in order. */
const lists = (markup: string) => [...parse(markup).children!];

describe("what it answers with", () => {
    it("answers with markup rather than an element", () => {
        // It is written into another component's markup, so it has to arrive as text rather than as a node.
        expect(typeof renderValidationMessagesElement(validationMessages)).toBe("string");
    });

    it("wraps the lists in a container of its own", () => {
        expect(parse(renderValidationMessagesElement(validationMessages)).classList.contains("validation-messages-container")).toBe(true);
    });
});

describe("the lists", () => {
    it("draws one list per group that has messages in it", () => {
        expect(lists(renderValidationMessagesElement(validationMessages))).toHaveLength(3);
    });

    it("leaves out a group with no messages, rather than drawing an empty list", () => {
        // The info group is empty here, so it does not appear between the warnings and what follows them.
        const types = lists(renderValidationMessagesElement(validationMessages)).map((list) => list.getAttribute("feedbacktype"));

        expect(types).toEqual(["error", "warning", "default"]);
    });

    it("falls back to the default kind for a group it has no styling for", () => {
        // The group is still drawn, and reads as an ordinary message rather than as an error.
        expect(lists(renderValidationMessagesElement({ hint: ["Husk vedlegg"] }))[0]!.getAttribute("feedbacktype")).toBe("default");
        expect(lists(renderValidationMessagesElement({ warning: ["Mangler"] }))[0]!.getAttribute("feedbacktype")).toBe("warning");
    });

    it("names each list by the kind of message it holds, and counts them in the title", () => {
        const titles = lists(renderValidationMessagesElement(validationMessages)).map(
            (list) => JSON.parse(list.getAttribute("resourcevalues")!).title
        );

        expect(titles).toEqual(["Errors (2)", "Warnings (1)", "Messages (1)"]);
    });

    it("gives a kind it does not know a title of its own rather than none", () => {
        // A new kind of message should still appear, even before anyone has written wording for it.
        expect(
            JSON.parse(lists(renderValidationMessagesElement({ hint: ["Husk vedlegg"] }))[0]!.getAttribute("resourcevalues")!).title
        ).toBe("Messages (1)");
    });

    it("hands the messages themselves to each list", () => {
        const data = JSON.parse(lists(renderValidationMessagesElement(validationMessages))[0]!.getAttribute("resourcevalues")!).data;

        expect(data).toEqual(["Mangler adresse", "Mangler gårdsnummer"]);
    });

    it("marks every list as a child component", () => {
        for (const list of lists(renderValidationMessagesElement(validationMessages))) {
            expect(list.getAttribute("ischildcomponent")).toBe("true");
        }
    });
});

describe("with nothing to report", () => {
    it("answers with an empty container", () => {
        expect(lists(renderValidationMessagesElement({}))).toHaveLength(0);
        expect(lists(renderValidationMessagesElement({ error: [] }))).toHaveLength(0);
    });
});
