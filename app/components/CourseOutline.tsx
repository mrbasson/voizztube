import React from 'react';
import { Download } from 'lucide-react';
import jsPDF from 'jspdf';

interface CourseOutlineProps {
  courseOutline: {
    title: string;
    lessons: {
      title: string;
      description: string;
      duration: string;
      keyPoints: string[];
    }[];
  };
}

export default function CourseOutline({ courseOutline }: CourseOutlineProps) {
  const handleDownload = () => {
    const doc = new jsPDF();
    let yOffset = 20;
    const lineHeight = 10;
    const margin = 20;
    const pageWidth = doc.internal.pageSize.width;
    
    // Title
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text(courseOutline.title, margin, yOffset);
    yOffset += lineHeight * 2;

    // Lessons
    courseOutline.lessons.forEach((lesson, index) => {
      // Check if we need a new page
      if (yOffset > 250) {
        doc.addPage();
        yOffset = 20;
      }

      // Lesson title and duration
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text(`Lesson ${index + 1}: ${lesson.title}`, margin, yOffset);
      yOffset += lineHeight;
      
      doc.setFontSize(12);
      doc.setFont('helvetica', 'italic');
      doc.text(`Duration: ${lesson.duration}`, margin, yOffset);
      yOffset += lineHeight;

      // Description
      doc.setFont('helvetica', 'normal');
      const descriptionLines = doc.splitTextToSize(lesson.description, pageWidth - (margin * 2));
      descriptionLines.forEach((line: string) => {
        if (yOffset > 250) {
          doc.addPage();
          yOffset = 20;
        }
        doc.text(line, margin, yOffset);
        yOffset += lineHeight;
      });
      yOffset += lineHeight / 2;

      // Key Points
      if (yOffset > 250) {
        doc.addPage();
        yOffset = 20;
      }
      doc.setFont('helvetica', 'bold');
      doc.text('Key Points:', margin, yOffset);
      yOffset += lineHeight;

      doc.setFont('helvetica', 'normal');
      lesson.keyPoints.forEach((point) => {
        if (yOffset > 250) {
          doc.addPage();
          yOffset = 20;
        }
        const bulletPoint = `• ${point}`;
        const pointLines = doc.splitTextToSize(bulletPoint, pageWidth - (margin * 2));
        pointLines.forEach((line: string) => {
          doc.text(line, margin, yOffset);
          yOffset += lineHeight;
        });
      });

      yOffset += lineHeight;
    });

    // Save the PDF
    doc.save('course-outline.pdf');
  };

  return (
    <section className="mt-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Course Outline</h2>
        <div className="flex gap-4">
          <button
            onClick={handleDownload}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Download size={16} />
            Download PDF
          </button>
          <a
            href="https://aiagencyacademy.online/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors"
          >
            Join School of AI
          </a>
        </div>
      </div>
      <div className="space-y-6">
        {courseOutline.lessons.map((lesson, index) => (
          <div key={index} className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-medium">
                Lesson {index + 1}: {lesson.title}
              </h3>
              <span className="text-sm text-gray-500">{lesson.duration}</span>
            </div>
            <p className="text-gray-700 mb-3">{lesson.description}</p>
            <div>
              <h4 className="text-sm font-medium mb-2">Key Points:</h4>
              <ul className="list-disc list-inside space-y-1">
                {lesson.keyPoints.map((point, pointIndex) => (
                  <li key={pointIndex} className="text-gray-600 text-sm">
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
