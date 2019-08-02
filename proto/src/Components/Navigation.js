import React from 'react';
import {AppBar,Toolbar,Typography,makeStyles} from '@material-ui/core';

const Navigation = () => {
    return(
        <AppBar>
            <Toolbar>
                <Typography variant="h6">
                    Howdy
                </Typography>
            </Toolbar>
        </AppBar>
    )
}

export default Navigation;