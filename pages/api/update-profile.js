import {
    updateDoc,
    doc,
    where,
    getDocs,
    query,
    collection,
    FieldPath
} from 'firebase/firestore'
import {db} from '../../firebaseConfig'

export default async function handler(req, res) {
    const data = req.body

    // if there's no data, return an error
    if (!data) {
        return res.status(201).json({
            isUpdateSuccessful: false,
            title: 'Failure',
            message: 'Profile could not be updated. Please try again later.'
        })
    }

    const {userId, oldAuthData, newAuthData} = req.body

    // if the user with new details already exists
    const usersRef = collection(db, 'users')
    const usersWithSameUsername = await getDocs(
        query(usersRef, where('username', '==', newAuthData.username))
    )

    const usersWithSamePhoneNumber = await getDocs(
        query(usersRef, where('phoneNumber', '==', newAuthData.phoneNumber))
    )
    const usersWithSameEmail = await getDocs(
        query(usersRef, where('email', '==', newAuthData.email))
    )

    // > 1 because the current user is also included in the query
    if (
        usersWithSameUsername.size > 1 ||
        usersWithSamePhoneNumber.size > 1 ||
        usersWithSameEmail.size > 1
    )
        return res.status(201).json({
            isSignupSuccessful: false,
            title: 'Failure',
            message:
                'User already exists! Please enter a different username, phone number, and email.'
        })

    const finalAuthData = {}

    for (const key in newAuthData) {
        if (newAuthData[key] !== oldAuthData[key]) {
            finalAuthData[key] = newAuthData[key]
        }
    }

    const userDocRef = doc(db, 'users', userId)
    updateDoc(userDocRef, finalAuthData)

    return res.status(201).json({
        isUpdateSuccessful: true,
        title: 'Success',
        message: 'Profile updated successfully.'
    })
}
