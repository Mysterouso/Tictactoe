import React from 'react'
import Navigation from './Navigation'
import Game from './Game'

const MainUI = ({turn}) => {
    return (
        <React.Fragment>
            {/* <Navigation/> */}
            <div>
                Greetings from MainUI
                <Game turn={turn}/>
            </div>
        </React.Fragment>
    )
}

export default MainUI
