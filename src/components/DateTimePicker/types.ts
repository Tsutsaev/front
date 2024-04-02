import React from 'react';

export interface IDateTimePicker {
  selectedDate: Date | null;
  setSelectedDate: (date: Date | null) => void;
  isArbitrary?: boolean;
  isError?: boolean;
  style?: React.CSSProperties;
}
