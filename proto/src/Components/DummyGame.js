import React from 'react'
import Square from './Square'
import {makeStyles} from '@material-ui/core'
import { UserCTX } from '../Context/Store';

const initialState = {
    winCounter:0,
    gameOver:false,
    winningPlayer:"",
    boardState:Array(3).fill(Array(3).fill([]))
}

const gameReducer = (state,action) => {
    switch(action.type){
        case "UPDATE_COUNTER":
            return{
                ...state,
                winCounter: state.winCounter + 1
            }
        case "UPDATE_BOARD":
            const {position,sign="X"} = action.payload
            const [x,y] = position
            const newState = JSON.parse(JSON.stringify(state.boardState))
            newState[x][y] = sign
            return{
                ...state,
                boardState:newState
            }
        case "UPDATE_GAME_OVER":
            return{
                ...state,
                gameOver:true,
                winningPlayer:action.payload
            }
        default:
            return state
    }
}

const Game = ({turn}) => {

    const [globalUser,_,socket] = React.useContext(UserCTX)

    const [myTurn, updateTurn] = turn

    // const [gameState,updateGameState] = React.useState([[]])

    // const [checkWinCounter,updateCounter] = React.useState(0)

    // const [isOver,gameOver] =  React.useState({
    //                                 gameOver:false,
    //                                 winningPlayer:""
    //                             })
    const [gameState,dispatch] = React.useReducer(gameReducer,initialState)

    React.useEffect(()=>{
        // let initialState = []
        // for(let x = 0; x < 3; x++){
        //     initialState.push([])
        //     for(let y = 0; y < 3; y++){
        //         initialState[x].push('')
        //     }
        // }
        updateTurn(true)

        socket.emit("players-ready")

    },[])

    React.useEffect(()=>{
        socket.on("opponent-moved",({position})=>{
            console.log("It went through")
            updateBoard(position,"O")
        })
        return () => socket.off("opponent-moved")
    },[socket,gameState.boardState])

    React.useEffect(()=>{

        console.log("updating ", checkWinCounter)

        if(checkWinCounter>=5){
            checkWinCondition()
        }

    },[checkWinCounter])

    const checkWinCondition = () =>{

        if(isOver.gameOver) return

        const updateGameOverState = (winningSign) =>{
            const winner = winningSign === "X" ? "You" : globalUser.opponent
            gameOver({
                gameOver:true,
                winningPlayer: winner
            })
            updateTurn(false)
        }
        //Checking for all horizontal and vertical win conditions
        for(let i=0; i < 3; i++){
            if(gameState[0][i] === gameState[1][i] && gameState[1][i] === gameState[2][i]){
               updateGameOverState(gameState[0][i])
            }
            else if(gameState[i][0] === gameState[i][1] && gameState[i][1] === gameState[i][2]){
                   updateGameOverState(gameState[i][0])
                }
        }
        //Checking for diagonals
        if(gameState[0][0] === gameState[1][1] && gameState[1][1] === gameState[2][2]){
            updateGameOverState(gameState[0][0])   
        }
        else if(gameState[2][0] === gameState[1][1] && gameState[1][1] === gameState[0][2]){
            updateGameOverState(gameState[2][0])
        }
    }

    const updateBoard = (position,sign="X") =>{
        const [x,y] = position
        const newState = JSON.parse(JSON.stringify(gameState))
        newState[x][y] = sign
        updateGameState(newState)
        updateCounter(checkWinCounter + 1)
        updateTurn(!myTurn)
    }

    const playerUpdateBoard = (position) =>{
        if(!myTurn) return
        updateBoard(position)
        socket.emit("player-moved",{roomID:globalUser.roomID,position})
    }

    const classes = useStyles()

    return (
        <>
        <button onClick={()=>console.log("turn " + myTurn,"game state ",gameState,"checking counter ",checkWinCounter)}/>
        <div className={classes.container}>
          {     
             gameState.map((row,Xindex)=>{
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
