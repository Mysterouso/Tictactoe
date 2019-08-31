import React from 'react'

const UseSocketListener = ({socket,socketEvent,socketFn}) => {

    React.useEffect(()=>{

        // const socketResponse = (res) =>{
        //     socketFn(res)
        // }

        socket.on(socketEvent,socketFn)
        
        return () => socket.off(socketEvent)

    },[socket,socketFn])
    
}

export default UseSocketListener
