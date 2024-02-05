const express = require("express");
const app = express();
const http = require("http");
const cors = require("cors");
const {Server} = require("socket.io");

app.use(cors());
PORT = 4000;

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"],
    },
});

io.on("connection", ( socket ) => {
    console.log(`user connected : ${socket.id}`);
    
    socket.on("send-message", ( message ) => {
        // console.log("message :", message);
        io.emit("received-message",message);
    })
    
    socket.on("disconnect", ()=>{
        console.log(`user disconnect : ${socket.id}`);
    });
});

server.listen(PORT,()=>{
    console.log("server listening on on port",PORT);
});
