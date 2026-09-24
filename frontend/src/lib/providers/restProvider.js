import { apiClient } from '../apiClient.js';

/**
 * REST API Data Provider wrapping Axios apiClient for Express backend routes.
 */
export const restProvider = {
  /**
   * Perform HTTP GET request.
   * @param {string} url - API endpoint path (e.g. '/runs')
   * @param {object} [params] - Query parameters
   */
  async get(url, params = {}) {
    return apiClient.get(url, { params });
  },

  /**
   * Perform HTTP POST request.
   * @param {string} url - API endpoint path
   * @param {object} [data] - Request payload body
   */
  async post(url, data = {}) {
    return apiClient.post(url, data);
  },

  /**
   * Perform HTTP PUT request.
   * @param {string} url - API endpoint path
   * @param {object} [data] - Request payload body
   */
  async put(url, data = {}) {
    return apiClient.put(url, data);
  },

  /**
   * Perform HTTP PATCH request.
   * @param {string} url - API endpoint path
   * @param {object} [data] - Request payload body
   */
  async patch(url, data = {}) {
    return apiClient.patch(url, data);
  },

  /**
   * Perform HTTP DELETE request.
   * @param {string} url - API endpoint path
   * @param {object} [params] - Query parameters
   */
  async delete(url, params = {}) {
    return apiClient.delete(url, { params });
  },
};
