// api/posts/[post-id]/comments.js
import * as db from '../../../../database';

export default async function handler(req, res) {
    const pid = req.query['post-id'];
    if (req.method === 'POST') {
        const comment = req.body;
        const newComment = await db.createComment(comment);
        res.status(201).json(newComment);
    } else if (req.method === 'GET') {
        console.log('req in comments api:', req)
        const comments = await db.getAllComments(pid);
        res.status(200).json(comments);
    } else {
        res.status(405).json({ message: 'Method Not Allowed' });
    }
}