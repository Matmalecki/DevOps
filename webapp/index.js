const express = require("express");

const app = express();
const PORT = 8080;

app.get('/hello', (req, res) => {
    res.send("Hello World from server about books!");
});


app.listen(PORT, () => {
    console.log(`Api listening on port ${PORT}`);
});
