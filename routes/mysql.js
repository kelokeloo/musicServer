var express = require('express');
var router = express.Router();

const mysql = require('mysql')

const conn = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'zX.8t>Dru,fBak99B',
  database: 'testdb'
})

conn.connect() 




router.get('/', function(req, res, next){
  // conn.query('select * from job', function (error, results, fields) {
  //   if (error) throw error;
  //   console.log('The result is: ', results[0].name);
  // });
    res.render('mysql', {title: 'Mysql', results: 'test'})
})

module.exports = router;