import React from 'react';
import { UserCTX } from '../../Context&Reducers/Store';
import buttonStyles from '../../UtilityStyles/ButtonStyle'
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
import Spinner from '../Spinner';

const JoinUI = ({ shouldWait }) =>{

    const classes = useStyles()

    const isSmallScreen = useMediaQuery('(max-width:400px)')

    const [globalUser,dispatch,socket] = React.useContext(UserCTX)

    //Input state
    const [handle,updateHandle] = React.useState({name:'',roomID:'',isPrivate:false})

    //Form error state
    const [userError,isUserError] = React.useState(false)
    const [roomError,isRoomError] = React.useState("")

    //Button loading state
    const [isLoading,updateButton] = React.useState(false)

    function setErrorState(message){
        isRoomError(message)
        updateButton(false)
    }

    React.useEffect(()=>{

        socket.on("invalid-room",()=> setErrorState("Invalid room ID. Please leave blank if you want to join a random game"))  

        socket.on("no-rooms",()=> setErrorState("There are no rooms available to join"))

        socket.on("room-full",()=>setErrorState("Room is already full"))

        // Todo -- change state of a disconnect value prior and reset upon game found
        socket.on("player-disconnected",()=>console.log("Oppponent has disconnected disconnect tho"))  

        return () =>{
            socket.off("invalid-room")
        } 
    },[socket])

    const handleChange = (e) => {
        const value = e.target.type === "checkbox" ? e.target.checked : e.target.value;
        updateHandle({...handle,[e.target.name]:value})
    };

    //input checking could be improved but acceptable for now
    const isHandleValid = () =>{
        const {name} = handle;
        if(name.includes(" ") || name.length < 4) isUserError(true)
    }

    const passValue = (e) => {
        e.preventDefault();
        const {name,isPrivate} = handle  
        socket.emit("create-game",{name,isPrivate})
        dispatch({type:"UPDATE_HOST",payload:true})
    }

    const joinGame = () =>{
        const {name,roomID} = handle

        if(roomID && roomID.length !== 10) return setErrorState("Invalid room ID. Please leave blank if you want to join a random game")
        
        socket.emit("join-game",handle)

        if(!roomID){
            dispatch({type:"UPDATE_MULTIPLE",payload:{hostPlayer:false,user:name}})
            shouldWait(true)
        }
        else{
            if(globalUser.user !== handle.name){
                dispatch({type:"UPDATE_USER",payload:name})
            }
            updateButton(true)           
            //Redirection handled by socket.on event
        }
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
                    error={!!roomError}
                    helperText={!!roomError && roomError }
                    onFocus={()=>isRoomError("")}
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
                            <Button className={classes.button} disabled={isLoading} type="submit">
                                Host a game
                            </Button>
                            <Button className={classes.button} onClick={joinGame} disabled={isLoading} type="button">
                                {isLoading ? <Spinner secondaryColor={orange[500]} border={4} size={24}/> : "Find a game"}
                            </Button>
                        </ButtonGroup>
                    </Grid>
                </Grid>
            </Grid>
    )
}

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
        ...buttonStyles
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

export default JoinUI;