import React from 'react';
import {makeStyles} from "@material-ui/core"

const useStyles = makeStyles(theme=>({
    spinnerContainer: {
        height: "60px",
        width: "60px",
        position:"relative"
    },
    newSpinner:{
      width:"60px",
      height:"60px",
      borderRadius:"50%",
      borderTop: "4px solid rgba(241, 5, 5, 0.931)",
      borderBottom: "4px solid rgba(241, 5, 5, 0.931)",
      borderLeft: "4px solid #ffffff",
      borderRight: "4px solid #ffffff",
      position: "relative",
      textIndent: "-9999em",
      animation: "rota 0.8s linear infinite"
    },
    spinner: props=>({
        width: "60px",
        height: "60px",
        borderRadius: "50%",
        border: "8px solid "+ (props.mainColor || theme.palette.primary.main),
        boxSizing: "border-box",
        animation: "sweep 1s linear alternate infinite, rota 0.8s linear infinite"
    }),
    innerSpinner: props=>({
        width: "52px",
        height: "52px",
        position:"absolute",
        left:"4px",
        top:"4px",
        borderRadius: "50%",
        border: "8px solid "+ (props.secondaryColor || theme.palette.secondary.main),
        boxSizing: "border-box",
        animation: "sweep 1s linear alternate infinite, rota 0.8s linear infinite"
    }),
    newInnerSpinner: props=>({
        width: "54px",
        height: "54px",
        position:"absolute",
        left:"2px",
        top:"2px",
        borderRadius: "50%",
        border: "10px solid "+ (props.secondaryColor || theme.palette.primary.main),
        borderTop:"10px solid transparent",
        boxSizing: "border-box",
        animation: "rota 0.8s linear infinite reverse"
    }),
    "@global":{
        "@keyframes rota": {
            from : {
              transform: "rotate(0deg)"
            },
            to : {
              transform: "rotate(360deg)"
            }
          },
          "@keyframes sweep": {
            "0%" : {
              clipPath: "polygon(0% 0%, 0% 0%, 0% 0%, 50% 50%, 0% 0%, 0% 0%, 0% 0%)",
            },
            "50%" : {
              clipPath: "polygon(0% 0%, 0% 100%, 0% 100%, 50% 50%, 100% 0%, 100% 0%, 0% 0%)",
            },
            "100%" : {
              clipPath: "polygon(0% 0%, 0% 100%, 100% 100%, 50% 50%, 100% 100%, 100% 0%, 0% 0%)"
            }
        }
    }   
}))

const Spinner = (props) =>{
    const classes = useStyles(props)

    return(
      <React.Fragment>
        <div className={classes.spinnerContainer}>
            <div className={classes.spinner}></div>
            <div className={classes.innerSpinner}></div>
        </div>
        {/* <div className={classes.spinnerContainer}>
          <div className={classes.newSpinner}></div>
          <div className={classes.newInnerSpinner}></div>
        </div> */}
      </React.Fragment>
    )
}

export default Spinner;