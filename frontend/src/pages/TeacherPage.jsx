import React, { useState } from 'react';
import StatsCards from '../components/teacher/StatsCards';
import GradeLevelBreakdown from '../components/teacher/GradeLevelBreakdown';
import StudentTable from '../components/teacher/StudentTable';
import StudentDetailModal from '../components/teacher/StudentDetailModal';
import { mockStudentResults, mockClassStats } from '../mock/sampleData';

const TeacherPage = () => {
  const [selectedStudent, setSelectedStudent] = useState(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-7xl mx-auto p-6">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Teacher Dashboard</h2>
          <p className="text-gray-600">Monitor student progress and assessment results across all grade levels</p>
        </div>

        {/* Statistics Cards */}
        <StatsCards stats={mockClassStats} />

        {/* Grade Level and Subject Breakdown */}
        <GradeLevelBreakdown 
          gradeLevelBreakdown={mockClassStats.gradeLevelBreakdown}
          subjectBreakdown={mockClassStats.subjectBreakdown}
        />

        {/* Student Results Table */}
        <StudentTable 
          students={mockStudentResults}
          onStudentSelect={setSelectedStudent}
        />

        {/* Student Detail Modal */}
        {selectedStudent && (
          <StudentDetailModal 
            student={selectedStudent}
            onClose={() => setSelectedStudent(null)}
          />
        )}
      </div>
    </div>
  );
};

export default TeacherPage;