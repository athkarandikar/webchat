import {chatsActions} from '../chats/chats'
import {homePageActions} from '../homePage/homePage'
import {authActions} from './auth'
// import {doc, getDoc, updateDoc} from 'firebase/firestore'
// import {db} from '../../firebaseConfig'

// async function setIsUserOnline(userId, isUserOnline) {
//     const docRef = doc(db, 'users', userId)
//     await updateDoc(docRef, {isOnline: isUserOnline})
// }

// export function login(data) {
//     return async dispatch => {
//         const {userId} = data

//         // try {
//         dispatch(authActions.login(data))
//         await setIsUserOnline(userId, true)
//         // } catch (error) {}
//     }
// }

// resets the state (from all slices)
export function logout(userId) {
    return async dispatch => {
        await fetch('/api/set-online-status', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({userId, isOnline: false})
        })
        dispatch(authActions.reset())
        dispatch(homePageActions.reset())
        dispatch(chatsActions.reset())
    }
}
