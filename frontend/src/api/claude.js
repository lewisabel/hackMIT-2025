// src/api/claude.js
import axios from "axios";

const API_BASE = "http://127.0.0.1:8080"; // FastAPI dev server
const BACKEND_BASE = "http://127.0.0.1:5000"; // Node backend for transcripts

export const getSocraticFeedback = async (grade, topic, transcript) => {
  const res = await axios.post(`${API_BASE}/turn`, { grade, topic, transcript });
  return res.data;
};

export const logStudentResponse = async (grade, topic, transcript) => {
  const res = await axios.post(`${API_BASE}/log`, { grade, topic, transcript });
  return res.data;
};

export const getLessonPlan = async (grade, topic, assessments) => {
  const res = await axios.post(`${API_BASE}/lesson_plan`, { grade, topic, assessments });
  return res.data;
};

export const getParentView = async (grade, topic, assessments, language = "English") => {
  const res = await axios.post(`${API_BASE}/parent_view`, {
    grade,
    topic,
    assessments,
    language,
  });
  return res.data;
};

export const getLatestTranscript = async () => {
  const res = await axios.get(`${BACKEND_BASE}/api/latest-transcript`);
  return res.data; // { fileName, transcript }
};
