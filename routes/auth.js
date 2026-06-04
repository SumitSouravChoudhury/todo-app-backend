const { Router } = require('express');

const { handleUserSignup, handleUserSignin } = require('../controllers/auth');
const profileUpload = require('../utils/profileMulter');

const router = Router();

router.post('/signup', profileUpload.single('profileImgUrl'), handleUserSignup);
router.post('/login', handleUserSignin);

module.exports = router;
