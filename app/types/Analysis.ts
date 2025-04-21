import type { VideoInfo } from "../utils/youtube";

export interface Analysis {
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
