"use client"
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { myAppHook } from "@/context/AppUtils";
export default function Profile(){
    const { userProfile } = myAppHook();
    return <>
        <Navbar/>
        {
            userProfile ? (
                <div className="container mt-5">
                    <h2>Profile</h2>
                    <div className="card p-4 shadow-sm">
                        <p><strong>Name: </strong> { userProfile?.name } </p>
                        <p><strong>Email: </strong> { userProfile?.email }</p>
                        <p><strong>Phone: </strong> { userProfile?.phone } </p>
                        <p><strong>Gender: </strong> { userProfile?.gender } </p>
                    </div> 
                </div>
            ) : (
                <p> No Profile Found</p>
            )
        }
        <Footer/>
    </>
}