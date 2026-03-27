import { closeValidationDialog, openValidationDialog, setActiveSidebarElement, updateDataInputElement } from "./UI";

describe("setActiveSidebarElement", () => {
    let item1, item2;
    beforeEach(() => {
        document.body.innerHTML = `
      <ul id="file-list">
        <li id="file1" class="active">File 1</li>
        <li id="file2">File 2</li>
      </ul>
      <ul id="data-model-list">
        <li id="data1">Data 1</li>
        <li id="data2" class="active">Data 2</li>
      </ul>
    `;
        item1 = document.getElementById("file1");
        item2 = document.getElementById("data2");
    });
    it("removes active from all and sets active on given id", () => {
        setActiveSidebarElement("file2");
        expect(item1.classList.contains("active")).toBe(false);
        expect(item2.classList.contains("active")).toBe(false);
        expect(document.getElementById("file2").classList.contains("active")).toBe(true);
    });
});

describe("updateDataInputElement", () => {
    beforeEach(() => {
        document.body.innerHTML = `<div id="data-input"><span>Old</span></div>`;
    });
    it("replaces content with input element", () => {
        const input = document.createElement("input");
        input.value = "new";
        updateDataInputElement(input);
        const dataInput = document.getElementById("data-input");
        expect(dataInput.children.length).toBe(1);
        expect(dataInput.firstChild).toBe(input);
    });
});

describe("openValidationDialog and closeValidationDialog", () => {
    let dialog, content, closeBtn;
    beforeEach(() => {
        document.body.innerHTML = `
      <dialog id="validation-dialog">
        <div class="dialog-content"></div>
        <button class="close-dialog-button">Close</button>
      </dialog>
    `;
        dialog = document.getElementById("validation-dialog");
        // Polyfill showModal/close for jsdom
        dialog.showModal = function () {
            this.open = true;
        };
        dialog.close = function () {
            this.open = false;
            this.dispatchEvent(new Event("close"));
        };
        content = document.createElement("div");
        content.textContent = "Validation content";
        closeBtn = dialog.querySelector(".close-dialog-button");
    });
    it("opens dialog and sets content", () => {
        openValidationDialog(content);
        expect(dialog.open).toBe(true);
        expect(dialog.querySelector(".dialog-content").firstChild).toBe(content);
    });
    it("closes dialog on close button click", () => {
        openValidationDialog(content);
        closeBtn.click();
        expect(dialog.open).toBe(false);
    });
    it("closes dialog on outside click", () => {
        openValidationDialog(content);
        dialog.dispatchEvent(new globalThis.MouseEvent("click", { bubbles: true, cancelable: true }));
        expect(dialog.open).toBe(false);
    });
    it("closeValidationDialog closes the dialog", () => {
        openValidationDialog(content);
        closeValidationDialog();
        expect(dialog.open).toBe(false);
    });
});
