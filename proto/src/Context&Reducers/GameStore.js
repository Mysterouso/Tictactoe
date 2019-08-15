import React from 'react'
import {gameReducer,initialState} from './GameReducer'

//will only work below the UserStore.

export const GameCTX = React.createContext({})

const GameStore = ({children}) => {

    const game = React.useReducer(gameReducer,initialState)

    return (
        <GameCTX.Provider value={game}>
            {children}
        </GameCTX.Provider>
    )

}

export default GameStore
