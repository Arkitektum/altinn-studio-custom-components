import type { RolleendringProps } from "./Rolleendring.ts";
// Classes
import Rolleendring from "./Rolleendring.ts";

/** What the form data holds for a Rolleendringer, before it is read into the class. */
export interface RolleendringerProps {
    rolleendring?: RolleendringProps[] | undefined | null;
    /** The form data carries whatever the model held, which is more than this class reads. */
    [key: string]: unknown;
}

/**
 * Class representing the list of Rolleendringer in an endring av rolle i byggesaken.
 * @class
 */
export default class Rolleendringer {
    declare rolleendring?: Rolleendring[] | null;

    /**
     * Constructs an instance of the Rolleendringer class.
     *
     * @param {Object} props - The properties to initialize the class with.
     * @param {Array} [props.rolleendring] - An optional array of rolleendring items to be mapped to `Rolleendring` instances.
     */
    constructor(props?: RolleendringerProps) {
        this.rolleendring =
            props?.rolleendring &&
            props.rolleendring.map((rolleendringItem) => {
                return new Rolleendring(rolleendringItem);
            });
    }
}
