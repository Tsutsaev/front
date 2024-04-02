import {toast} from 'react-toastify';

type StatusAlert = {
  title?: string;
  status?: 'rejected' | 'fulfilled';
};

export const statusAlert = ({title = 'Ошибка', status = 'rejected'}: StatusAlert) => {
  status === 'fulfilled' ? toast.success(title) : toast.error(title);
};
