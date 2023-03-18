import {updateDoc, doc} from 'firebase/firestore'
import {db} from '../../firebaseConfig'

export default async function handler(req, res) {
    const {userId, isOnline} = req.body

    const docRef = doc(db, 'users', userId)
    await updateDoc(docRef, {isOnline})

    return res.status(201).json({
        isLogoutSuccessful: true
    })
}
