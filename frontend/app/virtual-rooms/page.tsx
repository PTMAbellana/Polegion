"use client"
import Loader from '@/components/Loader'
import { ROUTES } from '@/constants/routes'
import { myAppHook } from '@/context/AppUtils'
import { AuthProtection } from '@/context/AuthProtection'
import { createRoom, updateRoom, getRooms, uploadImage, deleteRoom } from '@/api/rooms'
import { joinRoom } from '@/api/participants'
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

interface JoinRoomFormData {
    roomCode: string
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

const joinRoomSchema = yup.object().shape({
  roomCode: yup.string().required("Room code is required").min(6, "Room code must be at least 6 characters")
})

export default function VirtualRooms() {
    const router = useRouter()
    const { isLoggedIn, userProfile } = myAppHook()
    const { isLoading: authLoading } = AuthProtection()

    const [ rooms, setRooms ] = useState<RoomType[]>([])
    const [ roomId, setRoomId ] = useState<number | undefined>(undefined)
    const [ previewImage, setPreviewImage ] = useState<string | File | null>(null)
    const [ isLocalLoading, setLocalLoading ] = useState(false)
    const [ showJoinModal, setShowJoinModal ] = useState(false)

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

    const fetchRoomsFromTable = async (user_id: string | undefined) => {
        console.log(user_id)
        if (!user_id) toast.error('No current user')
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
        
        while (!isUnique) {
            newCode = generateRoomCode();
            console.log(newCode)
            // Check if code exists in database would go here
            isUnique = true
        }
        return newCode;
    }

    // const uploadImageFile = async (file: File) => {
    //     const fileExtension = file.name.split(".").pop();
    //     const fileName = `${Date.now()}.${fileExtension}`;
    //     return fileName
    // }

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

    const { 
        register: registerJoin, 
        // reset: resetJoin, 
        handleSubmit: handleSubmitJoin, 
        formState: { 
            errors: errorsJoin 
        }
    } = useForm<JoinRoomFormData>({
        resolver: yupResolver(joinRoomSchema)
    })

    // Form submission with proper image handling
    const onFormSubmit = async (formData : EditCreateFormData) => {
        setLocalLoading(true);
        
        try {
            console.log('Form submission started')
            console.log('Form data received:', formData)

            // Determine the correct banner image value
            let bannerImageUrl: string | File | null = null;
            if (formData.banner_image instanceof File) {
                // Handle image upload
                console.log('Processing image file:', {
                    name: formData.banner_image.name,
                    size: formData.banner_image.size,
                    type: formData.banner_image.type
                });
                
                // Create FormData for file upload
                const formDataForUpload = new FormData();
                formDataForUpload.append('image', formData.banner_image);
                
                // Log what we're sending
                console.log('Sending FormData to server...')
                for (const pair of formDataForUpload.entries()) {
                    console.log('FormData pair:', pair[0], pair[1])
                }
                
                try {
                    // Upload image first
                    console.log('Calling uploadImage API...')
                    const uploadResponse = await uploadImage(formDataForUpload);
                    console.log('Upload response received:', uploadResponse.data);
                    
                    if (uploadResponse.data && uploadResponse.data.data && uploadResponse.data.data.imageUrl) {
                        bannerImageUrl = uploadResponse.data.data.imageUrl;
                        console.log('Image URL set:', bannerImageUrl)
                    } else {
                        console.error('Invalid upload response structure:', uploadResponse.data)
                        throw new Error('Failed to get image URL from upload response');
                    }
                } catch (uploadError : unknown) {
                    console.error('Image upload failed:', uploadError);
                    // toast.error(`Failed to upload image: ${uploadError.message}`);
                    toast.error(`Failed to upload image: ${uploadError}`);
                    setLocalLoading(false);
                    return;
                }
            } else if (typeof formData.banner_image === 'string' && formData.banner_image) {
                // If it's a string (existing image URL), keep it
                bannerImageUrl = formData.banner_image;
            } else if (roomId) {
                // If editing and no new image/file, get the current image from the room list
                const currentRoom = rooms.find(r => r.id === roomId);
                if (currentRoom && currentRoom.banner_image) {
                    bannerImageUrl = currentRoom.banner_image;
                }
            }

            const roomPayload = {
                title: formData.title,
                description: formData.description,
                mantra: formData.mantra,
                banner_image: bannerImageUrl, // Use the correct image URL
            };

            if (roomId) {
                // UPDATE ROOM
                console.log('Updating room with payload:', roomPayload);
                await updateRoom(roomId, roomPayload);
                toast.success('Room updated successfully!');
                reset();
                // setRoomId(null);
                setRoomId(undefined);
            } else {
                // CREATE NEW ROOM
                const newRoomCode = await createUniqueRoomCode();
                if (!newRoomCode) {
                    console.error('Failed to generate room code')
                    setLocalLoading(false);
                    return;
                }
                
                const createPayload = {
                    ...roomPayload,
                    code: newRoomCode
                };
                
                console.log('Creating room with payload:', createPayload);
                
                // Create the room
                const response = await createRoom(createPayload);
                console.log('Room created successfully:', response.data);
                
                // Show success message with room code
                Swal.fire({
                    title: "Room Created!",
                    html: `Your room join code is: <strong>${newRoomCode}</strong><br/>Share this code with others to let them join your room.`,
                    icon: "success",
                    confirmButtonText: "Got it!"
                });
                
                reset();
            }

            // Reset form state
            setPreviewImage(null);
            
            // Refresh the rooms list
            await fetchRoomsFromTable(userProfile?.id);
            
        } catch (error) {
            console.error('Error with room operation:', error);
            
            // Show appropriate error message
            if (roomId) {
                toast.error('Failed to update room. Please try again.');
            } else {
                toast.error('Failed to create room. Please try again.');
            }
        } finally {
            setLocalLoading(false);
        }
    };

    const onJoinRoomSubmit = async (formData: JoinRoomFormData) => {
        console.log('Attempting to join room with code:', formData.roomCode)
        // Here you would validate the room code and join the room
        try {
            const response = await joinRoom(formData.roomCode)
            console.log('Successful join room: ', response.data)
            toast.success(`Joining room with code: ${formData.roomCode}`)
            setShowJoinModal(false)
            setShowJoinModal(false)
            // resetJoin()      // do not uncomment kay ma undefined ig join, di na nuon mailhan
            // Navigate to room
            router.push(`${ROUTES.VIRTUAL_ROOMS}/join/${formData.roomCode}`)
        } catch (error:unknown) {
            console.log('Error joining room:', error)
            toast.error(`Cannot join room`)
            // toast.error(error.response?.data?.error)
            // toast.error(error.response?.data?.error)
        }
    }

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
        setPreviewImage(null)
        setRoomId(undefined)
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
                    // Delete logic would go here
                    try {
                        if (!roomId) throw new Error('No room ID provided for deletion');
                        await deleteRoom(roomId);
                        toast.success('Room deleted successfully!');
                        // Refresh the rooms list
                        await fetchRoomsFromTable(userProfile?.id);
                    } catch (error) {
                        console.error('Error deleting room:', error);
                        toast.error('Failed to delete room. Please try again.');
                    }
                }
        })
    }

    return (
        <div className={styles['dashboard-container']}>
            {/* Header Section */}
            <div className={styles["header-section"]}>
                <div className={styles["user-avatar"]}>
                    <span className={styles["avatar-letter"]}>
                        {userProfile?.fullName?.charAt(0)?.toUpperCase() || 'J'}
                    </span>
                </div>
                <div className={styles["welcome-text"]}>
                    <h1>Hello there, {userProfile?.fullName || 'John Doe'}</h1>
                    <p>Let your imagination run wild!</p>
                </div>
                {/* <div className={styles["search-section"]}>
                    <span>Search</span>
                    <div className={styles["search-icon"]}>🔍</div>
                </div> */}
            </div>

            {/* Action Buttons Section */}
            <div className={styles["action-buttons-section"]}>
                <button 
                    className={styles["action-button"]}
                    onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })}
                >
                    <div className={styles["button-icon"]}>➕</div>
                    <span>Create a Virtual Room</span>
                </button>
                <button 
                    className={styles["action-button"]}
                    onClick={() => setShowJoinModal(true)}
                >
                    <div className={styles["button-icon"]}>🔑</div>
                    <span>Join a Virtual Room</span>
                </button>
            </div>

            {/* Join Room Modal */}
            {showJoinModal && (
                <div className={styles["modal-overlay"]} onClick={() => setShowJoinModal(false)}>
                    <div className={styles["modal-content"]} onClick={(e) => e.stopPropagation()}>
                        <h3>Join Virtual Room</h3>
                        <form onSubmit={handleSubmitJoin(onJoinRoomSubmit)}>
                            <div className={styles["form-group"]}>
                                <label>Room Code</label>
                                <input 
                                    type="text" 
                                    placeholder="Enter room code"
                                    className={`${styles["form-control"]} ${errorsJoin.roomCode ? styles.error : ''}`} 
                                    {...registerJoin("roomCode")}
                                />
                                {errorsJoin.roomCode && <small className={styles["error-message"]}>{errorsJoin.roomCode.message}</small>}
                            </div>
                            <div className={styles["modal-actions"]}>
                                <button 
                                    type="button" 
                                    className={styles["cancel-btn"]}
                                    onClick={() => setShowJoinModal(false)}
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit" 
                                    className={styles["submit-btn"]}
                                >
                                    Join Room
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className={styles["main-content"]}>
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
                                accept="image/*"
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
                                className={styles["create-room-btn"]}
                                disabled={isLocalLoading}
                            >
                                {isLocalLoading ? "Processing..." : roomId ? "Update Room" : "Create Room"}
                            </button>
                            </div>
                        </form>
                        </div>
                        
                        {/* Room Cards Section */}
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
                                    <div className={styles["room-code"]}>
                                        <strong>Room Code: {room.code}</strong>
                                    </div>
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