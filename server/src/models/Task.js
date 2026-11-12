import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Task title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    description: {
      type: String,
      default: '',
      trim: true,
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
    },
    dateTime: {
      type: Date,
      required: [true, 'Date and time are required'],
      index: true,
    },
    endTime: {
      type: String,
      default: '',
      trim: true,
    },
    priority: {
      type: String,
      enum: {
        values: ['Low', 'Medium', 'High'],
        message: 'Priority must be Low, Medium, or High',
      },
      default: undefined,
    },
    status: {
      type: String,
      enum: {
        values: ['In Progress', 'Completed'],
        message: 'Status must be In Progress or Completed',
      },
      default: 'In Progress',
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

taskSchema.index({ title: 'text', description: 'text' });

const Task = mongoose.model('Task', taskSchema);
export default Task;

