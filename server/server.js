var express=require('express');
var app=express();
var path=require('path');
var port=process.env.PORT || 3000;
app.use(express.static(path.join(__dirname,'../public')));

app.get('/',(req,res)=>{
  res.sendFile('index.html')
})

app.listen(port,()=>{
  console.log(`Connected on port : ${port}`);
})
