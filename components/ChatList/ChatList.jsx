import {useSelector} from 'react-redux'

import classes from './ChatList.module.scss'
import Chat from '../Chat/Chat'
import Header from '../Header/Header'

function ChatList() {
    const chats = useSelector(state => state.chats.chats)
    const {id: activeChatId} = useSelector(state => state.homePage.activeChat)

    const chatList = chats ? (
        chats.map(({id, name, lastName, recentMessage, messages}) => {
            return (
                <Chat
                    key={id}
                    id={id}
                    chatName={name}
                    setActive={id === activeChatId ? true : false}
                />
            )
        })
    ) : (
        <p style={{color: 'white'}}>No chats yet</p>
    )

    return (
        <div className={classes['chat-menu']}>
            <Header />
            {chatList}
        </div>
    )
}

export default ChatList
