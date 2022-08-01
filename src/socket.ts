import { Express } from "express";
import { Server, WebSocket, WebSocketServer } from "ws";
import { games } from "./app";
import { IWebSocketMessage } from "./interfaces";

export function startWebsocket(server: any): Server {
    let webSocketServer = new Server({ server });

    // webSocketServer.on("listening", (server: Server) => {
    //     console.log(server);
    // });

    webSocketServer.on("connection", (ws) => {
        ws.on("message", (message) => {
            let decodedMessage: IWebSocketMessage = JSON.parse(
                message.toString()
            );

            switch (decodedMessage.type) {
                case "init":
                    initialiseConnection(decodedMessage.publicGameId, ws);
                    break;
                default:
                    break;
            }
        });
    });

    return webSocketServer;
}

function initialiseConnection(publicGameId: string, ws: WebSocket) {
    let dataObject = addConnectionToGame(publicGameId, ws);

    // console.log(dataObject);

    ws.send(
        JSON.stringify({
            type: "initComplete",
            publicGameId: publicGameId,
            data: dataObject,
        })
    );

    dataObject.check ? sendTeamsToInitSocket(publicGameId, ws) : null;
}

function addConnectionToGame(publicGameId: String, connection: WebSocket) {
    let game = games.find((game) => game.publicGameId === publicGameId);
    if (game) {
        game.wsConnections.push(connection);
        return { check: true, ctwMode: game.ctwMode };
    } else {
        return { check: false };
    }
}

function sendTeamsToInitSocket(publicGameId: string, connection: WebSocket) {
    let game = games.find((game) => game.publicGameId === publicGameId);
    if (game) {
        let message: IWebSocketMessage = {
            type: "teams",
            publicGameId: game.publicGameId,
            data: game.players,
        };
        connection.send(JSON.stringify(message));
    }
}

export function sendChangesToConnections(privateId: string) {
    let game = games.find((game) => game.privateGameId === privateId);
    if (game) {
        let message: IWebSocketMessage = {
            type: "teams",
            publicGameId: game.publicGameId,
            data: game.players,
        };
        game.wsConnections.forEach((connection) => {
            connection.send(JSON.stringify(message));
        });
    }
}

export function sendEndCall(id: string) {
    let game = games.find((game) => game.privateGameId === id);
    if (game) {
        let message: IWebSocketMessage = {
            type: "end",
            publicGameId: game.publicGameId,
            data: {},
        };
        game.wsConnections.forEach((connection) => {
            connection.send(JSON.stringify(message));
        });
    }
}
