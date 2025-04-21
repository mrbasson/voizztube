import VideoPlayer from './VideoPlayer';
import CourseOutline from './CourseOutline';
import Quiz from './Quiz';
import type { VideoInfo } from '../utils/youtube';

interface AnalysisResultsProps {
  analysis: {
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
    quizQuestions: {
      question: string;
      options: string[];
      correctAnswer: number;
    }[];
  };
}

export default function AnalysisResults({ analysis }: AnalysisResultsProps) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mt-8">
      <VideoPlayer videoId={analysis.videoInfo.id} title={analysis.videoInfo.title} />
      
      <div className="space-y-6">
        <section>
          <h2 className="text-xl font-semibold mb-3">Summary</h2>
          <p className="text-gray-700">{analysis.summary}</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">Key Takeaways</h2>
          <ul className="list-disc list-inside space-y-2">
            {analysis.keyTakeaways.map((takeaway, index) => (
              <li key={index} className="text-gray-700">{takeaway}</li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">Educational Content</h2>
          <p className="text-gray-700">{analysis.educationalContent}</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">Critical Analysis</h2>
          <p className="text-gray-700">{analysis.criticalAnalysis}</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">Knowledge Check Quiz</h2>
          <Quiz questions={analysis.quizQuestions} />
        </section>

        <CourseOutline courseOutline={analysis.courseOutline} />
      </div>
    </div>
  );
}
