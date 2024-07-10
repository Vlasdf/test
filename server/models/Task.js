import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
    title: {
        type: String,
    },
    completed: {
        type: Boolean,
        default: false,
    },
    dueDate: {
        type: Date,
    },
});

const Task = mongoose.model('Task', taskSchema);

export default Task;