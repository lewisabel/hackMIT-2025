import React, { useState } from 'react';
import { ChevronDown, GraduationCap, BookOpen, Target } from 'lucide-react';
import { mockTopicsByGrade, gradeRanges } from '../../mock/sampleData';

const GradeTopicSelector = ({ selectedGrade, selectedTopic, onGradeChange, onTopicChange }) => {
  const [isGradeOpen, setIsGradeOpen] = useState(false);
  const [isTopicOpen, setIsTopicOpen] = useState(false);

  const availableTopics = selectedGrade ? mockTopicsByGrade[selectedGrade] : [];

  return (
    <div className="space-y-6">
      {/* Grade Level Selector */}
      <div className="relative">
        <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
          <GraduationCap className="w-4 h-4 mr-2" />
          Select Your Grade Level
        </label>
        <button
          onClick={() => setIsGradeOpen(!isGradeOpen)}
          className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-left flex items-center justify-between hover:border-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all shadow-sm"
        >
          <span className={selectedGrade ? "text-gray-900" : "text-gray-500"}>
            {selectedGrade ? `Grade ${selectedGrade}` : "Choose your grade level..."}
          </span>
          <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${isGradeOpen ? 'rotate-180' : ''}`} />
        </button>
        
        {isGradeOpen && (
          <div className="absolute z-10 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-lg">
            {gradeRanges.map((grade, index) => (
              <button
                key={index}
                onClick={() => {
                  onGradeChange(grade);
                  onTopicChange(''); // Reset topic when grade changes
                  setIsGradeOpen(false);
                }}
                className="w-full px-4 py-3 text-left hover:bg-purple-50 hover:text-purple-700 transition-colors border-b border-gray-100 last:border-b-0 flex items-center justify-between"
              >
                <span>Grade {grade}</span>
                <span className="text-xs text-gray-500">{mockTopicsByGrade[grade].length} topics</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Topic Selector */}
      <div className="relative">
        <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
          <BookOpen className="w-4 h-4 mr-2" />
          Select Topic to Assess
        </label>
        <button
          onClick={() => setIsTopicOpen(!isTopicOpen)}
          disabled={!selectedGrade}
          className={`w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-left flex items-center justify-between hover:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-sm ${!selectedGrade ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <span className={selectedTopic ? "text-gray-900" : "text-gray-500"}>
            {selectedTopic || (selectedGrade ? "Choose a topic to assess..." : "Select grade level first")}
          </span>
          <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${isTopicOpen ? 'rotate-180' : ''}`} />
        </button>
        
        {isTopicOpen && selectedGrade && (
          <div className="absolute z-10 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-y-auto">
            {availableTopics.map((topic, index) => (
              <button
                key={index}
                onClick={() => {
                  onTopicChange(topic);
                  setIsTopicOpen(false);
                }}
                className="w-full px-4 py-3 text-left hover:bg-blue-50 hover:text-blue-700 transition-colors border-b border-gray-100 last:border-b-0"
              >
                {topic}
              </button>
            ))}
          </div>
        )}
      </div>

      {selectedGrade && selectedTopic && (
        <div className="p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl border border-green-200">
          <div className="flex items-center space-x-2 mb-2">
            <Target className="w-5 h-5 text-green-600" />
            <span className="font-semibold text-green-800">Assessment Ready!</span>
          </div>
          <p className="text-sm text-green-700">
            You'll be assessed on <strong>{selectedTopic}</strong> at a <strong>Grade {selectedGrade}</strong> level.
          </p>
        </div>
      )}
    </div>
  );
};

export default GradeTopicSelector;