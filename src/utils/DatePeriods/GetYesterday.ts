import {subDays} from 'date-fns';

export const getYesterday = (): [Date | null, Date | null] => {
  const yesterday = subDays(new Date(), 1);
  return [yesterday, yesterday];
};
