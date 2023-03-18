import MenuItem from '../MenuItem/MenuItem'
import classes from './PopupMenu.module.scss'

function PopupMenu(props) {
    const menuItems = props.menuItems.map(({icon, text, onClick}) => (
        <MenuItem text={text} icon={icon} key={text} onClick={onClick} />
    ))

    return (
        <div className={classes['popup-menu']} ref={props.setReferenceElement}>
            {menuItems}
        </div>
    )
}

export default PopupMenu
