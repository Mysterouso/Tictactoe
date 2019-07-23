import React from 'react';
import { UserCTX } from '../Context/Store';
import {Grid,
    Typography,
    makeStyles,
    TextField,
    Button,
    ButtonGroup
    } from '@material-ui/core';
import {orange} from '@material-ui/core/colors';

const useStyles = makeStyles(theme=>({
    heading:{
        marginTop:theme.spacing(3),
        color:"black"
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
    buttonGroup:{
        marginTop:theme.spacing(3)
    },
    button:{
        backgroundColor:orange[300],
        color:"black",
        // height:"32px",
        // marginTop:theme.spacing(3),
        // "&:nth-child(1)":{
        //     borderTopRightRadius:0,
        //     borderBottomRightRadius:0,
        //     borderRightColor:"1px solid black"
        // },
        // "&:nth-child(2)":{
        //     borderTopLeftRadius:0,
        //     borderBottomLeftRadius:0,
        //     borderLeft:"1px solid black"
        //},
        "&:hover":{
            backgroundColor:orange[600]
        }
    }
}))

const JoinUI = () =>{

    const classes = useStyles()

    const [globalUser,dispatch,socket] = React.useContext(UserCTX)

    const [handle,updateHandle] = React.useState({name:'',roomID:''})
    const [userError,isUserError] = React.useState(false)
    const [roomError,isRoomError] = React.useState(false)

    React.useEffect(()=>{
        socket.on("room",(data)=>console.log("rooms are", data))

        socket.on("invalid-room",()=>{
           isRoomError(true)
        })  
    },[socket])

    const handleChange = (e) => updateHandle({...handle,[e.target.name]:e.target.value});

    const isHandleValid = () =>{
        const {name} = handle;
        if(name.includes(" ") || name.length < 4) isUserError(true)
    }

    const passValue = (e) => {
        e.preventDefault();
        const {name} = handle  
        dispatch({type:"UPDATE_USER",payload:name})      
        socket.emit("create-game",name)
        //Pass context here
    }

    const joinGame = () =>{
        socket.emit("join-game",handle)
    }

    const {name,roomID} = handle;

    return(
        <React.Fragment>
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
                    error={userError}
                    helperText={userError && "Invalid handle"}
                    onChange={handleChange}
                    onBlur={isHandleValid}
                    onFocus={()=>isUserError(false)}
                    name="name"
                    />
                    <br/>
                    <TextField className={classes.formField}
                    label="Enter by room id"
                    name="roomID"
                    value={roomID}
                    onChange={handleChange}
                    error={roomError}
                    helperText={roomError && "Invalid room ID. Please leave blank if you want to join a random game"}
                    onFocus={()=>isRoomError(false)}
                    />
                    <Grid item>
                        <ButtonGroup className={classes.buttonGroup} color="secondary" size="large" variant="contained" fullWidth>
                            <Button className={classes.button} type="submit" variant="text">
                                Host a game
                            </Button>
                            <Button className={classes.button} onClick={joinGame} type="button" variant="text">
                                Find a game
                            </Button>
                        </ButtonGroup>
                    </Grid>
                
                </Grid>
            

            </Grid>
        </React.Fragment>
    )
}

export default JoinUI;