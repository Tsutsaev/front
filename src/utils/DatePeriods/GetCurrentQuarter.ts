import {endOfQuarter, startOfQuarter} from 'date-fns';

export const getCurrentQuarter = (): [Date | null, Date | null] => {
  const today = new Date();
  const start = startOfQuarter(today);
  const end = endOfQuarter(today);
  return [start, end];
};
