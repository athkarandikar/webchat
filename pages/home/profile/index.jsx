import {useRouter} from 'next/router'
import Head from 'next/head'
import {AnimatePresence} from 'framer-motion'
import {useState} from 'react'
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
import PasswordInput from '../../../components/Ui/PasswordInput/PasswordInput'
import useInputWithHelp from '../../../hooks/useInputWithHelp'
import {useDispatch, useSelector} from 'react-redux'
import {authActions} from '../../../store/auth/auth'

function Profile() {
    const router = useRouter()
    const dispatch = useDispatch()

    const userId = useSelector(state => state.auth.userId)

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

    const authState = useSelector(state => state.auth)

    async function saveChangesHandler(event) {
        event.preventDefault()
        setIsLoading(true)

        const newAuthData = {
            firstName,
            lastName,
            phoneNumber,
            email,
            username,
            password
        }

        if (
            authState.firstName === firstName ||
            authState.lastName === lastName ||
            authState.phoneNumber === phoneNumber ||
            authState.email === email ||
            authState.username === username ||
            authState.password === password
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

    // TODO: input validation
    const {
        value: firstName,
        isValid: isFirstNameValid,
        isInvalid: isFirstNameInvalid,
        valueChangeHandler: firstNameChangeHandler,
        inputBlurHandler: firstNameBlurHandler,
        reset: resetFirstName
    } = useInput(
        value => value.trim() !== '',
        authState.firstName && authState.firstName
    )

    const {
        value: lastName,
        isValid: isLastNameValid,
        isInvalid: isLastNameInvalid,
        valueChangeHandler: lastNameChangeHandler,
        inputBlurHandler: lastNameBlurHandler,
        reset: resetLastName
    } = useInput(
        value => value.trim() !== '',
        authState.lastName && authState.lastName
    )
    // TODO: style the dropdown menu (select) while choosing country code
    const {
        phoneNumber,
        isPhoneNumberValid,
        isPhoneNumberInvalid,
        valueChangeHandler: phoneNumberChangeHandler,
        inputBlurHandler: phoneNumberBlurHandler,
        reset: resetPhoneNumber
    } = usePhoneInput(authState.phoneNumber && authState.phoneNumber)

    const {
        value: email,
        isValid: isEmailValid,
        isInvalid: isEmailInvalid,
        valueChangeHandler: emailChangeHandler,
        inputBlurHandler: emailBlurHandler,
        reset: resetEmail
        // } = useInput(value => value.trim() !== '')
    } = useInput(
        value =>
            value
                .trim()
                .match(
                    new RegExp(
                        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                    )
                ),
        authState.email && authState.email
    )

    const {
        value: username,
        isValid: isUsernameValid,
        isInvalid: isUsernameInvalid,
        valueChangeHandler: usernameChangeHandler,
        inputBlurHandler: usernameBlurHandler,
        reset: resetUsername
    } = useInput(
        value => value.trim() !== '',
        authState.username && authState.username
    )

    const {
        value: password,
        isValid: isPasswordValid,
        isInvalid: isPasswordInvalid,
        valueChangeHandler: passwordChangeHandler,
        inputBlurHandler: passwordBlurHandler,
        reset: resetPassword,
        referenceElement: passwordReferenceElement,
        setReferenceElement: setPasswordReferenceElement,
        popperElement: passwordPopperElement,
        setPopperElement: setPasswordPopperElement,
        popperPosition: passwordPopperPosition,
        styles: passwordPopperStyles,
        attributes: passwordPopperAttributes
    } = useInputWithHelp(
        value =>
            value
                .trim()
                .match(
                    new RegExp(
                        /^(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z])(?=.*[~`!@#$%^&*()_\-+={[}\]|\\:;"'<,>.?/])[a-zA-Z0-9~`!@#$%^&*()_\-+={[}\]|\\:;"'<,>.?/]{8,20}$/
                    )
                ),
        authState.password ? authState.password : '',
        'left',
        12
    )

    function btnHomeHandler(e) {
        // e.preventDefault()
        // setIsLoading(true)
        router.push('/home')
        // setIsLoading(false)
    }

    return (
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
                            isUpdateSuccessful ? 'infoSuccess' : 'infoFailure'
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
                        src='https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8cHJvZmlsZXxlbnwwfHwwfHw%3D&w=1000&q=80'
                        alt='Profile photo'
                        layout='fill'
                        objectFit='cover'
                    />
                </div>

                <form
                    className={classes['form-profile']}
                    onSubmit={saveChangesHandler}
                >
                    <div className={classes.inputs}>
                        <Input
                            value={firstName}
                            onBlur={firstNameBlurHandler}
                            onChange={firstNameChangeHandler}
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
                                isFirstNameInvalid
                                    ? 'Enter a valid first name'
                                    : ''
                            }
                        />
                        <Input
                            value={lastName}
                            onBlur={lastNameBlurHandler}
                            onChange={lastNameChangeHandler}
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
                                isLastNameInvalid
                                    ? 'Enter a valid last name'
                                    : ''
                            }
                        />
                        <PhoneInput
                            inputProps={{
                                value: phoneNumber,
                                onBlur: phoneNumberBlurHandler,
                                onChange: phoneNumberChangeHandler,
                                type: 'tel'
                            }}
                            title='Phone Number'
                            id='phone-number'
                            errorText={
                                isPhoneNumberInvalid
                                    ? 'Enter a valid phone number'
                                    : ''
                            }
                        />
                        <Input
                            value={email}
                            onBlur={emailBlurHandler}
                            onChange={emailChangeHandler}
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
                                isEmailInvalid ? 'Enter a valid email' : ''
                            }
                        />
                        <Input
                            value={username}
                            onBlur={usernameBlurHandler}
                            onChange={usernameChangeHandler}
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
                                isUsernameInvalid
                                    ? 'Enter a valid username'
                                    : ''
                            }
                        />
                        <PasswordInput
                            value={password}
                            onBlur={passwordBlurHandler}
                            onChange={passwordChangeHandler}
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
                                isPasswordInvalid
                                    ? 'Enter a valid password'
                                    : ''
                            }
                            helpText='Password should range from 8 to 20 characters, include at least one special character, one uppercase letter, one lowercase letter, and one number'
                            setReferenceElement={setPasswordReferenceElement}
                            setPopperElement={setPasswordPopperElement}
                            popperPosition={passwordPopperPosition}
                            styles={passwordPopperStyles}
                            attributes={passwordPopperAttributes}
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
                        />
                    </div>
                </form>
            </div>
        </>
    )
}

export default Profile
