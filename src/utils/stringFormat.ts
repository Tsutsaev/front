export const reduceName = (name: string, count: number = 25) => {
  if (name && name.length > count) {
    return name.slice(0, count) + '...';
  }
  return name;
};

export const reduceValue = (value: number | null | undefined, count: number = 50) => {
  if (value || value === 0) {
    const formattedValue = value.toLocaleString('ru');
    return formattedValue.length > count ? formattedValue.slice(0, count) + '...' : formattedValue;
  }
};
