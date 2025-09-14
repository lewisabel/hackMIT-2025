import React from 'react';
import { X, Clock, Target, MessageSquare } from 'lucide-react';
import { getScoreColor, getGradeLevelIcon } from '../../utils/helpers';

const StudentDetailModal = ({ student, onClose }) => {
  if (!student) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
              {student.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-800">{student.name}</h3>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <span>{getGradeLevelIcon(student.gradeLevel)}</span>
                <span>Grade {student.gradeLevel}</span>
                <span>•</span>
                <span>{student.subject}</span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-2 rounded-lg hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-6">
          <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
            <h4 className="font-semibold text-blue-800 mb-1 flex items-center">
              <Target className="w-4 h-4 mr-2" />
              Current Score
            </h4>
            <p className={`text-2xl font-bold ${getScoreColor(student.score).split(' ')[0]}`}>
              {student.score}%
            </p>
            <p className="text-xs text-blue-600 mt-1">Average: {student.averageScore}%</p>
          </div>
          
          <div className="p-4 bg-purple-50 rounded-xl border border-purple-200">
            <h4 className="font-semibold text-purple-800 mb-1">Assessment Topic</h4>
            <p className="text-purple-700 font-medium">{student.topic}</p>
            <p className="text-xs text-purple-600 mt-1">{student.attemptCount} attempts</p>
          </div>
          
          <div className="p-4 bg-green-50 rounded-xl border border-green-200">
            <h4 className="font-semibold text-green-800 mb-1 flex items-center">
              <Clock className="w-4 h-4 mr-2" />
              Time Spent
            </h4>
            <p className="text-green-700 font-medium">{student.timeSpent}</p>
            <p className="text-xs text-green-600 mt-1">{student.lastAttempt}</p>
          </div>
        </div>

        {/* Student's Transcript */}
        <div className="mb-6">
          <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
            <MessageSquare className="w-4 h-4 mr-2" />
            Student's Response
          </h4>
          <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
            <p className="text-gray-700 leading-relaxed text-sm">
              "{student.transcript}"
            </p>
          </div>
        </div>

        {/* Detailed Feedback */}
        <div className="space-y-4">
          <div className="p-4 bg-green-50 rounded-xl border border-green-200">
            <h4 className="font-semibold text-green-800 mb-2">
              {student.gradeLevel === "K-2" ? "Great Job!" : "Strengths Identified"}
            </h4>
            <p className="text-green-700 text-sm leading-relaxed">
              {student.detailedFeedback.strengths}
            </p>
          </div>

          <div className="p-4 bg-orange-50 rounded-xl border border-orange-200">
            <h4 className="font-semibold text-orange-800 mb-2">
              {student.gradeLevel === "K-2" ? "Let's Learn More About" : "Areas for Improvement"}
            </h4>
            <p className="text-orange-700 text-sm leading-relaxed">
              {student.detailedFeedback.gaps}
            </p>
          </div>

          <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
            <h4 className="font-semibold text-blue-800 mb-3">
              {student.gradeLevel === "K-2" ? "Fun Things to Try" : "Recommended Next Steps"}
            </h4>
            <ul className="space-y-2">
              {student.detailedFeedback.suggestions.map((suggestion, index) => (
                <li key={index} className="flex items-start space-x-2 text-sm text-blue-700">
                  <span className="w-5 h-5 bg-blue-200 rounded-full flex items-center justify-center text-xs font-semibold text-blue-800 mt-0.5">
                    {index + 1}
                  </span>
                  <span className="leading-relaxed">{suggestion}</span>
                </li>
              ))}
            </ul>
          </div>

          {student.detailedFeedback.encouragement && (
            <div className="p-4 bg-purple-50 rounded-xl border border-purple-200">
              <h4 className="font-semibold text-purple-800 mb-2 flex items-center">
                <span className="text-lg mr-2">💪</span>
                Keep Going!
              </h4>
              <p className="text-purple-700 text-sm leading-relaxed">
                {student.detailedFeedback.encouragement}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentDetailModal;