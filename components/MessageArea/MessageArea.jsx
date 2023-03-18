import Image from 'next/image'
import {motion, AnimatePresence} from 'framer-motion'
import {useSelector} from 'react-redux'
import Sentiment from 'sentiment'

import SentimentsCard from '../SentimentsCard/SentimentsCard'
import IconButton from '../Ui/IconButton/IconButton'
import classes from './MessageArea.module.scss'
import React, {useEffect, useRef, useState} from 'react'
import Messages from '../Messages/Messages/Messages'
import useInput from '../../hooks/useInput'
import useAutoFocus from '../../hooks/useAutoFocus'
import {useDispatch} from 'react-redux'
import {sendMessage} from '../../store/chats/chat-actions'
import useModal from '../../hooks/useModal'
import Modal from '../Ui/Modal/Modal'

// const MotionIconButton = motion(IconButton)

function MessageArea(props, ref) {
    // let numMessages = 0

    const {name: chatName} = useSelector(state => state.homePage.activeChat)
    const {userId} = useSelector(state => state.auth)
    const {username} = useSelector(state => state.auth)
    const {id: activeChatId} = useSelector(state => state.homePage.activeChat)
    const {sentiments = null} = useSelector(state =>
        state.chats.chats.find(chat => chat.id === activeChatId)
    )
    const numMessages = useSelector(
        state =>
            state.chats.chats.find(chat => chat.id === activeChatId).messages
                .length
    ) // numMessages will be always greater than 0
    const inputRef = useRef(null)

    const {
        value: message,
        isValid: isMesssageValid,
        valueChangeHandler: messageChangeHandler,
        inputBlurHandler: messageBlurHandler,
        reset: resetMessage
    } = useInput(value => value.trim().length > 0 && value.length < 1000)

    const {
        isModalOpen: isSendMessageResponseModalOpen,
        openModal: openSendMessageResponseModal,
        closeModal: closeSendMessageResponseModal
    } = useModal()

    const [sendMessageModalData, setSendMessageModalData] = useState({
        isSendingMessageSuccessful: false,
        title: '',
        message: ''
    })

    const {
        isModalOpen: isAnalyzeSentimentResponseModalOpen,
        openModal: openAnalyzeSentimentResponseModal,
        closeModal: closeAnalyzeSentimentResponseModal
    } = useModal()

    const [analyzeSentimentModalData, setAnalyzeSentimentModalData] = useState({
        isAddingSentimentSuccessful: false,
        title: '',
        message: ''
    })

    // focus and reset message each time a new chat is selected
    useEffect(() => {
        if (inputRef.current) inputRef.current.focus()
        resetMessage()
    }, [chatName])

    // useEffect(() => {}, [numMessages])

    async function messageSendHandler(e) {
        e.stopPropagation()
        e.preventDefault()
        resetMessage()

        if (!isMesssageValid) return

        const sendMessageRes = await fetch('/api/send-message', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                text: message,
                time: Date.now(),
                type: 'outgoing',
                fromId: userId,
                fromChatName: username,
                toId: activeChatId
            })
        })

        let sendMessageData
        if (!sendMessageRes.ok) {
            setSendMessageModalData({
                isSendingMessageSuccessful: false,
                title: 'Failure',
                message:
                    'Message could not be sent due to some internal error. Please try again later.'
            })
            openSendMessageResponseModal()
        } else {
            sendMessageData = await sendMessageRes.json()

            if (!sendMessageData.isSendingMessageSuccessful) {
                setSendMessageModalData(sendMessageData)
                openSendMessageResponseModal()
            }
        }

        // Sentiment Analysis

        const analyzeSentimentRes = await fetch('/api/analyze-sentiment', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                text: message,
                // time: Date.now(),
                // type: 'outgoing',
                fromId: userId,
                toId: activeChatId
                // fromChatName: username,
                // toId: activeChatId
            })
        })

        let analyzeSentimentData
        if (!analyzeSentimentRes.ok) {
            setAnalyzeSentimentModalData({
                isAddingSentimentSuccessful: false,
                title: 'Failure',
                message:
                    'Sentiment could not be analyzed due to some internal error. Please try again later.'
            })
            openAnalyzeSentimentResponseModal()
        } else {
            analyzeSentimentData = await analyzeSentimentRes.json()

            if (!analyzeSentimentData.isAddingSentimentSuccessful) {
                setAnalyzeSentimentModalData(analyzeSentimentData)
                openAnalyzeSentimentResponseModal()
            }
        }
    }

    return (
        <>
            <AnimatePresence key='sendMessageResponseModal'>
                {isSendMessageResponseModalOpen && (
                    <Modal
                        title={sendMessageModalData.title}
                        headerIcon='info'
                        message={sendMessageModalData.message}
                        buttonTitle='Ok'
                        buttonType='filled'
                        handleClose={closeSendMessageResponseModal}
                        buttonOnClick={closeSendMessageResponseModal}
                    />
                )}
            </AnimatePresence>
            <AnimatePresence key='analyzeSentimentResponseModal'>
                {isAnalyzeSentimentResponseModalOpen && (
                    <Modal
                        title={analyzeSentimentModalData.title}
                        headerIcon='info'
                        message={analyzeSentimentModalData.message}
                        buttonTitle='Ok'
                        buttonType='filled'
                        handleClose={closeAnalyzeSentimentResponseModal}
                        buttonOnClick={closeAnalyzeSentimentResponseModal}
                    />
                )}
            </AnimatePresence>
            <div className={classes['message-area']}>
                <header className={classes.header}>
                    <div className={classes['chat-details']}>
                        <div className={classes['profile-image-container']}>
                            <Image
                                className={classes.image}
                                src='https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8cHJvZmlsZXxlbnwwfHwwfHw%3D&w=1000&q=80'
                                alt='Profile photo'
                                layout='fill'
                                objectFit='cover'
                            />
                        </div>
                        <h6
                            className={`heading-6 medium ${classes['chat-name']}`}
                        >
                            {/* {props.chatName} */}
                            {/* Andrew Garfield */}
                            {chatName}
                        </h6>
                    </div>
                    <div className={classes['actions-container']}>
                        {sentiments ? (
                            <SentimentsCard
                                sentiments={sentiments}
                                activeChatId={activeChatId}
                                numMessages={numMessages}
                            />
                        ) : null}
                        <div className={classes.actions}>
                            <IconButton
                                className={classes['icon-button']}
                                icon='arrowRight'
                            />
                            <IconButton
                                className={classes['icon-button']}
                                icon='more'
                            />
                        </div>
                    </div>
                </header>
                <div className={classes['messages-container']}>
                    {/* <Message type='incoming' />
                <Message type='outgoing' /> */}
                    <Messages />
                </div>
                <div className={classes['action-bar']}>
                    <form
                        className={classes['action-bar-box']}
                        onSubmit={messageSendHandler}
                    >
                        <input
                            ref={inputRef}
                            className={`paragraph-large regular ${classes.input}`}
                            type='text'
                            placeholder='Message'
                            value={message}
                            onChange={messageChangeHandler}
                            onBlur={messageBlurHandler}
                            autoCorrect='off'
                            spellCheck='false'
                            autoComplete='off'
                            autoCapitalize='off'
                        />
                        <div className={classes.actions}>
                            <IconButton
                                // <IconButton
                                className={classes.send}
                                icon='send'
                                whileTap={{
                                    transform: 'translate(20%, -20%)'
                                }}
                                transition={{duration: 0.1}}
                                isSubmitButton={true}
                                onClick={messageSendHandler}
                            />
                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}

export default MessageArea
