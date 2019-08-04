import React,{createContext} from 'react';
import { withRouter } from "react-router";
import io from 'socket.io-client';

// SOCKET TABLE 

// Made to to better decide where to map socket listeners to
// -off flag means that the event is only being listened for while component is rendered

// Join -- on:  "room-created","room" emit: "show-room"
// JoinUI -- on: "invalid-room -off","game-starting -off","player-disconnected" emit: "create-game","join-game"
// Waiting -- on: "matchmaking-left -off","game-starting" emit: "leave-matchmaking"


//Todo move "game-starting" listener here --currently being repeated

export const UserCTX = createContext()

const initialState = {
    user:"",
    opponent:"",
    roomID:"",
    identifier:""   
}


function reducer(state,action){
    switch(action.type){
        case "UPDATE_USER":
            return{
                ...state,
                user:action.payload
            }
        case "UPDATE_OPPONENT":
            return{
                ...state,
                opponent:action.payload
            }
        case "UPDATE_ROOM":
            return{
                ...state,
                roomID:action.payload
            }
        case "UPDATE_IDENTIFIER":
            return{
                ...state,
                identifier:action.payload
            }
        case "UPDATE_MULTIPLE":
            return{
                ...state,
                ...action.payload
            }
        default:
            return state
    }
}

let socket;


const UserStore = ({children,history}) =>{

    const [state,dispatch] = React.useReducer(reducer,initialState)

    if(!socket){
        socket = io(process.env.REACT_APP_SERVER);
    }

    React.useEffect(()=>{

        //Considering
        //Cut join interaction down to two steps
        // game found and game starting
        // game found will let person bail out at last secnd before 
    
        socket.on("game-starting",(room)=>{

            const {roomID,users,userID} = room

            if(roomID !== state.roomID){
                dispatch({type:"UPDATE_MULTIPLE",
                          payload:{
                                roomID,
                                identifier:userID
                                }
                        })
            }
            
            const opponent = users.filter(user=>user.userID !== state.identifier)[0].name
            dispatch({type:"UPDATE_OPPONENT", payload:opponent})
            history.push(`/play/${roomID}`)
        })    

        return () => socket.off("game-starting")   
        
    },[state])

    return(
        <UserCTX.Provider value={[state,dispatch,socket]}>
            {children}
        </UserCTX.Provider>
    )
} 

export const Store = withRouter(UserStore)

