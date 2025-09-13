#Connecting to Claude's API
from anthropic import Anthropic
#os will let you access the enviornment variables 
#json is going to convert claude's output to a python dictionary
import os, json

#Pulling Claude calls
#instance for client
#API key
client = Anthropic(api_key=os.environ["ANTHROPIC_API_KEY"])

#The socratic feedback will 
#intake the students grade level as an int
#intake the topic as a string
#intake the transcript which is what the student explains
def socratic_feedback(grade: int, topic: str, transcript: str):
