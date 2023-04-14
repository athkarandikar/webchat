import {db} from '../../firebaseConfig'
import {collection, where, getDocs, query, updateDoc} from 'firebase/firestore'

function validateData({username, password}) {
    // TODO: input validation (eg username length, password length)
    if (
        username.trim() !== '' &&
        password
            .trim()
            .match(
                new RegExp(
                    /^(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z])(?=.*[~`!@#$%^&*()_\-+={[}\]|\\:;"'<,>.?/])[a-zA-Z0-9~`!@#$%^&*()_\-+={[}\]|\\:;"'<,>.?/]{8,20}$/
                )
            )
    )
        return true
    return false
}

export default async function handler(req, res) {
    const data = req.body

    // if there's no data at all, or any of the required inputs are invalid, return an error
    if (!data || !validateData(data)) {
        // response was created
        return res.status(201).json({
            isLoginSuccessful: false,
            title: 'Failure',
            message: 'Inputs are invalid! Please fill all the inputs correctly.'
        })
    }

    // if the user exists but credentials are incorrect
    // TODO: timeout
    const users = await getDocs(
        query(
            collection(db, 'users'),
            where('username', '==', data.username),
            where('password', '==', data.password)
        )
    )

    if (users.size === 0) {
        return res.status(201).json({
            isLoginSuccessful: false,
            title: 'Failure',
            message:
                'Incorrect username or password. Please enter correct credentials.'
        })
    }

    const user = users.docs[0]
    const userData = user.data()

    // if the user exists and credentials are correct (success)

    // set isOnline to true
    await updateDoc(users.docs[0].ref, {isOnline: true})

    return res.status(201).json({
        isLoginSuccessful: true,
        userId: user.id,
        firstName: userData.firstName,
        lastName: userData.lastName,
        phoneNumber: userData.phoneNumber,
        email: userData.email,
        password: userData.password
        // title: 'Success',
        // message: 'Inputs are invalid! Please fill all the inputs correctly.'
    })
}
