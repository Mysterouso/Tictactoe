import React from 'react'
import { makeStyles } from '@material-ui/core'
import Navigation from '../Navigation'
import Game from '../Game'

const MainUI = () => {

    const classes = useStyles()

    return (
        <div className={classes.container}>
            {/* <Navigation/> */}
            <div>
                <Game/>
            </div>
        </div>
    )
}

const useStyles = makeStyles(theme=>({
    container:{
        height:"100vh",
        width:"100%",
        backgroundColor:"#333"
    }
})
)

export default MainUI
