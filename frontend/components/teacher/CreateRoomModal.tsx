import React from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useTeacherRoomStore } from '@/store/teacherRoomStore'
import { useRoomModal } from '@/hooks/useRoomModal'
import styles from '@/styles/room.module.css'
import { CreateRoomData, CreateRoomModalProps } from '@/types'
import { createRoomSchema } from '@/schemas/roomSchemas'

export default function CreateRoomModal({ 
    isOpen, 
    onClose 
}: CreateRoomModalProps) {
    const { createRoom, loading } = useTeacherRoomStore()
    const {
        submitError,
        bannerPreview,
        selectedFile,
        fileInputRef,
        setSubmitError,
        setIsFilePickerOpen,
        handleFileChange,
        handleBannerClick,
        handleChangeBanner,
        handleRemoveBanner,
        resetModal
    } = useRoomModal()

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm<CreateRoomData>({
        resolver: yupResolver(createRoomSchema)
    })



    const onSubmit = async (data: CreateRoomData) => {
        setSubmitError('')
        
        try {
            // Include the selected file in the form data
            const formData = {
                ...data,
                banner_image: selectedFile
            }
            
            const result = await createRoom(formData)
            if (result.success) {
                reset()
                resetModal()
                onClose()
            } else {
                setSubmitError(result.error || 'Failed to create room')
            }
        } catch {
            setSubmitError('An unexpected error occurred')
        }
    }

    const handleClose = () => {
        reset()
        resetModal()
        onClose()
    }

    if (!isOpen) return null

    return (
        <div className={styles['modal-overlay']}>
            <div className={`${styles['modal-content']} ${styles['modal-content-wide']}`}>
                <div className={styles['modal-header']}>
                    <h2>Create New Room</h2>
                    <button 
                        className={styles['modal-close']}
                        onClick={handleClose}
                        type="button"
                    >
                        ×
                    </button>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className={styles['modal-form']}>
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
                                            <img src={bannerPreview} alt="Banner preview" />
                                            <div className={styles['banner-overlay']}>
                                                <button
                                                    type="button"
                                                    className={styles['banner-change-btn']}
                                                    onClick={handleChangeBanner}
                                                    disabled={loading}
                                                >
                                                    Change
                                                </button>
                                                <button
                                                    type="button"
                                                    className={styles['banner-remove-btn']}
                                                    onClick={handleRemoveBanner}
                                                    disabled={loading}
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
                                            // Add a small delay to check if file was actually selected
                                            setTimeout(() => setIsFilePickerOpen(false), 300)
                                        }}
                                        disabled={loading}
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
                                    disabled={loading}
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
                                    disabled={loading}
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
                                    disabled={loading}
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
                            disabled={loading}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className={styles['submit-btn']}
                            disabled={loading}
                        >
                            {loading ? 'Creating...' : 'Create Room'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}