import React, {useState, useEffect} from "react";
import axios from 'axios';

const Books = (props) => {
    const [posts, setPosts] = useState([]);
    useEffect(()=> {
        axios.get('http://localhost:5000/book')
            .then(response => setPosts(response.data))
            .catch(error => console.log(error));
    },[]);

    const deletePost = (id) => {
        axios.delete(`http://localhost:5000/book/${id}`)
            .then(response => setPosts(response.data))
            .catch(error => console.log(error));
    };

    const updatePost = (post) => {
        axios.put(`http://localhost:5000/book/${post.id}`, 
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