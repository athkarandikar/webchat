import {useEffect, useState} from 'react'
import {motion, AnimatePresence} from 'framer-motion'

import PopperNew from '../Popper/PopperNew'
import Portal from '../Portal/Portal'
import classesInput from '../Input/Input.module.scss'
import classesPasswordInput from './PasswordInput.module.scss'
import IconButton from '../IconButton/IconButton'
import useAutoFocus from '../../../hooks/useAutoFocus'

function PasswordInput(props) {
    const [showHelp, setShowHelp] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [isHelpClicked, setIsHelpClicked] = useState(false)

    function passwordVisibilityHandler() {
        showPassword ? setShowPassword(false) : setShowPassword(true)
    }

    useEffect(() => {
        if (showHelp && props.errorText === '') {
            setShowHelp(false)
            setIsHelpClicked(false)
        }
    }, [props.errorText])

    const inputRef = useAutoFocus(props.autoFocus)

    return (
        <div key={props.id} className={classesInput.input}>
            <label htmlFor={props.id} className='heading-6 medium'>
                {props.title}
            </label>
            <div
                className={`${classesInput['input-box']} ${
                    classesPasswordInput['input-box']
                } ${props.errorText && classesInput['input--error']}`}
            >
                <input
                    ref={inputRef}
                    value={props.value}
                    className='paragraph regular'
                    type={showPassword ? 'text' : props.type}
                    name={props.id}
                    id={props.id}
                    {...props.options}
                    onBlur={props.onBlur}
                    onChange={props.onChange}
                />
                <AnimatePresence>
                    <IconButton
                        className={classesPasswordInput['icon-button']}
                        onClick={passwordVisibilityHandler}
                        icon={showPassword ? 'hide' : 'show'}
                    />
                </AnimatePresence>
            </div>
            <AnimatePresence>
                {props.errorText && (
                    <motion.div
                        className={classesInput['error-footer']}
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
                                            {/* <Popper
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
                                            ></Popper> */}
                                            <PopperNew
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
                                                arrow={true}
                                                initial={{
                                                    opacity: 0
                                                }}
                                                animate={{
                                                    opacity: 1
                                                }}
                                                exit={{
                                                    opacity: 0
                                                }}
                                                transition={{duration: 0.2}}
                                            >
                                                <p
                                                    className={`paragraph-small regular ${classesPasswordInput['help-text']}`}
                                                >
                                                    {props.helpText}
                                                </p>
                                            </PopperNew>
                                        </Portal>
                                    )}
                                </AnimatePresence>
                            </>
                        )}

                        <p className={classesInput['error-text']}>
                            {props.errorText}
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

export default PasswordInput
