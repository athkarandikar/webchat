import {useReducer, useState} from 'react'
import {usePopper} from 'react-popper'

const initialInputState = {
    value: '',
    isTouched: false
}

const inputStateReducer = (state, action) => {
    if (action.type === 'INPUT') {
        return {value: action.value, isTouched: state.isTouched}
    }
    if (action.type === 'BLUR') {
        return {isTouched: true, value: state.value}
    }
    if (action.type === 'RESET') {
        return {isTouched: false, value: ''}
    }

    return initialInputState
}

/* parameters:
    validateInput: a function that takes the input value and returns true if the input is valid
    help: a boolean that determines whether the input should have a help element to display help text when the input is invalid
*/

const useInput = validateInput => {
    // VALIDATION

    const [inputState, dispatch] = useReducer(
        inputStateReducer,
        initialInputState
    )

    const isValid = validateInput(inputState.value) // if true, the input is definitely valid
    const isInvalid = !isValid && inputState.isTouched // if true, the input is not definitely invalid but should be rendered as invalid in the UI

    const valueChangeHandler = event => {
        dispatch({type: 'INPUT', value: event.target.value})
    }

    const inputBlurHandler = () => {
        dispatch({type: 'BLUR'})
    }

    const reset = () => {
        dispatch({type: 'RESET'})
    }

    // HELP ELEMENT

    // let referenceElement,
    //     setReferenceElement,
    //     popperElement,
    //     setPopperElement,
    //     styles,
    //     attributes

    // if (help) {
    //     let referenceElementValue = useState(null)
    //     referenceElement = referenceElementValue[0]
    //     setReferenceElement = referenceElementValue[1]

    //     let popperElementValue = useState(null)
    //     popperElement = popperElementValue[0]
    //     setPopperElement = popperElementValue[1]
    //     // const [arrowElement, setArrowElement] = useState(null)
    //     let usePopperReturnValue = usePopper(referenceElement, popperElement, {
    //         placement: helpPopperPosition,
    //         modifiers: [
    //             {
    //                 name: 'offset',
    //                 options: {
    //                     offset: [0, 12]
    //                 }
    //             }
    //         ]
    //     })
    //     styles = usePopperReturnValue.styles
    //     attributes = usePopperReturnValue.attributes
    // }

    // return {
    //     // VALIDATION
    //     value: inputState.value,
    //     isValid,
    //     isInvalid,
    //     valueChangeHandler,
    //     inputBlurHandler,
    //     reset,
    //     // HELP ELEMENT
    //     referenceElement,
    //     setReferenceElement,
    //     popperElement,
    //     setPopperElement,
    //     helpPopperPosition,
    //     styles,
    //     attributes
    // }

    return {
        // VALIDATION
        value: inputState.value,
        isTouched: inputState.isTouched,
        isValid,
        isInvalid,
        valueChangeHandler,
        inputBlurHandler,
        reset
    }
}

export default useInput
