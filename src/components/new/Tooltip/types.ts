import {PropsWithChildren} from 'react';

export interface ITooltipProps extends PropsWithChildren {
  content?: string;
  limit?: number;
}
