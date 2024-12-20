import google.generativeai as genai
from instance.config import Config
import json

class ResponseGenerator():
    """Handles generating all responses and uploading files"""

    def __init__(self):
        genai.configure(api_key=Config.GEMINI_API_KEY)
        # Used for most text things
        self.model = genai.GenerativeModel("gemini-1.5-flash")
    
    def upload_file(file) -> str:
        """Uploads file to Gemini system
        
        Args:
            file (File): File to upload.

        Returns:
            str: Filename of file in gemini system

        Raises:
            PermissionDenied: Raised if invalid file_id selected
        """

        return genai.upload_file(file).name

    def generate_summary(self, file_id: str) -> str:
        """Generates summary of a file
        
        Raises:
            PermissionDenied: Raised if invalid file_id selected
        """

        prompt = """Give me a summary of this pdf file. Be concise."""
        file = genai.get_file(file_id)
        return self.model.generate_content([
            prompt,
            file
        ])

    def get_answer(self, question: str, file_id: str) -> str:
        """Answers question about file"""

        system_instructions = ( 
            "You are an expert. Provide clear, concise answers based on the provided context. " 
            "If the information is not found in the context, state that the answer is unavailable. " 
            "Use a maximum of three sentences."
        )
        prompt = f"{system_instructions}\n\n{question}"
        file = genai.get_file(file_id)
        return self.model.generate_content([
            [prompt, file]
        ])

    def generate_quiz(self, file_id: str) -> str:
        """Generates a quiz from a file
        
        Raises:
            json.JSONDecodeError: Raised if gemini returns an invalid response
            PermissionDenied: Raised if invalid file_id selected
        """

        prompt = """
            I have uploaded a file. Based on the content of the file, generate a set of multiple-choice questions in JSON format. 
            For each question, include the following:

            1. "question": The text of the question.
            2. "options": A list of possible answers.
            3. "correct_answer": The correct option from the list of answers.
            4. "explanations": A dictionary where each key is an option and each value is an explanation of why that option is correct or incorrect.

            The JSON structure should look like this:

            {
            "quiz": [
                {
                "question": "What is the primary topic discussed in the document?",
                "options": ["Option A", "Option B", "Option C", "Option D"],
                "correct_answer": "Option B",
                "explanations": {
                    "Option A": "Explanation why this is incorrect.",
                    "Option B": "Explanation why this is correct.",
                    "Option C": "Explanation why this is incorrect.",
                    "Option D": "Explanation why this is incorrect."
                }
                },
                ...
            ]
            }

            Generate at least 10 questions. Make sure the questions cover different parts of the document. 
            The correct answers and explanations should be accurate and well-justified based on the file's content.
        """

        file = genai.get_file(file_id)
        gemini_response = self.model.generate_content([
            prompt, file
        ])

        quiz_data = json.loads(gemini_response) # Raises JSONDecodeError if invalid input
        return quiz_data