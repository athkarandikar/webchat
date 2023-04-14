import {createSlice} from '@reduxjs/toolkit'
import {chatsActions} from '../chats/chats'
import {homePageActions} from '../homePage/homePage'

const authSlice = createSlice({
    name: 'authentication',
    initialState: {
        isAuthenticated: false,
        username: null,
        userId: null, // the user document ID in firestore
        firstName: null,
        lastName: null,
        phoneNumber: null,
        email: null,
        password: null
    },
    reducers: {
        login(state, action) {
            const {
                username,
                userId,
                firstName,
                lastName,
                phoneNumber,
                email,
                password
            } = action.payload

            state.isAuthenticated = true
            state.username = username
            state.userId = userId
            state.firstName = firstName
            state.lastName = lastName
            state.phoneNumber = phoneNumber
            state.email = email
            state.password = password
        },
        updateProfile(state, action) {
            const {
                username,
                firstName,
                lastName,
                phoneNumber,
                email,
                password
            } = action.payload

            state.username = username
            state.firstName = firstName
            state.lastName = lastName
            state.phoneNumber = phoneNumber
            state.email = email
            state.password = password
        },
        reset(state) {
            state.isAuthenticated = false
            state.username = null
            state.userId = null
            state.firstName = null
            state.lastName = null
            state.phoneNumber = null
            state.email = null
            state.password = null
        }
    }
})

export default authSlice.reducer
export const authActions = authSlice.actions
