import express from 'express';
import bodyParser from 'body-parser';
import userRoutes from './routes/userRoutes';
import toDoRoutes from './routes/toDoRoutes';
import connectToDb from './config/connectToDb';
import { errorHandler } from './middleware';
import { scheduleCronJobs } from './cron-jobs/schedule';

// Create an express app
const app = express();

//Connect to DB
connectToDb();

//Middleware
app.use(bodyParser.json());

// Use the error handling middleware
app.use(errorHandler);


//Routes
app.use('/api',userRoutes);
app.use('/api',toDoRoutes);

// Schedule cron jobs
scheduleCronJobs();

//Start the server
app.listen(3000,()=>{
  console.log("Server is running")
})