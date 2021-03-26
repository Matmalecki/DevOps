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

app.get("/search", pool.getBooks);
app.get("/search/:id", pool.getBookById);
app.post("/add", pool.createBook);

const PORT = 5000;

app.listen(PORT, () => {
    console.log(`API listening on port ${PORT}`)
});
