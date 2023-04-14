import {AnimatePresence} from 'framer-motion'
import {useRouter} from 'next/router'
import Head from 'next/head'
import {useState} from 'react'
import {useDispatch} from 'react-redux'
// import auth, {authActions} from '../../store/auth/auth'

import classes from './login.module.scss'
import useInput from '../../hooks/useInput'
import Button from '../../components/Ui/Button/Button'
import Input from '../../components/Ui/Input/Input'
import useModal from '../../hooks/useModal'
import Logo from '../../components/Logo/Logo'
import Modal from '../../components/Ui/Modal/Modal'
import Loader from '../../components/Ui/Loader/Loader'
import {authActions} from '../../store/auth/auth'
import PasswordInput from '../../components/Ui/PasswordInput/PasswordInput'
import Checkbox from '../../components/Ui/Checkbox/Checkbox'

function LoginPage() {
    const router = useRouter()
    const dispatch = useDispatch()

    // const userId = useSelector(state => state.auth.userId)

    const {isModalOpen, openModal, closeModal} = useModal()

    const [isLoginSuccessful, setIsLoginSuccessful] = useState(false)

    // response data from login-user api
    const [responseData, setResponseData] = useState({
        title: '',
        message: ''
    })

    const [isLoading, setIsLoading] = useState(false)

    // const alertUser = e => {
    //     e.preventDefault()
    //     return (e.returnValue =
    //         'You will be logged out. Are you sure you want to close?')
    // }

    // useEffect(() => {
    //     window.addEventListener('beforeunload', alertUser)

    //     return () => {
    //         window.removeEventListener('beforeunload', alertUser)
    //     }
    // })

    async function formSubmitHandler(event) {
        event.preventDefault()
        setIsLoading(true)

        const loginData = {
            username,
            password
        }

        const res = await fetch('/api/login-user', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(loginData)
        })

        let data
        if (!res.ok) {
            setResponseData({
                isSignupSuccessful: false,
                title: 'Failure',
                message: 'Some internal error occured. Please try again later.'
            })
            openModal()
        } else {
            data = await res.json()
            setResponseData(data)

            if (data.isLoginSuccessful) {
                setIsLoginSuccessful(true)
                dispatch(
                    authActions.login({
                        username,
                        userId: data.userId,
                        firstName: data.firstName,
                        lastName: data.lastName,
                        phoneNumber: data.phoneNumber,
                        email: data.email,
                        password: data.password
                    })
                )
                // dispatch(loadChats(data.userId))
                router.push('/home')
            } else {
                openModal()
            }
        }

        setIsLoading(false)
    }

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
        reset: resetPassword
    } = useInput(value =>
        value
            .trim()
            .match(
                new RegExp(
                    /^(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z])(?=.*[~`!@#$%^&*()_\-+={[}\]|\\:;"'<,>.?/])[a-zA-Z0-9~`!@#$%^&*()_\-+={[}\]|\\:;"'<,>.?/]{8,20}$/
                )
            )
    )

    function btnSignupClickHandler() {
        setIsLoading(true)
        router.push('/signup')
        setIsLoading(false)
    }

    return (
        <>
            {isLoading && <Loader />}

            <Head>
                <title>Login</title>
            </Head>

            <AnimatePresence>
                {isModalOpen && (
                    <Modal
                        title={responseData.title}
                        headerIcon={
                            isLoginSuccessful ? 'infoSuccess' : 'infoFailure'
                        }
                        message={responseData.message}
                        buttonTitle='Ok'
                        buttonType='filled'
                        handleClose={closeModal}
                        buttonOnClick={closeModal}
                    />
                )}
            </AnimatePresence>
            <div className={classes.login}>
                <Logo className={classes['container-logo']} type='full' />
                <form
                    className={classes['form-login']}
                    onSubmit={formSubmitHandler}
                >
                    <div className={classes.inputs}>
                        <Input
                            autoFocus={true}
                            value={username}
                            onBlur={usernameBlurHandler}
                            onChange={usernameChangeHandler}
                            title='Username'
                            id='username'
                            type='text'
                            options={{
                                autoCorrect: 'off',
                                spellCheck: 'false',
                                autoComplete: 'username',
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
                            errorText={
                                isPasswordInvalid
                                    ? 'Enter a valid password'
                                    : ''
                            }
                            options={{
                                autoComplete: 'current-password'
                            }}
                        />
                    </div>
                    <div className={classes.actions}>
                        <p className={`regular ${classes['action-text']}`}>
                            Don't have an account?
                        </p>
                        <div className={classes['action-buttons']}>
                            <Button
                                title='Sign Up'
                                type='outlined'
                                onClick={btnSignupClickHandler}
                            />
                            <Button
                                title='Login'
                                type='filled'
                                icon='arrowRight'
                                isSubmitButton={true}
                            />
                        </div>
                    </div>
                </form>
            </div>
        </>
    )
}

export default LoginPage
