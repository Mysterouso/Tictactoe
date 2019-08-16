import React from 'react'

const Square = ({position,classProp,updateBoard,myTurn,value}) => {
    // const counter = React.useRef(0)
    // console.log("I rerendered ", position, ++counter.current)
    // console.log("also the value is ",value)

    const [isFilled,fillSquare] = React.useState(false)

    const makeMove = () =>{
        if(value) return

        if(!isFilled && myTurn){
            updateBoard(position)
            fillSquare(true)
        }
    }

    return (
        <div className={classProp} onClick={makeMove}>
            {/* {value} */}
            X
        </div>
    )
}

export default Square
