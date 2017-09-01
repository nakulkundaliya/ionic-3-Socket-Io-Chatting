var express = require("express");
var bodyParser = require("body-parser");
var path = require("path");
var config = require("./config");
var app = express();

var server = require("http").Server(app);
var io = require("socket.io").listen(server);
var userArray = {}
var loginUser = []
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
// module.exports.bucket = (new couchbase.Cluster(config.couchbase.server)).openBucket(config.couchbase.bucket);

app.use(express.static(path.join(__dirname, "public")));
app.use("/scripts", express.static(__dirname + "/node_modules/"));

var routes = require("./routes/routes.js")(app);
var ChatModel = require("./models/chatmodel.js");

io.on("connection", function(socket){

   // =========== New user register ====== //
   socket.on("register",function(id,callback){
     if(id in userArray){
       console.log("user exits");
       callback(false)
     } else{
       console.log("user is not exits");
       socket.userId = id;
       userArray[socket.userId] = socket;
       loginUser.push(id)
       io.sockets.emit('newUser')
       console.log("=========User array ====",loginUser)
       callback(true)
     }
   })

  // ========= Message ========= //
  socket.on("chating", function(data){
      // io.emit("chating", msg);
      console.log("====chating ====",JSON.stringify(data))
      if(data.receiverId in userArray){
        userArray[data.receiverId].emit('chating',data)
      }else{
        console.log("===User is not found in userArray")
      }
  });

  // ========== Start Typing ========== //
  socket.on('start_typing',function(data){
    console.log("==== start_typing =====",JSON.stringify(data));
    if(data.receiverId in userArray){
      userArray[data.receiverId].emit('start_typing',data)
    }else{
      console.log("===User is not found in userArray")
    }
  });

  // ========== Stop Typing ========== //
  socket.on('stop_typing',function(data){
    console.log("==== stop_typing =====",JSON.stringify(data));
    if(data.receiverId in userArray){
      userArray[data.receiverId].emit('stop_typing',data)
    }else{
      console.log("===User is not found in userArray")
    }
  });
});
app.get('/getUser',function(req, res){
  console.log("=====login user ===",loginUser)
  res.send(loginUser)
})
server.listen(3000, function () {
    console.log("Listening on port %s...", server.address().port);
});
