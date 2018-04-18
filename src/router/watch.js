var express = require('express');
var router = express.Router();
var path = require('path');

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.send('Finish this by sending a file');
});

router.get('/:watchname', function(req, res, next) {
    //res.render('index', { title: 'Express' });
    console.log("Watchname : " + req.params.watchname);
    res.set('Content-Type', 'text/html');
    fileToSend = '../purchase.html';
    console.log(fileToSend);
    res.redirect(fileToSend + '#' + req.params.watchname);
});

module.exports = router;
