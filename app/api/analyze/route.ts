import { NextResponse } from 'next/server';
import { analyzeVideo } from '@/app/utils/openai';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { url } = body;

    if (!url) {
      return NextResponse.json(
        { success: false, error: 'YouTube URL is required' },
        { status: 400 }
      );
    }

    // Validate URL format
    try {
      new URL(url);
    } catch {
      return NextResponse.json(
        { success: false, error: 'Invalid URL format' },
        { status: 400 }
      );
    }

    // Check if it's a YouTube URL
    if (!url.includes('youtube.com') && !url.includes('youtu.be')) {
      return NextResponse.json(
        { success: false, error: 'Please provide a valid YouTube URL' },
        { status: 400 }
      );
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      console.error('OpenAI API key is not configured');
      return NextResponse.json(
        { success: false, error: 'OpenAI API key is not configured' },
        { status: 500 }
      );
    }

    const youtubeApiKey = process.env.YOUTUBE_API_KEY;
    if (!youtubeApiKey) {
      console.error('YouTube API key is not configured');
      return NextResponse.json(
        { success: false, error: 'YouTube API key is not configured' },
        { status: 500 }
      );
    }

    console.log('Processing URL:', url);
    
    const result = await analyzeVideo(apiKey, url);
    
    if (!result.success) {
      console.error('Analysis failed:', result.error);
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data: result.data });
  } catch (error) {
    console.error('Error in analyze route:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to analyze video',
        details: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}
