import {db} from '../../firebaseConfig'
import {collection, addDoc, where, getDocs, query} from 'firebase/firestore'
import {isValidPhoneNumber} from 'react-phone-number-input'

function validateData({
    firstName,
    lastName,
    phoneNumber,
    email,
    username,
    password
}) {
    // TODO: input validation (eg username length, password length)
    if (
        firstName.trim() !== '' &&
        lastName.trim() !== '' &&
        phoneNumber &&
        isValidPhoneNumber(phoneNumber) &&
        email
            .trim()
            .trim()
            .match(
                new RegExp(
                    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                )
            ) &&
        username.trim() !== '' &&
        password // password should have a length ranging from 8 to 20 characters, include at least one special character, one uppercase letter, one lowercase letter, and one number
            .trim()
            .match(
                new RegExp(
                    /^(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z])(?=.*[~`!@#$%^&*()_\-+={[}\]|\\:;"'<,>.?/])[a-zA-Z0-9~`!@#$%^&*()_\-+={[}\]|\\:;"'<,>.?/]{8,20}$/
                )
            )
    ) {
        return true
    }

    return false
}

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const data = req.body

        // if there's no data at all, or any of the required inputs are invalid, return an error
        if (!data || !validateData(data))
            return res.status(201).json({
                isSignupSuccessful: false,
                title: 'Failure',
                message:
                    'Inputs are invalid! Please fill all the inputs correctly.'
            })

        // if the user already exists
        const usersRef = collection(db, 'users')

        const usersWithSameUsername = await getDocs(
            query(usersRef, where('username', '==', data.username))
        )
        const usersWithSamePhoneNumber = await getDocs(
            query(usersRef, where('phoneNumber', '==', data.phoneNumber))
        )
        const usersWithSameEmail = await getDocs(
            query(usersRef, where('email', '==', data.email))
        )

        if (
            usersWithSameUsername.size > 0 ||
            usersWithSamePhoneNumber.size > 0 ||
            usersWithSameEmail.size > 0
        )
            return res.status(201).json({
                isSignupSuccessful: false,
                title: 'Failure',
                message:
                    'User already exists! Please enter a different username, phone number, and email.'
            })

        // TODO: timeout
        const docRef = await addDoc(collection(db, 'users'), data)
        // if (!docRef)  // you don't need this, because if there is the response is not okay, the client side will count it as an internal server error
        //     // internal server error
        //     return res.status(500).json({
        //         isSignupSuccessful: false,
        //         title: 'Failure',
        //         message: 'Some internal error occured. Please try again later.'
        //     })

        // if none of the above responses are sent, the sign-up was successful
        // created (success)
        return res.status(201).json({
            isSignupSuccessful: true,
            title: 'Success',
            message:
                'Sign-up successful! You will now be redirected to the login page.'
        })
    }
}
