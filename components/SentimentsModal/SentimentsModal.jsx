import {AnimatePresence} from 'framer-motion'

import Modal from '../Ui/Modal/Modal'
import classes from './SentimentsModal.module.scss'
import SentimentsModalSentiment from './SentimentsModalSentiment/SentimentsModalSentiment'

function SentimentsModal(props) {
    const sentimentsList = props.sentiments.map(sentiment => {
        return (
            <SentimentsModalSentiment
                key={sentiment.name}
                name={sentiment.name}
                percent={sentiment.percent}
            />
        )
    })

    return (
        props.isModalOpen && (
            <Modal
                title='Sentiment Analysis'
                headerIcon='analysis'
                handleClose={props.closeModal}
            >
                <div className={classes['sentiment-analysis-container']}>
                    {sentimentsList}
                </div>
            </Modal>
        )
    )
}

export default SentimentsModal
