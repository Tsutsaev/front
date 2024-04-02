import React from 'react';

export type DatePickerProps = {
  selectedDate: Date | null;
  setSelectedDate: (date: Date | null) => void;
  isArbitrary?: boolean;
  isError?: boolean;
  autoFocus?: boolean;
  style?: React.CSSProperties;
};
