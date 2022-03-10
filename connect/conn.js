const mysql = require('mysql')
const cnf = require('../globalConfig')

const conn = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: cnf.mysqlPassword,
  database: cnf.datebaseName
})

conn.connect(()=>{
  console.log('成功连接数据库');
})


module.exports = conn