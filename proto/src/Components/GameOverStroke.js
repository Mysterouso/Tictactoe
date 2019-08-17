import React from 'react'

const calcCardinalStyles = (direction,position) =>{

    const determineDist = (direction,position) =>{
        if(direction ==="row") return position[0]
        else if(direction ==="column") return position[1]
    }

    const sepFactor = (100/3)

    const distanceFromEdge = (sepFactor/2 + determineDist(direction,position) * sepFactor) + "%"
    const length = "90%"
    const thickness = "12px"
    const transform = direction === "row" ? "translateX(-50%)" : "translateY(-50%)"
    
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
    if(position === [0,0]) rotationAngle = 45
    else rotationAngle = -45
    
    baseStyles.transform = `${baseStyles.transform} rotate(${rotationAngle}deg)`
    baseStyles.width = "115%"

    return baseStyles
}

const GameOverStroke = ({ winPosition }) => {

    const {direction,position} = winPosition

    const fnToUse = (direction,position) =>{
        if(direction==="row" || direction ==="column") return calcCardinalStyles(direction,position)
        else return handleDiagonalTrans(direction,position)
    } 

    const strokeStyles = {
        position:"absolute",
        borderRadius:"999px",
        backgroundColor:"red",
        ...fnToUse(direction,position)
    }

    return (
        <div style={strokeStyles}>
            
        </div>
    )
}

export default GameOverStroke
