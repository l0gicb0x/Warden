import Groq from 'groq-sdk';
import { env } from '../config/env.js';
import { ApiError } from '../utils/ApiError.js';

if (!env.GROQ_API_KEY) {
  throw new Error('FATAL: GROQ_API_KEY is missing. Groq service cannot start.');
}

const groq = new Groq({
  apiKey: env.GROQ_API_KEY,
  maxRetries: 1,
  timeout: 15000, // 15 seconds
});

/**
 * Single function to interact with Groq API
 * @param {Object} params
 * @param {string} params.system
 * @param {string} params.user
 * @param {string} [params.model=env.GROQ_MODEL]
 * @param {number} [params.temperature=0.7]
 * @param {boolean} [params.json=false]
 * @returns {Promise<string|Object>} Parsed JSON if json=true, otherwise string text
 */
export const complete = async ({
  system,
  user,
  model = env.GROQ_MODEL,
  temperature = 0.7,
  json = false,
}) => {
  try {
    const messages = [
      { role: 'system', content: system },
      { role: 'user', content: user },
    ];

    const params = {
      messages,
      model,
      temperature,
    };

    if (json) {
      params.response_format = { type: 'json_object' };
    }

    const completion = await groq.chat.completions.create(params);
    const content = completion.choices[0]?.message?.content || '';

    if (json) {
      try {
        return JSON.parse(content);
      } catch (parseErr) {
        throw new ApiError(500, 'Failed to parse JSON response from model', [parseErr.message]);
      }
    }

    return content;
  } catch (err) {
    if (err instanceof ApiError) {
      throw err;
    }
    const statusCode = err.status || err.response?.status || 500;
    throw new ApiError(statusCode, 'Groq API request failed', [err.message]);
  }
};
