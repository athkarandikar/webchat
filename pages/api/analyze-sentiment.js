import {db} from '../../firebaseConfig'
import Sentiment from 'sentiment'
import {collection, doc, getDoc, updateDoc} from 'firebase/firestore'

const sentimentAnalyzer = new Sentiment()

const scoreToEmojiNameMap = new Map([
    [-5, 'angry'], // -4.1 to -5
    [-4, 'hopeless'], // -3.1 to -4
    [-3, 'lost'], // -2.1 to -3
    [-2, 'troubled'], // -1.1 to -2
    [-1, 'disappointed'], // -0.1 to -1
    // do not check for 0, as it is neutral
    [1, 'happy'], // 0.1 to 1
    [2, 'satisfied'], // 1.1 to 2
    [3, 'amused'], // 2.1 to 3
    [4, 'joyful'], // 3.1 to 4
    [5, 'excited'] // 4.1 to 5
])

function getSentimentEmojiName(comparativeScore) {
    if (comparativeScore === 0) return 'neutral'

    let sentimentEmojiName

    // angry (-4.1 to -5)
    if (comparativeScore <= -4)
        sentimentEmojiName = scoreToEmojiNameMap.get(
            Math.floor(comparativeScore)
        )
    // hopeless (-3.1 to -4)
    else if (comparativeScore <= -3)
        sentimentEmojiName = scoreToEmojiNameMap.get(
            Math.floor(comparativeScore)
        )
    // lost (-2.1 to -3)
    else if (comparativeScore <= -2)
        sentimentEmojiName = scoreToEmojiNameMap.get(
            Math.floor(comparativeScore)
        )
    // troubled (-1.1 to -2)
    else if (comparativeScore <= -1)
        sentimentEmojiName = scoreToEmojiNameMap.get(
            Math.floor(comparativeScore)
        )
    // disappointed (-0.1 to -1)
    else if (comparativeScore <= 0)
        sentimentEmojiName = scoreToEmojiNameMap.get(
            Math.floor(comparativeScore)
        )
    // happy (0.1 to 1)
    else if (comparativeScore <= 1)
        sentimentEmojiName = scoreToEmojiNameMap.get(
            Math.ceil(comparativeScore)
        )
    // satisfied (1.1 to 2)
    else if (comparativeScore <= 2)
        sentimentEmojiName = scoreToEmojiNameMap.get(
            Math.ceil(comparativeScore)
        )
    // amused (2.1 to 3)
    else if (comparativeScore <= 3)
        sentimentEmojiName = scoreToEmojiNameMap.get(
            Math.ceil(comparativeScore)
        )
    // joyful (3.1 to 4)
    else if (comparativeScore <= 4)
        sentimentEmojiName = scoreToEmojiNameMap.get(
            Math.ceil(comparativeScore)
        )
    // excited (4.1 to 5)
    else if (comparativeScore <= 5)
        sentimentEmojiName = scoreToEmojiNameMap.get(
            Math.ceil(comparativeScore)
        )

    return sentimentEmojiName
}

export default async function handler(req, res) {
    const data = req.body

    // if there's no data, return an error
    if (!data) {
        return res.status(201).json({
            isAddingSentimentSuccessful: false,
            title: 'Failure',
            message: 'Sentiment could not be analyzed. Please try again later.'
        })
    }

    const {text, fromId, toId} = data

    const {comparative: sentimentComparativeScore} =
        sentimentAnalyzer.analyze(text)
    const sentimentName = getSentimentEmojiName(sentimentComparativeScore)

    let numMessages = 0

    if (sentimentName === 'neutral') {
        return res.status(201).json({
            isAddingSentimentSuccessful: true,
            isSentimentNeutral: true
        })
    } else {
        // add sentiment to the database
        const absoluteSentimentScore = Math.abs(sentimentComparativeScore)

        const senderDocRef = doc(db, 'users', fromId)
        const chatsRef = doc(collection(senderDocRef, 'chats'), 'chats')
        const {chats} = (await getDoc(chatsRef)).data()

        // the sender will always have the receiver in his chats, so there is no need to check if the chat exists
        const chatIndex = chats.findIndex(chat => chat.id === toId)
        const chat = chats[chatIndex]

        numMessages = chat.messages.length

        if (chat.sentiments) {
            // if there are some sentiments in the chat
            const sentimentIndex = chat.sentiments.findIndex(
                sentiment => sentiment.name == sentimentName
            )
            const sentiment = chat.sentiments[sentimentIndex]
            if (sentimentIndex != -1) {
                // if sentimentEmojiName exists in sentiments
                sentiment.score += 1

                chat.sentiments[sentimentIndex] = sentiment
            } else {
                // if sentimentEmojiName does not exist in sentiments
                chat.sentiments.push({
                    name: sentimentName,
                    score: 1
                })
            }
        } else {
            // if there are no sentiments in the chat
            chat.sentiments = [
                {
                    name: sentimentName,
                    score: 1
                }
            ]
        }

        chats[chatIndex] = chat
        await updateDoc(chatsRef, {chats})
    }

    res.status(201).json({
        isAddingSentimentSuccessful: true,
        isSentimentNeutral: false,
        sentimentScore: sentimentComparativeScore,
        sentimentName,
        numMessages
    })
}
