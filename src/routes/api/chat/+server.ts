import { createAnthropic } from '@ai-sdk/anthropic';
import { streamText, convertToCoreMessages } from 'ai';
import type { RequestHandler } from './$types';

import { ANTHROPIC_API_KEY } from '$env/static/private';

const anthropic = createAnthropic({
    apiKey: ANTHROPIC_API_KEY,
});

export const POST = (async ({ request }) => {
  const { messages } = await request.json();

  const result = await streamText({
    model: anthropic('claude-3-haiku-20240307'),
    messages: convertToCoreMessages(messages),
  });

  return result.toDataStreamResponse();
}) satisfies RequestHandler;