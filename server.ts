import {send} from "process";
import { WebSocketServer, WebSocket } from "ws";
const express = require("express");
const bodyParser = require("./node_modules/body-parser");

const app = express();
const httpport = 8081;
const wsport = 8080;

const wss = new WebSocketServer({ port: wsport });
const clients = new Set();
console.log("Running WebSocket server on port", wsport);

wss.on("connection", function connection(ws) {
    clients.add(ws);

    ws.on("message", function message(data, isBinary) {
        console.log("received: %s", data);
        wss.clients.forEach(function each(client) {
            if (client.readyState === WebSocket.OPEN) {
                client.send(data, { binary: isBinary });
            }
        });
    });
});

app.use(bodyParser.json({ "Content-Type": "application/*+json" }));
app.use(bodyParser.urlencoded({ extended: false }));
app.get("/", (req, res) => {
    res.send("Hello world");
});

app.post("/message", (req, res) => {
    const data = req.body;
    console.log(data);
    // 
    res.send("OK");
    // Insert code here to send data to connected clients over websocket.
});

app.listen(httpport, () => {
    console.log(`API listening at http://localhost:${httpport}`);
});
