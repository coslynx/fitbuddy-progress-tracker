import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

// Get the base URL from environment variables
const BASE_URL: string = import.meta.env.VITE_API_BASE_URL;

// Create an axios instance with default configuration
const api: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Makes a GET request to the specified URL.
 *
 * @param {string} url - The endpoint URL.
 * @param {AxiosRequestConfig} [config] - Optional configuration for the request.
 * @returns {Promise<AxiosResponse<T>>} A promise that resolves to the response data.
 * @throws {Error} If the url is not a string, or if the request fails.
 */
const get = async <T>(
  url: string,
  config?: AxiosRequestConfig,
): Promise<AxiosResponse<T>> => {
  // Validate the url parameter
  if (typeof url !== 'string') {
    const error = new Error('URL must be a string');
    console.error('API GET request failed:', error.message);
    throw error;
  }
  try {
    // Make the GET request using axios instance.
    const response: AxiosResponse<T> = await api.get<T>(url, config);
    // Return the response data
    return response;
  } catch (error: any) {
    // Log the error message and re-throw for the parent to handle
    console.error('API GET request failed:', error.message);
    throw error;
  }
};


/**
 * Makes a POST request to the specified URL.
 *
 * @param {string} url - The endpoint URL.
 * @param {any} data - The request body data.
 * @param {AxiosRequestConfig} [config] - Optional configuration for the request.
 * @returns {Promise<AxiosResponse<T>>} A promise that resolves to the response data.
  * @throws {Error} If the url is not a string, or if the request fails.
 */
const post = async <T>(
  url: string,
  data: any,
  config?: AxiosRequestConfig,
): Promise<AxiosResponse<T>> => {
  // Validate the url parameter
  if (typeof url !== 'string') {
     const error = new Error('URL must be a string');
     console.error('API POST request failed:', error.message);
     throw error;
  }
  try {
    // Make the POST request using axios instance.
    const response: AxiosResponse<T> = await api.post<T>(url, data, config);
    // Return the response data
    return response;
  } catch (error: any) {
    // Log the error message and re-throw for the parent to handle
    console.error('API POST request failed:', error.message);
    throw error;
  }
};

// Export the api object and its functions
export const apiService = {
  get,
  post,
};