import React from 'react'
import UseSocketListener from './UseSocketListener'

const UseLoadingButton = ({socket,socketEvent,socketFn}) => {

    const [loading,updateLoading] = React.useState(false)
    
    const socketResponse = (res) =>{
        updateLoading(false)
        socketFn(res)
    }

    UseSocketListener({socket,socketEvent,socketFn:socketResponse})
    
    // React.useEffect(()=>{

    //     const {socket,socketEvent,socketFn} = props

    //     const socketResponse = (res) =>{
    //         updateLoading(false)
    //         socketFn(res)
    //     }


    //     socket.on(socketEvent,socketResponse)
        
    //     return () => socket.off(socketEvent)

    // },[])

    return [loading,updateLoading]
    
}

export default UseLoadingButton
