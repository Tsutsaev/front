import {PropsWithChildren} from 'react';

export interface ITableVisibilityProps extends PropsWithChildren {
  onSave?: () => void;
  showSave?: boolean;
  title?: string;
}
