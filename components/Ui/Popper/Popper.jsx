import {AnimatePresence} from 'framer-motion'
import {motion} from 'framer-motion'
import classes from './Popper.module.scss'

function popper(props) {
    return (
        <motion.div
            className={
                `${classes.popper} paragraph-small regular ` +
                classes['popper-' + props.popperPosition]
            }
            ref={props.setPopperElement}
            style={props.styles.popper}
            {...props.attributes}
            initial={{
                opacity: 0
            }}
            animate={{
                opacity: 1
            }}
            exit={{
                opacity: 0
            }}
            transition={{duration: 0.2}}
        >
            {/* <p className={classes['help-text']}>{props.helpText}</p> */}
            {props.children}
            <div
                className={
                    classes['popper-arrow'] +
                    ' ' +
                    classes['popper-arrow-' + props.popperPosition]
                }
                data-popper-arrow
                style={props.styles.arrow}
            ></div>
        </motion.div>
    )
}

export default popper
