import React from 'react'
import {DialogTitle,
        DialogContent,
        DialogContentText
        } from '@material-ui/core'
import Spinner from '../Spinner'

const RematchDialog = ({classes}) => {
    return (
        <React.Fragment>
            <DialogTitle 
            className={`${classes.centerAlign} ${classes.dialogTitle}`} 
            id="max-width-dialog-title"
            >
            Waiting for opponent to respond...
            </DialogTitle>
            <DialogContent className={classes.loadingContent}>
                <Spinner/>
            </DialogContent>
        </React.Fragment>
    )
}

export default RematchDialog
