"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import { supabase } from "@/lib/supabaseClient";
import { myAppHook } from "@/context/AppUtils";
import Navbar from "@/components/Navbar";
import styles from '@/styles/room.module.css';

interface RoomType {
  id?: number;
  title?: string;
  description?: string;
  mantra?: string;
  banner_image?: string | File | null;
  created_at?: string;
}

const formSchema = yup.object().shape({
  title: yup.string().required("Room title is required"),
  description: yup.string().required("Room description is required"),
  mantra: yup.string().required("Room mantra is required")
});

export default function VirtualRooms() {
  const [previewImage, setPreviewImage] = useState(null);
  const [rooms, setRooms] = useState<RoomType[]>([]);
  const [userId, setUserId] = useState(null);
  const [editId, setEditId] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isLoading, setLocalLoading] = useState(false);

  const { setAuthToken, setIsLoggedIn, isLoggedIn, setUserProfile, setIsLoading } = myAppHook();
  const router = useRouter();

  const { register, reset, setValue, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(formSchema)
  });

  useEffect(() => {
    const handleLoginSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        toast.error("Failed to get user data");
        router.push("/auth/login");
        return;
      }
      setIsLoading(true);
      if (data.session?.access_token) {
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
        localStorage.setItem("user_profile", JSON.stringify({
          name: data.session.user?.user_metadata.fullName,
          email: data.session.user?.user_metadata.email,
          gender: data.session.user?.user_metadata.gender,
          phone: data.session.user?.user_metadata.phone,
        }));
        fetchRoomsFromTable(data.session.user.id);
      }
      setIsLoading(false);
    };

    handleLoginSession();
    if (!isLoggedIn) {
      router.push("/auth/login");
      return;
    }
  }, []);

  // Upload Banner Image
  const uploadImageFile = async (file: File) => {
    const fileExtension = file.name.split(".").pop();
    const fileName = `${Date.now()}.${fileExtension}`;

    const { data, error } = await supabase.storage.from("room-images").upload(fileName, file);
    if (error) {
      toast.error("Failed to upload banner image");
      return null;
    }
    return supabase.storage.from("room-images").getPublicUrl(fileName).data.publicUrl;
  };

  // Form Submit
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

    if (editId) {
      const { data, error } = await supabase.from("rooms").update({
        ...formData,
        banner_image: imagePath
      }).match({
        id: editId,
        user_id: userId
      });

      if (error) {
        toast.error("Failed to update room data");
      } else {
        toast.success("Room has been updated successfully");
        setEditId(null);
      }
    } else {
      const { data, error } = await supabase.from("rooms").insert({
        ...formData,
        user_id: userId,
        banner_image: imagePath
      });
      if (error) {
        console.error("Insert error:", error);
        toast.error("Failed to Create Room");
      } else {
        toast.success("Successfully Created Room!");
      }
      reset();
    }

    setPreviewImage(null);
    fetchRoomsFromTable(userId);
    setLocalLoading(false);
  };

  const fetchRoomsFromTable = async (userId: string) => {
    setLocalLoading(true);
    const { data, error } = await supabase
      .from("rooms")
      .select("*")
      .eq("user_id", userId)
      .order('created_at', { ascending: false });
      
    if (data) {
      setRooms(data);
    }
    setLocalLoading(false);
  };

  // Edit data
  const handleEditData = (room: RoomType) => {
    setValue("title", room.title);
    setValue("description", room.description);
    setValue("mantra", room.mantra);
    setValue("banner_image", room.banner_image);
    setPreviewImage(room.banner_image);
    setEditId(room.id);
    
    // Scroll to form
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // Cancel Edit
  const handleCancelEdit = () => {
    reset();
    setPreviewImage(null);
    setEditId(null);
  };

  // Delete Room Operation
  const handleDeleteData = (id: number) => {
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
        const { data, error } = await supabase.from("rooms").delete().match({
          id: id,
          user_id: userId
        });
        if (error) {
          toast.error("Failed to delete room.");
        } else {
          toast.success("Room deleted successfully.");
          fetchRoomsFromTable(userId);
        }
      }
    });
  };

  // View Room Details
  const handleViewRoom = (roomId: number) => {
    router.push(`/rooms/${roomId}`);
  };

  // Toggle Sidebar
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const userProfile = typeof window !== 'undefined' 
    ? JSON.parse(localStorage.getItem("user_profile") || '{"name": "User"}') 
    : { name: "User" };

  return (
    <div className={styles["dashboard-container"]}>
      <Navbar onToggleSidebar={toggleSidebar} />

      {/* Main Content */}
      <div className={`${styles["main-content"]} ${sidebarOpen ? styles["sidebar-open"] : ''}`}>
        <div className={styles["welcome-section"]}>
          <h3>Welcome, {userProfile.name}!</h3>
          <h1>Virtual Rooms</h1>
        </div>

        {isLoading ? (
          <div className={styles["loading-indicator"]}>Loading...</div>
        ) : (
          <div className={styles["dashboard-grid"]}>
            {/* Form Card */}
            <div className={`${styles.card} ${styles["room-form-card"]}`}>
              <h3>{editId ? "Edit Room" : "Create Room"}</h3>
              <form onSubmit={handleSubmit(onFormSubmit)}>
                <div className={styles["form-group"]}>
                  <label>Title</label>
                  <input 
                    type="text" 
                    className={`${styles["form-control"]} ${errors.title ? styles.error : ''}`} 
                    {...register("title")} 
                  />
                  {errors.title && <small className={styles["error-message"]}>{errors.title.message}</small>}
                </div>
                
                <div className={styles["form-group"]}>
                  <label>Description</label>
                  <textarea 
                    className={`${styles["form-control"]} ${errors.description ? styles.error : ''}`} 
                    {...register("description")}
                  ></textarea>
                  {errors.description && <small className={styles["error-message"]}>{errors.description.message}</small>}
                </div>
                
                <div className={styles["form-group"]}>
                  <label>Mantra</label>
                  <input 
                    type="text" 
                    className={`${styles["form-control"]} ${errors.mantra ? styles.error : ''}`} 
                    {...register("mantra")}
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
                  {editId && (
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
                    disabled={isLoading}
                  >
                    {isLoading ? "Processing..." : editId ? "Update Room" : "Create Room"}
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
                        <p className={styles["room-card-mantra"]}>"{room.mantra}"</p>
                        <div className={styles["room-card-actions"]}>
                          <button
                            className={styles["view-btn"]}
                            onClick={() => handleViewRoom(room.id)}
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
  );
}