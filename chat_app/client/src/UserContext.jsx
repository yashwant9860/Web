import { createContext, useEffect, useState } from "react";

export const UserContext = createContext({});
export function UserContextProvider({children}){
    const [username,setUsername] = useState('');
    const [id,setId] = useState('');
    useEffect(()=>{
        fetch('http://localhost:4000/profile',{
            method:'GET',
            headers: {
                'Content-Type': 'application/json', 
              },
              credentials: 'include',
        }).then(response => response.json()) // Parse the JSON data here
        .then(data => {
            setId(data.userData.userId);
            setUsername(data.userData.username);
        })
    },[username]);
    return(
        <UserContext.Provider value={{username,setUsername,id,setId}} >
            {children}
        </UserContext.Provider>
    )
}
