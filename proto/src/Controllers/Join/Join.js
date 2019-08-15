import React from 'react';
// import Particles from 'react-particles-js';
// import { particleConfig } from './particleConfig';
import {Grid,
        Paper,
        makeStyles
        } from '@material-ui/core';
import { UserCTX } from '../../Context&Reducers/Store';

import JoinUI from '../../Components/JoinUI'
import Waiting from '../../Components/Waiting'

const Join = (props) => {

    const [globalUser,dispatch,socket] = React.useContext(UserCTX)

    const [isWaiting,shouldWait] = React.useState(false)

    React.useEffect(()=>{
        socket.on("room-created",({roomID,userID,user})=>{ 
            // dispatch({type:"UPDATE_ROOM",payload:roomID})
            // dispatch({type:"UPDATE_IDENTIFIER",payload:userID})
            dispatch({type:"UPDATE_MULTIPLE",payload:{
                                                user,
                                                roomID,
                                                identifier:userID
                                            }
            })

            shouldWait(true)
        })
        
        socket.on("room",(data)=>console.log("rooms are", data))

        return () => socket.off("room-created")
        
    },[dispatch,socket])

    const test = () =>{
        socket.emit("show-rooms")
    }

    const classes = useStyles()

    return(
        <React.Fragment>
            {/* Commenting out particles to ease load */}
            {/* <Particles className={classes.particles} canvasClassName={classes.particlesCanvas} params={particleConfig}/> */}
            <Grid className={classes.parent} justify="center" alignItems="center" container>
                <Paper className={classes.paper}>
                    {
                        isWaiting ? <Waiting {...props} shouldWait={shouldWait}/> 
                                    : 
                                    <JoinUI shouldWait={shouldWait} {...props}/>
                    }
                    <button onClick={test}>See rooms</button>
                    <button onClick={()=>console.log(globalUser)}>Show global state</button>
                </Paper>
            </Grid>
        </React.Fragment>
    )
}

const useStyles = makeStyles(theme=>({
    paper:{
        minHeight:"50vh",
        flexBasis:"40%",
        "@media (max-width:1080px)":{
            flexBasis:"80%"
        },
        "@media (max-width:400px)":{
            flexBasis:"90%"
        }
    },
    particles:{
        position:"absolute",
        top:"0",
        left:"0",
        height:"100%",
        width:"100%",
        zIndex:"-1"
    },
    particlesCanvas:{
        backgroundColor:"#333"
    },
    parent:{
        // backgroundColor:"#444",
        height:"100vh"
    }
}))

export default Join;