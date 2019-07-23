import React from 'react';
import Particles from 'react-particles-js';
import { particleConfig } from './particleConfig';
import {Grid,
        Paper,
        makeStyles,
        } from '@material-ui/core';
import { UserCTX } from '../../Context/Store';

import JoinUI from '../../Components/JoinUI'
import Waiting from '../../Components/Waiting'

const useStyles = makeStyles(theme=>({
    paper:{
        minHeight:"50vh",
        flexBasis:"40%",
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

const Join = () => {

    const [globalUser,dispatch,socket] = React.useContext(UserCTX)

    const [isWaiting,shouldWait] = React.useState(false)

    React.useEffect(()=>{
        socket.on("room-created",({roomID})=>{ 
            dispatch({type:"UPDATE_ROOM",payload:roomID})
            shouldWait(true)
        })
        
    },[dispatch,socket])

    const test = () =>{
        socket.emit("show-rooms")
    }

    const classes = useStyles()

    return(
        <React.Fragment>
            {/* Commenting out particles to ease load */}
            <Particles className={classes.particles} canvasClassName={classes.particlesCanvas} params={particleConfig}/>
            <Grid className={classes.parent} justify="center" alignItems="center" container>
                <Paper className={classes.paper}>
                    {
                        isWaiting ? <Waiting/> : <JoinUI/>
                    }
                    <button onClick={test}>See rooms</button>
                    <button onClick={()=>shouldWait(!isWaiting)}>See rooms</button>
                </Paper>
            </Grid>
        </React.Fragment>
    )
}

export default Join;