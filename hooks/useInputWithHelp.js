import useInput from './useInput'
import usePopper from './usePopper'

function useInputWithHelp(
    validateInput,
    helpPopperPosition = 'bottom',
    offset = 0
) {
    const {
        value,
        isValid,
        isInvalid,
        valueChangeHandler,
        inputBlurHandler,
        reset
    } = useInput(validateInput)

    const {
        referenceElement,
        setReferenceElement,
        popperElement,
        setPopperElement,
        popperPosition,
        styles,
        attributes
    } = usePopper(helpPopperPosition, offset)

    return {
        value,
        isValid,
        isInvalid,
        valueChangeHandler,
        inputBlurHandler,
        reset,
        referenceElement,
        setReferenceElement,
        popperElement,
        setPopperElement,
        popperPosition,
        styles,
        attributes
    }
}

export default useInputWithHelp
