import express from 'express';
import { getPosts, getPost, getPostBySearch, createPost, updatePost, deletePost, commentPost, likePost } from '../controllers/posts.js';
import { auth } from '../middelware/auth.js';


const router = express.Router();

router.get('/', auth, getPosts);
router.get('/search', auth, getPostBySearch);
router.get('/:id', auth, getPost);


router.post('/', auth, createPost);
router.patch('/:id', auth, updatePost);
router.delete('/:id', auth, deletePost);

router.post('/:id/comment', auth, commentPost);
router.post('/:id/like', auth, likePost);

export default router;
