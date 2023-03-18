import {useEffect, useRef} from 'react'

function useAutoFocus(autoFocus) {
    const ref = useRef(null)

    useEffect(() => {
        if (ref.current && autoFocus) {
            ref.current.focus()
        }
    }, [])

    return ref
}

export default useAutoFocus
