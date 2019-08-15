import React from 'react'

const checkWinCondition = React.useCallback((counter,gameState,dispatch) =>{

    if(gameState.gameOver) return

    const updateGameOverState = (winningSign) =>{
        let winner = winningSign === "X" ? "You" : opponent
        if(winningSign === "") winner = ""
        dispatch({type:"UPDATE_GAME_OVER",payload:winner})
    }
    
    const {boardState,gameOver} = gameState
    
    for(let i=0; i < 3; i++){
        if(boardState[0][i] && boardState[0][i] === boardState[1][i] && boardState[1][i] === boardState[2][i]){
           updateGameOverState(boardState[0][i]) 
           break;
        }
        else if(boardState[i][0] && boardState[i][0] === boardState[i][1] && boardState[i][1] === boardState[i][2]){
               updateGameOverState(boardState[i][0])
               break;
            }
    }

    if(boardState[0][0] && boardState[0][0] === boardState[1][1] && boardState[1][1] === boardState[2][2]){
        updateGameOverState(boardState[0][0])   
    }
    else if(boardState[2][0] && boardState[2][0] === boardState[1][1] && boardState[1][1] === boardState[0][2]){
        updateGameOverState(boardState[2][0])
    }

    if(counter === 9 && !gameOver) updateGameOverState("")
// eslint-disable-next-line react-hooks/exhaustive-deps
},[gameState.boardState,gameState.gameOver,dispatch])

export default checkWinCondition