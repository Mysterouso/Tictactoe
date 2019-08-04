import React from 'react'
import Square from './Square'
import {makeStyles} from '@material-ui/core'
import { UserCTX } from '../Context&Reducers/Store';
import { gameReducer,initialState } from '../Context&Reducers/GameReducer';


const Game = ({turn}) => {

    const [globalUser,_,socket] = React.useContext(UserCTX)
    const [myTurn, updateTurn] = turn
    const [gameState,dispatch] = React.useReducer(gameReducer,initialState)

    const checkWinCondition = React.useCallback((counter) =>{
        if(gameState.gameOver) return

        const updateGameOverState = (winningSign) =>{
            let winner = winningSign === "X" ? "You" : globalUser.opponent
            if(winningSign === "") winner = ""
            dispatch({type:"UPDATE_GAME_OVER",payload:winner})
            updateTurn(false)
        }
        
        const {boardState,gameOver} = gameState
        
        for(let i=0; i < 3; i++){
            if(boardState[0][i] && boardState[0][i] === boardState[1][i] && boardState[1][i] === boardState[2][i]){
               updateGameOverState(boardState[0][i])
            }
            else if(boardState[i][0] && boardState[i][0] === boardState[i][1] && boardState[i][1] === boardState[i][2]){
                   updateGameOverState(boardState[i][0])
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
    },[gameState.boardState,gameState.gameOver,updateTurn,dispatch])

    const updateBoard = React.useCallback((position,sign="X") => {
        dispatch({type:"UPDATE_BOARD",payload:{position,sign}})
        updateTurn(currentTurn=>{console.log("the current turn was ",currentTurn); return !currentTurn})
    },[dispatch,updateTurn])

    const playerUpdateBoard = (position) =>{
        updateBoard(position)
        socket.emit("player-moved",{roomID:globalUser.roomID,position})
    }

    React.useEffect(()=>{
        // updateTurn(true)
        socket.emit("players-ready")
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])

    React.useEffect(()=>{
        socket.on("opponent-moved",({position})=>{
            updateBoard(position,"O")
        })
        return () => socket.off("opponent-moved")
    },[socket,updateBoard,gameState.boardState])

    React.useEffect(()=>{
        console.log("updating ", gameState.winCounter)
        if(gameState.winCounter>=5){
            checkWinCondition(gameState.winCounter)
        }
    },[gameState.winCounter,checkWinCondition])

    const classes = useStyles()

    return (
        <>
        <button onClick={()=>console.log("turn " + myTurn,"game state ",gameState.boardState,"checking counter ",gameState.winCounter)}/>
        <div className={classes.container}>
          {     
             gameState.boardState.map((row,Xindex)=>{
                return row.map((item,Yindex)=>{
                    return <Square key={Xindex+""+Yindex} 
                                   updateBoard={playerUpdateBoard}
                                   myTurn={myTurn}
                                   classProp={classes.square} 
                                   position={[Xindex,Yindex]}
                                   value={item}
                                   />
                })
              })
          }
        </div>
        </>
    )
}

const useStyles = makeStyles(theme=>({
    container:{
        margin: "50px auto 0px",
        backgroundColor:"white",
        width:"60%",
        display:"grid",
        gridTemplateColumns: "repeat(3,1fr)",
        gridTemplateRows: "repeat(3,1fr)"
    },
    square:{
        boxSizing:"content-box",
        height:200,
        borderBottom: "2px solid black",
        borderRight: "2px solid black",
        "&:nth-child(3n)":{
            borderRight:0
        },
        "&:nth-child(n+7)":{
            borderBottom:0
        }
        
    }
}))

export default Game
