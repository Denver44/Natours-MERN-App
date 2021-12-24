import express from "express"
import fs from 'fs'
import path from 'path'
const app = express()
const PORT = 5000;

app.use(express.json()) // This is actually the middleware which actually help us to get the data from req now the data from req will be added to the body of req and then we can get the data in req object.


const __dirname = path.resolve(path.dirname(''));
let tours = [];
tours = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`));


app.get('/api/v1/tours', (req, res) => {
    res.status(200).json({
        status: "success",
        result: tours.length,
        data: {
            tours
        }
    })
})

app.post('/api/v1/tours', (req, res) => {
    const { body } = req
    const id = tours[tours.length - 1].id + 1;
    const tour = { ...body, id }
    tours = [...tours, tour];
    fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(tours), err => {
        res.status(201).json({
            status: "created",
            data: {
                tour
            }
        })
    })
})

app.listen(PORT, () => {
    console.log(`server is started http://localhost:${PORT}`);
})


// We have to call always async functions when we are saving data under a request handler.