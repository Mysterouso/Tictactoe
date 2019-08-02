import React from 'react';
import { UserCTX } from '../Context/Store';

import MainUI from '../Components/MainUI';


const Main = ({match}) =>{

    const [globalUser,dispatch,socket] = React.useContext(UserCTX)

    const [loading,updateLoading] = React.useState(false)
    const [isAuthorized,changeAuthorization] = React.useState(true)

    const [myTurn,updateTurn] = React.useState(false)

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
        // socket.on("player-verified",()=>{
        //     updateLoading(false)
        //     changeAuthorization(true)
        // })
        // socket.on("player-not-verified",()=>{
        //     updateLoading(false)
        // })
        socket.on("first-turn",({firstTurn})=>{
            console.log("I work ",firstTurn)
            if(firstTurn.userID === globalUser.identifier){
                updateTurn(true)
            }
        })
        return ()=>{
            // socket.off("player-verified")
            // socket.off("player-not-verified")
            socket.off("first-turn")
        }
    },[socket,globalUser.identifier])

    if(loading){
        return(
            <div>Loading...</div>
        )
    }
    
    return(
        <React.Fragment>
            {isAuthorized ? <MainUI turn={[myTurn,updateTurn]}/> : <div>Not authorized</div>}
        </React.Fragment>
    ) 
}

export default Main;