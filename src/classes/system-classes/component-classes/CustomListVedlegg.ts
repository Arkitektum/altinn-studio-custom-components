import type { ComponentProps } from "../../../types.ts";
// Dependencies

// Classes
import CustomComponent from "../CustomComponent.ts";
import Vedlegg from "../../data-classes/Vedlegg.ts";

// Global functions
import { getComponentDataValue, getComponentResourceValue } from "../../../functions/helpers.ts";

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
/** The fields of an attachment this list shows, which a Vedlegg carries and a caller can name directly. */
export interface VedleggFields {
    filnavn?: string | null;
    vedleggstype?: { kodebeskrivelse?: string | null } | null;
}

export default class CustomListVedlegg extends CustomComponent {
    declare resourceValues: { title?: unknown; data?: unknown };

    constructor(props: ComponentProps) {
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
     * Retrieves the file name from a given attachment object.
     *
     * @param {Object} vedlegg - The attachment object.
     * @param {string} [vedlegg.filnavn] - The file name property of the attachment.
     * @returns {string|undefined} The file name of the attachment, or undefined if not present.
     */
    getAttachmentFileName(vedlegg?: VedleggFields): string | null | undefined {
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
    getAttachmentDescription(vedlegg?: VedleggFields): string | null | undefined {
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
    getAttachmentListItems(attachments: unknown): string[] {
        // The cast records what the filter leaves behind, which the type system does not track.
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
                  .filter((attachmentListItem) => attachmentListItem) as string[]
            : [];
    }

    /**
     * Retrieves the attachment list items from the form data.
     *
     * @param {Object} props - The properties containing form data and component information.
     * @returns {Array} The list of attachment items extracted from the component data.
     */
    getValueFromFormData(props: ComponentProps): unknown {
        const data = getComponentDataValue(props);
        return this.getAttachmentListItems(data);
    }

    /**
     * Retrieves the component usage, which is an array of custom component names that this class utilizes.
     *
     * @returns {Array<string>} An array of custom component names used by this class.
     */
    getComponentUsage(): string[] {
        return ["custom-field", "custom-list"];
    }
}
