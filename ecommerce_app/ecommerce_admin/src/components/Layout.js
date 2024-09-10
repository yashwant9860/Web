"use client";
import { useSession, signIn, signOut } from 'next-auth/react';
import Nav from '@/components/Nav';
import { useState } from 'react';
export default  function Layout({children}) {
  const { data: session, status } = useSession();
  const [showNav,setShowNav] = useState(false);
  if (status === "loading") {
    return <p>Loading...</p>;
  }
  if(session){
    return(
      <div className="bg-bgGray min-h-screen">
        <div className="block md:hidden">
        <button type="button" onClick={()=>setShowNav(true)}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
        </svg>

        </button>
        </div>
        <div className="bg-bgGray min-h-screen flex">
        <Nav show= {showNav}></Nav>
        <div  className={" flex-grow  p-4 "}>
            {children}
        </div>
      </div>

      </div>
      
    )
  }
  else{
    return (
      <div className="bg-bgGray w-screen h-screen flex items-center">
        <div className="text-center w-full">
          <button onClick={()=>signIn('google')} className="bg-white p-2 px-4 rounded-lg">Login with Google</button>
        </div>
      </div>
    )
  }
  
}
