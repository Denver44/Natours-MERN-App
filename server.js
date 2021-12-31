import app from './app.js';
import mongoose from 'mongoose';
const PORT = process.env.NODE_ENV === 'development' ? process.env.PORT : 3000;

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB)
  .then((con) => {
    console.log('Remote DB connection successful');
  })
  .catch((e) => console.log(e));

app.listen(PORT, () => {
  console.log(`server is started http://localhost:${PORT}`);
});
