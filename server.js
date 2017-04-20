const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const fs = require('fs-extra');
const gulp = require('gulp');
const spritesmith = require('gulp.spritesmith');
const moveFile = require('./moveFile');
const getNewFolderName = require('./getNewFolderName');

const app = express();

app.set('view engine', 'pug')
app.set('port', process.env.PORT || 3000);
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(__dirname + '/tmp'));
app.use(express.static(__dirname + '/public'));

app.listen(app.get('port'), function() {
  console.log( 'Express запущен на http://localhost:' + app.get('port') + '; нажмите Ctrl+C для завершения.' );
});

app.get('/', function(req, res) {
  res.render('main');
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './tmp');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
})

var upload = multer({ storage });

app.post('/process', upload.array('pictures', 10), function(req, res) {
  const algorithm = req.body.algorithm;
  const newFilesDirName = getNewFolderName();
  const newFilesDirPath = 'tmp/' + newFilesDirName + '/';

  fs.mkdir(newFilesDirPath, (err) => {
    console.log(err);

    const filesPromises = req.files.map(file => {
      return moveFile(file.path, newFilesDirPath + file.filename);
    });

    Promise.all(filesPromises).then(() => {
      gulp.src(newFilesDirPath + '/*.png')
        .pipe(spritesmith({
          imgName: 'sprite.png',
          cssName: 'sprite.css',
          algorithm
        }))
        .pipe(gulp.dest(newFilesDirPath))
        .on('end', () => {
          res.render('process', {
            sprite: newFilesDirName + '/sprite.png'
          });
        })
    });
  });
});

// пользовательская страница 404
app.use(function(req, res) {
  res.status(404);
  res.render('404');
});

// пользовательская страница 500
// app.use(function(err, req, res, next) {
//   console.error(err.stack);
//   res.status(500);
//   res.render('500');
// });
