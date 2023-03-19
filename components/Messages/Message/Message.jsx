import classes from './Message.module.scss'

function Message(props) {
    // const className = classes[props.type]

    return (
        <div className={`${classes.message} ${classes[props.type]}`}>
            <div className={classes.top}>
                <div className={classes['message-box']}>
                    <p
                        className={`paragraph regular ${classes['message-text']}`}
                    >
                        {/* Hey Shawn 👋🏻 */}
                        {props.text}
                    </p>
                </div>
                {/* <IconButton className={classes.more} icon='more' /> */}
            </div>
            <div className={classes.metadata}>
                <p className={`paragraph-extra-small regular`}>
                    {/* 8:47pm */}
                    {props.time}
                </p>
            </div>
        </div>
    )
}

export default Message
