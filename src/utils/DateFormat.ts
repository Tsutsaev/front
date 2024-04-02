import {format} from 'date-fns';

export const formatDateString = (date: string | null) => {
  if (!date) {
    return '';
  }
  return format(new Date(date), 'dd.MM.yy');
};

export const formatDate = (date: Date | null) => {
  if (!date) {
    return '';
  }
  return format(date, 'dd.MM.yy');
};

export const formatDatePatch = (date: Date | null) => {
  if (!date) {
    return '';
  }
  return format(date, 'yyyy-MM-dd');
};

export const formatDatePatchPoint = (date: Date | null) => {
  if (!date) {
    return '';
  }
  return format(date, 'dd.MM.yy');
};
