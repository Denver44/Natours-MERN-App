import express from "express"
const app = express()
const PORT = 5000;

app.get('/', (req, res) => {

    // res.status(200).send('Hello from Server Side') 
    res.status(200).json({
        message: "Hello From Server Side",
        app: "Travel Space"
    })
})

app.post('/', (req, res) => {
    res.status(200).json({
        message: "U can create at this endPoint",
        app: "Travel Space"
    })
})


app.listen(PORT, () => {
    console.log(`server is started http://localhost:${PORT}`);
})


// Here the send method we automatically se the headers for like content type text?html and same for json it will set application/json.