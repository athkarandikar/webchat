import {createSlice} from '@reduxjs/toolkit'

const homePageSlice = createSlice({
    name: 'homePage',
    initialState: {
        isChatSelected: false,
        activeChat: {
            id: null,
            name: null
        }
    },
    reducers: {
        setActiveChat(state, action) {
            const {id, name} = action.payload

            state.activeChat.id = id
            state.activeChat.name = name
            state.isChatSelected = true
        },
        reset(state) {
            state.isChatSelected = false
            state.activeChat.id = null
            state.activeChat.name = null
        }
    }
})

export default homePageSlice.reducer
export const homePageActions = homePageSlice.actions
