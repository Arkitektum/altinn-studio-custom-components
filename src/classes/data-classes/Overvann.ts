/** What the form data holds for a Overvann, before it is read into the class. */
export interface OvervannProps {
    ledesOvervannTilAvloepssystem?: boolean;
    ledesOvervannTilTerreng?: boolean;
}

/**
 * Represents an Overvann (stormwater) data class.
 *
 * @class Overvann
 * @param {Object} props - Properties to initialize the Overvann instance.
 * @param {boolean} [props.ledesOvervannTilAvloepssystem] - Indicates if stormwater is led to the drainage system.
 * @param {boolean} [props.ledesOvervannTilTerreng] - Indicates if stormwater is led to the terrain.
 */
export default class Overvann {
    declare ledesOvervannTilAvloepssystem?: boolean;
    declare ledesOvervannTilTerreng?: boolean;

    constructor(props?: OvervannProps) {
        this.ledesOvervannTilAvloepssystem = props?.ledesOvervannTilAvloepssystem;
        this.ledesOvervannTilTerreng = props?.ledesOvervannTilTerreng;
    }
}
