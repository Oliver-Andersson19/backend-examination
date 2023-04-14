// const app = require('express')
import cors from 'cors'
import express from "express";
import router from './router/routes.js';

import { createServer } from 'http'
import { attachSocket } from './socket/socket.js';

const app = express();
const httpServer = createServer(app)

const port = 3000;

app.use(express.json())
app.use(cors())

attachSocket(httpServer) // Starta socket

app.use(router)

httpServer.listen(port, () => { // Starta server
  console.log(`Server running on port ${port}`);
});


