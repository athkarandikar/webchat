import {getDoc, doc, onSnapshot, collection} from 'firebase/firestore'

import {db} from '../../firebaseConfig'
import {chatsActions} from './chats'
import store from '../index'

// loads all the chats of the user after logging in
// export function loadChats(userId) {
//     return async dispatch => {
//         const currentUserSnapshot = await getDoc(doc(db, 'users', userId))
//         const {chats = null} = currentUserSnapshot.data()

//         if (chats) {
//             dispatch(chatsActions.setChats(chats))
//         }
//     }
// }

// export function loadChats(userId) {
//     return async dispatch => {
//         const userDocRef = await getDoc(doc(db, 'users', userId))
//         const chatsRef = doc(collection(userDocRef, 'chats'), 'chats')
//         const chats = (await getDoc(chatsRef)).data()
//         console.log('chats: DKLDL\n', chats)

//         if (chats) {
//             dispatch(chatsActions.setChats(chats))
//         }
//     }
// }

export function sendMessage(messageData) {
    return async dispatch => {
        // const res = await fetch('/api/send-message', {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json'
        //     },
        //     body: JSON.stringify(messageData)
        // })
        // let data
        // if (res.ok) {
        //     data = await res.json()
        //     if (data.isSendingMessageSuccessful) {
        //         dispatch(chatsActions.addMessageToChat(messageData))
        //     }
        // }
    }
}

export function receiveRealTimeUpdates(userId) {
    const state = store.getState()
    if (!state.auth.isAuthenticated) return () => {}

    const userDocRef = doc(db, 'users', userId)
    const chatsRef = doc(collection(userDocRef, 'chats'), 'chats')

    // const unsubscribe = onSnapshot(doc(db, 'users', userId), doc => {
    const unsubscribe = onSnapshot(chatsRef, doc => {
        if (!doc.exists()) return () => {}

        const {chats = null} = doc.data()

        // console.log('chats\n', chats)
        if (chats) {
            store.dispatch(chatsActions.setChats(chats))
        }
    })

    return unsubscribe
}
