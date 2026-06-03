const { Router } = require('express');

const {
  handleListAllUsers,
  handleListUserById,
  handleUpdateUser,
  handleDeleteUser,
} = require('../controllers/user');

const router = Router();

router.get('/', handleListAllUsers);

router.route('/:userId').get(handleListUserById).patch(handleUpdateUser).delete(handleDeleteUser);

module.exports = router;
