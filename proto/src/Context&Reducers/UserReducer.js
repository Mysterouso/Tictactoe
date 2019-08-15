export const initialState = {
    user:"",
    opponent:"",
    roomID:"",
    identifier:"",
    hostPlayer:true   
}


export function reducer(state,action){
    switch(action.type){
        case "UPDATE_USER":
            return{
                ...state,
                user:action.payload
            }
        case "UPDATE_HOST":
            return{
                ...state,
                hostPlayer: action.payload
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