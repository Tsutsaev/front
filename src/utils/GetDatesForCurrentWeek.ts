import {addDays} from 'date-fns';

export const getDatesForCurrentWeek = (weekOffset: number) => {
  const today = new Date();
  let dayOfWeek = today.getDay();
  if (dayOfWeek === 0) dayOfWeek = 7;
  const startDate = addDays(today, -dayOfWeek + 1 + weekOffset * 7);
  const dates = [];

  for (let i = 0; i < 7; i++) {
    const currentDate = addDays(startDate, i);
    dates.push(currentDate);
  }

  return dates;
};
