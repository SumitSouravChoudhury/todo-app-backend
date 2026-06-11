const { Router } = require('express');

const {
  handleListAllUsers,
  handleListUserById,
  handleUpdateUser,
  handleDeleteUser,
} = require('../controllers/user');
const profileUpload = require('../utils/profileMulter');
const { requireAdmin } = require('../middlewares/auth');

const router = Router();

router.get('/', requireAdmin, handleListAllUsers);

router
  .route('/:userId')
  .get(handleListUserById)
  .patch(requireAdmin, profileUpload.single('profileImgUrl'), handleUpdateUser)
  .delete(requireAdmin, handleDeleteUser);

module.exports = router;
