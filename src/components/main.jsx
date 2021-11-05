import '../assets/main.scss'
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { useEffect, useRef, useState } from 'react';
import axios from 'axios';

function Main (){
    const categorySelector = useRef(null)
    const categoryName = useRef(null)
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

    

    const selectorClickFunc = () => {
        categorySelector.current.classList.toggle("categorySelectorOptionsActive")
        setSelectroActiveClass(selectroActiveClass==""?"categorySelectorActive":selectedCategory>=0?"categorySelectorActive":"")
        setArrowClass(!arrowClass.includes("iconRotated")?"iconRotated iconBlack":selectedCategory>=0?"iconBlack":"")
    }


    return <div className="main">
        
        <h2>Trivia App</h2>
        <div className="questionType"></div>
        <p className="categoryTitle">Pick a Category</p>
        <div className="categorySelectorPart">
            <div className={"categorySelector " + selectroActiveClass} onClick={selectorClickFunc}>
                <p ref={categoryName}>{selectedCategory<0?"Category":categories[selectedCategory].name}</p>
                <ArrowBackIosNewIcon className={"icon " + arrowClass}/>
            </div>
            <div className="categorySelectorOptions" ref={categorySelector}>
                {console.log(categories)}
                {categories.map((elem, index) => {
                    return <div key={index} onClick={() => {setCategory(index)}} className="option">
                        <p>{elem.name}</p>
                    </div>
                })}
            </div>
        </div>
        <div className={"start " + startClass}>
            <p>Start</p>
        </div>
    </div>
}

export default Main;