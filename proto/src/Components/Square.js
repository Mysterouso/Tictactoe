import React from 'react'

const Square = ({position,classProp,updateBoard,myTurn,value}) => {

    const [isFilled,fillSquare] = React.useState(false)

    const makeMove = () =>{
        if(!isFilled && myTurn ){
            updateBoard(position)
            fillSquare(true)
        }
    }

    return (
        <div className={classProp} onClick={makeMove}>
            {value}
            {myTurn}
        </div>
    )
}

export default Square
