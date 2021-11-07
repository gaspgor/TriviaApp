import { createElement, useCallback, useEffect, useState } from 'react'
import '../assets/question.scss'

function Question({updateFunc, currentScore}){
    const [questionState, setQuestionState] = useState(currentScore.questions[currentScore.currentPoint])
    

    const returnAnswersRandomArray = () => {
        const AllAnswers = Array.from(questionState.inCorrectAnswers.concat(questionState.correctAnswer))
        for (let i = 0; i < AllAnswers.length; i++) {
            const j = Math.floor(Math.random() * ((AllAnswers.length-1) - 0)) + 0;
            const temp = AllAnswers[i];
            AllAnswers[i]=AllAnswers[j]
            AllAnswers[j]=temp
        }
        setAnswersArray(AllAnswers);
    }

    const [answersArray, setAnswersArray] = useState([])

    useEffect(() => {
        console.log(questionState)
        setQuestionState(currentScore.questions[currentScore.currentPoint])
    }, [currentScore])

    useEffect(() => {
        returnAnswersRandomArray()
    }, [questionState])

    

    const answerQuest = (answer) => {
        const currentPoint = currentScore.currentPoint
        var changedState = currentScore
        changedState.questions[currentPoint].checkedAnswer = answer
        changedState.questions[currentPoint].correct = answer==changedState.questions[currentPoint].correctAnswer
        changedState.questions[currentPoint].randomedAnswers = Array.from(answersArray )
        changedState.points += answer==changedState.questions[currentPoint].correctAnswer?1:0
        if(currentPoint != currentScore.questions.length-1){            
            changedState.currentPoint = currentPoint + 1;
        }else{
            var today = new Date();
            var date = today.getFullYear()+'/'+(today.getMonth()+1)+'/'+today.getDate() + " " + today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
            changedState.finished = true
            changedState.endDate = date
        }

        updateFunc({...currentScore, changedState})

    }
    

    
    

    return <div className="question">

        <div className={"questionType " + questionState.difficulty + "Type"}>
            <p>{questionState.difficulty}</p>
        </div>
        
        <p className="questionName">{questionState.question}</p>

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