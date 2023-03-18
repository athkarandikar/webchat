import React from 'react'

import Icon from '../Icon/Icon'
import classes from './IconButton.module.scss'

// const IconButton = React.forwardRef((props, ref) => {
function IconButton(props) {
    return (
        <button
            type={props.isSubmitButton ? 'submit' : 'button'}
            className={`${classes.button} ${
                props.className ? props.className : ''
            }`}
            onClick={props.onClick}
            ref={props.setReferenceElement}
        >
            {/* <img
                className={classes.icon}
                src={`/icons/${props.icon}.svg`}
                alt={props.icon}
            /> */}
            <Icon icon={props.icon} />
        </button>
    )
}
// })

export default IconButton
