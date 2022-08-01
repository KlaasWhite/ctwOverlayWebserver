//initalise express
import express from "express";
import { IGame } from "./interfaces";
import {
    sendEndCall,
    sendChangesToConnections,
    startWebsocket,
} from "./socket";

import {
    CtwOverlayRemoveTeamRequest,
    CtwOverlayResetOverlayRequest,
    CtwOverlayResetPlayerTeamRequest,
    CtwOverlaySetPlayerClassRequest,
    CtwOverlaySetPlayerTeamRequest,
    CtwOverlayStartOverlayRequest,
    CtwOverlayStopOverlayRequest,
} from "./classes/mc";
import resetOverlay from "./requests/mc/resetOverlay";
import stopOverlay from "./requests/mc/stopOverlay";
import removeTeam from "./requests/mc/removeTeam";
import setPlayerClass from "./requests/mc/setPlayerClass";
import setPlayerTeam from "./requests/mc/setPlayerTeam";
import startOverlay from "./requests/mc/startOverlay";
import resetPlayerTeam from "./requests/mc/resetPlayerTeam";

const app = express();
app.use("/public", express.static("./dir/public"));
app.use(express.json());

const PORT = process.env.PORT || 8080;

export const games: IGame[] = [];

app.post("/api/mc/removeTeam", (req, res) => {
    let response = removeTeam(req.body as CtwOverlayRemoveTeamRequest);
    res.send(response);
});

app.post("/api/mc/resetPlayerTeam", (req, res) => {
    let response = resetPlayerTeam(
        req.body as CtwOverlayResetPlayerTeamRequest
    );
    res.send(response);
});

app.post("/api/mc/resetOverlay", (req, res) => {
    let response = resetOverlay(req.body as CtwOverlayResetOverlayRequest);
    res.statusCode = response.code;
    res.send(response);
});

app.post("/api/mc/resetPlayerTeam", (req, res) => {
    let response = resetPlayerTeam(
        req.body as CtwOverlayResetPlayerTeamRequest
    );
    res.statusCode = response.code;
    res.send(response);
});

app.post("/api/mc/setPlayerClass", (req, res) => {
    let response = setPlayerClass(req.body as CtwOverlaySetPlayerClassRequest);
    res.statusCode = response.code;
    res.send(response);
});

app.post("/api/mc/setPlayerTeam", (req, res) => {
    let response = setPlayerTeam(req.body as CtwOverlaySetPlayerTeamRequest);
    res.statusCode = response.code;
    res.send(response);
});

app.post("/api/mc/startOverlay", (req, res) => {
    let response = startOverlay(req.body as CtwOverlayStartOverlayRequest);
    res.statusCode = response.code;
    res.send(response);
});

app.post("/api/mc/stopOverlay", (req, res) => {
    let response = stopOverlay(req.body as CtwOverlayStopOverlayRequest);
    res.statusCode = response.code;
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
    // res.cookie("port", PORT);
    // res.cookie("host", host);
    // res.cookie("protocol", req.protocol);
    // res.cookie("websocketUrl", websocketUrl);
    res.sendFile(__dirname + "/pages/overlay.html");
});

let server = app.listen(PORT, () => {
    console.log("server started on port " + PORT);
});

startWebsocket(server);
