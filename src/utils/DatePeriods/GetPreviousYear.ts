export const getPreviousYear = (): [Date | null, Date | null] => {
  const today = new Date();
  const start = new Date(today.getFullYear() - 1, 0, 1);
  const end = new Date(today.getFullYear() - 1, 11, 31);
  return [start, end];
};
