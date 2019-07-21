import React,{createContext} from 'react';

export const UserID = createContext()

export const UserContext = ({children}) =>{

    const [user,updateUser] = React.useState('Super')

    return(
        <UserID.Provider value={{user,updateUser}}>
            {children}
        </UserID.Provider>
    )
} 


