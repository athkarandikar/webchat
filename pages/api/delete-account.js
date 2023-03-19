import {collection, deleteDoc, doc, getDoc} from 'firebase/firestore'
import {db} from '../../firebaseConfig'

export default async function handler(req, res) {
    const userId = req.body

    if (!userId) {
        return res.status(201).json({
            isDeletingAccountSuccessful: false,
            title: 'Failure',
            message: 'Some internal error occured. Please try again later.'
        })
    }

    // delete data from the database

    const userRef = doc(db, 'users', userId)
    const chatsRef = doc(collection(userRef, 'chats'), 'chats')

    // delete the subcollections of the user
    const chatsDoc = await getDoc(chatsRef)
    if (chatsDoc.exists()) deleteDoc(chatsRef)

    // delete the user document
    deleteDoc(userRef)

    return res.status(201).json({
        isDeletingAccountSuccessful: true
    })
}
