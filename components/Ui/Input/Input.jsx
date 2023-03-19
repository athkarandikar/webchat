import React, {useState, useEffect} from 'react'
import {motion, AnimatePresence} from 'framer-motion'

import classes from './Input.module.scss'
import Popper from '../Popper/Popper'
import Portal from '../Portal/Portal'
import useAutoFocus from '../../../hooks/useAutoFocus'

/* props:

    NECESSARY:
        PROPERTIES:
            id: string
            title: string
            value: string
            type: string
            name: string
        FUNCTIONS & METHODS:
            onBlur
            onChange

    OPTIONAL:
        PROPERTIES:
            errorText: string
            helpText: string
            options: object
*/

function Input(props) {
    const [showHelp, setShowHelp] = useState(false)
    const [isHelpClicked, setIsHelpClicked] = useState(false)

    useEffect(() => {
        if (showHelp && props.errorText === '') {
            setShowHelp(false)
            setIsHelpClicked(false)
        }
    }, [props.errorText])

    const inputRef = useAutoFocus(props.autoFocus)

    return (
        <div key={props.id} className={classes.input}>
            {React.isValidElement(props.title) ? (
                props.title
            ) : (
                <label htmlFor={props.id} className='heading-6 medium'>
                    {props.title}
                </label>
            )}

            <input
                ref={inputRef}
                value={props.value}
                className={`paragraph regular ${classes['input-box']} ${
                    props.errorText && classes['input--error']
                }`}
                type={props.type}
                name={props.id}
                id={props.id}
                {...props.options}
                onBlur={props.onBlur}
                onChange={props.onChange}
                autoFocus={props.autoFocus}
            />
            <AnimatePresence>
                {props.errorText && (
                    <motion.div
                        className={classes['error-footer']}
                        initial={{
                            transform: 'translateY(1rem)',
                            opacity: 0
                        }}
                        animate={{
                            transform: 'translateY(0rem)',
                            opacity: 1
                        }}
                        exit={{
                            transform: 'translateY(1rem)',
                            opacity: 0
                        }}
                        transition={{duration: 0.2}}
                    >
                        {props.helpText && (
                            <>
                                <button
                                    type='button'
                                    className={`${
                                        classesInput['help-icon']
                                    } paragraph regular ${
                                        showHelp
                                            ? classesInput['help-visible']
                                            : ''
                                    }`}
                                    ref={props.setReferenceElement}
                                    onMouseEnter={() => setShowHelp(true)}
                                    onMouseLeave={() =>
                                        !isHelpClicked && setShowHelp(false)
                                    }
                                    onClick={() => {
                                        if (isHelpClicked) {
                                            setIsHelpClicked(false)
                                            setShowHelp(false)
                                        } else {
                                            setIsHelpClicked(true)
                                            setShowHelp(true)
                                        }
                                    }}
                                >
                                    ?
                                </button>

                                <AnimatePresence>
                                    {showHelp && (
                                        <Portal>
                                            <Popper
                                                setPopperElement={
                                                    props.setPopperElement
                                                }
                                                popperPosition={
                                                    props.popperPosition
                                                }
                                                styles={props.styles}
                                                attributes={
                                                    props.attributes.popper
                                                }
                                                helpText={props.helpText}
                                            ></Popper>
                                        </Portal>
                                    )}
                                </AnimatePresence>
                            </>
                        )}

                        <p className={classes['error-text']}>
                            {props.errorText}
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

export default Input
