import CustomGrouplistUtfallSvar from './CustomGrouplistUtfallSvar';
import CustomComponent from '../CustomComponent';
const { hasMissingTextResources } = require('../../../functions/validations.js');

// Mock dependencies
jest.mock('../../../functions/helpers.js', () => ({
    getComponentDataValue: jest.fn(),
    getComponentResourceValue: jest.fn(),
    getTextResources: jest.fn(),
    hasValue: jest.fn(),
}));
jest.mock('../../../functions/validations.js', () => ({
    hasMissingTextResources: jest.fn(),
}));

const {
    getComponentDataValue,
    getComponentResourceValue,
    getTextResources,
    hasValue,
} = require('../../../functions/helpers.js');

describe('CustomGrouplistUtfallSvar', () => {
    let props;

    beforeEach(() => {
        props = { some: 'prop' };
        jest.clearAllMocks();
    });

    it('should extend CustomComponent', () => {
        const instance = new CustomGrouplistUtfallSvar(props);
        expect(instance instanceof CustomComponent).toBe(true);
    });

    it('should set isEmpty to true if data is empty', () => {
        getComponentDataValue.mockReturnValue(undefined);
        hasValue.mockReturnValue(false);
        getComponentResourceValue.mockReturnValue('Empty text');
        const instance = new CustomGrouplistUtfallSvar(props);
        expect(instance.isEmpty).toBe(true);
        expect(instance.resourceValues.data).toBe('Empty text');
    });

    it('should set isEmpty to false if data has value', () => {
        getComponentDataValue.mockReturnValue('Some data');
        hasValue.mockReturnValue(true);
        const instance = new CustomGrouplistUtfallSvar(props);
        expect(instance.isEmpty).toBe(false);
        expect(instance.resourceValues.data).toBe('Some data');
    });

    it('hasContent should return result of hasValue', () => {
        hasValue.mockReturnValue(true);
        const instance = new CustomGrouplistUtfallSvar(props);
        expect(instance.hasContent('abc')).toBe(true);
        hasValue.mockReturnValue(false);
        expect(instance.hasContent('')).toBe(false);
    });

    it('getValidationMessages should call hasMissingTextResources with textResources and resourceBindings', () => {
        const resourceBindings = { key: 'value' };
        const textResources = [{ id: '1', value: 'Test' }];
        getTextResources.mockReturnValue(textResources);
        hasMissingTextResources.mockReturnValue(['missing']);
        const instance = new CustomGrouplistUtfallSvar(props);
        const result = instance.getValidationMessages(resourceBindings);
        expect(getTextResources).toHaveBeenCalled();
        expect(hasMissingTextResources).toHaveBeenCalledWith(textResources, resourceBindings);
        expect(result).toEqual(['missing']);
    });

    it('getValueFromFormData should call getComponentDataValue with props', () => {
        getComponentDataValue.mockReturnValue('data');
        const instance = new CustomGrouplistUtfallSvar(props);
        const result = instance.getValueFromFormData(props);
        expect(getComponentDataValue).toHaveBeenCalledWith(props);
        expect(result).toBe('data');
    });
});