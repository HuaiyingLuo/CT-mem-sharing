import * as db from '../../../database';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const post = req.body;
        const newPost = await db.createPost(post);
        res.status(201).json(newPost);
    } else if (req.method === 'PATCH') {
        const post = req.body;
        const updatedPost = await db.updatePost(post);
        res.status(200).json(updatedPost);
    } else {
        res.status(405).json({ message: 'Method Not Allowed' });
    }
}