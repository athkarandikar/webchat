import {usePopper as usePopperHook} from 'react-popper'
import {useState} from 'react'

function usePopper(popperPosition, offset = 0) {
    const [referenceElement, setReferenceElement] = useState(null)
    const [popperElement, setPopperElement] = useState(null)

    const {styles, attributes} = usePopperHook(
        referenceElement,
        popperElement,
        {
            placement: popperPosition,
            modifiers: [
                {
                    name: 'offset',
                    options: {
                        offset: [0, offset]
                    }
                }
            ]
        }
    )

    return {
        referenceElement,
        setReferenceElement,
        popperElement,
        setPopperElement,
        popperPosition,
        styles,
        attributes
    }
}

export default usePopper
