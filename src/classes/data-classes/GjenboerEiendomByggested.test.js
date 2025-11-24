import GjenboerEiendomByggested from './GjenboerEiendomByggested.js';
import GjenboerEiendom from './GjenboerEiendom.js';

jest.mock('./GjenboerEiendom.js');

describe('GjenboerEiendomByggested', () => {
    beforeEach(() => {
        GjenboerEiendom.mockClear();
    });

    it('should initialize eiendom as undefined if props is undefined', () => {
        const instance = new GjenboerEiendomByggested();
        expect(instance.eiendom).toBeUndefined();
    });

    it('should initialize eiendom as undefined if props.eiendom is undefined', () => {
        const instance = new GjenboerEiendomByggested({});
        expect(instance.eiendom).toBeUndefined();
    });

    it('should initialize eiendom as an empty array if props.eiendom is an empty array', () => {
        const instance = new GjenboerEiendomByggested({ eiendom: [] });
        expect(instance.eiendom).toEqual([]);
    });

    it('should map each item in props.eiendom to a GjenboerEiendom instance', () => {
        const eiendomItems = [{ id: 1 }, { id: 2 }];
        const mockInstances = [{ mock: 1 }, { mock: 2 }];
        GjenboerEiendom
            .mockImplementationOnce(() => mockInstances[0])
            .mockImplementationOnce(() => mockInstances[1]);

        const instance = new GjenboerEiendomByggested({ eiendom: eiendomItems });

        expect(GjenboerEiendom).toHaveBeenCalledTimes(2);
        expect(GjenboerEiendom).toHaveBeenNthCalledWith(1, eiendomItems[0]);
        expect(GjenboerEiendom).toHaveBeenNthCalledWith(2, eiendomItems[1]);
        expect(instance.eiendom).toEqual(mockInstances);
    });

    it('should not throw if props.eiendom is not an array', () => {
        expect(() => new GjenboerEiendomByggested({ eiendom: null })).not.toThrow();
        expect(() => new GjenboerEiendomByggested({ eiendom: 123 })).toThrow();
    });
});