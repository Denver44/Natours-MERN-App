import app from './app.js';
import mongoose from 'mongoose';
const PORT = process.env.NODE_ENV === 'development' ? process.env.PORT : 3000;

// Connecting mongoose with our DB
const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

//   Hosted Connection
mongoose
  .connect(DB)
  .then((con) => {
    console.log(con.connection);
    console.log('Remote DB connection successful');
  })
  .catch((e) => console.log(e));

//   Local Connection
// mongoose
//   .connect(process.env.DATABASE_LOCAL)
//   .then((con) => {
//     console.log(con.connection);
//     console.log('Local DB connection successful');
//   })
//   .catch((e) => console.log(e));

app.listen(PORT, () => {
  console.log(`server is started http://localhost:${PORT}`);
});

/*
This options are for deprecation warning
    usedNewURLParser: true,
    useCreateIndex: true,
    useFindAndModify: true,

    IMPORTANT NOTE:-
useNewUrlParser, useUnifiedTopology, useFindAndModify, and useCreateIndex are no longer supported options. Mongoose 6 always behaves as if useNewUrlParser, useUnifiedTopology, and useCreateIndex are true, and useFindAndModify is false. Please remove these options from your code.

*/
