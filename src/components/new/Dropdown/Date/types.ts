import React from 'react';

export type DateTimePickerProps = {
  selectedDate: [Date | null, Date | null];
  setSelectedDate: (date: [Date | null, Date | null]) => void;
  style?: React.CSSProperties;
  type?: DropdownDateType;
};

export type DropdownDateType = 'withYear' | 'monitoring' | 'common' | 'report' | 'summary';
