import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

export default function Profile(){
    return <>
        <Navbar/>
        <div className="container mt-5">
            <h2>Profile</h2>
            <div className="card p-4 shadow-sm">
                <p><strong>Name:</strong> N/A</p>
                <p><strong>Email:</strong> </p>
                <p><strong>Phone:</strong> N/A</p>
                <p><strong>Gender:</strong> N/A</p>
            </div>
            <p>Loading profile...</p>
        </div>
        <Footer/>
    </>
}