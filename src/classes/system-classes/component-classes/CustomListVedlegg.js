// Classes
import CustomComponent from "../CustomComponent.js";
import Vedlegg from "../../data-classes/Vedlegg.js";

// Global functions
import { getComponentDataValue, getComponentResourceValue, hasValue } from "../../../functions/helpers.js";

/**
 * CustomListVedlegg is a custom component class for handling and displaying a list of attachments (vedlegg).
 *
 * This class provides utility methods to extract, format, and present attachment information such as file names and descriptions.
 * It initializes with resource values for title and empty field text, and determines if the attachment list is empty.
 *
 * @extends CustomComponent
 *
 * @param {Object} props - The properties passed to the component, including form data and resource values.
 *
 * @property {boolean} isEmpty - Indicates whether the attachment list is empty.
 * @property {Object} resourceValues - Contains resource values for the component, such as title and data/empty field text.
 */
export default class CustomListVedlegg extends CustomComponent {
    constructor(props) {
        super(props);
        const data = this.getValueFromFormData(props);
        const isEmpty = !this.hasContent(data);

        this.isEmpty = isEmpty;
        this.resourceValues = {
            title: getComponentResourceValue(props, "title"),
            data: isEmpty ? getComponentResourceValue(props, "emptyFieldText") : data
        };
    }

    /**
     * Checks if the provided data has content by delegating to the hasValue function.
     *
     * @param {*} data - The data to check for content.
     * @returns {boolean} True if the data has content, false otherwise.
     */
    hasContent(data) {
        return hasValue(data);
    }

    /**
     * Retrieves the file name from a given attachment object.
     *
     * @param {Object} vedlegg - The attachment object.
     * @param {string} [vedlegg.filnavn] - The file name property of the attachment.
     * @returns {string|undefined} The file name of the attachment, or undefined if not present.
     */
    getAttachmentFileName(vedlegg) {
        return vedlegg?.filnavn;
    }

    /**
     * Retrieves the description of the attachment type from a given attachment object.
     *
     * @param {Object} vedlegg - The attachment object.
     * @param {Object} [vedlegg.vedleggstype] - The type information of the attachment.
     * @param {string} [vedlegg.vedleggstype.kodebeskrivelse] - The description of the attachment type.
     * @returns {string|undefined} The description of the attachment type, or undefined if not available.
     */
    getAttachmentDescription(vedlegg) {
        return vedlegg?.vedleggstype?.kodebeskrivelse;
    }

    /**
     * Generates a list of formatted attachment descriptions from an array of attachments.
     *
     * Each attachment is processed to extract its description and file name using helper methods.
     * The resulting list contains strings in the format "description (fileName)", "description", or "fileName",
     * depending on which values are available for each attachment. Attachments with neither a description nor a file name are omitted.
     *
     * @param {Array<Object>} attachments - The array of attachment objects to process.
     * @returns {string[]} An array of formatted attachment description strings.
     */
    getAttachmentListItems(attachments) {
        if (!attachments || !Array.isArray(attachments)) {
            // If attachments is not an array or is falsy, return an empty array
            return [];
        }

        return attachments?.length
            ? attachments
                  .map((attachment) => {
                      const vedlegg = new Vedlegg(attachment);
                      const attachmentDescription = this.getAttachmentDescription(vedlegg);
                      const attachmentFileName = this.getAttachmentFileName(vedlegg);
                      if (attachmentDescription?.length && attachmentFileName?.length) {
                          return `${attachmentDescription} (${attachmentFileName})`;
                      } else if (attachmentDescription?.length) {
                          return attachmentDescription;
                      } else if (attachmentFileName?.length) {
                          return attachmentFileName;
                      }
                      return null;
                  })
                  .filter((attachmentListItem) => attachmentListItem)
            : [];
    }

    /**
     * Retrieves the attachment list items from the form data.
     *
     * @param {Object} props - The properties containing form data and component information.
     * @returns {Array} The list of attachment items extracted from the component data.
     */
    getValueFromFormData(props) {
        const data = getComponentDataValue(props);
        return this.getAttachmentListItems(data);
    }
}
