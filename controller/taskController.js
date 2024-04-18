const Task = require("../model/taskModel.js")


exports.addTask =async (req,res)=>{
    try{
        
        const task = await Task.create(req.body)
            res.status(201).json({
                status:true,
                message:"new task is added",
                Task :task
                
            })
        }
        catch(err){
            res.status(401).json({
                status:false,
                error:err ,
                
            })
        }
}

exports.getTasks =async (req,res) =>{
    try{
     const tasks = await Task.find({ user: req.user.token});
      res.status(201).json({
        status:true,
        message:"Tasks",
        tasks:tasks ,
        // user:req.user
        
    })
    }
    catch(err){
        res.status(401).json({
            status:false,
            error:err ,
            
        })
    }
}

exports.getTaskbyId =async (req,res)=>{
    try{
     const id = req.params.id
     const task = await Task.find({_id:id, user: req.user.token}
    ) 
     if (task){
        res.status(201).json({
            status:true,
            task :task
        })
     }else {
        res.json ({
            message : "task not found"
        })
     }

    }
    catch(err){
        res.status(401).json({
            status:false,
            error:err ,   
        })
    }
}

exports.updateTask = async (req,res) =>{
    try{
        const id = req.params.id
     const task = await Task.findByIdAndUpdate({_id:id},{$set:req.body},{new:true}) 

     if (task){
        res.status(201).json({
            status:true,
            message :"task is updated " ,
            updated_Task :task
        })
    }
 } catch(err){
        res.status(401).json({
            status:false,
            message : "task not found"
            // error:err ,   
        })
    }
}
 
exports.deleteTask = async (req,res) =>{
    try{
        const id = req.params.id
        const task = await Task.findByIdAndDelete({id, user: req.user.token},{new:true}) 
   
        if (item){
           res.status(201).json({
               status:true,
               message :"task is deleted " ,
            
           })
       }else {
       res.json ({message : "task not found"}) 
       }
    }
    catch(err){
        res.status(401).json({
            status:false,
            message : "task not found err : the length of id is incorrect" ,
            // error:err ,   
        })
    }
}

// exports.deleteAllTasks = async (req,res)=>{
//     try{
//         const task =  await Task.find({ user: req.user.token})
//         .deleteMany({ user: req.user.token})
//         if(!task){
//             res.status(404).json({
//                 status:false,
//                 message :"tasks Not found"
//             })
//         }
//         res.status(201).json({
//           status:true,
//           message:"tasks deleted",
//       })
//       }
//       catch(err){
//           res.status(401).json({
//               status:false,
//               error:err ,
              
//           })
//       }
// }


exports.completedTask = async (req, res) => {
    try {
        const id =req.params.id
        // Find the task by its number
        const existingTask = await Task.findById({ id, user: req.user.token});

        // If the task exists, update its completed field to true
        if (!existingTask) {
          res.status(404).json({
            msg :  "Task not found"
        })         
       }
            const result = await Task.updateOne(
                { id }, // Filter for finding the task
                { $set: { completed: true } } // Update the completed field to true
            );
        if (result){
            res.status(202).json({
                msg :  "Task is updated to be completed" ,
                result : result
            }) 
        }
    } catch (error) {
        console.error('Error updating task by number:', error);
        res.status(500).send('Internal Server Error');
    }
}

