"use client"; 

import { useCurrentUser } from "@/hooks/auth/useCurrentUser"
import { useLogout } from "@/hooks/auth/useLogout";


export default function  Profile(){
    const {user:currentUser} =useCurrentUser();
    const {logout} = useLogout();
    return (
    <div className="w-screen h-screen flex flex-col items-center justify-center">
        <p className="font-bold text-2xl">Welcome back</p>
        <div className="font-semibold"> You are {currentUser?.name}</div>
        <button
            onClick = {()=> logout()}>
            Logout
        </button>
    </div>
    )
}