export const initialState = {
    myTurn:false,
    winCounter:0,
    gameOver:false,
    winningPlayer:"",
    boardState:Array(3).fill(Array(3).fill(""))
}

export const gameReducer = (state,action) => {
    switch(action.type){
        case "UPDATE_BOARD":
            const {position,sign} = action.payload
            const [x,y] = position
            const newState = JSON.parse(JSON.stringify(state.boardState))
            newState[x][y] = sign
            return{
                ...state,
                winCounter:(state.winCounter + 1),
                boardState:newState,
                myTurn: !state.myTurn
            }
        case "UPDATE_GAME_OVER":
            return{
                ...state,
                gameOver:true,
                winningPlayer:action.payload,
                myTurn:false
            }
        case "UPDATE_TURN":
            return{
                ...state,
                myTurn: action.payload !== undefined ? action.payload : !state.myTurn
            }
        default:
            return state
    }
}