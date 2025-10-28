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
        for (const item of fileListItems) {
            item.classList.remove("active");
        }
    }

    if (dataModelListElement) {
        const dataModelListItems = dataModelListElement.querySelectorAll("li");
        for (const item of dataModelListItems) {
            item.classList.remove("active");
        }
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

/**
 * Opens a modal validation dialog and displays the provided content element inside it.
 *
 * @param {HTMLElement} contentElement - The DOM element to display inside the dialog's content area.
 *
 * The function locates the dialog element with the ID "validation-dialog", replaces its content
 * with the provided element, and displays the dialog as a modal. It also sets up the close button
 * to close the dialog when clicked. Additionally, it adds an event listener to close the dialog
 * when clicking outside the dialog content area.
 */
export function openValidationDialog(contentElement) {
    const dialogElement = document.getElementById("validation-dialog");
    const dialogContentElement = dialogElement.querySelector(".dialog-content");
    const closeDialogButton = dialogElement.querySelector(".close-dialog-button");

    // Clear previous content
    dialogContentElement.innerHTML = "";
    dialogContentElement.appendChild(contentElement);

    // Show the dialog
    dialogElement.showModal();

    // Set up close button
    closeDialogButton.onclick = function () {
        dialogElement.close();
    };

    // Close the dialog if clicking outside the dialog content
    function handleOutsideClick(event) {
        if (event.target === dialogElement) {
            dialogElement.close();
        }
    }

    dialogElement.addEventListener("click", handleOutsideClick);

    // Remove the event listener when the dialog is closed
    dialogElement.addEventListener("close", function cleanup() {
        dialogElement.removeEventListener("click", handleOutsideClick);
        dialogElement.removeEventListener("close", cleanup);
    });
}

/**
 * Closes the validation dialog by selecting the element with the ID "validation-dialog"
 * and invoking its `close()` method.
 *
 * @function
 */
export function closeValidationDialog() {
    const dialogElement = document.getElementById("validation-dialog");
    dialogElement.close();
}
