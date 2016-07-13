var express = require('express');
var multer = require('multer');
var upload = multer({ dest: 'uploads/' });
var spawn = require('child_process').spawn;
var app = express();
app.use('/', upload.any(), function (req, res) {
    if (req.files === undefined) {
        return res.send(404);
    }
    console.log(req.files);
    var rename = spawn('mv', [
        './' + req.files[0].path,
        './' + req.files[0].path + '.jpg',
    ]);
    rename.stdout.on('data', function (data) {
        console.log("stdout: " + data);
    });
    rename.stderr.on('data', function (data) {
        console.log("stderr: " + data);
    });
    rename.on('close', function (code) {
        var dataOut = '';
        var curl = spawn('curl', [
            '--header',
            'AuthKey: 12c6ae2b1dfd16038fc2',
            '-X', 'POST',
            '--data-binary', '@./' + req.files[0].path + '.jpg',
            'https://api.pastec.io/indexes/vygfzrfgnqjwmmzzcvae/searcher'
        ]);
        curl.stdout.on('data', function (data) {
            dataOut += data;
            console.log("stdout: " + data);
        });
        curl.stderr.on('data', function (data) {
            console.log("stderr: " + data);
        });
        curl.on('close', function (code) {
            res.json(dataOut);
            console.log("child process exited with code " + code);
        });
    });
});
app.listen(9181, function () {
    console.log('server running on port 9181!');
});
