import React from 'react';
import { Users, Award, BookOpen, TrendingUp, GraduationCap, Clock } from 'lucide-react';

const StatsCards = ({ stats }) => {
  const statCards = [
    {
      title: "Total Students",
      value: stats.totalStudents,
      icon: Users,
      color: "blue",
      bgColor: "bg-blue-50",
      iconColor: "text-blue-500"
    },
    {
      title: "Average Score",
      value: `${stats.averageScore}%`,
      icon: Award,
      color: "green",
      bgColor: "bg-green-50",
      iconColor: "text-green-500"
    },
    {
      title: "Total Assessments",
      value: stats.totalAssessments,
      icon: Clock,
      color: "purple",
      bgColor: "bg-purple-50",
      iconColor: "text-purple-500"
    },
    {
      title: "Improving Students",
      value: stats.improvingStudents,
      icon: TrendingUp,
      color: "emerald",
      bgColor: "bg-emerald-50",
      iconColor: "text-emerald-500"
    }
  ];

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {statCards.map((stat, index) => (
        <div key={index} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold text-gray-600">{stat.title}</h3>
            <div className={`p-2 rounded-xl ${stat.bgColor}`}>
              <stat.icon className={`w-5 h-5 ${stat.iconColor}`} />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;