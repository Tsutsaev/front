import {endOfQuarter, startOfQuarter, subQuarters} from 'date-fns';

export const getPreviousQuarter = (): [Date | null, Date | null] => {
  const today = new Date();
  const start = startOfQuarter(subQuarters(today, 1));
  const end = endOfQuarter(subQuarters(today, 1));
  return [start, end];
};
