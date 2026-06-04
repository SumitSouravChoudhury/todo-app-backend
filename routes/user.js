const { Router } = require('express');

const {
  handleListAllUsers,
  handleListUserById,
  handleUpdateUser,
  handleDeleteUser,
} = require('../controllers/user');
const profileUpload = require('../utils/profileMulter');

const router = Router();

router.get('/', handleListAllUsers);

router
  .route('/:userId')
  .get(handleListUserById)
  .patch(profileUpload.single('profileImgUrl'), handleUpdateUser)
  .delete(handleDeleteUser);

module.exports = router;
