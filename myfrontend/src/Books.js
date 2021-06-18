import React, {useState, useEffect} from "react";
import axios from 'axios';

const Books = (props) => {
    const [posts, setPosts] = useState([]);
    const [id, setId] = useState(null);
    const [title, setTitle] = useState(props.title);
    const [author, setAuthor] = useState(props.author);
    const [search, setSearch] = useState("");
    
    useEffect(() => {
        axios.get('api/book')
            .then(response => setPosts(response.data))
            .catch(error => console.log(error));
    },[]);

    const deletePost = (targetId) => {
        axios.delete(`api/book/${targetId}`)
            .then(response => {
                const newPosts = posts.filter(x => x.id === targetId);
                setPosts(newPosts);
                console.log(response);
            })   
            .catch(error => console.log(error));
    };


    const handleSubmit = (event) => {
        console.log(`Dane do wyslania ${title} oraz ${author}`);
        const newBook = {name:title, author:author};
        if (id != null)
        {
            axios.put(`api/book/${id}`, newBook)
                .then(response => {
                    const newList = posts.map(x => {
                            if (x.id !== id) return x; 
                            else return response.data[0];
                        }  
                    );
                    setPosts(newList);            
                    console.log(response.data);
                })   
                .catch(error => console.log(error));
        } else {
            axios.post('api/', newBook)
                .then(response => {
                    setPosts([...posts, response.data[0]]);
                    console.log(response.data);
                })    
                .catch(error => console.log(error)); 
        }
        setAuthor("");
        setId(null);
        setTitle("");
        event.preventDefault();
    }

    const setUpdatedPost = (post) => {
      setAuthor(post.author);
      setTitle(post.title);
      setId(post.id);  
    };

    return (<div> 
                <input type='text' value={id} disabled={true}/> 
                <div>
                    <p>Tytuł</p>
                    <input type='text' value={title} onChange={event=>setTitle(event.target.value)}/> 
                </div>
                <div>
                    <p>Autor</p>
                    <input type='text' value={author} onChange={event=>setAuthor(event.target.value)}/> 
                </div>
                <input type='submit' value='OK' onClick={handleSubmit}/>
                {posts.filter(post => post.title.includes(search) || post.author.includes(search))
                    .map(post => (
                        <div key={post.id}>
                            {post.title}, {post.author}
                            <button onClick={() => deletePost(post.id)}>X</button>
                            <button onClick={() => setUpdatedPost(post)}>Update</button>
                        </div>
                ))}
                <p>Wyszukaj</p>
                <input type='text' value={search} onChange={event=>setSearch(event.target.value)}/>
            </div>
    );
};


export default Books;