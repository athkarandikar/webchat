import classes from './MenuItem.module.scss'
import Icon from '../Icon/Icon'

function MenuItem(props) {
    return (
        <div className={classes['menu-item']} onClick={props.onClick}>
            {props.icon && <Icon icon={props.icon} className={classes.icon} />}
            <p className={`paragraph regular ${classes.text}`}>{props.text}</p>
        </div>
    )
}

export default MenuItem
