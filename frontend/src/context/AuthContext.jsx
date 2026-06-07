import React, { createContext, useEffect, useState } from "react";


export const AuthContext=createContext(null);

export const AuthProvider=({children})=>{

    const [user,setUser]=useState(null);
    const[token,setToken]=useState(localStorage.getItem('token')||null);
    const[loading,setLoading]=useState(true);

    // Login
    const login=(userData,userToken)=>{
        setToken(userToken);
        setUser(userData);
        localStorage.setItem('user',JSON.stringify(userData));
        localStorage.setItem('token',userToken);
    }
    // logout
    const logout=()=>{
        setToken(null);
        setUser(null);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
    }
    useEffect(()=>{
        const storedUser=localStorage.getItem('user');
        if(token&&storedUser){
            try{
                setUser(JSON.parse(storedUser));
            }
            catch(error){
                    console.error("failed parsing session user context",error);
                    logout();
            }
        }
        setLoading(false);
    },[token]); 

    return <AuthContext.Provider value={{user,token,loading,login,logout}}>
        {!loading&&children}
    </AuthContext.Provider>

}
