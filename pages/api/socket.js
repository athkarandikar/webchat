import {Server} from 'socket.io'

export default function handler(req, res) {
    if (res.socket.server.io) console.log('Socket is already running')
    else {
        const io = new Server(res.socket.server)
        res.socket.server.io = io
    }

    res.end()
}
