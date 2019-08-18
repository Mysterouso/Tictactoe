import React from 'react'

const calcCardinalStyles = (direction,position) =>{

    const determineDist = (direction,position) =>{
        if(direction ==="row") return position[0]
        else if(direction ==="column") return position[1]
    }

    const sepFactor = (100/3)

    const distanceFromEdge = (sepFactor/2 + determineDist(direction,position) * sepFactor) + "%"
    const length = "90%"
    const thickness = "16px"
    const transform = direction === "row" ? "translateY(-50%)" : "translateX(-50%)"
    
    if(direction === "row"){
        return ({ 
                top:distanceFromEdge,
                 left:"5%",
                 width:length,
                 height:thickness,
                 transform
                })
    }
    else{ 
        return ({
                left:distanceFromEdge,
                top:"5%",
                width:thickness,
                height:length,
                transform
                })
    }
}

const handleDiagonalTrans = (direction,position) =>{
    const baseStyles = calcCardinalStyles("row",position)
    let rotationAngle; 
    let rotationStyles;
    console.log("position is ", position)
    console.log(position === [0,0])
    if(position[1] === 0){
        rotationAngle = 45
        rotationStyles = {
                        transformOrigin:"left",
                        left:"5%",
                        right:""
        }
    }
    else{ 
        rotationAngle = -45
        rotationStyles = {
                        transformOrigin:"right",
                        right:"5%",
                        left:"",
        }
    }
    
    baseStyles.transform = `${baseStyles.transform} rotate(${rotationAngle}deg)`
    baseStyles.top = "5%"
    baseStyles.width = "128%"

    return {...baseStyles,...rotationStyles}
}

const GameOverStroke = ({ winPosition }) => {

    const {direction,position} = winPosition

    if(direction === "") return <div></div>

    const fnToUse = (direction,position) =>{
        if(direction==="row" || direction ==="column") return calcCardinalStyles(direction,position)
        else return handleDiagonalTrans(direction,position)
    } 

    const animationName = direction === "diagonal" ? "diagonalExpand" : "expand"

    const strokeStyles = {
        position:"absolute",
        borderRadius:"999px",
        backgroundColor:"red",
        animation:`${animationName} 0.4s ease-in-out`,
        ...fnToUse(direction,position)
    }

    return (
        <div style={strokeStyles}></div>
    )
}

export default GameOverStroke
