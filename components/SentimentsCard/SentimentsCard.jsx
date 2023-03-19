import {AnimatePresence} from 'framer-motion'
import {useSelector} from 'react-redux'

import classes from './SentimentsCard.module.scss'
import SentimentsCardSentiment from './SentimentsCardSentiment/SentimentsCardSentiment'
import SentimentsModal from '../SentimentsModal/SentimentsModal'
import useModal from '../../hooks/useModal'

function Sentiments(props) {
    const {id: activeChatId} = useSelector(state => state.homePage.activeChat)
    const numMessages = useSelector(
        state =>
            state.chats.chats.find(chat => chat.id === activeChatId).messages
                .length
    ) // numMessages will be always greater than 0

    const {
        isModalOpen: isSentimentsModalOpen,
        openModal: openSentimentsModal,
        closeModal: closeSentimentsModal
    } = useModal()

    let sentiments = props.sentiments
    sentiments = sentiments.map(sentiment => {
        return {
            ...sentiment
        }
    })
    sentiments.sort((a, b) => b.score - a.score)

    // Processing the sentiment data

    sentiments.forEach(sentiment => {
        sentiment.percent = Math.round((sentiment.score / numMessages) * 100)
    })

    const sentimentsList = sentiments.slice(0, 3).map(sentiment => {
        return (
            <SentimentsCardSentiment
                key={sentiment.name}
                name={sentiment.name}
                percent={sentiment.percent}
            />
        )
    })

    return (
        <>
            <button
                onClick={openSentimentsModal}
                className={classes['sentiment-analysis-container']}
            >
                {sentimentsList}
            </button>
            <AnimatePresence>
                {isSentimentsModalOpen && (
                    <SentimentsModal
                        sentiments={sentiments}
                        isModalOpen={isSentimentsModalOpen}
                        closeModal={closeSentimentsModal}
                    />
                )}
            </AnimatePresence>
        </>
    )
}

export default Sentiments
