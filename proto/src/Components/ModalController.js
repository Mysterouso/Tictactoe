import React from 'react'
import UseLoadingButton from '../hooks/UseLoadingButton';
import GameOverModal from './Modals/GameOverModal'
import RematchModal from './Modals/RematchModal'

const ModalController = ({socket,reset,gameOver,rematchResponse,opponent,roomID}) => {

    const [open, setOpen] = React.useState(false) //open state
    const [isRematchModal,updateModal] = React.useState(false)  //swap between both modals
    const [rematchResp,setResponseState] = rematchResponse // change dialogue in gameOver modal
    const [shouldReset,doReset] = reset // should reset state or not

    const resetModalState = React.useCallback(()=>{
        updateModal(false)
        setOpen(false)
        setResponseState(null)
        doReset(false)
    },[])

    React.useEffect(()=>{
        if(shouldReset){
            //Resetting modal state to initial on rematch
            resetModalState()
        }
    },[shouldReset,resetModalState])

    React.useEffect(()=>{
        if(gameOver && !open) setOpen(true) 
    },[gameOver,open])

    const handleRematchRequest = (res) =>{
        if(!open) setOpen(true)
        updateModal(true)
    }
    
    const [loading,updateLoading] = UseLoadingButton({socket,
                                                      socketEvent:"rematch-requested",
                                                      socketFn:handleRematchRequest
                                                    })    
    
    if(!open) return <div></div>

    return (
        <React.Fragment> 
                {
                    isRematchModal ? (
                    <RematchModal
                        opponent={opponent}
                        openState={[open,setOpen]} 
                        roomID={roomID} 
                        socket={socket}
                        modalState={[rematchResp,setResponseState]}
                        reset={[shouldReset,doReset]}

                    />
                    ) : (
                    <GameOverModal 
                        loadingState={[loading,updateLoading]} 
                        openState={[open,setOpen]} 
                        roomID={roomID} 
                        socket={socket}
                        modalState={[rematchResp,setResponseState]}
                    />
                    )
                }
        </React.Fragment>
    )
}

export default ModalController
