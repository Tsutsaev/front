import {endOfWeek, startOfWeek, subDays} from 'date-fns';

export const getPreviousWeek = (): [Date | null, Date | null] => {
  const today = new Date();
  const start = startOfWeek(subDays(today, 7), {weekStartsOn: 1});
  const end = endOfWeek(subDays(today, 7), {weekStartsOn: 1});
  return [start, end];
};
