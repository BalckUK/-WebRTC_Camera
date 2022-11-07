import http from "http";
import SocketIO from "socket.io";
import express from 'express';
import { Http2ServerRequest } from "http2";



const app = express();
const __dirname = "C:/Users/sjd/Desktop/vueproject/WebRTC/src";
app.set("view engine", "pug");
app.set("views", __dirname+"/views");
app.use("/public", express.static(__dirname + "/public"));
app.get("/", (req, res) => res.render("home"));
app.get("/*", (req, res) => res.redirect("/"));

const handleListen = () => console.log("Listening on http://localhost:3000");
Http2ServerRequest.listen(3000, handleListen);