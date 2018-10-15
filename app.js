const express = require('express');
const app = express();
const ffmpeg = require('fluent-ffmpeg');

app.set('view engine', 'pug');

app.get('/', (req, res) => {

  // Test creating a video
  ffmpeg()
    .input('image.png')
    .input('sound.mp3')
    .save('video.mp4')
  
  res.render('index');
});

app.listen(3000, () => {
  console.log('Running on port 3000')
})