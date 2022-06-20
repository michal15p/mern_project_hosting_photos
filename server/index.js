let express = require('express');
let mongoose = require('mongoose');
let cors = require('cors');
let bodyParser = require('body-parser');
require("dotenv").config();
const postRoute = require('../server/routes/post.route')
const userRoute = require('../server/routes/user.route')
const tokenVerification = require('./middleware/auth')
mongoose
  .connect('mongodb://127.0.0.1:27017/mydatabase')
  .then((x) => {
    console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`)
  })
  .catch((err) => {
    console.error('Error connecting to mongo', err.reason)
  })
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(cors());
app.use('/posts', postRoute)
app.use("/users", userRoute)
app.use('/public', express.static('public'))
app.use(tokenVerification)
const port = process.env.PORT || 4000;
const server = app.listen(port, () => {
  console.log('Connected to port ' + port)
})
app.use((req, res, next) => {
  console.log("404");
});
app.use(function (err, req, res, next) {
  console.error(err.message);
  if (!err.statusCode) err.statusCode = 500;
  res.status(err.statusCode).send(err.message);
});