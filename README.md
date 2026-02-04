# devops-quiz-app 



## Features
- Topic selection dropdown
- Shows one question at a time
- Answer checking with instant feedback
- Shows explanation after answering

## Question Format
Questions are stored in `data/questions.json`.

Each question follows this structure:

- `id`: Unique question identifier (e.g., "Q1")
- `topic`: DevOps topic category
- `question`: The question text
- `options`: Array of answer options (strings)
- `answerIndex`: Correct option index (0-based)
- `explanation`: Explanation shown after answering

Example:
```json
{
  "id": "Q1",
  "topic": "Continuous Integration",
  "question": "What is the primary goal of Continuous Integration?",
  "options": [
    "Automatically deploy to production",
    "Frequently integrate code changes into a shared repository",
    "Eliminate the need for testing",
    "Remove the need for branches"
  ],
  "answerIndex": 1,
  "explanation": "Continuous Integration aims to detect integration issues early."
}
