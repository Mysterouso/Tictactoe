import React from 'react'
import Square from './Square'
import GameOverStroke from './GameOverStroke'
import GameOverModal from './GameOverModal'
import RematchModal from './RematchModal'
import useLoadingButton from '../hooks/UseLoadingButton'
import CheckGameOver from '../helperFunctions/CheckGameOver'
import {Paper,AppBar,Button,makeStyles} from '@material-ui/core'
import { UserCTX } from '../Context&Reducers/Store';
import { GameCTX } from '../Context&Reducers/GameStore';


const Game = () => {

    const [{roomID,opponent},_,socket] = React.useContext(UserCTX)
    const [gameState,dispatch] = React.useContext(GameCTX)


    
    //    Board stroke      //
    const [winPosition,updateWinPosition] = React.useState({direction:null,position:null})

    // WinCondition Check //

    const checkWinCondition = CheckGameOver(gameState,opponent,dispatch,updateWinPosition)

    React.useEffect(()=>{
        console.log("updating ", gameState.winCounter)
        if(gameState.winCounter>=5){
            checkWinCondition(gameState.winCounter)
        }
    },[gameState.winCounter,checkWinCondition])
    
    //Modal Logic//

    const [open, setOpen] = React.useState(false)
    const [isRematchModal,updateModal] = React.useState(false)
    const handleRematchRequest = (res) =>{
        if(!open) setOpen(true)
        updateModal(true)
    }
    
    const [loading,updateLoading] = useLoadingButton({socket,
                                                      socketEvent:"rematch-requested",
                                                      socketFn:handleRematchRequest
                                                    })                                         

    //Board updating Logic //

    const updateBoard = React.useCallback((position,sign="X") => {
        dispatch({type:"UPDATE_BOARD",payload:{position,sign}})

    },[dispatch])

    const playerUpdateBoard = (position) =>{
        updateBoard(position)
        socket.emit("player-moved",{roomID:roomID,position})
    }

    React.useEffect(()=>{
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

    const classes = useStyles()

    return (
        <>
        <AppBar>
            <Button onClick={()=>console.log("turn " + gameState.myTurn,"game state ",gameState.boardState,"checking counter ",gameState.winCounter)}>
                Click me
            </Button>
        </AppBar>
        <div className={classes.container}>
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
            <div className={classes.relative}>
                {gameState.gameOver && <GameOverStroke winPosition={winPosition}/>}
                <Paper className={classes.boardContainer}>
                
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
    relative:{
        position:"relative",
        margin: "12px auto 0px",
        width:"480px",
        minHeight:480
    },
    boardContainer:{
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
