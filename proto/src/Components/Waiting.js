import React from "react";
import {Grid,
        Typography,
        Button,
        makeStyles} 
        from '@material-ui/core';
import ArrowBackIcon from '@material-ui/icons/ArrowBack'
import {orange} from '@material-ui/core/colors';  
import { UserCTX } from '../Context&Reducers/Store';
import Spinner from "./Spinner";

const Waiting = (props) =>{

    const { history,shouldWait } = props

    const [globalUser,dispatch,socket] = React.useContext(UserCTX)

    React.useEffect(()=>{
      socket.on("matchmaking-left",() =>{
        shouldWait(false)

        // Fix to one dispatch --
        dispatch({type:"UPDATE_USER",payload:""})
        dispatch({type:"UPDATE_ROOM",payload:""})
      })

      return () => socket.off("matchmaking-left")
      
    },[socket,shouldWait,dispatch])

    const goBack = () =>{
      if(globalUser.hostPlayer){
        socket.emit("leave-matchmaking",globalUser.roomID)
      }
      else{
        shouldWait(false)
      }
    }
    const { hostPlayer } = globalUser
    const classes = useStyles()
    return(
        <React.Fragment>
              <Grid className={classes.container} container justify="center">
                <Grid className={classes.spinnerRow} item justify="center" container sm={12}>
                  <Spinner secondaryColor={orange[500]}/>  
                </Grid>
                <Grid  container justify="center" item sm={12} lg={12}>
                  {/* <Grid>  */}
                    <Typography className={classes.info} variant="h4" gutterBottom>
                      {hostPlayer ? "Waiting for player..." : "Looking for game..."}
                      <hr/>
                    </Typography>
                  {/* </Grid> */}
                </Grid>
                <Grid item sm={12} lg={12}>
                  <Typography className={classes.info} variant="h6" align="center" gutterBottom>
                    {`Your room ID is ${globalUser.roomID}.`} <br/> {`Please pass this on code to play with your friend`}
                  </Typography>
                </Grid>
                <Grid className={classes.buttonGroup} container justify="space-around">
                  <Grid item sm={4} lg={5} >
                    <Button onClick={goBack} variant="contained" color="secondary" className={classes.button} type="submit">
                        <ArrowBackIcon/>
                        Go back
                    </Button>
                  </Grid>
                  <Grid item sm={4} lg={5}>
                    <Button variant="outlined" color="primary">
                        { hostPlayer ? "Join a random game!" : "Host a game instead!"}
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
        </React.Fragment>
    )
}

const useStyles = makeStyles(theme=>({
  container:{
    height:"100%",
    width:"100%"
  },
  spinnerRow:{
    marginTop:theme.spacing(4)
  },
  info:{
    marginTop:theme.spacing(2)
  },
  button:{
    backgroundColor:orange[400],
    color:"black",
    "&:hover":{
      backgroundColor:orange[600]
    }
  },
  buttonGroup:{
    marginTop:theme.spacing(3),
    marginBottom:theme.spacing(3)
  }

}))

export default Waiting;