import {Router} from 'next/router'
import {useEffect, useState} from 'react'

function usePageLoad() {
    const [isPageLoading, setIsPageLoading] = useState(false)

    useEffect(() => {
        function handleRouteChangeStart() {
            setIsPageLoading(true)
        }

        function handleRouteChangeComplete() {
            setIsPageLoading(false)
        }

        Router.events.on('routeChangeStart', handleRouteChangeStart)
        Router.events.on('routeChangeComplete', handleRouteChangeComplete)

        return () => {
            Router.events.off('routeChangeStart', handleRouteChangeStart)
            Router.events.off('routeChangeComplete', handleRouteChangeComplete)
        }
    }, [])

    return isPageLoading
}

export default usePageLoad
