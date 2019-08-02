import React from 'react'
import {Grid,Typography,makeStyles} from '@material-ui/core'
import NotFoundImage from '../Assets/404.png'

const NotFound = () => {

    const classes = useStyles()

    return (
        <Grid className={classes.container} container justify="center">
            <Grid sm={12} md={10} lg={8} item container justify="center" alignItems="center" direction="column">
                <img className={classes.itemImage} src={NotFoundImage} alt="Not found"/>
                <div className={classes.itemText}>
                    <Typography gutterBottom variant="h2" component="h2" align="center">
                        Theres been a mistake...
                    </Typography>
                    <Typography className={classes.itemSubtext} variant="h5" align="center">
                       {"The page you were looking for was "}
                       <Typography color="secondary" variant="h5" component="span" display="inline">
                           not found
                       </Typography>
                    </Typography>
                </div>
            </Grid> 
        </Grid>
    )
}

const useStyles = makeStyles(theme=>({
    container:{
        height:"100vh",
        width:"100%",
        backgroundColor:"lightblue"
    },
    itemImage:{
        width:"40%",
        "@media (max-width:1080px)":{
            width:"60%"
        },
        "@media (max-width:768px)":{
            width:"65%"
        },
        "@media (min-width:1440px)":{
            width:"70%"
        }
        
    },
    itemText:{
        marginTop: (-1 * theme.spacing(5)),
        "@media (max-width:425px)":{
            marginTop:(-1 * theme.spacing(2)),
            "& h2":{
                fontSize:"1.8rem"
            }
        }
    },
    itemSubtext:{
        marginTop:theme.spacing(2),
        "@media (max-width:425px)":{
            fontSize:"1rem",
            padding: "0 4px",
            "& span":{
                fontSize:"1rem"
            }
        }
    }
}))

export default NotFound;
