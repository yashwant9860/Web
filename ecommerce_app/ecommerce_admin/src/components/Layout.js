"use client";
import { useSession, signIn, signOut } from 'next-auth/react';
import Nav from '@/components/Nav';
export default  function Layout({children}) {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <p>Loading...</p>;
  }
  if(session){
    return(
      <div className="bg-blue-900 min-h-screen flex">
        <Nav></Nav>
        <div  className={"bg-white flex-grow mt-1 mr-2 mb-2 rounded-lg p-4 "}>
            {children}
        </div>
      </div>
    )
  }
  else{
    return (
      <div className="bg-blue-900 w-screen h-screen flex items-center">
        <div className="text-center w-full">
          <button onClick={()=>signIn('google')} className="bg-white p-2 px-4 rounded-lg">Login with Google</button>
        </div>
      </div>
    )
  }
  
}
