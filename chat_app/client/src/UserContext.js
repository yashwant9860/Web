import { createContext } from "react";

export const UserContext = createContext({});
export function UserContextProvider({children}){
    const [username,setUsername] = useState('');
    return(
        <UserContextProvider >{children}</UserContextProvider>
    )
}