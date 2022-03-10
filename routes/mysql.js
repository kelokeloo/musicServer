var express = require('express');
var router = express.Router();



// mysql test

router.get('/', function(req, res, next){
  

  res.render('mysql', {title: 'Mysql'})
})

module.exports = router;