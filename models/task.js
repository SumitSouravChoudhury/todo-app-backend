const { Schema, model } = require('mongoose');

const taskSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    body: {
      type: String,
      required: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'user',
    },
  },
  { timestamps: true }
);

const Task = model('task', taskSchema);

module.exports = Task;
