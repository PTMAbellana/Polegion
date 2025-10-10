import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useStudentRoomStore } from '@/store/studentRoomStore'
import styles from '@/styles/room.module.css'
import { JoinRoomFormData, JoinRoomModalProps } from '@/types'
import { joinRoomSchema } from '@/schemas/roomSchemas'

export default function JoinRoomModal({ isOpen, onClose, onSuccess }: JoinRoomModalProps) {
    const { joinRoom, joinLoading } = useStudentRoomStore()
    const [submitError, setSubmitError] = useState<string>('')

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm<JoinRoomFormData>({
        resolver: yupResolver(joinRoomSchema)
    })

    const onSubmit = async (data: JoinRoomFormData) => {
        setSubmitError('')
        
        try {
            console.log('Attempting to join room with code:', data.roomCode)
            const result = await joinRoom(data.roomCode)
            if (result.success) {
                onClose()
                console.log('Attempting to join room with code:', data.roomCode)
                if (onSuccess) {
                    console.log('Joined room with code:', data.roomCode)
                    onSuccess(data.roomCode)
                }
                reset()
            } else {
                setSubmitError(result.error || 'Failed to join room')
            }
        } catch {
            setSubmitError('An unexpected error occurred')
        }
    }

    const handleClose = () => {
        reset()
        setSubmitError('')
        onClose()
    }

    if (!isOpen) return null

    return (
        <div className={styles['modal-overlay']}>
            <div className={styles['modal-content']}>
                <div className={styles['modal-header']}>
                    <h2>Join Room</h2>
                    <button 
                        className={styles['modal-close']}
                        onClick={handleClose}
                        type="button"
                    >
                        ×
                    </button>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className={styles['modal-form']}>
                    <div className={styles['form-group']}>
                        <label htmlFor="roomCode" className={styles['form-label']}>
                            Room Code *
                        </label>
                        <input
                            id="roomCode"
                            type="text"
                            {...register('roomCode')}
                            className={`${styles['form-input']} ${errors.roomCode ? styles['error'] : ''}`}
                            placeholder="Enter room code"
                            disabled={joinLoading}
                        />
                        {errors.roomCode && (
                            <span className={styles['error-message']}>
                                {errors.roomCode.message}
                            </span>
                        )}
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
                            disabled={joinLoading}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className={styles['submit-btn']}
                            disabled={joinLoading}
                        >
                            {joinLoading ? 'Joining...' : 'Join Room'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}