import {AnimatePresence} from 'framer-motion'
import React, {useState} from 'react'

import Logo from '../Logo/Logo'
import classes from './Header.module.scss'
import Modal from '../../components/Ui/Modal/Modal'
import useModal from '../../hooks/useModal'
import Input from '../Ui/Input/Input'
import useInput from '../../hooks/useInput'
import MenuIconButton from '../Ui/MenuIconButton/MenuIconButton'
import {useSelector} from 'react-redux'
import Loader from '../Ui/Loader/Loader'
import Checkbox from '../Ui/Checkbox/Checkbox'
import useCheckbox from '../../hooks/useCheckbox'
import {useRouter} from 'next/router'
import IconButton from '../Ui/IconButton/IconButton'

const inputOptions = {
    autoCorrect: 'off',
    spellCheck: 'false',
    autoComplete: 'off',
    autoCapitalize: 'off'
}

function Header() {
    const router = useRouter()

    const currentUsername = useSelector(state => state.auth.username)
    const currentUserId = useSelector(state => state.auth.userId)

    const [responseModalData, setResponseModalData] = useState({
        title: '',
        message: ''
    })

    const [isLoading, setIsLoading] = useState(false)

    const {
        isModalOpen: isAddUserResponseModalOpen,
        openModal: openAddUserResponseModal,
        closeModal: closeAddUserResponseModal
    } = useModal()

    const {
        isModalOpen: isAddUserModalOpen,
        openModal: openAddUserModal,
        closeModal: closeAddUserModal,
        justCloseModal: justCloseAddUserModal
    } = useModal(
        () => {},
        async () => {
            if (!isUsernameValid || !isUsernameTouched) return
            setIsLoading(true)

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
                    title: 'Failure',
                    message:
                        'Some internal error occured. Please try again later.'
                })
                openAddUserResponseModal()
            } else {
                data = await res.json()

                if (!data.isAddingUserSuccessful) {
                    setResponseModalData({
                        title: data.title,
                        message: data.message
                    })
                    openAddUserResponseModal()
                }
            }

            setIsLoading(false)
        }
    )

    const [isDeletingAccountSuccessful, setIsDeletingAccountSuccessful] =
        useState(false)

    const {
        isModalOpen: isDeleteAccountResponseModalOpen,
        openModal: openDeleteAccountResponseModal,
        closeModal: closeDeleteAccountResponseModal
    } = useModal(
        () => {},
        () => {
            if (isDeletingAccountSuccessful) router.push('/login')
        }
    )

    const {
        isModalOpen: isDeleteAccountModalOpen,
        openModal: openDeleteAccountModal,
        closeModal: closeDeleteAccountModal,
        justCloseModal: justCloseDeleteAccountModal
    } = useModal(
        () => {},
        async () => {
            resetDeleteConfirmation()
            setIsTermsCheckboxChecked(false)

            if (!isTermsCheckboxChecked || !isDeleteConfirmationValid) {
                setResponseModalData({
                    title: 'Failure',
                    message:
                        'You must agree to the terms and conditions and enter the confirmation.'
                })
                openDeleteAccountResponseModal()
                return
            }

            setIsLoading(true)

            const res = await fetch('/api/delete-account', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(currentUserId)
            })

            let data
            if (!res.ok) {
                setResponseModalData({
                    title: 'Failure',
                    message:
                        'Some internal error occured. Please try again later.'
                })
            } else {
                data = await res.json()

                if (!data.isDeletingAccountSuccessful) {
                    setResponseModalData({
                        title: data.title,
                        message: data.message
                    })
                } else {
                    setIsDeletingAccountSuccessful(true)
                    setResponseModalData({
                        title: 'Success',
                        message:
                            'Your account and your data has been deleted. You will now be logged out.'
                    })
                }
            }

            openDeleteAccountResponseModal()
            setIsLoading(false)
        }
    )

    const {
        value: username,
        isTouched: isUsernameTouched,
        isValid: isUsernameValid,
        isInvalid: isUsernameInvalid,
        valueChangeHandler: usernameChangeHandler,
        inputBlurHandler: usernameBlurHandler,
        reset: resetUsername
    } = useInput(value => value.trim() !== '')

    const {
        value: deleteConfirmation,
        isTouched: isDeleteConfirmationTouched,
        isValid: isDeleteConfirmationValid,
        isInvalid: isDeleteConfirmationInvalid,
        valueChangeHandler: deleteConfirmationChangeHandler,
        inputBlurHandler: deleteConfirmationBlurHandler,
        reset: resetDeleteConfirmation
    } = useInput(value => value.trim() === 'delete my account')

    const {
        isChecked: isTermsCheckboxChecked,
        setIsChecked: setIsTermsCheckboxChecked
    } = useCheckbox(false)

    function termsCheckboxChangeHandler() {
        setIsTermsCheckboxChecked(!isTermsCheckboxChecked)
    }

    function openUserProfileModal() {
        router.push('/home/profile')
    }

    return (
        // create a function to handle modals of all the menu options, after adding more menu options
        <>
            {isLoading && <Loader />}
            <AnimatePresence key='newUserModal'>
                {isAddUserModalOpen && (
                    <Modal
                        title='New Chat'
                        headerIcon='newUser'
                        buttonTitle='Ok'
                        buttonType='filled'
                        handleClose={() => {
                            justCloseAddUserModal()
                            resetUsername()
                        }}
                        buttonOnClick={closeAddUserModal}
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
            </AnimatePresence>
            <AnimatePresence key='addUserResponseModal'>
                {isAddUserResponseModalOpen && (
                    <Modal
                        title={responseModalData.title}
                        headerIcon='infoFailure' // bacause the response modal is only used for failure
                        buttonType='filled'
                        buttonTitle='Ok'
                        message={responseModalData.message}
                        handleClose={closeAddUserResponseModal}
                        buttonOnClick={closeAddUserResponseModal}
                    />
                )}
            </AnimatePresence>
            <AnimatePresence key='deleteAccountModal'>
                {isDeleteAccountModalOpen && (
                    <Modal
                        title='Delete Account'
                        headerIcon='trashRed'
                        buttonTitle='Delete'
                        buttonType='caution--filled'
                        handleClose={justCloseDeleteAccountModal}
                        buttonOnClick={closeDeleteAccountModal}
                    >
                        <div className={classes['delete-form']}>
                            <div className={classes.terms}>
                                <p
                                    className={`paragraph regular ${classes.paragraph}`}
                                >
                                    Your account and your data will be deleted
                                    immediately.
                                </p>
                                <Checkbox
                                    text='I understand the above'
                                    id='terms'
                                    isChecked={isTermsCheckboxChecked}
                                    onChange={termsCheckboxChangeHandler}
                                />
                            </div>
                            <Input
                                value={deleteConfirmation}
                                onBlur={deleteConfirmationBlurHandler}
                                onChange={deleteConfirmationChangeHandler}
                                title={
                                    <label
                                        htmlFor='delete-confirmation'
                                        className='paragraph regular'
                                    >
                                        Enter&nbsp;
                                        <span className='paragraph bold'>
                                            delete my account
                                        </span>
                                    </label>
                                }
                                id='delete-confirmation'
                                type='text'
                                options={inputOptions}
                                errorText={
                                    isDeleteConfirmationInvalid
                                        ? 'Enter a valid confirmation'
                                        : ''
                                }
                            />
                        </div>
                    </Modal>
                )}
            </AnimatePresence>
            <AnimatePresence key='deleteAccountResponseModal'>
                {isDeleteAccountResponseModalOpen && (
                    <Modal
                        title={responseModalData.title}
                        headerIcon={
                            isDeletingAccountSuccessful
                                ? 'infoSuccess'
                                : 'infoFailure'
                        }
                        buttonType='filled'
                        buttonTitle='Ok'
                        message={responseModalData.message}
                        handleClose={closeDeleteAccountResponseModal}
                        buttonOnClick={closeDeleteAccountResponseModal}
                    />
                )}
            </AnimatePresence>
            <div className={classes.header}>
                <Logo className={classes['container-logo']} type='full' />
                <div className={classes.actions}>
                    <IconButton
                        className={classes['icon-button']}
                        icon='user'
                        onClick={openUserProfileModal}
                    />
                    <MenuIconButton
                        iconButtonClassName={classes['icon-button']}
                        icon='more'
                        menuItems={[
                            {
                                text: 'New User',
                                icon: 'newUser',
                                onClick: () => {
                                    openAddUserModal()
                                }
                            },
                            {
                                text: 'Delete Account',
                                icon: 'newUser',
                                onClick: () => {
                                    openDeleteAccountModal()
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
