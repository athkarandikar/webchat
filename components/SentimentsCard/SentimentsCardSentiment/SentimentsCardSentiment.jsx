import Image from 'next/image'
import classes from './SentimentsCardSentiment.module.scss'

function SentimentsCardSentiment(props) {
    return (
        <div className={classes.sentiment}>
            <div className={classes['sentiment-emoji-container']}>
                <Image
                    className={classes.emoji}
                    src={`/emojis/${props.name}.png`}
                    alt='Sentiment emoji'
                    layout='fill'
                    objectFit='fill'
                />
            </div>
            <p
                className={`paragraph-extra-small regular ${classes['percent']}`}
            >
                {`${props.percent}%`}
            </p>
        </div>
    )
}

export default SentimentsCardSentiment
