"use client"

import { useState, useCallback } from 'react'
import { downloadRoomRecordsCSV, downloadCompetitionRecordsCSV } from '@/api/records'

interface UseRecordsManagementReturn {
    isLoading: boolean
    handleDownloadRoom: () => Promise<void>
    handleDownloadCompetition: (competitionId?: string) => Promise<void>
}

export function useRecordsManagement(roomId: number): UseRecordsManagementReturn {
    const [isLoading, setIsLoading] = useState(false)

    const handleDownloadRoom = useCallback(async () => {
        setIsLoading(true)
        try {
        console.log('📥 Download initiated:', {
            type: 'room',
            roomId,
            timestamp: new Date().toISOString()
        })

        const result = await downloadRoomRecordsCSV(roomId)
        
        if (result.success) {
            // Create download link and trigger download
            const url = window.URL.createObjectURL(result.data)
            const link = document.createElement('a')
            link.href = url
            link.download = result.filename
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
            window.URL.revokeObjectURL(url)
            
            console.log('✅ Room records downloaded successfully:', result.filename)
        } else {
            console.error('❌ Error downloading room records:', result.error)
            alert(`Failed to download room records: ${result.error}`)
        }
        } catch (error) {
            console.error('❌ Error downloading room records:', error)
            alert('Failed to download room records')
        } finally { 
            setIsLoading(false)
        }
    }, [roomId])

    const handleDownloadCompetition = useCallback(async (competitionId?: string) => {
        setIsLoading(true)
        try {
            if (!competitionId) {
                alert('Please select a competition')
                setIsLoading(false)
                return
            }

            console.log('📥 Download initiated:', {
                type: 'competition',
                roomId,
                competitionId,
                timestamp: new Date().toISOString()
            })

            const result = await downloadCompetitionRecordsCSV(roomId, competitionId)
        
            if (result.success) {
                // Create download link and trigger download
                const url = window.URL.createObjectURL(result.data)
                const link = document.createElement('a')
                link.href = url
                link.download = result.filename
                document.body.appendChild(link)
                link.click()
                document.body.removeChild(link)
                window.URL.revokeObjectURL(url)
                
                console.log('✅ Competition records downloaded successfully:', result.filename)
            } else {
                console.error('❌ Error downloading competition records:', result.error)
                alert(`Failed to download competition records: ${result.error}`)
            }
        } catch (error) {
            console.error('❌ Error downloading competition records:', error)
            alert('Failed to download competition records')
        } finally {
            setIsLoading(false)
        }
    }, [roomId])

    return {
        isLoading,
        handleDownloadRoom,
        handleDownloadCompetition
    }
}
