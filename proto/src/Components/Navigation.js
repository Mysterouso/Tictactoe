import React from 'react';
import styled from 'styled-components';
import {AppBar,Toolbar,Typography} from '@material-ui/core';

const MyNav = styled.div`
    height:40px;
    background-color:orange;
`


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