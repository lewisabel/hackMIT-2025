import React from "react";

const SuggestionsPanel = ({ data }) => {
  return (
    <div className="space-y-4">
      {data.map((child) => (
        <div
          key={child.id}
          className="bg-gray-50 p-4 rounded-xl border border-gray-100 shadow-sm"
        >
          <h3 className="font-semibold text-gray-800 mb-2">{child.name}</h3>
          <p className="text-sm text-gray-600 mb-2">
            <span className="font-medium">Encouragement:</span>{" "}
            {child.detailedFeedback?.encouragement || "Keep up the great work!"}
          </p>
          <p className="text-sm text-gray-600 mb-1 font-medium">Next Steps:</p>
          <ul className="list-disc list-inside text-sm text-gray-600">
            {child.detailedFeedback?.suggestions?.map((s, idx) => (
              <li key={idx}>{s}</li>
            )) || <li>Continue practicing regularly!</li>}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default SuggestionsPanel;
