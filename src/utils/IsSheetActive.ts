import {serverTimezone} from 'constants/TimeZone';
import {format} from 'date-fns';
import {utcToZonedTime} from 'date-fns-tz';
import {ISheets} from 'store/sheet/types';

export function isSheetActive(date: Date, sheet: ISheets) {
  const dayOfMonth = date.getDate();
  const monthOfYear = date.getMonth() + 1;
  const yearShort = format(date, 'yy');

  const sheetDate = utcToZonedTime(sheet.start_at, serverTimezone);
  const sheetDayOfMonth = sheetDate.getDate();
  const sheetMonthOfYear = sheetDate.getMonth();
  const sheetYear = sheetDate.getFullYear();

  return (
    sheetDayOfMonth === dayOfMonth &&
    sheetMonthOfYear === monthOfYear - 1 &&
    sheetYear === 2000 + parseInt(yearShort, 10)
  );
}
