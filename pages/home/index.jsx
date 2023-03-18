import Head from 'next/head'
import {AnimatePresence} from 'framer-motion'

import classes from './home.module.scss'
import ChatList from '../../components/ChatList/ChatList'
import MessageArea from '../../components/MessageArea/MessageArea'
import {useRouter} from 'next/router'
import {useEffect, useState} from 'react'
import {useSelector} from 'react-redux'
import {useDispatch} from 'react-redux'
import {authActions} from '../../store/auth/auth'
import Loader from '../../components/Ui/Loader/Loader'
import {logout} from '../../store/auth/auth-actions'
import {receiveRealTimeUpdates} from '../../store/chats/chat-actions'

function HomePage() {
    const router = useRouter()
    const dispatch = useDispatch()

    const {isAuthenticated, userId, username} = useSelector(state => state.auth)
    const {isChatSelected} = useSelector(state => state.homePage)

    const [isLoading, setIsLoading] = useState(false)

    const alertUser = e => {
        e.preventDefault()
        // console.log('user is trying to leave the page')
        // the below message will be displayed in the dialog box before closing (note: some browsers might not show this message)
        return (e.returnValue =
            'You will be logged out. Are you sure you want to close?')
    }

    // // TODO: remove the below useEffect hook
    // useEffect(() => {
    //     console.log(`Username: ${username}`)
    //     console.log(`UserId: ${userId}`)
    // }, [])

    useEffect(() => {
        window.addEventListener('beforeunload', alertUser)

        return () => {
            window.removeEventListener('beforeunload', alertUser)
        }
    }, [])

    useEffect(() => {
        const unsubscribe = receiveRealTimeUpdates(userId)

        return () => {
            unsubscribe()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    async function setOnlineStatus() {
        let isOnline = document.visibilityState === 'hidden' ? false : true

        await fetch('/api/set-online-status', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({userId, isOnline}),
            keepalive: true
        })
    }

    useEffect(() => {
        // whenever the visibility of the document changes, the isOnline field of the user in the database is updated
        document.addEventListener('visibilitychange', setOnlineStatus)

        return () => {
            document.removeEventListener('visibilitychange', setOnlineStatus)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        // if user is not authenticated, redirect to the login page
        // this code runs when the HomePage component mounts
        !isAuthenticated && router.push('/login')

        // this function logs out the user if any other page is visited (when the HomePage component is unmounted)
        return () => {
            if (!isAuthenticated) return
            setIsLoading(true)

            dispatch(logout(userId))
            setIsLoading(false)
        }
    }, [])

    return (
        isAuthenticated && (
            <>
                {isLoading && <Loader />}
                <Head>
                    <title>Home</title>
                </Head>

                <div className={classes['home-page']}>
                    <div className={classes['chat-menu']}>
                        <ChatList />
                    </div>
                    {isChatSelected && (
                        <div className={classes['chat-message']}>
                            <MessageArea />
                        </div>
                    )}
                </div>
            </>
        )
    )
}

export default HomePage
