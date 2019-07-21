import React from 'react';
import Particles from 'react-particles-js';
import { particleConfig } from './particleConfig';
import io from 'socket.io-client';
import {Grid,
        Typography,
        Paper,
        makeStyles,
        TextField,
        Button,
        } from '@material-ui/core';
import {orange} from '@material-ui/core/colors';

let socket = io("localhost:5000");

// socket.emit("create-game",{playerID:"howdy"})

const useStyles = makeStyles(theme=>({
    paper:{
        minHeight:"50vh",
        // color:blue;
        flexBasis:"40%",
        // margin-bottom:20px;
        // margin-left:20px;
    },
    particles:{
        position:"absolute",
        // backgroundColor:"#333",
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
    },
    heading:{
        marginTop:theme.spacing(3),
        color:"black"
    },
    subText:{

    },
    formField: {
        "& label.Mui-focused": {
        color: orange[800],
        },
        "& .MuiInput-underline:after": {
        borderBottomColor: orange[300],
        },
        width:"100%",
        marginTop:theme.spacing(3)
    },
    button:{
        display:"block",
        textAlign:"center",
        width:"50%",
        backgroundColor:orange[300],
        height:"32px",
        marginTop:theme.spacing(3),
        "&:nth-child(1)":{
            borderTopRightRadius:0,
            borderBottomRightRadius:0,
            borderRightColor:"1px solid black"
        },
        "&:nth-child(2)":{
            borderTopLeftRadius:0,
            borderBottomLeftRadius:0,
            borderLeft:"1px solid black"
        },
        "&:hover":{
            backgroundColor:orange[600]
        }
    }
}))

socket.on("room",(data)=>console.log("rooms are", data))

const Join = (props) =>{

    const [user,handleUser] = props.user;

    const [handle,updateHandle] = React.useState({name:'',roomID:''})

    const handleChange = (e) => updateHandle({...handle,[e.target.name]:e.target.value});

    const validateName = (input) =>{
        if(input.includes(" ")) return false;
        if(input.length < 4) return false;
        return true
    }

    
    const createGame = (name) =>{
        socket.emit("create-game",name)
        console.log(user);
    }
     
    const joinGame = () =>{
        socket.emit("join-game",handle)
    }

    const passValue = (e) => {
        e.preventDefault();
        const {name} = handle
        const isValid = validateName(name.trim())

        if(!isValid) return; 
        
        createGame(name.trim())
        

        //Pass context here
    }

    const test = () =>{
    socket.emit("show-rooms",{})
    }

    const classes = useStyles()
    const {name,roomID} = handle
    return(
        <React.Fragment>
            {/* Commenting out particles to ease load */}
            {/* <Particles className={classes.particles} canvasClassName={classes.particlesCanvas} params={particleConfig}/> */}
            <Grid className={classes.parent} justify="center" alignItems="center" container>
                <Paper className={classes.paper}>
                    <Grid container justify="center">
                        <Grid item sm={12} lg={12}>
                            <Typography className={classes.heading}color="primary" align="center" variant="h3">
                                Tic-Tac-Toe
                            </Typography>
                            <Typography color="textSecondary" align="center" variant="subtitle1">
                                Play with your friends or against strangers online!
                            </Typography>
                        </Grid>
                        <Grid onSubmit={passValue} 
                            component="form" 
                            item 
                            sm={12} 
                            lg={9}>
                    
                        <TextField className={classes.formField}
                        required
                        label="Choose your handle"
                        value={name}
                        onChange={handleChange}
                        name="name"
                        />
                        <br/>
                        <TextField className={classes.formField}
                        label="Enter by room id"
                        name="roomID"
                        value={roomID}
                        onChange={handleChange}
                        />
                        <Grid container justify="center">
                            <Button className={classes.button} type="submit" variant="text">
                                Find a game
                            </Button>
                            <Button className={classes.button} onClick={(e)=>console.log("not submitting eh?")} type="button" variant="text">
                                Host a game
                            </Button>
                        </Grid>
                        
                        </Grid>
                    

                    </Grid>
                    <button onClick={test}/>
                    <button onClick={joinGame} valye="Join game"/>
                </Paper>
            </Grid>
        </React.Fragment>
    )
}

export default Join;