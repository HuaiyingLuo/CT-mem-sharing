import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import firebaseApp from "../firebase";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

const storage = getStorage(firebaseApp);

const addPost = (props) => {
    const router = useRouter();
    const [fileName, setFileName] = useState('Choose an Image...');
    const [uploading, setupLoading] = useState(false);

    useEffect(() => {
        if (!props.user) {
        router.push('/login');
        }
    }, []);

    const postPost = async (reqData) => {
      try {
        const response = await fetch('/api/posts/my-posts', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(reqData),
        });

        const responseData = await response.json();
        console.log('Post created successfully:', responseData);
        setupLoading(false);
        router.push("/myposts");
        
      } catch (error) {
        console.error('Failed to create post:', error);
      }
    };

    const onPostSubmitted = async (event) => {
        event.preventDefault();
        setupLoading(true);
        const file = event.target.elements.resume.files[0];
        const title = event.target.elements.titleInput.value;
        const content = event.target.elements.contentInput.value;
      
        const storageRef = ref(storage, `posts/${file.name}`);
        const uploadTask = uploadBytesResumable(storageRef, file);
      
        uploadTask.on('state_changed', 
          (snapshot) => {
            // image upload progress
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log('Upload is ' + progress + '% done');
          }, 
          (error) => {
            console.error('Upload failed:', error);
            setupLoading(false);
          }, 
          () => {
            // get image URL
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              console.log('File available at', downloadURL);

              const reqData = {
                title: title,
                content: content,
                author: props.user.displayName,
                uid: props.user.uid,
                imageUrl: downloadURL,
              }

              postPost(reqData);
              
            });
          }
        );
    }
      

    return (props.user ? 
    <section class="hero is-medium has-background-white-ter	">
        <div class="hero-body columns is-vcentered">
        <div className="column is-11 is-offset-1">
            <form onSubmit={(event) => onPostSubmitted(event)} enctype="multipart/form-data"> 
                <div class="file control has-name is-medium is-boxed is-info">
                    <label class="file-label">
                        <input class="file-input" type="file" name="resume" 
                            onChange={(event) => {const file = event.target.files[0];
                            if (file) {
                                setFileName(file.name);
                            }}}/>
                        <span class="file-cta">
                            <span class="file-icon">
                                <i class="fas fa-upload"></i>
                            </span>
                            <span class="file-label">Upload an Image </span>
                        </span>
                        <span class="file-name has-text-black">{fileName}</span>
                    </label>
                </div>
                <label class="label mt-4">Title</label>
                <p class="control">
                  <input class="input m-2" type="text" name="titleInput" placeholder="Write a title"/>
                </p>
                <label class="label">Content</label>
                <p class="control">
                  <textarea class="textarea m-2" type="text" name="contentInput" placeholder="Add some description..."/>
                </p>
                {uploading && <div class="notification is-info is-light">
                  <button class="delete"></button>
                  Uploading Image...
                  </div>}
                <p class="control">
                  <button class="button is-info mt-2">Share</button>
                </p>
            </form>
        </div>
        
        </div>
    </section> : null);
};

export default addPost;