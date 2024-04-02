import React, {createContext, useState, useMemo} from 'react';

export const DateContext = createContext<{
  date: [Date | null, Date | null];
  setDate: React.Dispatch<React.SetStateAction<[Date | null, Date | null]>>;
}>({
  date: [null, null],
  setDate: () => {},
});

type Props = {
  children: React.ReactNode;
};

export const DateProvider = ({children}: Props) => {
  const [date, setDate] = useState<[Date | null, Date | null]>([null, null]);
  const value = useMemo(() => ({date, setDate}), [date]);

  return <DateContext.Provider value={value}>{children}</DateContext.Provider>;
};
