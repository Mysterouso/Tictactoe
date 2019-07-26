import React from 'react';
import { UserCTX } from '../Context/Store';
import {Grid,
    Typography,
    makeStyles,
    TextField,
    Button,
    ButtonGroup,
    Checkbox,
    FormGroup,
    FormControlLabel,
    useMediaQuery
    } from '@material-ui/core';
import {orange} from '@material-ui/core/colors';
import Spinner from './Spinner';


const useStyles = makeStyles(theme=>({
    container:{
        height:"100%",
        width:"100%"
    },
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
        marginTop:theme.spacing(1),
        marginBottom:theme.spacing(4)
        // "@media (max-width:768px)":{
        //     display:"flex",
        //     flexDirection:"column"
        // }
    },
    button:{
        backgroundColor:orange[300],
        color:"black",
        "&:hover":{
            backgroundColor:orange[600]
        },
        "&.Mui-disabled":{
            backgroundColor:orange[300]
        }
        // "@media(max-width:599px)":{
        //     fontSize:"0.6rem"
        // }
    },
    formGroup:{
        marginTop:theme.spacing(1)
    },
    checkBox:{
        color: orange[400],
        '&$checked': {
            color: orange[600],
        }
    }
}))

const JoinUI = ({shouldWait,updateHosting,history}) =>{

    const classes = useStyles()

    const isSmallScreen = useMediaQuery('(max-width:400px)')

    const [globalUser,dispatch,socket] = React.useContext(UserCTX)

    const [handle,updateHandle] = React.useState({name:'',roomID:'',isPrivate:false})
    const [userError,isUserError] = React.useState(false)
    const [roomError,isRoomError] = React.useState(false)
    const [isLoading,updateButton] = React.useState(true)

    React.useEffect(()=>{
        socket.on("room",(data)=>console.log("rooms are", data))

        socket.on("invalid-room",()=> {
            isRoomError(true)
            updateButton(false)
        })  

        socket.on("room-found",()=>{
            dispatch({type:"UPDATE_USER",payload:handle.name})
            history.push(`/play/${roomID}`)
        })
        // Todo -- change state of a disconnect value prior and reset upon game found
        socket.on("player-disconnected",()=>console.log("Opppnent has disconnected disconnect tho"))  

        return () =>{
            socket.off("room")
            socket.off("invalid-room")
        } 
    },[socket,dispatch])

    const handleChange = (e) => {
        const value = e.target.type === "checkbox" ? e.target.checked : e.target.value;
        updateHandle({...handle,[e.target.name]:value})
    };

    const isHandleValid = () =>{
        const {name} = handle;
        if(name.includes(" ") || name.length < 4) isUserError(true)
    }

    const passValue = (e) => {
        e.preventDefault();
        const {name,isPrivate} = handle  
        dispatch({type:"UPDATE_USER",payload:name})      
        socket.emit("create-game",{name,isPrivate})
        updateHosting(true)
        //Pass context here
    }

    const joinGame = () =>{
        const {name,roomID} = handle

        socket.emit("join-game",handle)

        if(!roomID){
            dispatch({type:"UPDATE_USER",payload:handle.name})
            updateHosting(false)
            shouldWait(true)
        }
        else{
            updateButton(true)
            //--Loading state on button 
            // disable button
            // socket event will redirect to appropriate page if roomID is valid and room is not full
        }
        //If roomID is valid jump straight to game screen
    }

    const {name,roomID,isPrivate} = handle;

    return(
            <Grid className={classes.container} container justify="center">
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
                    xs={11}
                    sm={10} 
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
                    <FormGroup className={classes.formGroup} row>
                        <FormControlLabel
                            control={
                            <Checkbox checked={isPrivate} color="default" className={classes.checkBox} name="isPrivate" onChange={handleChange}/>
                            }
                            label="Allow random joins?"
                        />
                    </FormGroup>

                    <Grid item>
                        <ButtonGroup className={classes.buttonGroup} color="secondary" size={isSmallScreen ? "small" : "medium"} variant="contained" fullWidth>
                            <Button className={classes.button} type="submit">
                                Host a game
                            </Button>
                            <Button className={classes.button} onClick={joinGame} disabled={isLoading} type="button">
                                {isLoading ? <Spinner border={4} size={20}/> : "Find a game"}
                            </Button>
                        </ButtonGroup>
                    </Grid>
                </Grid>
            </Grid>
    )
}

export default JoinUI;