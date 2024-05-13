import * as db from '../../../../database';

export default async function handler(req, res) {
    const pid = req.query['post-id'];
    if (req.method === 'PATCH') {
        const uid = req.body.uid;
        const result = await db.createLike(pid, uid);
        res.status(200).json({ message: 'Post liked.'});
    } else if (req.method === 'DELETE') {
        const uid = req.body.uid;
        const result = await db.deleteLike(pid, uid);
        res.status(200).json({ message: 'Post disliked.'});
    } else {
        res.status(405).json({ message: 'Method not allowed.'})
    }
}

