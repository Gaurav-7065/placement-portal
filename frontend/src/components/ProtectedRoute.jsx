import { Children, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useLocation,Navigate } from "react-router-dom";

export const ProtectRoute=({ children })=>{
    const [token,loading]=useContext(AuthContext);
    const location=useLocation();

    if(loading){
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <span className="loading loading-spinner text-violet-600 loading-lg"></span>
            </div>
        );
    }
    if(!token){
        return <Navigate to='/login' state={{from:location}} replace/>;
    }
    return children
}