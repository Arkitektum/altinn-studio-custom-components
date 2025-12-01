import Arealdisponering from "./Arealdisponering";

describe("Arealdisponering", () => {
    it("should assign all properties from props", () => {
        const props = {
            tomtearealByggeomraade: 100,
            tomtearealSomTrekkesFra: 10,
            tomtearealSomLeggesTil: 15,
            tomtearealBeregnet: 90,
            beregnetMaksByggeareal: 80,
            arealBebyggelseEksisterende: 50,
            arealBebyggelseSomSkalRives: 5,
            arealBebyggelseNytt: 45,
            parkeringsarealTerreng: 20,
            arealSumByggesak: 115,
            beregnetGradAvUtnytting: 0.75
        };
        const instance = new Arealdisponering(props);

        expect(instance.tomtearealByggeomraade).toBe(100);
        expect(instance.tomtearealSomTrekkesFra).toBe(10);
        expect(instance.tomtearealSomLeggesTil).toBe(15);
        expect(instance.tomtearealBeregnet).toBe(90);
        expect(instance.beregnetMaksByggeareal).toBe(80);
        expect(instance.arealBebyggelseEksisterende).toBe(50);
        expect(instance.arealBebyggelseSomSkalRives).toBe(5);
        expect(instance.arealBebyggelseNytt).toBe(45);
        expect(instance.parkeringsarealTerreng).toBe(20);
        expect(instance.arealSumByggesak).toBe(115);
        expect(instance.beregnetGradAvUtnytting).toBe(0.75);
    });

    it("should set properties to undefined if not provided", () => {
        const instance = new Arealdisponering({});
        expect(instance.tomtearealByggeomraade).toBeUndefined();
        expect(instance.tomtearealSomTrekkesFra).toBeUndefined();
        expect(instance.tomtearealSomLeggesTil).toBeUndefined();
        expect(instance.tomtearealBeregnet).toBeUndefined();
        expect(instance.beregnetMaksByggeareal).toBeUndefined();
        expect(instance.arealBebyggelseEksisterende).toBeUndefined();
        expect(instance.arealBebyggelseSomSkalRives).toBeUndefined();
        expect(instance.arealBebyggelseNytt).toBeUndefined();
        expect(instance.parkeringsarealTerreng).toBeUndefined();
        expect(instance.arealSumByggesak).toBeUndefined();
        expect(instance.beregnetGradAvUtnytting).toBeUndefined();
    });

    it("should handle undefined props argument", () => {
        const instance = new Arealdisponering();
        expect(instance.tomtearealByggeomraade).toBeUndefined();
        expect(instance.tomtearealSomTrekkesFra).toBeUndefined();
        expect(instance.tomtearealSomLeggesTil).toBeUndefined();
        expect(instance.tomtearealBeregnet).toBeUndefined();
        expect(instance.beregnetMaksByggeareal).toBeUndefined();
        expect(instance.arealBebyggelseEksisterende).toBeUndefined();
        expect(instance.arealBebyggelseSomSkalRives).toBeUndefined();
        expect(instance.arealBebyggelseNytt).toBeUndefined();
        expect(instance.parkeringsarealTerreng).toBeUndefined();
        expect(instance.arealSumByggesak).toBeUndefined();
        expect(instance.beregnetGradAvUtnytting).toBeUndefined();
    });
});
