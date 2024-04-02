export const formatNumberWithComma = (number?: number) => {
  if (!number && number !== 0) return '';
  const strNumber = number.toString();
  return strNumber.replace('.', ',');
};
