import { Express } from "express";
import { Server, WebSocket } from "ws";
import { games } from "./app";
import { IWebSocketMessage } from "./interfaces";

export function startWebsocket(app: any): Server {
    let webSocket = new Server({ server: app });

    webSocket.on("connection", (ws) => {
        ws.on("message", (message) => {
            let decodedMessage: IWebSocketMessage = JSON.parse(
                message.toString()
            );

            switch (decodedMessage.type) {
                case "init":
                    initialiseConnection(decodedMessage.publicId, ws);
                    break;
                default:
                    break;
            }
        });
    });

    return webSocket;
}

function initialiseConnection(publicId: string, ws: WebSocket) {
    let dataObject = addConnectionToGame(publicId, ws);

    ws.send(
        JSON.stringify({
            type: "initComplete",
            publicId: publicId,
            data: dataObject,
        })
    );
    dataObject.check ? sendTeamsToInitSocket(publicId, ws) : null;
}

function addConnectionToGame(publicId: String, connection: WebSocket) {
    let game = games.find((game) => game.publicId === publicId);
    if (game) {
        game.connections.push(connection);
        return { check: true, ctwMode: game.ctwMode };
    } else {
        return { check: false };
    }
}

function sendTeamsToInitSocket(publicId: string, connection: WebSocket) {
    let game = games.find((game) => game.publicId === publicId);
    if (game) {
        let message: IWebSocketMessage = {
            type: "teams",
            publicId: publicId,
            data: game.users,
        };
        connection.send(JSON.stringify(message));
    }
}

export function sendChangesToConnections(privateId: string) {
    let game = games.find((game) => game.privateId === privateId);
    if (game) {
        let message: IWebSocketMessage = {
            type: "teams",
            publicId: game.publicId,
            data: game.users,
        };
        game.connections.forEach((connection) => {
            connection.send(JSON.stringify(message));
        });
    }
}

export function sendEndCall(id: string) {
    let game = games.find((game) => game.privateId === id);
    if (game) {
        let message: IWebSocketMessage = {
            type: "end",
            publicId: game.publicId,
            data: {},
        };
        game.connections.forEach((connection) => {
            connection.send(JSON.stringify(message));
        });
    }
}
