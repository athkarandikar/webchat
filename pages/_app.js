import '../styles/base.scss'
import '../styles/PhoneInput.scss'
import {Provider} from 'react-redux'
import store from '../store'
import {useEffect, useState} from 'react'
import Loader from '../components/Ui/Loader/Loader'
import {Router} from 'next/router'
import usePageLoad from '../hooks/usePageLoad'

function MyApp({Component, pageProps}) {
    const isPageLoading = usePageLoad()

    return (
        <Provider store={store}>
            <Component {...pageProps} />
            {isPageLoading && <Loader />}
        </Provider>
    )
}

export default MyApp
