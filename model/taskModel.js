const { default: mongoose } = require("mongoose");

const taskSchema = new mongoose.Schema({
    title:{
    type:String,
    minlength:[3,"item name at least have 3 letters"],
    maxlength:[20,"item name maxiumum have 20 letters"],
    required :[true,"U must enter item name "] 
    } ,
    desc :{
        type:String,
        minlength:[3,"item describtion at least have 3 letters"],
        maxlength:[100,"item describtion maxiumum have 100 letters"],
        required :[true,"U must enter item describtion "] 
    } ,

    img :{
        type :String ,
        // required :[true,"You should add item images"] ,

    },
 
    isComplete :
    {
        type : Boolean ,
        default : false 
    }

})

const Task  = mongoose.model('Task',taskSchema)

module.exports=Task;