import {  WebSocket} from 'ws';

export enum Teams {
    Red,
    Blue,
    Spectator,
    NoTeam
}
export interface IUser {
    name: string,
    team: Teams,
    class: String
}

export interface IGame {
    id: string,
    users: IUser[],
    connections: WebSocket[]
}

export interface IGameStartPlayer {
    name: string,
    teamName: string, 
    className: string
}

export interface IWebSocketMessage{
    type: string,
    id: string, 
    data: any
}