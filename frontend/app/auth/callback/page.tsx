"use client"
import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { myAppHook } from '@/context/AppUtils'
import { getUserProfile, handleOAuthCallback as oauth, verifyUser } from '@/lib/apiService'
import Loader from '@/components/Loader'
import { ROUTES } from '@/constants/routes'
import toast from 'react-hot-toast'

export default function OAuthCallback() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const { setIsLoggedIn, setAuthToken, setUserProfile } = myAppHook()
    const [isProcessing, setIsProcessing] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        async function handleOAuthCallback() {
            let code = searchParams.get('code')
            // console.log(code)
            // console.log('Current URL:', window.location.href);
            // console.log('Current URL Hash:', window.location.hash);
            // console.log('Query params:', Object.fromEntries(searchParams.entries()));
                
            if (!code && window.location.hash) {
                // const response = await getUserProfile()
                // console.log('response uesr profile ', response)
                const hashParams = new URLSearchParams(window.location.hash.replace('#', ''));
                console.log( 'hashparams' ,hashParams)
                console.log( 'hashparams access tokens', hashParams.get('access_token'))
                code = hashParams.get('access_token')
                // console.log(hashParams.get('token'))
            } else {
                setError('Missing authorization code')
                setIsProcessing(false)
                return
            }

            try {
                // Exchange the authorization code for a token
                // const response = await oauth(code)
                const response = await verifyUser(code)
                console.log(response)
                console.log(response.data.data)
                // if (response?.data?.session?.access_token) {
                if (response?.data?.data?.user) {
                    // // Save auth data
                    // localStorage.setItem('access_token', response.data.session.access_token)
                    // localStorage.setItem('refresh_token', response.data.session.refresh_token)
                    
                    // if (response.data.session.expires_at) {
                    //     localStorage.setItem('expires_at', new Date(response.data.session.expires_at).getTime().toString())
                    // } else {
                    //     const defaultExpiry = Date.now() + (24 * 60 * 60 * 1000)
                    //     localStorage.setItem('expires_at', defaultExpiry.toString())
                    // }
                    
                    // Set user data
                    if (response.data.data.user) {
                        const userData = {
                            id: response.data.data.user.id,
                            email: response.data.data.user.email,
                            fullName: response.data.data.user.user_metadata?.full_name,
                            gender: response.data.data.user.user_metadata?.gender,
                            phone: response.data.data.user.user_metadata?.phone
                        }
                        
                        localStorage.setItem('user', JSON.stringify(userData))
                        setUserProfile(userData)
                    }
                    
                    if (response.data.data.user) {
                        setUserProfile({
                            id: response.data.data.user.id,
                            email: response.data.data.user.email,
                            fullName: response.data.data.user.user_metadata?.full_name,
                            gender: response.data.data.user.user_metadata?.gender,
                            phone: response.data.data.user.user_metadata?.phone
                        })
                    }
                    setAuthToken(response.data.token)
                    setIsLoggedIn(true)
                    
                    // toast.success('Successfully signed in!')
                    router.push(ROUTES.DASHBOARD)
                } else {
                    toast.error('Authentication has no session')
                    throw new Error('Invalid response data')
                }
            } catch (error) {
                console.error('OAuth callback error:', error)
                setError('Failed to complete authentication. Please try again.')
                toast.error('Authentication failed')
                // setTimeout( () => {
                //         router.push(ROUTES.LOGIN)
                //     }, 3000
                // )
            } finally {
                setIsProcessing(false)
            }
        }
        
        handleOAuthCallback()
    }, [searchParams, router, setAuthToken, setIsLoggedIn, setUserProfile])

    return (
        <>
            <div className="min-h-screen flex flex-col items-center justify-center p-4">
            {isProcessing ? (
                <div className="text-center">
                    <Loader />
                <p className="mt-4 text-lg">Completing your authentication...</p>
                </div>
            ) : error ? (
                <div className="text-center">
                <div className="text-red-500 text-xl mb-4">Error: {error}</div>
                <p>Redirecting you to the login page...</p>
                </div>
            ) : null}
            </div>
        </>
    )
}