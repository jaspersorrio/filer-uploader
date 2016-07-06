declare var require:any;
var express = require('express');
var multer  = require('multer');
// var crypto = require('crypto');
// var mime = require('mime');
// var storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, './uploads/')
//   },
//   filename: function (req, file, cb) {
//     crypto.pseudoRandomBytes(16, function (err, raw) {
//       cb(null, raw.toString('hex') + Date.now() + '.' + mime.extension(file.mimetype));
//     });
//   }
// });
// var upload = multer({ storage: storage });
var upload = multer({ dest: 'uploads/' });
var spawn = require('child_process').spawn;

var app = express();

app.use('/', upload.any(), function(req, res){
  console.log(req.files);
  // rename files
  var rename = spawn('mv',[
    './'+req.files[0].path,
    './'+req.files[0].path+'.jpg',
  ]);


  rename.stdout.on('data', (data) => {
    console.log(`stdout: ${data}`);
  });

  rename.stderr.on('data', (data) => {
    console.log(`stderr: ${data}`);
  });

  rename.on('close', (code) => {
    // curl to internet
    var dataOut = '';
    var curl = spawn('curl', [
      '--header',
      'AuthKey: 04e35452d39e474ca120',
      '-X', 'POST',
      '--data-binary', '@./'+req.files[0].path+'.jpg',
      'https://api.pastec.io/indexes/djzatagplyaayvegejmh/searcher'
    ]);

    curl.stdout.on('data', (data) => {
      dataOut += data;
      console.log(`stdout: ${data}`);
    });

    curl.stderr.on('data', (data) => {
      console.log(`stderr: ${data}`);
    });

    curl.on('close', (code) => {
      res.json(dataOut);
      console.log(`child process exited with code ${code}`);
    });

  });


});

app.listen(9181, function(){
  console.log('server running on port 9181!');
})
