const express = require('express');
const router = express.Router();
const multer = require('../middleware/multer.js');
const auth = require('../middleware/auth.js');
const registerValidation = require('../verifications/register.js');

const userCtrl = require('../controllers/user.js');

router.post('/signup', multer, registerValidation, userCtrl.register);
router.post('/login', userCtrl.login);
router.get('/:id', userCtrl.findOneUser);
router.put('/', auth, multer, userCtrl.updateUser);
router.delete('/:id', auth, userCtrl.deleteUser);

module.exports = router;