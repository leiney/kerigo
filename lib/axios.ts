import axios, { type AxiosRequestConfig } from 'axios';
import { handleMockRequest } from './mockTransport';
import { TENANT_ID, BASE_URL, HEADERS } from '../config';

const nodeEnv = import.meta.env.MODE ?? process.env.NODE_ENV ?? 'development';


export const axiosInstance = axios.create({
  baseURL:  BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.defaults.headers.common = {
  ...(axiosInstance.defaults.headers.common ?? {}),
  ...(HEADERS ?? {}),
  'Content-Type': axiosInstance.defaults.headers.common?.['Content-Type'] ?? 'application/json',
};

axiosInstance.interceptors.request.use((config) => {
  try {
    const token = typeof localStorage !== 'undefined' ? localStorage.getItem('token') : null;
    const headers = config.headers ?? {};
    if (token) {
      (headers as any).Authorization = `Bearer ${token}`;
    }

    // ensure tenant header exists
    (headers as any)['x-tenant-id'] = TENANT_ID;
    config.headers = headers;
  } catch (err) {
    // ignore storage errors
  }

  return config;
});

const extractErrorMessage = (error: unknown) => {
  if (!axios.isAxiosError(error)) {
    return error instanceof Error ? error.message : 'Request failed. Please try again.';
  }

  const responseData = error.response?.data as { error?: { message?: string }; message?: string } | undefined;
  return responseData?.error?.message ?? responseData?.message ?? error.message ?? 'Request failed. Please try again.';
};

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(new Error(extractErrorMessage(error)))
);












const useMockApi = true;

export type RequestOptions = Pick<AxiosRequestConfig, 'headers' | 'params' | 'data'> & {
  method: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';
  url: string;
};

export const request = async <T>(options: RequestOptions): Promise<T> => {
  if (useMockApi) {
    return handleMockRequest<T>({
      method: options.method,
      url: options.url,
      data: options.data,
      params: options.params as Record<string, unknown> | undefined,
    });
  }

  const response = await axiosInstance.request<T>({
    method: options.method,
    url: options.url,
    data: options.data,
    params: options.params,
    headers: options.headers,
  });

  return response.data;
};
