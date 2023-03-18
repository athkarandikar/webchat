import {updateDoc, doc, getDoc, collection, setDoc} from 'firebase/firestore'
import {db} from '../../firebaseConfig'

// async function addMessageToChats(senderId, receiverId, message) {
//     const chatsRef = doc(db, 'users', senderId)
//     const chatsSnapshot = await getDoc(chatsRef)
//     const {chats = null} = chatsSnapshot.data()

//     const chat = chats.find(chat => chat.id === receiverId)

//     if (chat.messages) {
//         // if there are some messages in the chat
//         chat.messages.push(message)
//     } else {
//         // if there are no messages in the chat
//         chat.messages = [message]
//     }

//     await updateDoc(chatsRef, {
//         chats
//     })

//     return true
// }

/*
if the chats subcollection exists
    get the doc with id as chats

*/

// async function addMessageToChats(senderId, receiverId, message, toChatName) {
//     const senderDocRef = doc(db, 'users', senderId)
//     const chatsRef = doc(collection(senderDocRef, 'chats'), 'chats')
//     const {chats = null} = (await getDoc(chatsRef)).data()
//     console.log(chats)

//     if (chats) {
//         const chat = chats.find(chat => chat.id === receiverId)

//         if (chat.messages) {
//             // if there are some messages in the chat
//             chat.messages.push(message)
//         } else {
//             // if there are no messages in the chat
//             chat.messages = [message]
//         }

//         await updateDoc(chatsRef, {
//             chats
//         })
//     } else {
//         // if the chats subcollection doesn't exist
//         await setDoc(chatsRef, {
//             chats: [
//                 {
//                     id: receiverId,
//                     messages: [message],
//                     name: toChatName
//                 }
//             ]
//         })
//     }

//     return true
// }

async function addMessageToSenderChats(senderId, receiverId, message) {
    const senderDocRef = doc(db, 'users', senderId)
    const chatsRef = doc(collection(senderDocRef, 'chats'), 'chats')
    const {chats} = (await getDoc(chatsRef)).data()

    // the sender will always have the receiver in his chats, so there is no need to check if the chat exists
    const chat = chats.find(chat => chat.id === receiverId)

    if (chat.messages) {
        // if there are some messages in the chat
        chat.messages.push(message)
    } else {
        // if there are no messages in the chat
        chat.messages = [message]
    }

    await updateDoc(chatsRef, {chats})

    return true
}

async function addMessageToReceiverChats(
    senderId,
    senderChatName,
    receiverId,
    message
) {
    const receiverDocRef = doc(db, 'users', receiverId)
    const chatsRef = doc(collection(receiverDocRef, 'chats'), 'chats')
    const chatsDoc = await getDoc(chatsRef)
    // const {chats} = (await getDoc(chatsRef)).data()

    // if the chats document exists in the chats subcollection
    if (chatsDoc.exists()) {
        const {chats} = chatsDoc.data()

        const chatIndex = chats.findIndex(chat => chat.id === senderId)
        const chat = chats[chatIndex]

        if (chat) {
            // if the receiver has the sender in his chats
            if (chat.messages) {
                // if there are some messages in the chat
                chat.messages.push(message)
            } else {
                // if there are no messages in the chat
                chat.messages = [message]
            }

            chats.splice(chatIndex, 1)
            chats.unshift(chat)
        } else {
            // if the receiver does not have the sender in his chats
            chats.unshift({
                id: senderId,
                messages: [message],
                name: senderChatName
            })
        }

        await updateDoc(chatsRef, {chats})
    } else {
        // if the chats document does not exist in the chats subcollection
        await setDoc(chatsRef, {
            chats: [
                {
                    id: senderId,
                    messages: [message],
                    name: senderChatName
                }
            ]
        })
    }

    return true
}

export default async function handler(req, res) {
    const data = req.body

    // if there's no data, return an error
    if (!data) {
        return res.status(201).json({
            isSendingMessageSuccessful: false,
            title: 'Failure',
            message: 'Message could not be sent. Please try again later.'
        })
    }

    const {text, time, type, fromId, fromChatName, toId} = req.body

    const isUpdatingSenderChatsSuccessful = await addMessageToSenderChats(
        fromId,
        toId,
        {text, time, type}
    )

    const isUpdatingReceiverChatsSuccessful = await addMessageToReceiverChats(
        fromId,
        fromChatName,
        toId,
        {text, time, type: 'incoming'}
    )

    if (
        !isUpdatingSenderChatsSuccessful ||
        !isUpdatingReceiverChatsSuccessful
    ) {
        return res.status(201).json({
            isSendingMessageSuccessful: false
        })
    }

    res.status(201).json({
        isSendingMessageSuccessful: true
    })
}
