const { Router } = require('express');

const { handleUserSignup, handleUserSignin } = require('../controllers/auth');

const router = Router();

router.post('/signup', handleUserSignup);
router.post('/login', handleUserSignin);

module.exports = router;
