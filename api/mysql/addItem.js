const conn = require('../../connect/conn')

/**
 * 判断某个表中，某个属性的属性值是否已经存在
 * @param {string} table
 * @param {string} attr
 * @param {any} values 
 * @returns {Promise<boolean>} 存在为true，不存在为false 
 */

function tableIncludes(table, attr, values){
  let sql = ''
  if(typeof values === 'number'){
    sql = `SELECT * FROM ${table} WHERE ${attr}=` + values
  }
  else {
    sql = `SELECT * FROM ${table} WHERE ${attr}='${values}'`
  }
  return new Promise((resolve, reject)=>{
    conn.query(sql, function(err, results, fields){
      if(err) {reject({code: 3, msg: err.message}); return;}
      if(results.length !== 0){
        reject(true)
      }
      else{
        resolve(false)
      }
    })
  })
}

/**
 * 获取某个表中，某个属性的最大属性值
 * @param {string} table 
 * @param {string} attr 
 * @returns {Promise<value: any>} 某个属性的最大值
 */
function tableAttrMax(table, attr){
  const sql = `SELECT MAX(${attr}) FROM ${table}`
  return new Promise((resolve, reject)=>{
    conn.query(sql, function(err, results, fields){
      if(err){
        reject('查找数据库表失败')
        return
      }
      resolve(results)
    })
  })
  .then(rows=>{
    return rows[0][`MAX(${attr})`]
  })
}

/**
 * 向某个表中插入一条数据(插入前请检查是否冲突)
 * @param {string} table 
 * @param {obj} payload
 * @returns {Promise<{code: 0|1, msg: string}>} 
 */
function addItemIntoTable(table, payload){
  return new Promise((resolve, reject)=>{
    conn.query(`INSERT INTO ${table} SET  ?`, payload, function(err, results, fields){
      if(err){
        reject({code: 3, msg: err.message})
        return
      }
      resolve({code: 0, msg: '插入数据成功'})
    })
  })
}







/**
 * 向数据库添加一条用户信息
 * @param {{phone: number, username: string, password: string, createdTime: number, imgUrl: string}} options 
 * @returns {Promise<{code: 0|1|2, msg: string}>} 0表示成功，1， 2表示错误，msg指示成功或者错误的信息
 */

function addUser(options){
  const {idUser, phone, username, password, createdTime, imgUrl} = options
  const sql = `INSERT INTO User SET  ?`
  const searchUserTable = 'SELECT MAX(idUser) FROM User' 
  const searchPhoneSql = `SELECT * FROM User WHERE phone=` + phone
  const searchUsernameSql = `SELECT * FROM User WHERE username='${username}'`

  // 判断电话号码是否存在
  const PhonePromise = new Promise((resolve, reject)=>{
    tableIncludes('User', 'phone', phone)
    .then(()=>{
      resolve({code: 0, msg: '电话号码未被使用'})
    })
    .catch(()=>{
      reject({code: 1, msg: '电话号码已经存在'})
    })
  })

  // 判断用户名是否已经存在
  const UsernamePromise = new Promise((resolve, reject)=>{
    tableIncludes('User', 'username', username)
    .then(()=>{
      resolve({code: 0, msg: '用户名未被使用'})
    })
    .catch(()=>{
      reject({code: 1, msg: '用户名已经存在'})
    })
  })

  return Promise.all([PhonePromise, UsernamePromise])
  .then(datas=>{
    return tableAttrMax('User', 'idUser')
    .then(maxId=>{
      console.log('maxId', maxId);
      let insertObj = {
        idUser: maxId + 1,
        ...options
      }
      return addItemIntoTable('User', insertObj)
    })
  })
}

/**
 * 添加音乐
 * @param {{name: string, type: string, singer: string, lyricWriter: string, composer: string, createdTime: number, sourceName: string, imgUrl: string}} options
 * @returns {Promise<{code: 0 | 1, msg: string}>} 0表示成功，其他表示错误，msg指示成功或者错误的信息
 * 
 */
function addMusic(options){
  return tableAttrMax('Music', 'idMusic')
  .then(maxId=>{
    let insertItem = {
      idMusic: maxId + 1,
      ...options
    }
    return addItemIntoTable('Music', insertItem)
  })
}

/**
 * 订阅
 * @param {number} myId
 * @param {number} otherId
 * @returns {Promise<{code: 0 | 1, msg: string}>} 订阅是否成功
 */
function addSubscribe(myId, otherId){
  return addItemIntoTable('subscribe', {User_idUser: myId, User_idUser1: otherId})
  .then(res=>{
    if(res.code === 0){
      return {code: 0, msg: '关注成功'}
    }
    else {
      return {code: 2, msg: '关注失败'}
    }
  })
  .catch((reason)=>{
    return Promise.reject({code: 1, msg: '已经关注了'})
  })
}


/**
 * 交朋友
 * @param {number} myId
 * @param {number} otherId
 * @returns {Promise<{code: 0 | 1, msg: string}>} 添加好友是否成功
 */
 function addFriends(myId, otherId){
  return addItemIntoTable('Friends', {User_idUser: myId, User_idUser1: otherId})
  .then(res=>{
    if(res.code === 0){
      return {code: 0, msg: '添加好友成功'}
    }
    else {
      return {code: 2, msg: '添加失败'}
    }
  })
  .catch(err=>{
    return Promise.reject({code: 1, msg: '已经是好友了'})
  })
}

/**
 * 添加音乐到我的喜欢
 * @param {number} userId
 * @param {number} musicId
 * @returns {Promise<{code: 0 | 1, msg: string}>} 添加是否成功
 */
 function addMusicToMyLike(userId, musicId){
  return addItemIntoTable('UserLikeMusic', {Music_idMusic: musicId, User_idUser: userId})
  .then(res=>{
    if(res.code === 0){
      return {code: 0, msg: '添加成功'}
    }
    else {
      return {code: 2, msg: '添加失败'}
    }
  })
  .catch(err=>{
    return Promise.reject({code: 1, msg: '已在喜欢列表了'})
  })
}


/**
 * 给音乐添加评论
 * @param {{Music_idMusic: number, User_idUser: number, message: string, favourCount: number, createdTime: string}} options
 * @returns {Promise<{code: 0 | 1, msg: string}>} 评论是否成功
 */
 function addCommentInMusic(options){

  return tableAttrMax('Comment', 'idComment')
  .then(maxId=>{
    let insertItem = {
      idComment: maxId + 1,
      ...options
    }
    return addItemIntoTable('Comment', insertItem)
  })
  .then(res=>{
    if(res.code === 0){
      return {code: 0, msg: '评论成功'}
    }
  })
  .catch((reason)=>{
    return Promise.reject({code: 2, msg: '评论失败'})
  })
  
}



/**
 * 给音乐添加子评论
 * @param {{Comment_idComment: number, Comment_Music_idMusic: number, Comment_User_idUser: number, User_idUser: number, message: string, favourCount: number, createdTime: string}} options
 * @returns {Promise<{code: 0 | 1, msg: string}>} 评论是否成功
 */
 function addSubCommentInMusic(options){

  return tableAttrMax('SubComment', 'idSubComment')
  .then(maxId=>{
    let insertItem = {
      idSubComment: maxId + 1,
      ...options
    }
    return addItemIntoTable('SubComment', insertItem)
  })
  .then(res=>{
    if(res.code === 0){
      return {code: 0, msg: '添加子评论成功'}
    }
  })
  .catch((reason)=>{
    return Promise.reject({code: 2, msg: '添加子评论失败'})
  })
}




/**
 * 发布动态
 * @param {{User_idUser: number, title: string, message: string, createdTime: string, favourCount: number, idmusic: number}} options
 * @returns {Promise<{code: 0 | 1, msg: string}>} 发布动态是否成功
 */
 function addPublish(options){
  return tableAttrMax('Moments', 'idMoments')
  .then(maxId=>{
    let insertItem = {
      idMoments: maxId + 1,
      ...options
    }
    return addItemIntoTable('Moments', insertItem)
  })
  .then(res=>{
    if(res.code === 0){
      return {code: 0, msg: '发布成功'}
    }
  })
  .catch((reason)=>{
    return Promise.reject({code: 2, msg: '发布失败'})
  })
}


/**
 * 发布动态的评论
 * @param {{Moments_idMoments: number, Moments_User_idUser: number, message: string, createdTime: string}} options
 * @returns {Promise<{code: 0 | 1, msg: string}>} 发布动态评论是否成功
 */
 function addConmentInMoment(options){
  return tableAttrMax('MomentConment', 'idMomentConment')
  .then(maxId=>{
    let insertItem = {
      idMomentConment: maxId + 1,
      ...options
    }
    return addItemIntoTable('MomentConment', insertItem)
  })
  .then(res=>{
    if(res.code === 0){
      return {code: 0, msg: '评论成功'}
    }
  })
  .catch((reason)=>{
    return Promise.reject({code: 2, msg: '评论失败'})
  })
}

/**
 * 创建专辑
 * @param {{User_idUser: number, shareCount: number, createdTime: string, imgUrl: string}} options
 * @returns {Promise<{code: 0 | 1, msg: string}>} 创建专辑是否成功
 */
 function addAlbum(options){
  return tableAttrMax('Album', 'idAlbum')
  .then(maxId=>{
    let insertItem = {
      idAlbum: maxId + 1,
      ...options
    }
    return addItemIntoTable('Album', insertItem)
  })
  .then(res=>{
    if(res.code === 0){
      return {code: 0, msg: '创建专辑成功'}
    }
  })
  .catch((reason)=>{
    return Promise.reject({code: 2, msg: '创建专辑成功失败'})
  })
}

/**
 * 添加音乐到专辑
 * @param {{Album_idAlbum: number, Album_User_idUser: number, Music_idMusic: number}} options
 * @returns {Promise<{code: 0 | 1, msg: string}>} 添加音乐到专辑是否成功
 */
 function addMusicInAlbum(options){
  return addItemIntoTable('Album_has_Music', options)
  .then(res=>{
    if(res.code === 0){
      return {code: 0, msg: '成功添加音乐到专辑'}
    }
    else {
      return {code: 2, msg: '失败添加音乐到专辑'}
    }
  })
  .catch(reason=>{
    return Promise.reject({code: 1, msg: '音乐已经在专辑中'})
  })
}


/**
 * 用户收藏专辑
 * @param {{Album_idAlbum: number, Album_User_idUser: number, User_idUser: number}} options
 * @returns {Promise<{code: 0 | 1, msg: string}>} 收藏专辑是否成功
 */
 function addAlbumToMyLike(options){
  return addItemIntoTable('UserLikeAlbum', options)
  .then(res=>{
    if(res.code === 0){
      return {code: 0, msg: '成功收藏专辑'}
    }
    else {
      return {code: 1, msg: '专辑已经被收藏'}
    }
  })
  .catch(reason=>{
    return Promise.reject({code: 1, msg: '专辑已经在我的喜欢列表中'})
  })
}





module.exports = {
  addUser,
  tableIncludes,
  addMusic,
  addSubscribe,
  addFriends,
  addMusicToMyLike,
  addCommentInMusic,
  addSubCommentInMusic,
  addPublish,
  addConmentInMoment,
  addAlbum,
  addMusicInAlbum,
  addAlbumToMyLike
}
