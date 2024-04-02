export type PanelDropdownProps = {
  labels: MyOption[];
  onChange: (value: string | null) => void;
  isError?: boolean;
  placeholder?: string;
  initialState?: string | null;
};

export type MyOption = {label: string; value: string; color: string};
