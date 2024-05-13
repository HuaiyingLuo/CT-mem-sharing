import * as db from '../../../database';

export default async function handler(req, res) {
    if (req.method === 'DELETE') {
        const pid = req.query['post-id'];
        const deleted = await db.deletePost(pid);
        res.status(200).json(deleted);
    } else if (req.method === 'GET') {
        const pid = req.query['post-id'];
        const post = await db.getPost(pid);
        res.status(200).json(post);
    } else {
        res.status(405).json({ message: 'Method Not Allowed' });
    }
}