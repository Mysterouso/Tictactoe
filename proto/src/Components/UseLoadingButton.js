import React from 'react'

const UseLoadingButton = (props) => {

    const [loading,updateLoading] = React.useState(false)
    
    React.useEffect(()=>{

        const {socket,socketEvent,socketFn} = props

        const socketResponse = (res) =>{
            updateLoading(false)
            socketFn(res)
        }


        socket.on(socketEvent,socketResponse)
        
        return () => socket.off(socketEvent)

    },[])

    return [loading,updateLoading]
    
}

export default UseLoadingButton
