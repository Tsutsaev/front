export type DateTimePickerProps = {
  selectedDate: [Date | null, Date | null];
  setSelectedDate: (date: [Date | null, Date | null]) => void;
};
