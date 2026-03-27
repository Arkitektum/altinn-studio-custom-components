import { handleDataModelDataOnChange, handleDataModelTypeOnChange } from './handlers';

describe('handleDataModelTypeOnChange', () => {
  beforeEach(() => {
    localStorage.clear();
    document.body.innerHTML = '<input id="data-model-type-input-0">';
    localStorage.setItem('dataModels', JSON.stringify([{ dataType: 'old' }]));
  });
  it('updates data model type in localStorage', () => {
    const input = document.getElementById('data-model-type-input-0');
    input.value = 'newType';
    handleDataModelTypeOnChange(0);
    const models = JSON.parse(localStorage.getItem('dataModels'));
    expect(models[0].dataType).toBe('newType');
  });
});

describe('handleDataModelDataOnChange', () => {
  beforeEach(() => {
    localStorage.clear();
    document.body.innerHTML = '<textarea id="code-input"></textarea>';
    localStorage.setItem('dataModels', JSON.stringify([{ data: 'old' }]));
  });
  it('updates data model data in localStorage', () => {
    const textarea = document.getElementById('code-input');
    textarea.value = '{"foo":1}';
    handleDataModelDataOnChange(0);
    const models = JSON.parse(localStorage.getItem('dataModels'));
    expect(models[0].data).toEqual({ foo: 1 });
  });
});
