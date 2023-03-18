import {AnimatePresence} from 'framer-motion'
import {useState} from 'react'

import IconButton from '../Ui/IconButton/IconButton'
import Logo from '../Logo/Logo'
import classes from './Header.module.scss'
import PopupMenu from '../Ui/PopupMenu/PopupMenu'
import Modal from '../../components/Ui/Modal/Modal'
import useModal from '../../hooks/useModal'
import Input from '../Ui/Input/Input'
import useInput from '../../hooks/useInput'
import MenuIconButton from '../Ui/MenuIconButton/MenuIconButton'
import {useEffect} from 'react'
import {useDispatch} from 'react-redux'
import {useSelector} from 'react-redux'
import Loader from '../Ui/Loader/Loader'
import {chatsActions} from '../../store/chats/chats'

const inputOptions = {
    autoCorrect: 'off',
    spellCheck: 'false',
    autoComplete: 'off',
    autoCapitalize: 'off'
}

function Header() {
    const dispatch = useDispatch()

    const currentUsername = useSelector(state => state.auth.username)
    const currentUserId = useSelector(state => state.auth.userId)

    const [responseModalData, setResponseModalData] = useState({
        isAddingUserSuccessful: false,
        title: '',
        message: ''
    })

    const [isLoading, setIsLoading] = useState(false)

    const {
        isModalOpen: isNewUserModalOpen,
        openModal: openNewUserModal,
        closeModal: closeNewUserModal,
        justCloseModal: justCloseNewUserModal
    } = useModal(
        () => {},
        async () => {
            if (!isUsernameValid || !isUsernameTouched) return
            setIsLoading(true)

            console.log('hei')

            resetUsername()
            const res = await fetch('/api/add-user', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({username, currentUsername, currentUserId})
            })

            let data
            if (!res.ok) {
                setResponseModalData({
                    isAddingUserSuccessful: false,
                    title: 'Failure',
                    message:
                        'Some internal error occured. Please try again later.'
                })
                openResponseModal()
            } else {
                data = await res.json()

                // if (data.isAddingUserSuccessful) {
                //     dispatch(
                //         chatsActions.addUser({
                //             username,
                //             id: data.id,
                //             name: data.name
                //         })
                //     )
                // } else {
                //     setResponseModalData(data)
                //     openResponseModal()
                // }
                if (!data.isAddingUserSuccessful) {
                    setResponseModalData(data)
                    openResponseModal()
                }
            }

            setIsLoading(false)
        }
    )

    const {
        isModalOpen: isResponseModalOpen,
        openModal: openResponseModal,
        closeModal: closeResponseModal
    } = useModal()

    const {
        value: username,
        isTouched: isUsernameTouched,
        isValid: isUsernameValid,
        isInvalid: isUsernameInvalid,
        valueChangeHandler: usernameChangeHandler,
        inputBlurHandler: usernameBlurHandler,
        reset: resetUsername
    } = useInput(value => value.trim() !== '')

    return (
        // create a function to handle modals of all the menu options, after adding more menu options
        <>
            {isLoading && <Loader />}
            <AnimatePresence key='newUserModal'>
                {isNewUserModalOpen && (
                    <Modal
                        title='New Chat'
                        headerIcon='newUser'
                        buttonTitle='Ok'
                        buttonType='filled'
                        isSubmitButton={true}
                        handleClose={justCloseNewUserModal}
                        buttonOnClick={closeNewUserModal}
                    >
                        <Input
                            autoFocus={true}
                            value={username}
                            onBlur={usernameBlurHandler}
                            onChange={usernameChangeHandler}
                            title='Username'
                            id='username'
                            type='text'
                            options={inputOptions}
                            errorText={
                                isUsernameInvalid
                                    ? 'Enter a valid username'
                                    : ''
                            }
                        />
                    </Modal>
                )}
                <AnimatePresence key='responseModal'>
                    {isResponseModalOpen && (
                        <Modal
                            title={responseModalData.title}
                            headerIcon='info'
                            message={responseModalData.message}
                            handleClose={closeResponseModal}
                            buttonOnClick={closeResponseModal}
                        />
                    )}
                </AnimatePresence>
            </AnimatePresence>
            <div className={classes.header}>
                <Logo className={classes['container-logo']} type='full' />
                <div className={classes.actions}>
                    <IconButton
                        className={classes['icon-button']}
                        icon='user'
                    />
                    <MenuIconButton
                        iconButtonClassName={classes['icon-button']}
                        icon='more'
                        menuItems={[
                            {
                                text: 'New User',
                                icon: 'newUser',
                                onClick: () => {
                                    openNewUserModal()
                                }
                            }
                        ]}
                    />
                </div>
            </div>
        </>
    )
}

export default Header
