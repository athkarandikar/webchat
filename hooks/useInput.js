import {useReducer} from 'react'

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
    value: the initial value of the input (empty string by default)
*/

const useInput = (validateInput, value = '') => {
    initialInputState.value = value

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

    return {
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
