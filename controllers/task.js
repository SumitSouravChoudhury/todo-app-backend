const Task = require('../models/task');

const handleCreateTasks = async (req, res, next) => {
  const { title, body } = req.body;

  try {
    const newTask = await Task.create({
      title: title,
      body: body,
      createdBy: req.user?._id,
    });

    return res.status(201).json({ message: 'Task created successfully', task: newTask });
  } catch (error) {
    next(error);
  }
};

const handleListTasks = async (req, res, next) => {
  try {
    const tasks = await Task.find({ createdBy: req.user._id }).populate(
      'createdBy',
      '-password -salt'
    );

    return res.status(200).json({ tasks: tasks });
  } catch (error) {
    next(error);
  }
};

const handleListTasksById = async (req, res, next) => {
  const taskId = req.params.taskId;
  try {
    const task = await Task.findById(taskId).populate('createdBy', '-password -salt');
    if (!task) return res.status(404).json({ error: 'Task not found' });

    return res.status(200).json({ task: task });
  } catch (error) {
    next(error);
  }
};

const handleUpdateTask = async (req, res, next) => {
  const taskId = req.params.taskId;
  const { title, body } = req.body;

  try {
    const task = await Task.findByIdAndUpdate(
      taskId,
      { ...(title && { title }), ...(body && { body }) },
      { new: true }
    );
    if (!task) return res.status(404).json({ error: 'Task not found' });
    return res.status(200).json({ message: 'Task updated successfully', task });
  } catch (error) {
    next(error);
  }
};

const handleDeleteTask = async (req, res, next) => {
  const taskId = req.params.taskId;

  try {
    const task = await Task.findByIdAndDelete(taskId);

    if (!task) return res.status(400).json({ error: 'Task not found' });

    return res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  handleCreateTasks,
  handleListTasks,
  handleListTasksById,
  handleUpdateTask,
  handleDeleteTask,
};
