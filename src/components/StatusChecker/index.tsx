import React from 'react';

import Loader from 'shared/uIkit/Loader';

import {IStatusWrapperProps} from './types';

const StatusChecker = ({
  statusArray,
  loadingsArray,
  errorsArray,
  children,
}: IStatusWrapperProps) => {
  if (
    loadingsArray?.some(loading => loading) ||
    statusArray?.some(status => status === 'loading')
  ) {
    return <Loader />;
  }

  if (errorsArray?.some(error => error) || statusArray?.some(status => status === 'failed')) {
    return <div>Произошла ошибка</div>;
  }

  return <>{children}</>;
};

export default StatusChecker;
