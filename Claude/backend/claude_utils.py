#Connecting to Claude's API
#os will let you access the enviornment variables 
#json is going to convert claude's output to a python dictionary
import os, json
from dotenv import load_dotenv
from anthropic import Anthropic

load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), ".env"))
client = Anthropic(api_key=os.environ["ANTHROPIC_API_KEY"])

#Parents can select one of these languages to translate their instructions to
LANGUAGE_OPTIONS = {
    "English": "en",
    "Spanish": "es",
    "French": "fr",
    "Chinese (Simplified)": "zh",
    "Chinese (Traditional)": "zh-Hant",
    "Arabic": "ar",
    "Hindi": "hi",
    "Portuguese": "pt",
    "Russian": "ru",
    "Japanese": "ja",
    "Korean": "ko"
}

models = client.models.list()
for m in models.data:
    print(m.id)

#Pulling Claude calls
#instance for client
#API key
client = Anthropic(api_key=os.environ["ANTHROPIC_API_KEY"])

#The socratic feedback will 
#intake the students grade level as an int
#intake the topic as a string
#intake the transcript which is what the student explains
def socratic_feedback(grade: int, topic: str, transcript: str):
    system = f"""
    You are a gentle and encouraging socratic teacher for Grade {grade} on "{topic}".
    Analyze their explanation and return ONLY JSON with keys:
    concept, assessment, score (1-5), strengths, weaknesses, recommendation.
    """

    try:
        response = client.messages.create(
            model="claude-3-7-sonnet-20250219",
            max_tokens=300,
            system=f"""
            You are a gentle and encouraging socratic teacher for Grade {grade} on "{topic}".
            Analyze their explanation and return ONLY JSON with keys: 
            concept, assessment, score (1-5), strengths, weaknesses, recommendation
        """,
        messages=[
            {
                "role": "user",
                "content": f"Transcript: {transcript}"
            }
        ]
    )

        raw = response.content[0].text
        print("RAW CLAUDE OUTPUT:", raw)

       
        parsed = json.loads(raw[raw.find("{"): raw.rfind("}")+1])
        return parsed

    except Exception as e:
        print("Error parsing Claude response:", e)
        return {"concept": None, "assessment": None, "score": None,
                "strengths": None, "weaknesses": None, "recommendation": None,
                "raw": raw if "raw" in locals() else None}
    

#Generating a lesson plan for students
#the next section of code will take the student assesment JSON and use that to generte a lesson plan based on students weaknessess

def generate_tailored_lesson_plan(assessments: list, topic: str, grade: int):
    system_prompt = f"""
    You are a skilled teacher preparing a lesson plan for Grade {grade} students on "{topic}".
    Use the provided student assessments (concepts, strengths, weaknesses, recommendations)
    to identify the gaps and strengths inside the students understanding. 
    Output ONLY JSON with keys:
    topic, objectives (list), activities (list), materials (list), homework (string).
    """
    response = client.messages.create(
        model="claude-3-7-sonnet-20250219",
        max_tokens=500,
        system=system_prompt,
        messages=[
            {
                "role": "user",
                "content": f"Here are student assessments: {json.dumps(assessments)}"
            }
        ]
    )

    raw = response.content[0].text
    print("RAW LESSON PLAN:", raw)

    try:
        return json.loads(raw[raw.find("{"): raw.rfind("}")+1])
    except:
        return {"topic": topic, "raw": raw}


#Parent view
def generate_parent_guidance(assessments: list, topic: str, grade: int, language: str = "English"):
    system_prompt = f"""
    You are a supportive parent teacher who is helping guardians of Grade {grade} students
    learning "{topic}". Based on the student's assessments (concepts, strengths,
    weaknesses, recommendations), generate advice for parents and update parents on students progress.

    Output ONLY JSON with keys:
    topic,
    progress_summary (string),
    at_home_strategies (list),
    conversation_starters (list),
    encouragement_tips (list).
    """

    #In the case the parent doesnt speak english add translation instructions for them
    #The default language is english unless selected otherwise
    
    if language != "en":
        system_prompt += f" Translate the final JSON output into {language}."

    response = client.messages.create(
        model="claude-3-7-sonnet-20250219",
        max_tokens=500,
        system=system_prompt,
        messages=[
            {
                "role": "user",
                "content": f"Here are student assessments: {json.dumps(assessments)}"
            }
        ]
    )

    raw = response.content[0].text
    print("RAW PARENT VIEW:", raw)

    try:
        return json.loads(raw[raw.find("{"): raw.rfind("}")+1])
    except:
        return {"topic": topic, "raw": raw}