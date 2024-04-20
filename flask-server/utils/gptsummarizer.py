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

def formatText(text):
    messages = [{"role": "system", "content": "You are an assistant who summarizes and details the important bits of different files. You will be given the text from a powerpoint. You don't need to summarize every slide. Just mention the important bits and what slides they are on. Output your response in html format. Ex: <div> <h1>Summary of Document </h1> <p>example text</p> </div>"}]
    messages.append(formatFile(text))
    return messages

