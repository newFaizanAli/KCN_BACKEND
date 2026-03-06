const express = require("express");
const cors = require('cors');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use(cors({
    origin: ['http://localhost:5173'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true,
}))

app.use("/api", require("./routes"));

const port = 3000;

app.listen(port, () => {
    console.log(`app running on port ${port}`);
})

