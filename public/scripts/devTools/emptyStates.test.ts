import { renderEmptyPreviewMessage } from "./emptyStates.ts";
import { renderResults } from "./renderers.ts";

describe("renderEmptyPreviewMessage", () => {
    it("says there is nothing to preview, and links to the display layouts page", () => {
        const message = renderEmptyPreviewMessage();
        expect(message.classList.contains("preview-empty")).toBe(true);
        expect(message.querySelector(".preview-empty-heading")!.textContent).toBe("Nothing to preview yet");
        expect(message.textContent).toContain(
            "Paste components into Layout code in the sidebar, import a workspace, or open an app's form from Display layouts in Statistics."
        );
        expect(message.querySelector("a")!.getAttribute("href")).toBe("/statistics/display-layouts");
    });
});

/** Unmocked on purpose: what is under test is what renderResults draws from the layout code really stored. */
describe("renderResults with nothing to draw", () => {
    beforeEach(() => {
        localStorage.clear();
        document.body.innerHTML = '<section id="data-input"></section><main class="page"><div id="code-results"></div></main>';
    });

    it("says so when no layout code is stored", () => {
        renderResults();
        expect(document.querySelector("#code-results .preview-empty")).not.toBeNull();
    });

    it("says so when no component in the layout code has a tag name", () => {
        localStorage.setItem("code", JSON.stringify([{ id: "a" }, { id: "b" }]));
        renderResults();
        expect(document.querySelector("#code-results .preview-empty")).not.toBeNull();
    });

    it("draws the components, and says nothing, once there is one", () => {
        localStorage.setItem("code", JSON.stringify([{ id: "a", tagName: "custom-divider" }]));
        renderResults();
        expect(document.querySelector("#code-results .preview-empty")).toBeNull();
        expect(document.querySelector("#code-results custom-divider")).not.toBeNull();
    });

    it("drops the message when drawn again with a component", () => {
        renderResults();
        localStorage.setItem("code", JSON.stringify([{ id: "a", tagName: "custom-divider" }]));
        renderResults();
        expect(document.querySelectorAll("#code-results .preview-empty")).toHaveLength(0);
    });
});
