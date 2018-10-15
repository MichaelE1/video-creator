const express = require('express');
const app = express();
const path = require('path');
const ffmpeg = require('fluent-ffmpeg');
const fileUpload = require('express-fileupload');

app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine', 'pug');
app.use(fileUpload());

app.post('/upload', function(req, res) {
  if (Object.keys(req.files).length < 2) {
    return res.status(400).send('Make sure you select an image and sound file. No files were uploaded :(');
  }

  // the name of the input field is used to retrieve the uploaded file
  let imgFile = req.files.imgFile;
  let soundFile = req.files.soundFile;

  // store files on the server
  imgFile.mv(`./public/${imgFile.name}`, (err) => {
    if (err) {
      return res.status(500).send(err);
    }
  });

  soundFile.mv(`./public/${soundFile.name}`, async (err) => {
    if (err) {
      return res.status(500).send(err);
    }

    const createVideo = new Promise((resolve, reject) => {
      ffmpeg()
        .input(`./public/${imgFile.name}`)
        .input(`./public/${soundFile.name}`)
        .on('end', () => {
          resolve();
        })
        .save('./public/video.mp4')
    });

    await createVideo;
    res.render('video')
  });
});

app.get('/', (req, res) => {  
  res.render('index');
});

app.get('/video', (req, res) => {
  res.render('video');
});

app.listen(3000, () => {
  console.log('Running on port 3000')
});
