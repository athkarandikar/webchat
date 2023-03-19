import {AnimatePresence, motion} from 'framer-motion'
import Icon from '../Icon/Icon'
import classes from './Checkbox.module.scss'

function Checkbox(props) {
    return (
        <div className={classes.checkbox}>
            <input
                type='checkbox'
                name={props.id}
                id={props.id}
                checked={props.isChecked}
                onChange={props.onChange}
            />

            <div className={classes.box}>
                <Icon
                    className={`${classes['check-icon']}`}
                    icon={props.isChecked ? 'check' : ''}
                />
            </div>

            <label className={classes.text} htmlFor={props.id}>
                {props.text}
            </label>
        </div>
    )
}

export default Checkbox
