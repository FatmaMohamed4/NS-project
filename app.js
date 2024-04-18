const express=require('express')
const taskRoute=require('./route/taskRoute.js')
const userRoute=require('./route/userRoute')



const app = express();

app.use(express.json()); 

app.use('/users',userRoute)
app.use('/tasks',taskRoute)




module.exports=app;
