import { getVideoInfo } from './youtube';

export async function analyzeVideo(apiKey: string, videoUrl: string) {
  try {
    // 1. Get video information
    const videoInfo = await getVideoInfo(videoUrl);

    // 2. Construct the prompt for OpenAI
    const prompt = `**Expert Prompt for YouTube AI Analyzer Agent**  

**Role**: Act as a professional YouTube Content Analyst with expertise in media critique, educational content extraction, and data-driven summarization. Your task is to dissect the provided YouTube video thoroughly and generate a structured, insightful report covering the following elements:  

---

### **1. Comprehensive Summary**  
- **Video Context**: Identify the title, creator, upload date, and overarching purpose (e.g., educational, entertainment, opinion, tutorial).  
- **Content Overview**: Provide a chapter-by-chapter or segment-by-segment breakdown, highlighting the flow of ideas, narrative structure, and transitions.  
- **Core Message**: Extract the central thesis, argument, or objective of the video.  

---

### **2. Key Takeaways**  
- List 5–7 concise, impactful points that encapsulate the video's most critical insights, revelations, or calls to action.  
- Prioritize novel ideas, surprising data, or actionable advice.  

---

### **3. Educational Content Extraction**  
- **Concepts/Theories**: Identify and explain any academic, technical, or niche concepts discussed (e.g., scientific principles, historical context, cultural references).  
- **Skills/Tutorials**: If applicable, outline step-by-step processes, techniques, or methodologies taught.  
- **Resources Cited**: List books, studies, tools, or external references mentioned (with timestamps).  

---

### **4. Critical Analysis**  
- **Argument Evaluation**: Assess the validity of the creator's claims. Are they supported by credible evidence, logical reasoning, or real-world examples?  
- **Bias & Perspective**: Detect any subjective framing, ideological leanings, or omitted counterarguments.  
- **Effectiveness**: Evaluate how well the video achieves its stated purpose. Consider pacing, clarity, emotional appeal, and audience engagement tactics (e.g., humor, clickbait, storytelling).  
- **Gaps & Improvements**: Highlight unanswered questions, weak points, or areas requiring further elaboration.  

---

### **5. Technical & Production Insights**  
- **Visual/Audio Quality**: Comment on editing style, visuals (graphics, B-roll), sound design, and pacing.  
- **Audience Engagement**: Analyze retention strategies (e.g., hooks, cliffhangers, calls to action) and comment on viewer demographics (if inferrable).  

---

### **6. Recommendations & Applications**  
- **For Viewers**: Suggest ideal audience profiles (e.g., students, professionals) and scenarios where the content is most useful.  
- **For Creators**: Provide constructive feedback to enhance future videos (e.g., structure, research depth, presentation).  
- **Further Learning**: Recommend related topics, videos, or resources to supplement the video's content.  

---

**Formatting Guidelines**:  
- Use clear subheadings, bullet points, and numbered lists.  
- Avoid jargon; maintain a professional yet accessible tone.  
- Include timestamps (e.g., [12:34]) for key moments, quotes, or data points.  
- Conclude with a final verdict on the video's overall value and impact.  

**Output**: Deliver a detailed, organized report that enables readers to grasp the video's essence without watching it, while providing actionable insights for creators and critical thinkers.  

---  
**Example Starter**:  
"Analyzing [Video Title] by [Creator Name]: This report deconstructs the video's objectives, strengths, and limitations to evaluate its educational and entertainment value. Key findings include..."  

---

Analyze this YouTube video:
Title: ${videoInfo.title}
Description: ${videoInfo.description}
Transcript: ${videoInfo.transcript}

Format the response as JSON with this exact structure:
{
  "summary": "...",
  "keyTakeaways": ["...", "..."],
  "educationalContent": "...",
  "criticalAnalysis": "...",
  "quizQuestions": [
    {
      "question": "...",
      "options": ["...", "...", "...", "..."],
      "correctAnswer": 0
    }
  ],
  "courseOutline": {
    "title": "...",
    "lessons": [
      {
        "title": "...",
        "description": "...",
        "duration": "...",
        "keyPoints": ["...", "..."]
      }
    ]
  }
}

For the quiz questions:
- Create 5 multiple-choice questions
- Each question should have 4 options
- correctAnswer should be the index (0-3) of the correct option
- Questions should test key concepts from the video
- Make sure questions are clear and unambiguous
`;

    // 3. Call OpenAI API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': "Bearer " + apiKey,
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "You are an expert at analyzing YouTube videos and providing structured insights. Always respond in valid JSON format with the exact structure specified by the user."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 2000
      })
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('OpenAI API Error:', {
        status: response.status,
        statusText: response.statusText,
        error: errorData
      });
      throw new Error("Failed to get analysis from OpenAI API: " + response.status + " " + response.statusText);
    }

    const data = await response.json();
    
    // Parse the response and ensure it matches our expected format
    try {
      const analysisContent = data.choices[0].message.content;
      
      // If the content is already a JSON object, use it directly
      const analysis = typeof analysisContent === 'object' 
        ? analysisContent 
        : JSON.parse(analysisContent);

      return {
        success: true,
        data: {
          ...analysis,
          videoInfo
        }
      };
    } catch (e) {
      console.error('Error parsing OpenAI response:', e);
      throw new Error('Failed to parse OpenAI response');
    }

  } catch (error) {
    console.error('Error in video analysis:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unknown error occurred'
    };
  }
}
