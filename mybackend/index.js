const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const redis = require('redis');

const constants = require('./constants');
const app = express();
app.use(cors());
app.use(express.json());

const redisClient = redis.createClient({
    host: constants.redisHost,
    port: constants.redisPort
});

const pgClient = new Pool({
    user: constants.pgUser,
    password: constants.pgPassword,
    data: constants.pgData,
    host: constants.pgHost,
    port: constants.pgPort,
});

redisClient.on('connect', () => {
    console.log('Connected to redis server!');
});

redisClient.on("error", (err) => {
    console.log(err);
});

app.get("/", (req, res) => {
    res.send("Hello World!");
});

pgClient.on('connect', () => {
    console.log("Connected to postgres db!");
    pgClient
        .query("CREATE TABLE IF NOT EXISTS books" + 
        "(ID SERIAL PRIMARY KEY, title VARCHAR(30), author VARCHAR(30))")
        .catch( (err) => {
            console.log(err);
        });
});

pgClient.on("error", () => {
    console.log('Postgres not connected');
});


const getBookById = async (request, response) => {
    const id = parseInt(request.params.id)
    const result = await pgClient.query('SELECT * FROM books WHERE id = $1', [id]);
    if (result.rowCount > 0) {
        redisClient.set(result.rows[0].id, 
            JSON.stringify({id: result.rows[0].id, name:result.rows[0].title, author: result.rows[0].author}));
        response.status(200).json(result.rows);
    } else response.status(404);
};

const getBooks = async (request, response) => {
    const result = await pgClient.query('SELECT * FROM books')
    response.status(200).json(result.rows);
};

const createBook = async (request, response) => {
    const { name, author } = request.body
    const result = await pgClient.query('INSERT INTO books (title, author) VALUES ($1, $2) returning id, title, author', 
        [name, author]);
    console.log(`Caching new book with ${name} and ${author}`);
    redisClient.set(result.rows[0].id, 
        JSON.stringify({id: result.rows[0].id, name:result.rows[0].title, author: result.rows[0].author}));
    response.status(200).json(result.rows);
};

const deleteBook = async (request, response) => {
    const id = parseInt(request.params.id);
    const result = await pgClient.query('DELETE FROM books WHERE id = $1', [id]);
    redisClient.del(id);
    response.status(200);
};

const updateBook = async (request, response) => {
    const id = parseInt(request.params.id); 
    const { name, author } = request.body;
    const result = await pgClient.query('UPDATE books SET title = $1, author = $2 WHERE id = $3 returning id, title, author',  [name, author, id]);
    console.log(`Caching new book with ${name} and ${author}`);
    redisClient.set(result.rows[0].id, 
        JSON.stringify({id: result.rows[0].id, name:result.rows[0].title, author: result.rows[0].author}));
    response.status(200).json(result.rows);
};


const searchById =  async (request, response) => {
    const id = parseInt(request.params.id);
    redisClient.get(id, (err, result) => {
        if (result) {
            console.log("Loaded from cache");      
            return response.status(200).json(JSON.parse(result));
        } else {
            console.log("Loaded from db");
            return getBookById(request, response);
        }
    });
};

app.get("/book", getBooks);
app.get("/book/:id", searchById);
app.post("/", createBook);
app.delete("/book/:id", deleteBook)
app.put("/book/:id", updateBook);

const PORT = 5000;

app.listen(PORT, () => {
    console.log(`API listening on port ${PORT}`)
});
