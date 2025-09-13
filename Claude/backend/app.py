#libraries imported
from claude_utils import socratic_feedback


#This is going to be the main brain where we include the functions that will call claude
#React is going to send the grade, topic, and transcript that the student user inputs 
#Claude will be called and will evaluate the transcript and return the skill, question, and score of the student
#React will send the grade, topic,
#Claude will be recalled to return the weaknesses and stregnths of the student with suggested next steps 

from fastapi import FastAPI
from pydantic import BaseModel
from claude_untils import socratic 

app = FastAPI()

class TurnRequest(BaseModel):
    grade: int  #student's grade level
    topic: str  #topic the student is learning
    transcript: str #transcript outputted from wispr