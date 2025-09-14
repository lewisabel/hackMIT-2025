import React from 'react';
import { GraduationCap ,  BookOpen } from 'lucide-react';
import { getGradeLevelIcon } from '../../utils/helpers';

const GradeLevelBreakdown = ({ gradeLevelBreakdown, subjectBreakdown }) => {
  return (
    <div className="grid md:grid-cols-2 gap-6 mb-8">
      {/* Grade Level Distribution */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <GraduationCap className="w-5 h-5 mr-2 text-blue-500" />
          Students by Grade Level
        </h3>
        <div className="space-y-3">
          {Object.entries(gradeLevelBreakdown).map(([grade, count]) => (
            <div key={grade} className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-lg">{getGradeLevelIcon(grade)}</span>
                <span className="font-medium text-gray-700">Grade {grade}</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-500 rounded-full transition-all duration-500"
                    style={{ width: `${(count / Math.max(...Object.values(gradeLevelBreakdown))) * 100}%` }}
                  ></div>
                </div>
                <span className="text-sm font-semibold text-gray-600 w-8">{count}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Subject Distribution */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <BookOpen className="w-5 h-5 mr-2 text-purple-500" />
          Students by Subject
        </h3>
        <div className="space-y-3">
          {Object.entries(subjectBreakdown).map(([subject, count]) => (
            <div key={subject} className="flex items-center justify-between">
              <span className="font-medium text-gray-700">{subject}</span>
              <div className="flex items-center space-x-2">
                <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-purple-500 rounded-full transition-all duration-500"
                    style={{ width: `${(count / Math.max(...Object.values(subjectBreakdown))) * 100}%` }}
                  ></div>
                </div>
                <span className="text-sm font-semibold text-gray-600 w-8">{count}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GradeLevelBreakdown;