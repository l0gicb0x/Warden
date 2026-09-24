import Groq from 'groq-sdk';
import { env } from '../config/env.js';
import { ApiError } from '../utils/ApiError.js';
import { z } from 'zod';

if (!env.GROQ_API_KEY) {
  throw new Error('FATAL: GROQ_API_KEY is missing. Groq service cannot start.');
}

const groq = new Groq({
  apiKey: env.GROQ_API_KEY,
  maxRetries: 2, // bounded retry for network issues
  timeout: 15000, // 15s timeout
});

const NextActionSchema = z.object({
  action: z.enum(['click', 'type', 'navigate', 'done']),
  elementId: z.string().optional(),
  text: z.string().optional(),
  reason: z.string()
}).strict();

/**
 * Task: decide-next-action
 * Input: {goal, simplifiedDOM}
 * Output: strict JSON matching NextActionSchema
 */
export const decideNextAction = async (goal, simplifiedDOM) => {
  const system = `You are an autonomous web agent. Your goal is: "${goal}".
You are provided with a simplified DOM of the current page.
Choose the best next action to achieve the goal.
Respond strictly in JSON matching this schema:
{
  "action": "click" | "type" | "navigate" | "done",
  "elementId": "string (optional, required if action is click or type)",
  "text": "string (optional, required if action is type)",
  "reason": "string (brief explanation)"
}`;

  // Keep DOM output as compact as possible to save tokens
  const user = `Simplified DOM:\n${JSON.stringify(simplifiedDOM)}`;

  try {
    const completion = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: user },
      ],
      model: env.GROQ_MODEL || 'llama3-8b-8192',
      temperature: 0.1, // Low temp for deterministic structured output
      response_format: { type: 'json_object' }
    });

    const content = completion.choices[0]?.message?.content || '{}';
    let parsed;
    try {
      parsed = JSON.parse(content);
    } catch (e) {
      throw new ApiError(500, 'Invalid JSON returned by LLM');
    }

    const validated = NextActionSchema.safeParse(parsed);
    if (!validated.success) {
      // Return a typed failure (HTTP 422 Unprocessable Entity)
      throw new ApiError(422, 'LLM response failed schema validation', validated.error.errors);
    }

    return validated.data;
  } catch (err) {
    if (err instanceof ApiError) throw err;
    // Hide API key or sensitive details from the logged/thrown error
    throw new ApiError(err.status || 500, 'Groq API request failed', [err.message]);
  }
};

/**
 * Task: explain-trap
 * Input: {detected trap event}
 * Output: Exactly one plain-English sentence.
 */
export const explainTrap = async (trapEvent) => {
  const system = `You are a cybersecurity expert. Explain the following detected web trap in EXACTLY ONE plain-English sentence. Do not offer advice, greetings, or formatting.`;
  const user = `Trap Event Data:\n${JSON.stringify(trapEvent)}`;

  try {
    const completion = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: user },
      ],
      model: env.GROQ_MODEL || 'llama3-8b-8192',
      temperature: 0.5,
    });

    return completion.choices[0]?.message?.content?.trim() || 'A deceptive trap was detected.';
  } catch (err) {
    if (err instanceof ApiError) throw err;
    throw new ApiError(err.status || 500, 'Groq API request failed', [err.message]);
  }
};
