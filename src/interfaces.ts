import { WebSocket } from "ws";

export enum Teams {
    Red,
    Blue,
    Spectator,
    NoTeam,
}
export interface IPlayer {
    name: string;
    team: Teams;
    class: string;
}

export interface IGame {
    publicGameId: string;
    privateGameId: string;
    players: IPlayer[];
    wsConnections: WebSocket[];
    ctwMode: boolean;
}
export interface IWebSocketMessage {
    type: string;
    publicGameId: string;
    data: any;
}
