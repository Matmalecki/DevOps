import React, {useState, useEffect} from "react";
import axios from 'axios';

const Books = (props) => {
    const [posts, setPosts] = useState([]);
    useEffect(()=> {
        axios.get('api/book')
            .then(response => setPosts(response.data))
            .catch(error => console.log(error));
    },[]);

    const deletePost = (id) => {
        axios.delete(`api/book/${id}`)
            .then(response => setPosts(response.data))
            .catch(error => console.log(error));
    };

    const updatePost = (post) => {
        axios.put(`api/book/${post.id}`, 
        {id: post.id, name:post.title+"_updated", author:post.author+"_updated"})
            .catch(error => console.log(error));
    };

    return (<div> 
                {posts.map(post => (
                    <div key={post.id}>
                        {post.title}, {post.author}
                        <button onClick={() => deletePost(post.id)}>X</button>
                        <button onClick={() => updatePost(post)}>Update</button>
                    </div>
                ))}
            </div>
    );
};


export default Books;