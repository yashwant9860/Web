import {useState} from "react";
import axios from "axios";
export default function Register(){

    const [username,setUsername] = useState('');
    const [password,setPassword] = useState('');
    async function register(ev){
        ev.preventDefault();
        try {
            const response = await fetch("http://localhost:4000/register", {
                method: 'POST', 
                headers: {
                  'Content-Type': 'application/json', 
                },
                body: JSON.stringify({ username, password }), 
                credentials: 'include', 
              });
             
          } catch (error) {
            console.error('Registration failed:', error); 
          }
    }
    return(
        <div className="bg-blue-50 h-screen flex items-center">
            <form className="w-64 mx-auto mb-12" onSubmit={register}>
                <input type="text" value={username}
                        placeholder='username' onChange={ev=>setUsername(ev.target.value)}
                        className="block w-full rounded-sm p-2 mb-2 border" />
                <input type="password" 
                        value={password}
                        onChange={ev=>setPassword(ev.target.value)}
                        placeholder="password" className="block w-full rounded-sm p-2 mb-2 border"/>
                <button className="bg-blue-500 text-white block w-full rounded-sm p-2">Register</button>
            </form>
        </div>
    )
}