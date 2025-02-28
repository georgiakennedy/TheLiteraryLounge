const express = require('express');
const router = express.Router();
const { createComment, getComments, updateComment, deleteComment } = require('../controllers/commentController');
const auth = require('../middleware/auth');

router.post('/', auth, createComment);

router.get('/', getComments);

router.put('/:id', updateComment);

router.delete('/:id', updateComment); 

module.exports = router;
