const socket=io();
var para=document.querySelector('.message-box');
//GEt username and Room from the URL
const{username,room}= Qs.parse(location.search,{
  ignoreQueryPrefix:true
})
//Messge from server
socket.on('message',message=>{
  console.log(message);
  outputMessage(message);
  para.scrollTop=para.scrollHeight;
})
//Send the username and Room name back to the createServer
socket.emit('joinRoom',{username,room})
$(document).ready(()=>{

$(".message").keydown((e)=>{

  if(e.keyCode=='13'){
  socket.emit('chatMessage',$(".message").val());
  $(".message").val("");//Clearing Input Field after Sending a message
}


})
})

//Get Room Users
socket.on('roomUsers',({room,users})=>{
  outputRoomName(room);
  outputUsersName(users);
})

outputMessage=(message)=>{
  var text=$("<p></p>").text(message.text).attr('id','ping');
  var user=$("<h6></h6>").text(`Sent by ${message.username} at ${message.time}`).attr('id','user')
  $(".message-box").append(text,user);
}

function outputRoomName(room){

  $("#RoomName").html(room);
}
function outputUsersName(users) {
  for(user in users){
    console.log(user.username);
  }


}
