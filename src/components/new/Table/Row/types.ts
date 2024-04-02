import {PropsWithChildren} from 'react';

export interface ITableRowProps extends PropsWithChildren {
  templateColumns: string;
  dayType?: 'weekend' | 'vacation' | 'working__day';
  color?: 'gray' | 'white' | 'red' | 'blue';
  isNotActive?: boolean;
}
