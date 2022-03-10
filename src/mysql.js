const conn = require('../connect/conn')

// 添加用户
function addUser(options){
  const {idUser, phone, username, password, createdTime} = options
  const sql = `INSERT INTO User SET  ?`
  const searchUserTable = 'SELECT * FROM User' 
  const searchPhoneSql = `SELECT * FROM User WHERE phone=` + phone
  const searchUsernameSql = `SELECT * FROM User WHERE username='${username}'`

  // 判断电话号码是否存在
  const PhonePromise = new Promise((resolve, reject)=>{
    conn.query(searchPhoneSql, function(err, rows, fields){
      if(err) {reject(err.message); return ;}
      else {
        if(rows.length !== 0){
          reject({code: 1, msg: '电话号码已经存在'})
        }
        else{
          resolve({code: 0, msg: '电话号码可用'})
        }
      }
    })
  })
  // 判断用户名是否已经存在
  const UsernamePromise = new Promise((resolve, reject)=>{
    conn.query(searchUsernameSql, function(err, rows, fields){
      if(err) {reject(err.message); return ;}
      else {
        if(rows.length !== 0){
          reject({code: 2, msg: '用户名已经存在'})
        }
        else{
          resolve({code: 0, msg: '用户名可用'})
        }
      }
    })
  })

  return Promise.all([PhonePromise, UsernamePromise])
  .then(datas=>{
    // conn.query(searchUserTable, function(err, rows, fields)=>{
    //   if(err) {

    //   }
    // })


    console.log(datas);
    return '插入数据占位'
  })
}

module.exports = {
  addUser
}
