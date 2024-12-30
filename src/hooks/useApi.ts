import { useState, useCallback } from 'react';
import { AxiosResponse, AxiosError, AxiosRequestConfig } from 'axios';
import { apiService } from '../services/api';

/**
 * Custom React hook for making API requests.
 *
 * @returns {{
 *   loading: boolean,
 *   error: any,
 *   get: <T>(url: string, config?: AxiosRequestConfig) => Promise<T | undefined>,
 *   post: <T>(url: string, data: any, config?: AxiosRequestConfig) => Promise<T | undefined>
 * }} An object containing the loading state, error state, and functions for making GET and POST requests.
 */
const useApi = () => {
  // State for tracking loading status
  const [loading, setLoading] = useState(false);
  // State for storing errors
  const [error, setError] = useState<any>(null);

  /**
   * Makes a GET request to the specified URL.
   *
   * @param {string} url - The endpoint URL.
   * @param {AxiosRequestConfig} [config] - Optional configuration for the request.
   * @returns {Promise<T | undefined>} A promise that resolves to the response data or undefined if there is an error.
   */
  const get = useCallback(
    async <T>(url: string, config?: AxiosRequestConfig): Promise<T | undefined> => {
      // Validate the URL
      if (!url || typeof url !== 'string') {
        const error = new Error('URL must be a non-empty string');
        console.error('API GET request failed:', error.message);
        setError(error);
        throw error;
      }
      setLoading(true);
      setError(null);
      try {
        // Make the GET request using apiService from services/api.ts
        const response: AxiosResponse<T> = await apiService.get<T>(url, config);
        // Return the response data
        return response.data;
      } catch (error: any) {
        // Log and set the error
        console.error('API GET request failed:', error);
        setError(error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  /**
   * Makes a POST request to the specified URL.
   *
   * @param {string} url - The endpoint URL.
   * @param {any} data - The request body data.
   * @param {AxiosRequestConfig} [config] - Optional configuration for the request.
   * @returns {Promise<T | undefined>} A promise that resolves to the response data or undefined if there is an error.
   */
  const post = useCallback(
    async <T>(
      url: string,
      data: any,
      config?: AxiosRequestConfig,
    ): Promise<T | undefined> => {
      // Validate the URL
      if (!url || typeof url !== 'string') {
        const error = new Error('URL must be a non-empty string');
        console.error('API POST request failed:', error.message);
         setError(error);
         throw error;
      }
      setLoading(true);
      setError(null);
      try {
        // Make the POST request using apiService from services/api.ts
        const response: AxiosResponse<T> = await apiService.post<T>(
          url,
          data,
          config,
        );
        // Return the response data
        return response.data;
      } catch (error: any) {
        // Log and set the error
        console.error('API POST request failed:', error);
        setError(error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  // Return the hook's API
  return {
    loading,
    error,
    get,
    post,
  };
};

export default useApi;