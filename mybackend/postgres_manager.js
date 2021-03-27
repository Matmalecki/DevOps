const { Pool } = require('pg');

const pgClient = new Pool({
    user: "postgres",
    password: "qwe123qwe",
    data: "postgres",
    host: "mypostgres",
    port: "5432",
});

pgClient.on("error", () => {
    console.log('Postgres not connected');
});

pgClient
    .query("CREATE TABLE IF NOT EXISTS books" + 
    "(ID SERIAL PRIMARY KEY, title VARCHAR(30), author VARCHAR(30))")
    .catch( (err) => {
        console.log(err);
    });

// pgClient
//     .query('INSERT INTO books (title) VALUES ($1, $2)', ["sample_book", "sample_author"])
//     .catch( (err) => {
//         console.log(err);
//     });


const getBookById = (request, response) => {
    const id = parseInt(request.params.id)
    pgClient.query('SELECT * FROM books WHERE id = $1', [id], (error, result) => {
    if (error) {
        throw error
    }
    response.status(200).json(result.rows)
    })
};

const getBooks = (request, response) => {
    pgClient.query('SELECT * FROM books', (error, result) => {
    if (error) {
        throw error
    }
    response.status(200).json(result.rows)
    })
};

const createBook = async (request, response) => {
    const { name, author } = request.body
    const result = await pgClient.query('INSERT INTO books (title, author) VALUES ($1, $2) RETURNING ID', 
        [name, author]);
    const book = {id:result.rows[0].id, name: name, author: author};
    return book;
};
  
module.exports = {
    getBookById,
    createBook,
    getBooks
  }