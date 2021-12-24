import app from "./app.js"
const PORT = process.env.NODE_ENV === 'development' ? process.env.PORT : 3000;


// console.log("process.env. ", process.env);


app.listen(PORT, () => {
    console.log(`server is started http://localhost:${PORT}`);
})