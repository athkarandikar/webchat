import {useRouter} from 'next/router'
import Head from 'next/head'
import {AnimatePresence} from 'framer-motion'
import {useEffect, useState} from 'react'
import Image from 'next/image'

import classes from './profile.module.scss'
import PhoneInput from '../../../components/Ui/PhoneInput/PhoneInput'
import Button from '../../../components/Ui/Button/Button'
import useInput from '../../../hooks/useInput'
import Input from '../../../components/Ui/Input/Input'
import usePhoneInput from '../../../hooks/usePhoneInput'
import Logo from '../../../components/Logo/Logo'
import Modal from '../../../components/Ui/Modal/Modal'
import useModal from '../../../hooks/useModal'
import Loader from '../../../components/Ui/Loader/Loader'
import {logout} from '../../../store/auth/auth-actions'
import PasswordInput from '../../../components/Ui/PasswordInput/PasswordInput'
import useInputWithHelp from '../../../hooks/useInputWithHelp'
import {useDispatch, useSelector} from 'react-redux'
import {authActions} from '../../../store/auth/auth'

function Profile() {
    const router = useRouter()
    const dispatch = useDispatch()

    const {isAuthenticated} = useSelector(state => state.auth)
    const {userId} = useSelector(state => state.auth)
    const authState = useSelector(state => state.auth)

    // console.log(isAuthenticated)

    const {isModalOpen, openModal, closeModal} = useModal(
        () => {},
        () => {
            if (isUpdateSuccessful) router.push('/home')
        }
    )

    // response data from update-profile api
    const [isUpdateSuccessful, setIsUpdateSuccessful] = useState(false)

    // response data from login-user api
    const [responseData, setResponseData] = useState({
        title: '',
        message: ''
    })

    const [isLoading, setIsLoading] = useState(false)

    function handleModalClose() {
        closeModal()
    }

    // const {
    //     auth: authState = {
    //         firstName: '',
    //         lastName: '',
    //         phoneNumber: '',
    //         email: '',
    //         username: '',
    //         password: ''
    //     }
    // } = useSelector(state => state)

    // const authState = useSelector(state => state.auth)

    // const alertUser = e => {
    //     e.preventDefault()
    //     // console.log('user is trying to leave the page')
    //     // the below message will be displayed in the dialog box before closing (note: some browsers might not show this message)
    //     return (e.returnValue =
    //         'You will be logged out. Are you sure you want to close?')
    // }

    // useEffect(() => {
    //     window.addEventListener('beforeunload', alertUser)

    //     return () => {
    //         window.removeEventListener('beforeunload', alertUser)
    //     }
    // }, [])

    useEffect(() => {
        // if user is not authenticated, redirect to the login page
        // this code runs when the HomePage component mounts
        // console.log(isAuthenticated)
        console.log('hey')
        !isAuthenticated && router.push('/login')

        // this function logs out the user if any other page is visited (when the HomePage component is unmounted)
        // return () => {
        //     // if the user is not authenticated or if the base path is home, then don't log out the user
        //     console.log('lskdjfklsdfjdk')
        //     if (!isAuthenticated) return
        //     setIsLoading(true)

        //     dispatch(logout(userId))
        //     setIsLoading(false)
        // }
    }, [])

    async function saveChangesHandler(event) {
        event.preventDefault()
        setIsLoading(true)

        const newAuthData = {
            firstName: firstName.value,
            lastName: lastName.value,
            phoneNumber: phoneNumber.phoneNumber,
            email: email.value,
            username: username.value,
            password: password.value
        }

        if (
            authState.firstName === newAuthData.firstName &&
            authState.lastName === newAuthData.lastName &&
            authState.phoneNumber === newAuthData.phoneNumber &&
            authState.email === newAuthData.email &&
            authState.username === newAuthData.username &&
            authState.password === newAuthData.password
        ) {
            setResponseData({
                title: 'Failure',
                message:
                    'You did not change any of your details. Your profile details have not been affected.'
            })
            setIsLoading(false)
            openModal()
            return
        }

        const res = await fetch('/api/update-profile', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({userId, oldAuthData: authState, newAuthData})
        })
        let data
        if (!res.ok) {
            setResponseData({
                title: 'Failure',
                message: 'Some internal error occured. Please try again later.'
            })
        } else {
            data = await res.json()
            const {isUpdateSuccessful, title, message} = data
            setResponseData({title, message})

            if (isUpdateSuccessful) {
                setIsUpdateSuccessful(isUpdateSuccessful)
                dispatch(authActions.updateProfile(newAuthData))
            }
        }
        setIsLoading(false)
        openModal() // shows a modal with either a success or an error message
    }

    let firstName, lastName, phoneNumber, email, username, password

    if (isAuthenticated) {
        firstName = useInput(value => value.trim() !== '', authState.firstName)
        lastName = useInput(value => value.trim() !== '', authState.lastName)
        phoneNumber = usePhoneInput(authState.phoneNumber)
        email = useInput(
            value =>
                value
                    .trim()
                    .match(
                        new RegExp(
                            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                        )
                    ),
            authState.email
        )
        username = useInput(value => value.trim() !== '', authState.username)
        password = useInputWithHelp(
            value =>
                value
                    .trim()
                    .match(
                        new RegExp(
                            /^(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z])(?=.*[~`!@#$%^&*()_\-+={[}\]|\\:;"'<,>.?/])[a-zA-Z0-9~`!@#$%^&*()_\-+={[}\]|\\:;"'<,>.?/]{8,20}$/
                        )
                    ),
            authState.password,
            'left',
            12
        )
    }

    // const {
    //     value: firstName,
    //     isValid: isFirstNameValid,
    //     isInvalid: isFirstNameInvalid,
    //     valueChangeHandler: firstNameChangeHandler,
    //     inputBlurHandler: firstNameBlurHandler,
    //     reset: resetFirstName
    // } = useInput(value => value.trim() !== '', authState.firstName)

    // const {
    //     value: lastName,
    //     isValid: isLastNameValid,
    //     isInvalid: isLastNameInvalid,
    //     valueChangeHandler: lastNameChangeHandler,
    //     inputBlurHandler: lastNameBlurHandler,
    //     reset: resetLastName
    // } = useInput(value => value.trim() !== '', authState.lastName)
    // // TODO: style the dropdown menu (select) while choosing country code
    // const {
    //     phoneNumber,
    //     isPhoneNumberValid,
    //     isPhoneNumberInvalid,
    //     valueChangeHandler: phoneNumberChangeHandler,
    //     inputBlurHandler: phoneNumberBlurHandler,
    //     reset: resetPhoneNumber
    // } = usePhoneInput(authState.phoneNumber)

    // const {
    //     value: email,
    //     isValid: isEmailValid,
    //     isInvalid: isEmailInvalid,
    //     valueChangeHandler: emailChangeHandler,
    //     inputBlurHandler: emailBlurHandler,
    //     reset: resetEmail
    //     // } = useInput(value => value.trim() !== '')
    // } = useInput(
    //     value =>
    //         value
    //             .trim()
    //             .match(
    //                 new RegExp(
    //                     /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    //                 )
    //             ),
    //     authState.email
    // )

    // const {
    //     value: username,
    //     isValid: isUsernameValid,
    //     isInvalid: isUsernameInvalid,
    //     valueChangeHandler: usernameChangeHandler,
    //     inputBlurHandler: usernameBlurHandler,
    //     reset: resetUsername
    // } = useInput(value => value.trim() !== '', authState.username)

    // const {
    //     value: password,
    //     isValid: isPasswordValid,
    //     isInvalid: isPasswordInvalid,
    //     valueChangeHandler: passwordChangeHandler,
    //     inputBlurHandler: passwordBlurHandler,
    //     reset: resetPassword,
    //     referenceElement: passwordReferenceElement,
    //     setReferenceElement: setPasswordReferenceElement,
    //     popperElement: passwordPopperElement,
    //     setPopperElement: setPasswordPopperElement,
    //     popperPosition: passwordPopperPosition,
    //     styles: passwordPopperStyles,
    //     attributes: passwordPopperAttributes
    // } = useInputWithHelp(
    //     value =>
    //         value
    //             .trim()
    //             .match(
    //                 new RegExp(
    //                     /^(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z])(?=.*[~`!@#$%^&*()_\-+={[}\]|\\:;"'<,>.?/])[a-zA-Z0-9~`!@#$%^&*()_\-+={[}\]|\\:;"'<,>.?/]{8,20}$/
    //                 )
    //             ),
    //     authState.password,
    //     'left',
    //     12
    // )

    function btnHomeHandler(e) {
        // e.preventDefault()
        // setIsLoading(true)
        router.push('/home')
        // setIsLoading(false)
    }

    return (
        isAuthenticated && (
            <>
                {isLoading && <Loader />}
                <Head>
                    <title>Profile</title>
                </Head>

                <AnimatePresence>
                    {isModalOpen && (
                        <Modal
                            title={responseData.title}
                            headerIcon={
                                isUpdateSuccessful
                                    ? 'infoSuccess'
                                    : 'infoFailure'
                            }
                            message={responseData.message}
                            buttonTitle='Ok'
                            buttonType='filled'
                            handleClose={handleModalClose}
                            buttonOnClick={handleModalClose}
                        />
                    )}
                </AnimatePresence>
                <div className={classes.profile}>
                    <Logo className={classes['container-logo']} type='full' />

                    <div className={classes['container-profile-image']}>
                        <Image
                            className={classes['profile-image']}
                            src='/icons/user.png'
                            alt='Profile photo'
                            layout='fill'
                            objectFit='cover'
                        />
                    </div>

                    <div
                        className={classes['form-profile']}
                        // onSubmit={saveChangesHandler}
                    >
                        <div className={classes.inputs}>
                            <Input
                                value={firstName.value}
                                onBlur={firstName.inputBlurHandler}
                                onChange={firstName.valueChangeHandler}
                                title='First Name'
                                id='first-name'
                                type='text'
                                options={{
                                    autoCorrect: 'off',
                                    spellCheck: 'false',
                                    autoComplete: 'given-name',
                                    autoCapitalize: 'on'
                                }}
                                errorText={
                                    firstName.isInvalid
                                        ? 'Enter a valid first name'
                                        : ''
                                }
                            />
                            <Input
                                value={lastName.value}
                                onBlur={lastName.inputBlurHandler}
                                onChange={lastName.valueChangeHandler}
                                title='Last Name'
                                id='last-name'
                                type='text'
                                options={{
                                    autoCorrect: 'off',
                                    spellCheck: 'false',
                                    autoComplete: 'family-name',
                                    autoCapitalize: 'on'
                                }}
                                errorText={
                                    lastName.isInvalid
                                        ? 'Enter a valid last name'
                                        : ''
                                }
                            />
                            <PhoneInput
                                inputProps={{
                                    value: phoneNumber.phoneNumber,
                                    onBlur: phoneNumber.inputBlurHandler,
                                    onChange: phoneNumber.valueChangeHandler,
                                    type: 'tel'
                                }}
                                title='Phone Number'
                                id='phone-number'
                                errorText={
                                    phoneNumber.isPhoneNumberInvalid
                                        ? 'Enter a valid phone number'
                                        : ''
                                }
                            />
                            <Input
                                value={email.value}
                                onBlur={email.inputBlurHandler}
                                onChange={email.valueChangeHandler}
                                title='Email Address'
                                id='email'
                                type='email'
                                options={{
                                    autoCorrect: 'off',
                                    spellCheck: 'false',
                                    autoComplete: 'email',
                                    autoCapitalize: 'off'
                                }}
                                errorText={
                                    email.isInvalid ? 'Enter a valid email' : ''
                                }
                            />
                            <Input
                                value={username.value}
                                onBlur={username.inputBlurHandler}
                                onChange={username.valueChangeHandler}
                                title='Username'
                                id='username'
                                type='text'
                                options={{
                                    autoCorrect: 'off',
                                    spellCheck: 'false',
                                    autoComplete: 'off',
                                    autoCapitalize: 'off'
                                }}
                                errorText={
                                    username.isInvalid
                                        ? 'Enter a valid username'
                                        : ''
                                }
                            />
                            <PasswordInput
                                value={password.value}
                                onBlur={password.inputBlurHandler}
                                onChange={password.valueChangeHandler}
                                title='Password'
                                id='password'
                                type='password'
                                options={{
                                    autoCorrect: 'off',
                                    spellCheck: 'false',
                                    autoComplete: 'new-password',
                                    autoCapitalize: 'off'
                                }}
                                errorText={
                                    password.isInvalid
                                        ? 'Enter a valid password'
                                        : ''
                                }
                                helpText='Password should range from 8 to 20 characters, include at least one special character, one uppercase letter, one lowercase letter, and one number'
                                setReferenceElement={
                                    password.setReferenceElement
                                }
                                setPopperElement={password.setPopperElement}
                                popperPosition={password.popperPosition}
                                styles={password.styles}
                                attributes={password.attributes}
                            />
                        </div>
                        <div className={classes.actions}>
                            <Button
                                title='Home'
                                type='outlined'
                                onClick={btnHomeHandler}
                            />
                            <Button
                                title='Save Changes'
                                type='filled'
                                icon='arrowRight'
                                isSubmitButton={true}
                                onClick={saveChangesHandler}
                            />
                        </div>
                    </div>
                </div>
            </>
        )
    )
}

export default Profile
