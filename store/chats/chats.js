import {createSlice} from '@reduxjs/toolkit'

const chatsSlice = createSlice({
    name: 'chats',
    initialState: {
        // pinnedChats: ['userId1', 'userId2'],
        chats: null
        // chats: [
        //     {
        //         id: 'userId1',
        //         name: 'Name One',
        //         recentMessage: 'recent message',
        //         messages: [
        //             {
        //                 text: 'Hey, how are you?',
        //                 time: '2023-12-03T14:46:22.000Z',
        //                 type: 'incoming'
        //             },
        //             {
        //                 text: 'I am fine',
        //                 time: '2023-12-03T14:13:22.060Z',
        //                 type: 'outgoing'
        //             }
        //         ]
        //     },
        //     {
        //         id: 'userId2',
        //         name: 'Name Two',
        //         recentMessage: 'recent message',
        //         messages: [
        //             {
        //                 text: 'Hello',
        //                 time: '2023-12-03T14:25:42.000Z',
        //                 type: 'incoming'
        //             },
        //             {
        //                 text: 'Hey 👋🏻',
        //                 time: '2023-12-03T14:14:23.060Z',
        //                 type: 'outgoing'
        //             }
        //         ]
        //     }
        // ]
    },
    reducers: {
        reset(state) {
            // state.pinnedChats = null
            state.chats = null
        },
        addUser(state, action) {
            const {id, name} = action.payload

            if (state.chats) state.chats = [{id, name}, ...state.chats]
            else state.chats = [{id, name}]
        },
        setChats(state, action) {
            const chats = action.payload
            state.chats = chats
        },
        addMessageToChat(state, action) {
            const {text, time, type, toId} = action.payload

            const chat = state.chats.find(chat => chat.id === toId)
            if (chat.messages) {
                // if there are some messages in the chat
                chat.messages.push({text, time, type})
            } else {
                // if there are no messages in the chat
                chat.messages = [{text, time, type}]
            }
        }
    }
})

export default chatsSlice.reducer
export const chatsActions = chatsSlice.actions
