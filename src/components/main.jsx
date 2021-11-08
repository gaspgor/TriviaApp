import '../assets/main.scss'
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import CloseIcon from '@mui/icons-material/Close';
import CheckIcon from '@mui/icons-material/Check';
import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import Question from './question';

function Main (){
    const scroreInfoPart = useRef(null)
    const categorySelector = useRef(null)
    const categoryName = useRef(null)
    const [score, setScore] = useState(JSON.parse(sessionStorage.getItem("score")?sessionStorage.getItem("score"):"[]"))
    const [currentScore, setCUrrentScore] = useState(JSON.parse(sessionStorage.getItem("currentScore")?sessionStorage.getItem("currentScore"):"{}"))
    const [selectedScore, setSelectedScore] = useState({})
    const [categories, setCategories] = useState([])
    const [selectedCategory, setCategory] = useState(-1)
    const [selectroActiveClass, setSelectroActiveClass] = useState("")
    const [arrowClass, setArrowClass] = useState("")
    const [startClass, setStartClass] = useState("")

    useEffect(() => {
        axios.get("https://opentdb.com/api_category.php")
            .then((response) => {
                if(response.data.trivia_categories){
                    setCategories(response.data.trivia_categories)
                }else{
                    alert("Error")
                }
            })
            .catch((error) => {
                console.log(error)
                alert("Error")
            })
    }, [])
 


    useEffect(() => {
        if(selectedCategory>=0){
            selectorClickFunc()
            setStartClass("startActive")
        }
    }, [selectedCategory])

    useEffect(() => {
        if(currentScore.finished){
            // sessionStorage.setItem("currentScore", JSON.stringify(currentScore))
            setScore([...score, currentScore])
            sessionStorage.setItem("currentScore", JSON.stringify({}))
        }else{
            sessionStorage.setItem("currentScore", JSON.stringify(currentScore))
        }
    }, [currentScore])

    useEffect(() => {
        sessionStorage.setItem("score", JSON.stringify(score))
    }, [score])

    

    const selectorClickFunc = () => {
        categorySelector.current.classList.toggle("categorySelectorOptionsActive")
        setSelectroActiveClass(selectroActiveClass==""?"categorySelectorActive":selectedCategory>=0?"categorySelectorActive":"")
        setArrowClass(!arrowClass.includes("iconRotated")?"iconRotated iconBlack":selectedCategory>=0?"iconBlack":"")
    }

    const startTrivia = () => {
        if(selectedCategory>=0){
            axios.get("https://opentdb.com/api.php?amount=10&category=" + categories[selectedCategory].id)
                .then((response) => {
                    var today = new Date();
                    var date = today.getFullYear()+'/'+(today.getMonth()+1)+'/'+today.getDate() + " " + today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();

                    setCUrrentScore({
                        points: 0,
                        started: true,
                        finished: false,
                        currentPoint: 0,
                        startDate: date,
                        endDate: "",
                        questions: response.data.results.map((elem, index) => {
                            return {
                                question: elem.question,
                                correctAnswer: elem.correct_answer,
                                inCorrectAnswers: elem.incorrect_answers,
                                difficulty: elem.difficulty,
                                type: elem.type,
                                checkedAnswer: "",
                                correct: false
                            }
                        }),
                        category: categories[selectedCategory].name,
                        categoryId: categories[selectedCategory].id
                    })
                })
                .catch((error) => {
                    console.log(error)
                })
        }
    }

    const scorePartVisisibility = (show) => {
        if(show){
            scroreInfoPart.current.classList.add("showScoreInfoPart")
        }else{
            scroreInfoPart.current.classList.remove("showScoreInfoPart")
        }
    }

    useEffect(() => {
        
        if(selectedScore.finished){
            scorePartVisisibility(true)
        }else{
            scorePartVisisibility(false)
        }
    }, [selectedScore])


    return <div className="main">
        
        <h2>{currentScore.started?!currentScore.finished?"Question " + (currentScore.currentPoint + 1):"Thank You":"Trivia App"}</h2>
        {currentScore.started?!currentScore.finished?<Question updateFunc={setCUrrentScore} currentScore={currentScore} />:<div className="startPart">
            <p className="categoryTitle">{"Your Score: " + currentScore.points + " / 10"}</p>
            <div className={"start startActive"} onClick={() => {window.location.reload()}}>
                <p>Back to home</p>
            </div>
        </div>:<div className="startPart">
            <div className={score.length>0?"scorePart":"scorePart hideScorePart"}>
                <p className="scoreTitle">Score</p>
                <div className="scoreTable">
                    <div className="item headerPart">
                        <p className="score">Score</p>
                        <p className="date">Date</p>
                    </div>
                    <div className={"scoreContent"}>
                        {score.map((elem, index) => {
                            elem.selectedQuestion = -1
                            return <div key={index} className="item" onClick={() => setSelectedScore(elem)}>
                                <p className="score">{elem.points + " / 10"}</p>
                                <p className="date">{elem.endDate}</p>
                            </div>
                        })}
                    </div>
                </div>
            </div>
            <div ref={scroreInfoPart} className="scoreInfoPart">
                <div className="scoreInfoContent">
                    <div className={"questionInfo " + (selectedScore.selectedQuestion>=0?"showQuestionInfo":"")} onClick={(e) => {if(e.target.className.includes("showQuestionInfo")){setSelectedScore({...selectedScore, selectedQuestion: -1})}}}>
                        {selectedScore.selectedQuestion>=0?<div className={"questionInfoContent " + (selectedScore.questions[selectedScore.selectedQuestion].correct?"correct":"incorrect")}>
                            
                            <p className="question">{(selectedScore.selectedQuestion+1) + ". " + selectedScore.questions[selectedScore.selectedQuestion].question}</p>
                            <div className="answers">
                                {selectedScore.questions[selectedScore.selectedQuestion].randomedAnswers.map((elem, index) => {
                                    return <div key={index} className="answer">
                                        {elem==selectedScore.questions[selectedScore.selectedQuestion].correctAnswer?<CheckIcon className="icon correctIcon"/>:elem==selectedScore.questions[selectedScore.selectedQuestion].checkedAnswer?<CloseIcon className="icon incorrectIcon"/>:""}
                                        
                                        
                                        <p>{(index+1) + ") " + elem}</p>
                                    </div>
                                })}

                            </div>
                        </div>:""}
                        
                    </div>
                    <CloseIcon className="scoreInfoCloseIcon" onClick={() => setSelectedScore({})} />
                    <p className="categoryName">{selectedScore.category}</p>
                    <p className="date">{selectedScore.endDate}</p>
                    <div className="ScoreInfo">
                        <div className="scoreMarks">
                            <div className="markPart correctMark">
                                <div className="mark"></div>
                                <p>Correct</p>
                            </div>
                            <div className="markPart inCorrectMark">
                                <div className="mark"></div>
                                <p>Incorrect</p>
                            </div>
                        </div>
                        <p className="score">{selectedScore.points + " / 10"}</p>
                    </div>
                    <div className="questions">
                        {selectedScore.questions?selectedScore.questions.map((elem, index) => {
                            return <div key={index} className={"question " + (elem.correct==true?"correct":"incorrect")} onClick={() => {setSelectedScore({...selectedScore, selectedQuestion: index})}}>
                                <p> {index+1}.  {elem.question.toString().substring(0, 25)}{elem.question.length>20?"...":""}</p>
                            </div>
                        }):""}
                    </div>
                </div>
            </div>
            <p className={score.length>0?"categoryTitle categoryTitleWithScore":"categoryTitle"}>Pick a Category</p>
            <div className="categorySelectorPart">
                <div className={"categorySelector " + selectroActiveClass} onClick={selectorClickFunc}>
                    <p ref={categoryName}>{selectedCategory<0?"Category":categories[selectedCategory].name}</p>
                    <ArrowBackIosNewIcon className={"icon " + arrowClass}/>
                </div>
                <div className="categorySelectorOptions" ref={categorySelector}>
                    {categories.map((elem, index) => {
                        return <div key={index} onClick={() => {setCategory(index)}} className="option">
                            <p>{elem.name}</p>
                        </div>
                    })}
                </div>
            </div>
            <div className={"start " + startClass} onClick={startTrivia}>
                <p>Start</p>
            </div>
        </div>}
        
    </div>
}

export default Main;