import { getDbCollection } from "../db/db.js";
import mongo from 'mongodb'

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
        const id = new mongo.ObjectId(req.params.id)
        getDbCollection("channels").find({ _id: id }).toArray().then(channel => {
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


export function createNewMessage(req, res) {
    const channelName = req.params.id; // Channel som message pushas in i

    const message = { // Bygg upp message från req.body
        sender: req.body.sender,
        title: req.body.title,
        content: req.body.content,
    }



    getDbCollection("channels").find({ name: channelName }).toArray().then(channel => {
        if (channel.length != 0) { // Kolla om channel finns
            console.log(channel)
            // Pusha in message i message array i i rätt channel (kommer från url params)
            getDbCollection("channels").updateOne( { "name": channelName } ,{ $push: { "messages": message } });

            res.status(200)
            res.json(message)
        } else {
            res.status(400)
            res.json("Channel doesnt exist")
        }      
    })
    
}



export function createNewBroadcastMessage(req, res) {

    const message = { // Bygg upp message från req.body
        sender: req.body.sender,
        title: req.body.title,
        content: req.body.content,
    }

    
    getDbCollection("broadcast").insertOne(message).then(() => {
        res.status(200)
        res.json(message)
    });

    
}



export function createNewChannel(req, res) {
    
    const channel = {
        name: req.body.name,
        messages: []
    }


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
}



export function deleteChannel(req, res) {

    const channelName = req.params.id;

    getDbCollection("channels").deleteOne( { name: channelName } ).then((result) => {
        if (result.deletedCount === 1) {
            res.json("Successfully deleted one document.");
        } else {
            res.json("No documents matched the query. Deleted 0 documents.");
        }
    })

}