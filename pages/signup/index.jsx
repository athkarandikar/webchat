import {useRouter} from 'next/router'
import Head from 'next/head'
import {AnimatePresence} from 'framer-motion'
import {useState} from 'react'

import classes from './signup.module.scss'
import PhoneInput from '../../components/Ui/PhoneInput/PhoneInput'
import Button from '../../components/Ui/Button/Button'
import useInput from '../../hooks/useInput'
import Input from '../../components/Ui/Input/Input'
import usePhoneInput from '../../hooks/usePhoneInput'
import Logo from '../../components/Logo/Logo'
import Modal from '../../components/Ui/Modal/Modal'
import useModal from '../../hooks/useModal'
import Loader from '../../components/Ui/Loader/Loader'
import PasswordInput from '../../components/Ui/PasswordInput/PasswordInput'
import useInputWithHelp from '../../hooks/useInputWithHelp'
import Icon from '../../components/Ui/Icon/Icon'

function SignupPage() {
    const router = useRouter()

    const {isModalOpen, openModal, closeModal} = useModal(
        () => {},
        () => {
            if (responseData.isSignupSuccessful) router.push('/login')
        }
    )

    // response data from signup-user api
    const [responseData, setResponseData] = useState({
        isSignupSuccessful: false,
        title: '',
        message: ''
    })

    const [isLoading, setIsLoading] = useState(false)

    async function signupHandler(event) {
        event.preventDefault()
        setIsLoading(true)

        const signupData = {
            firstName,
            lastName,
            phoneNumber,
            email,
            username,
            password
        }

        const res = await fetch('/api/signup-user', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(signupData)
        })

        let data
        if (!res.ok) {
            setResponseData({
                isSignupSuccessful: false,
                title: 'Failure',
                message: 'Some internal error occured. Please try again later.'
            })
        } else {
            data = await res.json()
            setResponseData(data)
        }

        setIsLoading(false)
        openModal() // shows a modal with either a success or an error message

        // if (data.isSignupSuccessful) {
        //     resetFirstName()
        //     resetLastName()
        //     resetPhoneNumber()
        //     resetEmail()
        //     resetUsername()
        //     resetPassword()
        // }
    }

    function handleModalClose() {
        closeModal()
    }
    // TODO: input validation
    const {
        value: firstName,
        isValid: isFirstNameValid,
        isInvalid: isFirstNameInvalid,
        valueChangeHandler: firstNameChangeHandler,
        inputBlurHandler: firstNameBlurHandler,
        reset: resetFirstName
    } = useInput(value => value.trim() !== '')

    const {
        value: lastName,
        isValid: isLastNameValid,
        isInvalid: isLastNameInvalid,
        valueChangeHandler: lastNameChangeHandler,
        inputBlurHandler: lastNameBlurHandler,
        reset: resetLastName
    } = useInput(value => value.trim() !== '')
    // TODO: style the dropdown menu (select) while choosing country code
    const {
        phoneNumber,
        isPhoneNumberValid,
        isPhoneNumberInvalid,
        valueChangeHandler: phoneNumberChangeHandler,
        inputBlurHandler: phoneNumberBlurHandler,
        reset: resetPhoneNumber
    } = usePhoneInput()

    const {
        value: email,
        isValid: isEmailValid,
        isInvalid: isEmailInvalid,
        valueChangeHandler: emailChangeHandler,
        inputBlurHandler: emailBlurHandler,
        reset: resetEmail
        // } = useInput(value => value.trim() !== '')
    } = useInput(value =>
        value
            .trim()
            .match(
                new RegExp(
                    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                )
            )
    )

    const {
        value: username,
        isValid: isUsernameValid,
        isInvalid: isUsernameInvalid,
        valueChangeHandler: usernameChangeHandler,
        inputBlurHandler: usernameBlurHandler,
        reset: resetUsername
    } = useInput(value => value.trim() !== '')

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
        '',
        'left',
        12
    )

    function btnCancelHandler(e) {
        e.preventDefault()
        setIsLoading(true)
        router.push('/login')
        setIsLoading(false)
    }

    return (
        <>
            {isLoading && <Loader />}

            <Head>
                <title>Sign Up</title>
            </Head>

            <AnimatePresence>
                {isModalOpen && (
                    <Modal
                        title={responseData.title}
                        headerIcon={
                            responseData.isSignupSuccessful
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
            <div className={classes.signup}>
                <Logo className={classes['container-logo']} type='full' />
                <form
                    className={classes['form-signup']}
                    onSubmit={signupHandler}
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
                            title='Cancel'
                            type='outlined'
                            onClick={btnCancelHandler}
                        />
                        <Button
                            title='Sign Up'
                            type='filled'
                            icon='arrowRight'
                            isSubmitButton={true}
                        />
                    </div>
                </form>
            </div>

            {/* {passwordHelp} */}
        </>
    )
}

export default SignupPage
