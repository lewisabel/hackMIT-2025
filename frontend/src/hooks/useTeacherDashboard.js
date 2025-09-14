// frontend/src/hooks/useTeacherDashboard.js
import { useState, useEffect } from 'react';
import { teacherApi } from '../services/api';

export function useTeacherDashboard() {  // Remove teacherId parameter
  const [data, setData] = useState({
    stats: null,
    classPerformance: [],
    studentsNeedingAttention: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [stats, classPerformance, studentsNeedingAttention] = await Promise.all([
        teacherApi.getStats(),  // Remove teacherId parameter
        teacherApi.getClassPerformance(),  // Remove teacherId parameter
        teacherApi.getStudentsNeedingAttention()  // Remove teacherId parameter
      ]);

      setData({
        stats,
        classPerformance,
        studentsNeedingAttention
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);  // Remove teacherId dependency

  return {
    ...data,
    loading,
    error,
    refetch: fetchData
  };
}