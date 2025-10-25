import { useState, useRef } from 'react'
import { useAuthStore } from '@/store/authStore'

export interface ImageUploadState {
    preview: string | null
    file: File | null
    isUploading: boolean
    error: string
    success: boolean
}

export function useImageUpload() {
    const { uploadProfileImage } = useAuthStore()
    const fileInputRef = useRef<HTMLInputElement>(null)
    
    const [state, setState] = useState<ImageUploadState>({
        preview: null,
        file: null,
        isUploading: false,
        error: '',
        success: false
    })

    const validateFile = (file: File): string | null => {
        // Check file type
        const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
        if (!validTypes.includes(file.type)) {
            return 'Please select a valid image file (JPEG, PNG, or WebP)'
        }

        // Check file size (5MB max)
        const maxSize = 5 * 1024 * 1024 // 5MB in bytes
        if (file.size > maxSize) {
            return 'Image must be smaller than 5MB'
        }

        return null
    }

    const handleFileSelect = (file: File) => {
        setState(prev => ({ ...prev, error: '', success: false }))

        // Validate file
        const error = validateFile(file)
        if (error) {
            setState(prev => ({ ...prev, error }))
            return
        }

        // Create preview
        const reader = new FileReader()
        reader.onload = (e) => {
            setState(prev => ({
                ...prev,
                file,
                preview: e.target?.result as string
            }))
        }
        reader.readAsDataURL(file)
    }

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (file) {
            handleFileSelect(file)
        }
    }

    const triggerFileSelect = () => {
        fileInputRef.current?.click()
    }

    const uploadImage = async (): Promise<boolean> => {
        if (!state.file) {
            setState(prev => ({ ...prev, error: 'Please select an image first' }))
            return false
        }

        setState(prev => ({ ...prev, isUploading: true, error: '', success: false }))

        try {
            const result = await uploadProfileImage(state.file)
            
            if (result.success) {
                setState(prev => ({ 
                    ...prev, 
                    success: true,
                    file: null,
                    preview: null
                }))
                
                // Clear file input
                if (fileInputRef.current) {
                    fileInputRef.current.value = ''
                }
                
                return true
            } else {
                setState(prev => ({ 
                    ...prev, 
                    error: result.error || 'Failed to upload image' 
                }))
                return false
            }
        } catch (err) {
            console.error('Image upload error:', err)
            setState(prev => ({ 
                ...prev, 
                error: 'An unexpected error occurred while uploading the image' 
            }))
            return false
        } finally {
            setState(prev => ({ ...prev, isUploading: false }))
        }
    }

    const clearImage = () => {
        setState({
            preview: null,
            file: null,
            isUploading: false,
            error: '',
            success: false
        })
        
        // Clear file input
        if (fileInputRef.current) {
            fileInputRef.current.value = ''
        }
    }

    const resetState = () => {
        setState(prev => ({ 
            ...prev, 
            error: '', 
            success: false 
        }))
    }

    return {
        ...state,
        fileInputRef,
        handleFileSelect,
        handleInputChange,
        triggerFileSelect,
        uploadImage,
        clearImage,
        resetState
    }
}