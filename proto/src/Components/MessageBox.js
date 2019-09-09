import React from 'react'
import {List,
        ListItem,
        Divider,
        ListItemText,
        Typography,
        makeStyles} from '@material-ui/core'

const MessageBox = ({chatMessages}) => {

    const classes = useStyles()

    return (
        <List className={classes.root}>
            {
                chatMessages.map((message,index)=>{

                    return(
                        <React.Fragment key={index}>
                            {index===0 && <Divider variant="fullWidth" component="li" />}
                            <ListItem key={index} alignItems="flex-start" className={`${classes.justified} ${classes.container}`}> 
                                <ListItemText
                                    classes={{root:classes.meta,primary:classes.primary}}
                                    primary={message.user}
                                    secondary={
                                        <React.Fragment>
                                            <Typography
                                                variant="body2"
                                                component="span"
                                                className={classes.secondary}
                                                >
                                                {message.date}
                                            </Typography>
                                        </React.Fragment>
                                    }
                                />
                                <ListItemText
                                    className={classes.message}
                                    primary={message.message}
                                />
                            </ListItem>
                            <Divider variant="fullWidth" component="li" />
                        </React.Fragment>
                    )

                })
            }
        </List>
    )
}

const useStyles = makeStyles(theme=>({
    root:{
        height:"100%",
        width:"100%",
        paddingTop:0,
        paddingBottom:0
    },
    container:{
        position:"relative",
        alignItems:"stretch",
        padding:0,
        paddingLeft:8,
        paddingRight:8,
    },
    justified:{
        // justifyContent:"center"
    },
    meta:{
        alignSelf:"flex-start",
        position:"sticky",
        top:0,
        left:0,
        width:"20%",
        paddingRight:8,
        margin:0

    },
    primary:{
        fontSize:"0.9rem"
    },
    secondary:{
        fontSize:"0.8rem"
    },
    message:{
        width:"70%",
        borderLeft: "0.5px solid rgba(52,52,52,0.6)",
        paddingLeft:8,
        marginTop:0,
        marginBottom:0,
    }
}))

export default MessageBox
