import { useState } from 'react';
import './App.css';
import Books from './Books.js'
import BookForm from './BookForm.js'

function App() {
  return (
    <div>
      <Books/>
      <BookForm/>
    </div>
  );
}

export default App;
