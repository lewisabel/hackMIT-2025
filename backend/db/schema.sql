-- Student Learning Assessment System Database Schema
-- For SQLite Database

-- 1. Users table (for authentication and basic info)
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role TEXT CHECK(role IN ('student', 'teacher', 'admin')) DEFAULT 'student',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP,
    is_active BOOLEAN DEFAULT 1
);

-- 2. Students table (extends users with student-specific info)
CREATE TABLE students (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER UNIQUE NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    student_id TEXT UNIQUE,
    grade_level TEXT,
    enrollment_date DATE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 3. Teachers table (extends users with teacher-specific info)
CREATE TABLE teachers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER UNIQUE NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    employee_id TEXT UNIQUE,
    department TEXT,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 4. Classes table (course information)
CREATE TABLE classes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    class_code TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    subject TEXT NOT NULL,
    description TEXT,
    teacher_id INTEGER NOT NULL,
    school_name TEXT,
    academic_year TEXT,
    semester TEXT,
    schedule TEXT, -- e.g., "MWF 10:00-11:00"
    room_number TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT 1,
    FOREIGN KEY (teacher_id) REFERENCES teachers(id)
);

-- 5. Enrollments table (many-to-many relationship between students and classes)
CREATE TABLE enrollments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_id INTEGER NOT NULL,
    class_id INTEGER NOT NULL,
    enrollment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status TEXT CHECK(status IN ('active', 'dropped', 'completed')) DEFAULT 'active',
    final_grade TEXT,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE CASCADE,
    UNIQUE(student_id, class_id)
);

-- 6. Lessons table (individual lessons/lectures within a class)
CREATE TABLE lessons (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    class_id INTEGER NOT NULL,
    lesson_number INTEGER,
    title TEXT NOT NULL,
    description TEXT,
    topics_covered TEXT, -- JSON array of topics
    learning_objectives TEXT, -- JSON array of objectives
    lesson_date DATE,
    materials_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE CASCADE
);

-- 7. AI Sessions table (when students interact with AI after lessons)
CREATE TABLE ai_sessions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_id INTEGER NOT NULL,
    lesson_id INTEGER NOT NULL,
    session_start TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    session_end TIMESTAMP,
    duration_minutes INTEGER,
    transcript TEXT, -- Full conversation transcript
    summary TEXT, -- AI-generated summary
    status TEXT CHECK(status IN ('in_progress', 'completed', 'abandoned')) DEFAULT 'in_progress',
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    FOREIGN KEY (lesson_id) REFERENCES lessons(id) ON DELETE CASCADE
);

-- 8. Assessments table (AI's evaluation of student understanding)
CREATE TABLE assessments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id INTEGER NOT NULL,
    student_id INTEGER NOT NULL,
    lesson_id INTEGER NOT NULL,
    overall_score REAL CHECK(overall_score >= 0 AND overall_score <= 100),
    understanding_level TEXT CHECK(understanding_level IN ('novice', 'developing', 'proficient', 'advanced')),
    strengths TEXT, -- JSON array of strong areas
    weaknesses TEXT, -- JSON array of areas needing improvement
    ai_feedback TEXT,
    recommended_resources TEXT, -- JSON array of suggested materials
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (session_id) REFERENCES ai_sessions(id) ON DELETE CASCADE,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    FOREIGN KEY (lesson_id) REFERENCES lessons(id) ON DELETE CASCADE
);

-- 9. Topic Assessments table (granular assessment per topic)
CREATE TABLE topic_assessments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    assessment_id INTEGER NOT NULL,
    topic_name TEXT NOT NULL,
    score REAL CHECK(score >= 0 AND score <= 100),
    confidence_level TEXT CHECK(confidence_level IN ('low', 'medium', 'high')),
    specific_feedback TEXT,
    FOREIGN KEY (assessment_id) REFERENCES assessments(id) ON DELETE CASCADE
);

-- 10. Learning Progress table (tracks progress over time)
CREATE TABLE learning_progress (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_id INTEGER NOT NULL,
    class_id INTEGER NOT NULL,
    date DATE NOT NULL,
    average_understanding REAL,
    topics_mastered INTEGER DEFAULT 0,
    total_topics INTEGER DEFAULT 0,
    time_spent_minutes INTEGER DEFAULT 0,
    streak_days INTEGER DEFAULT 0,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE CASCADE,
    UNIQUE(student_id, class_id, date)
);

-- Create indexes for better query performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_students_user_id ON students(user_id);
CREATE INDEX idx_enrollments_student ON enrollments(student_id);
CREATE INDEX idx_enrollments_class ON enrollments(class_id);
CREATE INDEX idx_lessons_class ON lessons(class_id);
CREATE INDEX idx_ai_sessions_student ON ai_sessions(student_id);
CREATE INDEX idx_ai_sessions_lesson ON ai_sessions(lesson_id);
CREATE INDEX idx_assessments_student ON assessments(student_id);
CREATE INDEX idx_assessments_session ON assessments(session_id);
CREATE INDEX idx_learning_progress_student_class ON learning_progress(student_id, class_id);

-- Sample data insertion (for testing)
-- Insert a test teacher
INSERT INTO users (email, password_hash, role) 
VALUES ('prof.smith@school.edu', 'hashed_password_here', 'teacher');

INSERT INTO teachers (user_id, first_name, last_name, employee_id, department)
VALUES (1, 'John', 'Smith', 'EMP001', 'Mathematics');

-- Insert a test student
INSERT INTO users (email, password_hash, role) 
VALUES ('student1@school.edu', 'hashed_password_here', 'student');

INSERT INTO students (user_id, first_name, last_name, student_id, grade_level)
VALUES (2, 'Jane', 'Doe', 'STU001', '10');

-- Insert a test class
INSERT INTO classes (class_code, name, subject, description, teacher_id, school_name, academic_year, semester)
VALUES ('MATH101', 'Algebra I', 'Mathematics', 'Introduction to Algebra', 1, 'Lincoln High School', '2024-2025', 'Fall');

-- Enroll student in class
INSERT INTO enrollments (student_id, class_id)
VALUES (1, 1);

-- Insert a test lesson
INSERT INTO lessons (class_id, lesson_number, title, topics_covered, learning_objectives)
VALUES (1, 1, 'Introduction to Variables', 
        '["variables", "expressions", "substitution"]',
        '["Understand what variables represent", "Write algebraic expressions", "Evaluate expressions"]');