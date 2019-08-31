import React from 'react'

const Square = ({position,classProp,updateBoard,myTurn,value,rematchState}) => {
    // const counter = React.useRef(0)
    // console.log("I rerendered ", position, ++counter.current)
    // console.log("also the value is ",value)

    rematchState = rematchState[0]

    const [isFilled,fillSquare] = React.useState(false)

    React.useEffect(()=>{
        if(rematchState) fillSquare(false)
    },[rematchState])

    const makeMove = () =>{
        if(value) return

        if(!isFilled && myTurn){
            updateBoard(position)
            fillSquare(true)
        }
    }

    return (
        <div className={classProp} onClick={makeMove}>
            {value}
            {/* X */}
        </div>
    )
}

export default Square
