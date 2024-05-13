import * as db from '../../database';

export default async function handler(req, res) {
    if (req.method === 'GET') {
        const uid = req.query['user-id'];
        const posts = await db.getMyPosts(uid);
        res.status(200).json(posts);
    } else {
        res.status(405).json({ message: 'Method Not Allowed' });
    }
}