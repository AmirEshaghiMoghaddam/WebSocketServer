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
    // Confirm data is received from the WebHook to the WebSocketServer instance
        res.send("OK");
    // Insert code here to send data to connected clients over websocket.
    // 
    wss.clients.forEach(function each(client,index) {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(data));
            // Confirm data is sent from the WebHook to all clients connected to the WebSocketServer
            console.log("data send successfully to clients "+JSON.stringify(index));
        }
        else{
            console.log("data can not send to clients "+JSON.stringify(index));
        }
    });

});

app.listen(httpport, () => {
    console.log(`API listening at http://localhost:${httpport}`);
});
