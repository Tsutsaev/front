import axios, {AxiosError, AxiosInstance, AxiosRequestConfig} from 'axios';
import {statusAlert} from 'utils/StatusAlert';
import 'react-toastify/dist/ReactToastify.css';

interface CustomResponseData {
  [key: string]: string[];
}

const createAxiosInstance = (config: AxiosRequestConfig): AxiosInstance => {
  const instance = axios.create(config);

  instance.interceptors.response.use(
    response => {
      return response;
    },
    (error: AxiosError<CustomResponseData>) => {
      statusAlert({title: 'Opps, мы уже чиним!'});
      if (error.response) {
        if (error.response.status >= 400 && error.response.status < 500) {
          const responseData = error.response.data;
          const errorKeys = Object.keys(responseData);
          const firstErrorKey = errorKeys.find(key => key in responseData);
          if (firstErrorKey) {
            const errorMessage = responseData[firstErrorKey as keyof CustomResponseData];
            if (errorMessage && errorMessage[0]) {
              console.error('Error Message:', errorMessage[0]);
              return Promise.reject(new Error(errorMessage[0]));
            }
          }
        } else {
          console.error('Server Error:', error.response.status);
        }
      } else if (error.request) {
        console.error('Request Error:', error.request);
      } else {
        console.error('Error:', error.message);
      }

      return Promise.reject(error);
    },
  );

  return instance;
};
export const baseURL =
  process.env.REACT_APP_DEBUG === 'production'
    ? 'https://lk.billed.pro/api/v2/'
    : 'https://dev.billed.pro/api/v2/';

const axiosOptions = {
  baseURL: baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
};
const axiosOptionsDocument = {
  baseURL: baseURL,
  headers: {
    'Content-Type': 'multipart/form-data',
  },
};

export const instance = createAxiosInstance(axiosOptions);

export const axiosDocument = createAxiosInstance(axiosOptionsDocument);

export type IApiResponse<T> = {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
};
