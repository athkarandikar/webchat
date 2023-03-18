import {useEffect} from 'react'
import React from 'react'
import io from 'socket.io-client'
let socket
// TODO: delete this file
const Temp = () => {
    useEffect(() => {
        async function socketInitializer() {
            await fetch('/api/socket')
            socket = io()

            socket.on('connect', () => {
                console.log('connected')
            })
        }
        socketInitializer()
    }, [])

    return null
}

export default Temp
