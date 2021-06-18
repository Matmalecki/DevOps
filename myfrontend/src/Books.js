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
                const newPosts = posts.filter(x => x.id !== targetId);
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
                <div className="div-table-row">
                    <div className="div-table-col"> Wyszukaj </div>
                    <input type='text' value={search} onChange={event=>setSearch(event.target.value)}/>
                </div>
                <br/>
                <div classname="div-table">
                    <div className="div-table-row">
                        <div className="div-table-col">ID</div>
                        <div className="div-table-col">Tytuł</div>
                        <div className="div-table-col">Autor</div>
                    </div>
                    {posts.filter(post => post.title.includes(search) || post.author.includes(search)).sort((x,y) => x.id > y.id)                    
                        .map(post => (
                            <div className="div-table-row" key={post.id}>
                                <div className="div-table-col">{post.id}</div>
                                <div className="div-table-col">{post.title}</div>
                                <div className="div-table-col">{post.author}</div>
                                <div className="div-table-col">
                                <button onClick={() => deletePost(post.id)}>Usuń</button>
                                <button onClick={() => setUpdatedPost(post)}>Aktualizuj</button></div>  
                            </div>
                    ))}
                </div>
                
                <br/>
                <div className="div-table-row">
                    <div className="div-table-col">Tytuł</div>
                        <div className="div-table-col">
                            <input type='text' value={title} onChange={event=>setTitle(event.target.value)}/> 
                        </div>    
                    <div className="div-table-col">Autor</div>
                        <div className="div-table-col">
                            <input type='text' value={author} onChange={event=>setAuthor(event.target.value)}/> 
                        </div>
                    <input type='submit' value='OK' onClick={handleSubmit}/>
                </div>
            </div>
    );
};


export default Books;