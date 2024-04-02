import React, {PropsWithChildren} from 'react';

export interface TableInfoRowProps extends PropsWithChildren {
  title: string;
  isError?: boolean;
  value?: string | React.ReactNode;
  onSave?: () => void;
  onUndo?: () => void;
}
