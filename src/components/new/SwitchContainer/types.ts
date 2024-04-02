import React, {PropsWithChildren} from 'react';

export interface ISwitchContainerProps extends PropsWithChildren {
  value?: string | React.ReactNode;
  isError?: boolean;
  onSave?: () => void;
  onUndo?: () => void;
}
