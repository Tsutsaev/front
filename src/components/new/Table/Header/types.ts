import React from 'react';

export type ITableHeaderProps = {
  titles: ITitle[];
  templateColumns: string;
  isSmall?: boolean;
};

export type ITitle = {
  icon?: React.ReactNode;
  title?: string;
  sort?: () => void;
  align?: 'start' | 'end' | 'center';
};
