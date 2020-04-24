var express=require('express');
var app=express();
var path=require('path');
var port=process.env.PORT || 3000;
var http=require('http');
var server=http.createServer(app);
var socketIO=require("socket.io");
const morgan=require('morgan');
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
   console.log('New Web Socket Connection established');
   socket.emit('message',"Welcome to the application user");
 })

server.listen(port,()=>{
  console.log(`Connected on port : ${port}`);
})
