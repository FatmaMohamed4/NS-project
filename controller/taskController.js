const Task = require("../model/taskModel.js") 
 
exports.addTask = async (req, res) => { 
    try { 
        const userId = req.user._id  
        const taskData = { ...req.body, userId: userId }; 
 
        const task = await Task.create(taskData); 
        await (await task.populate('userId' , '-password -isAdmin')).save() 
        res.status(201).json({ 
            status: true, 
            message: "New task added successfully", 
            task: task 
        }); 
    } catch (err) { 
        res.status(500).json({ 
            status: false, 
            error: err.message 
        }); 
    } 
}; 
 
exports.getTasks = async (req, res) => { 
    try { 
        const userId = req.user._id; // Assuming req.user._id contains the user's ID 
 
        // Find all tasks associated with the specified userId 
        const tasks = await Task.find({ userId: userId }); 
 
        if (!tasks || tasks.length === 0) { 
            return res.status(404).json({ 
                status: false, 
                message: "Tasks not found for the user", 
            }); 
        } 
 
        res.status(200).json({ 
            status: true, 
            message: "Tasks found", 
            tasks: tasks, 
        }); 
    } catch (err) { 
        console.error("Error fetching tasks:", err); 
        res.status(500).json({ 
            status: false, 
            message: "Internal server error", 
        }); 
    } 
}; 
 
exports.getTaskById = async (req, res) => { 
    try { 
        const id = req.params.id; 
        const userId = req.user._id; 
 
        const task = await Task.findOne({ _id: id, userId: userId }); 
 
        if (!task) { 
            return res.status(404).json({ 
                status: false, 
                message: "Task not found" 
            }); 
        } 
 
        res.status(200).json({ 
            status: true, 
            message: "Task found", 
            task: task 
        }); 
    } catch (err) { 
        console.error("Error fetching task by ID:", err); 
        res.status(500).json({ 
            status: false, 
            error: err.message 
        }); 
    } 
}; 
 
     
exports.updateTask = async (req, res) => { 
    try { 
        const id = req.params.id; 
        const userId = req.user._id; 
 
        const task = await Task.findOneAndUpdate( 
            { _id: id, userId: userId }, 
            req.body, 
            { new: true } 
        ); 
 
        if (!task) { 
            return res.status(404).json({ 
                status: false, 
                message: "Task not found" 
            }); 
        } 
 
        res.status(200).json({ 
            status: true, 
            message: "Task updated successfully", 
            updatedTask: task 
        }); 
    } catch (err) { 
        console.error("Error updating task:", err); 
        res.status(500).json({ 
            status: false, 
            error: err.message 
        }); 
    } 
}; 
 
// exports.deleteTask = async (req, res) => { 
//     try { 
//         const id = req.params.id; 
//         const userId = req.user._id; 
 
//         // Find and delete the task by its ID and user ID 
//         const task = await Task.findOneAndDelete({ _id: id, userId: userId }); 
 
//         if (!task) { 
//             // If task is not found, return a 404 Not Found response 
//             return res.status(404).json({ 
//                 status: false, 
//                 message: "Task not found" 
//             }); 
//         } 
 
//         // If task is successfully deleted, return a 200 OK response 
//         res.status(200).json({ 
//             status: true, 
//             message: "Task deleted successfully" 
//         }); 
//     } catch (err) { 
//         // Handle any errors that occur during deletion 
//         console.error("Error deleting task:", err); 
//         res.status(500).json({ 
//             status: false, 
//             error: "Internal server error" 
//         }); 
//     } 
// }; 
 
// exports.deleteAllTasks = async (req,res)=>{ 
//     try{ 
//         const task =  awaitconst Task = require("../model/taskModel");
// Task.find({ user: req.user.token}) 
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
        const id = req.params.id; 
        const userId = req.user._id; 
 
        // Find the task by its ID and user ID 
        const task = await Task.findOneAndUpdate( 
            { _id: id, userId: userId }, 
            { isComplete: true }, 
            { new: true } 
        ); 
 
        if (!task) { 
            return res.status(404).json({ 
                status: false, 
                message: "Task not found" 
            }); 
        } 
 
        res.status(200).json({ 
            status: true, 
            message: "Task is updated to completed", 
            updatedTask: task 
        }); 
    } catch (err) { 
        console.error("Error updating task to completed:", err); 
        res.status(500).json({ 
            status: false, 
            error: err.message 
        }); 
    } 
};