import React from 'react'
import {Badge,
        FormControl,
        InputLabel,
        Input,
        InputAdornment,
        IconButton,
        makeStyles,
        Typography} from '@material-ui/core'
import MessageBox from './MessageBox'
import PlaneSVG from "../Assets/PlaneSVG"
import Remove from '@material-ui/icons/Remove'
import UseSocketListener from '../hooks/UseSocketListener';
import ScrollBar from '../UtilityStyles/ScrollBar'

const ChatBox = ({socket,roomID,user}) => {

    const [open,setOpen] = React.useState(false)
    const [chatMessages,updateChat] = React.useState([])
    const [input,updateInput] = React.useState("")
    const height = React.useRef(0)
    const inputBox = React.useRef(null)
    const [shouldStyleInput,updateStyling] = React.useState(false)
    const [shouldLabel,triggerLabel] = React.useState(true)
    const [isUnread,setUnread] = React.useState(0)

    const classes = useStyles({open:!!open,shouldStyleInput})

    const shouldAllowOpen = () =>{
        if(open) return
        setOpen(prevState=>!prevState)
    }
    // React.useEffect(()=>{
    //     if(!inputBox.current) return
    //     console.log("offset "+inputBox.current.scrollHeight)
    // })

    React.useEffect(()=>{
        if(open) setUnread(0)

    },[open])

    React.useEffect(()=>{
        if(!inputBox.current) return
        // const inputHeight = inputBox.current.getBoundingClientRect().height
        const inputHeight = inputBox.current.scrollHeight

        if(height.current === inputHeight) return

        const lineHeight = parseInt(getComputedStyle(inputBox.current).lineHeight)
        
        const lines = inputHeight / lineHeight
        console.log(lines)

        if(lines>6) updateStyling(true)
        else if(lines<=6) updateStyling(false)

        height.current = inputHeight

        console.log("height "+height.current)
        console.log("state "+shouldStyleInput)

    },[input])

    //Not tested
    // Complete markup
    // Display messages
    // Style ChatBox

    const generateDate = () => (new Date()).toLocaleTimeString(undefined,{hour:"2-digit",minute:"2-digit"})

    const sendMessage = (e) =>{
        if(e.preventDefault) e.preventDefault()
        if(input==="" || !/\S/.test(input)) return
        socket.emit("send-message",{message:input,roomID,user})
        const date = generateDate()
        let messageObj = {message:input,user:"Me",date}
        updateChat([...chatMessages,messageObj])
        updateInput("")
        console.log("you submitted")
    }

    const messageReceived = (message) =>{
        const date = generateDate()
        message = {...message,date}
        updateChat([...chatMessages,message])

        if(!open){
            setUnread(num=>num+1)
        }
    }
    UseSocketListener({
        socket:socket,
        socketEvent:"message-received",
        socketFn:messageReceived
    })

    const manageEnter = (e) =>{
        // if(e.key ==="Enter" && e.shiftKey) return updateInput(i=>i+"\n")
        if(e.shiftKey) return
        if(e.key === "Enter" && input !== "" && /\S/.test(input)) return sendMessage(e)
    }
    //

    return (
        <div className={classes.positioner}>
        <Badge
            anchorOrigin={{horizontal:"left",vertical:"top"}}
            badgeContent={isUnread}
            color="secondary"
            invisible={open || isUnread === 0}
        >
            <div onClick={shouldAllowOpen} className={classes.root}>
                {!open && <Typography align="center" className={classes.chatTitle} variant="h5">Chat with your opponent...</Typography>}
                {
                    open && (
                        <React.Fragment>
                            <div onClick={()=>setOpen(false)} className={classes.minimize}>
                            <Remove/>
                            </div>
                            <div className={classes.window}>
                                <div className={classes.messages}>
                                    <MessageBox chatMessages={chatMessages}/>
                                </div>
                                <form className={classes.input} onSubmit={sendMessage}>
                                    <FormControl fullWidth className="potato">
                                        {/* { (!input && shouldLabel) && <InputLabel htmlFor="message-input">Enter your message...</InputLabel>} */}
                                        <Input
                                            multiline
                                            disableUnderline
                                            rowsMax="6"
                                            autoComplete="off"
                                            inputRef={inputBox}
                                            classes={{input:classes.scroll}}
                                            id="message-input"
                                            type="text"
                                            value={input}
                                            inputProps={{placeholder:"Enter your message..."}}
                                            onChange={(e)=>updateInput(e.target.value)}
                                            // onChange={(e)=>manageInput(e)}
                                            onKeyDown={(e)=>manageEnter(e)}
                                            endAdornment={
                                                <InputAdornment position="end">
                                                <IconButton
                                                    type="submit"
                                                    aria-label="toggle password visibility"
                                                    onClick={()=>sendMessage}
                                                    onMouseDown={()=>console.log("yes")}
                                                    className={classes.icon}
                                                >
                                                    <PlaneSVG classProp={classes.SVG}/>
                                                </IconButton>
                                                </InputAdornment>
                                            }
                                        />
                                    </FormControl>
                                </form>
                            </div>
                        </React.Fragment>
                    ) 
                }
            </div>
        </Badge>
        </div>
    )
}

const updateBorderStyles = (color) => ({
    backgroundColor:color,
    borderColor:color,
    borderBottomColor:color
})

const useStyles = makeStyles((theme)=>({
    root:props=>({
        marginLeft:"auto",
        boxSizing:"border-box",
        // border: "8px solid red",
        // backgroundColor:"rgba(70,70,70)",
        // borderTop:0,
        // borderBottom:"6px solid rgba(70,70,70)",
        // borderColor:"rgba(70,70,70)",
        ...updateBorderStyles("rgba(0,150,145)"),
        border:0,
        minWidth:"25vw",
        width:"320px",
        minHeight:"24px",
        maxHeight:"62vh",
        // position:"fixed",
        // right:"0",
        // bottom:"0",
        "&:hover":props=>({
            backgroundColor:(!props.open ? "blue" : ""),
            borderColor:(!props.open ? "blue" : "")
        })
        // "&:hover":{backgroundColor:"violet"}
    }),
    chatTitle:{
        fontSize:"1.1rem",

    },
    positioner:{
        position:"fixed",
        right:"0",
        bottom:"0",
        height:"auto",
        width:"auto"
    },
    toggler:{
        height:"100%",
        width:"100%",
        "&:hover":props=>({
            backgroundColor:(!props.open && "blue")
        })

    },
    minimize:{
        cursor:"pointer",
        marginLeft:"auto",
        marginRight:"6px",
        maxWidth:"20px"
    },
    window:{
        minheight:"50vh",
        // backgroundColor:"rgba(0,0,255,0.7)",
        width:"100%",
        display:"flex",
        flexDirection:"column",
        justifyContent:"flex-end"
    },
    messages:{
        minHeight:75,
        maxHeight:"36vh",
        backgroundColor:"gainsboro",
        overflowY:"auto",
        ...ScrollBar("&","rgba(52,52,52,0.4)")
    },
    input:{
        height:"20%",
        // backgroundColor:"skyblue",
        backgroundColor:"#F2F2F2",
        padding:"0 0.25rem"
    },
    scroll:props=>({
        overflowY:"auto !important",
        border: (props.shouldStyleInput && "1px solid black"),
        ...ScrollBar("&")
    }),
    SVG:{
        height:20,
        width:20,
        transform:"rotate(50deg)",
        // "&:hover":{
        //     color:"green"
        // }
    },
    icon:{
        "&:hover":{
            color:"green",
            backgroundColor:"inherit"
        }
    }
})
)
//#ffb74d
//#fb8c00


export default ChatBox
