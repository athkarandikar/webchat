import {motion} from 'framer-motion'

import Button from '../Button/Button'
import Icon from '../Icon/Icon'
import IconButton from '../IconButton/IconButton'
import classes from './Modal.module.scss'

// handleClose, headerIcon, title, message, children, buttonTitle, buttonType, buttonOnClick

function Modal(props) {
    const backdrop = (
        <motion.div
            className={classes.backdrop}
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            exit={{opacity: 0}}
            transition={{duration: 0.1}}
            onClick={props.handleClose}
        ></motion.div>
    )

    const overlay = (
        <motion.div
            className={classes.overlay}
            initial={{opacity: 0, scale: 0.9}}
            animate={{opacity: 1, scale: 1}}
            exit={{opacity: 0, scale: 0.9}}
            transition={{duration: 0.2}}
        >
            <header className={classes.header}>
                <div className={classes.title}>
                    <Icon
                        className={classes['header-icon']}
                        icon={props.headerIcon}
                    />
                    <h5
                        className={`heading-5 semi-bold ${classes['header-title']}`}
                    >
                        {props.title}
                    </h5>
                </div>
                <IconButton
                    onClick={props.handleClose}
                    className={classes.close}
                    icon='close'
                />
            </header>
            <main className={classes.body}>
                {props.message ? (
                    <p className={`paragraph regular ${classes['body-text']}`}>
                        {props.message}
                    </p>
                ) : (
                    props.children
                )}
                {/* <p className={`paragraph regular ${classes['body-text']}`}>
                    {props.message ? props.message : props.children}
                </p> */}
            </main>
            {props.buttonTitle && (
                <div className={classes.actions}>
                    <Button
                        title={props.buttonTitle}
                        type={props.buttonType}
                        icon='arrowRight'
                        onClick={props.buttonOnClick}
                        isSubmitButton={props.isSubmitButton}
                    />
                </div>
            )}
        </motion.div>
    )

    return (
        <div className={classes.modal}>
            {backdrop}
            {overlay}
        </div>
    )
}

export default Modal
