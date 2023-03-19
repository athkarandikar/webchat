import {useSelector} from 'react-redux'
import Message from '../Message/Message'

function Messages(props) {
    const activeChatMessages = useSelector(
        state =>
            state.chats.chats.find(
                chat => chat.id === state.homePage.activeChat.id
            ).messages
    )

    const messages = activeChatMessages
        ? activeChatMessages.map(({text, time, type}) => {
              const timeString = new Date(time).toLocaleTimeString('en-US', {
                  timeStyle: 'short'
              })

              if (type === 'info')
                  return <Message key={time} type={type} text={text} />
              else
                  return (
                      <Message
                          key={time}
                          type={type}
                          time={timeString}
                          text={text}
                      />
                  )
          })
        : []

    return <>{messages ? messages : <></>}</>
}

export default Messages
