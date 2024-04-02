import {shortDayNamesArbitrary} from 'constants/ShortDayNames';

import {format, parseISO} from 'date-fns';

export const formatDateWithWeek = (date: Date | null) => {
  if (!date) {
    return 'Выбрать дату';
  }
  const weekdayIndex = date.getDay();
  const weekdayShort = shortDayNamesArbitrary[weekdayIndex];

  return `${weekdayShort} ${format(date, 'dd.MM.yy')}`;
};

export const getDayOfWeek = (date: Date | null) => {
  if (!date) {
    return '';
  }
  const weekdayIndex = date.getDay();
  return shortDayNamesArbitrary[weekdayIndex];
};

export const formatStringDateWithWeek = (stringDate: string | null) => {
  if (!stringDate) {
    return '';
  }

  const date = parseISO(stringDate);
  const weekdayIndex = date.getDay();
  const weekdayShort = shortDayNamesArbitrary[weekdayIndex];

  return `${weekdayShort} ${format(date, 'dd.MM.yy')}`;
};
