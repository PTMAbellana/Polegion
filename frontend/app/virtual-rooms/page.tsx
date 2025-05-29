"use client"
import Loader from '@/components/Loader'
import { ROUTES } from '@/constants/routes'
import { myAppHook } from '@/context/AppUtils'
import { AuthProtection } from '@/context/AuthProtection'
import { createRoom, updateRoom, getRooms } from '@/lib/apiService'
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
    const [ roomId, setRoomId ] = useState(null)
    const [ previewImage, setPreviewImage ] = useState(undefined)
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

    const uploadImageFile = async (file: File) => {
        const fileExtension = file.name.split(".").pop();
        const fileName = `${Date.now()}.${fileExtension}`;
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

    const { 
        register: registerJoin, 
        reset: resetJoin, 
        handleSubmit: handleSubmitJoin, 
        formState: { 
            errors: errorsJoin 
        }
    } = useForm<JoinRoomFormData>({
        resolver: yupResolver(joinRoomSchema)
    })

    // const onFormSubmit = async (formData: any) => {
    //     setLocalLoading(true);
    //     let imagePath = formData.banner_image;

    //     if (formData.banner_image instanceof File) {
    //         imagePath = await uploadImageFile(formData.banner_image);
    //         if (!imagePath) {
    //             setLocalLoading(false);
    //             return;
    //         }
    //     }

    //     if (roomId) {
    //         // Update room logic would go here
    //         console.log('Update room with:', formData)
    //     } else {
    //         // Generate unique room code for new rooms
    //         const newRoomCode = await createUniqueRoomCode();
    //         if (!newRoomCode) {
    //             setLocalLoading(false);
    //             return;
    //         }
            
    //         console.log('Create new room with:', { ...formData, code: newRoomCode })
            
    //         // Show the join code to the user
    //         Swal.fire({
    //             title: "Room Created!",
    //             html: `Your room join code is: <strong>${newRoomCode}</strong><br/>Share this code with others to let them join your room.`,
    //             icon: "success",
    //             confirmButtonText: "Got it!"
    //         });
            
    //         reset();
    //     }

    //     setPreviewImage(undefined);
    //     fetchRoomsFromTable(userProfile?.id);
    //     setLocalLoading(false);
    // };
    // Replace your existing onFormSubmit function with this:
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

        try {
            if (roomId) {
                // UPDATE ROOM
                const updatePayload = {
                    title: formData.title,
                    description: formData.description,
                    mantra: formData.mantra,
                    banner_image: imagePath
                };
                
                console.log('Updating room with:', updatePayload);
                await updateRoom(roomId, updatePayload);
                
                toast.success('Room updated successfully!');
                reset();
                setRoomId(null);
            } else {
                // CREATE NEW ROOM
                const newRoomCode = await createUniqueRoomCode();
                if (!newRoomCode) {
                    setLocalLoading(false);
                    return;
                }
                
                const createPayload = {
                    title: formData.title,
                    description: formData.description,
                    mantra: formData.mantra,
                    banner_image: imagePath,
                    code: newRoomCode
                };
                
                console.log('Creating room with:', createPayload);
                
                // ✅ ACTUALLY CALL THE API TO CREATE THE ROOM
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
            setPreviewImage(undefined);
            
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
        toast.success(`Joining room with code: ${formData.roomCode}`)
        setShowJoinModal(false)
        resetJoin()
        // Navigate to room
        router.push(`${ROUTES.VIRTUAL_ROOMS}/${formData.roomCode}`)
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
                    // Delete logic would go here
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
                <div className={styles["search-section"]}>
                    <span>Search</span>
                    <div className={styles["search-icon"]}>🔍</div>
                </div>
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