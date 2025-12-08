import { Router } from 'express';
import { Post } from '../models/Post.js';
import { auth as authenticate } from '../middlewares/auth.js';

const router = Router();

// GET /api/posts - Get all posts
router.get('/', async (req, res) => {
    try {
        const posts = await Post.find()
            .sort({ createdAt: -1 })
            .populate('user', 'name avatarUrl')
            .populate('comments.user', 'name avatarUrl')
            .limit(50);

        res.json(posts);
    } catch (error) {
        console.error('Error getting posts:', error);
        res.status(500).json({ message: 'Error getting posts' });
    }
});

// POST /api/posts - Create a new post
router.post('/', authenticate, async (req, res) => {
    try {
        const { text, videoUrl } = req.body;

        if (!text || !text.trim()) {
            return res.status(400).json({ message: 'Text is required' });
        }

        const post = new Post({
            text: text.trim(),
            videoUrl: videoUrl ? videoUrl.trim() : null,
            user: req.user.id
        });

        await post.save();

        // Populate user to return the full object
        await post.populate('user', 'name avatarUrl');

        res.status(201).json({ success: true, post });
    } catch (error) {
        console.error('Error creating post:', error);
        res.status(500).json({ message: 'Error creating post' });
    }
});

// POST /api/posts/:id/comments - Add a comment
router.post('/:id/comments', authenticate, async (req, res) => {
    try {
        const { text } = req.body;
        if (!text || !text.trim()) {
            return res.status(400).json({ message: 'Comment text is required' });
        }

        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        const comment = {
            text: text.trim(),
            user: req.user.id,
            createdAt: new Date()
        };

        post.comments.push(comment);
        await post.save();

        // Populate the user of the new comment
        await post.populate('comments.user', 'name avatarUrl');

        // Return the newly added comment (last one)
        const newComment = post.comments[post.comments.length - 1];

        res.status(201).json({ success: true, comment: newComment });
    } catch (error) {
        console.error('Error adding comment:', error);
        res.status(500).json({ message: 'Error adding comment' });
    }
});

export default router;
