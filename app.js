var express=require('express');
var path = require("path");
var server=express();

server.use(express.static(path.join(__dirname, "public")));


 server.get('/', function(req,res){

res.sendFile(path.join(__dirname, "public", "index.html"));

 });

server.get('/about', function(req,res){
res.sendFile(path.join(__dirname, "public", "about.html"));
});
server.get('/gallery', function(req,res){
res.sendFile(path.join(__dirname, "public", "gallery.html"));
});
server.get('/contact', function(req,res){
res.sendFile(path.join(__dirname, "public", "contact.html"));
});




    server.listen(3000,function(){

  console.log("Sever is running on port 3000");

    });