import React from 'react';

export interface INavBarButton {
  image?: React.ReactNode;
  title: string;
  buttons: IDropdownButtonProps[];
  style?: React.CSSProperties;
  variant: 'sidebar' | 'navbar';
}

export type IDropdownButtonProps = {
  title: string;
  onClick: () => void;
};
