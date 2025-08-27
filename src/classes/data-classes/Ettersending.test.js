import Ettersending from "./Ettersending";
import Kode from "./Kode";
import Vedleggsliste from "./Vedleggsliste";

jest.mock("./Kode");
jest.mock("./Vedleggsliste");

describe("Ettersending", () => {
    beforeEach(() => {
        Kode.mockClear();
        Vedleggsliste.mockClear();
    });

    it("should set kommentar, tema, tittel, and vedleggsliste when all props are provided", () => {
        const props = {
            kommentar: "Test kommentar",
            tema: { kode: "TEST" },
            tittel: "Test tittel",
            vedleggsliste: [{ id: 1 }]
        };
        const ettersending = new Ettersending(props);

        expect(ettersending.kommentar).toBe(props.kommentar);
        expect(Kode).toHaveBeenCalledWith(props.tema);
        expect(ettersending.tema).toBeInstanceOf(Kode);
        expect(ettersending.tittel).toBe(props.tittel);
        expect(Vedleggsliste).toHaveBeenCalledWith(props.vedleggsliste);
        expect(ettersending.vedleggsliste).toBeInstanceOf(Vedleggsliste);
    });

    it("should set undefined for tema if not provided", () => {
        const props = { kommentar: "Test", tittel: "Title", vedleggsliste: [] };
        const ettersending = new Ettersending(props);

        expect(ettersending.tema).toBeUndefined();
    });

    it("should set undefined for vedleggsliste if not provided", () => {
        const props = { kommentar: "Test", tittel: "Title", tema: "Tema" };
        const ettersending = new Ettersending(props);

        expect(ettersending.vedleggsliste).toBeUndefined();
    });

    it("should set undefined for kommentar and tittel if not provided", () => {
        const props = { tema: "Tema", vedleggsliste: [] };
        const ettersending = new Ettersending(props);

        expect(ettersending.kommentar).toBeUndefined();
        expect(ettersending.tittel).toBeUndefined();
    });

    it("should handle empty props object", () => {
        const ettersending = new Ettersending({});
        expect(ettersending.kommentar).toBeUndefined();
        expect(ettersending.tema).toBeUndefined();
        expect(ettersending.tittel).toBeUndefined();
        expect(ettersending.vedleggsliste).toBeUndefined();
    });

    it("should handle undefined props", () => {
        const ettersending = new Ettersending();
        expect(ettersending.kommentar).toBeUndefined();
        expect(ettersending.tema).toBeUndefined();
        expect(ettersending.tittel).toBeUndefined();
        expect(ettersending.vedleggsliste).toBeUndefined();
    });
});
