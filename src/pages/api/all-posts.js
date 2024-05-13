import * as db from "../../database";

export default async function handler(req, res) {
    if (req.method === "GET") {
        const posts = await db.getAllPosts();
        res.status(200).json(posts);
    } else {
        res.status(405).json({ message: "Method Not Allowed" });
    }
};