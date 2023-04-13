const channelSelector = document.querySelector('.channel-selector')
const chatLog = document.querySelector('.chat-log')
const broadcastMessages = document.querySelector('.broadcast')
const msgField = document.querySelector('.msg-field')
const sendBtn = document.querySelector('.send-btn')
const usernameField = document.querySelector('.username-field')
const connectBtn = document.querySelector('.connect-btn')



const URL = "http://185.75.42.93:3000";
let socketIo = undefined;
let isConnectionEstablished = false




// Hämtar alla kanaler till dropdown menyn
fetch(URL + "/ducks/api/channel")
.then(response => response.json())
.then(data => {
    data.forEach(channel => {
        console.log(channel)
        channelSelector.innerHTML += `<option>${channel.name}</option>`
    });
})





function establishConnection() {
    if (isConnectionEstablished) {
        socketIo.disconnect()
        isConnectionEstablished = false;
        return;
    }


    socketIo = io('http://185.75.42.93:3000', {extraHeaders: {username: usernameField.value}});

    socketIo.on('connect', function () {
        console.log('Made socket connection', socketIo.id);
        isConnectionEstablished = true;
    });

    socketIo.on('disconnect', function () {
        console.log('disconnect');
    });

    // handle errors here
    socketIo.on('connect_error', function (err) {
        console.log('connection errror', err);
        isConnectionEstablished = false
    });




    socketIo.on('new_message_from_server', function () { // Kommer från servern när ett nytt meddelande skickats
        updateMessages(channelSelector.value) // uppdatera meddelanden
    });  

    socketIo.on('new_broadcast_from_server', function () { // Kommer från servern när ett nytt meddelande skickats
        fetchBroadcastMessages() // uppdatera broadcast meddelanden
    });  
}

function updateMessages(channel) { // Fetchar messages från rätt kanal, triggas av socket
    fetch(URL + "/ducks/api/channel/" + channel)
    .then(response => response.json())
    .then(data => {
        if(data[0]) {
            chatLog.innerHTML = ""; // Töm chatlog
            data[0].messages.forEach(msg => { // Fyll med nya meddelanden
                chatLog.innerHTML += `<p>${msg.sender}: ${msg.content}</p>`
            })
        }
    })
}



function fetchBroadcastMessages() { // Hämtar ner broadcast messages, triggas av socket
    fetch(URL + "/ducks/api/broadcast")
    .then(response => response.json())
    .then(data => {
        console.log(data)
        broadcastMessages.innerHTML = ""; // Töm chatlog
        data.forEach(msg => { // Fyll med nya meddelanden
            broadcastMessages.innerHTML += `<p>${msg.sender}: ${msg.content}</p>`
        })
    })
}


function sendMessage() { // Skickar meddelanden
    fetch(URL + "/ducks/api/channel/" + channelSelector.value, {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json'
        },
        body: JSON.stringify({sender: usernameField.value, content: msgField.value}) // Tar värden från fields
    })
}



channelSelector.addEventListener('click', (e) => {
    updateMessages(e.target.value) // Hämta ner messages från kanalen man valt
})
connectBtn.addEventListener('click', () => {
    establishConnection()
    fetchBroadcastMessages()

}) // Starta connection när man trycker connect
sendBtn.addEventListener('click', sendMessage) // Skicka meddelande