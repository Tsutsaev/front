import {format} from 'date-fns';

export function formatDrpTime(date: [Date | null, Date | null], isBody?: boolean) {
  if (!date[0] || !date[1]) return '';
  const prefix = isBody ? '' : '&drp=';
  return prefix + format(date[0], 'dd.MM.yy') + ' - ' + format(date[1], 'dd.MM.yy');
}
