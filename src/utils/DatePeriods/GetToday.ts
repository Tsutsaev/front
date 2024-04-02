export const getToday = (): [Date | null, Date | null] => {
  const today = new Date();
  return [today, today];
};
