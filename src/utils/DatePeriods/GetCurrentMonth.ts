import {endOfMonth, startOfMonth} from 'date-fns';

export const getCurrentMonth = (): [Date | null, Date | null] => {
  const today = new Date();
  const start = startOfMonth(today);
  const end = endOfMonth(today);
  return [start, end];
};
