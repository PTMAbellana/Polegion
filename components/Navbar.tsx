"use client";
import Link from "next/link";
import { myAppHook } from "@/context/AppUtils";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Image from "next/image";

const Navbar = () => {
    const { isLoggedIn, setIsLoggedIn, setAuthToken } = myAppHook();
    const router = useRouter();

    const handleUserLogout = async() =>{
        localStorage.removeItem("access_token");
        setIsLoggedIn(false);
        setAuthToken(null);
        await supabase.auth.signOut();
        toast.success("User logged out successfully!");
        router.push("/auth/login");
    }
    return <>
        <nav className="navbar navbar-expand-lg px-4" style={ { backgroundColor: "#343a40"}}>
        <Link className="navbar-brand fw-bold text-white" href="/">
        <Image 
            src="/images/polegionLogo.png" 
            alt="Polegion Logo" 
            width={160} // Set the desired width
            height={50} // Set the desired height
        />
        </Link>
        
        {
            isLoggedIn ? (
                <div className="ms-auto">
                    <Link className="me-3 text-white text-decoration-none" href="/auth/dashboard">Dashboard</Link>
                    <Link className="me-3 text-white text-decoration-none" href="/auth/profile">Profile</Link>
                    <button className="btn btn-danger" onClick={ handleUserLogout}>Logout</button>
                </div>
            ) : (
                <div className="ms-auto">
                    <Link className="me-3 text-white text-decoration-none" href="/">Home</Link>
                    <Link className="text-white text-decoration-none" href="/auth/login">Login</Link>
                </div> 
            )
        }
    
    </nav>
    </>
}

export default Navbar; 