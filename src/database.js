import firebaseApp from "./firebase";
import { getFirestore, collection, addDoc, query, where, getDocs, deleteDoc, doc, updateDoc, getDoc, arrayUnion, arrayRemove, increment } from "firebase/firestore";

const db = getFirestore(firebaseApp);

// posts
export const createPost = async (post) => {
    const docRef = await addDoc(collection(db, "posts"), {
        // postid: post.postid,
        title: post.title,
        content: post.content,
        author: post.author,
        uid: post.uid,
        imageUrl: post.imageUrl,
        createdAt: Date.now(),
        likeCount: 0,
        likes: []
    });
    console.log("Document post written with ID: ", docRef.id);
    return {
        id: docRef.id, // cannot access it before initialization
        ...post
    };
};

export const getMyPosts = async (uid) => {
    const postsRef = collection(db, "posts");
    const q = query(postsRef, where("uid", "==", uid));

    try {
        const querySnapshot = await getDocs(q);
        const posts = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            likeCount: doc.data().likeCount || 0
        }));
        return posts;
    } catch (error) {
        console.error("Error fetching user posts:", error);
        return [];
    }
};

export const getPost = async (pid) => {
    const postRef = doc(db, "posts", pid);
    const docSnap = await getDoc(postRef);
    if (docSnap.exists()) {
        return {
            id: docSnap.id,
            ...docSnap.data()
        };
    } else {
        console.error("No such post!");
        return null;
    }
};

export const getAllPosts = async () => {
    const postsRef = collection(db, "posts");
    const querySnapshot = await getDocs(postsRef);
    const posts = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        likeCount: doc.data().likeCount || 0
    }));
    return posts;
};

export const updatePost = async (post) => {
    const postRef = doc(db, "posts", post.id);
    try {
        await updateDoc(postRef, {
            title: post.title,
            content: post.content,
            imageUrl: post.imageUrl,
            updatedAt: Date.now(),
        });
        console.log("Document post with ID: ", post.id, " has been updated.");
        return true;
    } catch (error) {
        console.error("Error updating post:", error);
        return false;
    }
};

export const deletePost = async (pid) => {
    const postRef = doc(db, "posts", pid);
    try {
        await deleteDoc(postRef);
        console.log("Document post with ID: ", pid, " has been deleted.");
        return true; 
    } catch (error) {
        console.error("Error deleting post:", error);
        return false; 
    }
};

//like
export const createLike = async(pid, uid) => {
    const postRef = doc(db, "posts", pid);
    try {
        await updateDoc(postRef, {
            likes: arrayUnion(uid),
            likeCount: increment(1)
        });
        console.log("Post liked by user:", uid);
        return true;
    } catch (error) {
        console.error("Error liking post:", error);
        return false;
    }
};

export const deleteLike = async(pid, uid) => {
    const postRef = doc(db, "posts", pid);
    try {
        await updateDoc(postRef, {
            likes: arrayRemove(uid),
            likeCount: increment(-1)
        });
        console.log("Post unliked by user:", uid);
        return true;
    } catch (error) {
        console.error("Error unliking post:", error);
        return false;
    }
};

// comments
export const createComment = async (comment) => {
    const docRef = await addDoc(collection(db, "comments"), {
        pid: comment.pid, // post id 
        content: comment.content, // comment content
        author: comment.author, // comment author
        uid: comment.uid, // comment author id
        createdAt: comment.createdAt, // comment creation time
    });
    console.log("Document comment written with ID: ", docRef.id);
    return {
        id: docRef.id,
        ...comment
    };
};

export const updateComment = async (comment) => {
    const commentRef = doc(db, "comments", comment.id);
    try {
        await updateDoc(commentRef, {
            content: comment.content,
            createdAt: Date.now(),
        });
        console.log("Document comment with ID: ", comment.id, " has been updated.");
        return true;
    } catch (error) {
        console.error("Error updating comment:", error);
        return false;
    }
}


export const getAllComments = async (pid) => {
    try {
        const q = query(collection(db, "comments"), where("pid", "==", pid));
        const querySnapshot = await getDocs(q);
        const comments = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        return comments;
    } catch (error) {
        console.error("Failed to get comments:", error);
        return false; 
    }
}

export const deleteComment = async (cid) => {
    const commentRef = doc(db, "comments", cid);
    try {
        await deleteDoc(commentRef);
        console.log("Document comment with ID: ", cid, " has been deleted.");
        return true; 
    } catch (error) {
        console.error("Error deleting comment:", error);
        return false; 
    }
}
