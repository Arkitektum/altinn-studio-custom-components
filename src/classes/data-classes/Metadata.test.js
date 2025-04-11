import Metadata from "./Metadata";

describe("Metadata", () => {
    it("should create an instance with the provided properties", () => {
        const props = {
            ftbId: "123",
            prosjektnavn: "Test Project",
            prosjektnr: "456"
        };
        const metadata = new Metadata(props);

        expect(metadata.ftbId).toBe("123");
        expect(metadata.prosjektnavn).toBe("Test Project");
        expect(metadata.prosjektnr).toBe("456");
    });

    it("should create an instance with undefined properties if no props are provided", () => {
        const metadata = new Metadata();

        expect(metadata.ftbId).toBeUndefined();
        expect(metadata.prosjektnavn).toBeUndefined();
        expect(metadata.prosjektnr).toBeUndefined();
    });

    it("should handle partial props correctly", () => {
        const props = {
            ftbId: "789"
        };
        const metadata = new Metadata(props);

        expect(metadata.ftbId).toBe("789");
        expect(metadata.prosjektnavn).toBeUndefined();
        expect(metadata.prosjektnr).toBeUndefined();
    });
});
