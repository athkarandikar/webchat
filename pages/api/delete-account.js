import {deleteDoc, doc} from 'firebase/firestore'
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

    // delete the user
    deleteDoc(doc(db, 'users', userId))

    return res.status(201).json({
        isDeletingAccountSuccessful: true
    })
}
