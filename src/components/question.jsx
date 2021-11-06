import { useEffect, useState } from 'react'
import '../assets/question.scss'

function Question(attrs){
    var question = attrs.question
    const [answersArray, setAnswersArray] = useState([])

    useEffect(() => {
        const AllAnswers = Array.from(question.inCorrectAnswers.concat(question.correctAnswer))
        for (let i = 0; i < AllAnswers.length; i++) {
            const j = Math.floor(Math.random() * ((AllAnswers.length-1) - 0)) + 0;
            const temp = AllAnswers[i];
            AllAnswers[i]=AllAnswers[j]
            AllAnswers[j]=temp
        }
        setAnswersArray(AllAnswers)
    }, [])

    const answerQuest = (answer) => {
        const currentPoint = attrs.currentScore.currentPoint
        var changedState = attrs.currentScore
        changedState.currentPoint = currentPoint + 1;
        changedState.questions[currentPoint].checkedAnswer = answer
        changedState.questions[currentPoint].correct = answer==changedState.questions[currentPoint].correctAnswer
        attrs.updateFunc(changedState)
    }

    
    

    return <div className="question">

        <div className={"questionType " + question.difficulty + "Type"}>
            <p>{question.difficulty}</p>
        </div>
        
        <p className="questionName">{question.question}</p>

        <div className="versions">
            {answersArray.map((elem) => {
                return <div className="version" onClick={() => {answerQuest(elem)}}>
                    <p>{elem}</p>
                </div>
            })}
        </div>
    </div>

}

export default Question;