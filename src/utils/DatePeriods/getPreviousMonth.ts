import {endOfMonth, startOfMonth, subMonths} from 'date-fns';

export const getPreviousMonth = (): [Date | null, Date | null] => {
  const today = new Date();
  const start = startOfMonth(subMonths(today, 1));
  const end = endOfMonth(subMonths(today, 1));
  return [start, end];
};
