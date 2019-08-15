import React from 'react';
import { UserCTX } from '../Context&Reducers/Store';
import { GameCTX } from  '../Context&Reducers/GameStore';

import MainUI from '../Components/MainUI';


const Main = ({match}) =>{

    const [globalUser,_,socket] = React.useContext(UserCTX)
    const [gameState,dispatch] = React.useContext(GameCTX)

    const [loading,updateLoading] = React.useState(false)
    const [isAuthorized,changeAuthorization] = React.useState(true)

    React.useEffect(()=>{
        const {identifier,roomID} = globalUser
        const identity = {identifier,roomID:match.params.roomID}

        if(roomID === match.params.roomID){
            socket.emit("verify-player",identity)
        }
        else{
            updateLoading(false)
        }
       
    },[])

    React.useEffect(()=>{
        
        socket.on("player-verified",()=>{
            // updateLoading(false)
            // changeAuthorization(true)
            console.log("I am verified")
            const identifier = globalUser.identifier
            const roomID = globalUser.roomID
            if(globalUser.hostPlayer) socket.emit("select-first-turn",{identifier,roomID})
        })
        socket.on("player-not-verified",()=>{
            // updateLoading(false)
            console.log("I am not verified")
        })
        socket.on("first-turn",({firstTurn})=>{
            console.log("I work ",firstTurn)
            if(firstTurn.userID === globalUser.identifier){
                dispatch({type:"UPDATE_TURN",payload:true})
            }
        })
        return ()=>{
            socket.off("player-verified")
            socket.off("player-not-verified")
            socket.off("first-turn")
        }
    },[socket,globalUser.identifier,globalUser.hostPlayer,dispatch])

    if(loading){
        return(
            <div>Loading...</div>
        )
    }

    return(
        <React.Fragment>
            {isAuthorized ? <MainUI/> : <div>Not authorized</div>}
        </React.Fragment>
    ) 
}



export default Main;