import React from 'react';
import buttonStyles from '../UtilityStyles/ButtonStyle'
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import Switch from '@material-ui/core/Switch';
import { GameCTX } from '../Context&Reducers/GameStore';

const GameOverModal = ({ loadingState,openState,roomID,socket }) => {
  const classes = useStyles()
  const [open, setOpen] = openState
  const [loading,updateLoading] = loadingState
  // const [isRematch,updateRematch] = rematchState
  const [{gameOver,winningPlayer},dispatch] = React.useContext(GameCTX)
  
 
  React.useEffect(()=>{
    if(!gameOver) return
    setOpen(true)
  },[gameOver])

  const handleClose = () => {
    setOpen(false);
  }

  const rematch = () =>{
    socket.emit("request-rematch",{roomID})
    updateLoading(true)
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
         {winningPlayer ? `${winningPlayer} won!` : "Game ended in a draw..."}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Request a rematch?
          </DialogContentText>
        </DialogContent>
        <DialogActions className={classes.buttonContainer}>
          <Button disabled={loading} className={classes.button} onClick={handleClose} color="primary">
            Close
          </Button>
          <Button disabled={loading} className={classes.button} onClick={rematch} color="primary">
            Request rematch
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
        minWidth:"40%"
    },
    dialogTitle:{
      backgroundColor: "#EEE"
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

export default GameOverModal  