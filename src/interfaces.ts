import { WebSocket } from "ws";

export enum Teams {
    Red,
    Blue,
    Spectator,
    NoTeam,
}
export interface IUser {
    name: string;
    team: Teams;
    class: String;
}

export interface IGame {
    publicId: string;
    privateId: string;
    users: IUser[];
    connections: WebSocket[];
    ctwMode: boolean;
}

export interface IGameStartPlayer {
    name: string;
    teamName: string;
    classNumber: number;
}

export interface IWebSocketMessage {
    type: string;
    publicId: string;
    data: any;
}
