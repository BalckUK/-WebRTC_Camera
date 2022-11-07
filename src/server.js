import http from "http";
import { Server } from "socket.io";
import express from "express";


const app = express();
const __dirname = "C:/Users/sjd/Desktop/vueproject/WebRTC_Camera/src";
app.set("view engine", "pug");
app.set("views", __dirname+"/views");
app.use("/public", express.static(__dirname + "/public"));
app.get("/", (req, res) => res.render("home"));
app.get("/*", (req, res) => res.redirect("/"));

const httpServer = http.createServer(app);
const wsSever = new Server(httpServer);

wsSever.on("connection", (socket) => {
    socket.on("join_room", (roomName, done) => {
        socket.join(roomName);
        done();
    });
});

const handleListen = () => console.log("Listening on http://localhost:3000");
httpServer.listen(3000, handleListen);