import Arbeidsplasser from "./Arbeidsplasser";

describe("Arbeidsplasser", () => {
    it("should initialize all properties from props", () => {
        const props = {
            antallAnsatte: 10,
            antallVirksomheter: 2,
            beskrivelse: "Kontorbygg",
            eksisterende: true,
            faste: false,
            framtidige: true,
            midlertidige: false,
            utleieBygg: true,
            veiledning: false
        };
        const arbeidsplasser = new Arbeidsplasser(props);

        expect(arbeidsplasser.antallAnsatte).toBe(10);
        expect(arbeidsplasser.antallVirksomheter).toBe(2);
        expect(arbeidsplasser.beskrivelse).toBe("Kontorbygg");
        expect(arbeidsplasser.eksisterende).toBe(true);
        expect(arbeidsplasser.faste).toBe(false);
        expect(arbeidsplasser.framtidige).toBe(true);
        expect(arbeidsplasser.midlertidige).toBe(false);
        expect(arbeidsplasser.utleieBygg).toBe(true);
        expect(arbeidsplasser.veiledning).toBe(false);
    });

    it("should set properties to undefined if not provided", () => {
        const arbeidsplasser = new Arbeidsplasser({});
        expect(arbeidsplasser.antallAnsatte).toBeUndefined();
        expect(arbeidsplasser.antallVirksomheter).toBeUndefined();
        expect(arbeidsplasser.beskrivelse).toBeUndefined();
        expect(arbeidsplasser.eksisterende).toBeUndefined();
        expect(arbeidsplasser.faste).toBeUndefined();
        expect(arbeidsplasser.framtidige).toBeUndefined();
        expect(arbeidsplasser.midlertidige).toBeUndefined();
        expect(arbeidsplasser.utleieBygg).toBeUndefined();
        expect(arbeidsplasser.veiledning).toBeUndefined();
    });

    it("should handle undefined props argument", () => {
        const arbeidsplasser = new Arbeidsplasser();
        expect(arbeidsplasser.antallAnsatte).toBeUndefined();
        expect(arbeidsplasser.antallVirksomheter).toBeUndefined();
        expect(arbeidsplasser.beskrivelse).toBeUndefined();
        expect(arbeidsplasser.eksisterende).toBeUndefined();
        expect(arbeidsplasser.faste).toBeUndefined();
        expect(arbeidsplasser.framtidige).toBeUndefined();
        expect(arbeidsplasser.midlertidige).toBeUndefined();
        expect(arbeidsplasser.utleieBygg).toBeUndefined();
        expect(arbeidsplasser.veiledning).toBeUndefined();
    });
});
