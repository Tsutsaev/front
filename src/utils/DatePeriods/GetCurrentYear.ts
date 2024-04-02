export const getCurrentYear = (): [Date | null, Date | null] => {
  const today = new Date();
  const start = new Date(today.getFullYear(), 0, 1);
  const end = new Date(today.getFullYear(), 11, 31);
  return [start, end];
};
