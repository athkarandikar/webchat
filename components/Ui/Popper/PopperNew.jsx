import {motion} from 'framer-motion'
import React from 'react'
import classes from './PopperNew.module.scss'

const popperNew = React.forwardRef(function popperNew(props, ref) {
    return (
        <div ref={ref}>
            <div
                className={`${classes.popper} ${
                    classes['popper-' + props.popperPosition]
                }`}
                ref={props.setPopperElement}
                style={props.styles.popper}
                {...props.attributes}
            >
                {props.children}
                {props.arrow && (
                    <div
                        className={
                            classes['popper-arrow'] +
                            ' ' +
                            classes['popper-arrow-' + props.popperPosition]
                        }
                        data-popper-arrow
                        style={props.styles.arrow}
                    ></div>
                )}
            </div>
        </div>
    )
})

export default motion(popperNew)
