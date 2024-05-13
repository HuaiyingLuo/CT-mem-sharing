// api to delete a comment  
import * as db from '../../../../../database';

export default async function handler(req, res) {
    if (req.method === 'DELETE') {
        const cid = req.query['comment-id'];
        const deleted = await db.deleteComment(cid);
        res.status(200).json(deleted);
    } else if (req.method === 'PATCH') {
        const comment = req.body;
        const updated = await db.updateComment(comment);
        res.status(200).json(updated);
    } else {
        res.status(405).json({ message: 'Method Not Allowed' });
    }
}
