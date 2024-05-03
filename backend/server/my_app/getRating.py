import google.generativeai as genai



def getRating(prompt):
    genai.configure(api_key="AIzaSyDo0JglKnL7Nv_nyzQsD5moxUwEOD93sM8")
    model = genai.GenerativeModel('gemini-pro')
    chat = model.start_chat(history=[])
    chat.send_message(prompt)
    return chat.last.text