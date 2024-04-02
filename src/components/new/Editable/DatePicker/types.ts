export type EditableDatePickerProps = {
  selectedDate: Date | null;
  setSelectedDate: (date: Date | null) => void;
  setEditingRow: (editingRow: boolean) => void;
  editingRow: boolean;
  isError?: boolean;

  style?: React.CSSProperties;
};
