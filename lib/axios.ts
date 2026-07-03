import axios, { type AxiosRequestConfig } from 'axios';
import { handleMockRequest } from './mockTransport';
import { TENANT_ID, BASE_URL, HEADERS } from '../config';
import { useAuthStore } from '../src/store/authStore';
import { useErrorStore } from '../src/store/errorStore';

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
    const isFormData = typeof FormData !== 'undefined' && config.data instanceof FormData;

    const removeContentType = (headerBag: Record<string, unknown> | undefined) => {
      if (!headerBag) return;

      const anyHeaders = headerBag as any;
      if (typeof anyHeaders.delete === 'function') {
        anyHeaders.delete('Content-Type');
        anyHeaders.delete('content-type');
        return;
      }

      delete anyHeaders['Content-Type'];
      delete anyHeaders['content-type'];
    };

    if (token) {
      (headers as any).Authorization = `Bearer ${token}`;
    }

    if (isFormData) {
      removeContentType(headers as Record<string, unknown>); 
    }

    (headers as any)['x-tenant-id'] = TENANT_ID;
    config.headers = headers as any;
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
  (error) => {
    if (axios.isAxiosError(error)) {
      const responseData = error.response?.data as any;
      const status = error.response?.status;
      const errorStatusCode = responseData?.error?.statusCode ?? responseData?.statusCode;

      const isAuthError = status === 401 || status === 403 || status === 430 || errorStatusCode === 401 || errorStatusCode === 403 || errorStatusCode === 430;
      const errorMessage = extractErrorMessage(error);

      if (isAuthError) {
        
        try {
          if (typeof localStorage !== 'undefined') {
            localStorage.removeItem('token');

          }
          useAuthStore.getState().logout();
          if (typeof sessionStorage !== 'undefined') {
            sessionStorage.setItem('auth_error', errorMessage);
          }
          if (typeof window !== 'undefined') {
            const currentPath = window.location.pathname + window.location.search;
            const authPaths = ['/login', '/phone-login', '/otp', '/register', '/verify-identity', '/welcome', '/vendor-landing', '/rider-landing'];
            const isOnAuthPath = authPaths.some(p => window.location.pathname.startsWith(p));
            
            // ill d custom event for App.tsx to handle navigation
            window.dispatchEvent(new CustomEvent('auth-error', {
              detail: {
                message: errorMessage,
                redirectPath: !isOnAuthPath && window.location.pathname !== '/' 
                  ? `/login?redirect=${encodeURIComponent(currentPath)}`
                  : null
              }
            }));
          }
        } catch (logoutError) {
          console.error('Failed to log out user on auth error:', logoutError);
        }
      }



      try {
        if (!isAuthError) {
          useErrorStore.getState().showError(errorMessage, 'Request Failed');  
        }
      } catch (modalError) {
        console.error('Failed to show error modal:', modalError);
      }
    }
    return Promise.reject(new Error(extractErrorMessage(error)));
  }
);












const useMockApi = true;

export type RequestOptions = Pick<AxiosRequestConfig, 'headers' | 'params' | 'data'> & {
  method: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';
  url: string;
};

export const request = async <T>(options: RequestOptions): Promise<T> => {
  if (useMockApi) {
    try {
      return await handleMockRequest<T>({
        method: options.method,
        url: options.url,
        data: options.data,
        params: options.params as Record<string, unknown> | undefined,
      });
    } catch (mockError) {
      const errorMessage = mockError instanceof Error ? mockError.message : 'Request failed. Please try again.';
      try {
        useErrorStore.getState().showError(errorMessage, 'Request Failed');
      } catch (modalError) {
        console.error('Failed to show error modal:', modalError);
      }
      throw mockError;
    }
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
