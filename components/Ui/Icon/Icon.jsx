import React from 'react'
import classes from './Icon.module.scss'
import * as svgs from './Svgs'

function Icon(props) {
    return (
        <div
            className={`${classes.icon} ${
                props.className ? props.className : ''
            }`}
        >
            {svgs[props.icon]}
        </div>
    )
}

export default Icon
