export interface VideoInfo {
  id: string;
  title: string;
  description: string;
  transcript: string;
  thumbnailUrl: string;
}

export function extractVideoId(url: string): string {
  try {
    const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    const match = url.match(regExp);
    if (!match || match[7].length !== 11) {
      throw new Error('Invalid YouTube URL format');
    }
    return match[7];
  } catch (error) {
    console.error('Error extracting video ID:', error);
    throw new Error('Invalid YouTube URL format');
  }
}

async function getVideoTranscript(videoId: string): Promise<string> {
  try {
    console.log('Fetching transcript for video:', videoId);
    // Get captions for the video
    const captionsResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/captions?videoId=${videoId}&key=${process.env.YOUTUBE_API_KEY}&part=snippet`,
      {
        headers: {
          'Accept': 'application/json',
        },
      }
    );

    if (!captionsResponse.ok) {
      console.error('Captions API error:', {
        status: captionsResponse.status,
        statusText: captionsResponse.statusText
      });
      return "Transcript not available";
    }

    const captionsData = await captionsResponse.json();
    console.log('Captions data:', captionsData);
    
    const defaultCaption = captionsData.items?.[0];
    if (!defaultCaption) {
      return "Transcript not available";
    }

    // For simplicity, we'll return a placeholder text since getting the actual transcript
    // requires OAuth2 authentication
    return `This video discusses ${videoId}. Full transcript will be available in production with proper authentication.`;
  } catch (error) {
    console.error('Error fetching transcript:', error);
    return "Transcript not available";
  }
}

export async function getVideoInfo(url: string): Promise<VideoInfo> {
  try {
    console.log('Getting video info for URL:', url);
    const videoId = extractVideoId(url);
    if (!videoId) {
      throw new Error('Invalid YouTube URL');
    }

    // Get video details using YouTube Data API
    console.log('Fetching video details with ID:', videoId);
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&key=${process.env.YOUTUBE_API_KEY}&part=snippet`,
      {
        headers: {
          'Accept': 'application/json',
        },
      }
    );

    if (!response.ok) {
      console.error('YouTube API error:', {
        status: response.status,
        statusText: response.statusText
      });
      throw new Error(`YouTube API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log('Video API response:', data);

    const videoData = data.items?.[0];
    if (!videoData) {
      throw new Error('Video not found');
    }

    // Get video transcript
    const transcript = await getVideoTranscript(videoId);

    return {
      id: videoId,
      title: videoData.snippet?.title || '',
      description: videoData.snippet?.description || '',
      transcript: transcript,
      thumbnailUrl: videoData.snippet?.thumbnails?.maxres?.url || 
                   videoData.snippet?.thumbnails?.high?.url || 
                   `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
    };
  } catch (error) {
    console.error('Error fetching video info:', error);
    throw error instanceof Error 
      ? error 
      : new Error('Failed to fetch video information');
  }
}
