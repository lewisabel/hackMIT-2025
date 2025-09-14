import React from "react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

const ChildProgressCard = ({ child }) => {
  const trendIcon =
    child.trend === "up" ? (
      <TrendingUp className="text-green-500 w-5 h-5" />
    ) : child.trend === "down" ? (
      <TrendingDown className="text-red-500 w-5 h-5" />
    ) : (
      <Minus className="text-gray-400 w-5 h-5" />
    );

  return (
    <div className="bg-white rounded-xl shadow p-5 border border-gray-100">
      <h3 className="text-lg font-semibold text-gray-800">
        {child.name} <span className="text-sm text-gray-500">({child.gradeLevel})</span>
      </h3>
      <p className="text-gray-600 text-sm mb-2">{child.topic} – {child.subject}</p>
      <div className="flex items-center space-x-3">
        <span className="text-2xl font-bold text-indigo-600">{child.score}%</span>
        {trendIcon}
      </div>
      <p className="text-xs text-gray-500 mt-2">
        Last attempt: {child.lastAttempt}, Attempts: {child.attemptCount}
      </p>
    </div>
  );
};

export default ChildProgressCard;
