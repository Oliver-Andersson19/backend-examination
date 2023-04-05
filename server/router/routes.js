import express from "express";
import { createNewBroadcastMessage, createNewChannel, createNewMessage, getAllChannels, getBroadcastMessages, getChannel, deleteChannel } from "../controller/controller.js";
const router = express.Router()




// endpoints

// GET
router.get('/ducks/api/channel', getAllChannels)

router.get('/ducks/api/channel/:id', getChannel)

router.get('/ducks/api/broadcast/', getBroadcastMessages)


// POST
router.post('/ducks/api/channel/:id', createNewMessage)

router.post('/ducks/api/broadcast/', createNewBroadcastMessage)



// PUT
router.put('/ducks/api/channel/', createNewChannel)

// DEL
router.delete('/ducks/api/channel/:id', deleteChannel)


export default router;