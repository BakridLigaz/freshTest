var express = require('express');
var path = require('path');
var router = express.Router();

router.get('', function (req, res, next) {
    try{
        res.sendFile(path.resolve('../public/json/countriesToCities.json'));
    }catch (ex){
        next(ex);
    }
});

module.exports = router;
