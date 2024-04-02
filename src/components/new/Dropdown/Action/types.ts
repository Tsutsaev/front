export type DropdownActionProps = {
  buttons: DropdownButtonProps[];
  setIsOpen: (isOpen: boolean) => void;
  active: string;
  position?: 'down' | 'right';
  avatar?: boolean;
};

export type DropdownButtonProps = {
  title: string;
  onClick: () => void;
};
