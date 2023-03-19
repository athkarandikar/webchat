// import {useState} from 'react'
import PhoneNumberInput from 'react-phone-number-input'
import {motion, AnimatePresence} from 'framer-motion'

import classesInput from '../Input/Input.module.scss'
import classesPhoneInput from './PhoneInput.module.scss'

function PhoneInput(props) {
    return (
        <div
            key={props.id}
            className={`${classesInput.input} ${classesPhoneInput['input-box']}`}
        >
            <label htmlFor={props.id} className='heading-6 medium'>
                {props.title}
            </label>
            <PhoneNumberInput
                id={props.id}
                name={props.id}
                {...props.inputProps}
                className={`paragraph regular ${
                    props.errorText && classesInput['input--error']
                }`}
                autoComplete='tel'
            />
            <AnimatePresence>
                {props.errorText && (
                    <motion.p
                        className={classesInput['error-text']}
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
                        {props.errorText}
                    </motion.p>
                )}
            </AnimatePresence>
        </div>
    )
}

export default PhoneInput
