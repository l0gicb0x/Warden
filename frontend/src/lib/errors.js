export class DataError extends Error {
  /**
   * @param {string} message - User-friendly error message
   * @param {string} code - Internal or vendor error code (e.g. 'PGRST116')
   * @param {number} status - HTTP status code
   * @param {any} details - Original error object or further context
   */
  constructor(message, code = 'UNKNOWN', status = 500, details = null) {
    super(message);
    this.name = 'DataError';
    this.code = code;
    this.status = status;
    this.details = details;
  }
}

// Common Postgres/Supabase and network error mappings
export const errorMessages = {
  'PGRST116': 'The requested record could not be found.',
  'PGRST204': 'Cannot parse the request data. Please check your inputs.',
  '23505': 'This record already exists (duplicate conflict).',
  '23503': 'This operation violates a foreign key constraint.',
  '42501': 'You do not have permission to perform this action.',
  'NETWORK_ERROR': 'A network error occurred. Please check your connection.',
  'TIMEOUT_ERROR': 'The request took too long to complete. Please try again later.',
  'UNKNOWN': 'An unexpected error occurred. Please try again.',
};

/**
 * Normalizes an unknown error (from Supabase or Axios) into a structured DataError
 */
export const normalizeError = (err) => {
  if (err instanceof DataError) return err;

  // Supabase PostgREST errors usually have .code
  if (err?.code && errorMessages[err.code]) {
    return new DataError(errorMessages[err.code], err.code, err.status || 400, err);
  }

  // Axios network or timeout errors
  if (err?.code === 'ECONNABORTED' || err?.message?.includes('timeout')) {
    return new DataError(errorMessages['TIMEOUT_ERROR'], 'TIMEOUT_ERROR', 408, err);
  }
  if (err?.isAxiosError && !err.response) {
    return new DataError(errorMessages['NETWORK_ERROR'], 'NETWORK_ERROR', 0, err);
  }

  // HTTP response errors (Axios)
  if (err?.response?.data?.message) {
    return new DataError(err.response.data.message, 'API_ERROR', err.response.status, err.response.data);
  }

  return new DataError(err?.message || errorMessages['UNKNOWN'], 'UNKNOWN', 500, err);
};
