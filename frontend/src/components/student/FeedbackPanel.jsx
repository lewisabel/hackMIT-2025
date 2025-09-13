import React from 'react';
import { Award, TrendingUp, Lightbulb, GraduationCap } from 'lucide-react';
import { getScoreColor, getGradeLevelIcon } from '../../utils/helpers';

const FeedbackPanel = ({ feedback, isLoading, gradeLevel }) => {
  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <h3 className="text-lg font-semibold text-gray-800">Analyzing your response...</h3>
        </div>
        <div className="space-y-3">
          <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2"></div>
        </div>
      </div>
    );
  }

  if (!feedback) return null;

  const getStrengthsTitle = (grade) => {
    return grade === "K-2" ? "Great Job!" : "Strengths";
  };

  const getImprovementTitle = (grade) => {
    return grade === "K-2" ? "Let's Learn More About" : "Areas to Improve";
  };

  const getNextStepsTitle = (grade) => {
    return grade === "K-2" ? "Fun Things to Try" : "Next Steps";
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <h3 className="text-lg font-semibold text-gray-800">Your Assessment Results</h3>
          <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-lg text-sm font-medium">
            {getGradeLevelIcon(gradeLevel)} Grade {gradeLevel}
          </span>
        </div>
        <div className={`px-4 py-2 rounded-full font-bold text-lg ${getScoreColor(feedback.score)}`}>
          {feedback.score}%
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          {/* Strengths */}
          <div className="p-4 bg-green-50 rounded-xl border border-green-200">
            <h4 className="font-semibold text-green-800 mb-2 flex items-center">
              <Award className="w-5 h-5 mr-2" />
              {getStrengthsTitle(gradeLevel)}
            </h4>
            <p className="text-green-700 text-sm leading-relaxed">{feedback.strengths}</p>
          </div>

          {/* Areas for Improvement */}
          <div className="p-4 bg-orange-50 rounded-xl border border-orange-200">
            <h4 className="font-semibold text-orange-800 mb-2 flex items-center">
              <TrendingUp className="w-5 h-5 mr-2" />
              {getImprovementTitle(gradeLevel)}
            </h4>
            <p className="text-orange-700 text-sm leading-relaxed">{feedback.gaps}</p>
          </div>
        </div>

        <div className="space-y-4">
          {/* Suggestions */}
          <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
            <h4 className="font-semibold text-blue-800 mb-3 flex items-center">
              <Lightbulb className="w-5 h-5 mr-2" />
              {getNextStepsTitle(gradeLevel)}
            </h4>
            <ul className="space-y-2">
              {feedback.suggestions.map((suggestion, index) => (
                <li key={index} className="flex items-start space-x-2 text-sm text-blue-700">
                  <span className="w-5 h-5 bg-blue-200 rounded-full flex items-center justify-center text-xs font-semibold text-blue-800 mt-0.5">
                    {index + 1}
                  </span>
                  <span className="leading-relaxed">{suggestion}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Encouragement */}
          {feedback.encouragement && (
            <div className="p-4 bg-purple-50 rounded-xl border border-purple-200">
              <h4 className="font-semibold text-purple-800 mb-2 flex items-center">
                <span className="text-lg mr-2">💪</span>
                Keep Going!
              </h4>
              <p className="text-purple-700 text-sm leading-relaxed">{feedback.encouragement}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FeedbackPanel;