import React from 'react';
import { 
  Users, BookOpen, TrendingUp, Award, AlertTriangle, 
  Activity, Brain, RefreshCw, Loader, Wifi, WifiOff
} from 'lucide-react';
import { useTeacherDashboard } from '../hooks/useTeacherDashboard';

const TeacherDashboard = () => {
  // Replace with actual teacher ID from your auth system
  const teacherId = 1;
  
  const {
    stats,
    classPerformance,
    studentsNeedingAttention,
    loading,
    error,
    refetch
  } = useTeacherDashboard(teacherId);

  const getTimeAgo = (date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now - new Date(date)) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  const getScoreColor = (score) => {
    if (score >= 8) return 'text-green-600';
    if (score >= 6) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBadgeColor = (score) => {
    if (score >= 8) return 'bg-green-100 text-green-800';
    if (score >= 6) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <Loader className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Loading dashboard data...</p>
          <p className="text-sm text-gray-500 mt-2">Connecting to backend on port 3001</p>
        </div>
      </div>
    );
  }

  // Error state with connection help
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center max-w-md bg-white p-8 rounded-lg shadow-lg">
          <WifiOff className="h-12 w-12 mx-auto mb-4 text-red-600" />
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Connection Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          
          <div className="bg-gray-50 p-4 rounded-lg mb-4 text-left">
            <p className="text-sm font-medium text-gray-700 mb-2">Troubleshooting:</p>
            <ul className="text-xs text-gray-600 space-y-1">
              <li>• Make sure backend is running on port 3001</li>
              <li>• Check if you can access: <code>http://localhost:3001</code></li>
              <li>• Verify teacher ID {teacherId} exists in database</li>
              <li>• Check browser console for detailed errors</li>
            </ul>
          </div>
          
          <button 
            onClick={refetch}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <RefreshCw className="h-4 w-4 inline mr-2" />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header with connection status */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <div className="flex items-center mb-2">
              <h1 className="text-3xl font-bold text-gray-900 mr-3">Teacher Dashboard</h1>
              <Wifi className="h-5 w-5 text-green-500" title="Connected to API" />
            </div>
            <p className="text-gray-600">Monitor your students' AI-powered learning journey</p>
          </div>
          <button 
            onClick={refetch}
            disabled={loading}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 mt-4 md:mt-0"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>

        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Students</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats?.totalStudents || 0}</p>
                <div className="flex items-center mt-2">
                  <span className="text-sm text-green-600">
                    {stats?.activeStudents || 0} active this week
                  </span>
                </div>
              </div>
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Average Performance</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {stats?.averagePerformance || 0}/10
                </p>
                <div className="flex items-center mt-2">
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-sm text-gray-600">Out of 10</span>
                </div>
              </div>
              <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Award className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">AI Sessions Today</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {stats?.aiSessionsToday || 0}
                </p>
                <div className="flex items-center mt-2">
                  <span className="text-sm text-gray-600">
                    {stats?.totalAiSessions || 0} total sessions
                  </span>
                </div>
              </div>
              <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Brain className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Assessments</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {stats?.totalAssessments || 0}
                </p>
                <div className="flex items-center mt-2">
                  <span className="text-sm text-gray-600">
                    Across all classes
                  </span>
                </div>
              </div>
              <div className="h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <BookOpen className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Recent Activity */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
            </div>
            <div className="p-6">
              {stats?.recentActivity && stats.recentActivity.length > 0 ? (
                <div className="space-y-4">
                  {stats.recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <Activity className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{activity.studentName}</p>
                          <p className="text-sm text-gray-600">{activity.action}</p>
                          <p className="text-xs text-gray-500">
                            {activity.className} • {activity.subject}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        {activity.score && (
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getScoreBadgeColor(activity.score)}`}>
                            {activity.score}/10
                          </span>
                        )}
                        <p className="text-xs text-gray-500 mt-1">{getTimeAgo(activity.date)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">No recent activity</p>
              )}
            </div>
          </div>

          {/* Students Needing Attention */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="px-6 py-4 border-b border-gray-100">
              <div className="flex items-center">
                <AlertTriangle className="h-5 w-5 text-amber-600 mr-2" />
                <h2 className="text-lg font-semibold text-gray-900">Need Attention</h2>
              </div>
            </div>
            <div className="p-6">
              {studentsNeedingAttention.length > 0 ? (
                <div className="space-y-4">
                  {studentsNeedingAttention.map((student) => (
                    <div key={student.id} className="p-4 bg-red-50 border border-red-200 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium text-gray-900">{student.name}</h3>
                        <span className={`text-sm font-medium ${getScoreColor(student.avgScore)}`}>
                          {student.avgScore}/10
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-1">{student.primaryClass}</p>
                      <p className="text-xs text-gray-500">
                        {student.totalAssessments} assessments • {student.daysSinceLogin}d ago
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">All students doing well! 🎉</p>
              )}
            </div>
          </div>
        </div>

        {/* Class Performance */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900">Class Performance</h2>
          </div>
          <div className="p-6">
            {classPerformance.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {classPerformance.map((classData) => (
                  <div key={classData.id} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium text-gray-900">{classData.name}</h3>
                      <span className={`text-lg font-bold ${getScoreColor(classData.avgScore)}`}>
                        {classData.avgScore}/10
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{classData.subject}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {classData.studentCount} students • {classData.totalSessions} sessions
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">No class data available</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;