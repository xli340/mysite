import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

const app = express();

// middleware
app.use(bodyParser.json());
app.use(cors());

// router
app.get('/', (req, res) => {
res.send('Hello World!');
});

// start the application
const port = process.env.PORT || 3000;
app.listen(port, () => {
console.log(`Server started at http://localhost:${port}`);
});