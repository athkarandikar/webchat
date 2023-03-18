import {updateDoc, doc} from 'firebase/firestore'
import {db} from '../../firebaseConfig'

export default async function handler(req, res) {
    const userId = req.body

    // set isOnline to false
    const docRef = doc(db, 'users', userId)
    await updateDoc(docRef, {isOnline: false})

    return res.status(201).json({
        isLogoutSuccessful: true
    })
}
