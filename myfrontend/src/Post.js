import React, {useState, useEffect} from "react";
import axios from 'axios';

const Post = (props) => {
    const [posts, setPosts] = useState([]);
    useEffect(()=> {
        axios.get('http://localhost:5000/search')
            .then(response => setPosts(response.data))
            .catch(error => console.log(error));
    },[]);

    const deletePost = (id) => {
        axios.delete(`http://localhost:5000/book/${id}`)
            .then(response => setPosts(response.data))
            .catch(error => console.log(error));
    }

    return (<div>
                {posts.map(post => (
                    <div key={post.id}>
                        {post.title}, {post.author}
                        <button onClick={() => deletePost(post.id)}>X</button>
                    </div>
                ))}
            </div>
    );
};


export default Post;