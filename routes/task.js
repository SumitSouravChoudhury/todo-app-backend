const { Router } = require('express');

const {
  handleCreateTasks,
  handleListTasks,
  handleListTasksById,
  handleUpdateTask,
  handleDeleteTask,
} = require('../controllers/task');

const router = Router();

router.route('/').post(handleCreateTasks).get(handleListTasks);

router.route('/:taskId').get(handleListTasksById).patch(handleUpdateTask).delete(handleDeleteTask);

module.exports = router;
