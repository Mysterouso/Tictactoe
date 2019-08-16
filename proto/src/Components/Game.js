import React from 'react'
import Square from './Square'
import GameOverModal from './GameOverModal'
import RematchModal from './RematchModal'
import useLoadingButton from './UseLoadingButton'
import {Paper,AppBar,Button,makeStyles} from '@material-ui/core'
import { UserCTX } from '../Context&Reducers/Store';
import { GameCTX } from '../Context&Reducers/GameStore';


const Game = () => {

    const [{roomID,opponent},_,socket] = React.useContext(UserCTX)
    const [gameState,dispatch] = React.useContext(GameCTX)
    
    //Modal Logic//

    const [open, setOpen] = React.useState(true)
    const [isRematchModal,updateModal] = React.useState(true)
    const handleRematchRequest = (res) =>{
        if(!open) setOpen(true)
        updateModal(true)
    }
    
    const [loading,updateLoading] = useLoadingButton({socket,
                                                      socketEvent:"rematch-requested",
                                                      socketFn:handleRematchRequest
                                                    })
    //       //                                                    

    const checkWinCondition = React.useCallback((counter) =>{

        if(gameState.gameOver) return

        const updateGameOverState = (winningSign) =>{
            let winner = winningSign === "X" ? "You" : opponent
            if(winningSign === "") winner = ""
            dispatch({type:"UPDATE_GAME_OVER",payload:winner})
            // setOpen(true)
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

    const updateBoard = React.useCallback((position,sign="X") => {
        dispatch({type:"UPDATE_BOARD",payload:{position,sign}})

    },[dispatch])

    const playerUpdateBoard = (position) =>{
        updateBoard(position)
        socket.emit("player-moved",{roomID:roomID,position})
    }

    React.useEffect(()=>{
        // dispatch({type:"UPDATE_TURN",payload:true})
        socket.emit("players-ready")
        console.log("gameState is ",gameState)
        //Below line is for testing
        // dispatch({type:"UPDATE_GAME_OVER",payload:""})


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
        <AppBar>
            <Button onClick={()=>console.log("turn " + gameState.myTurn,"game state ",gameState.boardState,"checking counter ",gameState.winCounter)}>
                Click me
            </Button>
        </AppBar>
        <div className={classes.container}>
            <Paper className={classes.boardContainer}>
                {
                isRematchModal ? (
                <RematchModal
                    opponent={opponent}
                    openState={[open,setOpen]} 
                    roomID={roomID} 
                    socket={socket}
                />
                ) : (
                <GameOverModal 
                loadingState={[loading,updateLoading]} 
                openState={[open,setOpen]} 
                roomID={roomID} 
                socket={socket}
                />
                )
                }
                {     
                    gameState.boardState.map((row,Xindex)=>{
                        return row.map((item,Yindex)=>{
                            return <Square 
                                        key={Xindex+""+Yindex} 
                                        updateBoard={playerUpdateBoard}
                                        myTurn={gameState.myTurn}
                                        classProp={classes.square} 
                                        position={[Xindex,Yindex]}
                                        value={item}
                                    />
                        })
                    })
                }
            </Paper>
        </div>
        </>
    )
}

const useStyles = makeStyles(theme=>({
    container:{
        height:"100%",
        width:"100%",
        paddingTop:36
    },
    boardContainer:{
        margin: "12px auto 0px",
        backgroundColor:"white",
        width:"480px",
        minHeight:480,
        display:"grid",
        gridTemplateColumns: "repeat(3,1fr)",
        gridTemplateRows: "repeat(3,1fr)"
    },
    square:{
        fontSize:"8rem",
        textAlign:"center",
        userSelect:"none",
        boxSizing:"content-box",
        height:160,
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
