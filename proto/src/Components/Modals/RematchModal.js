import React from 'react';
import buttonStyles from '../../UtilityStyles/ButtonStyle'
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { GameCTX } from '../../Context&Reducers/GameStore';

const loading = false //temp

const RematchModal = ({ openState,roomID,socket,opponent,modalState }) => {
  const classes = useStyles()
  const [open, setOpen] = openState
  let updateModalState = modalState[1]
  //const [loading,updateLoading] = loadingState
  const [{gameOver},dispatch] = React.useContext(GameCTX)
  
 
  React.useEffect(()=>{
    if(!gameOver) return
    setOpen(true)
  },[gameOver])

  const handleClose = () => {
    socket.emit("rematch-response",{response:false,roomID})
    setOpen(false);
  }

  const accept = () =>{
    socket.emit("rematch-response",{response:true,roomID})
    dispatch({type:"RESET_BOARD"})
    setOpen(false)
    updateModalState(true)
    setTimeout(()=>updateModalState(null),2000)
  }

  return (
    <React.Fragment>
      <Dialog
        fullWidth
        maxWidth='sm'
        open={open}
        onClose={handleClose}
        aria-labelledby="max-width-dialog-title"
      >
        <DialogTitle 
            className={`${classes.centerAlign} ${classes.dialogTitle}`} 
            id="max-width-dialog-title"
        >
         {`${opponent} wants a rematch`}
        </DialogTitle>
        <DialogContent>
          <DialogContentText className={classes.contentText}>
            Do you accept the challenge?
          </DialogContentText>
        </DialogContent>
        <DialogActions className={classes.buttonContainer}>
          <Button disabled={loading} className={classes.button} onClick={handleClose} color="primary">
            Decline
          </Button>
          <Button disabled={loading} className={classes.button} onClick={accept} color="primary">
            Accept
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}

const useStyles = makeStyles(theme => ({
    buttonContainer:{
        display:"flex",
        justifyContent:"space-around"
    },
    centerAlign:{
        textAlign:"center"
    },
    button:{
        ...buttonStyles,
        minWidth:"40%",
        fontWeight:"bold"
    },
    dialogTitle:{
      backgroundColor: "#EEE",
      fontWeight:"bold"
    },
    contentText:{
        fontSize:"1.25rem",
    },
    form: {
      display: 'flex',
      flexDirection: 'column',
      margin: 'auto',
      width: 'fit-content',
    },
    formControl: {
      marginTop: theme.spacing(2),
      minWidth: 120,
    },
    formControlLabel: {
      marginTop: theme.spacing(1),
    },
  }));

export default RematchModal  