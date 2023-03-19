import Icon from '../Icon/Icon'

import classes from './Button.module.scss'

function Button(props) {
    let className = props.type

    return (
        <button
            type={props.isSubmitButton ? 'submit' : 'button'}
            className={`${classes.button} ${classes[className]}`}
            onClick={props.onClick}
        >
            <p className='paragraph-large bold'>{props.title}</p>
            {props.icon && (
                // <div className={classes['container-image-icon']}>
                //     {/* <Image
                //         src={`/icons/${props.icon}.svg`}
                //         alt={props.icon}
                //         layout='fill'
                //         objectFit='fill'
                //     /> */}
                // </div>
                <Icon
                    className={classes['container-image-icon']}
                    icon={props.icon}
                />
            )}
        </button>
    )
}

export default Button
