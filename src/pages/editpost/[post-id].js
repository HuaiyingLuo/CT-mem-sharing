import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import firebaseApp from "../../firebase";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { doc, getDoc, getFirestore } from 'firebase/firestore';

const storage = getStorage(firebaseApp);
const database = getFirestore(firebaseApp);

const EditPost = (props) => {
    const router = useRouter();
    const postid = router.query['post-id'];
    console.log(postid);
    const [post, setPost] = useState(null);
    const [fileName, setFileName] = useState('Choose an Image...');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!props.user) {
            router.push('/login');
        } else if (postid) {
            setLoading(true);
            const postRef = doc(database, "posts", postid);
            getDoc(postRef).then((docSnap) => {
                if (docSnap.exists()) {
                    setPost(docSnap.data());
                    setFileName(docSnap.data().imageUrl);
                } else {
                    console.log("No such document!");
                    router.push('/myposts');
                }
                setLoading(false);
            }).catch((error) => {
                console.error("Error getting document:", error);
                setLoading(false);
            });
        }
    }, [postid]);

    const patchPost = async (reqData) => {
        try {
            const response = await fetch('/api/posts/my-posts', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(reqData),
            });

            const responseData = await response.json();
            console.log('Post update successfully:', responseData);

        } catch (error) {
            console.error('Failed to update post:', error);
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const file = event.target.elements.resume.files[0];
        const title = event.target.elements.titleInput.value;
        const content = event.target.elements.contentInput.value;
        let imageUrl = post.imageUrl;

        if (file) {
            const storageRef = ref(storage, `posts/${file.name}`);
            const uploadTask = uploadBytesResumable(storageRef, file);
            imageUrl = await new Promise((resolve, reject) => {
                uploadTask.on('state_changed',
                    (snapshot) => {
                        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                        console.log('Upload is ' + progress + '% done');
                    }, 
                    reject,
                    () => getDownloadURL(uploadTask.snapshot.ref).then(resolve)
                );
            });
        }

        const reqData = {
            id: postid,
            title: title,
            content: content,
            imageUrl: imageUrl,
        };

        patchPost(reqData);
        router.push("/myposts");

    };
    
    if (loading) {
        return <p>Loading...</p>;
    }
    
    return (
        <section className="hero is-medium has-background-white-ter">
            <div className="hero-body columns is-vcentered">
                <div className="column is-11 is-offset-1">
                    <form onSubmit={handleSubmit} enctype="multipart/form-data">
                        <div className="file control has-name is-medium is-boxed is-primary">
                            <label className="file-label">
                                <input className="file-input" type="file" name="resume"
                                    onChange={(event) => {
                                        const file = event.target.files[0];
                                        if (file) {
                                            setFileName(file.name);
                                        }
                                    }}/>
                                <span className="file-cta">
                                    <span className="file-icon">
                                        <i className="fas fa-upload"></i>
                                    </span>
                                    <span className="file-label">Upload an Image</span>
                                </span>
                                <span className="file-name has-text-black">{fileName}</span>
                            </label>
                        </div>
                        <label className="label mt-4">Title</label>
                        <p className="control">
                            <input className="input m-2" type="text" name="titleInput" placeholder="Write a title" defaultValue={post.title} />
                        </p>
                        <label className="label">Content</label>
                        <p className="control">
                            <textarea className="textarea m-2" type="text" name="contentInput" placeholder="Add some description..." defaultValue={post.content} />
                        </p>
                        <p className="control">
                            <button className="button is-primary mt-2">Update</button>
                        </p>
                    </form>
                </div>
            </div>
        </section>
    );
};    

export default EditPost;