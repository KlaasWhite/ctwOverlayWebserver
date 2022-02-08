import { WebSocketServer, Server, WebSocket} from 'ws';
import {games} from './app';
import { IWebSocketMessage } from './interfaces';


export function startWebsocket(): Server{
    let webSocket = new WebSocketServer({
        port: 8090,
    })

    webSocket.on('connection', (ws) => {
        ws.on('message', (message) => {
            let decodedMessage = JSON.parse(message.toString());
            
            switch(decodedMessage.type){
                case "init":
                    let check = addConnectionToGame(decodedMessage.id, ws)
                    ws.send(JSON.stringify({
                        type: "initComplete",
                        id: decodedMessage.id,
                        data: check
                    }));
                    check ? sendTeamsToSocket(decodedMessage.id, ws) : null;
                    break;
                case "message":
                    break;
                default:
                    break;
            }
        })
    })

    return webSocket;
}

function addConnectionToGame(id: String, connection: WebSocket):boolean{
    let game = games.find(game => game.id === id);
    if(game){
        game.connections.push(connection);
        return true;
    } else {
        return false;
    }
}

function sendTeamsToSocket(id: string, connection:WebSocket){
    let game = games.find(game => game.id === id);
    if(game){
        let message:IWebSocketMessage = {
            type: "teams",
            id: id,
            data: game.users
        }
        connection.send(JSON.stringify(message));
    }
}

export function sendTeamsToSockets(id: string){
    let game = games.find(game => game.id === id);
    if(game){
        let message:IWebSocketMessage = {
            type: "teams",
            id: id,
            data: game.users
        }
        game.connections.forEach(connection => {
            connection.send(JSON.stringify(message));
        })
    }
}

export function sendEndCall(id: string){
    let game = games.find(game => game.id === id);
    if(game){
        let message:IWebSocketMessage = {
            type: "end",
            id: id,
            data: {}
        }
        game.connections.forEach(connection => {
            connection.send(JSON.stringify(message));
        })
    }
}