import Image from 'next/image'

import classes from './SentimentsModalSentiment.module.scss'

function SentimentsModalSentiment(props) {
    return (
        <div className={classes.sentiment}>
            <div className={classes['sentiment-emoji-container']}>
                <Image
                    className={classes.emoji}
                    src={`/emojis/${props.name}.png`}
                    alt='Sentiment emoji'
                    layout='fill'
                    objectFit='fill'
                    // quality={100}
                />
            </div>
            <div className={classes['text-container']}>
                <p className={`paragraph-large semi-bold ${classes['name']}`}>
                    {props.name[0].toUpperCase() + props.name.slice(1)}
                </p>
                <p className={`paragraph regular ${classes['percent']}`}>
                    {`${props.percent}%`}
                </p>
            </div>
        </div>
    )
}

export default SentimentsModalSentiment
