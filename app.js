import express from "express"
import fs from 'fs'
import path from 'path'
const app = express()
const PORT = 5000;

app.use(express.json())


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

app.get('/api/v1/tours/:id', (req, res) => {
    const { id } = req.params
    const tour = tours.find(el => el.id === id * 1)

    if (!tour) {
        return res.status(404).json({
            status: "fail",
            message: "Invalid Id",
        })
    }
    res.status(200).json({
        status: "success",
        data: {
            tour
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

app.patch('/api/v1/tours/:id', (req, res) => {
    const { body } = req
    const id = req.params.id

    if (id * 1 > tours.length) {
        return res.status(404).json({
            status: "fail",
            message: "Invalid Id",
        })
    }

    let updatedTour = tours.find(el => el.id === id * 1)
    let filteredTour = tours.filter((el) => el.id !== id * 1)
    updatedTour = { id: id * 1, ...body }
    tours = [...filteredTour, updatedTour];

    fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(tours), err => {
        res.status(200).json({
            status: "updated",
            data: {
                tour: updatedTour
            }
        })
    })
})

app.listen(PORT, () => {
    console.log(`server is started http://localhost:${PORT}`);
})

