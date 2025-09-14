import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const PerformanceTrends = ({ data }) => {
  // Transform mockStudentResults into chart-friendly data
  // For demo: last 3 attempts simulated by slightly varying score
  const chartData = data.flatMap((child) =>
    Array.from({ length: child.attemptCount }).map((_, idx) => ({
      name: `${child.name} #${idx + 1}`,
      score:
        child.score - (child.attemptCount - idx - 1) * 2, // slightly lower for previous attempts
    }))
  );

  return (
    <ResponsiveContainer width="100%" height={250}>
      <LineChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" tick={{ fontSize: 12 }} />
        <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
        <Tooltip />
        <Line
          type="monotone"
          dataKey="score"
          stroke="#6366F1"
          strokeWidth={3}
          dot={{ r: 5 }}
          activeDot={{ r: 7 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default PerformanceTrends;
