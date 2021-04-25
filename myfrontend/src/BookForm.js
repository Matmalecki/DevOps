import React, {useState, useEffect} from 'react';
import axios from 'axios';

const BookForm = (props) => {

    const [title, setTitle] = useState("");
    const [author, setAuthor] = useState("");

    const handleSubmit = (event) => {
        console.log(`Dane do wyslania ${title} oraz ${author}`);

        axios.post('/api/', {name:title, author:author})
            .then(response => console.log(response))
            .catch(error => console.log(error));

        event.preventDefault();

    }

    return (
        <>
            <input type='text' value={title} onChange={event=>setTitle(event.target.value)}/> <br/>
            <input type='text' value={author} onChange={event=>setAuthor(event.target.value)}/> <br/>
            <input type='submit' value='OK' onClick={handleSubmit}/>
        </>
    );
};


export default BookForm;