import type { VedleggProps } from "./Vedlegg.ts";
// Classes
import Vedlegg from "./Vedlegg.ts";

/** What the form data holds for a Vedleggsliste, before it is read into the class. */
export interface VedleggslisteProps {
    vedlegg?: VedleggProps[] | undefined | null;
    /** The form data carries whatever the model held, which is more than this class reads. */
    [key: string]: unknown;
}

/**
 * Class representing a list of attachments (Vedlegg).
 * @class
 */
export default class Vedleggsliste {
    declare vedlegg?: unknown;

    /**
     * Creates an instance of Vedleggsliste.
     * @param {Object} props - The properties object.
     * @param {Array} props.vedlegg - The array of vedlegg items.
     */
    constructor(props?: VedleggslisteProps) {
        this.vedlegg = props?.vedlegg
            ? props.vedlegg.map((vedleggItem) => {
                  return new Vedlegg(vedleggItem);
              })
            : undefined;
    }
}
