import React,{createContext} from 'react';
import io from 'socket.io-client';

export const UserCTX = createContext()

const initialState = {
    user:"",
    opponent:"",
    roomID:""   
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
        default:
            return state
    }
}

let socket;


export const Store = ({children}) =>{

    if(!socket){
        socket = io(process.env.REACT_APP_SERVER);

        //General
        socket.on("player-disconnected",()=>console.log("ze disconnect tho"))  
    }

    const [state,dispatch] = React.useReducer(reducer,initialState)

    return(
        <UserCTX.Provider value={[state,dispatch,socket]}>
            {children}
        </UserCTX.Provider>
    )
} 


