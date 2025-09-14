// src/api/claude.js
import axios from "axios";

const API_BASE = "http://127.0.0.1:8080"; // FastAPI dev server
const BACKEND_BASE = "http://127.0.0.1:5000"; // Node backend for transcripts

export const getSocraticFeedback = async (grade, topic, transcript) => {
    try {
        // Convert grade to integer, handling all cases
        let gradeInt;
        if (grade === null || grade === undefined || grade === '') {  // Fixed: Added || operators
            gradeInt = 1; // Default grade
        } else if (typeof grade === 'string') {
            // Handle "K" for kindergarten
            if (grade.toUpperCase() === 'K') {
                gradeInt = 0;
            } else if (grade.includes('-')) {
                // Handle ranges like "K-2", "3-5", etc. - take the first number
                const numbers = grade.match(/\d+/);
                gradeInt = numbers ? parseInt(numbers[0]) : 1;
            } else {
                gradeInt = parseInt(grade) || 1;  // Fixed: Added || operator
            }
        } else {
            gradeInt = grade; // Already a number
        }

        console.log('Sending to API:', {
            grade: gradeInt,
            topic,
            transcriptLength: transcript?.length
        });

        const response = await fetch('http://127.0.0.1:8080/turn', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                grade: gradeInt,
                topic: topic || "General",  // Fixed: Added || operator
                transcript: transcript || ""
            })
        });

        if (!response.ok) {
            const errorDetail = await response.json();
            console.error('API Error:', errorDetail);
            throw new Error(`API Error: ${response.status} - ${JSON.stringify(errorDetail)}`);  // Fixed: Added backticks
        }

        return await response.json();
    } catch (error) {
        console.error('Error calling Socratic feedback:', error);
        throw error;
    }
};

export const logStudentResponse = async (grade, topic, transcript) => {
    const res = await axios.post(`${API_BASE}/log`, {
        grade,
        topic,
        transcript
    });
    return res.data;
};

export const getLessonPlan = async (grade, topic, assessments) => {
    const res = await axios.post(`${API_BASE}/lesson_plan`, {
        grade,
        topic,
        assessments
    });
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
