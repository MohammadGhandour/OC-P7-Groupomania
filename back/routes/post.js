const express = require('express');
const router = express.Router();
const multer = require('../middleware/multer.js');
const auth = require('../middleware/auth.js');

const postCtrl = require('../controllers/post.js');

router.post('/', auth, multer, postCtrl.createPost);
router.get('/', auth, postCtrl.getAllPosts);
router.get('/:userId', auth, postCtrl.getUserPosts);
router.delete('/:id', auth, postCtrl.deletePost);
router.put('/:id', auth, multer, postCtrl.editPost);

router.post('/:postId/comments', auth, postCtrl.createComment);
router.get('/comments/all', auth, postCtrl.getAllComments);
router.put('/comments/:id', auth, postCtrl.editComment);
router.post('/:id/likes', auth, postCtrl.like);
router.delete('/comments/:id', auth, postCtrl.deleteOneComment);

module.exports = router;