import express from "express"
import fs from 'fs'
import path from 'path'
const app = express()
const PORT = 5000;

const __dirname = path.resolve(path.dirname(''));
const tours = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`));


app.get('/api/v1/tours', (req, res) => {
    res.status(200).json({
        status: "success",
        result: tours.length,
        data: {
            tours
        }
    })
})


app.listen(PORT, () => {
    console.log(`server is started http://localhost:${PORT}`);
})

// Here we have creat a version for api like V1 so that in future if we create a new version so it will not do any braking changes to our client. we can still use the old version.

// The function where we get res and req object are called request Handler.

// Always use dirname and for that we have to import path module to resolve the dirname error and get the current dir path.

// They way send the response to client is mostly used in industry so use this way only to send data to client side.