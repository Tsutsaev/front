import {endOfWeek, startOfWeek} from 'date-fns';

export const getCurrentWeek = (): [Date | null, Date | null] => {
  const today = new Date();
  const startOfWeekDate = startOfWeek(today, {weekStartsOn: 1});
  const endOfWeekDate = endOfWeek(today, {weekStartsOn: 1});
  return [startOfWeekDate, endOfWeekDate];
};
