from openai import OpenAI
import configparser
import os

config = configparser.RawConfigParser()
thisfolder = os.path.dirname(os.path.abspath(__file__))
initfile = os.path.join(thisfolder, 'config.ini')

res = config.read(initfile)

api_key = config.get('Key', 'OPENAI_API_KEY')

async def generate_summary(text):
    global api_key
    aiClient = OpenAI(api_key=api_key)
    messages = [{"role": "system", "content": "You are an assistant who summarizes and details the important bits of different files. You will be given the text from a powerpoint or pdf. You don't need to summarize every slide. Just mention the important bits and what slides they are on. Output your response in html format. Ex: <div> <h1>Summary of Document </h1> <p>example text</p> </div>"}]
    messages = formatText(messages, text)
    try:
        response = aiClient.chat.completions.create(
            model="gpt-3.5-turbo",
            messages = messages
        )
        return response.choices[0].message.content
    except Exception as e:
        print(f"Error generating response: {e}")

async def generate_questions(text):
    global api_key
    aiClient = OpenAI(api_key=api_key)
    messages = [{"role": "system", "content": "You are an assistant who generates questions based off of the provided text. You will be given the text from a powerpoint or pdf. Generate a list of questions in json format."}]
    messages = formatText(text)
    try:
        response = aiClient.chat.completions.create(
            model="gpt-3.5-turbo",
            messages = messages
        )
        return response.choices[0].message.content
    except Exception as e:
        print(f"Error generating response: {e}")

def formatFile(text):
    return {"role": "user", "content": text}

def formatText(messages, text):
    return messages.append(formatFile(text))

