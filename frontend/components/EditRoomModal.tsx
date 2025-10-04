import React, { useState, useRef, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { RoomType } from '@/types/common/room'
import styles from '@/styles/room.module.css'

interface EditRoomFormData {
    title: string
    description: string
    mantra: string
}

interface EditRoomModalProps {
    room: RoomType | null
    isOpen: boolean
    onClose: () => void
    onSubmit: (formData: EditRoomFormData & { banner_image: File | null }, roomId: number) => Promise<void>
    isLoading: boolean
}

const editRoomSchema = yup.object().shape({
    title: yup.string().required("Room title is required"),
    description: yup.string().required("Room description is required"),
    mantra: yup.string().required("Room mantra is required")
})

export default function EditRoomModal({ room, isOpen, onClose, onSubmit, isLoading }: EditRoomModalProps) {
    const [submitError, setSubmitError] = useState<string>('')
    const [bannerPreview, setBannerPreview] = useState<string | null>(null)
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const [isFilePickerOpen, setIsFilePickerOpen] = useState<boolean>(false)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        setValue
    } = useForm<EditRoomFormData>({
        resolver: yupResolver(editRoomSchema)
    })

    // Reset form and images when room changes or modal opens
    useEffect(() => {
        if (room && isOpen) {
            setValue("title", room.title || "")
            setValue("description", room.description || "")
            setValue("mantra", room.mantra || "")
            
            // Set banner preview from existing room image
            if (room.banner_image && typeof room.banner_image === 'string') {
                setBannerPreview(room.banner_image)
            } else {
                setBannerPreview(null)
            }
            setSelectedFile(null)
        }
    }, [room, isOpen, setValue])

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (file) {
            setSelectedFile(file)
            const reader = new FileReader()
            reader.onload = (e) => {
                setBannerPreview(e.target?.result as string)
                setIsFilePickerOpen(false)
            }
            reader.readAsDataURL(file)
        } else {
            setIsFilePickerOpen(false)
        }
        event.stopPropagation()
    }

    const handleBannerClick = (event: React.MouseEvent<HTMLDivElement>) => {
        if (!bannerPreview && !isFilePickerOpen) {
            event.preventDefault()
            event.stopPropagation()
            setIsFilePickerOpen(true)
            fileInputRef.current?.click()
        }
    }

    const handleChangeBanner = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault()
        event.stopPropagation()
        if (!isFilePickerOpen) {
            setIsFilePickerOpen(true)
            fileInputRef.current?.click()
        }
    }

    const handleRemoveBanner = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault()
        event.stopPropagation()
        setBannerPreview(null)
        setSelectedFile(null)
        if (fileInputRef.current) {
            fileInputRef.current.value = ''
        }
    }

    const onSubmitForm = async (data: EditRoomFormData) => {
        if (!room) return
        
        setSubmitError('')
        
        try {
            const formData = {
                ...data,
                banner_image: selectedFile
            }
            
            if (room.id) {
                await onSubmit(formData, room.id)
            }
        } catch {
            setSubmitError('An unexpected error occurred')
        }
    }

    const handleClose = () => {
        reset()
        setSubmitError('')
        setBannerPreview(null)
        setSelectedFile(null)
        setIsFilePickerOpen(false)
        if (fileInputRef.current) {
            fileInputRef.current.value = ''
        }
        onClose()
    }

    if (!isOpen || !room) return null

    return (
        <div className={styles['modal-overlay']}>
            <div className={`${styles['modal-content']} ${styles['modal-content-wide']}`}>
                <div className={styles['modal-header']}>
                    <h2>Edit Room</h2>
                    <button 
                        className={styles['modal-close']}
                        onClick={handleClose}
                        type="button"
                        disabled={isLoading}
                    >
                        ×
                    </button>
                </div>

                <form onSubmit={handleSubmit(onSubmitForm)} className={styles['modal-form']}>
                    <div className={styles['modal-form-grid']}>
                        {/* Left Column - Banner Upload */}
                        <div className={styles['modal-form-left']}>
                            <div className={styles['banner-upload-group']}>
                                <label className={styles['form-label']}>
                                    Room Banner (Optional)
                                </label>
                                <div className={styles['banner-preview']} onClick={handleBannerClick}>
                                    {bannerPreview ? (
                                        <>
                                            <img src={bannerPreview} alt="Banner preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                            <div className={styles['banner-overlay']}>
                                                <button
                                                    type="button"
                                                    className={styles['banner-change-btn']}
                                                    onClick={handleChangeBanner}
                                                    disabled={isLoading}
                                                >
                                                    Change
                                                </button>
                                                <button
                                                    type="button"
                                                    className={styles['banner-remove-btn']}
                                                    onClick={handleRemoveBanner}
                                                    disabled={isLoading}
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                        </>
                                    ) : (
                                        <div className={styles['banner-upload-placeholder']}>
                                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                            </svg>
                                            <p>Click to upload banner image</p>
                                            <p style={{ fontSize: '12px', opacity: 0.7 }}>JPG, PNG, GIF up to 10MB</p>
                                        </div>
                                    )}
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        className={styles['file-input']}
                                        accept="image/*"
                                        onChange={handleFileChange}
                                        onFocus={() => setIsFilePickerOpen(true)}
                                        onBlur={() => {
                                            setTimeout(() => setIsFilePickerOpen(false), 300)
                                        }}
                                        disabled={isLoading}
                                        style={{ 
                                            pointerEvents: bannerPreview ? 'none' : 'auto',
                                            display: bannerPreview ? 'none' : 'block'
                                        }}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Right Column - Form Fields */}
                        <div className={styles['modal-form-right']}>
                            <div className={styles['form-group']}>
                                <label htmlFor="title" className={styles['form-label']}>
                                    Room Title *
                                </label>
                                <input
                                    id="title"
                                    type="text"
                                    {...register('title')}
                                    className={`${styles['form-input']} ${errors.title ? styles['error'] : ''}`}
                                    placeholder="Enter room title"
                                    disabled={isLoading}
                                />
                                {errors.title && (
                                    <span className={styles['error-message']}>
                                        {errors.title.message}
                                    </span>
                                )}
                            </div>

                            <div className={styles['form-group']}>
                                <label htmlFor="description" className={styles['form-label']}>
                                    Room Description *
                                </label>
                                <textarea
                                    id="description"
                                    {...register('description')}
                                    className={`${styles['form-textarea']} ${errors.description ? styles['error'] : ''}`}
                                    placeholder="Enter room description"
                                    rows={4}
                                    disabled={isLoading}
                                />
                                {errors.description && (
                                    <span className={styles['error-message']}>
                                        {errors.description.message}
                                    </span>
                                )}
                            </div>

                            <div className={styles['form-group']}>
                                <label htmlFor="mantra" className={styles['form-label']}>
                                    Room Mantra *
                                </label>
                                <input
                                    id="mantra"
                                    type="text"
                                    {...register('mantra')}
                                    className={`${styles['form-input']} ${errors.mantra ? styles['error'] : ''}`}
                                    placeholder="Enter room mantra"
                                    disabled={isLoading}
                                />
                                {errors.mantra && (
                                    <span className={styles['error-message']}>
                                        {errors.mantra.message}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    {submitError && (
                        <div className={styles['error-message']}>
                            {submitError}
                        </div>
                    )}

                    <div className={styles['modal-actions']}>
                        <button
                            type="button"
                            onClick={handleClose}
                            className={styles['cancel-btn']}
                            disabled={isLoading}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className={styles['submit-btn']}
                            disabled={isLoading}
                        >
                            {isLoading ? 'Updating...' : 'Update Room'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}