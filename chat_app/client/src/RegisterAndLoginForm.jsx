import {useContext, useState} from "react";
import axios from "axios";
import { UserContext } from "./UserContext";
export default function RegisterAndLoginForm(){

    const [username,setUsername] = useState('');
    const [password,setPassword] = useState('');
    const [isLoginOrRegister,setIsLoginOrRegister] = useState('login');
    const {setUsername:setLoggedInUsername,setId}=useContext(UserContext);
    async function handleSubmit(ev){
        ev.preventDefault();
        const url = isLoginOrRegister === 'register'?'register':'login';

        try {
            const response = await fetch("http://localhost:4000/"+url, {
                method: 'POST', 
                headers: {
                  'Content-Type': 'application/json', 
                },
                body: JSON.stringify({ username, password }), 
                credentials: 'include', 
              });
            const data = await response.json();
            setLoggedInUsername(username);
            setId(data.id);
             
          } catch (error) {
            console.error('Registration failed:', error);
          }
    }
    return(
        <div className="bg-blue-50 h-screen flex items-center">
            <form className="w-64 mx-auto mb-12" onSubmit={handleSubmit}>
                <input type="text" value={username}
                        placeholder='username' onChange={ev=>setUsername(ev.target.value)}
                        className="block w-full rounded-sm p-2 mb-2 border" />
                <input type="password" 
                        value={password}
                        onChange={ev=>setPassword(ev.target.value)}
                        placeholder="password" className="block w-full rounded-sm p-2 mb-2 border"/>
                <button className="bg-blue-500 text-white block w-full rounded-sm p-2">
                  {isLoginOrRegister==='register'?'Register':'Login'}
                </button>
                <div className="text-center mt-2">
                   
                  {isLoginOrRegister === 'register' && (
                    <div>
                      Already Registered ?
                      <button className="ml-1"  onClick={()=>setIsLoginOrRegister('login')}>
                      Login
                      </button>
                    </div>
                  )}
                  {isLoginOrRegister === 'login' &&(
                  <div>
                      Dont have account ?
                      <button className="ml-1" onClick={()=>setIsLoginOrRegister('register')}>
                      Register
                      </button>
                  </div>
                  )}
                  
                </div>
            </form>
        </div>
    )
}