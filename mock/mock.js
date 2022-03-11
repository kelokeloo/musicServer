const { DATE } = require('mysql/lib/protocol/constants/types');
const { addUser, tableIncludes, addMusic, addSubscribe ,addMusicToMyLike, addCommentInMusic, addAlbum,addSubCommentInMusic, addPublish, addConmentInMoment, addMusicInAlbum, addAlbumToMyLike} = require('../api/mysql/addItem')

console.log(Date.now());


addUser({
  phone: 12345678922, 
  username: 'agis2', 
  password: '123456', 
  createdTime: String(Date.now()),
  imgUrl: 'imgUrl'
})
.then((data)=>{
  console.log(data);
})
.catch(reason=>{
  console.log(reason);
})

// addMusic({
//   name: '啊li', 
//   type: '摇滚', 
//   singer: 'fasd', 
//   lyricWriter: 'fasd', 
//   composer: 'fasd', 
//   createdTime: String(Date.now()), 
//   sourceName: 'xx', 
//   imgUrl: '/ss/ss'
// })
// .then(data=>{
//   console.log('addmusic', data);
// })
// .catch(reason=>{
//   console.log('addmusicerror', reason);
// })

addSubscribe(1, 2)
.then(data=>{
  console.log(data);
})
.catch(reason=>{
  console.log(reason);
})

addMusicToMyLike(1, 3)
.then(data=>{
  console.log(data);
})
.catch(reason=>{
  console.log(reason);
})

addCommentInMusic({
  Music_idMusic: 1,
  User_idUser: 2,
  message: '这首歌好好听！',
  favourCount: 520,
  createdTime: String(Date.now())
})
.then(data=>{
  console.log(data);
})
.catch(reason=>{
  console.log(reason);
})

addSubCommentInMusic({
  Comment_idComment: 1, 
  Comment_Music_idMusic: 1, 
  Comment_User_idUser: 2,
  User_idUser: 1, 
  message: '你说得对', 
  favourCount: 100, 
  createdTime: String(Date.now())
})
.then(data=>{
  console.log(data);
})
.catch(reason=>{
  console.log(reason);
})

addPublish({
  User_idUser: 1, 
  title: '今天', 
  message: '吃了啥', 
  createdTime: String(Date.now()), 
  favourCount: 10, 
  idmusic: 2
})
.then(data=>{
  console.log(data);
})
.catch(reason=>{
  console.log(reason);
})


addConmentInMoment({
  Moments_idMoments: 1, 
  Moments_User_idUser: 1, 
  message: '好赞', 
  createdTime: String(Date.now()), 
  MomentConmentcol: ''
})
.then(data=>{
  console.log(data);
})
.catch(reason=>{
  console.log(reason);
})

addAlbum({
 User_idUser: 1, 
 shareCount: 20, 
 createdTime: Date.now(), 
 imgUrl: '/go'
})
.then((data)=>{
  console.log(data);
})
.catch(reason=>{
  console.log(reason);
})

addMusicInAlbum({
  Album_idAlbum: 1, 
  Album_User_idUser: 1, 
  Music_idMusic: 3
})
.then(data=>{
  console.log(data);
})
.catch(reason=>{
  console.log(reason);
})

addAlbumToMyLike({
  Album_idAlbum: 1, 
  Album_User_idUser: 1, 
  User_idUser: 2
})
.then(data=>{
  console.log(data);
})
.catch(reason=>{
  console.log(reason);
})

module.exports = {}