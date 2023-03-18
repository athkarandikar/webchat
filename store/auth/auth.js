import {createSlice} from '@reduxjs/toolkit'
import {chatsActions} from '../chats/chats'
import {homePageActions} from '../homePage/homePage'

const authSlice = createSlice({
    name: 'authentication',
    initialState: {
        isAuthenticated: false,
        username: null,
        userId: null // the user document ID in firestore
    },
    reducers: {
        login(state, action) {
            const {username, userId} = action.payload

            state.isAuthenticated = true
            state.username = username
            state.userId = userId
        },
        reset(state) {
            state.isAuthenticated = false
            state.username = null
            state.userId = null
        }
    }
})

export default authSlice.reducer
export const authActions = authSlice.actions
