const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    description: {
        type:String,
        required:true,
        trim:true
    },
    completed: {
        type:Boolean,
        default:false
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    images: [{
        image: {
            type: Buffer
        }
    }]
}, {
    timestamps: true
})

//limiting the client's access to the data
taskSchema.methods.toJSON = function() {
    const task = this
    const taskObject = task.toObject()

    delete taskObject.images


    return taskObject
}


const Task = mongoose.model('Task', taskSchema)

module.exports = Task