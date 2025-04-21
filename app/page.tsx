'use client';

import { useState } from "react";
import Image from "next/image";
import AnalysisResults from "./components/AnalysisResults";

import type { VideoInfo } from "./utils/youtube";

interface Analysis {
  summary: string;
  keyTakeaways: string[];
  educationalContent: string;
  criticalAnalysis: string;
  courseOutline: {
    title: string;
    lessons: {
      title: string;
      description: string;
      duration: string;
      keyPoints: string[];
    }[];
  };
  videoInfo: VideoInfo;
  quizQuestions?: {
    question: string;
    options: string[];
    correctAnswer: number;
  }[];
}

export default function Home() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      console.log('Submitting URL:', url);
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });

      const data = await response.json();
      console.log('API Response:', data);

      if (!response.ok) {
        throw new Error(data.error || 'Failed to analyze video');
      }

      if (!data.success) {
        throw new Error(data.error || 'Analysis failed');
      }

      setAnalysis(data.data);
    } catch (err) {
      console.error('Error in submission:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-2">
            <Image
              src="/images/voizz-logo.png"
              alt="VoizzTube Logo"
              width={40}
              height={40}
            />
            <span className="text-xl font-bold">VoizzTube</span>
            <span className="text-xs bg-gray-100 px-2 py-1 rounded">Beta</span>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <span className="text-blue-500">📚</span>
              <span className="ml-2">Videos Library</span>
            </div>
            <a
              href="https://aiagencyacademy.online/"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200 flex items-center gap-2"
            >
              School of AI
            </a>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-3xl mx-auto text-center mt-16">
          <h1 className="text-4xl font-bold mb-4">
            Transform YouTube Videos Into Actionable Insights
          </h1>
          <p className="text-gray-600 mb-8">
            Analyze any YouTube video to get detailed summaries, key takeaways,
            educational content, and critical analysis in seconds.
          </p>

          {/* URL Input Form */}
          <form onSubmit={handleSubmit} className="mb-16">
            <div className="relative">
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Paste your YouTube URL here"
                className="w-full p-4 pr-32 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <button
                type="submit"
                disabled={loading}
                className="absolute right-2 top-2 px-6 py-2 bg-[#6C5CE7] text-white rounded-lg hover:bg-[#5A4ED1] transition-colors"
              >
                {loading ? "Analyzing..." : "Analyze Video"}
              </button>
            </div>
            {error && (
              <p className="text-red-500 mt-2 text-sm">{error}</p>
            )}
          </form>

          {/* Analysis Results */}
          {analysis && <AnalysisResults analysis={analysis} />}

          {/* Recent Videos Section */}
          <div className="mt-16">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Recent</h2>
              <div className="flex gap-2">
                <button className="p-2 rounded-full bg-gray-100 hover:bg-gray-200">
                  <span>←</span>
                </button>
                <button className="p-2 rounded-full bg-gray-100 hover:bg-gray-200">
                  <span>→</span>
                </button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Video cards will be added here */}
            </div>
          </div>
        </div>
      </div>

      {/* Feedback Button */}
      <button className="fixed right-0 top-1/2 -translate-y-1/2 bg-[#6C5CE7] text-white px-4 py-2 rounded-l-lg transform -rotate-90 translate-x-8 hover:translate-x-7 transition-transform">
        Feedback
      </button>
    </div>
  );
}
