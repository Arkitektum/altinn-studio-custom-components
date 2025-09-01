/**
 * Sets the active sidebar element by removing the "active" class from all items
 * in the "file-list" and "data-model-list" elements, then adds the "active" class
 * to the item with the specified ID.
 *
 * @param {string} itemId - The ID of the sidebar item to activate.
 */
export function setActiveSidebarElement(itemId) {
    const fileListElement = document.getElementById("file-list");
    const dataModelListElement = document.getElementById("data-model-list");

    if (fileListElement) {
        const fileListItems = fileListElement.querySelectorAll("li");
        fileListItems.forEach((item) => {
            item.classList.remove("active");
        });
    }

    if (dataModelListElement) {
        const dataModelListItems = dataModelListElement.querySelectorAll("li");
        dataModelListItems.forEach((item) => {
            item.classList.remove("active");
        });
    }

    const activeItem = document.getElementById(itemId);
    if (activeItem) {
        activeItem.classList.add("active");
    }
}

/**
 * Updates the content of the element with ID "data-input" by clearing its current content
 * and appending the provided input element.
 *
 * @param {HTMLElement} inputElement - The input element to append to the "data-input" container.
 */
export function updateDataInputElement(inputElement) {
    const dataInputElement = document.getElementById("data-input");
    dataInputElement.innerHTML = "";
    dataInputElement.appendChild(inputElement);
}
