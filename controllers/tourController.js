import fs from 'fs'
import path from 'path'

const __dirname = path.resolve(path.dirname(''));

let tours = [];
tours = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`));

const findItem = (val) => tours.find(el => el.id === val * 1)

const checkId = (req, res, next, val) => {
    const tour = findItem(val)
    if (!tour) {
        return res.status(404).json({
            status: "fail",
            message: "Invalid Id",
        })
    }
    next()
}
const checkBody = (req, res, next, val) => {
    const { body } = req;
    if (!body.name || !body.price) {
        return res.status(400).json({
            status: "fail",
            message: "name or price property missing",
        })
    }
    next()
}

const getAllTours = (req, res) => {
    res.status(200).json({
        status: "success",
        requestedTime: req.requestedTime,
        result: tours.length,
        data: {
            tours
        }
    })
}
const getATour = (req, res) => {
    const { id } = req.params
    res.status(200).json({
        status: "success",
        data: {
            tour: findItem(id)
        }
    })
}

const createATour = (req, res) => {
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
}
const updateATour = (req, res) => {
    const { body } = req
    const id = req.params.id

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
}
const deleteATour = (req, res) => {
    const id = req.params.id

    let filteredTour = tours.filter((el) => el.id !== id * 1)
    tours = [...filteredTour];

    fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(tours), err => {
        res.status(204).json({
            status: "success"
        })
    })
}


export { createATour, getATour, getAllTours, deleteATour, updateATour, checkId, checkBody }