import {useState} from 'react'
import {isValidPhoneNumber} from 'react-phone-number-input'

function usePhoneInput(value = '') {
    const [phoneNumber, setPhoneNumber] = useState(value)
    const [isTouched, setIsTouched] = useState(false)

    const isPhoneNumberValid = phoneNumber && isValidPhoneNumber(phoneNumber)
    const isPhoneNumberInvalid = !isPhoneNumberValid && isTouched

    // const isPhoneNumberInvalid =
    //     (isTouched && !phoneNumber) ||
    //     (phoneNumber && isValidPhoneNumber(phoneNumber) === false)

    function inputBlurHandler() {
        setIsTouched(true)
    }

    function reset() {
        setPhoneNumber('')
        setIsTouched(false)
    }

    return {
        phoneNumber,
        isPhoneNumberValid,
        isPhoneNumberInvalid,
        valueChangeHandler: setPhoneNumber,
        inputBlurHandler,
        reset
    }
}

export default usePhoneInput
