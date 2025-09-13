export const getScoreColor = (score) => {
  if (score >= 80) return "text-green-600 bg-green-100";
  if (score >= 60) return "text-yellow-600 bg-yellow-100";
  return "text-red-600 bg-red-100";
};

export const getGradeLevelIcon = (grade) => {
  if (grade === "K-2") return "🌟";
  if (grade === "3-5") return "🎯";
  if (grade === "6-8") return "🔬";
  return "🎓";
};

export const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

// New helper for transcript retrieval
export const getTranscriptForGrade = (gradeLevel, transcripts) => {
  return transcripts[gradeLevel] || transcripts["6-8"];
};