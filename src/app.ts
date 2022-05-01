//initalise express
import express from "express";
import { IGameStartPlayer, IGame, IUser, Teams } from "./interfaces";
import { getTeam, getCtwClass, getCtwClassFromCode } from "./utility";
import {
    sendEndCall,
    sendChangesToConnections,
    startWebsocket,
} from "./socket";
import startGame from "./requests/mc/startGame";
import setCtwMode from "./requests/mc/setCtwMode";
import endGame from "./requests/mc/endGame";
import addPlayerToTeam from "./requests/mc/addPlayerToTeam";
import removePlayerFromTeam from "./requests/mc/removePlayerFromTeam";
import classChange from "./requests/mc/classChange";
import classChangeNumber from "./requests/mc/classChangeNumber";

const app = express();
app.use("/public", express.static("./dir/public"));
app.use(express.json());

const PORT = process.env.PORT || 8080;

export const games: IGame[] = [];

app.post("/api/mc/startGame/:playerName", (req, res) => {
    let response = startGame(req.body, req.params.playerName);
    res.send(response);
});

app.post("/api/mc/setCtwMode", (req, res) => {
    let response = setCtwMode(req.body);
    res.send(response);
});

app.post("/api/mc/endGame", (req, res) => {
    let response = endGame(req.body);
    res.send(response);
});

app.post("/api/mc/addPlayerToTeam", (req, res) => {
    let response = addPlayerToTeam(req.body);
    res.send(response);
});

app.post("/api/mc/removePlayerFromTeam", (req, res) => {
    let response = removePlayerFromTeam(req.body);
    res.send(response);
});

app.post("/api/mc/classChange", (req, res) => {
    let response = classChange(req.body);
    res.send(response);
});

app.post("/api/mc/classChangeNumber", (req, res) => {
    let response = classChangeNumber(req.body);
    res.send(response);
});

app.get("/overlay/:gamePublicId", (req, res) => {
    // let websocketUrl = `${req.protocol === "http" ? "ws" : "wss"}://${req.get(
    //     "host"
    // )}`;
    // console.log(websocketUrl);
    let host = req.get("host");
    console.log(host);
    // host = host?.substring(0, host.length - PORT.toString().length - 1);
    res.cookie("gameId", req.params.gamePublicId);
    res.cookie("port", PORT);
    res.cookie("host", host);
    res.cookie("protocol", req.protocol);
    // res.cookie("websocketUrl", websocketUrl);
    res.sendFile(__dirname + "/pages/overlay.html");
});

let number = 100;

app.post("/api/mc/charCheck", (req, res) => {
    console.log("charCheck");
    console.log(req.body);

    res.send({ code: 200, privateId: number });
    number += 1;
});

let server = app.listen(PORT, () => {
    console.log("server started on port " + PORT);
});

startWebsocket(server);
