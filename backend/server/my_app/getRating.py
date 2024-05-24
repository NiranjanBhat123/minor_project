import google.generativeai as genai
import os
from dotenv import load_dotenv #type:ignore


# Access the API key
API_KEY = os.getenv('API_KEY')

def getRating(prompt):
    load_dotenv()
    API_KEY = os.getenv('API_KEY')
    genai.configure(api_key=API_KEY)
    model = genai.GenerativeModel('gemini-pro')
    chat = model.start_chat(history=[])
    chat.send_message(prompt)
    return chat.last.text