import React, { useState, useEffect } from 'react';
import { Mic, Square } from 'lucide-react';
import { formatTime } from '../../utils/helpers';

const Recorder = ({ 
  transcript, 
  isRecording, 
  onStartRecording, 
  onStopRecording, 
  selectedGrade, 
  selectedTopic 
}) => {
  const [recordingTime, setRecordingTime] = useState(0);

  useEffect(() => {
    let interval;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } else {
      setRecordingTime(0);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const getGradeTip = (grade) => {
    const tips = {
      "K-2": "Take your time and use simple words to explain what you know!",
      "3-5": "Try to give examples and explain step by step!",
      "6-8": "Include examples and explain the 'why' behind concepts!",
      "9-12": "Connect concepts together and discuss real-world applications!"
    };
    return tips[grade] || tips["6-8"];
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Voice Recording</h3>
      
      <div className="flex items-center justify-center space-x-4 mb-6">
        {!isRecording ? (
          <button
            onClick={onStartRecording}
            disabled={!selectedGrade || !selectedTopic}
            className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white shadow-lg hover:from-green-600 hover:to-emerald-700 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            <Mic className="w-8 h-8" />
          </button>
        ) : (
          <button
            onClick={onStopRecording}
            className="w-16 h-16 bg-gradient-to-r from-red-500 to-rose-600 rounded-full flex items-center justify-center text-white shadow-lg hover:from-red-600 hover:to-rose-700 transition-all transform hover:scale-105"
          >
            <Square className="w-6 h-6" />
          </button>
        )}
        
        {isRecording && (
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
            <span className="text-red-600 font-mono font-semibold">{formatTime(recordingTime)}</span>
          </div>
        )}
      </div>

      <div className="bg-gray-50 rounded-xl p-4 min-h-32 border border-gray-200">
        <p className="text-sm font-medium text-gray-600 mb-2">What you're saying:</p>
        <p className="text-gray-800 leading-relaxed">
          {transcript || (isRecording ? "Listening..." : "Click the microphone to start explaining what you know...")}
        </p>
      </div>

      {isRecording && selectedGrade && (
        <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-800">
            💡 <strong>Tip for Grade {selectedGrade}:</strong> {getGradeTip(selectedGrade)}
          </p>
        </div>
      )}
    </div>
  );
};

export default Recorder;