import {useState} from 'react'
import ClickAwayListener from 'react-click-away-listener'

import usePopper from '../../../hooks/usePopper'
import IconButton from '../IconButton/IconButton'
import classes from './MenuIconButton.module.scss'
import PopupMenu from '../PopupMenu/PopupMenu'
import Portal from '../Portal/Portal'
import PopperNew from '../Popper/PopperNew'
import {AnimatePresence} from 'framer-motion'

function MenuIconButton(props) {
    const [showMenu, setShowMenu] = useState(false)

    const {
        referenceElement,
        setReferenceElement,
        popperElement,
        setPopperElement,
        popperPosition,
        styles,
        attributes
    } = usePopper('bottom-start', 0)

    function clickHandler() {
        setShowMenu(true)
    }

    function blurHandler() {
        setShowMenu(false)
    }

    return (
        <div className={classes['menu-icon-button']} onClick={clickHandler}>
            <IconButton
                className={props.iconButtonClassName}
                icon={props.icon}
                setReferenceElement={setReferenceElement}
            />
            <AnimatePresence>
                {showMenu && (
                    <Portal>
                        <ClickAwayListener onClickAway={blurHandler}>
                            <PopperNew
                                setPopperElement={setPopperElement}
                                popperPosition={popperPosition}
                                styles={styles}
                                attributes={attributes.popper}
                                arrow={false}
                                initial={{
                                    opacity: 0,
                                    transform: 'translateY(-10px)'
                                }}
                                animate={{
                                    opacity: 1,
                                    transform: 'translateY(0px)'
                                }}
                                exit={{
                                    opacity: 0,
                                    transform: 'translateY(-10px)'
                                }}
                                transition={{duration: 0.1}}
                            >
                                <PopupMenu menuItems={props.menuItems} />
                            </PopperNew>
                        </ClickAwayListener>
                    </Portal>
                )}
            </AnimatePresence>
        </div>
    )
}

export default MenuIconButton
