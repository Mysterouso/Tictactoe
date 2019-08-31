import React from 'react'
import {DialogTitle,
        DialogContent,
        DialogContentText
        } from '@material-ui/core'
import Spinner from '../Spinner'
import UseSocketListener from '../../hooks/UseSocketListener';
import { UserCTX } from '../../Context&Reducers/Store';

const RematchDialog = ({classes,modalState,openState,updateLoading}) => {

    const [global,__,socket] = React.useContext(UserCTX)
    const [isDisconnected,updateDisconnect] = React.useState(false)
    const [response,updateResponse] = modalState
    const [open,setOpen] = openState

    const disconnectFunc = (playerID) =>{
        updateDisconnect(true);
        updateResponse(false);
        updateLoading(false)
        console.log(global.identifier===playerID)
    }

    // UseSocketListener({
    //                     socket,
    //                     socketEvent:"player-disconnected",
    //                     socketFn:disconnectFunc}
    //                 })
    React.useEffect(()=>{
        socket.on("player-disconnected",disconnectFunc)

        socket.on("test-run",()=>console.log("working - yes"))

        return ()=>socket.off("player-disconnected")
    },[])

   

    const title = () =>{
        if(response===null) return "Waiting for opponent to respond"

        if(response){ setTimeout(()=>setOpen(false),400); return "Rematch accepted"}
        else return "Rematch declined"
    }


    return (
        <React.Fragment>
            <DialogTitle 
            className={`${classes.centerAlign} ${classes.dialogTitle}`} 
            id="max-width-dialog-title"
            >
            {isDisconnected ? "Opponent has left the room" : title()}
            </DialogTitle>
            <DialogContent className={classes.loadingContent}>
                {response===null && <Spinner/>}
                {/* <button onClick={()=>socket.emit("test")}></button> */}
            </DialogContent>
        </React.Fragment>
    )
}

export default RematchDialog
