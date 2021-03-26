const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const redis = require('redis');
const pool = require('./postgres_manager');

const redisClient = redis.createClient({
    host: "myredis",
    port: 6379,
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

const searchInCache =  (request, response) => {
    const id = parseInt(request.params.id);
    redisClient.get(id, (err, result) => {
        if (result) {
            console.log("Loaded from cache");
            return response.status(200).json(result);
        } else {
            console.log("loaded from db");
            return pool.getBookById(request, response);
        }
    });
};

const createWithCache = async (request, response) => {
    const createdBook = await pool.createBook(request, response);
    const book = JSON.stringify(createdBook);
    console.log(`Caching new book ${book}`);
    redisClient.set(createdBook.id, book);
    response.status(201).send(`Book added with ID: ${createdBook.id}`)
};

app.get("/search", pool.getBooks);
app.get("/search/:id", searchInCache);
app.post("/add", createWithCache);

const PORT = 5000;

app.listen(PORT, () => {
    console.log(`API listening on port ${PORT}`)
});
