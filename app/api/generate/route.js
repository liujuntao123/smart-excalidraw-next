import { NextResponse } from 'next/server';
import { callLLM } from '@/lib/llm-client';
import { SYSTEM_PROMPT, USER_PROMPT_TEMPLATE } from '@/lib/prompts';

/**
 * Get environment variable configuration on the server side
 */
function getServerEnvConfig() {
  const type = process.env.NEXT_PUBLIC_LLM_TYPE || process.env.LLM_TYPE;
  const baseUrl = process.env.NEXT_PUBLIC_LLM_BASE_URL || process.env.LLM_BASE_URL;
  const apiKey = process.env.NEXT_PUBLIC_LLM_API_KEY || process.env.LLM_API_KEY;
  const model = process.env.NEXT_PUBLIC_LLM_MODEL || process.env.LLM_MODEL;

  if (type && baseUrl && apiKey && model) {
    console.log('[Server] Using environment variable configuration:', {
      name: '环境变量配置',
      type,
      baseUrl: baseUrl.substring(0, 20) + '...',
      model
    });
    return {
      name: '环境变量配置',
      type,
      baseUrl,
      apiKey,
      model
    };
  }

  return null;
}

/**
 * POST /api/generate
 * Generate Excalidraw code based on user input
 */
export async function POST(request) {
  try {
    const { config: clientConfig, userInput, chartType } = await request.json();

    if (!userInput) {
      return NextResponse.json(
        { error: 'Missing required parameter: userInput' },
        { status: 400 }
      );
    }

    // Priority: environment variables > client config
    const config = getServerEnvConfig() || clientConfig;

    if (!config) {
      return NextResponse.json(
        { error: 'No LLM configuration available. Please configure environment variables or provide client config.' },
        { status: 400 }
      );
    }

    console.log('[Server] Using config:', config.name || 'client config');

    // Build messages array
    let userMessage;

    // Handle different input types
    if (typeof userInput === 'object' && userInput.image) {
      // Image input with text and image data
      const { text, image } = userInput;
      userMessage = {
        role: 'user',
        content: USER_PROMPT_TEMPLATE(text, chartType),
        image: {
          data: image.data,
          mimeType: image.mimeType
        }
      };
    } else {
      // Regular text input
      userMessage = {
        role: 'user',
        content: USER_PROMPT_TEMPLATE(userInput, chartType)
      };
    }

    const fullMessages = [
      { role: 'system', content: SYSTEM_PROMPT },
      userMessage
    ];

    // Create a readable stream for SSE
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          await callLLM(config, fullMessages, (chunk) => {
            // Send each chunk as SSE
            const data = `data: ${JSON.stringify({ content: chunk })}\n\n`;
            controller.enqueue(encoder.encode(data));
          });

          // Send done signal
          controller.enqueue(encoder.encode('data: [DONE]\n\n'));
          controller.close();
        } catch (error) {
          console.error('Error in stream:', error);
          const errorData = `data: ${JSON.stringify({ error: error.message })}\n\n`;
          controller.enqueue(encoder.encode(errorData));
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error) {
    console.error('Error generating code:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate code' },
      { status: 500 }
    );
  }
}

