"use client";
import Footer from "@/components/Footer"
import Navbar from "@/components/Navbar"
import { myAppHook } from "@/context/AppUtils";
import { supabase } from "@/lib/supabaseClient";
import Image from "next/image"
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import Swal from "sweetalert2";


interface RoomType{
    id?: number,
    title?: string,
    description?: string,
    mantra?: string,
    banner_image?: string | File | null
}

const formSchema = yup.object().shape({
    title: yup.string().required("Room title is required"),
    description: yup.string().required("Room description is required"),
    mantra: yup.string().required("Room mantra is required")
});

export default function Dashboard(){
    const [previewImage, setPreviewImage] = useState<null>(null);
    const [rooms, setRooms] = useState<RoomType | null>(null)
    const [userId, setUserId] = useState<null>(null)
    const [editId, setEditId] = useState(null);


    const {setAuthToken, setIsLoggedIn, isLoggedIn, setUserProfile, setIsLoading    } = myAppHook()
    const router = useRouter();

    const { register, reset, setValue, handleSubmit, formState: {
        errors
    }} = useForm({
        resolver : yupResolver(formSchema)
    })

    useEffect(() => {

        const handleLoginSession = async() => {
            const {data, error} = await supabase.auth.getSession();
            if(error){
                toast.error("Failed to get user data")
                router.push("/auth/login");
                return;
            }
            setIsLoading(true)
            if(data.session?.access_token){
                console.log(data);
                setAuthToken(data.session?.access_token);
                setUserId(data.session?.user.id);
                localStorage.setItem("access_token", data.session?.access_token);
                setIsLoggedIn(true);
                setUserProfile({
                    name: data.session.user?.user_metadata.fullName,
                    email: data.session.user?.user_metadata.email,
                    gender: data.session.user?.user_metadata.gender,
                    phone: data.session.user?.user_metadata.phone,
                });
                // toast.success("User logged in successfully!")
                localStorage.setItem("user_profile", JSON.stringify({
                    name: data.session.user?.user_metadata.fullName,
                    email: data.session.user?.user_metadata.email,
                    gender: data.session.user?.user_metadata.gender,
                    phone: data.session.user?.user_metadata.phone,
                }))
                fetchRoomsFromTable(data.session.user.id);
            }
            setIsLoading(false)
        }
        handleLoginSession();
        if(!isLoggedIn){
            router.push("/auth/login");
            return;
        }
    }, []);
    // Upload Banner Image
    const uploadImageFile = async (file : File) => { // banner.jpg
        const fileExtension = file.name.split(".").pop();
        const fileName = `${ Date.now() }.${ fileExtension}`;
    
        const {data, error} = await supabase.storage.from("room-images").upload(fileName, file)
        if(error){
            toast.error("Failed to upload banner image");
            return null;
        }
        return supabase.storage.from("room-images").getPublicUrl(fileName).data.publicUrl;
    }
    // Form Submit
    const onFormSubmit = async (formData: any) => {
        
        setIsLoading(true)
        let imagePath = formData.banner_image;
        
        if(formData.banner_image instanceof File){
            imagePath = await uploadImageFile(formData.banner_image);
            if(!imagePath) return;
        }

        //  Para nis edit2 nga part
        if(editId){
            // diri i edit
            const {
                data, error
            } = await supabase.from("rooms").update({
                ...formData,
                banner_image: imagePath
            }).match({
                id: editId,
                user_id: userId
            })

            if(error){
                toast.error("Failed to update product data");
            }else{
                toast.success("Room has been updated successfully");
            }
        } else{
            // Create the room 
            const {data, error} = await supabase.from("rooms").insert({
                ...formData,
                user_id: userId,
                banner_image: imagePath
            });
            if(error){
                console.error("Insert error:", error);
                toast.error("Failed to Create Room");
            }else{
                toast.success("Successfully Created Room!");
            }
            reset()
        }
        
        
        setPreviewImage(null)
        fetchRoomsFromTable(userId!);
        setIsLoading(false)
    }

    const fetchRoomsFromTable = async (userId: string) =>{
        setIsLoading(true)
        const {data, error} = await supabase.from("rooms").select("*").eq("user_id", userId);
        // console.log(data);
        if(data){
            setRooms(data);
        }
        setIsLoading(false)
    }

    // Edit data 
    const handleEditData = ( room: RoomType) => {
        console.log(room);
        setValue( "title", room.title)
        setValue( "description", room.description)
        setValue( "mantra", room.mantra)
        setValue( "banner_image", room.banner_image)
        setPreviewImage(room.banner_image)
        setEditId(room.id!)
    }

    // Delete Room Operation ni diri naa raniy template 
    const handleDeleteData = ( id: number) => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        }).then (async (result) => {
            if (result.isConfirmed) {
                const {data, error} = await supabase.from("rooms").delete().match({
                    id: id,
                    user_id: userId
                })
                if(error){
                    toast.error("Failed to delete room.")
                }else{
                    toast.success("Room deleted successfully.")
                    fetchRoomsFromTable(userId!)
                }
            }
        });

    }

    return <>
        <Navbar/>
        <div className="container mt-5">
            <div className="row">
            <div className="col-md-5">
                <h3>{ editId ? "Edit Room" : "Create Room"} </h3>
                <form onSubmit={ handleSubmit(onFormSubmit)}>
                <div className="mb-3">
                    <label className="form-label">Title</label>
                    <input type="text" className="form-control" { ...register("title") } />
                    <small className="text-danger">{ errors.title?.message }</small>
                </div>
                <div className="mb-3">
                    <label className="form-label">Description </label>
                    <textarea className="form-control" { ...register("description") }></textarea>
                    <small className="text-danger">{ errors.description?.message }</small>
                </div>
                <div className="mb-3">
                    <label className="form-label">Mantra</label>
                    <input type="text" className="form-control"  { ...register("mantra") }/>
                    <small className="text-danger">{ errors.mantra?.message }</small>
                </div>
                <div className="mb-3">
                    <label className="form-label">Banner Image</label>
                    <div className="mb-2">
                        {
                            previewImage ? (<Image src={previewImage} alt="Preview" id="bannerPreview" width="100" height="100" />)
                            : ""
                        }
                    </div>
                    <input type="file" className="form-control" onChange={ (event) =>{
                        setValue("banner_image", event.target.files[0]);
                        setPreviewImage(URL.createObjectURL(event.target.files[0]));
                    }}/>
                    <small className="text-danger"></small>
                </div>
                <button type="submit" className="btn btn-success w-100">
                    { editId ? "Update Room" : "Create Room"}
                </button>
                </form>
            </div>
        
            <div className="col-md-7">
                <h3>Room List</h3>
                <table className="table table-bordered">
                <thead>
                    <tr>
                    <th>Title</th>
                    <th>Description</th>
                    <th>Mantra</th>
                    <th>Banner Image</th>
                    <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        rooms ?  rooms.map ( (singleRoom, index) => (
                            <tr key = { index }>
                            <td>{ singleRoom.title }</td>
                            <td>{ singleRoom.description }</td>
                            <td>{ singleRoom.mantra }</td>
                            <td>
                                {
                                    singleRoom.banner_image ? (<Image src={ singleRoom.banner_image} alt="Sample Product" width="50" height="50" />
                                    ): ("--")
                                }
                            </td>
                            <td>
                                <button className="btn btn-primary btn-sm" onClick={ () => handleEditData(singleRoom)}>Edit</button>
                                <button className="btn btn-danger btn-sm" style={{ marginLeft: "10px"}} onClick = { () => handleDeleteData(singleRoom.id!)}>Delete</button>
                            </td>
                            </tr>
                        )): (
                            <tr>
                                <td colSpan={5} className="text-center">No Rooms found.</td>
                            </tr>
                        )
                    }
                    
                </tbody>
                </table>
            </div>
            </div>
         </div>
        <Footer/>
    </>
}