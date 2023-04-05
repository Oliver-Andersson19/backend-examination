// const app = require('express')
import cors from 'cors'
import express from "express";
import router from './router/routes.js';


const app = express();
const port = 3000;

app.use(express.json())
app.use(cors())

app.use(router)

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});