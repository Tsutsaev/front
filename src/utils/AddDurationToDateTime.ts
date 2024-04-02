import {serverTimezone} from 'constants/TimeZone';
import {formatISO} from 'date-fns';
import {utcToZonedTime} from 'date-fns-tz';

export const addDurationToDateTime = (dateTimeString: string, duration: string) => {
  const [hours, minutes] = duration.split(':').map(Number);

  const originalDate = utcToZonedTime(dateTimeString, serverTimezone);

  originalDate.setHours(originalDate.getHours() + hours);
  originalDate.setMinutes(originalDate.getMinutes() + minutes);

  const adjustedISODate = formatISO(originalDate);
  return `${adjustedISODate.slice(0, -6)}+03:00`;
};
