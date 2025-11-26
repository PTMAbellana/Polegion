import React from 'react'
import { useImageUpload } from '@/hooks/profile/useImageUpload'
import { useAuthStore } from '@/store/authStore'
import AnimatedAvatar from './AnimatedAvatar'
import styles from '@/styles/profile.module.css'
import { ProfileImageUploadProps } from '@/types/props/profile'

export default function ProfileImageUpload({ onSuccess }: ProfileImageUploadProps) {
    const { userProfile } = useAuthStore()
    const {
        preview,
        file,
        isUploading,
        error,
        success,
        fileInputRef,
        handleInputChange,
        triggerFileSelect,
        uploadImage,
        clearImage,
        resetState
    } = useImageUpload()

    const handleUpload = async () => {
        const uploadSuccess = await uploadImage()
        if (uploadSuccess && onSuccess) {
            onSuccess()
        }
    }

    React.useEffect(() => {
        if (success) {
            setTimeout(resetState, 3000) // Clear success message after 3 seconds
        }
    }, [success, resetState])

    const displayImage = preview || userProfile?.profile_pic

    return (
        <div className={styles['image-upload-section']}>
            <h3 className={styles['section-title-left']}>Profile Picture</h3>
            
            <div className={styles['image-upload-container-two-column']}>
                {/* Left Side - Bigger Image Preview */}
                <div className={styles['image-preview-large']}>
                    <AnimatedAvatar
                        src={displayImage}
                        alt="Profile preview"
                        className={styles['upload-avatar-large']}
                    />
                    
                    {/* Upload overlay - Same as before but larger */}
                    <div 
                        className={styles['upload-overlay-large']}
                        onClick={triggerFileSelect}
                    >
                        <div className={styles['upload-icon']}></div>
                        <span className={styles['upload-text']}>
                            {displayImage ? 'Change Photo' : 'Add Photo'}
                        </span>
                    </div>
                </div>

                {/* Right Side - Info and Controls */}
                <div className={styles['upload-controls']}>
                    {/* Upload info */}
                    <div className={styles['upload-info']}>
                        <div className={styles['info-item']}>
                            <p className={styles['upload-hint']}>
                                <strong>Supported formats:</strong> JPEG, PNG, WebP
                            </p>
                        </div>
                        
                        <div className={styles['info-item']}>
                            <p className={styles['upload-hint']}>
                                <strong>Maximum size:</strong> 5MB
                            </p>
                        </div>
                        
                        {file && (
                            <div className={styles['file-info']}>
                                <p className={styles['file-name']}>{file.name}</p>
                                <p className={styles['file-size']}>
                                    Size: {(file.size / 1024 / 1024).toFixed(2)} MB
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Action buttons - Only show when file is selected */}
                    {file && (
                        <div className={styles['upload-actions']}>
                            <button
                                type="button"
                                onClick={clearImage}
                                className={styles['clear-button']}
                                disabled={isUploading}
                            >
                                Clear
                            </button>
                            <button
                                type="button"
                                onClick={handleUpload}
                                className={styles['upload-button']}
                                disabled={isUploading || !file}
                            >
                                {isUploading ? (
                                    <>
                                        <span className={styles['spinner']}></span>
                                        Uploading...
                                    </>
                                ) : (
                                    'Upload Photo'
                                )}
                            </button>
                        </div>
                    )}

                    {/* Status messages */}
                    {success && (
                        <div className={styles['success-message']}>
                            ✅ Profile picture updated successfully!
                        </div>
                    )}
                    {error && (
                        <div className={styles['error-message']}>
                            ❌ {error}
                        </div>
                    )}
                </div>

                {/* Hidden file input */}
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    onChange={handleInputChange}
                    className={styles['hidden-input']}
                    disabled={isUploading}
                />
            </div>
        </div>
    )
}