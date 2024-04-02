import {endOfMonth, startOfMonth, subMonths} from 'date-fns';
import {formatDate} from './DateFormat';

export const setCurrentAndPrevMonth = (): [Date | null, Date | null] => {
  const today = new Date();
  const start = startOfMonth(subMonths(today, 1));
  const end = endOfMonth(today);

  return [start, end];
};

export const setCurrentAndPrevMonthString = (): string => {
  const today = new Date();
  const start = startOfMonth(subMonths(today, 1));
  const end = endOfMonth(today);

  return `${formatDate(start)} - ${formatDate(end)}`;
};
