const express = require('express');
const router  = express.Router();
const multer  = require('multer');
const User = require('../models/user');
const cloudinary = require('cloudinary');
const cloudinaryStorage = require('multer-storage-cloudinary');
//require('dotenv').config();

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('index', { title: 'Express - Generated with IronGenerator' });
});


router.get('/models/user', (req, res, next) => {
  User.find({})
    .limit(20)
    .sort({ createdAt: -1 })
    .exec()
    .then(photo => {
      console.log(photo);
      res.render('index', { photo });
    })
    .catch(error => next(error));
});

// File upload

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_API_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = cloudinaryStorage({
  cloudinary,
  folder: '/node-file-upload-demo',
  allowedFormats: [ 'jpg', 'png' ]
  // filename: (req, file, callback) => {
  //   callback(null, file.originalname);
  // }
});

const upload = multer({ storage });

// const getFileExtension = fileName => {
//   const sections = fileName.split('.');
//   return sections.length > 1 ? sections[sections.length - 1] : null;
// };

router.post('/signup', upload.single('file'), (req, res, next) => {
  User.create({
    email: req.body.email,
    password: req.body.password,
    username: req.body.username,
    imageurl: req.file.url
  })
    .then(file => {
      console.log(file);
      res.redirect('/');
    })
    .catch(error => next(error));
});

module.exports = router;
