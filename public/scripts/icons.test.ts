import type { IconName } from "./icons.ts";

import { createIcon, setIconLabel } from "./icons.ts";

const iconNames: IconName[] = ["book", "components", "database", "layout", "link", "package", "sort", "trash"];

describe("createIcon", () => {
    it.each(iconNames)("draws %s as an SVG outline in the text colour, hidden from assistive technology", (name) => {
        const icon = createIcon(name);
        expect(icon.namespaceURI).toBe("http://www.w3.org/2000/svg");
        expect(icon.getAttribute("viewBox")).toBe("0 0 24 24");
        expect(icon.getAttribute("stroke")).toBe("currentColor");
        expect(icon.getAttribute("fill")).toBe("none");
        expect(icon.getAttribute("aria-hidden")).toBe("true");
        expect(icon.classList.contains("icon")).toBe(true);
    });

    it.each(iconNames)("draws %s from SVG paths that each start with a move", (name) => {
        const paths = Array.from(createIcon(name).children);
        expect(paths.length > 0).toBe(true);
        expect(paths.every((path) => path.namespaceURI === "http://www.w3.org/2000/svg" && path.localName === "path")).toBe(true);
        expect(paths.every((path) => /^M\d/.test(path.getAttribute("d") || ""))).toBe(true);
    });
});

describe("setIconLabel", () => {
    it("puts the icon before the label, in place of what the element held", () => {
        const button = document.createElement("button");
        button.textContent = "Old label";
        setIconLabel(button, "book", "Resource usage");
        expect((button.firstChild as Element).classList.contains("icon")).toBe(true);
        expect(button.textContent).toBe("Resource usage");
    });

    it("keeps the label as text, so markup in it is shown rather than parsed", () => {
        const button = document.createElement("button");
        setIconLabel(button, "database", "<b>[main] model</b>");
        expect(button.querySelector("b")).toBeNull();
        expect(button.textContent).toBe("<b>[main] model</b>");
    });
});
