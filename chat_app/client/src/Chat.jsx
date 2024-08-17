import { useContext, useEffect, useState } from "react"
import Avatar from "./Avatar";
import Logo from "./Logo";
import { UserContext } from "./UserContext";
import uniqBy from 'lodash/uniqBy';
import { useRef } from "react";
import Contact from "./Contact";
export default function Chat(){
    const [ws,setWs] = useState(null);
    const [onlinePeople , setOnlinePeople] = useState({});
    const [selectedUserId,setSelectedUserId] = useState(null);
    const [newMessageText,setNewMessageText] = useState('');
    const {username,id,setId,setUsername} = useContext(UserContext);
    const [messages,setMessages] = useState([]);
    const [offlinePeople,setOfflinePeople] = useState({})
    const divUnderMessages = useRef();
    useEffect(()=>{
        connectToWs();
    },[]);
    function connectToWs(){
        const ws = new WebSocket('ws://localhost:4000');
        setWs(ws);
        ws.addEventListener('message',handleMessage);
        ws.addEventListener('close',()=> {
            setTimeout(()=>{
                console.log('Disconnected.Trying to reconnect');
                connectToWs();
            },1000);
        } );
    }
    function showOnlinePeople(peopleArray)
    {
        const people = {};
        peopleArray.forEach(({userId,username})=>{
            people[userId]  = username;
        });
        
        setOnlinePeople(people);
    }
    function handleMessage(ev){
        const messageData = JSON.parse(ev.data);
        // console.log({ev,messageData});
        if('online' in messageData)
        {
            // console.log(messageData);
            showOnlinePeople(messageData.online);
        }
        else if('text' in messageData)
        {
            if(messageData.sender === selectedUserId)
            {
                setMessages(prev=>([...prev,{...messageData}]));
            }             
        }
    }
    function sendMessage(ev,file=null){
        if(ev)ev.preventDefault();
        
        ws.send(JSON.stringify({
            recipient:selectedUserId,
            text: newMessageText,
            file,
        }));
        

        if(file){
            fetch('http://localhost:4000/messages/'+selectedUserId,{
                method:'GET',
                headers: {
                    'Content-Type': 'application/json', 
                  },
                  credentials: 'include',
            }).then(res=>res.json()).then(data=>{
                
                setMessages(data.data);
            })
        }
        else{
            setNewMessageText('');
            setMessages(prev=>([...prev 
                ,{text:newMessageText,
                sender:id,
                recipient:selectedUserId,
                _id:Date.now(),

            }]));
        }
        

    }
    function logout(){
        fetch('http://localhost:4000/logout',{
            method:'POST',
            credentials:'include',
            headers:{
                'Content-Type':'application/json',
            }
        }).then(()=>{
            setWs(null);
            setId(null);
            setUsername(null);
        })
    }
    function sendFile(ev){
        const reader = new FileReader();
        reader.readAsDataURL(ev.target.files[0]);
        reader.onload = ()=>{
            sendMessage(null,{
                data:reader.result,
                name:ev.target.files[0].name,

            });
        }
    }

    useEffect(()=>{
        const div = divUnderMessages.current;
        if(div){
        div.scrollIntoView({behavior:'smooth',block:'end'});
        }
    },[messages]);

    useEffect(()=>{
        fetch('http://localhost:4000/people',{
            method:'GET',
            credentials:'include',
            headers:{
                'Content-Type':'application/json',
            }
        }).then(res=>res.json()).then(res=>{
            const offlinePeopleArr = res.
            filter(p=>p._id!==id)
            .filter(p=> !Object.keys(onlinePeople).includes(p._id));
            const offlinePeople = {};
            offlinePeopleArr.forEach(p=>{
                offlinePeople[p._id] = p;
            });
            
            setOfflinePeople(offlinePeople);
        })
    },[onlinePeople]);

    useEffect(()=>{
        if(selectedUserId){
            fetch('http://localhost:4000/messages/'+selectedUserId,{
                method:'GET',
                headers: {
                    'Content-Type': 'application/json', 
                  },
                  credentials: 'include',
        }).then(res=>res.json()).then(data=>{
            setMessages(data);
        })

        }
    },[selectedUserId]);
    const onlinePeopleExclOurUser = {...onlinePeople};
    delete onlinePeopleExclOurUser[id];

    const messagesWithoutDupes = uniqBy( messages ,'_id');

    return (
        <div className="flex h-screen ">
            <div className="bg-white w-1/3 flex flex-col">
            <div className="flex-grow">
                <Logo></Logo>
                {Object.keys(onlinePeopleExclOurUser).map(userId=>(
                    <Contact 
                    key = {userId}
                    id={userId} 
                    online = {true}
                    username={onlinePeopleExclOurUser[userId]}
                    onClick={()=>setSelectedUserId(userId)}
                    selected = {userId == selectedUserId}></Contact>
                ))}
                {Object.keys(offlinePeople).map(userId=>(
                    <Contact 
                    key = {userId}
                    id={userId} 
                    online = {false}
                    username={offlinePeople[userId].username}
                    onClick={()=>setSelectedUserId(userId)}
                    selected = {userId == selectedUserId}></Contact>
                ))}
            </div>
                
                <div className="p-2 text-center flex items-center justify-center">
                    <span className="mr-2 text-sm text-gray-600 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-4">
                        <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z" clipRule="evenodd" />
                        </svg>

                        {username}
                    </span>
                    <button
                        onClick={logout} 
                        className="text-sm text-gray-700 bg-blue-200 py-1 px-2 border rounded-sm">Logout</button>
                </div>
            </div>
            <div className="flex flex-col bg-blue-100 w-2/3 p-2">
                <div className="flex-grow">
                    {!selectedUserId && (
                        <div className="flex h-full items-center justify-center">
                            <div className="text-gray-400  ">
                            &larr; Select a person from sidebar
                            </div>
                        </div>
                    )}
                    {!!selectedUserId && (
                        
                        <div className="relative h-full ">
                        <div className="overflow-y-scroll absolute inset-0 top-0 right-0 bottom-2 left-0">
                            {messagesWithoutDupes.map(message=>(
                                <div key={message._id} className={(message.sender===id?'text-right':"text-left")}>
                                <div className=
                                {"text-left inline-block p-2 my-2 rounded-md text-sm "+(message.sender === id?
                                'bg-blue-500 text-white':'bg-white text-gray-500')}>
                                
                                {message.text}
                                {message.file &&(
                                    <div className="flex items-center gap-1">
                                        <a className="flex items-center underline" href = {"http://localhost:4000/uploads/"+message.file}>
                                        {message.file}
                                        </a>
                                    </div>
                                )}
                                </div>
                                </div>
                            ))}
                            <div ref={divUnderMessages}></div>
                        </div>
                        </div>
                        
                        
                        
                    )}
                    
                </div>
                {!!selectedUserId && (
                    <form className="flex gap-2 " onSubmit={sendMessage}>
                        <input type="text" value={newMessageText}
                        onChange={ev=>setNewMessageText(ev.target.value)} placeholder="type message" 
                        className="bg-white flex-grow border p-2 rounded-sm" />
                        <label className="bg-blue-400 p-2 cursor-pointer text-white rounded-sm border border-blue-300">
                            <input type="file" className="hidden" onChange={sendFile} />
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-5">
                            <path fillRule="evenodd" d="M15.621 4.379a3 3 0 0 0-4.242 0l-7 7a3 3 0 0 0 4.241 4.243h.001l.497-.5a.75.75 0 0 1 1.064 1.057l-.498.501-.002.002a4.5 4.5 0 0 1-6.364-6.364l7-7a4.5 4.5 0 0 1 6.368 6.36l-3.455 3.553A2.625 2.625 0 1 1 9.52 9.52l3.45-3.451a.75.75 0 1 1 1.061 1.06l-3.45 3.451a1.125 1.125 0 0 0 1.587 1.595l3.454-3.553a3 3 0 0 0 0-4.242Z" clipRule="evenodd" />
                            </svg>

                        </label>
                        <button type="submit" className="bg-blue-500 p-2 text-white rounded-sm">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
                            </svg>
                        </button>
                    </form>
                )}
                
            </div>
        </div>
    )
}