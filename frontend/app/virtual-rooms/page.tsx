"use client"
import Loader from '@/components/Loader'
import { ROUTES } from '@/constants/routes'
import { myAppHook } from '@/context/AppUtils'
import { AuthProtection } from '@/context/AuthProtection'
import { createRoom, getAllRoomCodes, getRooms } from '@/lib/apiService'
// import styles from '@/styles/dashboard.module.css'
import styles from '@/styles/room.module.css'
import { yupResolver } from '@hookform/resolvers/yup'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import Swal from 'sweetalert2'
import * as yup from 'yup'

interface RoomType {
    id?: number
    title: string
    description: string
    mantra: string
    banner_image: string | File | null
    code: string
    created_at: string
}

interface EditCreateFormData {
    title: string
    description: string
    mantra: string
    banner_image?: string | File | null
}

function generateRoomCode(length = 6) {
  // Use letters and numbers, excluding similar-looking characters
  const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ123456789';
  let result = '';
  
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  
  return result;
}


const formSchema = yup.object().shape({
  title: yup.string().required("Room title is required"),
  description: yup.string().required("Room description is required"),
  mantra: yup.string().required("Room mantra is required")
})

export default function VirtualRooms() {
    const router = useRouter()
    const { isLoggedIn, userProfile } = myAppHook()
    const { isLoading: authLoading } = AuthProtection()

    const [ rooms, setRooms ] = useState<RoomType[]>([])
    const [ roomId, setRoomId ] = useState(null)
    const [ previewImage, setPreviewImage ] = useState(undefined)
    const [ isLocalLoading, setLocalLoading ] = useState(false)

    useEffect(() => {
        console.log('isLoggedin ', isLoggedIn)
        console.log('authLoading ', authLoading)
        if (
            isLoggedIn && 
            !authLoading
        ) fetchRoomsFromTable(userProfile?.id)
        else {
            if (authLoading) fullLoader()
            if (!isLoggedIn) fullLoader()
        }
    }, [isLoggedIn, authLoading])

    const fullLoader = () => {
        console.log('Virtual Rooms: Auth is still loading')
        return (
            <div className={styles["loading-container"]}>
                <Loader/>
            </div>
        )
    }

    const fetchRoomsFromTable = async (userId: string | undefined) => {
        console.log(userId)
        if (!userId) toast.error('No current user')
        try {
            setLocalLoading(true)
            const response = await getRooms()
            console.log('fetch rooms data ', response.data)
            if (response && response.data) setRooms(response.data)
            else console.error('Failed to get rooms or empty response')
        } catch (error){
            console.error('Error in fetching rooms: ', error)
        } finally {
            setLocalLoading(false)
        }
    }

    const createUniqueRoomCode = async () => {
        let isUnique = false;
        let newCode = "";
        let attempts = 0;
        const maxAttempts = 20; // Prevent infinite loops
        
        while (!isUnique && attempts < maxAttempts) {
            newCode = generateRoomCode();
            attempts++;
            
            console.log(`Checking code: ${newCode} (attempt ${attempts})`);

            try {
                const response = await getAllRoomCodes(newCode);
                console.log('Room code check response:', response);
                
                // Check if the response indicates the code is unique
                if (response && response.data && response.data.unique === true) {
                    isUnique = true;
                    console.log(`Unique code found: ${newCode}`);
                    return newCode;
                } else {
                    console.log(`Code ${newCode} already exists, generating new one...`);
                    isUnique = false;
                }
            } catch (error) {
                // If we get a 409 status (conflict), it means code exists
                if (error.response && error.response.status === 409) {
                    console.log(`Code ${newCode} already exists (409 response)`);
                    isUnique = false;
                } else {
                    console.error('Error checking room code:', error);
                    throw error;
                }
            }
        }
        
        if (attempts >= maxAttempts) {
            throw new Error('Failed to generate unique room code after maximum attempts');
        }
        
        return newCode;
    }

    // const createUniqueRoomCode = async () => {
    //     let isUnique = false;
    //     let newCode = "";
        
    //     while (!isUnique) {
    //         newCode = generateRoomCode();
            
    //         console.log(newCode)

    //         try {
    //             const res = await getAllRoomCodes(newCode)
    //             console.log(res)
    //             if (res) {

    //                 isUnique = true
    //                 return newCode;
    //             } else {
    //                 isUnique = false
    //             }
 
    //         } catch (error){
    //             throw error
    //         }

    //         // // Check if code exists in database
    //         // const { data, error } = await supabase
    //         //     .from("rooms")
    //         //     .select("code")
    //         //     .eq("code", newCode);
                
    //         // if (error) {
    //         //     console.error("Error checking room code:", error);
    //         //     toast.error("Failed to generate room code");
    //         //     return null;
    //         // }
            
    //         // // If no data returned, code is unique
    //         // if (data.length === 0) {
    //         //     isUnique = true;
    //         // }
    //     }
    // }

    const uploadImageFile = async (file: File) => {
        const fileExtension = file.name.split(".").pop();
        const fileName = `${Date.now()}.${fileExtension}`;

        // const { data, error } = await supabase.storage.from("room-images").upload(fileName, file);
        // if (error) {
        //     toast.error("Failed to upload banner image");
        //     return null;
        // }
        // return supabase.storage.from("room-images").getPublicUrl(fileName).data.publicUrl;
        return fileName
    }

    const { 
        register, 
        reset, 
        setValue, 
        handleSubmit, 
        formState: { 
            errors 
        }
    } = useForm<EditCreateFormData>({
        resolver: yupResolver(formSchema)
    })

    const onFormSubmit = async (formData: any) => {
        setLocalLoading(true);
        let imagePath = formData.banner_image;

        if (formData.banner_image instanceof File) {
            imagePath = await uploadImageFile(formData.banner_image);
            if (!imagePath) {
                setLocalLoading(false);
                return;
            }
        }

        if (roomId) {
            // const { data, error } = await supabase.from("rooms").update({
            //     ...formData,
            //     banner_image: imagePath
            // }).match({
            //     id: editId,
            //     user_id: userId
            // });

            // if (error) {
            //     toast.error("Failed to update room data");
            // } else {
            //     toast.success("Room has been updated successfully");
            //     setRoomId(null);
            // }
        } else {
        // Generate unique room code for new rooms
            const newRoomCode = await createUniqueRoomCode();
            if (!newRoomCode) {
                setLocalLoading(false);
                return;
            }

            const {
                title,
                description,
                mantra
            } = formData

            const data = {
                title: title,
                description: description,
                mantra: mantra,
                banner_image: imagePath
            }

            try {
                const res = await createRoom({
                    data
                })
                console.log(res)
                // toast.success('Room created successfully')
                Swal.fire({
                title: "Room Created!",
                html: `Your room join code is: <strong>${newRoomCode}</strong><br/>Share this code with others to let them join your room.`,
                icon: "success",
                confirmButtonText: "Got it!"
                });
            } catch (error){
                toast.error('Create room failed')
                throw error
            }
        
            // const { data, error } = await supabase.from("rooms").insert({
            //     ...formData,
            //     user_id: userId,
            //     banner_image: imagePath,
            //     code: newRoomCode
            // });
        
            // if (error) {
            //     console.error("Insert error:", error);
            //     toast.error("Failed to Create Room");
            // } else {
            //     toast.success("Successfully Created Room!");
            //     // Show the join code to the user
            // }
            reset();
        }

        setPreviewImage(undefined);
        fetchRoomsFromTable(userProfile?.id);
        setLocalLoading(false);
    };

    const handleViewRoom = (roomCode: string | undefined, roomId: number | undefined) => {
        console.log('view code ', roomCode)
        console.log('view id ', roomId)
        if (!roomCode) toast.error('No room code')
        else router.push(`${ROUTES.VIRTUAL_ROOMS}/${roomCode}`)
    }

    const handleEditData = (room: RoomType) => {
        setValue("title", room.title);
        setValue("description", room.description);
        setValue("mantra", room.mantra);
        setValue("banner_image", room?.banner_image);
        setPreviewImage(room.banner_image);
        setRoomId(room.id);
        
        // Scroll to form
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }

    const handleCancelEdit = () => {
        reset()
        setPreviewImage(undefined)
        setRoomId(null)
    }

    const handleDeleteData = (roomId: number | undefined) => {
        Swal.fire({
                title: "Are you sure?",
                text: "You won't be able to revert this!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Yes, delete it!"
            }).then(async (result) => {
                if (result.isConfirmed) {
                    console.log('perform delete room here')
                    console.log('trying to delete: ', roomId)
                    // const { data, error } = await supabase.from("rooms").delete().match({
                    //     id: roomId,
                    //     user_id: userProfile?.id
                    // });
                    // if (error) {
                    //     toast.error("Failed to delete room.");
                    // } else {
                    //     toast.success("Room deleted successfully.");
                    //     fetchRoomsFromTable(userProfile?.id);
                    // }
                }
        })
    }

    return (
        <div className={styles['dashboard-container']}>
            <div className={styles["main-content"]}>
                <div className={styles["welcome-section"]}>
                    <h1>Virtual Rooms</h1>
                </div>

                {isLocalLoading ? (
                    <div className={styles["loading-indicator"]}>Loading...</div>
                    ) : (
                    <div className={styles["dashboard-grid"]}>
                        {/* Form Card */}
                        <div className={`${styles.card} ${styles["room-form-card"]}`}>
                        <h3>{roomId ? "Edit Room" : "Create Room"}</h3>
                        <form onSubmit={handleSubmit(onFormSubmit)}>
                            <div className={styles["form-group"]}>
                            <label>Title</label>
                            <input 
                                type="text" 
                                className={`${styles["form-control"]} ${errors.title ? styles.error : ''}`} 
                                {
                                    ...register("title")
                                } 
                            />
                            {errors.title && <small className={styles["error-message"]}>{errors.title.message}</small>}
                            </div>
                            
                            <div className={styles["form-group"]}>
                            <label>Description</label>
                            <textarea 
                                className={`${styles["form-control"]} ${errors.description ? styles.error : ''}`} 
                                {
                                    ...register("description")
                                }
                            ></textarea>
                            {errors.description && <small className={styles["error-message"]}>{errors.description.message}</small>}
                            </div>
                            
                            <div className={styles["form-group"]}>
                            <label>Mantra</label>
                            <input 
                                type="text" 
                                className={`${styles["form-control"]} ${errors.mantra ? styles.error : ''}`} 
                                {
                                    ...register("mantra")
                                }
                            />
                            {errors.mantra && <small className={styles["error-message"]}>{errors.mantra.message}</small>}
                            </div>
                            
                            <div className={styles["form-group"]}>
                            <label>Banner Image</label>
                            {previewImage && (
                                <div className={styles["preview-image"]}>
                                    <img src={previewImage} alt="Preview" width="100" height="100" />
                                </div>
                            )}
                            <input 
                                type="file" 
                                className={styles["form-control"]}
                                onChange={(event) => {
                                if (event.target.files && event.target.files[0]) {
                                    setValue("banner_image", event.target.files[0]);
                                    setPreviewImage(URL.createObjectURL(event.target.files[0]));
                                }
                                }}
                            />
                            </div>
                            
                            <div className={styles["form-actions"]}>
                            {roomId && (
                                <button 
                                    type="button" 
                                    className={styles["cancel-btn"]}
                                    onClick={handleCancelEdit}
                                >
                                Cancel
                                </button>
                            )}
                            <button 
                                type="submit" 
                                className={styles["submit-btn"]}
                                disabled={isLocalLoading}
                            >
                                {isLocalLoading ? "Processing..." : roomId ? "Update Room" : "Create Room"}
                            </button>
                            </div>
                        </form>
                        </div>
                        {/* Room Cards Section - Replaces Previous Adventures */}
                        <div className={styles["room-cards-section"]}>
                        <h2>Your Virtual Rooms</h2>
                        {rooms && rooms.length > 0 ? (
                            <div className={styles["room-cards"]}>
                            {rooms.map((room, index) => (
                                <div className={styles["room-card"]} key={index}>
                                <div className={styles["room-card-banner"]}>
                                    {room.banner_image ? (
                                    <img src={room.banner_image} alt={room.title} />
                                    ) : (
                                    <div className={styles["room-card-banner-placeholder"]}>
                                        No Image
                                    </div>
                                    )}
                                </div>
                                <div className={styles["room-card-content"]}>
                                    <h3 className={styles["room-card-title"]}>{room.title}</h3>
                                    <p className={styles["room-card-description"]}>{room.description}</p>
                                    <p className={styles["room-card-mantra"]}>{room.mantra}</p>
                                    <div className={styles["room-card-actions"]}>
                                    <button
                                        className={styles["view-btn"]}
                                        onClick={() => handleViewRoom(room.code, room.id)}
                                    >
                                        View
                                    </button>
                                    <button
                                        className={styles["edit-btn"]}
                                        onClick={() => handleEditData(room)}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        className={styles["delete-btn"]}
                                        onClick={() => handleDeleteData(room.id)}
                                    >
                                        Delete
                                    </button>
                                    </div>
                                </div>
                                </div>
                            ))}
                            </div>
                        ) : (
                            <div className={styles["no-data"]}>
                            No rooms found. Create your first virtual room!
                            </div>
                        )}
                        </div>
                    </div>
                    )}
                
            </div>
        </div>
    )
}