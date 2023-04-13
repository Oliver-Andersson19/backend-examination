import { Server } from 'socket.io'

const options = {
    cors: {
        origin: '*'
    }
}

let io = undefined;
let clients = []; // lista med alla clients som är connectade



function handleNewConnection(socket) {
    socket.username = socket.handshake.headers.username
    clients.push(socket)

    console.log('New connection created: ', socket.username);
  
    // A client is disconnected.
    socket.on('disconnect', () => {
        console.log('A user disconnected: ', socket.id);
        clients.splice(clients.indexOf(socket), 1) // Tar bort client från listan
    });

}

export function emitToAllSockets() { // Triggas varje gång någon POST ett nytt meddelande
    io.emit("new_message_from_server") // skicka till client
}

export function emitNewBroadcast() { // Triggas varje gång det postas nytt i broadcast channmel
    io.emit("new_broadcast_from_server") // skicka till client
}

export function attachSocket(container) {
    io = new Server(container, options)
    io.on("connection", handleNewConnection)
}

