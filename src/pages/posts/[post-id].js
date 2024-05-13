// This is a dynamic page for each post
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import CommentBox from '@/components/CommentBox';
import Post from '@/components/Post';

const postPage = (props) => {
    // console.log('[post-id] props:', props)
    const router = useRouter();
    const pid = router.query['post-id']
    const [post, setPost] = useState({});
    const user = props.user;

    let isPostAuthor = false;
    // detemine if the user is the author of the post 
    const postAuther = post.uid;
    if (user && postAuther === user.uid) {
        isPostAuthor = true;
    }

    // get post from the database 
    const fetchPost = async () => {
        try {
            console.log('Fetching post:', pid);
            const response = await fetch(`/api/posts/${pid}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok) {
                console.log('HTTP error! status:', response.status);
            }
            console.log('props:', props)
            console.log('Post:', pid);
            console.log('User:', user)
            const postData = await response.json();
            console.log('Post Data:', postData);
            const liked = postData.likes.includes(user.uid)
            setPost({...postData, liked});
        } catch (error) {
            console.error('Error fetching post:', error);
        }
    }

    useEffect(() => {
        console.log('use effect to fetch post:', pid);
        if (!props.user) {
            router.push('/login');
        }else{
            if (pid) {
                fetchPost();
            }
        }
    }, [pid]);

    const deletePost = async (postId) => {
        if (!isPostAuthor) {
            alert('You are not authorized to delete this post!');
            return;
        }
        try {
            const response = await fetch(`/api/posts/${postId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const responseData = await response.json();
        } catch (error) {
            console.error('Failed to delete post:', error);
        }
    };

    //like
    const toggleLike = async (postId, liked) => {
        // console.log("Toggling like for post:", postId);
        try{
            const method = liked ? 'DELETE' : 'PATCH';
            const response = await fetch(`/api/posts/${postId}/like`, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ uid: user.uid}),
            });
            if (response.ok) {
                fetchPost();
            }
        } catch (error) {
            console.error('Failed to toggle like:', error);
        }
    }

    return (
        <div className="columns">
            <div className="column is-6 my-3">
                <Post 
                    key={post.id} 
                    post={post} 
                    showButton={isPostAuthor} 
                    isPost={true}
                    onDelete={() => deletePost(post.id)} 
                    onLike={() => toggleLike(post.id, post.liked)} 
                    liked={post.liked} />
            </div>

            <div className="column is-5 my-5">
                <CommentBox post={post} user={user} />
            </div> 

            <div className="column is-1 my-5">
            </div>   
        </div>
    );
}

export default postPage;
