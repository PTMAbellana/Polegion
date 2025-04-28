"use client";
import React, { createContext, useContext, useEffect, useState } from "react";

interface AppUtilsType{
    isLoggedIn : boolean,
    setIsLoggedIn: (state:boolean) => void
    setAuthToken: (state:null) => void

}

const AppUtilsContext = createContext<AppUtilsType|undefined>(undefined)

export const AppUtilsProvider = ({children}: {children: React.ReactNode}) => {
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false)
    const[authToken, setAuthToken] = useState<null|string>(null)

    useEffect( () => {
        const token = localStorage.getItem("access_token");
        if(token){
            setAuthToken(token);
            setIsLoggedIn(true);
        }
    }, [])
    return (
        <AppUtilsContext.Provider value = {{ isLoggedIn , setAuthToken, setIsLoggedIn}} >
            {children}
        </AppUtilsContext.Provider>
    );
}

export const myAppHook = () => {
    const context = useContext(AppUtilsContext);
    if(!context){
        throw new Error("App Utils functions must be wrapped inside AppUtils Provider");
    }
    return context;
}