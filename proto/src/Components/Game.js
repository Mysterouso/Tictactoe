import React from 'react'
import Square from './Square'
import {makeStyles} from '@material-ui/core'
import { UserCTX } from '../Context/Store';

const Game = ({turn}) => {

    const [globalUser,dispatch,socket] = React.useContext(UserCTX)

    const [myTurn, updateTurn] = turn

    const [gameState,updateGameState] = React.useState([[]])

    React.useEffect(()=>{
        let initialState = []
        for(let x = 0; x < 3; x++){
            initialState.push([])
            for(let y = 0; y < 3; y++){
                initialState[x].push('')
            }
        }
        updateGameState(initialState)

        socket.emit("players-ready")

    },[])

    React.useEffect(()=>{
        socket.on("opponent-moved",({position})=>{
            console.log("It went through")
            updateBoard(position,"O")
        })
        return () => socket.off("opponent-moved")
    },[socket])

    const updateBoard = (position,sign="X") =>{
        const [x,y] = position
        const newState = JSON.parse(JSON.stringify(gameState))
        newState[x][y] = sign
        updateGameState(newState)
        updateTurn(!myTurn)
    }

    const playerUpdateBoard = (position) =>{
        updateBoard(position)
        socket.emit("player-moved",{roomID:globalUser.roomID,position})
    }
    
    const classes = useStyles()

    return (
        <>
        <button onClick={()=>console.log(myTurn)}/>
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
