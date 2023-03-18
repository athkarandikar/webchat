import {motion} from 'framer-motion'
import {PulseLoader} from 'react-spinners'

import classes from './Loader.module.scss'
import Portal from '../Portal/Portal'

function Loader() {
    const backdrop = (
        <motion.div
            className={classes.backdrop}
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            exit={{opacity: 0}}
            transition={{duration: 0.1}}
        ></motion.div>
    )

    const overlay = (
        <motion.div
            className={classes.overlay}
            initial={{opacity: 0, scale: 0.5}}
            animate={{opacity: 1, scale: 1}}
            exit={{opacity: 0, scale: 0.5}}
            transition={{duration: 0.2}}
        >
            <PulseLoader size={11} speedMultiplier={0.6} />
        </motion.div>
    )

    return (
        <Portal>
            <div className={classes.loader}>
                {backdrop}
                {overlay}
            </div>
        </Portal>
    )
}

export default Loader
