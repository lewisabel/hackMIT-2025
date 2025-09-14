import React from "react";
import { mockStudentResults } from "../mock/sampleData";
import ChildProgressCard from "../components/parent/ChildProgressCard";
import PerformanceTrends from "../components/parent/PerformanceTrends";
import SuggestionsPanel from "../components/parent/SuggestionsPanel";

const ParentPage = () => {
  // For demo, show all children (later: filter by parent’s linked students)
  const children = mockStudentResults;

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-100 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <header className="text-center">
          <h1 className="text-3xl font-bold text-gray-800">Parent Dashboard</h1>
          <p className="text-gray-600">
            Track your child’s learning progress and see personalized feedback.
          </p>
        </header>

        <div className="grid md:grid-cols-2 gap-6">
          {children.map((child) => (
            <ChildProgressCard key={child.id} child={child} />
          ))}
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">
            Performance Trends
          </h2>
          <PerformanceTrends data={children} />
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">
            Suggestions for Home
          </h2>
          <SuggestionsPanel data={children} />
        </div>
      </div>
    </div>
  );
};

export default ParentPage;
