import express from 'express';
import bodyParser from 'body-parser';

const app = express();

app.use(bodyParser.json());

//Importing routers from routes folder
const usersRouter = require('./routes/usersRoutes');
const toDosRouter = require('./routes/toDosRoutes');

app.listen(3000,()=>{
  console.log("Server is running")
})