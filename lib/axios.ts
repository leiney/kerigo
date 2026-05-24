import axios, { type AxiosRequestConfig } from 'axios';
import { handleMockRequest } from './mockTransport';

const nodeEnv = import.meta.env.MODE ?? process.env.NODE_ENV ?? 'development';

const defaultApiBaseUrl = nodeEnv === 'development'
  ? 'http://localhost:8000/api/v1'
  : 'https://api.kodihabitat.com/api/v1';

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || process.env.NEXT_PUBLIC_API_URL || defaultApiBaseUrl,
  timeout: 30000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

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
