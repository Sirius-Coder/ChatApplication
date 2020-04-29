var express=require('express');
var app=express();
var path=require('path');
var port=process.env.PORT || 3000;
var http=require('http');
var server=http.createServer(app);
var socketIO=require("socket.io");
const morgan=require('morgan');
const formatMessage=require('../utils/message.js')
const {userJoin,getCurrentUser,userLeave,getRoomUsers}=require('../utils/users.js')
app.use(express.static(path.join(__dirname,'../public')));
app.use(morgan("dev"));
const io=socketIO(server);
app.get('/',(req,res)=>{
  res.sendFile('index.html')
})
app.get('/chatroom',(req,res)=>{
  res.sendFile('chatroom.html',{root:path.join(__dirname,'../public')})
})
 io.on('connection',(socket)=>{
   socket.on("joinRoom",({username,room})=>{
     const user=userJoin(socket.id,username,room);
     socket.join(user.room);
     //Broadcast the message that a new user has joined
    socket.broadcast.to(user.room).emit('message',formatMessage('chatbot',`${user.username} has joined the chat`))
  //Welcome the user
     socket.emit('message',formatMessage('chatbot',`Welcome to RGIPT ChatBot ${user.username}`));
    console.log( getRoomUsers(user.room));
//Send the room and users to frontend
io.to(user.room).emit('roomUsers',{
  room:user.room,
  users:getRoomUsers(user.room)
})
   })

   //Listen For Chat Message
   socket.on('chatMessage',msg=>{
     const user=getCurrentUser(socket.id)
     io.to(user.room).emit('message',formatMessage(user.username,msg));
   })
   //Listen when the client has disconnected
   socket.on('disconnect',()=>{
     const user=userLeave(socket.id)
     if(user){
      io.to(user.room).emit('message',formatMessage('chatbot',`${user.username} has left the chat`))

     //Send the room and users to frontend
     io.to(user.room).emit('roomUsers',{
       room:user.room,
       users:getRoomUsers(user.room)
     })
}
   })
 })

server.listen(port,()=>{
  console.log(`Connected on port : ${port}`);
})
