import React, { useState, useEffect, useRef } from 'react';
import { GraduationCap } from 'lucide-react';
import GradeTopicSelector from '../components/student/GradeTopicSelector';
import Recorder from '../components/student/Recorder';
import FeedbackPanel from '../components/student/FeedbackPanel';
import { mockFeedbackByGrade } from '../mock/sampleData';
import { getLatestTranscript, getSocraticFeedback } from "../api/claude";

const StudentPage = () => {
  const [lastTranscriptFile, setLastTranscriptFile] = useState(null);
  const [selectedGrade, setSelectedGrade] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('');
  const [transcript, setTranscript] = useState('');
  const [feedback, setFeedback] = useState({ suggestions: [] });
  const [isRecording, setIsRecording] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const [finalTranscript, setFinalTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const lastFinalIndexRef = useRef(0); // track last processed result index

  const recognitionRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Your browser does not support Speech Recognition.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';
    
    recognition.onresult = (event) => {
      let interim = '';

      for (let i = lastFinalIndexRef.current; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          setFinalTranscript((prev) => prev + result[0].transcript + ' ');
          lastFinalIndexRef.current = i + 1; // move past this final result
        } else {
          interim += result[0].transcript;
        }
      }

      setInterimTranscript(interim);
    };


    
    recognition.onerror = (e) => console.error('Recognition error:', e);

    recognitionRef.current = recognition;
  }, []);

  const handleStartRecording = () => {
    if (!selectedGrade || !selectedTopic) {
      alert('Please select both your grade level and a topic first!');
      return;
    }

    setTranscript('');
    setFeedback(null);
    setIsRecording(true);

    try {
      recognitionRef.current?.start();
    } catch (err) {
      console.error('Speech recognition start error:', err);
    }
  };


  const handleStopRecording = async () => {
  setIsRecording(false);
  setIsAnalyzing(true);
  recognitionRef.current?.stop();

  try {
    // 1. Get the latest transcript from backend folder
    const { transcript } = await getLatestTranscript();
    console.log(transcript);

    if (!transcript) {
      console.warn("No transcript found");
      setIsAnalyzing(false);
      return;
    }

    setTranscript(transcript);

    // 2. Send to Claude API for feedback
    const aiFeedback = await getSocraticFeedback(
      selectedGrade,
      selectedTopic,
      transcript
    );
    console.log("Claude response:", aiFeedback);
    
    setFeedback(aiFeedback);
  } catch (err) {
    console.error("Error analyzing transcript:", err);
  } finally {
    setIsAnalyzing(false);
  }
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
              transcript={finalTranscript + interimTranscript}
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
                {/* steps list... */}
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