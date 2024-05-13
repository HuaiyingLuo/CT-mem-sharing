import { Inter } from "next/font/google";
import Post from "../components/Post";
import { useState, useEffect } from "react";
import { useRouter } from 'next/router';

const inter = Inter({ subsets: ["latin"] });

export default function Home(props) {
  const [posts, setPosts] = useState([]);
  const router = useRouter();
  const fetchAllPosts = async () => {
    try {
      const response = await fetch("/api/all-posts", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      setPosts(data);
    }catch (err) {}
  };

  useEffect(() => {
    fetchAllPosts();
  }, [props.user]);

  //like
  const toggleLike = async (postId, liked, likes) => {
    if (!props.user) {
      router.push('/login');
      } else {
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
              setPosts(currentPost => currentPost.map(post => {
                if (post.id === postId) {
                  return {...post, liked: !liked, likeCount: likes.length + (liked ? 0 : 1)}
                }
                return post;
              }));
            }
        } catch (error) {
            console.error('Failed to toggle like:', error);
        }}
  }

  return (
    <div>
      <main>
        <section class="hero is-medium has-background-grey-lighter">
          <div class="hero-body columns is-vcentered">
          <div className="column">
              <figure>
                <img src="/home.jpg" />
              </figure>
            </div>
            <div className="column pl-6">
              <p class="title">Photo of the Month</p>
              <p class="subtitle">
                Cherry Blossom on Roosevelt Island
              </p>
              <p class="subtitle">
                @dev team
              </p> 
            </div>
          </div>
        </section>

        <section class="hero is-medium has-background-white-ter	">
          <div class="hero-body columns is-multiline is-flex">
            {posts.map((post) => (
              <div class="column is-one-third">
                <Post key={post.id} post={post} showButton={false} isPost={false} onLike={() => toggleLike(post.id, post.liked, post.likes)} liked={post.liked}/>
              </div>
            ))}
            
          </div>
        </section>
      </main>
    </div>
  );
}
