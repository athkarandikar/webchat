import {configureStore} from '@reduxjs/toolkit'

import authReducer from './auth/auth'
import chatsReducer from './chats/chats'
import homePageReducer from './homePage/homePage'

const store = configureStore({
    reducer: {auth: authReducer, chats: chatsReducer, homePage: homePageReducer}
})

export default store
