import {
    Card,
    CardHeader,
    CardTitle,
  } from "~/components/ui/card"

import { ScrollArea } from "@radix-ui/react-scroll-area"
import {RadioGroup, RadioGroupItem} from "~/components/ui/radio-group"
import { Radio } from "lucide-react"

  
function QuizCard(){
    return <div>
        <Card className="hover:">
            <div className="flex p-8 justify-center">
                <CardHeader>
                    <CardTitle>Quiz</CardTitle>
                </CardHeader>
            </div>
        </Card>
    </div>
}

function Question(){
    return <div className="p-4">
        <div className="p-4 text-black justify-left">
            <h1>Question 1</h1>
        </div>
        <RadioGroup className="text-black space-y-2">
            <div className="flex items-center space-x-2 border-b-2 border-gray-200">
                <RadioGroupItem value='1' />
                <label>Answer 1</label>
            </div>
            <div className="flex items-center space-x-2 border-b-2 border-gray-200">
                <RadioGroupItem value='2' />
                <label>Answer 1</label>
            </div>
            <div className="flex items-center space-x-2 border-b-2 border-gray-200">
                <RadioGroupItem value='3' />
                <label>Answer 1</label>
            </div>
            <div className="flex items-center space-x-2 border-b-2 border-gray-200">
                <RadioGroupItem value='4' />
                <label>Answer 1</label>
            </div>
        </RadioGroup>
    </div>
}

function Quiz(){
    return <div className="bg-white p-8 rounded-lg">
            <Question />
            <Question />
            <Question />
            <Question />
            <Question />
            <Question />
            <Question />
            <Question />
            <Question />
    </div>
}

export default Quiz