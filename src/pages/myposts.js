import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Post from '../components/Post'; 

const MyPosts = (props) => {
    // console.log(props.user);
    const [posts, setPosts] = useState([]);

    const fetchPosts = async () => {
        try {
            const response = await fetch(`/api/${props.user.uid}`, {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
              },
            });
            //const data = await response.json();
            //setPosts(data);
            const data = await response.json();
            setPosts(data.map(post => ({
                ...post,
                liked: post.likes.includes(props.user.uid) 
            })));
          }catch (err) {}
    };

    const router = useRouter();

    useEffect(() => {
        if (!props.user) {
        router.push('/login');
        } else {
            fetchPosts();
        }
    }, [props.user, router]);

    const deletePost = async (postId) => {
        try {
            const response = await fetch(`/api/posts/${postId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const responseData = await response.json();
            console.log('Post delete successfully:', responseData);
            fetchPosts();
        } catch (error) {
            console.error('Failed to delete post:', error);
        }
    };

    //like
    const toggleLike = async (postId, liked) => {
        console.log("Toggling like for post:", postId);
        try{
            const method = liked ? 'DELETE' : 'PATCH';
            const response = await fetch(`/api/posts/${postId}/like`, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ uid: props.user.uid}),
            });
            if (response.ok) {
                fetchPosts();
            }
        } catch (error) {
            console.error('Failed to toggle like:', error);
        }
    }

    return (props.user ? 
    <section class="hero is-medium has-background-white-ter	">
        <div class="hero-body columns is-multiline is-vcentered">
        {posts.length > 0 ? (
            posts.map((post) => (
                <div class="column is-one-third">
                    <Post 
                    key={post.id} 
                    post={post} 
                    showButton={true} 
                    onDelete={() => deletePost(post.id)} 
                    onLike={() => toggleLike(post.id, post.liked)} 
                    liked={post.liked} />
                </div>
            ))
        ) : (
            <p class="title has-text-link">No Post. Go to Add your first post!</p>
        )}
        </div>
    </section> : null);
};

export default MyPosts;
