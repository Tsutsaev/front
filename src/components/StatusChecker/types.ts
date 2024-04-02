import {SerializedError} from '@reduxjs/toolkit';
import {FetchBaseQueryError} from '@reduxjs/toolkit/dist/query';
import {PropsWithChildren} from 'react';

export interface IStatusWrapperProps extends PropsWithChildren {
  statusArray?: string[];
  errorsArray?: (FetchBaseQueryError | SerializedError | boolean | undefined)[];
  loadingsArray?: boolean[];
}
