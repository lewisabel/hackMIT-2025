import React, { useState } from 'react';
import { GraduationCap } from 'lucide-react';
import GradeTopicSelector from '../components/student/GradeTopicSelector';
import Recorder from '../components/student/Recorder';
import FeedbackPanel from '../components/student/FeedbackPanel';
import { mockFeedbackByGrade } from '../mock/sampleData';

const StudentPage = () => {
  const [selectedGrade, setSelectedGrade] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('');
  const [transcript, setTranscript] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleStartRecording = () => {
    if (!selectedGrade || !selectedTopic) {
      alert('Please select both your grade level and a topic first!');
      return;
    }
    setIsRecording(true);
    setTranscript('');
    setFeedback(null);
    
    // Simulate grade-appropriate transcription
    const gradeExamples = {
      "K-2": "Animals need homes to stay safe. Birds live in nests in trees. Fish live in water...",
      "3-5": "Plants need sunlight and water to make their own food. The leaves are green because...", 
      "6-8": "Newton's first law says that objects at rest stay at rest unless a force acts on them...",
      "9-12": "According to Newton's first law of motion, an object in uniform motion tends to remain in uniform motion unless acted upon by an external force..."
    };
    
    setTimeout(() => {
      setTranscript(gradeExamples[selectedGrade] || gradeExamples["6-8"]);
    }, 3000);
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    setIsAnalyzing(true);
    
    // Simulate AI analysis with grade-appropriate feedback
    setTimeout(() => {
      setFeedback(mockFeedbackByGrade[selectedGrade] || mockFeedbackByGrade["6-8"]);
      setIsAnalyzing(false);
    }, 3000);
  };

  const getGradeFocusText = (grade) => {
    const focusTexts = {
      "K-2": "We'll focus on basic understanding and use simple, encouraging language.",
      "3-5": "We'll look for examples and step-by-step thinking appropriate for your level.",
      "6-8": "We'll assess your grasp of concepts and ability to explain the reasoning.",
      "9-12": "We'll evaluate depth of understanding and connections between concepts."
    };
    return focusTexts[grade] || focusTexts["6-8"];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-6xl mx-auto p-6 space-y-8">
        <div className="text-center py-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Knowledge Assessment</h2>
          <p className="text-gray-600">Tell us your grade level, pick a topic, and show what you know!</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Grade and Topic Selection */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <GradeTopicSelector 
                selectedGrade={selectedGrade}
                selectedTopic={selectedTopic}
                onGradeChange={setSelectedGrade}
                onTopicChange={setSelectedTopic}
              />
            </div>

            {/* Recording Component */}
            <Recorder 
              transcript={transcript}
              isRecording={isRecording}
              onStartRecording={handleStartRecording}
              onStopRecording={handleStopRecording}
              selectedGrade={selectedGrade}
              selectedTopic={selectedTopic}
            />

            {/* Enhanced Feedback Panel */}
            <FeedbackPanel 
              feedback={feedback} 
              isLoading={isAnalyzing} 
              gradeLevel={selectedGrade}
            />
          </div>

          <div className="space-y-6">
            {/* How it Works */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <h3 className="font-semibold text-gray-800 mb-4">How it Works</h3>
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-start space-x-3">
                  <span className="w-6 h-6 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-xs font-semibold">1</span>
                  <span>Tell us what grade you're in</span>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-semibold">2</span>
                  <span>Pick a topic you want to be assessed on</span>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-xs font-semibold">3</span>
                  <span>Record yourself explaining what you know</span>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="w-6 h-6 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-xs font-semibold">4</span>
                  <span>Get personalized feedback for your grade level</span>
                </div>
              </div>
            </div>

            {/* Grade Level Info */}
            {selectedGrade && (
              <div className="bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl p-6 text-white">
                <h3 className="font-semibold mb-2 flex items-center">
                  <GraduationCap className="w-5 h-5 mr-2" />
                  Grade {selectedGrade} Focus
                </h3>
                <p className="text-sm text-indigo-100">
                  {getGradeFocusText(selectedGrade)}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentPage;