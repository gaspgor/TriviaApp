import '../assets/main.scss'
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { useEffect, useRef, useState } from 'react';
import axios from 'axios';

function Main (){
    const categorySelector = useRef(null)
    const categoryName = useRef(null)
    const [score, setScore] = useState(localStorage.getItem("score"))
    const [currentScore, setCUrrentScore] = useState(JSON.parse(localStorage.getItem("currentScore")?localStorage.getItem("currentScore"):"{}"))
    const [categories, setCategories] = useState([])
    const [selectedCategory, setCategory] = useState(-1)
    const [selectroActiveClass, setSelectroActiveClass] = useState("")
    const [arrowClass, setArrowClass] = useState("")
    const [startClass, setStartClass] = useState("")
    // https://opentdb.com/api_category.php

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
        sessionStorage.setItem("currentScore", currentScore)
    }, [currentScore])

    

    const selectorClickFunc = () => {
        categorySelector.current.classList.toggle("categorySelectorOptionsActive")
        setSelectroActiveClass(selectroActiveClass==""?"categorySelectorActive":selectedCategory>=0?"categorySelectorActive":"")
        setArrowClass(!arrowClass.includes("iconRotated")?"iconRotated iconBlack":selectedCategory>=0?"iconBlack":"")
    }

    const startTrivia = () => {
        if(selectedCategory>=0){
            console.log(categories[selectedCategory])
            axios.get("https://opentdb.com/api.php?amount=10&category=" + categories[selectedCategory].id)
                .then((response) => {
                    console.log(response.data)
                    setCUrrentScore({
                        points: 0,
                        complated: false,
                        currentPoint: 0,
                        questions: response.data.results.map((elem, index) => {
                            // correct_answer         difficulty         type       incorrect_answers
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


    return <div className="main">
        
        <h2>Trivia App</h2>
        <div className="questionType"></div>
        <div className={sessionStorage.getItem("score")?"scorePart":"scorePart hideScorePart"}>
            <p className="scoreTitle">Score</p>
            <div className="scoreTable">
                {/* <div className="horizontal"></div>
                <div className="vertical"></div> */}
                <div className="item headerPart">
                    <p className="score">Score</p>
                    <p className="date">Date</p>
                </div>
                <div className="item">
                    <p className="score">5 / 10</p>
                    <p className="date">2021/11/13 14:05:03</p>
                </div>
                <div className="item">
                    <p className="score">5 / 10</p>
                    <p className="date">2021/11/13 14:05:03</p>
                </div>
            </div>
        </div>
        <p className={sessionStorage.getItem("score")?"categoryTitle categoryTitleWithScore":"categoryTitle"}>Pick a Category</p>
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
    </div>
}

export default Main;