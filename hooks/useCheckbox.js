import {useState} from 'react'

function useCheckbox(isCheckboxChecked) {
    const [isChecked, setIsChecked] = useState(isCheckboxChecked)

    return {isChecked, setIsChecked}
}

export default useCheckbox
