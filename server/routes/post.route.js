
let mongoose = require('mongoose'),
  express = require('express'),
  multer = require('multer'),
  uuidv4 = require('uuid/v4'),
  router = express.Router();

const postSchema = require('../models/Post');
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const auth = require("../middleware/auth");
const fs = require('fs');

const DIR = './public/';
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, DIR);
    },
    filename: (req, file, cb) => {
        const fileName = file.originalname.toLowerCase().split(' ').join('-');
        cb(null, uuidv4() + '-' + fileName)
    }
});
var upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
            cb(null, true);
        } else {
            cb(null, false);
            return cb(new Error('Tylko .png, .jpg and .jpeg!'));
        }
    }
});



router.route('/create-post').post(upload.single('img'), auth, (req, res, next) => {
  const url = req.protocol + '://' + req.get('host')
    const post = new postSchema({
        _id: new mongoose.Types.ObjectId(),
        title: req.body.title,
        description: req.body.description,
        img: url + '/public/' + req.file.filename,
        userId: req.user
    });

    post.save().then(result => {
      res.status(201).json({
          message: "Post created successfully!",
          postCreated: {
              _id: result._id,
              title: result.title,
              description: result.description,
              img: result.img,
              userId: result.userId
          }
      })
  }).catch(err => {
      console.log(err),
          res.status(500).json({
              error: err
          });
  })



});

router.route('/').get(auth, async (req, res) => {
  postSchema.find({userId: req.user},(error, data) => {
    if (error) {
      return next(error)
    } else {
      res.json(data)
    }
  })
})
router.route('/count').get(auth, async (req, res) => {
  postSchema.count({userId: req.user},(error, data) => {
    if (error) {
      return next(error)
    } else {
      res.json(data)
    }
  })
})

router.route('/edit-post/:id').get((req, res) => {
  postSchema.findById(req.params.id, (error, data) => {
    if (error) {
      return next(error)
    } else {
      res.json(data)
    }
  })
})


router.route('/update-post/:id').put((req, res, next) => {
  postSchema.findByIdAndUpdate(req.params.id, {
    $set: req.body
  }, (error, data) => {
    if (error) {
      return next(error);
      console.log(error)
    } else {
      res.json(data)
      console.log('Post updated successfully !')
    }
  })
})

router.route('/delete-post/:id').delete((req, res, next) => {
  postSchema.findById(req.params.id, (error, data) => {
    if (error) {
      console.log(error)
    } else {
      
      fs.unlink(data.img.substr(22,data.img.length), (err) => {
        if (err) {
          console.error(err)
        }
      
      })
      console.log("Zdjecie usuniete z serwera")
    }
  })
  //exec("del")
  postSchema.findByIdAndRemove(req.params.id, (error, data) => {
    if (error) {
      return next(error);
    } else {
      res.status(200).json({
        msg: data
      })
    }
  })
})
module.exports = router;