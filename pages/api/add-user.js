import {
    updateDoc,
    doc,
    getDoc,
    query,
    collection,
    where,
    getDocs,
    setDoc
} from 'firebase/firestore'
import {db} from '../../firebaseConfig'

function validateUsername(username) {
    if (username.trim() !== '') return true
    return false
}

export default async function handler(req, res) {
    const {username, currentUsername, currentUserId} = req.body

    // if there's no data at all, or any of the required inputs are invalid, return an error
    if (!username || !validateUsername(username)) {
        // response was created
        return res.status(201).json({
            // userExists: false,
            isAddingUserSuccessful: false,
            title: 'Failure',
            message: 'Username is invalid! Please enter a correct username.'
        })
    }

    // if the user is trying to add himself
    if (username === currentUsername) {
        return res.status(201).json({
            // userExists: false,
            isAddingUserSuccessful: false,
            title: 'Failure',
            message: 'You cannot add yourself.'
        })
    }

    // if the user does not exist
    const users = await getDocs(
        query(collection(db, 'users'), where('username', '==', username))
    )
    if (users.size === 0) {
        return res.status(201).json({
            // userExists: false,
            isAddingUserSuccessful: false,
            title: 'Failure',
            message: 'User does not exist.'
        })
    }

    // if the user exists

    const userToAdd = users.docs[0]
    // extract data
    const id = userToAdd.id
    const {firstName, lastName} = userToAdd.data()

    // add the user to the current user's list of chats
    // const currentUserDoc = doc(db, 'users', currentUserId)
    // const currentUserSnapshot = await getDoc(currentUserDoc)
    // const {chats = null} = currentUserSnapshot.data()

    const currentUserDoc = doc(db, 'users', currentUserId)
    const chatsCollectionRef = collection(currentUserDoc, 'chats')
    const chatsRef = doc(chatsCollectionRef, 'chats')

    const chatsDoc = await getDoc(chatsRef)
    let chats = null

    // if the chats doc does not exist in the chats subcollection
    if (!chatsDoc.exists()) {
        // console.log('No such document!')

        await setDoc(chatsRef, {
            chats: [{id: userToAdd.id, name: `${firstName} ${lastName}`}]
        })
    } else {
        chats = chatsDoc.data().chats

        // if the user to add is already present in the list of chats
        if (chats.find(chat => chat.id === userToAdd.id)) {
            return res.status(201).json({
                isAddingUserSuccessful: false,
                title: 'Failure',
                message: 'User already exists in your chats.'
            })
        } else {
            // if the user to add is not present in the list of chats
            await updateDoc(chatsRef, {
                chats: [
                    {id: userToAdd.id, name: `${firstName} ${lastName}`},
                    ...chats
                ]
            })
        }
    }

    // console.log('asdfsadfasdfsdfasdf\n\n\n')
    // console.log(chats)

    // if the chats document already exists in the chats subcollection
    // if (chats) {
    //     // if the user is already present in the list of chats
    //     if (chats.find(chat => chat.id === userToAdd.id)) {
    //         return res.status(201).json({
    //             // userExists: true,
    //             isAddingUserSuccessful: false,
    //             title: 'Failure',
    //             message: 'User already exists in your chats.'
    //         })
    //     } else {
    //         // if the user is not present in the list of chats
    //         await updateDoc(currentUserDoc, {
    //             chats: [
    //                 {id: userToAdd.id, name: `${firstName} ${lastName}`},
    //                 ...chats
    //             ]
    //         })
    //     }
    // }
    // else {
    //     // if the chats document does not exist in the chats subcollection
    //     await updateDoc(chatsRef, {
    //         chats: [{id: userToAdd.id, name: `${firstName} ${lastName}`}]
    //     })
    // }

    // if (chats) {

    // } else {}
    // chats.push(id)
    // await updateDoc(currentUserDoc, {chats})

    return res.status(201).json({
        // userExists: true,
        isAddingUserSuccessful: true,
        id,
        name: `${firstName} ${lastName}`
    })
}

// export default async function handler(req, res) {
//     const {username, currentUsername, currentUserId} = req.body

//     // if there's no data at all, or any of the required inputs are invalid, return an error
//     if (!username || !validateUsername(username)) {
//         // response was created
//         return res.status(201).json({
//             // userExists: false,
//             isAddingUserSuccessful: false,
//             title: 'Failure',
//             message: 'Username is invalid! Please enter a correct username.'
//         })
//     }

//     // if the user is trying to add himself
//     if (username === currentUsername) {
//         return res.status(201).json({
//             // userExists: false,
//             isAddingUserSuccessful: false,
//             title: 'Failure',
//             message: 'You cannot add yourself.'
//         })
//     }

//     // if the user does not exist
//     const users = await getDocs(
//         query(collection(db, 'users'), where('username', '==', username))
//     )
//     if (users.size === 0) {
//         return res.status(201).json({
//             // userExists: false,
//             isAddingUserSuccessful: false,
//             title: 'Failure',
//             message: 'User does not exist.'
//         })
//     }

//     // if the user exists

//     const userToAdd = users.docs[0]
//     // extract data
//     const id = userToAdd.id
//     const {firstName, lastName} = userToAdd.data()

//     // add the user to the current user's list of chats
//     const currentUserDoc = doc(db, 'users', currentUserId)
//     const currentUserSnapshot = await getDoc(currentUserDoc)
//     const {chats = null} = currentUserSnapshot.data()

//     // if the chat list already exists
//     if (chats) {
//         // if the user is already present in the list of chats
//         if (chats.find(chat => chat.id === userToAdd.id)) {
//             return res.status(201).json({
//                 // userExists: true,
//                 isAddingUserSuccessful: false,
//                 title: 'Failure',
//                 message: 'User already exists in your chats.'
//             })
//         } else {
//             // if the user is not present in the list of chats

//             await updateDoc(currentUserDoc, {
//                 chats: [
//                     {id: userToAdd.id, name: `${firstName} ${lastName}`},
//                     ...chats
//                 ]
//             })
//         }
//     } else {
//         // if the user is not present in the list of chats
//         await updateDoc(currentUserDoc, {
//             chats: [{id: userToAdd.id, name: `${firstName} ${lastName}`}]
//         })
//     }

//     // if (chats) {

//     // } else {}
//     // chats.push(id)
//     // await updateDoc(currentUserDoc, {chats})

//     return res.status(201).json({
//         // userExists: true,
//         isAddingUserSuccessful: true,
//         id,
//         name: `${firstName} ${lastName}`
//     })
// }
