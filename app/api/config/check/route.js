import { NextResponse } from 'next/server';

/**
 * Check if environment variables are configured
 * GET /api/config/check
 */
export async function GET() {
  try {
    const type = process.env.NEXT_PUBLIC_LLM_TYPE || process.env.LLM_TYPE;
    const baseUrl = process.env.NEXT_PUBLIC_LLM_BASE_URL || process.env.LLM_BASE_URL;
    const apiKey = process.env.NEXT_PUBLIC_LLM_API_KEY || process.env.LLM_API_KEY;
    const model = process.env.NEXT_PUBLIC_LLM_MODEL || process.env.LLM_MODEL;

    const hasEnvConfig = !!(type && baseUrl && apiKey && model);

    if (hasEnvConfig) {
      console.log('[Server] Environment variables are configured');
      return NextResponse.json({
        hasEnvConfig: true,
        config: {
          name: '环境变量配置',
          type,
          baseUrl: baseUrl.substring(0, 30) + '...',  // Only show partial URL for security
          model
        }
      });
    } else {
      console.log('[Server] No environment variables configured');
      return NextResponse.json({
        hasEnvConfig: false,
        config: null
      });
    }
  } catch (error) {
    console.error('Error checking environment config:', error);
    return NextResponse.json(
      { error: 'Failed to check environment configuration' },
      { status: 500 }
    );
  }
}
