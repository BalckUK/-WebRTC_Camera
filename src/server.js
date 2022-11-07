import http from "http";
import WebSocket, { WebSocketServer } from "ws";
import express from 'express';



const app = express();
const __dirname = "C:/Users/sjd/Desktop/vueproject/WebRTC/src";

app.set("view engine", "pug");
app.set("views", __dirname+"/views");

app.use("/public", express.static(__dirname + "/public"));

app.get("/", (req, res) => res.render("home"));
app.get("/*", (req, res) => res.redirect("/"));

const handleListen = () => console.log("Listening on http://localhost:3000");

const server = http.createServer(app);
const wss = new WebSocketServer({ server });

const sockets = [];

/*function handleConnection(socket){
    console.log(socket);
}

wss.on("connection", handleConnection)*/

wss.on("connection", (socket) => {
    sockets.push(socket);
    socket["nickname"]="Anonymous";
    console.log("Connected to Browser");
    socket.on("close", () => console.log("DisConnected from Browser"));
    //socket.on("message", (message) => {
    socket.on("message", (msg) => {
        //socket.send(`${message}`)
        const message = JSON.parse(msg);
        //sockets.forEach(aSocket => aSocket.send(`${message}`));
        switch(message.type){
            case "new_message":
                //sockets.forEach(aSocket => aSocket.send(`${message.payload}`));
                sockets.forEach(aSocket => aSocket.send(`${socket.nickname}: ${message.payload}`));
                break;
            case "nickname":
                socket["nickname"] = message.payload;
                break;
        }
    })
   // socket.send("hello!");
})

server.listen(3000, handleListen);

//app.listen(3000, handleListen);