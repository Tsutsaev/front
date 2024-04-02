import {format} from 'date-fns';

export const dateStringFormat = (date?: string | null) => {
  if (!date) return '';
  return format(new Date(date), 'dd.MM.yy');
};
