/**
 * Represents an Overvann (stormwater) data class.
 *
 * @class Overvann
 * @param {Object} props - Properties to initialize the Overvann instance.
 * @param {boolean} [props.ledesOvervannTilAvloepssystem] - Indicates if stormwater is led to the drainage system.
 * @param {boolean} [props.ledesOvervannTilTerreng] - Indicates if stormwater is led to the terrain.
 */
export default class Overvann {
    constructor(props) {
        this.ledesOvervannTilAvloepssystem = props?.ledesOvervannTilAvloepssystem;
        this.ledesOvervannTilTerreng = props?.ledesOvervannTilTerreng;
    }
}
