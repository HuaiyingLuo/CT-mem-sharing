import { useRouter } from "next/router";
import Link from 'next/link';

const Post = ({post, showButton, onDelete, onLike, liked, isPost}) => {
    // console.log('liked', liked);
    const router = useRouter();

    const onPostEdit = async (event) => {
        event.preventDefault();
        router.push(`/editpost/${post.id}`);
    };

    return (
        <div>
            <div className="card m-3">
                <div class="card-image">
                    <Link href={`/posts/${post.id}`}>
                        <figure class="image is-3by4">
                            {post.imageUrl ? (
                                <img src={post.imageUrl} alt="Post image" />
                            ) : (
                                <p>No Image Available</p>  
                            )}
                        </figure>
                    </Link>
                </div>
                <div className="card-content">
                    <div className="media">
                        <div className="media-content">
                            <Link href={`/posts/${post.id}`}>
                                <h2 className="title is-5">
                                    <strong>{post.title}</strong>
                                </h2>
                            </Link>
                            <p className="subtitle is-6">@{post.author}</p>
                        </div>
                    </div>
                    <div className="content">
                        {post.content}
                        <div></div>
                        <br />
                        <p>{post.createdAt ? new Date(post.createdAt).toLocaleDateString() : "No Date"}</p>
                    </div>
                </div>
                <footer className="card-footer">
                    {isPost && (
                        <a href="#" className="card-footer-item" onClick={(e) => {
                            e.preventDefault();
                            onLike(post.id);
                        }}>
                            <i className={`fas fa-heart ${liked ? 'has-text-danger' : 'has-text-grey-light'}`}></i>
                            <span className="like-count" style={{ marginLeft: '5px' }}>{post.likeCount}</span>
                        </a>
                    )}
                    {showButton && !isPost && (
                        <>
                            <button className="card-footer-item button is-link is-outlined m-1" onClick={onPostEdit}>Edit</button>
                            <button className="card-footer-item button is-danger is-outlined m-1" onClick={() => onDelete(post.id)}>Delete</button>
                        </>
                    )}
                </footer>
            </div>
        </div>
    );
};

export default Post;