import React, {useState, useEffect} from "react"
import {RadioGroup, RadioGroupItem} from "~/components/ui/radio-group"
import {Button} from "~/components/ui/button"



interface QuestionInfo {
    question: string;
    options: string[];
    correctAnswer: number;
    explanations: string[];
}

interface QuestionProps {
    id: number,
    q: QuestionInfo,
    onAnswer: (id: number, choice: number) => void
}

const Question = (question: QuestionProps) => {

    const info = question.q

    const handleValueChange = (value: string) => {
        question.onAnswer(question.id, parseInt(value, 10));
    }

    return (
        <div>
            <h1>{info.question}</h1>
            <RadioGroup onValueChange={handleValueChange}>
               { info.options.map((option, index) => (
                    <RadioGroupItem value={index.toString()} key={index}>
                        {option}
                    </RadioGroupItem>
                ))}
            </RadioGroup>
        </div>
    )
}   

const Quiz = () => {

    const questions: QuestionInfo[] = [
        {
            question: 'Sample question',
            options: [
                'Option 1',
                'Option 2',
                'Option 3',
                'Option 4'
            ],
            correctAnswer: 0,
            explanations: [
                "Explanation for option 1",
                "Explanation for option 2",
                "Explanation for option 3",
                "Explanation for option 4"
            ]
        }
    ];


    // Quiz Component - Keeps track of answers, etc
    // Question - displays questions and correct answer + explanation when needed

    const handleAnswer = (questionId: number, choice: number) => {
        console.log(`Question ${questionId} answered with choice ${choice}`)
    }

    const onSubmit = () => {
        console.log("Submitting quiz")
    }

    return (
        <div className="flex flex-col bg-white text-black">
            {questions.map((q, index) => (
                <Question
                    key={index}
                    id = {index}
                    q = {q}
                    onAnswer = {handleAnswer}
                />
            ))}
            <Button onClick={onSubmit}>Submit</Button>
        </div>
    )

}

export default Quiz