import { useState, useRef, useEffect } from 'react'

export const useRoomModal = (initialBanner?: string | null) => {
    const [submitError, setSubmitError] = useState<string>('')
    const [bannerPreview, setBannerPreview] = useState<string | null>(initialBanner || null)
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const [isFilePickerOpen, setIsFilePickerOpen] = useState<boolean>(false)
    const fileInputRef = useRef<HTMLInputElement>(null)

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

    const resetModal = () => {
        setSubmitError('')
        setBannerPreview(initialBanner || null)
        setSelectedFile(null)
        setIsFilePickerOpen(false)
        if (fileInputRef.current) {
            fileInputRef.current.value = ''
        }
    }

    const setBannerFromExisting = (existingBanner: string | null) => {
        if (existingBanner && typeof existingBanner === 'string') {
            setBannerPreview(existingBanner)
        } else {
            setBannerPreview(null)
        }
        setSelectedFile(null)
    }

    // Update banner preview when initialBanner changes (for EditModal)
    useEffect(() => {
        if (initialBanner !== undefined) {
            setBannerFromExisting(initialBanner)
        }
    }, [initialBanner])

    return {
        // State
        submitError,
        bannerPreview,
        selectedFile,
        isFilePickerOpen,
        fileInputRef,
        
        // Actions
        setSubmitError,
        setIsFilePickerOpen,
        handleFileChange,
        handleBannerClick,
        handleChangeBanner,
        handleRemoveBanner,
        resetModal,
        setBannerFromExisting
    }
}