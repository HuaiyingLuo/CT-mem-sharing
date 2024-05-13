import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

const CommentBox = ({ post, user }) => {   
    // console.log('Comment Box post:', post);
    // console.log('Comment Box user:', user); 
    const pid = post.id;
    const router = useRouter();
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [editingId, setEditingId] = useState(null);
    const [editingText, setEditingText] = useState('');   

    // get 
    const fetchComments = async () => {
        try {
            console.log('Fetching comments for post:', pid);
            const response = await fetch(`/api/posts/${pid}/comments`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            if (!response.ok) {
                console.log(`HTTP error! status: ${response.status}`);
            }
            console.log('Comments fetched successfully:', pid);
            const data = await response.json();
            if (data) {
                const sortedComments = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                setComments(sortedComments);
            }
        } catch (error) {
            console.error("Error fetching comments:", error);
            setComments([]);
        }
    }

    useEffect(() => {   
        console.log('use effect to fetch comments:', pid);
        fetchComments();
    }, [pid]); 

    // create/post
    const postComment = async (comment) => {
        try {
            const response = await fetch(`/api/posts/${pid}/comments`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(comment),
            });
            const responseData = await response.json();
            console.log('Comment created successfully:', responseData);
            fetchComments();
            return true
        } catch (error) {  
            console.error('Failed to create comment:', error);
            return false;
        }
    }

    const hasEditPermission = (comment) => {
        if (!user) {
            return false;
        }
        return user.uid === post.uid || user.uid === comment.uid;
    }

    const onCommentSubmitted = async (event) => {
        event.preventDefault();
        let is_posted = false;
        if (!user) {
            router.push('/login');
            console.log('user not logged in');
        } else {
            const reqData = {
                pid: pid,
                content: event.target.elements[0].value,
                author: user.displayName,
                uid: user.uid,
                createdAt: Date.now(),
            };
            // if the input is empty, do not submit and return
            if (!reqData.content) {
                alert('Comment content cannot be empty');
                return;
            }
            // clear the comment box if comment is posted successfully
            is_posted = postComment(reqData);
            if (is_posted) {
                setNewComment('');
            }        
        }  
    }


    const onCommentDelete = async (comment) => {
        try {
            const response = await fetch(`/api/posts/${pid}/comments/${comment.id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const responseData = await response.json();
            console.log('Comment deleted successfully:', responseData);
            fetchComments();
        } catch (error) {
            console.error('Failed to delete comment:', error);
        }  
    }

    const startEditing = (comment) => {
        setEditingId(comment.id);
        setEditingText(comment.content);
    }; 

    const patchComment = async (comment) => {
        if (editingText !== comment.content) {
            const reqData = {
                id: comment.id,
                content: editingText,
            };
            try {
                const response = await fetch(`/api/posts/${post.id}/comments/${comment.id}`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(reqData),
                });
                const responseData = await response.json();
                console.log('Comment updated successfully:', responseData);
                fetchComments(); // Refresh comments after update
            } catch (error) {
                console.error('Failed to update comment:', error);
            }
        }
        setEditingId(null);
    };

    return (
        <div>
            <div>
                <h1 className="title is-4">Comments</h1>
            </div>
            <hr />

            <div className="media-content">
                {comments.length > 0 ? (
                    comments.map((comment) => (
                        <div key={comment.id} className="mb-5">
                            <div className="content">
                                {editingId === comment.id ? (
                                    <div className='field has-addons'>
                                        <div className='control is-expanded'>
                                            <input
                                                className="input is-info"
                                                value= {editingText}
                                                placeholder='Edit your comment...'
                                                onChange={(e) => setEditingText(e.target.value)}
                                            />
                                        </div>
                                        <div className='control'>
                                            <a className="button is-info" onClick={() => patchComment(comment)}>
                                                <span className="icon is-small">
                                                    <i className="fas fa-paper-plane"></i>
                                                </span>
                                            </a>
                                        </div>
                                    </div>
                                ) : (
                                    <div>
                                        <strong>{comment.author}</strong> 
                                        <small>  Posted {comment.createdAt ? new Date(comment.createdAt).toLocaleDateString() + ' ' + new Date(comment.createdAt).toLocaleTimeString() : "No Date"}</small>
                                        <br />
                                        <p class="has-text-black">{comment.content}</p>
                                    </div>
                                )}
                                <div className="level">
                                    <div className="level-left">
                                        {hasEditPermission(comment) && (
                                            <>
                                                <a className="level-item" onClick={() => onCommentDelete(comment)}> 
                                                    <span className="icon is-small has-text-grey"><i className="fas fa-trash"></i></span>
                                                </a>
                                                <a className="level-item" onClick={() => startEditing(comment)}>
                                                    <span className="icon is-small has-text-grey"><i className="fas fa-edit"></i></span>
                                                </a>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                            
                        </div>
                    ))
                ) : (
                    <p className="subtitle is-5">No comments yet</p>
                )}
            </div>

            <div className="media my-6">
                <div className="media-content">
                    <form onSubmit={(event) => onCommentSubmitted(event)}>
                        <div className="mb-2">
                            <h1 className="subtitle is-5">Leave Your Comment Here</h1>
                        </div>
                        <div className="field">
                            <p className="control">
                                <textarea 
                                    className="textarea" 
                                    placeholder="Add a comment..."
                                    onChange={e => setNewComment(e.target.value)}
                                    value={newComment}
                                ></textarea>
                            </p>
                        </div>
                        <nav className="field is-grouped">
                            <div className="control">
                                <button type="submit" className="button is-info">Submit</button>
                            </div>
                            <div className="control">
                                <button type="button" className="button is-light" onClick={() => setNewComment('')}>Cancel</button>
                            </div>
                        </nav>
                    </form>
                </div>
            </div>


        </div>
        
        );
    }



export default CommentBox;