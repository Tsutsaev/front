import {shortDayNamesArbitrary} from 'constants/ShortDayNames';

export function getDayColor(date: Date) {
  const weekdayIndex = date.getDay();
  const weekdayShort = shortDayNamesArbitrary[weekdayIndex];
  return weekdayShort === 'Вс,' || weekdayShort === 'Сб,' ? 'red' : 'white';
}
