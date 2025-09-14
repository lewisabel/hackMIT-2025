// Grade levels and topics
export const mockTopicsByGrade = {
  "K-2": [
    "Counting and Numbers",
    "Shapes and Patterns", 
    "Animals and Their Homes",
    "Weather and Seasons",
    "Simple Machines"
  ],
  "3-5": [
    "Multiplication and Division",
    "Fractions and Decimals",
    "Plant and Animal Life Cycles",
    "Solar System Basics",
    "States of Matter"
  ],
  "6-8": [
    "Algebra Basics",
    "Geometry and Measurement",
    "Cell Structure and Function",
    "Force and Motion",
    "Ancient Civilizations"
  ],
  "9-12": [
    "Advanced Algebra",
    "Calculus Fundamentals", 
    "Newton's Laws of Motion",
    "Chemical Reactions",
    "World History",
    "Literature Analysis"
  ]
};

export const gradeRanges = ["K-2", "3-5", "6-8", "9-12"];

// Mock transcripts by grade level (moved from components)
export const mockTranscriptsByGrade = {
  "K-2": "Animals need homes to stay safe. Birds live in nests in trees. Fish live in water. Bears live in caves. My dog lives in our house with us.",
  "3-5": "Plants need sunlight and water to make their own food. The leaves are green because of something called chlorophyll. Plants also need soil to grow roots.", 
  "6-8": "Newton's first law says that objects at rest stay at rest unless a force acts on them. Like if I push a ball, it will roll until friction stops it.",
  "9-12": "According to Newton's first law of motion, an object in uniform motion tends to remain in uniform motion unless acted upon by an external force. This principle explains inertia and is fundamental to classical mechanics."
};

// Feedback data by grade level
export const mockFeedbackByGrade = {
  "K-2": {
    score: 78,
    strengths: "You did a great job explaining that animals need homes to stay safe! Your example about birds building nests was perfect.",
    gaps: "Try to think about what animals need besides homes - like food and water! Can you name some animals that live in different places?",
    suggestions: [
      "Draw pictures of different animal homes",
      "Practice naming 3 things animals need to live",
      "Ask a grown-up to read more animal books with you"
    ],
    encouragement: "You're learning so well! Keep asking great questions about animals!"
  },
  "3-5": {
    score: 72,
    strengths: "Excellent explanation of how plants make their own food through photosynthesis. You correctly identified the need for sunlight and water.",
    gaps: "You missed mentioning carbon dioxide from the air and didn't explain what chlorophyll does to make leaves green.",
    suggestions: [
      "Review how plants 'breathe in' carbon dioxide",
      "Learn about chlorophyll and why it makes plants green", 
      "Try a simple experiment with plants and different light conditions"
    ],
    encouragement: "Great scientific thinking! You're asking the right questions about how living things work."
  },
  "6-8": {
    score: 69,
    strengths: "Good understanding that force equals mass times acceleration (F=ma). You provided a clear example with pushing a shopping cart.",
    gaps: "Missed explaining Newton's third law about equal and opposite reactions. Also didn't mention how friction affects motion.",
    suggestions: [
      "Study examples of Newton's third law (walking, swimming, rockets)",
      "Practice calculating force with different masses and accelerations",
      "Investigate how different surfaces create more or less friction"
    ],
    encouragement: "You're developing strong physics intuition! Keep connecting math concepts to real-world examples."
  },
  "9-12": {
    score: 84,
    strengths: "Comprehensive explanation of Newton's laws with mathematical formulations. Excellent real-world applications including rocket propulsion and vehicle safety systems.",
    gaps: "Could strengthen understanding of how these laws apply in non-inertial reference frames. Consider discussing limitations of classical mechanics.",
    suggestions: [
      "Explore how Newton's laws work in rotating reference frames",
      "Research where quantum mechanics begins to diverge from classical physics",
      "Analyze complex systems where multiple forces interact simultaneously"
    ],
    encouragement: "Excellent analytical thinking! You're ready to explore more advanced physics concepts."
  }
};

// Enhanced student results with grade levels and more detailed data
export const mockStudentResults = [
  {
    id: 1,
    name: "Alice Johnson",
    gradeLevel: "9-12",
    score: 85,
    topic: "Newton's Laws of Motion",
    subject: "Physics",
    lastAttempt: "2h ago",
    trend: "up",
    attemptCount: 3,
    averageScore: 82,
    timeSpent: "12 minutes",
    transcript: mockTranscriptsByGrade["9-12"],
    detailedFeedback: mockFeedbackByGrade["9-12"]
  },
  {
    id: 2,
    name: "Ben Wilson",
    gradeLevel: "6-8",
    score: 65,
    topic: "Force and Motion",
    subject: "Science",
    lastAttempt: "1d ago",
    trend: "down",
    attemptCount: 2,
    averageScore: 70,
    timeSpent: "8 minutes",
    transcript: mockTranscriptsByGrade["6-8"],
    detailedFeedback: mockFeedbackByGrade["6-8"]
  },
  {
    id: 3,
    name: "Chloe Davis",
    gradeLevel: "3-5",
    score: 92,
    topic: "Plant and Animal Life Cycles",
    subject: "Science",
    lastAttempt: "3h ago",
    trend: "up",
    attemptCount: 1,
    averageScore: 92,
    timeSpent: "6 minutes",
    transcript: mockTranscriptsByGrade["3-5"],
    detailedFeedback: mockFeedbackByGrade["3-5"]
  },
  {
    id: 4,
    name: "David Chen",
    gradeLevel: "6-8",
    score: 78,
    topic: "Algebra Basics",
    subject: "Math",
    lastAttempt: "5h ago",
    trend: "up",
    attemptCount: 4,
    averageScore: 75,
    timeSpent: "10 minutes",
    transcript: mockTranscriptsByGrade["6-8"],
    detailedFeedback: mockFeedbackByGrade["6-8"]
  },
  {
    id: 5,
    name: "Emma Rodriguez",
    gradeLevel: "K-2",
    score: 88,
    topic: "Animals and Their Homes",
    subject: "Science",
    lastAttempt: "2d ago",
    trend: "stable",
    attemptCount: 2,
    averageScore: 85,
    timeSpent: "4 minutes",
    transcript: mockTranscriptsByGrade["K-2"],
    detailedFeedback: mockFeedbackByGrade["K-2"]
  },
  {
    id: 6,
    name: "Frank Thompson",
    gradeLevel: "9-12",
    score: 76,
    topic: "Chemical Reactions",
    subject: "Chemistry",
    lastAttempt: "1d ago",
    trend: "up",
    attemptCount: 3,
    averageScore: 74,
    timeSpent: "15 minutes",
    transcript: mockTranscriptsByGrade["9-12"],
    detailedFeedback: mockFeedbackByGrade["9-12"]
  }
];

// Class statistics
export const mockClassStats = {
  totalStudents: mockStudentResults.length,
  averageScore: Math.round(mockStudentResults.reduce((acc, student) => acc + student.score, 0) / mockStudentResults.length),
  totalAssessments: mockStudentResults.reduce((acc, student) => acc + student.attemptCount, 0),
  activeTopics: [...new Set(mockStudentResults.map(student => student.topic))].length,
  gradeLevelBreakdown: {
    "K-2": mockStudentResults.filter(s => s.gradeLevel === "K-2").length,
    "3-5": mockStudentResults.filter(s => s.gradeLevel === "3-5").length,
    "6-8": mockStudentResults.filter(s => s.gradeLevel === "6-8").length,
    "9-12": mockStudentResults.filter(s => s.gradeLevel === "9-12").length
  },
  subjectBreakdown: mockStudentResults.reduce((acc, student) => {
    acc[student.subject] = (acc[student.subject] || 0) + 1;
    return acc;
  }, {}),
  improvingStudents: mockStudentResults.filter(s => s.trend === "up").length
};