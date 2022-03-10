const { addUser } = require('../src/mysql')

console.log(Date.now());

addUser({
  idUser: 0, 
  phone: 12345678919, 
  username: 'agi11', 
  password: '123456', 
  createdTime: 123456
})
.then((data)=>{
  console.log('insert data is ', data);
})
.catch(reason=>{
  console.log('reason', reason);
})


module.exports = {}