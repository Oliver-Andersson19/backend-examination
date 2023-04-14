import { createToken } from "../auth/auth.js";
import { getDbCollection } from "../db/db.js";
import mongo from 'mongodb'

// Importera socket funktionerna så dom kan triggas här inne
// Dom körs i createNewMessage, och createNewBroadcastMessage för att meddela klienterna om nytt meddelande
import { emitNewBroadcast, emitToAllSockets } from "../socket/socket.js";




export function login(req, res) {

    const username = req.body.username;
    const password = req.body.password;

    // Logga in på konton från databasen
    getDbCollection("users").findOne( { username: username }).then(user => {
        if (user) { // check if account exists
            if (password !== user.password) { // if accounts exists but pw is wrong
                res.sendStatus(403)
            } else { // gets run if all credentials are correct

                delete user.password; // delete password from object so it doesnt reach front-end
                const accessToken = createToken(user)
                console.log(username + " has logged in")
                res.json({ accessToken: accessToken })

            }
        } else { // if account doesnt exist
            res.sendStatus(403)
        }
    });

}


// GET


export function getAllChannels (req, res) {
    // Ger tillbaka alla channels
    getDbCollection("channels").find().toArray().then(channels => {
        res.status(200)
        res.json(channels)
    })
}


export function getChannel (req, res) {
    // Ger tillbaka en channel
    try {
        const channelName = req.params.id
        getDbCollection("channels").find({ name: channelName }).toArray().then(channel => {
            res.status(200)
            res.json(channel)
        })
    } catch(error) {
        res.status(404)
        res.json("No channel found")
    }
}


export function getBroadcastMessages(req, res) {
    getDbCollection("broadcast").find().toArray().then(channels => {
        res.status(200)
        res.json(channels)
    })
}


// POST

export function createNewMessage(req, res) {

    const channelName = req.params.id; // Channel som message pushas in i

    const message = { // Bygg upp message från req.body
        sender: req.body.sender,
        content: req.body.content
    }

    if(message.sender && message.content && channelName){
        
        getDbCollection("channels").find({ name: channelName }).toArray().then(channel => {
            if (channel.length != 0) { // Kolla om channel finns
                // Pusha in message i message array i i rätt channel (kommer från url params)
                getDbCollection("channels").updateOne( { "name": channelName } ,{ $push: { "messages": message } });
                
                emitToAllSockets(); // säg till klient att nytt meddelande har skickats in

                res.status(200)
                res.json(message)
            } else {
                res.status(400)
                res.json("Channel doesnt exist")
            }      
        })

    } else {

        console.log("error")
        res.sendStatus(400)
        
    }
}



export function createNewBroadcastMessage(req, res) {

    console.log(req.user)

    const message = { // Bygg upp message från req.body
        sender: req.user.username,
        content: req.body.content
    }

    if (req.user.role == "admin") {

        if (message.content) {
        
            getDbCollection("broadcast").insertOne(message).then(() => {
                emitNewBroadcast() // säg till klienterna att nytt emergency meddelande har skickats
                res.status(200)
                res.json(message)
            });
        } else {
    
            console.log("error")
            res.sendStatus(400)
        
        }

    } else {
        console.log("unauthorized")
        res.sendStatus(401)
    }

}

// PUT

export function createNewChannel(req, res) {
    
    const channel = {
        name: req.body.name,
        messages: []
    }

    if (channel.name) {
        getDbCollection("channels").find({ name: req.body.name }).toArray().then(channelInDb => {
            if (channelInDb.length == 0) { // Kolla så att channel inte finns
                
                getDbCollection("channels").insertOne(channel).then(() => {
                    res.status(200)
                    res.json(channel)
                });
                
            } else {
                res.status(400)
                res.json("Channel already exist")
            }      
        })
    } else {
        console.log("error")
        res.sendStatus(400)
    }
}

// DEL

export function deleteChannel(req, res) {

    const channelName = req.params.id;

    if (channelName) {
        getDbCollection("channels").deleteOne( { name: channelName } ).then((result) => {
            if (result.deletedCount === 1) {
                res.json("Successfully deleted one document.");
            } else {
                res.json("No documents matched the query. Deleted 0 documents.");
            }
        })
    } else {

        console.log("error")
        res.sendStatus(400)
    }


}