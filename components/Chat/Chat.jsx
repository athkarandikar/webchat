import Image from 'next/image'
import {useDispatch, useSelector} from 'react-redux'
import {homePageActions} from '../../store/homePage/homePage'

import classes from './Chat.module.scss'

function Chat(props) {
    let className = ''
    let additionalInfoText = ''
    let isAdditionalInfoTextPresent = true

    const {id: activeChatId} = useSelector(state => state.homePage.activeChat)
    const dispatch = useDispatch()

    switch (props.type) {
        case 'new': // just added (no recent message)
            className = classes['new']
            isAdditionalInfoTextPresent = false
            break
        case 'old': // has some recent message
            className = classes['old']
            additionalInfoText = props.recentMessage
            break
        case 'online': // is online
            className = classes['online']
            additionalInfoText = 'Online'
            break
        case 'typing': // is typing
            className = classes['typing']
            additionalInfoText = 'Typing...'
            break
    }

    function clickHandler(e) {
        if (activeChatId === props.id) return
        dispatch(
            homePageActions.setActiveChat({id: props.id, name: props.chatName})
        )
    }

    return (
        <div
            className={`${classes.chat} ${
                props.setActive ? classes['active'] : ''
            }`}
            onClick={e => clickHandler(e)}
        >
            <div className={classes['chat-details']}>
                <div className={classes['container-profile-image']}>
                    <Image
                        className={classes.image}
                        src='/icons/user.png'
                        alt='Profile photo'
                        layout='fill'
                        objectFit='cover'
                    />
                </div>
                <div className={classes.text}>
                    <p
                        className={`paragraph-large regular ${classes['chat-name']}`}
                    >
                        {props.chatName}
                    </p>
                    {isAdditionalInfoTextPresent && (
                        <p className={`paragraph regular ${className}`}>
                            {additionalInfoText}
                        </p>
                    )}
                </div>
            </div>
            {/* <IconButton
                className={classes['icon-button']}
                icon='more'
                onClick={e => {
                    e.stopPropagation() // prevent parent's click handler from firing
                }}
            /> */}
        </div>
    )
}

export default Chat
