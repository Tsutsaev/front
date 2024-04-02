import {labelsFills} from 'constants/LabelsFills';

import {MyOption} from 'components/new/Dropdown/Single/types';

export const getOptionFromString = (field: keyof typeof labelsFills, initialState: string) => {
  const fieldValues = labelsFills[field];
  return fieldValues.find(type => type.value === initialState) || fieldValues[0];
};

export const getOptionFromId = (initialState: number | null, labels: MyOption[]) => {
  return labels.find(label => Number(label.value) === initialState) || null;
};

export const getOptionFromIdWithoutNull = (initialState: number | null, labels: MyOption[]) => {
  return labels.find(label => Number(label.value) === initialState) || labels[0];
};

export const getMultyOptionsFromStrings = (initialState: string[]) => {
  return initialState.map(item => ({value: item, label: item, color: ''}));
};

export const getMultyOptionsFromId = (initialState: (number | null)[], labels: MyOption[]) => {
  return labels.filter(label => {
    return initialState.includes(+label.value);
  });
};
