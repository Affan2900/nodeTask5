import express from 'express';
import bodyParser from 'body-parser';
import userRoutes from './routes/userRoutes';
import toDoRoutes from './routes/toDoRoutes';



const app = express();


app.use(bodyParser.json());

//Routes
app.use('/api',userRoutes);
app.use('/api',toDoRoutes);


//Start the server
app.listen(3000,()=>{
  console.log("Server is running")
})