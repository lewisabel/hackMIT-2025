#libraries imported
from claude_utils import (
    socratic_feedback,
    generate_parent_guidance,
    generate_tailored_lesson_plan

)

from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI
from fastapi import FastAPI
from pydantic import BaseModel
from claude_utils import socratic_feedback

app = FastAPI()

# Allow frontend origin
origins = [
    "http://localhost:3000",
    "http://localhost:5000",    # React dev server
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,       # or ["*"] for all origins (not recommended for production)
    allow_credentials=True,
    allow_methods=["*"],         # GET, POST, etc.
    allow_headers=["*"],
)


#This is going to be the main brain where we include the functions that will call claude
#React is going to send the grade, topic, and transcript that the student user inputs 
#Claude will be called and will evaluate the transcript and return the skill, question, and score of the student
#React will send the grade, topic,
#Claude will be recalled to return the weaknesses and stregnths of the student with suggested next steps 




class TurnRequest(BaseModel):
    grade: int  #student's grade level
    topic: str  #topic the student is learning
    transcript: str #transcript outputted from wispr

@app.post("/turn")
def handle_turn(req: TurnRequest):
    feedback = socratic_feedback(req.grade, req.topic, req.transcript)
    return feedback


#storing the student answers
#Sarah's Data Base can replace with a proper database
student_logs = {}

@app.post("/log")
def stored_response_log(req: TurnRequest):
    if req.grade not in student_logs:
        student_logs[req.grade] = []
    student_logs[req.grade].append({
        "topic": req.topic,
        "transcript": req.transcript
    })
    return {"status": "logged", "entries": len(student_logs[req.grade])}

#Lesson plan generator based on students weaknesses and strengths
class LessonPlanRequest(BaseModel):
    grade: int
    topic: str
    assessments: list


@app.post("/lesson_plan")
def handle_lesson_plan(req: LessonPlanRequest):
    return generate_tailored_lesson_plan(req.assessments, req.topic, req.grade)


#Parent integration 
class ParentViewRequest(BaseModel):
    grade: int
    topic: str
    assessments: list   
    language: str = "English"


@app.post("/parent_view")
def handle_parent_view(req: ParentViewRequest):
    return generate_parent_guidance(
        req.assessments, 
        req.topic, 
        req.grade,
        req.language
    )


